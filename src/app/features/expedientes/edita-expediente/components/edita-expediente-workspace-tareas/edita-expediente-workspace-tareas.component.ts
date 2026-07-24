import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import {
  IflowGridComponent,
  IflowGridColumns,
  IflowGridLocalization,
  IflowGridSource,
} from '../../../../../shared/components/iflow-grid/iflow-grid.component'
import { JqxGridRowEvent } from '../../../../../core/helper/jqx-grid-event.model'
import { TareaTramiteSeleccionRow } from '../../tareas/tareas-seleccion.helper'

@Component({
  selector: 'app-edita-expediente-workspace-tareas',
  templateUrl: './edita-expediente-workspace-tareas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceTareasComponent {
  @Input() verTareasdelTramite = false
  @Input() verAccionesdeTarea = false
  @Input() headerActions: ModalAction[] = []
  @Input() toolbarActions: ModalAction[] = []
  @Input() columns: IflowGridColumns = []
  @Input() source: IflowGridSource
  @Input() localization: IflowGridLocalization

  @Output() action = new EventEmitter<ModalActionEvent>()
  @Output() rowClick = new EventEmitter<JqxGridRowEvent<TareaTramiteSeleccionRow>>()
  @Output() rowDoubleClick = new EventEmitter<JqxGridRowEvent<TareaTramiteSeleccionRow>>()

  @ViewChild('gridTareas') gridTareas?: IflowGridComponent

  handleAction(event: ModalActionEvent): void {
    this.action.emit(event)
  }

  handleRowClick(event: JqxGridRowEvent<TareaTramiteSeleccionRow>): void {
    this.gridTareas?.selectRow(event.args.rowindex)
    this.rowClick.emit(event)
  }

  handleRowDoubleClick(event: JqxGridRowEvent<TareaTramiteSeleccionRow>): void {
    this.rowDoubleClick.emit(event)
  }
}
