import { HttpErrorResponse } from '@angular/common/http'
import { DestroyRef, Injectable, inject } from '@angular/core'
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
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { ExpedientesService } from '../../expedientes.service'
import { EditaExpedienteTareasFacade } from '../tareas/edita-expediente-tareas.facade'
import {
  EditaExpedienteInsideHost,
  InsideAccionesFacade,
  InsideRemisionForm,
} from '../../../../core/service/inside/inside-acciones.facade'
import {
  limpiarErroresFormulario,
  marcarCamposObligatoriosInvalidos,
  validarFormularioBootstrap,
} from '../../../../core/helper/bootstrap-form.helper'

export type { EditaExpedienteInsideHost, InsideRemisionForm }

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
  lifecycleFacade: { consultadni: ConsultaDni; dniok: boolean };
  listarinteresadosdto: InteresadoListarDto[];
}

/** Facade unificado de operaciones (bolsa + salida + interesados). Las acciones
 * INSIDE/ENI viven en `InsideAccionesFacade` (core/service/inside) — aquí solo
 * se delega, para que ningún consumidor existente (vista de edición) tenga que
 * cambiar la forma en que las invoca. */
@Injectable()
export class EditaExpedienteOperacionesFacade {
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly insideAcciones: InsideAccionesFacade,
    private readonly modalManagerService: ModalManagerService,
  ) {}

  // --- Bolsa / propuesta de resolución ---

  limpiarFormularioBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear = new InsertaBolsaCrear()
    limpiarErroresFormulario('formPropuestaResolucion')
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

  validateAndCrearInsertaBolsa(event: Event, host: EditaExpedienteBolsaHost): void {
    event.preventDefault()
    const htmlOk = validarFormularioBootstrap(event, this.notificationService)
    const modelOk = this.camposObligatoriosBolsaOk(host)
    if (!htmlOk || !modelOk) {
      const extras: string[] = []
      if (host.insertabolsacrear.prioridad == null || host.insertabolsacrear.prioridad === '') {
        extras.push('prioridadBolsa')
      }
      if (host.insertabolsacrear.tipSesion == null) {
        extras.push('tipSesionBolsa')
      }
      if (host.insertabolsacrear.tipPunto == null) {
        extras.push('tipPuntoBolsa')
      }
      marcarCamposObligatoriosInvalidos('formPropuestaResolucion', extras)
      if (htmlOk && !modelOk) {
        this.notificationService.incompleteFields()
      }
      return
    }
    this.crearInsertaBolsa(host)
  }

  private camposObligatoriosBolsaOk(host: EditaExpedienteBolsaHost): boolean {
    const b = host.insertabolsacrear
    return !!(
      b.fecAlta &&
      b.fecPrefe &&
      b.fecMaxResol &&
      b.prioridad != null &&
      b.prioridad !== '' &&
      b.tipSesion != null &&
      b.tipPunto != null
    )
  }

  crearInsertaBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear.usuContr = host.usuContrl!
    host.insertabolsacrear.idOrgEleme = host.idOrgElemen!
    host.insertabolsacrear.refExped = host.ejerNumExpedi
    host.insertabolsacrear.estado = 0

    if (!this.camposObligatoriosBolsaOk(host)) {
      marcarCamposObligatoriosInvalidos('formPropuestaResolucion', [
        'prioridadBolsa',
        'tipSesionBolsa',
        'tipPuntoBolsa',
      ])
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
        host.verExpediente.personaEntidad.idPerso as number,
        host.verExpediente.personaEntidad.idHisPerso as number,
        host.numeroArchivo,
        host.idTarea,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.onPropuestaResolucionCreada(host),
        error: (response: HttpErrorResponse) => {
          if (response.status === 200 || response.status === 201) {
            this.onPropuestaResolucionCreada(host)
            return
          }
          const msg = response?.error?.message as string | undefined
          if (msg && /propuesta de resoluci/i.test(msg)) {
            this.marcarPropuestaYaExistente(host)
            this.notificationService.warning(msg)
            this.modalManagerService.closeModal('GenerarPropuestaResolucionModal')
            return
          }
          this.notificationService.fromHttpError(
            response,
            'No se ha generado la propuesta de resolución.',
          )
        },
      })
  }

  private onPropuestaResolucionCreada(host: EditaExpedienteBolsaHost): void {
    this.notificationService.saveSuccess('Propuesta de resolución')
    this.limpiarFormularioBolsa(host)
    this.marcarPropuestaYaExistente(host)
    host.verTareasdelTramite = true
    host.verInsertarBolsa = false
    host.refrescoSourceTareasTramite(host.idTramite)
    this.modalManagerService.closeModal('GenerarPropuestaResolucionModal')
  }

  private marcarPropuestaYaExistente(host: EditaExpedienteBolsaHost): void {
    const flags = host as EditaExpedienteBolsaHost & {
      veopropuestaresolu?: boolean
      veoPropuestaResolucion?: boolean
    }
    flags.veopropuestaresolu = false
    flags.veoPropuestaResolucion = false
  }

  // --- Generar salida ---

  limpiarFormularioGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida = new CrearGenerarSalida()
    host.creargenerarsalida.codTema = ''
    host.creargenerarsalida.extracto = ''
    host.creargenerarsalida.observaciones = ''
    limpiarErroresFormulario('formGenerarSalida')
  }

  clickAtrasGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.verTareasdelTramite = true
    host.verGenerarSalida = false
    host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite)
    this.limpiarFormularioGenerarSalida(host)
    this.modalManagerService.closeModal('GenerarSalidaModal')
  }

  onTemaDocumentoChange(host: EditaExpedienteSalidaHost): void {
    const cod = host.creargenerarsalida?.codTema
    if (!cod) {
      return
    }
    const tema = (host.temadocumentolistar ?? []).find((t) => t.codTema === cod)
    if (tema?.extracto && !host.creargenerarsalida.extracto) {
      host.creargenerarsalida.extracto = tema.extracto
    } else if (tema?.desTema && !host.creargenerarsalida.extracto) {
      host.creargenerarsalida.extracto = tema.desTema
    }
  }

  validateAndPrepararCrearGenerarSalida(event: Event, host: EditaExpedienteSalidaHost): void {
    event.preventDefault()
    if (!validarFormularioBootstrap(event, this.notificationService)) {
      return
    }
    this.prepararCrearGenerarSalida(host)
  }

  prepararCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida.ejeExped = host.verExpediente.ejercicio
    host.creargenerarsalida.numExped = host.verExpediente.numero
    host.creargenerarsalida.usuContr = host.usuContrl!

    if (!host.creargenerarsalida.extracto?.trim()) {
      this.notificationService.warning('Debe rellenar el extracto.')
      return
    }

    if (!host.numeroArchivo) {
      this.notificationService.error(
        'Esta tarea no tiene archivo asociado por lo que no se puede generar la salida.',
      )
      return
    }

    if (host.nunRegisTarea) {
      this.notificationService.confirm({
        title: `Esta tarea ya tiene generada un registro de salida número : ${host.nunRegisTarea}`,
        text: '¿Quiere Generar uno nuevo?',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (!result.isConfirmed) {
          return
        }
        this.ejecutarCrearGenerarSalida(host)
      })
      return
    }

    this.ejecutarCrearGenerarSalida(host)
  }

  ejecutarCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    this.expedientesService
      .crearGenerarSalida(
        host.creargenerarsalida,
        host.verExpediente.personaEntidad.idPerso as number,
        host.verExpediente.personaEntidad.idHisPerso as number,
        host.numeroArchivo,
        host.idTarea,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const id =
            typeof response === 'string'
              ? response
              : (response as { text?: string } | null)?.text
          this.notificationService.saveSuccess(
            id ? `Registro de salida: ${id}` : 'Registro de salida',
          )
          this.limpiarFormularioGenerarSalida(host)
          host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite, {
            sortColumn: 'numero',
            sortDirection: 'desc',
          })
          this.modalManagerService.closeModal('GenerarSalidaModal')
        },
        error: (err: HttpErrorResponse) => {
          // Algunos endpoints devuelven texto plano con 201 y Angular lo trata como error de parseo.
          if (err.status === 200 || err.status === 201) {
            host.identificadorGenerarSalida =
              typeof err.error === 'string' ? err.error : err.error?.text ?? err.error
            this.notificationService.saveSuccess(
              `Registro de salida: ${host.identificadorGenerarSalida ?? ''}`.trim(),
            )
            this.limpiarFormularioGenerarSalida(host)
            host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite, {
              sortColumn: 'numero',
              sortDirection: 'desc',
            })
            this.modalManagerService.closeModal('GenerarSalidaModal')
            return
          }
          this.notificationService.fromHttpError(
            err,
            'No se ha podido generar el registro de salida.',
          )
        },
      })
  }

  // --- Interesados ---
  crearInteresado(host: EditaExpedienteInteresadosHost): void {
    host.crearinteresado.idHisPerso = host.lifecycleFacade.consultadni.idHisPerso
    host.crearinteresado.idPerso = host.lifecycleFacade.consultadni.idPerso
    host.crearinteresado.idexpediente = host.idExpediente

    this.expedientesService.crearInteresado(host.crearinteresado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success({
          title: 'Interesado creado correctamente',
        })
        host.crearinteresado = new CrearInteresado()
        host.lifecycleFacade.dniok = false
        this.modalManagerService.closeModal('ninteresadoModal')
        this.listarInteresados(host, host.idExpediente)
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.fromHttpError(
          error,
          'No se pudo crear el nuevo interesado',
        )
      },
    })
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
          this.notificationService.deleteSuccess('Interesado')
          host.verborrarinteresado = false
          host.idInteresado = 0
          this.listarInteresados(host, host.idExpediente)
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

  // --- Inside / ENI (delegado a InsideAccionesFacade) ---
  inicializarRemision(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.inicializarRemision(host);
  }

  abrirModalRemisionJusticia(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.abrirModalRemisionJusticia(host);
  }

  cargarEstadoEnvio(expedienteId: number, host: EditaExpedienteInsideHost): void {
    this.insideAcciones.cargarEstadoEnvio(expedienteId, host);
  }

  handleVerHistorialEnvios(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleVerHistorialEnvios(host);
  }

  handleValidarExpediente(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleValidarExpediente(host);
  }

  handleEnviarDocumentoTarea(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleEnviarDocumentoTarea(host);
  }

  handleAltaDocumentoEniXml(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleAltaDocumentoEniXml(host);
  }

  handleEnviarExpedienteCompleto(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleEnviarExpedienteCompleto(host);
  }

  handleAltaExpedienteEniXml(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleAltaExpedienteEniXml(host);
  }

  handleEnviarDocumentosExpediente(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleEnviarDocumentosExpediente(host);
  }

  handleRemisionAJusticia(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleRemisionAJusticia(host);
  }

  handleConsultarEstadoRemision(host: EditaExpedienteInsideHost): void {
    this.insideAcciones.handleConsultarEstadoRemision(host);
  }
}

export type EditaExpedienteInteresadosFacade = EditaExpedienteOperacionesFacade
export type EditaExpedienteInsideFacade = EditaExpedienteOperacionesFacade
