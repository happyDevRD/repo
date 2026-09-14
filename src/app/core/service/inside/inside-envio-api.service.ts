import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { InsideEnvioRegistro, InsideRegistrarEnvioRequest } from '../../models/inside/inside-envio.models'

@Injectable({
  providedIn: 'root',
})
export class InsideEnvioApiService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiUrl}inside/envio`

  registrar(request: InsideRegistrarEnvioRequest): Observable<InsideEnvioRegistro | null> {
    return this.http.post<InsideEnvioRegistro>(this.baseUrl, request).pipe(
      map((response) => this.mapFromApi(response)),
      catchError(() => of(null)),
    )
  }

  listarPorExpediente(expedienteId: number): Observable<InsideEnvioRegistro[]> {
    return this.http.get<InsideEnvioRegistro[]>(`${this.baseUrl}/expediente/${expedienteId}`).pipe(
      map((response) => (response ?? []).map((item) => this.mapFromApi(item))),
      catchError(() => of([])),
    )
  }

  obtenerUltimo(expedienteId: number): Observable<InsideEnvioRegistro | null> {
    return this.http.get<InsideEnvioRegistro>(`${this.baseUrl}/expediente/${expedienteId}/ultimo`).pipe(
      map((response) => (response ? this.mapFromApi(response) : null)),
      catchError(() => of(null)),
    )
  }

  obtenerEstadoResumen(expedienteId: number): Observable<string> {
    return this.http.get<{ estadoResumen?: string }>(
      `${this.baseUrl}/expediente/${expedienteId}/estado-resumen`,
    ).pipe(
      map((response) => response?.estadoResumen ?? ''),
      catchError(() => of('')),
    )
  }

  /** Mapa idTarea → estadoEnvio (último envío de documento por tarea). */
  obtenerEstadosPorTarea(expedienteId: number): Observable<Record<number, string>> {
    return this.mapIdEstado(
      this.http.get<Record<string, string>>(
        `${this.baseUrl}/expediente/${expedienteId}/por-tarea`,
      ),
    )
  }

  /** Mapa idTramite → estadoEnvio agregado desde tareas enviadas. */
  obtenerEstadosPorTramite(expedienteId: number): Observable<Record<number, string>> {
    return this.mapIdEstado(
      this.http.get<Record<string, string>>(
        `${this.baseUrl}/expediente/${expedienteId}/por-tramite`,
      ),
    )
  }

  private mapIdEstado(source$: Observable<Record<string, string>>): Observable<Record<number, string>> {
    return source$.pipe(
      map((response) => {
        const result: Record<number, string> = {}
        if (!response) {
          return result
        }
        for (const [key, value] of Object.entries(response)) {
          const id = Number(key)
          if (!Number.isNaN(id) && value) {
            result[id] = value
          }
        }
        return result
      }),
      catchError(() => of({})),
    )
  }

  private mapFromApi(item: InsideEnvioRegistro & {
    idExpediente?: number
    identificadorEni?: string
    modoDryRun?: boolean
    fecEnvio?: string
    fecContr?: string
  }): InsideEnvioRegistro {
    return {
      idEnvio: item.idEnvio,
      expedienteId: item.expedienteId ?? item.idExpediente ?? 0,
      idTarea: item.idTarea,
      operacion: item.operacion ?? '',
      estadoEnvio: item.estadoEnvio,
      estadoResumen: item.estadoResumen,
      fecha: item.fecha ?? item.fecEnvio ?? item.fecContr ?? new Date().toISOString(),
      codigoRespuesta: item.codigoRespuesta,
      descripcionRespuesta: item.descripcionRespuesta,
      identificador: item.identificador ?? item.identificadorEni,
      csv: item.csv,
      codigoEnvioATEA: item.codigoEnvioATEA ?? (item as { codigoEnvioAtea?: string }).codigoEnvioAtea,
      dryRun: item.dryRun ?? item.modoDryRun === true,
      mensajeError: item.mensajeError,
    }
  }
}
