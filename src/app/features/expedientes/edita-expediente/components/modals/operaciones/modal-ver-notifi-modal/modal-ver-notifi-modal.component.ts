import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'

import {
  trackByMotNotif,
  trackByNotificador,
  trackByReceptor,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-ver-notifi-modal',
  templateUrl: './modal-ver-notifi-modal.component.html',
})
export class EditaModalVerNotifiModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
  readonly trackByMotNotif = trackByMotNotif
  readonly trackByNotificador = trackByNotificador
  readonly trackByReceptor = trackByReceptor
}
