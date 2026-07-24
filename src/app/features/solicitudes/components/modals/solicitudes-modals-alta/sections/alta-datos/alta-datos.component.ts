import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../../solicitudes.component'
import { trackByUsuario } from 'src/app/core/helper/track-by.helper'

@Component({
  selector: 'app-solicitudes-alta-datos',
  templateUrl: './alta-datos.component.html',
})
export class SolicitudesAltaDatosComponent {
  readonly s = inject(SolicitudesComponent)
  readonly trackByUsuario = trackByUsuario
}
