import { Injectable, inject } from '@angular/core'
import { Observable, of } from 'rxjs'
import { InsideSoapResponse } from '../../models/inside'
import { InsideEnvioRegistro } from '../../models/inside/inside-envio.models'
import { InsideEnvioApiService } from './inside-envio-api.service'

@Injectable({
  providedIn: 'root',
})
export class InsideEnvioRegistroService {
  private readonly api = inject(InsideEnvioApiService)
  private readonly storageKey = 'iflow-inside-envios'

  listarPorExpediente(expedienteId: number): Observable<InsideEnvioRegistro[]> {
    return this.api.listarPorExpediente(expedienteId)
  }

  obtenerUltimo(expedienteId: number): Observable<InsideEnvioRegistro | null> {
    return this.api.obtenerUltimo(expedienteId)
  }

  obtenerEstadoResumen(expedienteId: number): Observable<string> {
    return this.api.obtenerEstadoResumen(expedienteId)
  }

  obtenerEstadosPorTarea(expedienteId: number): Observable<Record<number, string>> {
    return this.api.obtenerEstadosPorTarea(expedienteId)
  }

  obtenerEstadosPorTramite(expedienteId: number): Observable<Record<number, string>> {
    return this.api.obtenerEstadosPorTramite(expedienteId)
  }

  registrar(registro: InsideEnvioRegistro): void {
    this.api.registrar({
      idExpediente: registro.expedienteId,
      idTarea: registro.idTarea,
      operacion: registro.operacion,
      estadoEnvio: registro.estadoEnvio,
      codigoRespuesta: registro.codigoRespuesta,
      descripcionRespuesta: registro.descripcionRespuesta,
      identificadorEni: registro.identificador,
      csv: registro.csv,
      codigoEnvioAtea: registro.codigoEnvioATEA,
      modoDryRun: registro.dryRun,
      mensajeError: registro.mensajeError,
    }).subscribe()

    const actuales = this.listarLocal()
    actuales.unshift(registro)
    sessionStorage.setItem(this.storageKey, JSON.stringify(actuales.slice(0, 50)))
  }

  registrarDesdeRespuesta(
    expedienteId: number,
    operacion: string,
    respuesta: InsideSoapResponse,
    options?: { idTarea?: number, dryRun?: boolean, error?: string },
  ): void {
    this.registrar({
      expedienteId,
      idTarea: options?.idTarea,
      operacion,
      estadoEnvio: options?.error ? 'ERROR' : (options?.dryRun ? 'SIMULADO' : 'ENVIADO'),
      fecha: new Date().toISOString(),
      codigoRespuesta: respuesta.codigoRespuesta,
      descripcionRespuesta: respuesta.descripcionRespuesta,
      identificador: respuesta.identificador,
      csv: respuesta.csv,
      codigoEnvioATEA: respuesta.codigoEnvioATEA,
      dryRun: options?.dryRun === true,
      mensajeError: options?.error,
    })
  }

  listarLocal(): InsideEnvioRegistro[] {
    try {
      const raw = sessionStorage.getItem(this.storageKey)
      if (!raw) {
        return []
      }

      const parsed = JSON.parse(raw) as InsideEnvioRegistro[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  listarLocalPorExpediente(expedienteId: number): InsideEnvioRegistro[] {
    return this.listarLocal().filter((item) => item.expedienteId === expedienteId)
  }
}
