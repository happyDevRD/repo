import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteOperacionesFacade } from '../../../../operaciones/edita-expediente-operaciones.facade'


@Component({
  selector: 'app-edita-modal-inside-remision-justicia-modal',
  templateUrl: './modal-inside-remision-justicia-modal.component.html',
})
export class EditaModalInsideRemisionJusticiaModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly ops = inject(EditaExpedienteOperacionesFacade)
}
