import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'


@Component({
  selector: 'app-edita-modal-liquidacion-modal',
  templateUrl: './modal-liquidacion-modal.component.html',
})
export class EditaModalLiquidacionModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
}
