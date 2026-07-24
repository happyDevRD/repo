import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTramitesFacade } from '../../../../tramites/edita-expediente-tramites.facade'

@Component({
  selector: 'app-edita-modal-editar-tramite-modal',
  templateUrl: './modal-editar-tramite-modal.component.html',
})
export class EditaModalEditarTramiteModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tramites = inject(EditaExpedienteTramitesFacade)

  handleSubmit(event: Event): void {
    this.tramites.validateAndEditTramite(event, () => this.tramites.editarTramite(this.edita))
  }
}
