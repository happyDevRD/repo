import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TramiteExpedienteDto} from "../core/models/tramite-expediente.dto";

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  private readonly baseUrl = `${environment.apiUrl}tramitador`;


  constructor(private http: HttpClient) {}


  public getTramiteExpediente(idexpe: number): Observable<TramiteExpedienteDto[]> {
    const consulta: string = `${this.baseUrl}/listar/${idexpe}`;
    return this.http.get(consulta).pipe(
      map(response => response as TramiteExpedienteDto[])
    );
  }
}

