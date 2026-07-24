import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'


@Component({
  selector: 'app-edita-modal-baja-objeto-tributario-modal',
  templateUrl: './modal-baja-objeto-tributario-modal.component.html',
})
export class EditaModalBajaObjetoTributarioModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
}
