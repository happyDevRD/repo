import { Component, inject } from '@angular/core';
import { EditaExpedienteComponent } from '../../edita-expediente.component';

@Component({
  selector: 'app-edita-expediente-modals',
  templateUrl: './edita-expediente-modals.component.html',
})
export class EditaExpedienteModalsComponent {
  readonly edita = inject(EditaExpedienteComponent);
}
