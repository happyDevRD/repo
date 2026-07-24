import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'


@Component({
  selector: 'app-edita-modal-metadatos-modal',
  templateUrl: './modal-metadatos-modal.component.html',
})
export class EditaModalMetadatosModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
