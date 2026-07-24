import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core'
import { EnvioNotificaInfo } from '../../../notificaciones/notificaciones-notifica-panel.component'
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { hasAction } from '../../../../../shared/modals/modal-actions.util'
import { IflowGridComponent, IflowGridColumns, IflowGridLocalization, IflowGridSource } from '../../../../../shared/components/iflow-grid/iflow-grid.component'
import { JqxGridRowEvent } from '../../../../../core/helper/jqx-grid-event.model'
import { NotificacionGridRow } from '../../notificaciones/notificaciones-seleccion.helper'
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'

@Component({
  selector: 'app-edita-expediente-workspace-notificaciones',
  templateUrl: './edita-expediente-workspace-notificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceNotificacionesComponent implements AfterViewInit {
  private readonly refs = inject(EditaExpedienteRefs)

  @Input() veonotificaciones = false
  @Input() verInfoNotifi = false
  @Input() idNotificacion: number | null = null
  @Input() actions: ModalAction[] = []
  @Input() envioNotifica: EnvioNotificaInfo | null = null
  @Input() columns: IflowGridColumns = []
  @Input() source: IflowGridSource
  @Input() localization: IflowGridLocalization = jqxGrid_ES

  @Output() action = new EventEmitter<ModalActionEvent>()
  @Output() rowClick = new EventEmitter<JqxGridRowEvent<NotificacionGridRow>>()
  @Output() rowDoubleClick = new EventEmitter<JqxGridRowEvent<Pick<NotificacionGridRow, 'idNotif'>>>()

  @ViewChild('gridNotificaciones') gridNotificaciones?: IflowGridComponent

  ngAfterViewInit(): void {
    this.refs.gridNotificaciones = this.gridNotificaciones
  }

  get showToolbar(): boolean {
    return !!(this.veonotificaciones && this.verInfoNotifi && this.idNotificacion)
  }

  get veoEnviarNotifica(): boolean {
    return hasAction(this.actions, 'enviarNotifica')
  }

  get veoSincronizarNotifica(): boolean {
    return hasAction(this.actions, 'sincronizar')
  }

  get actionsBeforeNotifica(): ModalAction[] {
    return (this.actions ?? []).filter(
      (item) => item.id === 'teu' || item.id === 'reenviarTeu',
    )
  }

  get actionsAfterNotifica(): ModalAction[] {
    return (this.actions ?? []).filter(
      (item) =>
        item.id !== 'teu'
        && item.id !== 'reenviarTeu'
        && item.id !== 'enviarNotifica'
        && item.id !== 'sincronizar',
    )
  }

  handleAction(event: ModalActionEvent): void {
    this.action.emit(event)
  }

  handleEnviarANotificaPlataforma(): void {
    this.action.emit({ id: 'enviarNotifica' })
  }

  handleSincronizarConNotificaPlataforma(): void {
    this.action.emit({ id: 'sincronizar' })
  }

  handleRowClick(event: JqxGridRowEvent<NotificacionGridRow>): void {
    this.gridNotificaciones?.selectRow(event.args.rowindex)
    this.rowClick.emit(event)
  }

  handleRowDoubleClick(event: JqxGridRowEvent<Pick<NotificacionGridRow, 'idNotif'>>): void {
    this.rowDoubleClick.emit(event)
  }
}