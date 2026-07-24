import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../edita-expediente.component'

@Component({
  selector: 'app-edita-expediente-modals-tramites',
  templateUrl: './edita-expediente-modals-tramites.component.html',
})
export class EditaExpedienteModalsTramitesComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
