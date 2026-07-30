import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import {
  IflowGridComponent,
  IflowGridColumns,
  IflowGridLocalization,
  IflowGridSource,
} from '../../../../../shared/components/iflow-grid/iflow-grid.component'
import { JqxGridRowEvent } from '../../../../../core/helper/jqx-grid-event.model'
import { TramitadorGridRow } from '../../services/edita-expediente-workspace.facade'

@Component({
  selector: 'app-edita-expediente-workspace-tramitadores',
  templateUrl: './edita-expediente-workspace-tramitadores.component.html',
})
export class EditaExpedienteWorkspaceTramitadoresComponent {
  @Input() visible = false
  @Input() columns: IflowGridColumns = []
  @Input() source: IflowGridSource
  @Input() localization: IflowGridLocalization

  @Output() rowClick = new EventEmitter<JqxGridRowEvent<TramitadorGridRow>>()
  @Output() rowDoubleClick = new EventEmitter<JqxGridRowEvent<TramitadorGridRow>>()

  @ViewChild('gridTramitadores') gridTramitadores?: IflowGridComponent

  handleRowClick(event: JqxGridRowEvent<TramitadorGridRow>): void {
    this.gridTramitadores?.selectRow(event.args.rowindex)
    this.rowClick.emit(event)
  }

  handleRowDoubleClick(event: JqxGridRowEvent<TramitadorGridRow>): void {
    this.rowDoubleClick.emit(event)
  }
}
