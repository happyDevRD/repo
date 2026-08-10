import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-context',
  templateUrl: './solicitudes-context.component.html',
})
export class SolicitudesContextComponent {
  readonly s = inject(SolicitudesComponent)

  handleIniciarExpediente(): void {
    this.s.prepararIniciarExpediente()
    this.s.abrirModal('iniciarExpedieModal')
  }
}
