import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'

@Component({
  selector: 'app-edita-modal-nueva-tarea-tra',
  templateUrl: './modal-nueva-tarea-tra.component.html',
})
export class EditaModalNuevaTareaTraComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
}
