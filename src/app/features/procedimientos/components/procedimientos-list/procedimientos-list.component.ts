import { Component, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'
import { Procedimiento } from '../../procedimiento'

@Component({
  selector: 'app-procedimientos-list',
  templateUrl: './procedimientos-list.component.html',
})
export class ProcedimientosListComponent {
  readonly p = inject(ProcedimientosComponent)

  readonly modalidadValue = (row: Procedimiento): string => this.p.getModalidadLabelFor(row.modalidad)
  readonly materiaValue = (row: Procedimiento): string => this.p.getMateriaLabelFor(row.idMatProce)
}
