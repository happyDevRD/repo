import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-workspace',
  templateUrl: './solicitudes-workspace.component.html',
})
export class SolicitudesWorkspaceComponent {
  readonly s = inject(SolicitudesComponent)
}