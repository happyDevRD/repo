import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import {
  etiquetaCortaEstadoInside,
  etiquetaEstadoEnvioInside,
  insideEstadoBadgeClass,
} from '../../../../../core/constants/inside-simulacion.constants'
import { InsideEnvioRegistro } from '../../../../../core/models/inside/inside-envio.models'
import { VerExpediente } from '../../../expedientes'
import { ModalAction, ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { fromVisibilityMap } from '../../../../../shared/modals/modal-actions.util'

@Component({
  selector: 'app-edita-expediente-header',
  templateUrl: './edita-expediente-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteHeaderComponent {
  @Input() expedienteEjercicio: unknown
  @Input() expedienteNumero: unknown
  @Input() botonVerNotifi = false
  @Input() vertramite = false
  @Input() insideDryRun = false
  @Input() insideEnviando = false
  @Input() insideUltimoEnvio: InsideEnvioRegistro | null = null
  @Input() expediente: VerExpediente | null = null
  @Input() veoRegistro = false

  get estadoResumenInside(): string {
    const explicito = String(this.insideUltimoEnvio?.estadoResumen ?? '').toUpperCase()
    if (explicito) {
      return explicito
    }
    if (this.insideUltimoEnvio?.idTarea != null) {
      const estado = String(this.insideUltimoEnvio.estadoEnvio ?? '').toUpperCase()
      if (estado === 'ERROR') {
        return 'ERROR'
      }
      if (estado === 'ENVIADO' || estado === 'SIMULADO') {
        return 'PARCIAL'
      }
      if (estado === 'PENDIENTE') {
        return 'PENDIENTE'
      }
    }
    return String(this.insideUltimoEnvio?.estadoEnvio ?? '').toUpperCase()
  }

  get etiquetaResumenInside(): string {
    const estado = this.estadoResumenInside
    if (!estado) {
      return ''
    }
    return etiquetaCortaEstadoInside(estado) || etiquetaEstadoEnvioInside(estado).toLowerCase()
  }

  get insideBadgeClass(): string {
    return insideEstadoBadgeClass(this.estadoResumenInside)
  }

  get procedimientoLabel(): string {
    const proc = this.expediente?.procedimiento
    const descripcion = String(proc?.descripcion ?? '').trim()
    if (descripcion) {
      return descripcion
    }
    const id = this.expediente?.idProc
    return id != null && id !== 0 ? String(id) : '—'
  }

  get interesadoLabel(): string {
    const persona = this.expediente?.personaEntidad
    const nombre = String(persona?.nombre ?? this.expediente?.nombre ?? '').trim()
    const entidad = String(persona?.desPerEntid ?? '').trim()
    if (nombre) {
      return nombre
    }
    if (entidad) {
      return entidad
    }
    return '—'
  }

  get documentoLabel(): string {
    const num = String(
      this.expediente?.personaEntidad?.numDocum ?? this.expediente?.dni ?? '',
    ).trim()
    return num || '—'
  }

  get expedienteAbierto(): boolean {
    return String(this.expediente?.estado ?? '').toUpperCase() === 'ABIERTO'
  }

  private readonly defsTramitacion: ReadonlyArray<Omit<ModalAction, 'visible'>> = [
    { id: 'atributos', label: 'Atributos', icon: 'bi bi-node-plus', tone: 'secondary', order: 10, title: 'Atributos del expediente' },
    { id: 'interesados', label: 'Interesados', icon: 'bi bi-people', tone: 'secondary', order: 20, title: 'Interesados del expediente' },
    { id: 'registro', label: 'Registro', icon: 'bi bi-file-earmark-text', tone: 'secondary', order: 30, title: 'Registro de entrada' },
    { id: 'historico', label: 'Histórico', icon: 'bi bi-clock-history', tone: 'secondary', order: 40, title: 'Histórico del expediente' },
    { id: 'asignarTramitador', label: 'Asignar', icon: 'bi bi-person-plus', tone: 'secondary', order: 50, title: 'Asignar tramitador' },
    { id: 'tareasExpediente', label: 'Tareas exp.', icon: 'bi bi-list-task', tone: 'secondary', order: 60, title: 'Tareas del expediente' },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'bi bi-bell', tone: 'primary', order: 70, title: 'Notificaciones' },
    { id: 'tramitadores', label: 'Tramitadores', icon: 'bi bi-people', tone: 'secondary', order: 80, title: 'Tramitadores' },
  ]

  private readonly defsInside: ReadonlyArray<Omit<ModalAction, 'visible' | 'disabled'>> = [
    { id: 'historial', label: 'Historial', icon: 'bi bi-clock-history', tone: 'secondary', order: 10, title: 'Historial de envíos INSIDE' },
    { id: 'validar', label: 'Validar', icon: 'bi bi-shield-check', tone: 'secondary', order: 20, title: 'Validar expediente' },
    { id: 'insideExpediente', label: 'INSIDE Expediente', icon: 'bi bi-cloud-upload', tone: 'primary', order: 30, title: 'INSIDE Expediente' },
    { id: 'altaXml', label: 'Alta XML', icon: 'bi bi-file-earmark-code', tone: 'secondary', order: 40, title: 'Alta XML Expediente' },
    { id: 'documentos', label: 'Documentos', icon: 'bi bi-files', tone: 'secondary', order: 50, title: 'INSIDE Documentos' },
    { id: 'remisionJusticia', label: 'Remisión Justicia', icon: 'bi bi-bank', tone: 'secondary', order: 60, title: 'Remisión a Justicia' },
  ]

  get actionsTramitacion(): ModalAction[] {
    const abierto = this.expedienteAbierto
    return fromVisibilityMap(this.defsTramitacion, {
      atributos: abierto,
      interesados: true,
      registro: this.veoRegistro,
      historico: true,
      asignarTramitador: abierto,
      tareasExpediente: abierto,
      notificaciones: true,
      tramitadores: true,
    })
  }

  get actionsInside(): ModalAction[] {
    return this.defsInside.map((def) => ({
      ...def,
      visible: true,
      disabled: this.insideEnviando,
    }))
  }

  @Output() verHistorialEnviosInside = new EventEmitter<void>()
  @Output() validarExpedienteInside = new EventEmitter<void>()
  @Output() enviarExpedienteInside = new EventEmitter<void>()
  @Output() altaExpedienteEniXmlInside = new EventEmitter<void>()
  @Output() enviarDocumentosInside = new EventEmitter<void>()
  @Output() abrirModalRemisionJusticia = new EventEmitter<void>()
  @Output() verNotificaciones = new EventEmitter<void>()
  @Output() veotramitadores = new EventEmitter<void>()
  @Output() volverListadoExpedientes = new EventEmitter<void>()
  @Output() nuevoTramite = new EventEmitter<void>()
  @Output() abrirAtributos = new EventEmitter<void>()
  @Output() irAInteresados = new EventEmitter<void>()
  @Output() mostrarRegistro = new EventEmitter<void>()
  @Output() abrirAsignarTramitador = new EventEmitter<void>()
  @Output() abrirTareasExpediente = new EventEmitter<void>()
  @Output() abrirHistorico = new EventEmitter<void>()

  pestanaFlujo: 'tramitacion' | 'inside' = 'tramitacion'

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

  handlePestanaFlujo(pestana: 'tramitacion' | 'inside'): void {
    this.pestanaFlujo = pestana
  }

  handleNuevoTramite(): void {
    this.nuevoTramite.emit()
  }

  handleAccionTramitacion(event: ModalActionEvent): void {
    switch (event.id) {
      case 'atributos': this.abrirAtributos.emit(); break
      case 'interesados': this.irAInteresados.emit(); break
      case 'registro': this.mostrarRegistro.emit(); break
      case 'historico': this.abrirHistorico.emit(); break
      case 'asignarTramitador': this.abrirAsignarTramitador.emit(); break
      case 'tareasExpediente': this.abrirTareasExpediente.emit(); break
      case 'notificaciones': this.verNotificaciones.emit(); break
      case 'tramitadores': this.veotramitadores.emit(); break
    }
  }

  handleAccionInside(event: ModalActionEvent): void {
    switch (event.id) {
      case 'historial': this.verHistorialEnviosInside.emit(); break
      case 'validar': this.validarExpedienteInside.emit(); break
      case 'insideExpediente': this.enviarExpedienteInside.emit(); break
      case 'altaXml': this.altaExpedienteEniXmlInside.emit(); break
      case 'documentos': this.enviarDocumentosInside.emit(); break
      case 'remisionJusticia': this.abrirModalRemisionJusticia.emit(); break
    }
  }

  handleVolverListadoExpedientes(): void {
    this.volverListadoExpedientes.emit()
  }
}
