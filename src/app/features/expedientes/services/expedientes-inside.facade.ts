import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'
import { forkJoin, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ExpedienteListar } from '../expedientes'
import { ExpedientesService } from '../expedientes.service'
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade'
import { InsideEnvioRegistroService } from '../../../core/service/inside/inside-envio-registro.service'
import { InsideExpedienteOrchestrator } from '../../../core/service/inside/inside-expediente.orchestrator'
import { formatearValidacionHtml } from '../../../core/service/inside/inside-validation.helper'
import { NotificationService } from '../../../core/service/notification.service'
import {
  etiquetaInsideDryRunHtml,
  isInsideDryRun,
  tituloInsideConSimulacion,
} from '../../../core/constants/inside-simulacion.constants'

export interface InsideEnvioResultado {
  exito: boolean
  codigoRespuesta?: string
  descripcionRespuesta?: string
  identificadorEni?: string
  csv?: string
  modoDryRun?: boolean
  mensajeError?: string
  advertencias?: string[]
}

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

@Injectable()
export class ExpedientesInsideFacade {
  private readonly http = inject(HttpClient)
  private readonly envioRegistroService = inject(InsideEnvioRegistroService)
  private readonly insideOrchestrator = inject(InsideExpedienteOrchestrator)
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

  handleValidarDesdeListado(host: ExpedientesInsideHost): void {
    if (!host.idexpediente) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione un expediente.' })
      return
    }

    host.insideEnviando = true
    this.insideOrchestrator.validarExpediente(host.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (resultado) => {
        host.insideEnviando = false
        const validacion = resultado?.validacion
        const html = `${etiquetaInsideDryRunHtml()}${validacion ? formatearValidacionHtml(validacion) : ''}`
        if (validacion && !validacion.valido) {
          this.notificationService.warning({
            title: tituloInsideConSimulacion('Validación INSIDE'),
            html,
          })
          return
        }
        this.notificationService.success({
          title: tituloInsideConSimulacion('Validación INSIDE'),
          html,
        })
      },
      error: (err: Error) => {
        host.insideEnviando = false
        this.notificationService.error({
          title: 'Validación INSIDE',
          text: err?.message ?? 'No se pudo validar',
        })
      },
    })
  }

  handleHistorialDesdeListado(host: ExpedientesInsideHost): void {
    if (!host.idexpediente) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione un expediente.' })
      return
    }

    const local = this.envioRegistroService.listarLocalPorExpediente(host.idexpediente)
    this.envioRegistroService.listarPorExpediente(host.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (remoto) => {
        const items = remoto?.length ? remoto : local
        this.mostrarHistorial(items)
      },
      error: () => this.mostrarHistorial(local),
    })
  }

  private mostrarHistorial(items: { operacion: string; estadoEnvio?: string; fecha: string; identificador?: string }[]): void {
    if (!items.length) {
      this.notificationService.info({
        title: 'Historial INSIDE',
        text: 'Sin envíos registrados todavía.',
      })
      return
    }

    const filas = items.slice(0, 15).map((item) =>
      `<li><strong>${item.estadoEnvio ?? '—'}</strong> · ${item.operacion}`
      + ` · ${item.fecha ? new Date(item.fecha).toLocaleString('es-ES') : ''}`
      + `${item.identificador ? ` · ${item.identificador}` : ''}</li>`,
    ).join('')

    this.notificationService.info({
      title: tituloInsideConSimulacion('Historial INSIDE'),
      html: `${etiquetaInsideDryRunHtml()}<ul style="text-align:left;margin:0;padding-left:1.1rem;">${filas}</ul>`,
    })
  }

  handleEnviarDesdeListado(host: ExpedientesInsideHost): void {
    if (!this.puedeEnviarInside(host)) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione un expediente cerrado o archivado.' })
      return
    }

    const dryRun = isInsideDryRun()
    const etiquetaDryRun = etiquetaInsideDryRunHtml(dryRun)

    this.notificationService.confirm({
      title: 'Enviar expediente a INSIDE',
      html: `${etiquetaDryRun}<p>Se enviará el XML ENI del expediente y sus documentos.</p>`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      host.insideEnviando = true
      this.enviarAltaXmlBackend(host.idexpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.insideEnviando = false
          if (!respuesta.exito) {
            this.notificationService.error({ title: 'Error INSIDE', text: respuesta.mensajeError ?? 'No se pudo completar el envío.' })
            host.refreshExpedientesList()
            this.actualizarResumenPendientes(host)
            return
          }

          this.envioRegistroService.registrar({
            expedienteId: host.idexpediente,
            operacion: 'altaExpedienteEniXml',
            estadoEnvio: respuesta.modoDryRun ? 'SIMULADO' : 'ENVIADO',
            fecha: new Date().toISOString(),
            codigoRespuesta: respuesta.codigoRespuesta,
            descripcionRespuesta: respuesta.descripcionRespuesta,
            identificador: respuesta.identificadorEni,
            csv: respuesta.csv,
            dryRun: respuesta.modoDryRun === true,
          })

          this.notificationService.success({
            title: `INSIDE${respuesta.modoDryRun ? ' (simulación)' : ''}`,
            html: `
              ${etiquetaDryRun}
              <p><strong>Código:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
              <p><strong>Identificador:</strong> ${respuesta.identificadorEni ?? '-'}</p>
              ${respuesta.csv ? `<p><strong>CSV:</strong> ${respuesta.csv}</p>` : ''}
            `,
          })
          host.refreshExpedientesList()
          this.actualizarResumenPendientes(host)
        },
        error: (error: Error) => {
          host.insideEnviando = false
          this.notificationService.error({ title: 'Error INSIDE', text: error?.message ?? 'No se pudo completar el envío.' })
        },
      })
    })
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

  private enviarAltaXmlBackend(expedienteId: number): Observable<InsideEnvioResultado> {
    const url = `${environment.apiUrl}inside/expediente/${expedienteId}/enviar-alta-xml`
    return this.http.post<InsideEnvioResultado>(url, {})
  }
}
