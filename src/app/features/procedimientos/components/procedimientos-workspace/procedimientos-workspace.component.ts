import { Component, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'
import { AtributosListar, ListaTareaProcedi, ProcediPermisosListar } from '../../procedimiento'

@Component({
  selector: 'app-procedimientos-workspace',
  templateUrl: './procedimientos-workspace.component.html',
})
export class ProcedimientosWorkspaceComponent {
  readonly p = inject(ProcedimientosComponent)

  readonly tareaRowClass = (row: ListaTareaProcedi): Record<string, boolean> => ({
    'table-active': this.p.idverTarea === row.id,
  })

  readonly permisoRowClass = (row: ProcediPermisosListar): Record<string, boolean> => ({
    'table-active': this.p.idPermisoProcedimiento === row.id,
  })

  readonly atributoRowClass = (row: AtributosListar): Record<string, boolean> => ({
    'table-active': this.p.idAtrib === row.idAtrib,
  })

  readonly accionValue = (row: ListaTareaProcedi): string => this.p.getAccionLabel(row.accion)

  readonly requeridoValue = (row: AtributosListar): string => (row.requerido == 1 ? 'Si' : 'No')
}
