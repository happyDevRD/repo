import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { EnvioNotificaInfo } from '../../../notificaciones/notificaciones-notifica-panel.component'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { hasAction } from '../../../../../shared/modals/modal-actions.util'
import { LeerNotificacion } from '../../../expedientes'
import { bopLabel, situacionLabel } from '../../notificaciones/notificaciones-grid-renderers'

@Component({
  selector: 'app-edita-expediente-workspace-notificaciones',
  templateUrl: './edita-expediente-workspace-notificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceNotificacionesComponent {
  @Input() veonotificaciones = false
  @Input() verInfoNotifi = false
  @Input() idNotificacion: number | null = null
  @Input() actions: ModalAction[] = []
  @Input() envioNotifica: EnvioNotificaInfo | null = null
  @Input() notificaciones: LeerNotificacion[] = []
  @Input() cargando = false

  @Output() action = new EventEmitter<ModalActionEvent>()
  @Output() rowClick = new EventEmitter<LeerNotificacion>()
  @Output() rowDoubleClick = new EventEmitter<Pick<LeerNotificacion, 'idNotif'>>()
  @Output() verNotificacion = new EventEmitter<number>()

  readonly situacionLabel = situacionLabel
  readonly bopLabel = bopLabel

  readonly rowClassFor = (row: LeerNotificacion): Record<string, boolean> => ({
    'table-active': row.idNotif === this.idNotificacion,
  })

  readonly situacionValue = (row: LeerNotificacion): string => situacionLabel(row.situacion)
  readonly bopValue = (row: LeerNotificacion): string => bopLabel(row.bop)

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
}
