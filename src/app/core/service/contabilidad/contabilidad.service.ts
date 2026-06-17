import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ContabilidadDTO} from "../../models/contabilidad/contabilidad.dto";

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getContabilidades(): Observable<ContabilidadDTO[]> {
    const url = `${this.apiUrl}contabilidad/listaContOperativa`;
    return this.http.get<ContabilidadDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `El servidor retornó el código ${error.status}, ` +
        `con el cuerpo: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(() => new Error('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.'));
  }
}
