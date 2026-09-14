import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import {
  etiquetaCortaEstadoInside,
  etiquetaEstadoEnvioInside,
  insideEstadoBadgeClass,
} from '../../../../../core/constants/inside-simulacion.constants'
import { InsideEnvioRegistro } from '../../../../../core/models/inside/inside-envio.models'
import { VerExpediente } from '../../../expedientes'

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

  get estadoResumenInside(): string {
    const explicito = String(this.insideUltimoEnvio?.estadoResumen ?? '').toUpperCase()
    if (explicito) {
      return explicito
    }
    // Backend antiguo: un envío de documento no debe verse como expediente ENVIADO
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

  handleVerHistorialEnviosInside(): void {
    this.verHistorialEnviosInside.emit()
  }

  handleValidarExpedienteInside(): void {
    this.validarExpedienteInside.emit()
  }

  handleEnviarExpedienteInside(): void {
    this.enviarExpedienteInside.emit()
  }

  handleAltaExpedienteEniXmlInside(): void {
    this.altaExpedienteEniXmlInside.emit()
  }

  handleEnviarDocumentosInside(): void {
    this.enviarDocumentosInside.emit()
  }

  handleAbrirModalRemisionJusticia(): void {
    this.abrirModalRemisionJusticia.emit()
  }

  handleVerNotificaciones(): void {
    this.verNotificaciones.emit()
  }

  handleVeotramitadores(): void {
    this.veotramitadores.emit()
  }

  handleVolverListadoExpedientes(): void {
    this.volverListadoExpedientes.emit()
  }
}
