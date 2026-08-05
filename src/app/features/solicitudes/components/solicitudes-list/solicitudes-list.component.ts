import { Component, inject } from '@angular/core'
import { SolicitudListar } from '../../models'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
})
export class SolicitudesListComponent {
  readonly s = inject(SolicitudesComponent)

  handleRowClick(row: SolicitudListar): void {
    this.s.selecsolicitudNueva(row)
  }

  handleRowDoubleClick(row: SolicitudListar): void {
    this.s.abrirModalEdicionSolicitud(row)
  }
}
