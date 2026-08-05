import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'
import { EditaExpedienteLifecycleFacade } from '../../../../services/edita-expediente-lifecycle.facade'
import { NotificationService } from '../../../../../../../core/service/notification.service'
import { validarFormularioBootstrap } from '../../../../../../../core/helper/bootstrap-form.helper'

import {
  trackById,
  trackByNotificador,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-crear-notificacion-modal',
  templateUrl: './modal-crear-notificacion-modal.component.html',
})
export class EditaModalCrearNotificacionModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
  readonly lifecycle = inject(EditaExpedienteLifecycleFacade)
  private readonly notificationService = inject(NotificationService)
  readonly trackById = trackById
  readonly trackByNotificador = trackByNotificador

  handleSubmit(event: Event): void {
    if (!validarFormularioBootstrap(event, this.notificationService)) {
      this.notif.limpiarCacheValidacion()
      return
    }
    this.notif.solicitarCreacionNotificacion(this.edita)
  }
}
