import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'

@Component({
  selector: 'app-expedientes-acciones',
  templateUrl: './expedientes-acciones.component.html',
})
export class ExpedientesAccionesComponent {
  readonly e = inject(ExpedientesComponent)
}
