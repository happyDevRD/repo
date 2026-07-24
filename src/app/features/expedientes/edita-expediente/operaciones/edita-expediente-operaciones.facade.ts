import { HttpErrorResponse } from '@angular/common/http'
import { DestroyRef, Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  ConsultaDni,
  CrearGenerarSalida,
  CrearInteresado,
  InsertaBolsaCrear,
  TemaDocumentoListar,
  VerExpediente,
} from '../../expedientes'
import { InteresadoListarDto } from '../../../../core/models/interesado.dto'
import { NotificationService } from '../../../../core/service/notification.service'
import { ExpedientesService } from '../../expedientes.service'
import { EditaExpedienteTareasFacade } from '../tareas/edita-expediente-tareas.facade'
import { environment } from 'src/environments/environment'
import { InsideExpedienteOrchestrator } from '../../../../core/service/inside/inside-expediente.orchestrator'
import { InsideService } from '../../../../core/service/inside/inside.service'
import {
  buildIdentificadorExpedienteEni,
  resolverOrganoDesdeExpediente,
} from '../../../../core/service/inside/inside-iflow.mapper'
import { InsideEnvioRegistroService } from '../../../../core/service/inside/inside-envio-registro.service'
import { InsidePrepareApiService } from '../../../../core/service/inside/inside-prepare-api.service'
import { formatearValidacionHtml } from '../../../../core/service/inside/inside-validation.helper'
import { InsideEnvioRegistro } from '../../../../core/models/inside/inside-envio.models'
import { InsideSoapResponse } from '../../../../core/models/inside'
import { etiquetaInsideDryRunHtml } from '../../../../core/constants/inside-simulacion.constants'

export interface EditaExpedienteBolsaHost {
  insertabolsacrear: InsertaBolsaCrear
  usuContrl: string | null
  idOrgElemen: string | null
  ejerNumExpedi: string
  numeroArchivo: number
  idTarea: number
  verExpediente: VerExpediente
  verTareasdelTramite: boolean
  verInsertarBolsa: boolean
  idTramite: number
  sourceTareasTramite: unknown
  refrescoSourceTareasTramite(id: number): void
}

export interface VerBolsaCrearHost {
  verTareasdelTramite: boolean
  verformnuevatarea: boolean
  verlistadotramitadores: boolean
  nuevotramitador: boolean
  verlistadotareas: boolean
  verEditartareatramite: boolean
  verNuevaNotifi: boolean
  verGenerarSalida: boolean
  verInsertarBolsa: boolean
}

export interface EditaExpedienteSalidaHost {
  creargenerarsalida: CrearGenerarSalida
  temadocumentolistar: TemaDocumentoListar[]
  verExpediente: VerExpediente
  usuContrl: string | null
  numeroArchivo: number
  idTarea: number
  idTramite: number
  nunRegisTarea: unknown
  identificadorGenerarSalida: string
  sourceTareasTramite: unknown
  verTareasdelTramite: boolean
  verGenerarSalida: boolean
}

export interface EditaExpedienteInteresadosHost {
  idExpediente: number;
  idInteresado: number;
  verborrarinteresado: boolean;
  crearinteresado: CrearInteresado;
  lifecycleFacade: { consultadni: ConsultaDni };
  listarinteresadosdto: InteresadoListarDto[];
  recargarpagina(): void;
}

export interface InsideRemisionForm {
  idexpEni: string;
  dir3Juzgado: string;
  dir3Remitente: string;
  nig: string;
  claseProcedimiento: string;
  anyoProcedimiento: string;
  numeroProcedimiento: string;
  descripcion: string;
  codigoEnvioATEA: string;
}

export interface EditaExpedienteInsideHost {
  idExpediente: number;
  idTarea: number;
  numeroArchivo: number;
  verExpediente: VerExpediente;
  verAbreArchivo: boolean;
  insideEnviando: boolean;
  insideDryRun: boolean;
  insideRemision: InsideRemisionForm;
  insideUltimaRespuesta: InsideSoapResponse | null;
  insideUltimoEnvio: InsideEnvioRegistro | null;
  abrirModal(modalId: string): void;
  cerrarModal(modalId: string): void;
}

