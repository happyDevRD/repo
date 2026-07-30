import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTramitesFacade } from '../../../../tramites/edita-expediente-tramites.facade'

@Component({
  selector: 'app-edita-modal-nuevo-tramite-modal',
  templateUrl: './modal-nuevo-tramite-modal.component.html',
})
export class EditaModalNuevoTramiteModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tramites = inject(EditaExpedienteTramitesFacade)

  handleSubmit(event: Event): void {
    this.tramites.validateAndCreateTramite(event, () => this.tramites.crearTramite(this.edita))
  }

  handleCancelar(): void {
    this.tramites.limpiarErroresTramite()
    this.tramites.cancelarnuevotramite(this.edita)
    this.edita.cerrarModal('NuevoTramiteModal')
  }
}
