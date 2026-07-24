import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteWorkspaceFacade } from '../../../../services/edita-expediente-workspace.facade'

@Component({
  selector: 'app-edita-modal-operacion-form',
  templateUrl: './modal-operacion-form.component.html',
})
export class EditaModalOperacionFormComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly workspace = inject(EditaExpedienteWorkspaceFacade)
}
