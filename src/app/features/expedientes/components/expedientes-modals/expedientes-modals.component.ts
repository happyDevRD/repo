import { AfterViewInit, Component, ViewChild, inject } from '@angular/core'
import { IflowGridComponent } from 'src/app/shared/components/iflow-grid/iflow-grid.component'
import { ExpedientesComponent } from '../../expedientes.component'

@Component({
  selector: 'app-expedientes-modals',
  templateUrl: './expedientes-modals.component.html',
})
export class ExpedientesModalsComponent implements AfterViewInit {
  readonly e = inject(ExpedientesComponent)

  @ViewChild('gridAtributosExp') gridAtributosExp?: IflowGridComponent
  @ViewChild('gridTareasExpediente') gridTareasExpediente?: IflowGridComponent

  ngAfterViewInit(): void {
    this.e.gridAtributosExp = this.gridAtributosExp
    this.e.gridTareasExpediente = this.gridTareasExpediente
  }
}
