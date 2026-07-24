import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-asignar-instructor',
  templateUrl: './modal-asignar-instructor.component.html',
})
export class SolicitudesModalAsignarInstructorComponent {
  readonly s = inject(SolicitudesComponent)
}
