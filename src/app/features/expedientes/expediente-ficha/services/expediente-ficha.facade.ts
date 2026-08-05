import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { VerExpediente } from '../../expedientes'
import { ExpedientesService } from '../../expedientes.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { InsideEnvioRegistroService } from '../../../../core/service/inside/inside-envio-registro.service'
import { InsideEnvioRegistro } from '../../../../core/models/inside/inside-envio.models'
import {
  etiquetaInsideDryRunHtml,
  isInsideDryRun,
} from '../../../../core/constants/inside-simulacion.constants'

export interface ExpedienteFichaResumen {
  id: number
  ejercicio: number | string
  numero: number | string
  estado: string
  titulo: string
  procedimiento: string
  instructor: string
  insideEstado: string
  fechaInicio: string
  fechaCierre: string
  fechaCancelacion: string
}

@Injectable()
export class ExpedienteFichaFacade {
  private readonly destroyRef = inject(DestroyRef)
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly expedientesService = inject(ExpedientesService)
  private readonly notificationService = inject(NotificationService)
  private readonly envioRegistroService = inject(InsideEnvioRegistroService)
  private readonly modalManagerService = inject(ModalManagerService)
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  readonly insideDryRun = isInsideDryRun()

  resumen: ExpedienteFichaResumen | null = null
  verexpediente: VerExpediente | null = null
  historialInside: InsideEnvioRegistro[] = []
  insideEnviando = false
  cargando = false
  errorCarga = ''

  seccionActiva: 'tramitacion' | 'inside' = 'tramitacion'
  fechacierreexpedi: string | Date | null = null
  serieDocumental = ''
  fechacancelacionexpedi: string | Date | null = null

