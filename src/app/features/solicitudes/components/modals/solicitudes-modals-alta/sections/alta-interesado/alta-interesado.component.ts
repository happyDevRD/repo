import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../../solicitudes.component'
import { trackById } from 'src/app/core/helper/track-by.helper'

@Component({
  selector: 'app-solicitudes-alta-interesado',
  templateUrl: './alta-interesado.component.html',
})
export class SolicitudesAltaInteresadoComponent {
  readonly s = inject(SolicitudesComponent)
  readonly trackById = trackById
}
