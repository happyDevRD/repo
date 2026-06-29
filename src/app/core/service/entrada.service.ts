import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  constructor(private http: HttpClient) { }

  crearEntrada(entradaData: any, params: { idPerso: number, idHisPerso: number, codArchi: number, idTarea: number }): Observable<any> {
    const url = `${environment.apiUrl}rdDocumento/crearEntrada/${params.idPerso}/${params.idHisPerso}/${params.codArchi}/${params.idTarea}`;
    return this.http.post(url, entradaData, { responseType: 'text' });
  }

  crearJustificanteGasto(facturaData: any, idExped: number): Observable<any> {
    const url = `${environment.apiUrl}jusGasto/crear/${idExped}`;

    const facturaDataModificada = {
      ...facturaData,
      indIvaDeduc: facturaData.indIvaDeduc ? 1 : 0
    };

    return this.http.post(url, facturaDataModificada);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error:', error.error.message);
    } else {
      console.error(`Código de error: ${error.status}, Cuerpo del error: ${error.error}`);
    }
    return throwError(() => 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
  }
}
