import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import {
  IflowGridComponent,
  IflowGridColumns,
  IflowGridLocalization,
  IflowGridSource,
} from '../../../../../shared/components/iflow-grid/iflow-grid.component'
import { JqxGridRowEvent } from '../../../../../core/helper/jqx-grid-event.model'
import { TramiteGridRow } from '../../tramites/tramites-edicion.helper'

@Component({
  selector: 'app-edita-expediente-workspace-tramites',
  templateUrl: './edita-expediente-workspace-tramites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceTramitesComponent {
  @Input() vertramite = false
  @Input() botonVerNotifi = false
  @Input() veonotificaciones = false
  @Input() veoTramitadores = false
  @Input() toolbarActions: ModalAction[] = []
  @Input() columns: IflowGridColumns = []
  @Input() source: IflowGridSource
  @Input() localization: IflowGridLocalization

  @Output() action = new EventEmitter<ModalActionEvent>()
  @Output() rowClick = new EventEmitter<JqxGridRowEvent<TramiteGridRow>>()
  @Output() rowDoubleClick = new EventEmitter<JqxGridRowEvent<TramiteGridRow>>()

  @ViewChild('grid') grid?: IflowGridComponent

  handleAction(event: ModalActionEvent): void {
    this.action.emit(event)
  }

  handleRowClick(event: JqxGridRowEvent<TramiteGridRow>): void {
    this.grid?.selectRow(event.args.rowindex)
    this.rowClick.emit(event)
  }

  handleRowDoubleClick(event: JqxGridRowEvent<TramiteGridRow>): void {
    this.rowDoubleClick.emit(event)
  }
}
