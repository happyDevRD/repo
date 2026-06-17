import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TemaDocumentoDTO} from "../../models/documento/tema-documento.dto";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TemaDocumentoService {

  private idOrgElemen = sessionStorage.getItem('idOrgEleme');

  constructor(private http: HttpClient) { }

  getTemaDocumentoListar(): Observable<TemaDocumentoDTO[]> {
    console.log("LANZAMOS CONSULTA DE TEMA : " ,  this.idOrgElemen );
    return this.http.get(`${environment.apiUrl}temaDocumento/listar/${this.idOrgElemen}`).pipe(
      map(response => response as TemaDocumentoDTO[])
    );
  }
}

