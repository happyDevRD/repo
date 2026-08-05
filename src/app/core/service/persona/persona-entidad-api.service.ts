import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, map, throwError, catchError } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { PersonaEntidad } from '../../models/personaentidad.model'
import { HabitanteDto } from '../../models/habitante.dto'
import { BajaHabitantes } from '../../models/baja-habitantes.model'
import { ConsultaDni, CrearPersonaEntidad, RepresentanteExpLIstar } from '../../models/expediente-domain.model'
import { Pais } from '../../models/pais.model'
import { catchNotFoundAsEmpty } from '../../helper/rxjs-error.helper'

@Injectable({
  providedIn: 'root',
})
export class PersonaEntidadApiService {
  private readonly http = inject(HttpClient)
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private readonly urlCrear = `${environment.apiUrl}personaEntidad/crear`
  private readonly urlBajaHabitante = `${environment.apiUrl}habitante/baja`
  private readonly urlRepresentante = `${environment.apiUrl}personaRepresentante/listar`

  getDni(dni: string): Observable<ConsultaDni> {
    return this.http
      .get(`${environment.apiUrl}personaEntidad/ver/${dni}`)
      .pipe(map((response) => response as ConsultaDni))
  }

  /** Alias histórico de getDni (mismo endpoint). */
  getDni2(dni: string): Observable<ConsultaDni> {
    return this.getDni(dni)
  }

  getPersonaEntidad(numDocum: string): Observable<PersonaEntidad> {
    return this.http.get<PersonaEntidad>(`${environment.apiUrl}personaEntidad/ver/${numDocum}`)
  }

  crearPersonaEntidad(crearpersonaentidad: CrearPersonaEntidad, dni: string): Observable<CrearPersonaEntidad> {
    const varios = {
      numDocum: dni,
      tipPerso: crearpersonaentidad.tipPerso,
      nombre: crearpersonaentidad.nombre,
      apellido1: crearpersonaentidad.apellido1,
      apellido2: crearpersonaentidad.apellido2,
      razSocia: crearpersonaentidad.razSocia,
      localidad: crearpersonaentidad.localidad,
      codPosta: crearpersonaentidad.codPosta,
      dirPosta: crearpersonaentidad.dirPosta,
      municipio: crearpersonaentidad.municipio,
      provincia: crearpersonaentidad.provincia,
    }
    return this.http.post<CrearPersonaEntidad>(this.urlCrear, JSON.stringify(varios), {
      headers: this.httpHeaders,
    })
  }

  modificaPersonaEntidad(personaentidad: PersonaEntidad): Observable<PersonaEntidad> {
    return this.http
      .put<PersonaEntidad>(`${environment.apiUrl}personaEntidad/editar`, personaentidad, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((_error: HttpErrorResponse) =>
          throwError(() => new Error('Error modificando persona entidad'))
        )
      )
  }

  getPaises(): Observable<Pais[]> {
    return this.http.get(`${environment.apiUrl}pais/listar`).pipe(
      map((response) => (response as Pais[]) ?? []),
      catchNotFoundAsEmpty<Pais[]>(),
    )
  }

  getConsultaHabitante(numDocum: string): Observable<HabitanteDto> {
    return this.http.get<HabitanteDto>(`${environment.apiUrl}habitante/ver/${numDocum}`)
  }

  envioBajaHabitantes(bajahabitantes: BajaHabitantes, documento: string): Observable<unknown> {
    return this.http.put<unknown>(
      `${this.urlBajaHabitante}/${documento}`,
      JSON.stringify(bajahabitantes),
      { headers: this.httpHeaders }
    )
  }

  getRepresentante(idPerso: number | string, idHisPerso: number | string): Observable<RepresentanteExpLIstar> {
    return this.http
      .get(`${this.urlRepresentante}/${idPerso}/${idHisPerso}`)
      .pipe(map((response) => response as RepresentanteExpLIstar))
  }

  /** Lista de representantes vinculados a una persona (array plano, sin jqx). */
  listarRepresentantes(
    idPerso: number | string,
    idHisPerso: number | string,
  ): Observable<RepresentanteExpLIstar[]> {
    return this.http.get(`${this.urlRepresentante}/${idPerso}/${idHisPerso}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response as RepresentanteExpLIstar[]
        }
        if (response) {
          return [response as RepresentanteExpLIstar]
        }
        return []
      }),
    )
  }
}
