import { Component, ViewChild, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { GenerarEntradaComponent } from '../../../../../../generar-entrada/generar-entrada.component'


@Component({
  selector: 'app-edita-modal-generar-entrada-modal',
  templateUrl: './modal-generar-entrada-modal.component.html',
})
export class EditaModalGenerarEntradaModalComponent {
  readonly edita = inject(EditaExpedienteComponent)

  @ViewChild(GenerarEntradaComponent) ge?: GenerarEntradaComponent

  handleCancelar(): void {
    if (this.ge) {
      this.ge.closeModal()
      return
    }
    this.edita.closeGenerarEntradaModal()
  }

  handleGenerar(): void {
    this.ge?.onSubmit()
  }

  get isGenerarDisabled(): boolean {
    return !this.ge || !!this.ge.loading
  }
}
