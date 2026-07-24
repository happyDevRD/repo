import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { GenerarEntradaComponent } from '../../generar-entrada.component'

@Component({
  selector: 'app-generar-entrada-factura',
  templateUrl: './generar-entrada-factura.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class GenerarEntradaFacturaComponent {
  readonly ge = inject(GenerarEntradaComponent)
}
