import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'


@Component({
  selector: 'app-edita-modal-generar-entrada-modal',
  templateUrl: './modal-generar-entrada-modal.component.html',
})
export class EditaModalGenerarEntradaModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
