import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'

@Component({
  selector: 'app-edita-modal-publi-notif-modal',
  templateUrl: './modal-publi-notif-modal.component.html',
})
export class EditaModalPubliNotifModalComponent {
  /** Solo para campos residuales del container (p.ej. selected). */
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
}
