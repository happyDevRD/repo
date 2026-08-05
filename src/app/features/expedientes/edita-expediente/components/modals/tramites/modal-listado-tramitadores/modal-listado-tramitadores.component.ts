import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTramitesFacade } from '../../../../tramites/edita-expediente-tramites.facade'

@Component({
  selector: 'app-edita-modal-listado-tramitadores',
  templateUrl: './modal-listado-tramitadores.component.html',
})
export class EditaModalListadoTramitadoresComponent {
  readonly edita = inject(EditaExpedienteComponent)
  private readonly tramites = inject(EditaExpedienteTramitesFacade)

  handleCerrar(): void {
    this.edita.cerrarModal('ListadoTramitadoresModal')
    this.tramites.cerrarModalTramitadores(this.edita)
  }

  handleClosed(): void {
    this.tramites.cerrarModalTramitadores(this.edita)
  }
}
