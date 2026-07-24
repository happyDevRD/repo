import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'

import {
  trackByNumDocum,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-archifirmaef',
  templateUrl: './modal-archifirmaef.component.html',
})
export class EditaModalArchifirmaefComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  readonly trackByNumDocum = trackByNumDocum
}
