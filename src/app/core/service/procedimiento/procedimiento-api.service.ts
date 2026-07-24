import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { UserSessionService } from '../user-session.service'
import { Procedimiento } from '../../models/expediente-domain.model'

@Injectable({
  providedIn: 'root',
})
export class ProcedimientoApiService {
  private readonly http = inject(HttpClient)
  private readonly session = inject(UserSessionService)

  listar(): Observable<Procedimiento[]> {
    const idOrgElemen = this.session.idOrgEleme
    return this.http
      .get(`${environment.apiUrl}procedimiento/listar/${idOrgElemen}`)
      .pipe(map((response) => response as Procedimiento[]))
  }
}
