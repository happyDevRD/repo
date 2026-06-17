import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LiquidacionDto} from "../models/liquidacion.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {
  private baseUrl = `${environment.apiUrl}liquidacion`;


  constructor(private http: HttpClient) {}

  createLiquidacion(
    liquidacion: LiquidacionDto,
    idTipObjTribu: number,
    idHisTipObjTribu: number,
    desObjTribu: string
  ): Observable<any> {
    console.log("Creating Liquidacion...", liquidacion, idTipObjTribu, idHisTipObjTribu, desObjTribu);
    const url = `${this.baseUrl}/crear/${idTipObjTribu}/${idHisTipObjTribu}/${encodeURIComponent(desObjTribu)}`;
    return this.http.post(url, liquidacion);
  }

  listLiquidaciones(idExped: number): Observable<LiquidacionDto[]> {
    const url = `${this.baseUrl}/listar/${idExped}`;
    return this.http.get<LiquidacionDto[]>(url);
  }

  downloadLiquidacion(idLqui: number, usuario: string, desObjTribu: string): Observable<Blob> {
    const url = `${this.baseUrl}/liquidacionTributo/${idLqui}/${usuario}/${encodeURIComponent(desObjTribu)}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getInteresadoExp(idExped: number): Observable<any> {
    const url = `${environment.apiUrl}/interesadoExp/ver/${idExped}`;
    return this.http.get<any>(url);
  }



}
