import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'


@Component({
  selector: 'app-edita-modal-historico-modal',
  templateUrl: './modal-historico-modal.component.html',
})
export class EditaModalHistoricoModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
