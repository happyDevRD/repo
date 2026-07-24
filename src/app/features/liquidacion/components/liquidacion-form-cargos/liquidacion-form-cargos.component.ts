import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { LiquidacionFormComponent } from '../liquidacion-form/liquidacion-form.component'

@Component({
  selector: 'app-liquidacion-form-cargos',
  templateUrl: './liquidacion-form-cargos.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class LiquidacionFormCargosComponent {
  readonly lf = inject(LiquidacionFormComponent)
}
