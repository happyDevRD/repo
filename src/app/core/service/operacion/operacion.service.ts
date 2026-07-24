import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Operacion } from '../../models/operacion.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionService {

  private apiUrlBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerIdCodOpera(
    idConta: number,
    indArea: number,
    indAgrup: number,
    signo: number,
    claOpera: string
  ): Observable<any> {
    const url = `${this.apiUrlBase}codigoOperacion/obtenerIdCodOpera/${idConta}/${indArea}/${indAgrup}/${signo}/${claOpera}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  crearOperacion(operacion: Operacion, idExped: number): Observable<any> {
    const url = `${this.apiUrlBase}operacion/crear/${idExped}`;
    return this.http.post(url, operacion).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
