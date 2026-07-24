import { HttpErrorResponse } from '@angular/common/http'
import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CrearTramiteExp, EditarTramiteExp, ListarTramites } from '../../expedientes'
import { NotificationService } from '../../../../core/service/notification.service'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { ExpedientesService } from '../../expedientes.service'
import { buildTramiteGridSource } from './tramites-grid.config'
import { fechaTramitePorDefecto, validarCrearTramite } from './tramites-validacion.helper'
import {
  aplicarFechaTramitePorDefecto,
  crearTramiteExpVacio,
} from './tramites-form-validation.helper'
import {
  limpiarErroresFormulario,
  validarFormularioBootstrap,
} from '../../../../core/helper/bootstrap-form.helper'
import {
  aplicarVistaNotificaciones,
  aplicarVistaTramitadores,
  aplicarVistaTramite,
} from '../shared/edita-expediente-panel-navegacion.helper'

export interface EditaExpedienteTramitesGridHost {
  idExpediente: number
  sourceTramite: unknown
}

export interface EditaExpedienteTramitesHost extends EditaExpedienteTramitesGridHost {
  idTramite: number
  creartramiteexp: CrearTramiteExp
  editartramiteexp: EditarTramiteExp
  enviandoTramite: boolean
  nuevotramite: boolean
  recargarpagina(): void
  limpiarFormularioTramite(): void
  borrarDatosTramite(): void
}

/** Host UI/navegación de trámites (antes TramitesUiHost). */
export interface EditaExpedienteTramitesUiHost {
  nuevotramite: boolean
  verTareasdelTramite: boolean
  creartramiteexp: CrearTramiteExp
  FechaSistema(): void
  verExpediente: { ejercicio: number; numero: number }
  sourceListarNotifi: unknown
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

  configurarGridTramites(
    idExpediente: number,
    onListar: (tramites: ListarTramites[]) => void,
  ): Record<string, unknown> {
    this.expedientesService.getTramitesListar(idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (listartramites) => onListar(listartramites),
      error: (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.notificationService.error({
            title: 'Oops...',
            text: 'Parece que no hay conexión con la Base de Datos',
            footer: 'Inténtalo mas tarde ',
          })
        }
      },
    })

    return buildTramiteGridSource(idExpediente)
  }

  refrescarGrid(host: EditaExpedienteTramitesGridHost): void {
    host.sourceTramite = buildTramiteGridSource(host.idExpediente)
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
      next: () => {
        host.enviandoTramite = false
        this.notificationService.saveSuccess('Trámite')
        this.modalManagerService.closeModal('NuevoTramiteModal')
        this.refrescarGrid(host)
        host.limpiarFormularioTramite()
        host.nuevotramite = false
        setTimeout(host.recargarpagina, 1000)
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
        this.refrescarGrid(host)
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

  borrarTramite(host: EditaExpedienteTramitesHost): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Trámite',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.expedientesService.deleteTramite(host.idTramite).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.refrescarGrid(host)
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
    host.nuevotramite = false
    host.FechaSistema()
  }

  limpiarFormularioTramite(host: EditaExpedienteTramitesUiHost): void {
    host.creartramiteexp = crearTramiteExpVacio()
    host.nuevotramite = false
  }

  habilitaTramiteExp(host: EditaExpedienteTramitesUiHost): void {
    host.nuevotramite = true
    host.verTareasdelTramite = false
    aplicarFechaTramitePorDefecto(host.creartramiteexp)
  }

  validateAndCreateTramite(event: Event, crearTramExp: () => void): void {
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
    limpiarErroresFormulario('formNuevoTramite', true)
  }

  limpiarErroresEditarTramite(): void {
    limpiarErroresFormulario('formEditarTramite')
  }

  veotramitadores(host: EditaExpedienteTramitesUiHost): void {
    aplicarVistaTramitadores(host as never)
  }

  verNotificaciones(
    host: EditaExpedienteTramitesUiHost,
    crearGrid: (ejercicio: number, numero: number) => unknown,
  ): void {
    aplicarVistaNotificaciones(host as never, crearGrid)
  }

  noverNotificaciones(host: EditaExpedienteTramitesUiHost): void {
    aplicarVistaTramite(host as never)
  }
}
