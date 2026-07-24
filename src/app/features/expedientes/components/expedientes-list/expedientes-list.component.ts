import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'

@Component({
  selector: 'app-expedientes-list',
  templateUrl: './expedientes-list.component.html',
})
export class ExpedientesListComponent {
  readonly e = inject(ExpedientesComponent)
}
