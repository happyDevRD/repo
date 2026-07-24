import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, from, map, Observable, of, switchMap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InsideSoapResponse } from '../../models/inside';
import { ExpedienteApiService } from '../expediente/expediente-api.service';
import { TareaTramiteExpedienteApiService } from '../tarea-tramite/tarea-tramite-expediente-api.service';
import { RdDocumentoApiService } from '../documento/rd-documento-api.service';
import { TareaTramiteExpporExpedi, VerMetadatos } from '../../models/expediente-domain.model';
import {
  AtributoExpedienteDto,
  IndiceEniDto,
  InsideEniXmlBase64Dto,
  InsideIflowContext,
  InsideMapperOptions,
  InsidePreparacionEnvio,
  InsideTareaDocumentoContext,
} from './inside-iflow.context.models';
import {
  filtrarTareasConDocumento,
  filtrarTareasFinalizadasConDocumento,
  mapExpedienteToConvertirExpedienteConMAdicionalesRequest,
  mapTareaToAltaDocumentoRequest,
  mapTareaToConvertirDocumentoConMAdicionalesRequest,
  mapTareaToConvertirDocumentoRequest,
  resolverOrganoDesdeExpediente,
} from './inside-iflow.mapper';
import { InsideService } from './inside.service';
import { InsideSoapClient } from './inside-soap.client';
import { InsidePrepareApiService } from './inside-prepare-api.service';
import { validarExpedienteParaInside } from './inside-validation.helper';

@Injectable({
  providedIn: 'root',
})
export class InsideExpedienteOrchestrator {
  private readonly http = inject(HttpClient);
  private readonly expedienteApi = inject(ExpedienteApiService);
  private readonly tareaTramiteApi = inject(TareaTramiteExpedienteApiService);
  private readonly rdDocumentoApi = inject(RdDocumentoApiService);
  private readonly insideService = inject(InsideService);
  private readonly soapClient = inject(InsideSoapClient);
  private readonly prepareApiService = inject(InsidePrepareApiService);

  validarExpediente(
    expedienteId: number,
    options?: { requiereCerrado?: boolean },
  ): Observable<InsidePreparacionEnvio> {
    return this.cargarContexto(expedienteId).pipe(
      switchMap((context) => this.construirDocumentosContexto(context, false).pipe(
        map((documentos) => ({
          validacion: validarExpedienteParaInside(context, options),
          expedienteId,
          documentosPreparados: documentos.length,
          modoDryRun: this.soapClient.isDryRunEnabled(),
        })),
      )),
    );
  }

  prepararEnvioExpediente(expedienteId: number): Observable<InsidePreparacionEnvio> {
    return this.validarExpediente(expedienteId);
  }

  cargarContexto(expedienteId: number): Observable<InsideIflowContext> {
    return forkJoin({
      expediente: this.expedienteApi.getExpediente(expedienteId),
      tareas: this.tareaTramiteApi.listarPorExpediente(expedienteId),
      interesados: this.expedienteApi.getInteresadoListar(expedienteId),
      indiceEni: this.obtenerIndiceEni(expedienteId),
      atributos: this.obtenerAtributosExpediente(expedienteId),
    });
  }

  construirDocumentosContexto(
    context: InsideIflowContext,
    descargarContenido = true,
  ): Observable<InsideTareaDocumentoContext[]> {
    const tareas = filtrarTareasConDocumento(context.tareas);
    if (!tareas.length) {
      return of([]);
    }

    const peticiones = tareas.map((tarea, index) =>
      forkJoin({
        metadatos: this.obtenerMetadatosArchivo(tarea.archivo),
        contenidoBase64: descargarContenido
          ? this.descargarArchivoBase64(tarea.archivo)
          : of(undefined),
      }).pipe(
        map(({ metadatos, contenidoBase64 }) => this.crearDocumentoContexto(
          tarea,
          index + 1,
          context.indiceEni,
          metadatos,
          contenidoBase64,
        )),
      ),
    );

    return forkJoin(peticiones);
  }

