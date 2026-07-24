import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { RegistroDocumento, VerMetadatos } from '../../models/expediente-domain.model'

@Injectable({
  providedIn: 'root',
})
export class RdDocumentoApiService {
  private readonly http = inject(HttpClient)
  private readonly urlVer = `${environment.apiUrl}rdDocumento/ver`
  private readonly urlMetadatos = `${environment.apiUrl}archivo/verMetadatos`

  getRegistroDocVer(regDocu: number | string): Observable<RegistroDocumento> {
    return this.http
      .get(`${this.urlVer}/${regDocu}`)
      .pipe(map((response) => response as RegistroDocumento))
  }

  getMetadatosVer(numDocu: number): Observable<VerMetadatos> {
    return this.http
      .get(`${this.urlMetadatos}/${numDocu}`)
      .pipe(map((response) => response as VerMetadatos))
  }
}
