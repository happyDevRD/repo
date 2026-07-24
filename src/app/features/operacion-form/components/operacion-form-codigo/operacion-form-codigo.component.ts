import { Component, inject } from '@angular/core'
import { ControlContainer, FormGroupDirective } from '@angular/forms'
import { OperacionFormComponent } from '../../operacion-form.component'

@Component({
  selector: 'app-operacion-form-codigo',
  templateUrl: './operacion-form-codigo.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class OperacionFormCodigoComponent {
  readonly op = inject(OperacionFormComponent)
}
