import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../../solicitudes.component'
import { trackById } from 'src/app/core/helper/track-by.helper'
import { RepresentanteExpLIstar } from 'src/app/features/expedientes/expedientes'

@Component({
  selector: 'app-solicitudes-alta-representante',
  templateUrl: './alta-representante.component.html',
})
export class SolicitudesAltaRepresentanteComponent {
  readonly s = inject(SolicitudesComponent)
  readonly trackById = trackById

  trackByRepre = (_index: number, item: RepresentanteExpLIstar): string =>
    `${item.idPerso}-${item.idHisPerso}`
}
