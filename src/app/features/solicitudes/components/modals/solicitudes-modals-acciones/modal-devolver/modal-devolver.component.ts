import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-devolver',
  templateUrl: './modal-devolver.component.html',
})
export class SolicitudesModalDevolverComponent {
  readonly s = inject(SolicitudesComponent)
}
