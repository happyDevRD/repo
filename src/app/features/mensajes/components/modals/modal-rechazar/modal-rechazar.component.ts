import { Component, inject } from '@angular/core'
import { MensajesComponent } from '../../../mensajes.component'

@Component({
  selector: 'app-mensajes-modal-rechazar',
  templateUrl: './modal-rechazar.component.html',
})
export class MensajesModalRechazarComponent {
  readonly m = inject(MensajesComponent)

  handleCancelar(): void {
    this.m.limpiaRechazarMensaje()
    this.m.cerrarModal('DevolverMensajeModal')
  }
}
