import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { catchNotFoundAsEmpty } from '../../core/helper/rxjs-error.helper'
import { UserSessionService } from '../../core/service/user-session.service'
import {
  EditarMensaje,
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  RechazarMensaje,
} from './models'

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private readonly urlBase = `${environment.apiUrl}mensaje`

  constructor(
    private readonly http: HttpClient,
    private readonly session: UserSessionService,
  ) {}

  private get idOrgUsuar(): string {
    return this.session.idOrgUsuar ?? ''
  }

  listarRecibidos(): Observable<LeerMensajeRecibidos[]> {
    return this.http.get(`${this.urlBase}/listarRecibidos/${this.idOrgUsuar}`).pipe(
      map((response) => response as LeerMensajeRecibidos[]),
      catchNotFoundAsEmpty<LeerMensajeRecibidos[]>(),
    )
  }

  listarEnviados(): Observable<LeerMensajeEnviados[]> {
    return this.http.get(`${this.urlBase}/listarEnviados/${this.idOrgUsuar}`).pipe(
      map((response) => response as LeerMensajeEnviados[]),
      catchNotFoundAsEmpty<LeerMensajeEnviados[]>(),
    )
  }

  editar(editarmensaje: EditarMensaje, id: number): Observable<unknown> {
    const body = {
      idTarea: editarmensaje.idTarea,
      idOrgUsuar: this.idOrgUsuar,
      idOrgElemen: this.session.idOrgEleme,
      usuContrl: this.session.user,
      fecEnvio: editarmensaje.fecEnvio,
      descripcion: editarmensaje.descripcion,
      fecLectura: editarmensaje.fecLectura,
      fecTramitacion: editarmensaje.fecTramitacion,
      fecRechazo: editarmensaje.fecRechazo,
      remitente: this.idOrgUsuar,
      destinatario: editarmensaje.destinatario,
      EstadoMensaje: editarmensaje.EstadoMensaje,
      estado: editarmensaje.estado,
      nomDesti: editarmensaje.nomDesti,
      informativo: editarmensaje.informativo,
      descripcionRechazo: editarmensaje.descripcionRechazo,
    }
    return this.http.put(`${this.urlBase}/editar/${id}`, JSON.stringify(body), {
      headers: this.httpHeaders,
    })
  }

  tramitar(id: number): Observable<unknown> {
    return this.http.put(`${this.urlBase}/tramitar/${id}`, JSON.stringify({}), {
      headers: this.httpHeaders,
    })
  }

  rechazar(rechazamensaje: RechazarMensaje, id: number): Observable<unknown> {
    const body = {
      fecRechazo: rechazamensaje.fecRechazo,
      nomDesti: rechazamensaje.destinatario,
      EstadoMensaje: rechazamensaje.EstadoMensaje,
      descripcionRechazo: rechazamensaje.descripcionRechazo,
      estado: rechazamensaje.estado,
    }
    return this.http.put(`${this.urlBase}/rechazar/${id}`, JSON.stringify(body), {
      headers: this.httpHeaders,
    })
  }

  marcarLeido(rechazamensaje: RechazarMensaje, id: number): Observable<unknown> {
    const body = {
      fecLectura: rechazamensaje.fecLectura,
      estado: rechazamensaje.estado,
    }
    return this.http.put(`${this.urlBase}/editar/${id}`, JSON.stringify(body), {
      headers: this.httpHeaders,
    })
  }

  borrar(id: number): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    return this.http.delete(`${this.urlBase}/borrar/${id}`, { headers })
  }
}
