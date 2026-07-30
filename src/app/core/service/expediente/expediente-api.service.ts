import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { UserSessionService } from '../user-session.service'
import {
  ListarInteresados,
  NuevoExpediente,
  VerExpediente,
  VerExpedientesInstructor,
} from '../../models/expediente-domain.model'

@Injectable({
  providedIn: 'root',
})
export class ExpedienteApiService {
  private readonly http = inject(HttpClient)
  private readonly session = inject(UserSessionService)
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private readonly urlCrear = `${environment.apiUrl}expediente/crear`
  private readonly urlListarInstructor = `${environment.apiUrl}expediente/listarPorInstructor`
  private readonly baseUrl = `${environment.apiUrl}expediente`

  private get instructor(): string | null {
    return this.session.user
  }

  private get usuContr(): string | null {
    return this.session.user
  }

  private get idOrgElemen(): string | null {
    return this.session.idOrgEleme
  }

  getExpediente(id: number): Observable<VerExpediente> {
    return this.http
      .get(`${this.baseUrl}/ver/${id}`)
      .pipe(map((response) => response as VerExpediente))
  }

  getExpediente2(id: number): Observable<VerExpediente> {
    return this.getExpediente(id)
  }

  getExpedientesInstructor(): Observable<VerExpedientesInstructor[]> {
    return this.http
      .get(`${this.urlListarInstructor}/${this.instructor}`)
      .pipe(map((response) => response as VerExpedientesInstructor[]))
  }

  crearExpediente(nuevoexpediente: NuevoExpediente): Observable<NuevoExpediente> {
    const emailRaw = nuevoexpediente.email
    const email =
      emailRaw == null || String(emailRaw).trim() === ''
        ? null
        : String(emailRaw).trim()
    const forNotif =
      nuevoexpediente.formaNotifi === 0 || nuevoexpediente.formaNotifi === 1
        ? nuevoexpediente.formaNotifi
        : 0

    const body = {
      estado: 'ABIERTO',
      fase: 'INICIO',
      idHisDocum: nuevoexpediente.idHisDocum,
      idDocum: nuevoexpediente.idDocum,
      fecInicio: nuevoexpediente.fechaInicio,
      formaApertura: nuevoexpediente.forma_apertura || 'OFICIO',
      titulo: nuevoexpediente.titulo,
      instructor: this.instructor,
      procedimiento: nuevoexpediente.procedimiento,
      usuContr: this.usuContr,
      departamento: this.idOrgElemen,
      idHisPerso: nuevoexpediente.idHisPerso,
      idPerso: nuevoexpediente.idPerso,
      ejercicio: nuevoexpediente.ejercicio,
      solicitud: nuevoexpediente.idsolicitud,
      idRepre: nuevoexpediente.idRepre,
      idHisRepre: nuevoexpediente.idHisRepre,
      asunto: nuevoexpediente.asunto,
      email,
      forNotif,
    }

    // Contrato preferido: email/forNotif en body (sin path sentinela '0')
    return this.http.post<NuevoExpediente>(this.urlCrear, JSON.stringify(body), {
      headers: this.httpHeaders,
    })
  }

  getInteresadoListar(idExpe: number): Observable<ListarInteresados[]> {
    return this.http
      .get<ListarInteresados[]>(`${environment.apiUrl}interesado/listar/${idExpe}`)
      .pipe(map((response) => response))
  }

  editarInstructor(id: number, instructor: string): Observable<unknown> {
    const keys = JSON.stringify({ idExpediente: id, instructor })
    return this.http.put(`${environment.apiUrl}expediente/editar/${id}`, keys, {
      headers: this.httpHeaders,
    })
  }
}
