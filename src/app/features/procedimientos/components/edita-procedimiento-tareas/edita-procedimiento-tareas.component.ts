import { Component, inject } from '@angular/core'
import { EditaProcedimientoComponent } from '../../edita-procedimiento.component'
import { trackByPlantilla, trackByUsuario } from '../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-procedimiento-tareas',
  templateUrl: './edita-procedimiento-tareas.component.html',
})
export class EditaProcedimientoTareasComponent {
  readonly ep = inject(EditaProcedimientoComponent)
  readonly trackByUsuario = trackByUsuario
  readonly trackByPlantilla = trackByPlantilla

  trackByIdProFirma(_index: number, item: { idProFirma?: string | number }): string | number {
    return item?.idProFirma ?? _index
  }
}
