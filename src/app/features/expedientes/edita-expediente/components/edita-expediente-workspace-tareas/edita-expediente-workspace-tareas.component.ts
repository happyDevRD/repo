import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { TareaTramiteSeleccionRow } from '../../tareas/tareas-seleccion.helper'

export interface TareaRowActionEvent {
  tarea: TareaTramiteSeleccionRow
  actionId: string
}

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
  @Input() rowActions: ModalAction[] = []
  @Input() tareas: TareaTramiteSeleccionRow[] = []
  @Input() idTarea: number | null = null
  @Input() tareasCargando = false

  @Output() action = new EventEmitter<ModalActionEvent>()
  @Output() tareaSelect = new EventEmitter<TareaTramiteSeleccionRow>()
  @Output() tareaOpen = new EventEmitter<TareaTramiteSeleccionRow>()
  @Output() rowAction = new EventEmitter<TareaRowActionEvent>()

  get tareaSeleccionada(): TareaTramiteSeleccionRow | null {
    if (this.idTarea == null) {
      return null
    }
    return this.tareas?.find((t) => t.id === this.idTarea) ?? null
  }

  get totalAbiertas(): number {
    return (this.tareas ?? []).filter((t) => !t.fecFin).length
  }

  get totalFinalizadas(): number {
    return (this.tareas ?? []).filter((t) => !!t.fecFin).length
  }

  trackByTareaId(_index: number, tarea: TareaTramiteSeleccionRow): number {
    return tarea.id
  }

  trackByActionId(_index: number, item: ModalAction): string {
    return item.id
  }

  handleAction(event: ModalActionEvent): void {
    this.action.emit(event)
  }

  handleSelect(tarea: TareaTramiteSeleccionRow): void {
    this.tareaSelect.emit(tarea)
  }

  handleOpen(tarea: TareaTramiteSeleccionRow): void {
    this.tareaOpen.emit(tarea)
  }

  handleRowKeydown(event: KeyboardEvent, tarea: TareaTramiteSeleccionRow): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleSelect(tarea)
    }
  }

  /** Acciones de la fila: contextuales si está activa; si no, acceso rápido al documento. */
  accionesFila(tarea: TareaTramiteSeleccionRow): ModalAction[] {
    if (this.idTarea === tarea.id) {
      return this.rowActions ?? []
    }
    if (!tarea.archivo) {
      return []
    }
    return [
      {
        id: 'docOriginal',
        label: 'Descargar documento',
        icon: 'bi bi-download',
        tone: 'secondary',
        title: 'Descargar documento',
        iconOnly: true,
      },
    ]
  }

  handleRowAction(tarea: TareaTramiteSeleccionRow, actionId: string): void {
    this.rowAction.emit({ tarea, actionId })
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return ''
    }
    const iso = String(fecha).slice(0, 10)
    const [y, m, d] = iso.split('-')
    if (!y || !m || !d) {
      return iso
    }
    return `${d}/${m}/${y}`
  }

  iconoTarea(tarea: TareaTramiteSeleccionRow): string {
    if (tarea.fecFin) {
      return 'bi-check2-circle'
    }
    if (tarea.archivo) {
      return 'bi-file-earmark-text'
    }
    return 'bi-list-task'
  }

  esFirmado(tarea: TareaTramiteSeleccionRow): boolean {
    return String(tarea.firmado ?? '') === '1'
  }

  estadoLabel(tarea: TareaTramiteSeleccionRow): string {
    switch (tarea.color) {
      case 'VERDE':
        return 'En plazo'
      case 'AMARILLO':
        return 'Próximo'
      case 'ROJO':
        return 'Fuera de plazo'
      default:
        return tarea.fecFin ? 'Finalizada' : 'Sin estado'
    }
  }

  estadoBadgeClass(tarea: TareaTramiteSeleccionRow): string {
    switch (tarea.color) {
      case 'VERDE':
        return 'exp-tarea-badge--ok'
      case 'AMARILLO':
        return 'exp-tarea-badge--warn'
      case 'ROJO':
        return 'exp-tarea-badge--danger'
      default:
        return 'exp-tarea-badge--muted'
    }
  }
}
