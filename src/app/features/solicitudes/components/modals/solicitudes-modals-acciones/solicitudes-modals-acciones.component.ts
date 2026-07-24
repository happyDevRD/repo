import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modals-acciones',
  templateUrl: './solicitudes-modals-acciones.component.html',
})
export class SolicitudesModalsAccionesComponent {
  readonly s = inject(SolicitudesComponent)
}
