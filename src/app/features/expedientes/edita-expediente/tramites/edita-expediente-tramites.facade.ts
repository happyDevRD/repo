import { HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CrearTramiteExp, EditarTramiteExp, ListarTramites } from '../../expedientes'
import { NotificationService } from '../../../../core/service/notification.service'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { ExpedientesService } from '../../expedientes.service'
import { fechaTramitePorDefecto, validarCrearTramite } from './tramites-validacion.helper'
import {
  aplicarFechaTramitePorDefecto,
  crearTramiteExpVacio,
} from './tramites-form-validation.helper'
import {
  limpiarErroresFormulario,
  validarFormularioBootstrap,
} from '../../../../core/helper/bootstrap-form.helper'

export interface EditaExpedienteTramitesGridHost {
  idExpediente: number
  listartramites?: ListarTramites[]
  cargandoTramites?: boolean
  cdr?: ChangeDetectorRef
}

export interface EditaExpedienteTramitesHost extends EditaExpedienteTramitesGridHost {
  idTramite: number
  creartramiteexp: CrearTramiteExp
  editartramiteexp: EditarTramiteExp
  enviandoTramite: boolean
  nuevotramite: boolean
  limpiarFormularioTramite(): void
  borrarDatosTramite(): void
  /** Simula la selección de fila (carga tareas disponibles, tareas del trámite, notificaciones...). */
  clickTramiteNuevo?(rowData: ListarTramites): void
}

/** Host UI/navegación de trámites (antes TramitesUiHost). */
export interface EditaExpedienteTramitesUiHost {
  nuevotramite: boolean
  verTareasdelTramite: boolean
  creartramiteexp: CrearTramiteExp
  FechaSistema(): void
  verExpediente: { ejercicio: number; numero: number }
  recargarSourceTramitadores(): void
}

