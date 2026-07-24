import { Component, inject } from '@angular/core'
import { MensajesComponent } from '../../mensajes.component'

@Component({
  selector: 'app-mensajes-context',
  templateUrl: './mensajes-context.component.html',
})
export class MensajesContextComponent {
  readonly m = inject(MensajesComponent)

  handleRechazar(): void {
    this.m.abrirModal('DevolverMensajeModal')
  }

  handleTramitar(): void {
    this.m.TramitarMensaje()
  }
}
