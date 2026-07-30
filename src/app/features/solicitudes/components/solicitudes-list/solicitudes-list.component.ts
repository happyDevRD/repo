import { AfterViewInit, Component, ViewChild, inject } from '@angular/core'
import { IflowGridComponent } from 'src/app/shared/components/iflow-grid/iflow-grid.component'
import { JqxGridRowEvent } from 'src/app/core/helper/jqx-grid-event.model'
import { SolicitudListar } from '../../models'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
})
export class SolicitudesListComponent implements AfterViewInit {
  readonly s = inject(SolicitudesComponent)

  @ViewChild('gridSolicitudes') gridSolicitudes: IflowGridComponent

  ngAfterViewInit(): void {
    this.s.myGrid = this.gridSolicitudes
  }

  handleRowClick(event: unknown): void {
    this.s.selecsolicitudNueva(event as JqxGridRowEvent<SolicitudListar>)
  }

  handleRowDoubleClick(event: unknown): void {
    this.s.abrirModalEdicionSolicitud(event as JqxGridRowEvent<SolicitudListar>)
  }
}