@Injectable()
export class EditaExpedienteTramitesFacade {
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) {}

  cargarTramites(host: EditaExpedienteTramitesGridHost, onLoaded?: (list: ListarTramites[]) => void): void {
    if (!host.idExpediente) {
      return
    }

    if (host.cargandoTramites !== undefined) {
      host.cargandoTramites = true
    }

    this.expedientesService.getTramitesListar(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (list) => {
        if (host.listartramites !== undefined) {
          host.listartramites = list ?? []
        }
        if (host.cargandoTramites !== undefined) {
          host.cargandoTramites = false
        }
        host.cdr?.markForCheck()
        onLoaded?.(list ?? [])
      },
      error: (err: HttpErrorResponse) => {
        if (host.listartramites !== undefined) {
          host.listartramites = []
        }
        if (host.cargandoTramites !== undefined) {
          host.cargandoTramites = false
        }
        host.cdr?.markForCheck()
        if (err.status === 0) {
          this.notificationService.error({
            title: 'Oops...',
            text: 'Parece que no hay conexión con la Base de Datos',
            footer: 'Inténtalo mas tarde ',
          })
        }
      },
    })
  }

  crearTramite(host: EditaExpedienteTramitesHost): void {
    if (host.enviandoTramite) {
      return
    }

    host.creartramiteexp.idexpediente = host.idExpediente
    const validacion = validarCrearTramite(host.creartramiteexp)
    if (validacion === 'incomplete') {
      this.notificationService.incompleteFields()
      return
    }
    if (validacion) {
      this.notificationService.error(validacion)
      return
    }

    if (!host.creartramiteexp.fecTramite) {
      host.creartramiteexp.fecTramite = fechaTramitePorDefecto()
    }

    host.enviandoTramite = true

    this.expedientesService.crearTramiteExp(host.creartramiteexp).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (creado) => {
        host.enviandoTramite = false
        this.notificationService.saveSuccess('Trámite')
        this.modalManagerService.closeModal('NuevoTramiteModal')
        host.limpiarFormularioTramite()
        host.nuevotramite = false
        // Selecciona el trámite recién creado igual que si se clicara su fila,
        // para que las tareas disponibles (listatareaprocedi) queden cargadas
        // y "Nueva tarea" funcione sin que el usuario tenga que clicarlo aparte.
        this.cargarTramites(host, (list) => {
          const nuevo = creado?.id != null ? list.find((t) => t.id === creado.id) : undefined
          if (nuevo) {
            host.clickTramiteNuevo?.(nuevo)
          }
        })
      },
      error: (error: HttpErrorResponse) => {
        host.enviandoTramite = false
        let errorMessage = 'Ha ocurrido un error al crear el trámite.'
        if (error.error?.message) {
          errorMessage = error.error.message
        } else if (error.status === 409) {
          errorMessage = 'Ya existe un trámite con estas características.'
        } else if (error.status === 400) {
          errorMessage = 'Los datos proporcionados no son válidos.'
        }
        this.notificationService.error(errorMessage)
        this.modalManagerService.keepModalOpen('NuevoTramiteModal')
      },
    })
  }

  editarTramite(host: EditaExpedienteTramitesHost): void {
    this.expedientesService.EditarTramiteExpedientes(host.editartramiteexp, host.idTramite).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.saveSuccess('Trámite')
        this.modalManagerService.closeModal('editarTramiteModal')
        this.cargarTramites(host)
        host.borrarDatosTramite()
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error al editar el trámite.'
        if (error.error?.message) {
          errorMessage = error.error.message
        } else if (error.status === 400) {
          errorMessage = 'Los datos proporcionados no son válidos.'
        }
        this.notificationService.error(errorMessage)
        this.modalManagerService.keepModalOpen('editarTramiteModal')
      },
    })
  }

  borrarTramite(host: EditaExpedienteTramitesHost, idTramite?: number | null): void {
    const id = idTramite ?? host.idTramite
    if (!id) {
      this.notificationService.warning('Selecciona un trámite para eliminarlo.')
      return
    }

    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Trámite',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.expedientesService.deleteTramite(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          if (host.idTramite === id) {
            host.idTramite = 0
            const uiHost = host as EditaExpedienteTramitesHost & { verTareasdelTramite?: boolean }
            if (uiHost.verTareasdelTramite !== undefined) {
              uiHost.verTareasdelTramite = false
            }
          }
          this.cargarTramites(host)
          this.notificationService.deleteSuccess('Trámite')
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
              title: error.error?.message,
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            })
            return
          }
          this.notificationService.error('No se pudo eliminar el Trámite')
        },
      })
    })
  }

  // --- UI / formularios / navegación (antes TramitesUiFacade) ---

  cancelarnuevotramite(host: EditaExpedienteTramitesUiHost): void {
    host.nuevotramite = false
    host.creartramiteexp = crearTramiteExpVacio()
    host.FechaSistema()
  }

  limpiarFormularioTramite(host: EditaExpedienteTramitesUiHost): void {
    host.creartramiteexp = crearTramiteExpVacio()
    host.nuevotramite = false
  }

  habilitaTramiteExp(host: EditaExpedienteTramitesUiHost): void {
    host.nuevotramite = true
    host.verTareasdelTramite = false
    host.creartramiteexp = crearTramiteExpVacio()
    aplicarFechaTramitePorDefecto(host.creartramiteexp)
  }

  abrirModalNuevoTramite(host: EditaExpedienteTramitesHost & EditaExpedienteTramitesUiHost): void {
    host.enviandoTramite = false
    this.habilitaTramiteExp(host)
    this.modalManagerService.openModal('NuevoTramiteModal')
    window.setTimeout(() => this.limpiarErroresTramite(), 50)
  }

  validateAndCreateTramite(event: Event, crearTramExp: () => void): void {
    event.preventDefault()
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields()
      return
    }
    crearTramExp()
  }

  validateAndEditTramite(event: Event, editarTramite: () => void): void {
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields()
      return
    }
    editarTramite()
  }

  limpiarErroresTramite(): void {
    limpiarErroresFormulario('formNuevoTramite', false)
  }

  limpiarErroresEditarTramite(): void {
    limpiarErroresFormulario('formEditarTramite')
  }

  veotramitadores(host: EditaExpedienteTramitesUiHost & { veoTramitadores?: boolean }): void {
    host.veoTramitadores = true
    host.recargarSourceTramitadores()
    // Diferir la apertura para que Angular pinte el *ngIf del listado antes del show de Bootstrap.
    window.setTimeout(() => {
      this.modalManagerService.openModal('ListadoTramitadoresModal')
    }, 0)
  }

  verNotificaciones(
    host: EditaExpedienteTramitesUiHost & {
      veonotificaciones?: boolean
      notifUiFacade?: { verInfoNotifi: boolean }
      idNotificacion?: number
    },
    refrescar: () => void,
  ): void {
    host.veonotificaciones = true
    if (host.notifUiFacade) {
      host.notifUiFacade.verInfoNotifi = false
    }
    host.idNotificacion = 0
    refrescar()
    // Diferir la apertura para que Angular pinte el *ngIf del listado antes del show de Bootstrap.
    window.setTimeout(() => {
      this.modalManagerService.openModal('ListadoNotificacionesModal')
    }, 0)
  }

  noverNotificaciones(host: EditaExpedienteTramitesUiHost): void {
    this.cerrarModalNotificaciones(host as never)
    this.modalManagerService.closeModal('ListadoNotificacionesModal')
  }

  cerrarModalNotificaciones(host: {
    veonotificaciones?: boolean
    notifUiFacade?: { verInfoNotifi: boolean }
    idNotificacion?: number
  }): void {
    host.veonotificaciones = false
    if (host.notifUiFacade) {
      host.notifUiFacade.verInfoNotifi = false
    }
    host.idNotificacion = 0
  }

  cerrarModalTramitadores(host: { veoTramitadores?: boolean }): void {
    host.veoTramitadores = false
  }
}
