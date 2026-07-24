import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core'
import { VerExpediente } from '../../../expedientes'
import { ExpedientesService } from '../../../expedientes.service'
import { ModalManagerService } from '../../../../../core/service/modal-manager.service'
import { isInsideDryRun } from '../../../../../core/constants/inside-simulacion.constants'
import { InsideSoapResponse } from '../../../../../core/models/inside'
import { InsideEnvioRegistro } from '../../../../../core/models/inside/inside-envio.models'
import {
  EditaExpedienteInsideHost,
  InsideAccionesFacade,
  InsideRemisionForm,
  crearRemisionVacia,
} from '../../../../../core/service/inside/inside-acciones.facade'

/**
 * Modal INSIDE consolidado: expone las mismas 6 acciones que la pestaña INSIDE de
 * la vista de edición de expediente, reutilizando `InsideAccionesFacade` y el modal
 * de Remisión a Justicia ya existentes. Pensado para abrirse desde el listado o la
 * ficha de expediente sin necesitar navegar a la vista de edición completa.
 */
@Component({
  selector: 'app-modal-inside-acciones',
  templateUrl: './modal-inside-acciones.component.html',
})
export class ModalInsideAccionesComponent implements OnChanges, EditaExpedienteInsideHost {
  @Input({ required: true }) idExpediente!: number
  @Input() modalId = 'insideAccionesModal'

  private readonly expedientesService = inject(ExpedientesService)
  private readonly insideAcciones = inject(InsideAccionesFacade)
  private readonly modalManagerService = inject(ModalManagerService)

  // --- EditaExpedienteInsideHost ---
  idTarea = 0
  numeroArchivo = 0
  verExpediente!: VerExpediente
  verAbreArchivo = false
  insideEnviando = false
  insideDryRun = isInsideDryRun()
  insideRemision: InsideRemisionForm = crearRemisionVacia()
  insideUltimaRespuesta: InsideSoapResponse | null = null
  insideUltimoEnvio: InsideEnvioRegistro | null = null

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idExpediente'] && this.idExpediente) {
      this.cargarExpediente()
    }
  }

  abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId, { stack: true })
  }

  cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId)
  }

  abrir(): void {
    this.abrirModal(this.modalId)
  }

  private cargarExpediente(): void {
    this.expedientesService.getExpediente(this.idExpediente).subscribe({
      next: (expediente) => {
        this.verExpediente = expediente
      },
    })
    this.insideAcciones.cargarEstadoEnvio(this.idExpediente, this)
  }

  handleVerHistorialEnvios(): void {
    this.insideAcciones.handleVerHistorialEnvios(this)
  }

  handleValidarExpediente(): void {
    this.insideAcciones.handleValidarExpediente(this)
  }

  handleEnviarExpedienteCompleto(): void {
    this.insideAcciones.handleEnviarExpedienteCompleto(this)
  }

  handleAltaExpedienteEniXml(): void {
    this.insideAcciones.handleAltaExpedienteEniXml(this)
  }

  handleEnviarDocumentosExpediente(): void {
    this.insideAcciones.handleEnviarDocumentosExpediente(this)
  }

  handleAbrirModalRemisionJusticia(): void {
    this.insideAcciones.abrirModalRemisionJusticia(this)
  }
}
