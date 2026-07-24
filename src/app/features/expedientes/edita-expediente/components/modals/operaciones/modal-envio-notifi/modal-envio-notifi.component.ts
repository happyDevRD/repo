import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'


@Component({
  selector: 'app-edita-modal-envio-notifi',
  templateUrl: './modal-envio-notifi.component.html',
})
export class EditaModalEnvioNotifiComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
}
