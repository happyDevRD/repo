import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'

@Component({
  selector: 'app-expedientes-header',
  templateUrl: './expedientes-header.component.html',
})
export class ExpedientesHeaderComponent {
  readonly e = inject(ExpedientesComponent)
}
