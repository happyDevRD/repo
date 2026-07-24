import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'
import { forkJoin, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ExpedientesService } from '../expedientes.service'
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade'
import { NotificationService } from '../../../core/service/notification.service'

export interface InsidePendientesResumen {
  totalPendientes: number
  totalError: number
}

export interface ExpedientesInsideHost extends ExpedientesGridHost {
  idexpediente: number
  valorEstado: string
  insideEnviando?: boolean
  filtroInsidePendientes: boolean
  insidePendientesCount: number
  insidePendientesErrorCount: number
  expedientesService: ExpedientesService
  gridFacade: ExpedientesGridFacade
  usuario: string
  refreshExpedientesList(): void
}

/**
 * Resumen/badges de expedientes pendientes de envío INSIDE para el listado.
 * Las acciones (validar, enviar, historial, remisión...) viven en
 * `InsideAccionesFacade` (core/service/inside), invocadas desde el modal
 * consolidado `app-modal-inside-acciones` — este facade ya no las duplica.
 */
@Injectable()
export class ExpedientesInsideFacade {
  private readonly http = inject(HttpClient)
  private readonly notificationService = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef)

  cargarResumenPendientes(tramitador: string): Observable<InsidePendientesResumen> {
    const url = `${environment.apiUrl}inside/envio/pendientes/${tramitador}/resumen`
    return this.http.get<InsidePendientesResumen>(url)
  }

  toggleFiltroPendientes(host: ExpedientesInsideHost): void {
    host.filtroInsidePendientes = !host.filtroInsidePendientes

    if (!host.filtroInsidePendientes) {
      host.refreshExpedientesList()
      return
    }

    const idsUrl = `${environment.apiUrl}inside/envio/pendientes/${host.usuario}/ids`
    forkJoin({
      ids: this.http.get<number[]>(idsUrl),
      expedientes: host.expedientesService.getExpedientesListar(),
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ ids, expedientes }) => {
        const idSet = new Set(ids.map((id) => Number(id)))
        const filtrados = expedientes.filter((expediente) => idSet.has(Number(expediente.id)))
        host.gridFacade.setExpedientesListLocal(host, filtrados)
      },
      error: () => {
        host.filtroInsidePendientes = false
        this.notificationService.error({ title: 'INSIDE', text: 'No se pudo aplicar el filtro de pendientes.' })
      },
    })
  }

  puedeEnviarInside(host: ExpedientesInsideHost): boolean {
    const estado = String(host.valorEstado ?? '').toUpperCase()
    return !!host.idexpediente && (estado === 'CERRADO' || estado === 'ARCHIVADO')
  }

  actualizarResumenPendientes(host: ExpedientesInsideHost): void {
    if (!host.usuario) {
      return
    }

    this.cargarResumenPendientes(host.usuario).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (resumen) => {
        host.insidePendientesCount = resumen.totalPendientes ?? 0
        host.insidePendientesErrorCount = resumen.totalError ?? 0
      },
      error: () => {
        host.insidePendientesCount = 0
        host.insidePendientesErrorCount = 0
      },
    })
  }
}
