import { AfterViewInit, Component, ViewChild, inject } from '@angular/core'
import { ProcedimientosComponent } from '../../procedimientos.component'

@Component({
  selector: 'app-procedimientos-list',
  templateUrl: './procedimientos-list.component.html',
})
export class ProcedimientosListComponent implements AfterViewInit {
  readonly p = inject(ProcedimientosComponent)

  @ViewChild('gridProcedimientos') gridProcedimientos: any

  ngAfterViewInit(): void {
    this.p.gridProcedimientos = this.gridProcedimientos
  }
}
