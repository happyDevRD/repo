import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { InsideEnvioRegistro } from '../../../../../core/models/inside/inside-envio.models'

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
  @Input() veonotificaciones = false
  @Input() veoTramitadores = false
  @Input() insideDryRun = false
  @Input() insideEnviando = false
  @Input() insideUltimoEnvio: InsideEnvioRegistro | null = null

  @Output() verHistorialEnviosInside = new EventEmitter<void>()
  @Output() validarExpedienteInside = new EventEmitter<void>()
  @Output() enviarExpedienteInside = new EventEmitter<void>()
  @Output() altaExpedienteEniXmlInside = new EventEmitter<void>()
  @Output() enviarDocumentosInside = new EventEmitter<void>()
  @Output() abrirModalRemisionJusticia = new EventEmitter<void>()
  @Output() verNotificaciones = new EventEmitter<void>()
  @Output() veotramitadores = new EventEmitter<void>()
  @Output() volverListadoExpedientes = new EventEmitter<void>()
  @Output() noverNotificaciones = new EventEmitter<void>()

  pestanaFlujo: 'tramitacion' | 'inside' = 'tramitacion'

  handlePestanaFlujo(pestana: 'tramitacion' | 'inside'): void {
    this.pestanaFlujo = pestana
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

  handleNoverNotificaciones(): void {
    this.noverNotificaciones.emit()
  }
}
