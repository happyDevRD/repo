import { Component, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'
import { trackByPlantilla, trackByValor } from '../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-procedimientos-modals',
  templateUrl: './procedimientos-modals.component.html',
})
export class ProcedimientosModalsComponent {
  readonly p = inject(ProcedimientosComponent)
  readonly trackByPlantilla = trackByPlantilla
  readonly trackByValor = trackByValor

  trackByProcesoFirmado(_index: number, item: { procesoFirmadoDefecto?: string | number }): string | number {
    return item?.procesoFirmadoDefecto ?? _index
  }
}
