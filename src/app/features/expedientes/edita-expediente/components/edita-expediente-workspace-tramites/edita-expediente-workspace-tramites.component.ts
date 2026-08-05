import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { TramiteGridRow } from '../../tramites/tramites-edicion.helper'

export interface TramiteRowActionEvent {
  tramite: TramiteGridRow
  actionId: 'borrarTramite'
}

@Component({
  selector: 'app-edita-expediente-workspace-tramites',
  templateUrl: './edita-expediente-workspace-tramites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceTramitesComponent {
  @Input() vertramite = false
  @Input() puedeBorrar = false
  @Input() tramites: TramiteGridRow[] = []
  @Input() cargando = false
  @Input() idTramiteSeleccionado: number | null = null

  @Output() rowClick = new EventEmitter<TramiteGridRow>()
  @Output() rowDoubleClick = new EventEmitter<TramiteGridRow>()
  @Output() rowAction = new EventEmitter<TramiteRowActionEvent>()

  readonly rowClassFor = (row: TramiteGridRow): Record<string, boolean> => ({
    'table-active': row.id === this.idTramiteSeleccionado,
  })

  handleBorrar(event: Event, row: TramiteGridRow): void {
    event.stopPropagation()
    this.rowAction.emit({ tramite: row, actionId: 'borrarTramite' })
  }
}
