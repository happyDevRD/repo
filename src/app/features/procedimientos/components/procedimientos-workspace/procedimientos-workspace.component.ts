import { AfterViewInit, Component, ViewChild, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'

@Component({
  selector: 'app-procedimientos-workspace',
  templateUrl: './procedimientos-workspace.component.html',
})
export class ProcedimientosWorkspaceComponent implements AfterViewInit {
  readonly p = inject(ProcedimientosComponent)

  @ViewChild('gridTareas') gridTareas: any
  @ViewChild('gridPermisos') gridPermisos: any
  @ViewChild('gridAtributos') gridAtributos: any

  ngAfterViewInit(): void {
    this.p.gridTareas = this.gridTareas
    this.p.gridPermisos = this.gridPermisos
    this.p.gridAtributos = this.gridAtributos
  }
}