  convertirDocumentoTarea(
    expedienteId: number,
    tareaId: number,
    options?: Partial<InsideMapperOptions>,
  ): Observable<InsideSoapResponse> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarConvertirDocumento(tareaId);
    }

    return this.cargarContexto(expedienteId).pipe(
      switchMap((context) => this.construirDocumentosContexto(context).pipe(
        switchMap((documentos) => {
          const documento = documentos.find((item) => Number(item.tarea.id) === Number(tareaId));
          if (!documento) {
            throw new Error('No se pudo preparar el documento de la tarea para INSIDE.');
          }

          const mapperOptions = this.resolverMapperOptions(context, options);
          const peticion = mapTareaToConvertirDocumentoRequest(documento, mapperOptions);
          if (!peticion) {
            throw new Error('No se pudo mapear el documento de la tarea a INSIDE.');
          }

          return this.insideService.convertirDocumentoAEni(peticion);
        }),
      )),
    );
  }

  convertirExpedienteCompleto(
    expedienteId: number,
    options?: Partial<InsideMapperOptions>,
  ): Observable<InsideSoapResponse> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarConvertirExpediente(expedienteId);
    }

    return this.validarExpediente(expedienteId).pipe(
      switchMap((preparacion) => {
        if (!preparacion.validacion.valido) {
          return throwError(() => new Error(
            preparacion.validacion.errores.map((item) => item.mensaje).join(' '),
          ));
        }

        return this.cargarContexto(expedienteId).pipe(
          switchMap((context) => this.construirDocumentosContexto(context).pipe(
            switchMap((documentos) => {
              const mapperOptions = this.resolverMapperOptions(context, options);
              const peticion = mapExpedienteToConvertirExpedienteConMAdicionalesRequest(
                context,
                documentos,
                mapperOptions,
              );

              return this.insideService.convertirExpedienteAEniConMAdicionales(peticion);
            }),
          )),
        );
      }),
    );
  }

  altaDocumentoEniXmlDesdeTarea(
    expedienteId: number,
    tareaId: number,
  ): Observable<InsideSoapResponse> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarAltaDocumentoEniXml(tareaId);
    }

    return this.cargarContexto(expedienteId).pipe(
      switchMap((context) => {
        const tarea = context.tareas.find((item) => Number(item.id) === Number(tareaId));
        if (!tarea?.archivo) {
          return throwError(() => new Error('La tarea seleccionada no tiene documento asociado.'));
        }

        return this.descargarEniXmlBase64(Number(tarea.archivo)).pipe(
          switchMap((eniXml) => {
            if (!eniXml.encontrado || !eniXml.base64) {
              return throwError(() => new Error(
                eniXml.mensaje ?? 'No se encontró el XML ENI del documento en el servidor.',
              ));
            }

            return this.insideService.altaDocumentoEniXml({ documentoEniBytes: eniXml.base64 });
          }),
        );
      }),
    );
  }

  altaExpedienteEniXmlDesdeExpediente(expedienteId: number): Observable<InsideSoapResponse> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarAltaExpedienteEniXml(expedienteId);
    }

    return this.validarExpediente(expedienteId, { requiereCerrado: true }).pipe(
      switchMap((preparacion) => {
        if (!preparacion.validacion.valido) {
          return throwError(() => new Error(
            preparacion.validacion.errores.map((item) => item.mensaje).join(' '),
          ));
        }

        return forkJoin({
          expedienteXml: this.obtenerExpedienteEniXmlBase64(expedienteId),
          context: this.cargarContexto(expedienteId),
        }).pipe(
          switchMap(({ expedienteXml, context }) => {
            if (!expedienteXml.encontrado || !expedienteXml.base64) {
              return throwError(() => new Error(
                expedienteXml.mensaje ?? 'No se encontró el XML ENI del expediente cerrado.',
              ));
            }

            const tareas = filtrarTareasFinalizadasConDocumento(context.tareas);
            if (!tareas.length) {
              return throwError(() => new Error('No hay documentos finalizados para el alta ENI XML.'));
            }

            const peticionesDocumentos = tareas.map((tarea) =>
              this.descargarEniXmlBase64(Number(tarea.archivo)),
            );

            return forkJoin(peticionesDocumentos).pipe(
              switchMap((documentosXml) => {
                const faltantes = documentosXml.filter((item) => !item.encontrado || !item.base64);
                if (faltantes.length > 0) {
                  return throwError(() => new Error(
                    `${faltantes.length} documento(s) no tienen XML ENI generado en disco.`,
                  ));
                }

                return this.insideService.altaExpedienteEniXml({
                  expedienteEniBytes: expedienteXml.base64 as string,
                  documentosEniFile: documentosXml.map((item) => ({
                    documentoEniBytes: item.base64 as string,
                  })),
                });
              }),
            );
          }),
        );
      }),
    );
  }

  altaDocumentoDesdeTarea(
    expedienteId: number,
    tareaId: number,
    options?: Partial<InsideMapperOptions>,
  ): Observable<InsideSoapResponse> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarAltaDocumentoEni(tareaId);
    }

    return this.cargarContexto(expedienteId).pipe(
      switchMap((context) => this.construirDocumentosContexto(context).pipe(
        switchMap((documentos) => {
          const documento = documentos.find((item) => Number(item.tarea.id) === Number(tareaId));
          if (!documento) {
            throw new Error('No se encontró la tarea con documento para el alta en INSIDE.');
          }

          const mapperOptions = this.resolverMapperOptions(context, options);
          const peticion = mapTareaToAltaDocumentoRequest(documento, mapperOptions);
          if (!peticion) {
            throw new Error('No se pudo mapear el alta de documento a INSIDE.');
          }

          return this.insideService.altaDocumentoEni(peticion);
        }),
      )),
    );
  }

  convertirDocumentosExpediente(
    expedienteId: number,
    options?: Partial<InsideMapperOptions>,
  ): Observable<InsideSoapResponse[]> {
    if (environment.inside.useBackendProxy === true) {
      return this.prepareApiService.enviarConvertirDocumentosExpediente(expedienteId);
    }

    return this.cargarContexto(expedienteId).pipe(
      switchMap((context) => this.construirDocumentosContexto(context).pipe(
        switchMap((documentos) => {
          const mapperOptions = this.resolverMapperOptions(context, options);
          const llamadas = documentos.map((documento) => {
            if (mapperOptions.incluirMetadatosAdicionales) {
              const peticion = mapTareaToConvertirDocumentoConMAdicionalesRequest(
                documento,
                mapperOptions,
                context.atributos,
              );
              return peticion
                ? this.insideService.convertirDocumentoAEniConMAdicionales(peticion)
                : null;
            }

            const peticion = mapTareaToConvertirDocumentoRequest(documento, mapperOptions);
            return peticion ? this.insideService.convertirDocumentoAEni(peticion) : null;
          }).filter((llamada): llamada is Observable<InsideSoapResponse> => llamada !== null);

          if (!llamadas.length) {
            throw new Error('El expediente no tiene documentos convertibles para INSIDE.');
          }

          return forkJoin(llamadas);
        }),
      )),
    );
  }

  private resolverMapperOptions(
    context: InsideIflowContext,
    overrides?: Partial<InsideMapperOptions>,
  ): InsideMapperOptions {
    return {
      organoDir3: overrides?.organoDir3 ?? resolverOrganoDesdeExpediente(context.expediente),
      clasificacion: overrides?.clasificacion,
      firmarDocumentos: overrides?.firmarDocumentos ?? false,
      firmarExpediente: overrides?.firmarExpediente ?? false,
      incluirMetadatosAdicionales: overrides?.incluirMetadatosAdicionales ?? true,
    };
  }

  private crearDocumentoContexto(
    tarea: TareaTramiteExpporExpedi,
    orden: number,
    indiceEni: IndiceEniDto[],
    metadatos?: VerMetadatos,
    contenidoBase64?: string,
  ): InsideTareaDocumentoContext {
    const indice = indiceEni.find((item) => String(item.archivo) === String(tarea.archivo));

    return {
      tarea,
      orden,
      metadatos,
      indice,
      contenidoBase64,
    };
  }

  private obtenerIndiceEni(expedienteId: number): Observable<IndiceEniDto[]> {
    const url = `${environment.apiUrl}archivo/verIndice/${expedienteId}`;
    return this.http.get<IndiceEniDto[]>(url).pipe(
      map((response) => response ?? []),
      catchError(() => of([])),
    );
  }

  private obtenerAtributosExpediente(expedienteId: number): Observable<AtributoExpedienteDto[]> {
    const url = `${environment.apiUrl}atributoExpediente/listar/${expedienteId}`;
    return this.http.get<AtributoExpedienteDto[]>(url).pipe(
      map((response) => response ?? []),
      catchError(() => of([])),
    );
  }

  private obtenerMetadatosArchivo(codArchi: unknown): Observable<VerMetadatos | undefined> {
    if (!codArchi) {
      return of(undefined);
    }

    return this.rdDocumentoApi.getMetadatosVer(Number(codArchi)).pipe(
      catchError(() => of(undefined)),
    );
  }

  private descargarArchivoBase64(codArchi: unknown): Observable<string | undefined> {
    if (!codArchi) {
      return of(undefined);
    }

    const url = `${environment.apiUrl}archivo/descargaTarea/${codArchi}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob) => from(this.blobToBase64(blob))),
    );
  }

  private descargarEniXmlBase64(codArchi: number): Observable<InsideEniXmlBase64Dto> {
    const url = `${environment.apiUrl}inside/archivo/${codArchi}/eni-xml-base64`;
    return this.http.get<InsideEniXmlBase64Dto>(url).pipe(
      catchError(() => this.descargarEniXmlBase64DesdeArchivo(codArchi)),
    );
  }

  private descargarEniXmlBase64DesdeArchivo(codArchi: number): Observable<InsideEniXmlBase64Dto> {
    const url = `${environment.apiUrl}archivo/descargaInfoDocElec/${codArchi}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob) => from(this.blobToBase64(blob))),
      map((base64) => ({
        base64,
        encontrado: true,
      })),
      catchError(() => of({
        encontrado: false,
        mensaje: `No se pudo leer el XML ENI del archivo ${codArchi}.`,
      })),
    );
  }

  private obtenerExpedienteEniXmlBase64(expedienteId: number): Observable<InsideEniXmlBase64Dto> {
    const url = `${environment.apiUrl}inside/expediente/${expedienteId}/eni-xml-base64`;
    return this.http.get<InsideEniXmlBase64Dto>(url).pipe(
      catchError(() => of({
        encontrado: false,
        mensaje: 'No se encontró el XML ENI del expediente en el servidor.',
      })),
    );
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('No se pudo convertir el archivo a Base64.'));
          return;
        }

        const base64 = result.split(',')[1] ?? result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo para INSIDE.'));
      reader.readAsDataURL(blob);
    });
  }
}
