import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modals-edicion',
  templateUrl: './solicitudes-modals-edicion.component.html',
})
export class SolicitudesModalsEdicionComponent {
  readonly s = inject(SolicitudesComponent)
}