const crearRemisionVacia = (): InsideRemisionForm => ({
  idexpEni: '',
  dir3Juzgado: '',
  dir3Remitente: '',
  nig: '',
  claseProcedimiento: '',
  anyoProcedimiento: '',
  numeroProcedimiento: '',
  descripcion: '',
  codigoEnvioATEA: '',
});

/** Facade unificado de operaciones (bolsa + salida + interesados + inside). */
@Injectable()
export class EditaExpedienteOperacionesFacade {
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly router: Router,
    private readonly insideOrchestrator: InsideExpedienteOrchestrator,
    private readonly insideService: InsideService,
    private readonly envioRegistroService: InsideEnvioRegistroService,
    private readonly prepareApiService: InsidePrepareApiService,
  ) {}

  // --- Bolsa / propuesta de resolución ---

  limpiarFormularioBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear = new InsertaBolsaCrear()
  }

  clickAtrasBolsaCrear(host: EditaExpedienteBolsaHost): void {
    host.verInsertarBolsa = false
    this.limpiarFormularioBolsa(host)
  }

  mostrarFormularioBolsa(host: VerBolsaCrearHost): void {
    host.verTareasdelTramite = false
    host.verformnuevatarea = false
    host.verlistadotramitadores = false
    host.nuevotramitador = false
    host.verlistadotareas = false
    host.verEditartareatramite = false
    host.verNuevaNotifi = false
    host.verGenerarSalida = false
    host.verInsertarBolsa = true
  }

  crearInsertaBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear.usuContr = host.usuContrl!
    host.insertabolsacrear.idOrgEleme = host.idOrgElemen!
    host.insertabolsacrear.refExped = host.ejerNumExpedi
    host.insertabolsacrear.estado = 0

    const camposObligatorios =
      host.insertabolsacrear.fecAlta &&
      host.insertabolsacrear.fecPrefe &&
      host.insertabolsacrear.fecMaxResol &&
      host.insertabolsacrear.prioridad &&
      host.insertabolsacrear.tipSesion &&
      host.insertabolsacrear.tipPunto

    if (!camposObligatorios) {
      this.notificationService.incompleteFields()
      return
    }

    if (!host.numeroArchivo) {
      this.notificationService.error(
        'Esta tarea no tiene archivo asociado por lo que no se puede generar la propuesta.',
      )
      return
    }

    this.expedientesService
      .crearInsertaBolsa(
        host.insertabolsacrear,
        host.verExpediente.personaEntidad.idPerso,
        host.verExpediente.personaEntidad.idHisPerso,
        host.numeroArchivo,
        host.idTarea,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response == null) {
            this.notificationService.saveSuccess('Propuesta de resolución')
            this.limpiarFormularioBolsa(host)
            host.verTareasdelTramite = true
            host.verInsertarBolsa = false
            host.refrescoSourceTareasTramite(host.idTramite)
          }
        },
        error: (response: HttpErrorResponse) => {
          if (response.status === 500) {
            this.notificationService.error('No se ha generado la propuesta de resolución.')
            this.limpiarFormularioBolsa(host)
            return
          }
          this.notificationService.saveSuccess('Propuesta de resolución')
          this.limpiarFormularioBolsa(host)
        },
      })
  }

  // --- Generar salida ---

  limpiarFormularioGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida = new CrearGenerarSalida()
    host.temadocumentolistar = new TemaDocumentoListar[0]
  }

  clickAtrasGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.verTareasdelTramite = true
    host.verGenerarSalida = false
    host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite)
    this.limpiarFormularioGenerarSalida(host)
  }

  prepararCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida.ejeExped = host.verExpediente.ejercicio
    host.creargenerarsalida.numExped = host.verExpediente.numero
    host.creargenerarsalida.usuContr = host.usuContrl!

    if (host.nunRegisTarea) {
      this.notificationService.confirm({
        title: `Esta tarea ya tiene generada un registro de salida número : ${host.nunRegisTarea}`,
        text: '¿Quiere Generar uno nuevo?',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(() => this.ejecutarCrearGenerarSalida(host))
      return
    }

    this.ejecutarCrearGenerarSalida(host)
  }

  ejecutarCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    if (
      host.creargenerarsalida.codTema ||
      host.creargenerarsalida.extracto ||
      host.creargenerarsalida.observaciones
    ) {
      this.expedientesService
        .crearGenerarSalida(
          host.creargenerarsalida,
          host.verExpediente.personaEntidad.idPerso,
          host.verExpediente.personaEntidad.idHisPerso,
          host.numeroArchivo,
          host.idTarea,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {},
          error: (err: HttpErrorResponse) => {
            host.identificadorGenerarSalida = err.error?.text
            if (err.status === 201) {
              this.notificationService.saveSuccess(`Registro de salida: ${host.identificadorGenerarSalida}`)
              host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite, {
                sortColumn: 'numero',
                sortDirection: 'desc',
              })
            }
          },
        })
    } else {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.')
    }

    this.limpiarFormularioGenerarSalida(host)
  }

  // --- Interesados ---
  crearInteresado(host: EditaExpedienteInteresadosHost): void {
    host.crearinteresado.idHisPerso = host.lifecycleFacade.consultadni.idHisPerso;
    host.crearinteresado.idPerso = host.lifecycleFacade.consultadni.idPerso;
    host.crearinteresado.idexpediente = host.idExpediente;

    this.expedientesService.crearInteresado(host.crearinteresado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.router.navigate(['/expedientes', host.idExpediente, 'tramitar']),
      error: (error: HttpErrorResponse) => {
        if (error.status !== 500) {
          this.notificationService.success({
            position: 'center',
            title: 'Se a creado el interesado con exito!!!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          this.notificationService.warning({
            position: 'center',
            title: 'No se pudo crear el nuevo interesado',
            showConfirmButton: false,
            timer: 2500,
          });
        }
      },
    });

    setTimeout(host.recargarpagina, 1000);
  }

  borrarInteresado(host: EditaExpedienteInteresadosHost): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar interesado',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteInteresado(host.idInteresado).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Interesado');
          setTimeout(host.recargarpagina, 1500);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
              title: 'No se ha podido borrar el elemento. Existen elementos dependientes asociados ',
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
          }
          this.notificationService.error('No se pudo eliminar el Interesado');
        },
      });
    });
  }

  listarInteresados(host: EditaExpedienteInteresadosHost, idexp: number): void {
    this.expedientesService.getInteresadoListarDto(idexp).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (listarInteresados) => {
        host.listarinteresadosdto = listarInteresados;
      },
      error: (error) => {
        console.error('Error al obtener interesados:', error);
        host.listarinteresadosdto = [];
      },
    });
  }

  seleccionarInteresado(host: EditaExpedienteInteresadosHost, idInteresado: number): void {
    host.verborrarinteresado = true;
    host.idInteresado = idInteresado;
  }

  // --- Inside / ENI ---
  inicializarRemision(host: EditaExpedienteInsideHost): void {
    const organo = resolverOrganoDesdeExpediente(host.verExpediente);
    host.insideRemision = {
      ...crearRemisionVacia(),
      idexpEni: buildIdentificadorExpedienteEni(
        organo,
        host.verExpediente.ejercicio,
        host.verExpediente.numero,
      ),
      dir3Remitente: organo,
      anyoProcedimiento: String(host.verExpediente.ejercicio ?? new Date().getFullYear()),
    };
  }

  abrirModalRemisionJusticia(host: EditaExpedienteInsideHost): void {
    this.inicializarRemision(host);
    host.abrirModal('insideRemisionJusticiaModal');
  }

  cargarEstadoEnvio(expedienteId: number, host: EditaExpedienteInsideHost): void {
    this.envioRegistroService.obtenerUltimo(expedienteId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (ultimo) => {
        host.insideUltimoEnvio = ultimo;
      },
    });
  }

  handleVerHistorialEnvios(host: EditaExpedienteInsideHost): void {
    this.envioRegistroService.listarPorExpediente(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (envios) => {
        if (!envios.length) {
          this.notificationService.info({ title: 'INSIDE', text: 'No hay envíos registrados para este expediente.' });
          return;
        }

        const filas = envios.map((envio) => `
          <tr>
            <td>${envio.operacion}</td>
            <td>${envio.estadoEnvio ?? '-'}</td>
            <td>${envio.identificador ?? '-'}</td>
            <td>${envio.csv ?? '-'}</td>
          </tr>
        `).join('');

        this.notificationService.custom({
          title: 'Historial INSIDE',
          html: `
            <table class="table table-sm table-bordered text-start">
              <thead><tr><th>Operación</th><th>Estado</th><th>ID ENI</th><th>CSV</th></tr></thead>
              <tbody>${filas}</tbody>
            </table>
          `,
          width: '48rem',
          icon: 'info',
        });
      },
    });
  }

  handleValidarExpediente(host: EditaExpedienteInsideHost): void {
    host.insideEnviando = true;
    this.insideOrchestrator.validarExpediente(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (preparacion) => {
        host.insideEnviando = false;
        this.notificationService.custom({
          title: preparacion.validacion.valido ? 'Expediente listo para INSIDE' : 'Validación INSIDE',
          html: `${this.etiquetaDryRun(preparacion.modoDryRun)}${formatearValidacionHtml(preparacion.validacion)}`,
          icon: preparacion.validacion.valido ? 'success' : 'warning',
        });
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  handleEnviarDocumentoTarea(host: EditaExpedienteInsideHost): void {
    if (!host.numeroArchivo || !host.idTarea) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione una tarea con documento asociado.' });
      return;
    }

    this.notificationService.confirm({
      title: 'Enviar documento a INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se convertirá el documento de la tarea seleccionada al formato ENI de INSIDE.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirDocumentoTarea(host.idExpediente, host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Documento enviado a INSIDE', respuesta, 'convertirDocumentoAEni', host.idTarea),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleAltaDocumentoEniXml(host: EditaExpedienteInsideHost): void {
    if (!host.numeroArchivo || !host.idTarea) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione una tarea con documento asociado.' });
      return;
    }

    this.notificationService.confirm({
      title: 'Alta documento ENI XML',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviará el XML ENI ya generado en disco para la tarea seleccionada.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.altaDocumentoEniXmlDesdeTarea(host.idExpediente, host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Alta documento ENI XML', respuesta, 'altaDocumentoEniXml', host.idTarea),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleEnviarExpedienteCompleto(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Enviar expediente a INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se convertirá el expediente completo con todos sus documentos.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirExpedienteCompleto(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Expediente enviado a INSIDE', respuesta, 'convertirExpedienteAEni'),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleAltaExpedienteEniXml(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Alta expediente ENI XML',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviará el XML ENI del expediente cerrado y los XML de sus documentos.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.altaExpedienteEniXmlDesdeExpediente(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Alta expediente ENI XML', respuesta, 'altaExpedienteEniXml'),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleEnviarDocumentosExpediente(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Convertir documentos en INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviarán todos los documentos del expediente de forma individual.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirDocumentosExpediente(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuestas) => {
          host.insideEnviando = false;
          const ultima = respuestas[respuestas.length - 1] ?? null;
          host.insideUltimaRespuesta = ultima;
          if (ultima) {
            this.registrarEnvio(host.idExpediente, 'convertirDocumentosExpediente', ultima);
          }
          this.notificationService.success({
            title: 'INSIDE',
            text: `Se procesaron ${respuestas.length} documento(s) correctamente.${host.insideDryRun ? ' (simulación)' : ''}`,
          });
        },
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleRemisionAJusticia(host: EditaExpedienteInsideHost): void {
    const form = host.insideRemision;
    if (!form.idexpEni || !form.dir3Juzgado || !form.dir3Remitente || !form.nig) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Complete los campos obligatorios de la remisión.' });
      return;
    }

    host.insideEnviando = true;
    const peticionRemision = {
      idexpEni: form.idexpEni,
      dir3Juzgado: form.dir3Juzgado,
      datosRemisionJusticia: {
        dir3Remitente: form.dir3Remitente,
        nig: form.nig,
        claseProcedimiento: form.claseProcedimiento,
        anyoProcedimiento: form.anyoProcedimiento,
        numeroProcedimiento: form.numeroProcedimiento,
        descripcion: form.descripcion,
      },
    };

    const remision$ = environment.inside.useBackendProxy === true
      ? this.prepareApiService.enviarRemisionAJusticia({
          idExpediente: host.idExpediente,
          ...peticionRemision,
        })
      : this.insideService.remisionAJusticia(peticionRemision);

    remision$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (respuesta) => {
        if (respuesta.codigoEnvioATEA) {
          host.insideRemision.codigoEnvioATEA = respuesta.codigoEnvioATEA;
        }
        this.mostrarExito(host, 'Remisión a Justicia enviada', respuesta, 'remisionAJusticia');
        host.cerrarModal('insideRemisionJusticiaModal');
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  handleConsultarEstadoRemision(host: EditaExpedienteInsideHost): void {
    const codigo = host.insideRemision.codigoEnvioATEA?.trim();
    if (!codigo) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Indique el código de envío ATEA.' });
      return;
    }

    host.insideEnviando = true;
    const consulta$ = environment.inside.useBackendProxy === true
      ? this.prepareApiService.consultarEstadoRemision({
          idExpediente: host.idExpediente,
          codigoEnvioATEA: codigo,
        })
      : this.insideService.consultaEstadoRemisionAJusticia({ codigoEnvioATEA: codigo });

    consulta$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (respuesta) => {
        host.insideEnviando = false;
        host.insideUltimaRespuesta = respuesta;
        this.notificationService.info({
          title: 'Estado de remisión',
          html: `
            ${this.etiquetaDryRun(host.insideDryRun)}
            <p><strong>Código ATEA:</strong> ${codigo}</p>
            <p><strong>Estado:</strong> ${respuesta.estadoRemision ?? respuesta.descripcionRespuesta ?? 'Sin datos'}</p>
            <p><strong>Código respuesta:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
          `,
        });
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  private etiquetaDryRun(activo: boolean): string {
    return etiquetaInsideDryRunHtml(activo);
  }

  private registrarEnvio(
    expedienteId: number,
    operacion: string,
    respuesta: InsideSoapResponse,
    options?: { idTarea?: number },
  ): void {
    this.envioRegistroService.registrarDesdeRespuesta(
      expedienteId,
      operacion,
      respuesta,
      {
        idTarea: options?.idTarea,
        dryRun: environment.inside.dryRun === true,
      },
    );
  }

  private actualizarEstadoEnvio(host: EditaExpedienteInsideHost): void {
    this.cargarEstadoEnvio(host.idExpediente, host);
  }

  private mostrarExito(
    host: EditaExpedienteInsideHost,
    titulo: string,
    respuesta: InsideSoapResponse,
    operacion: string,
    idTarea?: number,
  ): void {
    host.insideEnviando = false;
    host.insideUltimaRespuesta = respuesta;
    this.registrarEnvio(host.idExpediente, operacion, respuesta, { idTarea });
    this.actualizarEstadoEnvio(host);
    this.notificationService.success({
      title: `${titulo}${host.insideDryRun ? ' (simulación)' : ''}`,
      html: `
        ${this.etiquetaDryRun(host.insideDryRun)}
        <p><strong>Código:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
        <p><strong>Descripción:</strong> ${respuesta.descripcionRespuesta ?? '-'}</p>
        ${respuesta.identificador ? `<p><strong>Identificador:</strong> ${respuesta.identificador}</p>` : ''}
        ${respuesta.csv ? `<p><strong>CSV:</strong> ${respuesta.csv}</p>` : ''}
        ${respuesta.codigoEnvioATEA ? `<p><strong>ATEA:</strong> ${respuesta.codigoEnvioATEA}</p>` : ''}
      `,
    });
  }

  private mostrarError(host: EditaExpedienteInsideHost, error: Error): void {
    host.insideEnviando = false;
    this.notificationService.error({ title: 'Error INSIDE', text: error?.message ?? 'No se pudo completar la operación.' });
  }
}

export type EditaExpedienteInteresadosFacade = EditaExpedienteOperacionesFacade
export type EditaExpedienteInsideFacade = EditaExpedienteOperacionesFacade
