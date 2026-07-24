import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteOperacionesFacade } from '../../../../operaciones/edita-expediente-operaciones.facade'

@Component({
  selector: 'app-edita-modal-generar-propuesta-resolucion-modal',
  templateUrl: './modal-generar-propuesta-resolucion-modal.component.html',
})
export class EditaModalGenerarPropuestaResolucionModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly ops = inject(EditaExpedienteOperacionesFacade)
}
