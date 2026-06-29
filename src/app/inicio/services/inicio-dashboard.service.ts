import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExpedientesService } from '../../expedientes/expedientes.service';
import { SolicitudesService } from '../../solicitudes/solicitudes.service';
import { SolicitudListar } from '../../solicitudes/solicitudes';
import {
  VerExpedientesInstructor,
  VerTareaTramiteExpporUsuario,
} from '../../expedientes/expedientes';
import { UserSessionService } from '../../core/service/user-session.service';

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
    private solicitudesService: SolicitudesService,
    private expedientesService: ExpedientesService,
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
      solicitudes: asArray(this.solicitudesService.getSolicitudes()),
      expedientes: asArray(this.expedientesService.getExpedientesInstructor()),
      tareas: asArray(this.expedientesService.getTareaTramiteExpedientesUsuario()),
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
    return this.solicitudesService.getSolicitudes().pipe(catchError(() => of([])));
  }

  loadExpedientesInstructor(): Observable<VerExpedientesInstructor[]> {
    return this.expedientesService.getExpedientesInstructor().pipe(catchError(() => of([])));
  }

  loadTareasUsuario(): Observable<VerTareaTramiteExpporUsuario[]> {
    return this.expedientesService.getTareaTramiteExpedientesUsuario().pipe(catchError(() => of([])));
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
