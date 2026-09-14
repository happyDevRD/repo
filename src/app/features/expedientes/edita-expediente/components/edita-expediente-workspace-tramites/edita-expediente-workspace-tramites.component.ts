import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import {
  etiquetaCortaEstadoInside,
  etiquetaEstadoEnvioInside,
  insideEstadoBadgeClass,
} from '../../../../../core/constants/inside-simulacion.constants'
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
  /** Estado INSIDE agregado por id de trámite. */
  @Input() insideEstadosPorTramite: Record<number, string> = {}

  @Output() rowClick = new EventEmitter<TramiteGridRow>()
  @Output() rowDoubleClick = new EventEmitter<TramiteGridRow>()
  @Output() rowAction = new EventEmitter<TramiteRowActionEvent>()

  readonly rowClassFor = (row: TramiteGridRow): Record<string, boolean> => ({
    'table-active': row.id === this.idTramiteSeleccionado,
  })

  estadoInsideTramite(row: TramiteGridRow): string {
    return String(this.insideEstadosPorTramite?.[row.id] ?? '').toUpperCase()
  }

  tieneEnvioInside(row: TramiteGridRow): boolean {
    return !!this.estadoInsideTramite(row)
  }

  etiquetaInsideTramite(row: TramiteGridRow): string {
    const estado = this.estadoInsideTramite(row)
    if (!estado) {
      return ''
    }
    if (estado === 'ERROR') {
      return 'INSIDE error'
    }
    return `INSIDE ${etiquetaCortaEstadoInside(estado) || etiquetaEstadoEnvioInside(estado).toLowerCase()}`
  }

  insideBadgeClass(row: TramiteGridRow): string {
    return insideEstadoBadgeClass(this.estadoInsideTramite(row))
  }

  handleBorrar(event: Event, row: TramiteGridRow): void {
    event.stopPropagation()
    this.rowAction.emit({ tramite: row, actionId: 'borrarTramite' })
  }
}
