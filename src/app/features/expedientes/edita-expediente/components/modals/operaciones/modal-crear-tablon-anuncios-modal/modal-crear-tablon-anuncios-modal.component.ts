import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'


@Component({
  selector: 'app-edita-modal-crear-tablon-anuncios-modal',
  templateUrl: './modal-crear-tablon-anuncios-modal.component.html',
})
export class EditaModalCrearTablonAnunciosModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
}
