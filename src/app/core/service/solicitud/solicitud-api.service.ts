import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { UserSessionService } from '../user-session.service'
import {
  CreaSolicitudNuevo,
  EditarSolicitud,
  SolicitudListar,
  VerSolicitud,
} from '../../models/solicitud-domain.model'

@Injectable({
  providedIn: 'root',
})
export class SolicitudApiService {
  private readonly http = inject(HttpClient)
  private readonly session = inject(UserSessionService)
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private readonly urlListar = `${environment.apiUrl}solicitud/listar`
  private readonly urlListarEstado = `${environment.apiUrl}solicitud/listarPorEstado`
  private readonly urlVer = `${environment.apiUrl}solicitud/ver/`
  private readonly urlCrear = `${environment.apiUrl}solicitud/crear`

  private get idOrgElemen(): string | null {
    return this.session.idOrgEleme
  }

  private get user(): string | null {
    return this.session.user
  }

  listar(): Observable<SolicitudListar[]> {
    return this.http
      .get(`${this.urlListar}/${this.idOrgElemen}`)
      .pipe(map((response) => response as SolicitudListar[]))
  }

  listarPorEstado(value: string | number): Observable<SolicitudListar[]> {
    return this.http
      .get(`${this.urlListarEstado}/${value}/${this.idOrgElemen}`)
      .pipe(map((response) => response as SolicitudListar[]))
  }

  ver(id: number | string): Observable<VerSolicitud[]> {
    return this.http
      .get(`${this.urlVer}/${id}`)
      .pipe(map((response) => response as VerSolicitud[]))
  }

  crear(creasolicitud: CreaSolicitudNuevo | Record<string, unknown>): Observable<CreaSolicitudNuevo> {
    const raw = creasolicitud as Record<string, unknown>
    let codprovi = parseInt(String(raw['codProvi'] ?? 0), 10)
    let codMunic = parseInt(String(raw['codMunic'] ?? 0), 10)
    let codProviRepre = parseInt(String(raw['codProviRepre'] ?? 0), 10)
    let codMunicRepre = parseInt(String(raw['codMunicRepre'] ?? 0), 10)

    if (!raw['codProviRepre']) codProviRepre = 0
    if (!raw['codMunicRepre']) codMunicRepre = 0
    if (!raw['codProvi']) codprovi = 0
    if (!raw['codMunic']) codMunic = 0

    const varios = {
      asunto: raw['asunto'],
      ejercicio: raw['ejercicio'],
      estado: 'PENDIENTE',
      fecInicio: raw['fecInicio'],
      departamento: this.idOrgElemen,
      idPerso: raw['idPerso'],
      idHisPerso: raw['idHisPerso'],
      idHisDocum: raw['idHisDocum'],
      idDocum: raw['idDocum'],
      codProvi: codprovi,
      codMunic: codMunic,
      codPosta: raw['codPosta'],
      nombre: raw['nombre'],
      apellido1: raw['apellido1'],
      apellido2: raw['apellido2'],
      razSocia: raw['razSocia'],
      dirPosta: raw['dirPosta'],
      tipPerso: raw['tipPerso'],
      codLocal: raw['codLocal'],
      numDocum: raw['numDocum'],
      codProviRepre: codProviRepre,
      codMunicRepre: codMunicRepre,
      numDocumRepre: raw['numDocumRepre'],
      nombreRepre: raw['nombreRepre'],
      apellido1Repre: raw['apellido1Repre'],
      apellido2Repre: raw['apellido2Repre'],
      razSociaRepre: raw['razSociaRepre'],
      dirPostaRepre: raw['dirPostaRepre'],
      codPostaRepre: raw['codPostaRepre'],
      idRepre: raw['idRepre'],
      usuario: raw['usuario'],
      expediente: raw['expediente'],
      usuContr: this.user,
      idHisRepre: raw['idHisRepre'],
      formaNotifi: raw['formaNotifi'],
      email: raw['email'],
    }
    return this.http.post<CreaSolicitudNuevo>(this.urlCrear, JSON.stringify(varios), {
      headers: this.httpHeaders,
    })
  }

  editar(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    const varios = {
      asunto: editasolicitud.asunto,
      fecInicio: editasolicitud.fecInicio,
      estado: editasolicitud.estado,
      usuario: editasolicitud.usuario,
      motivoRechazo: editasolicitud.motivoRechazo,
      departamento: this.idOrgElemen,
      idHisPerso: editasolicitud.idHisPerso,
      idPerso: editasolicitud.idPerso,
      idHisDocum: editasolicitud.idHisDocum,
      idDocum: editasolicitud.idDocum,
      idRepre: editasolicitud.idRepre,
      expediente: editasolicitud.expediente,
      usuContr: this.user,
      idHisRepre: editasolicitud.idHisRepre,
      formaNotifi: editasolicitud.formaNotifi,
      email: editasolicitud.email,
    }
    return this.http.put<EditarSolicitud>(
      `${environment.apiUrl}solicitud/editar/${id}`,
      JSON.stringify(varios),
      { headers: this.httpHeaders }
    )
  }

  asignar(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    const keys = JSON.stringify({ usuario: editasolicitud.usuario })
    return this.http.put<EditarSolicitud>(
      `${environment.apiUrl}solicitud/editar/${id}`,
      keys,
      { headers: this.httpHeaders }
    )
  }
}
