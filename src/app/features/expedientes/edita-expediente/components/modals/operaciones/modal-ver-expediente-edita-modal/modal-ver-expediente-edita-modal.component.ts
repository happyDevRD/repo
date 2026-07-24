import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'


@Component({
  selector: 'app-edita-modal-ver-expediente-edita-modal',
  templateUrl: './modal-ver-expediente-edita-modal.component.html',
})
export class EditaModalVerExpedienteEditaModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
