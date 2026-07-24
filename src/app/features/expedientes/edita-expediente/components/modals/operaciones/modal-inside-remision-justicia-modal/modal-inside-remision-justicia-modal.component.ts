import { Component, Input, inject } from '@angular/core'
import { EditaExpedienteInsideHost, InsideAccionesFacade } from '../../../../../../../core/service/inside/inside-acciones.facade'


@Component({
  selector: 'app-edita-modal-inside-remision-justicia-modal',
  templateUrl: './modal-inside-remision-justicia-modal.component.html',
})
export class EditaModalInsideRemisionJusticiaModalComponent {
  @Input({ required: true }) host!: EditaExpedienteInsideHost
  readonly ops = inject(InsideAccionesFacade)
}
