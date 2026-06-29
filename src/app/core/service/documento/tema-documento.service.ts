import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TemaDocumentoDTO} from "../../models/documento/tema-documento.dto";
import {environment} from "../../../../environments/environment";
import {UserSessionService} from "../user-session.service";

@Injectable({
  providedIn: 'root'
})
export class TemaDocumentoService {

  constructor(
    private http: HttpClient,
    private session: UserSessionService
  ) { }

  getTemaDocumentoListar(): Observable<TemaDocumentoDTO[]> {
    const idOrgElemen = this.session.idOrgEleme;
    console.log("LANZAMOS CONSULTA DE TEMA : " ,  idOrgElemen );
    return this.http.get(`${environment.apiUrl}temaDocumento/listar/${idOrgElemen}`).pipe(
      map(response => response as TemaDocumentoDTO[])
    );
  }
}
