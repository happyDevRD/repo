import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { UserSessionService } from '../user-session.service'
import {
  TareaTramiteExpedienteUsuarioListar,
  TareaTramiteExpporExpedi,
  VerTareaTramiteExpporUsuario,
} from '../../models/expediente-domain.model'
import { TareaTramiteExpedienteVer } from '../../models/tareaTramite/tarea-tramite-expediente-ver.dto'
import { catchNotFoundAsEmpty } from '../../helper/rxjs-error.helper'

@Injectable({
  providedIn: 'root',
})
export class TareaTramiteExpedienteApiService {
  private readonly http = inject(HttpClient)
  private readonly session = inject(UserSessionService)
  private readonly urlListarPorExpediente = `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente`
  private readonly urlListarUsuario = `${environment.apiUrl}tareaTramiteExpediente/listarUsuario`
  private readonly urlPendientes = `${environment.apiUrl}tareaTramiteExpediente/listarTareasPendientesPorUsuario`

  private get instructor(): string | null {
    return this.session.user
  }

  listarPorExpediente(idExpe: number | string): Observable<TareaTramiteExpporExpedi[]> {
    return this.http
      .get(`${this.urlListarPorExpediente}/${idExpe}`)
      .pipe(map((response) => response as TareaTramiteExpporExpedi[]))
  }

  listarUsuario(): Observable<TareaTramiteExpedienteUsuarioListar[]> {
    return this.http
      .get(`${this.urlListarUsuario}/${this.instructor}`)
      .pipe(map((response) => response as TareaTramiteExpedienteUsuarioListar[]))
  }

  listarPendientesPorUsuario(): Observable<VerTareaTramiteExpporUsuario[]> {
    return this.http
      .get(`${this.urlPendientes}/${this.instructor}`)
      .pipe(map((response) => response as VerTareaTramiteExpporUsuario[]))
  }

  ver(id: number): Observable<TareaTramiteExpedienteVer> {
    return this.http
      .get(`${environment.apiUrl}tareaTramiteExpediente/ver/${id}`)
      .pipe(map((response) => response as TareaTramiteExpedienteVer))
  }

  listarPorTramite(idTramite: number): Observable<unknown[]> {
    return this.http
      .get(`${environment.apiUrl}tareaTramiteExpediente/listar/${idTramite}`)
      .pipe(
        map((response) => response as unknown[]),
        catchNotFoundAsEmpty<unknown[]>()
      )
  }
}
