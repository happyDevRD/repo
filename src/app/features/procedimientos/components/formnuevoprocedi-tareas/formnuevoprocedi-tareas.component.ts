import { Component, inject } from '@angular/core'
import { FormnuevoprocediComponent } from '../../formnuevoprocedi.component'
import { trackByPlantilla } from '../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-formnuevoprocedi-tareas',
  templateUrl: './formnuevoprocedi-tareas.component.html',
})
export class FormnuevoprocediTareasComponent {
  readonly fn = inject(FormnuevoprocediComponent)
  readonly trackByPlantilla = trackByPlantilla

  trackByIdProFirma(_index: number, item: { idProFirma?: string | number }): string | number {
    return item?.idProFirma ?? _index
  }

  trackByTareaId(_index: number, item: { id?: string | number }): string | number {
    return item?.id ?? _index
  }
}
