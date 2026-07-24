import { Component, inject } from '@angular/core'
import { ControlContainer, FormGroupDirective } from '@angular/forms'
import { OperacionFormComponent } from '../../operacion-form.component'

@Component({
  selector: 'app-operacion-form-detalle',
  templateUrl: './operacion-form-detalle.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class OperacionFormDetalleComponent {
  readonly op = inject(OperacionFormComponent)
}
