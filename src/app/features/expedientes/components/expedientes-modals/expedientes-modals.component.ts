import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'

@Component({
  selector: 'app-expedientes-modals',
  templateUrl: './expedientes-modals.component.html',
})
export class ExpedientesModalsComponent {
  readonly e = inject(ExpedientesComponent)
}
