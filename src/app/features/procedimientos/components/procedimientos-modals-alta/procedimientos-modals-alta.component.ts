import { Component, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'

@Component({
  selector: 'app-procedimientos-modals-alta',
  templateUrl: './procedimientos-modals-alta.component.html',
})
export class ProcedimientosModalsAltaComponent {
  readonly p = inject(ProcedimientosComponent)
}
