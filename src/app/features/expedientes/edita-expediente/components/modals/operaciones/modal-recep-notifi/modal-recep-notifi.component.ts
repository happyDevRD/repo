import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'

import {
  trackByReceptor,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-recep-notifi',
  templateUrl: './modal-recep-notifi.component.html',
})
export class EditaModalRecepNotifiComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
  readonly trackByReceptor = trackByReceptor
}