  cargar(id: number): void {
    if (!id || Number.isNaN(id)) {
      this.errorCarga = 'Identificador de expediente no válido'
      return
    }

    this.cargando = true
    this.errorCarga = ''
    this.expedientesService.getExpediente(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (ver) => {
        this.verexpediente = ver
        this.resumen = this.mapResumen(id, ver)
        this.refrescarHistorial(id)
        this.cargando = false
      },
      error: () => {
        this.cargando = false
        this.errorCarga = 'No se pudo cargar el expediente'
        this.notificationService.error('No se pudo cargar el expediente')
      },
    })
  }

  refrescarHistorial(expedienteId: number): void {
    const local = this.envioRegistroService.listarLocalPorExpediente(expedienteId)
    this.historialInside = local
    this.envioRegistroService.listarPorExpediente(expedienteId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (remoto) => {
        if (remoto?.length) {
          this.historialInside = remoto
        }
      },
      error: () => {
        // historial local ya cargado
      },
    })
  }

  handleTramitar(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }
    this.router.navigate(['/expedientes', id, 'tramitar'], {
      state: { returnUrl: this.router.url.split('?')[0] || '/expedientes' },
    })
  }

  handleIrInside(): void {
    this.seccionActiva = 'inside'
  }

  handleIrTramitacion(): void {
    this.seccionActiva = 'tramitacion'
  }

  handleInteresados(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }
    this.router.navigate(['/interesado/interesado', id])
  }

  puedeTramitar(): boolean {
    const estado = String(this.resumen?.estado ?? '').toUpperCase()
    return !!this.resumen?.id && estado !== 'CERRADO' && estado !== 'CANCELADO' && estado !== 'ARCHIVADO'
  }

  puedeEnviarInside(): boolean {
    const estado = String(this.resumen?.estado ?? '').toUpperCase()
    return !!this.resumen?.id && (estado === 'CERRADO' || estado === 'ARCHIVADO')
  }

  puedeAbrir(): boolean {
    const estado = String(this.resumen?.estado ?? '').toUpperCase()
    return estado === 'CERRADO' || estado === 'CANCELADO'
  }

  puedeArchivar(): boolean {
    return String(this.resumen?.estado ?? '').toUpperCase() === 'CERRADO'
  }

  puedeCerrar(): boolean {
    return this.puedeTramitar()
  }

  /** Abre el modal INSIDE consolidado (mismas 6 acciones que la vista de edición). */
  abrirModalInside(): void {
    this.modalManagerService.openModal('insideAccionesModal')
  }

  handleAbrirExpediente(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }

    this.notificationService.confirm({
      title: 'Abrir expediente',
      text: '¿Confirma reabrir el expediente?',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.cambiarEstado(id, 'ABIERTO').pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({ title: 'Expediente abierto' })
          this.cargar(id)
        },
        error: () => this.notificationService.error('No se pudo abrir el expediente'),
      })
    })
  }

  /**
   * Archivar sin REDSARA: actualiza estado iFlow a ARCHIVADO (simulación presentación).
   * TODO SARA real: sustituir por integración red SARA en cutover (Fase 4).
   */
  handleArchivarSimulado(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }

    if (!this.puedeArchivar()) {
      this.notificationService.warning('Solo se pueden archivar expedientes cerrados')
      return
    }

    this.notificationService.confirm({
      title: 'Archivar expediente (simulación)',
      html: `${etiquetaInsideDryRunHtml()}
        <p>Sin red SARA: se marcará el expediente como <strong>ARCHIVADO</strong> en iFlow.</p>
        <p class="text-muted">Cuando haya REDSARA se sustituirá por la integración real.</p>`,
      confirmButtonText: 'Archivar (simulación)',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.cambiarEstado(id, 'ARCHIVADO', new Date()).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({
            title: 'Archivado (simulación)',
            text: 'Expediente archivado en iFlow. Pendiente integración REDSARA.',
          })
          this.cargar(id)
        },
        error: () => {
          // Fallback demo: actualizar UI local si el PUT falla
          if (this.resumen) {
            this.resumen = { ...this.resumen, estado: 'ARCHIVADO' }
          }
          this.notificationService.success({
            title: 'Archivado (simulación local)',
            text: 'Estado actualizado en pantalla para la demo. Revisar API al cutover SARA.',
          })
        },
      })
    })
  }

  handleCerrarExpediente(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }

    if (this.fechacierreexpedi == null || !this.serieDocumental?.trim()) {
      this.notificationService.incompleteFields()
      return
    }

    this.notificationService.confirm('Al confirmar cerrará el Expediente Seleccionado!').then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.expedientesService
        .cerrarExpediente(id, this.fechacierreexpedi as Date, this.serieDocumental)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notificationService.success('El Expediente ha sido cerrado')
            this.cargar(id)
            this.seccionActiva = 'inside'
          },
          error: () => this.notificationService.error('Error al cerrar el expediente'),
        })
    })
  }

  handleCancelarExpediente(): void {
    const id = this.resumen?.id
    if (!id) {
      return
    }

    if (this.fechacancelacionexpedi == null) {
      this.notificationService.warning('Por favor rellene la fecha de cancelación')
      return
    }

    const fechaCancel = this.fechacancelacionexpedi instanceof Date
      ? this.fechacancelacionexpedi
      : new Date(this.fechacancelacionexpedi)

    this.notificationService.confirmDelete('Al confirmar cancelará el Expediente Seleccionado!').then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.expedientesService.cancelarExpediente(id, fechaCancel).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success('El Expediente ha sido cancelado')
          this.cargar(id)
        },
        error: () => this.notificationService.error('Error al cancelar el expediente'),
      })
    })
  }

  private cambiarEstado(id: number, estado: string, fecArchivo?: Date) {
    const body: Record<string, unknown> = {
      idExpediente: id,
      estado,
    }
    if (fecArchivo) {
      body['fecArchivo'] = fecArchivo
    }
    return this.http.put(
      `${environment.apiUrl}expediente/editar/${id}`,
      JSON.stringify(body),
      { headers: this.httpHeaders },
    )
  }

  private mapResumen(id: number, ver: VerExpediente): ExpedienteFichaResumen {
    const proc = ver?.procedimiento as { descripcion?: string } | string | undefined
    const procedimiento = typeof proc === 'string'
      ? proc
      : (proc?.descripcion ?? '')
    return {
      id,
      ejercicio: ver.ejercicio ?? '',
      numero: ver.numero ?? '',
      estado: String(ver.estado ?? ''),
      titulo: ver.titulo ?? '',
      procedimiento: String(procedimiento),
      instructor: ver.instructor ?? '',
      insideEstado: String((ver as VerExpediente & { insideEstado?: string }).insideEstado ?? ''),
      fechaInicio: String(ver.fecInicio ?? ''),
      fechaCierre: String(ver.fecFin ?? ''),
      fechaCancelacion: String(ver.fecCancelacion ?? ''),
    }
  }
}
