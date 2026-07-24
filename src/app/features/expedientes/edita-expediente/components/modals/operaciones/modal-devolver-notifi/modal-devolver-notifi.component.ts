import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'

import {
  trackByMotNotif,
  trackByNotificador,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-devolver-notifi',
  templateUrl: './modal-devolver-notifi.component.html',
})
export class EditaModalDevolverNotifiComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
  readonly trackByMotNotif = trackByMotNotif
  readonly trackByNotificador = trackByNotificador
}
