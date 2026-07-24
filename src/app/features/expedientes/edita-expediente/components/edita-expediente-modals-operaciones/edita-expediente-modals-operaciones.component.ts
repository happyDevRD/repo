import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../edita-expediente.component'

@Component({
  selector: 'app-edita-expediente-modals-operaciones',
  templateUrl: './edita-expediente-modals-operaciones.component.html',
})
export class EditaExpedienteModalsOperacionesComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
