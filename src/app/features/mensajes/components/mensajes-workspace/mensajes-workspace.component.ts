import { Component, inject } from '@angular/core'
import { MensajesComponent } from '../../mensajes.component'

@Component({
  selector: 'app-mensajes-workspace',
  templateUrl: './mensajes-workspace.component.html',
})
export class MensajesWorkspaceComponent {
  readonly m = inject(MensajesComponent)
}
