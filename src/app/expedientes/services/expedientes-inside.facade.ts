import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'
import { forkJoin, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ExpedienteListar } from '../expedientes'
import { ExpedientesService } from '../expedientes.service'
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade'
import { InsideEnvioRegistroService } from '../../core/service/inside/inside-envio-registro.service'
import { NotificationService } from '../../core/service/notification.service'

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

  handleEnviarDesdeListado(host: ExpedientesInsideHost): void {
    if (!this.puedeEnviarInside(host)) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione un expediente cerrado o archivado.' })
      return
    }

    const dryRun = environment.inside.dryRun === true
    const etiquetaDryRun = dryRun
      ? '<p class="text-info"><strong>Modo simulación:</strong> sin acceso a REDSARA.</p>'
      : ''

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
