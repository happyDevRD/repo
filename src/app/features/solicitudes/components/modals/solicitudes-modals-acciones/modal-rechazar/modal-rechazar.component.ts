import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-rechazar',
  templateUrl: './modal-rechazar.component.html',
})
export class SolicitudesModalRechazarComponent {
  readonly s = inject(SolicitudesComponent)
}
