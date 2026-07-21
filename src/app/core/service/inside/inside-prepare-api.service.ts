import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, switchMap, throwError } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { InsideDatosRemisionJusticia, InsideSoapResponse } from '../../models/inside'

export interface InsideEnvioResultadoApi {
  exito: boolean
  codigoRespuesta?: string
  descripcionRespuesta?: string
  identificadorEni?: string
  csv?: string
  codigoEnvioATEA?: string
  estadoRemision?: string
  modoDryRun?: boolean
  mensajeError?: string
  advertencias?: string[]
}

export interface InsideRemisionBackendRequest {
  idExpediente: number
  idexpEni: string
  dir3Juzgado: string
  datosRemisionJusticia: InsideDatosRemisionJusticia
}

export interface InsideConsultaRemisionBackendRequest {
  idExpediente: number
  codigoEnvioATEA: string
}

@Injectable({
  providedIn: 'root',
})
export class InsidePrepareApiService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiUrl}inside`

  enviarAltaExpedienteEniXml(expedienteId: number): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/expediente/${expedienteId}/enviar-alta-xml`, {})
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarAltaDocumentoEniXml(tareaId: number): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/tarea/${tareaId}/enviar-alta-xml-documento`, {})
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarAltaDocumentoEni(tareaId: number): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/tarea/${tareaId}/enviar-alta-documento-eni`, {})
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarRemisionAJusticia(request: InsideRemisionBackendRequest): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/remision/enviar`, request)
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  consultarEstadoRemision(request: InsideConsultaRemisionBackendRequest): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/remision/consultar-estado`, request)
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarConvertirExpediente(expedienteId: number): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/expediente/${expedienteId}/enviar-convertir-expediente`, {})
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarConvertirDocumento(tareaId: number): Observable<InsideSoapResponse> {
    return this.http
      .post<InsideEnvioResultadoApi>(`${this.baseUrl}/tarea/${tareaId}/enviar-convertir-documento`, {})
      .pipe(switchMap((resultado) => this.mapResultado(resultado)))
  }

  enviarConvertirDocumentosExpediente(expedienteId: number): Observable<InsideSoapResponse[]> {
    return this.http
      .post<InsideEnvioResultadoApi[]>(`${this.baseUrl}/expediente/${expedienteId}/enviar-convertir-documentos`, {})
      .pipe(
        switchMap((resultados) => {
          if (!resultados?.length) {
            return throwError(() => new Error('No hay documentos convertibles para INSIDE.'))
          }

          const respuestas: InsideSoapResponse[] = []
          for (const resultado of resultados) {
            if (!resultado.exito) {
              return throwError(() => new Error(resultado.mensajeError ?? 'Error al convertir documentos INSIDE.'))
            }
            respuestas.push({
              rawXml: '',
              codigoRespuesta: resultado.codigoRespuesta,
              descripcionRespuesta: resultado.descripcionRespuesta,
              identificador: resultado.identificadorEni,
              csv: resultado.csv,
            })
          }

          return new Observable<InsideSoapResponse[]>((subscriber) => {
            subscriber.next(respuestas)
            subscriber.complete()
          })
        }),
      )
  }

  private mapResultado(resultado: InsideEnvioResultadoApi): Observable<InsideSoapResponse> {
    if (!resultado.exito) {
      return throwError(() => new Error(resultado.mensajeError ?? 'No se pudo completar el envío INSIDE.'))
    }

    return new Observable((subscriber) => {
      subscriber.next({
        rawXml: '',
        codigoRespuesta: resultado.codigoRespuesta,
        descripcionRespuesta: resultado.descripcionRespuesta,
        identificador: resultado.identificadorEni,
        csv: resultado.csv,
        codigoEnvioATEA: resultado.codigoEnvioATEA,
        estadoRemision: resultado.estadoRemision,
      })
      subscriber.complete()
    })
  }
}
