import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TramitadorGridRow } from '../../services/edita-expediente-workspace.facade'

@Component({
  selector: 'app-edita-expediente-workspace-tramitadores',
  templateUrl: './edita-expediente-workspace-tramitadores.component.html',
})
export class EditaExpedienteWorkspaceTramitadoresComponent {
  @Input() visible = false
  @Input() tramitadores: TramitadorGridRow[] = []
  @Input() cargando = false
  @Input() idTramitadorSeleccionado: number | null = null

  @Output() rowClick = new EventEmitter<TramitadorGridRow>()
  @Output() rowDoubleClick = new EventEmitter<TramitadorGridRow>()

  readonly rowClassFor = (row: TramitadorGridRow): Record<string, boolean> => ({
    'table-active': row.id === this.idTramitadorSeleccionado,
  })

  readonly posesionValue = (row: TramitadorGridRow): string => (row.posesion == 1 ? 'Sí' : 'No')
}
