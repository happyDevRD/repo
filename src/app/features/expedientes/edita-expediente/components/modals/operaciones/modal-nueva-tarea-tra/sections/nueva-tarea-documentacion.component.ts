import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { EditaExpedienteComponent } from '../../../../../edita-expediente.component'

@Component({
  selector: 'app-nueva-tarea-documentacion',
  templateUrl: './nueva-tarea-documentacion.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class NuevaTareaDocumentacionComponent {
  readonly edita = inject(EditaExpedienteComponent)
}
