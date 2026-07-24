import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { GenerarEntradaComponent } from '../../generar-entrada.component'

@Component({
  selector: 'app-generar-entrada-datos',
  templateUrl: './generar-entrada-datos.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class GenerarEntradaDatosComponent {
  readonly ge = inject(GenerarEntradaComponent)
}
