import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-header',
  templateUrl: './solicitudes-header.component.html',
})
export class SolicitudesHeaderComponent {
  private readonly s = inject(SolicitudesComponent)

  handleNuevaSolicitud(): void {
    this.s.abrirModal('nsolicitudModal')
  }
}
