import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-iniciar-expediente',
  templateUrl: './modal-iniciar-expediente.component.html',
})
export class SolicitudesModalIniciarExpedienteComponent {
  readonly s = inject(SolicitudesComponent)
}
