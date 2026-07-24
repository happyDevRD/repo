import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modals-alta',
  templateUrl: './solicitudes-modals-alta.component.html',
})
export class SolicitudesModalsAltaComponent {
  readonly s = inject(SolicitudesComponent)
}
