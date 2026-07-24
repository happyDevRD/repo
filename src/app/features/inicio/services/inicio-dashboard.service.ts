import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExpedienteApiService } from '../../../core/service/expediente/expediente-api.service';
import { TareaTramiteExpedienteApiService } from '../../../core/service/tarea-tramite/tarea-tramite-expediente-api.service';
import { SolicitudApiService } from '../../../core/service/solicitud/solicitud-api.service';
import { SolicitudListar } from '../../solicitudes/models';
import {
  VerExpedientesInstructor,
  VerTareaTramiteExpporUsuario,
} from '../../expedientes/expedientes';
import { UserSessionService } from '../../../core/service/user-session.service';

export type DashboardCountKey =
  | 'solicitudes'
  | 'expedientes'
  | 'tareas'
  | 'firmasPendientes'
  | 'firmasTerceros'
  | 'notificaciones';

export interface DashboardCounts {
  solicitudes: number | null;
  expedientes: number | null;
  tareas: number | null;
  firmasPendientes: number | null;
  firmasTerceros: number | null;
  notificaciones: number | null;
}

export interface DashboardSummary {
  solicitudes: SolicitudListar[];
  expedientes: VerExpedientesInstructor[];
  tareas: VerTareaTramiteExpporUsuario[];
  firmasPendientes: unknown[];
  firmasTerceros: unknown[];
  notificaciones: unknown[];
  counts: DashboardCounts;
}

@Injectable({
  providedIn: 'root',
})
export class InicioDashboardService {

  constructor(
    private solicitudApi: SolicitudApiService,
    private expedienteApi: ExpedienteApiService,
    private tareaTramiteApi: TareaTramiteExpedienteApiService,
    private http: HttpClient,
    private session: UserSessionService,
  ) {}

  loadSummary(): Observable<DashboardSummary> {
    const user = this.session.user;
    if (!user) {
      return of({
        solicitudes: [],
        expedientes: [],
        tareas: [],
        firmasPendientes: [],
        firmasTerceros: [],
        notificaciones: [],
        counts: this.emptyCounts(),
      });
    }

    const api = environment.apiUrl;
    const asArray = <T>(obs: Observable<T[]>) => obs.pipe(catchError(() => of([] as T[])));

    return forkJoin({
      solicitudes: asArray(this.solicitudApi.listar()),
      expedientes: asArray(this.expedienteApi.getExpedientesInstructor()),
      tareas: asArray(this.tareaTramiteApi.listarPendientesPorUsuario()),
      firmasPendientes: asArray(this.http.get<unknown[]>(`${api}tareaTramiteExpediente/listarFirmaPendiente/${user}`)),
      firmasTerceros: asArray(this.http.get<unknown[]>(`${api}tareaTramiteExpediente/listarFirmaPendienteTerceros/${user}`)),
      notificaciones: asArray(this.http.get<unknown[]>(`${api}tareaTramiteExpediente/listarNotificacionPendiente/${user}`)),
    }).pipe(
      map(data => ({
        ...data,
        counts: {
          solicitudes: data.solicitudes.length,
          expedientes: data.expedientes.length,
          tareas: data.tareas.length,
          firmasPendientes: data.firmasPendientes.length,
          firmasTerceros: data.firmasTerceros.length,
          notificaciones: data.notificaciones.length,
        },
      })),
    );
  }

  loadSolicitudes(): Observable<SolicitudListar[]> {
    return this.solicitudApi.listar().pipe(catchError(() => of([])));
  }

  loadExpedientesInstructor(): Observable<VerExpedientesInstructor[]> {
    return this.expedienteApi.getExpedientesInstructor().pipe(catchError(() => of([])));
  }

  loadTareasUsuario(): Observable<VerTareaTramiteExpporUsuario[]> {
    return this.tareaTramiteApi.listarPendientesPorUsuario().pipe(catchError(() => of([])));
  }

  loadFirmasPendientes(): Observable<unknown[]> {
    const user = this.session.user;
    if (!user) {
      return of([]);
    }
    return this.http.get<unknown[]>(`${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendiente/${user}`)
      .pipe(catchError(() => of([])));
  }

  loadFirmasTerceros(): Observable<unknown[]> {
    const user = this.session.user;
    if (!user) {
      return of([]);
    }
    return this.http.get<unknown[]>(`${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendienteTerceros/${user}`)
      .pipe(catchError(() => of([])));
  }

  loadNotificaciones(): Observable<unknown[]> {
    const user = this.session.user;
    if (!user) {
      return of([]);
    }
    return this.http.get<unknown[]>(`${environment.apiUrl}tareaTramiteExpediente/listarNotificacionPendiente/${user}`)
      .pipe(catchError(() => of([])));
  }

  firmasPendientesUrl(): string {
    return `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendiente/${this.session.user}`;
  }

  firmasTercerosUrl(): string {
    return `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendienteTerceros/${this.session.user}`;
  }

  notificacionesUrl(): string {
    return `${environment.apiUrl}tareaTramiteExpediente/listarNotificacionPendiente/${this.session.user}`;
  }

  countFromUrl(url: string): Observable<number> {
    return this.http.get<unknown[]>(url).pipe(
      map(data => data?.length ?? 0),
      catchError(() => of(0)),
    );
  }

  emptyCounts(): DashboardCounts {
    return {
      solicitudes: null,
      expedientes: null,
      tareas: null,
      firmasPendientes: null,
      firmasTerceros: null,
      notificaciones: null,
    };
  }
}
