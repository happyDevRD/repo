import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-asignar',
  templateUrl: './modal-asignar.component.html',
})
export class SolicitudesModalAsignarComponent {
  readonly s = inject(SolicitudesComponent)
}
