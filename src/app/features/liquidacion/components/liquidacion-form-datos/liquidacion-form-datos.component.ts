import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { LiquidacionFormComponent } from '../liquidacion-form/liquidacion-form.component'

@Component({
  selector: 'app-liquidacion-form-datos',
  templateUrl: './liquidacion-form-datos.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class LiquidacionFormDatosComponent {
  readonly lf = inject(LiquidacionFormComponent)
}
