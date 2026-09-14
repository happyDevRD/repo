import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { etiquetaCortaEstadoInside, etiquetaEstadoEnvioInside } from '../../../../../core/constants/inside-simulacion.constants'
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
  /** Último estado INSIDE por id de tarea. */
  @Input() insideEstadosPorTarea: Record<number, string> = {}

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

  private static readonly DOC_IDS = new Set([
    'descargaXml',
    'conviertePDF',
    'metadatos',
    'enviarInside',
    'altaXmlDoc',
  ])

  private static readonly FIRMA_IDS = new Set([
    'firmaAtendida',
    'firmaDesatendida',
  ])

  private static readonly TRAMITE_IDS = new Set([
    'propuestaResolucion',
    'crearNotificacion',
    'generarSalida',
    'tablonAnuncios',
  ])

  /** Acciones de gestión de la tarea (barra ops; en fila van iconOnly). */
  private static readonly TAREAS_IDS = new Set([
    'finalizarTarea',
    'borrarTarea',
  ])

  get accionesDocumento(): ModalAction[] {
    return this.filtrarGrupo(
      this.toolbarActions,
      EditaExpedienteWorkspaceTareasComponent.DOC_IDS,
    )
  }

  get accionesFirma(): ModalAction[] {
    return this.filtrarGrupo(
      this.toolbarActions,
      EditaExpedienteWorkspaceTareasComponent.FIRMA_IDS,
    )
  }

  get accionesTramite(): ModalAction[] {
    return this.filtrarGrupo(
      this.toolbarActions,
      EditaExpedienteWorkspaceTareasComponent.TRAMITE_IDS,
    )
  }

  get accionesTareas(): ModalAction[] {
    return this.filtrarGrupo(
      this.rowActions,
      EditaExpedienteWorkspaceTareasComponent.TAREAS_IDS,
    ).map((a) => ({ ...a, iconOnly: false }))
  }

  get tieneOperacionesTarea(): boolean {
    return (
      this.accionesDocumento.length > 0
      || this.accionesFirma.length > 0
      || this.accionesTramite.length > 0
      || this.accionesTareas.length > 0
    )
  }

  private filtrarGrupo(
    actions: ModalAction[] | null | undefined,
    ids: Set<string>,
  ): ModalAction[] {
    return (actions ?? []).filter(
      (a) => ids.has(a.id) && a.visible !== false,
    )
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
      return (this.rowActions ?? []).filter((a) => a.visible !== false)
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

  estadoInsideTarea(tarea: TareaTramiteSeleccionRow): string {
    return String(this.insideEstadosPorTarea?.[tarea.id] ?? '').toUpperCase()
  }

  tieneEnvioInside(tarea: TareaTramiteSeleccionRow): boolean {
    return !!this.estadoInsideTarea(tarea)
  }

  etiquetaInsideTarea(tarea: TareaTramiteSeleccionRow): string {
    const estado = this.estadoInsideTarea(tarea)
    if (!estado) {
      return ''
    }
    if (estado === 'ERROR') {
      return 'INSIDE error'
    }
    return `INSIDE ${etiquetaCortaEstadoInside(estado) || etiquetaEstadoEnvioInside(estado).toLowerCase()}`
  }

  insideBadgeClass(tarea: TareaTramiteSeleccionRow): string {
    switch (this.estadoInsideTarea(tarea)) {
      case 'ERROR':
        return 'exp-tarea-badge--danger'
      case 'PENDIENTE':
        return 'exp-tarea-badge--warn'
      case 'ENVIADO':
      case 'SIMULADO':
        return 'exp-tarea-badge--ok'
      default:
        return 'exp-tarea-badge--muted'
    }
  }

  estadoLabel(tarea: TareaTramiteSeleccionRow): string {
    if (tarea.fecFin) {
      return 'Finalizada'
    }
    switch (this.resolverColorEstado(tarea)) {
      case 'VERDE':
        return 'En plazo'
      case 'AMARILLO':
        return 'Próximo'
      case 'ROJO':
        return 'Fuera de plazo'
      default:
        return 'Sin plazo'
    }
  }

  estadoBadgeClass(tarea: TareaTramiteSeleccionRow): string {
    if (tarea.fecFin) {
      return 'exp-tarea-badge--ok'
    }
    switch (this.resolverColorEstado(tarea)) {
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

  /** Color de estado: API o derivado de fecPlazo (dd/MM/yyyy). */
  private resolverColorEstado(tarea: TareaTramiteSeleccionRow): string | null {
    const color = String(tarea.color ?? '').toUpperCase()
    if (color === 'VERDE' || color === 'AMARILLO' || color === 'ROJO') {
      return color
    }
    return this.colorDesdeFecPlazo(tarea.fecPlazo)
  }

  private colorDesdeFecPlazo(fecPlazo: string | null | undefined): string | null {
    if (!fecPlazo) {
      return null
    }
    const parts = String(fecPlazo).trim().split(/[/-]/)
    if (parts.length !== 3) {
      return null
    }
    const [d, m, y] = parts.map((p) => Number(p))
    if (!d || !m || !y) {
      return null
    }
    const plazo = new Date(y, m - 1, d)
    if (Number.isNaN(plazo.getTime())) {
      return null
    }
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    plazo.setHours(0, 0, 0, 0)
    const diferencia = Math.round((plazo.getTime() - hoy.getTime()) / 86_400_000)
    if (diferencia >= 7 && diferencia <= 10) {
      return 'AMARILLO'
    }
    if (diferencia < 7) {
      return 'ROJO'
    }
    return 'VERDE'
  }
}
