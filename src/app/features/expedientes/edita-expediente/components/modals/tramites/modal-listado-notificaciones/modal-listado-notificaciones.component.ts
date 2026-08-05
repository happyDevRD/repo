import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTramitesFacade } from '../../../../tramites/edita-expediente-tramites.facade'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'
import { ModalManagerService } from '../../../../../../../core/service/modal-manager.service'
import { ModalActionEvent } from '../../../../../../../shared/modals/modal-action.model'
import { fechaHoyISO } from '../../../../../../../core/helper/fecha-legacy.helper'

@Component({
  selector: 'app-edita-modal-listado-notificaciones',
  templateUrl: './modal-listado-notificaciones.component.html',
})
export class EditaModalListadoNotificacionesComponent {
  readonly edita = inject(EditaExpedienteComponent)
  private readonly tramites = inject(EditaExpedienteTramitesFacade)
  private readonly notifUiFacade = inject(EditaExpedienteNotificacionesUiFacade)
  private readonly modalManager = inject(ModalManagerService)

  handleNotificacionAction(event: ModalActionEvent): void {
    const id = this.notifUiFacade.idNotificacion
    switch (event.id) {
      case 'teu':
      case 'reenviarTeu':
        this.notifUiFacade.abrirModalEnvioTeu()
        return
      case 'enviarNotifica':
        this.notifUiFacade.enviarANotificaPlataforma()
        return
      case 'sincronizar':
        this.notifUiFacade.sincronizarConNotificaPlataforma()
        return
      case 'enviar':
        this.notifUiFacade.creanotificacion.fecEnvio = fechaHoyISO()
        this.modalManager.openModal('EnvioNotifi')
        return
      case 'recepcionar':
        this.notifUiFacade.creanotificacion.fecRecNotif = fechaHoyISO()
        this.modalManager.openModal('RecepNotifi')
        return
      case 'devolver':
        this.notifUiFacade.creanotificacion.fecRecNotif = fechaHoyISO()
        this.modalManager.openModal('DevolverNotifi')
        return
      case 'publicar':
        this.notifUiFacade.creanotificacion.fecPubBop = fechaHoyISO()
        this.modalManager.openModal('PubliNotifModal')
        return
      case 'anular':
        this.notifUiFacade.anularNotificacion()
        return
      case 'ver':
        if (id != null) {
          this.notifUiFacade.verNotificacion(undefined, id)
        }
        return
      case 'borrar':
        if (id != null) {
          this.notifUiFacade.borrarNotificacion(undefined, id)
        }
        return
      case 'descargaTeu':
        this.notifUiFacade.descargarFichero()
        return
      default:
        return
    }
  }

  handleCerrar(): void {
    this.edita.cerrarModal('ListadoNotificacionesModal')
    this.tramites.cerrarModalNotificaciones(this.edita)
  }

  handleClosed(): void {
    this.tramites.cerrarModalNotificaciones(this.edita)
  }
}
