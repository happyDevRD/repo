import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {
  ConsultaDni,
  CreaSolicitud,
  CreaSolicitudNuevo,
  DocumentosListar,
  EditarSolicitud,
  EditExpediente,
  ProcediPermisos,
  SolicitudListar,
  UsuPermisos,
  VerSolicitud
} from './models';
import {environment} from 'src/environments/environment';
import {UserSessionService} from '../../core/service/user-session.service';
import {NotificationService} from '../../core/service/notification.service';
import {SolicitudApiService} from '../../core/service/solicitud/solicitud-api.service';
import {PersonaEntidadApiService} from '../../core/service/persona/persona-entidad-api.service';
import {ExpedienteApiService} from '../../core/service/expediente/expediente-api.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private readonly solicitudApi = inject(SolicitudApiService);
  private readonly personaEntidadApi = inject(PersonaEntidadApiService);
  private readonly expedienteApi = inject(ExpedienteApiService);

  public urlborrarsolicitud: string = `${environment.apiUrl}solicitud/borrar/`;
  public urlsolicilistar: string = `${environment.apiUrl}solicitud/listar`;
  public urlsolicilistarEstado: string = `${environment.apiUrl}solicitud/listarPorEstado`;
  public urlsolicicrear: string = `${environment.apiUrl}solicitud/crear`;
  public urlsoliciver: string = `${environment.apiUrl}solicitud/ver/`;
  public urldocsolicicrear: string = `${environment.apiUrl}documentoSolicitud/crear`;
  public urldocsolicilistar: string = `${environment.apiUrl}documentoSolicitud/listar`;
  public urldocsoliciborrar: string = `${environment.apiUrl}documentoSolicitud/borrar/`;
  public urlsolicieditar: string = `${environment.apiUrl}solicitud/editar/`;
  public urlsoliDni: string = `${environment.apiUrl}personaEntidad/ver/`;
  public urlsoliciProvi: string = `${environment.apiUrl}provincia/ver/`;
  public urlsoliciMunicipio: string = `${environment.apiUrl}municipio/ver/`;
  public urlPermisoProcedi: string = `${environment.apiUrl}organizacionUsuario/listar`;
  public urlPermisoProcediOrganizacion: string = `${environment.apiUrl}organizacionUsuario/usuDepTraExped/`;
  public urlexpedientelistar: string = `${environment.apiUrl}expediente/listar`;
  public urlexpedientecrear: string = `${environment.apiUrl}expediente/crear`;
  public urlexpedienteAsignaInstruc: string = `${environment.apiUrl}expediente/editar`;

  public vacio: string = 'vacio';

  public response = new Response();
  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(
    public http: HttpClient,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private session: UserSessionService,
    private notificationService: NotificationService
  ) {}

  get urlAsignarA(): string {
    return `${environment.apiUrl}organizacionUsuario/usuDepTraExped/${this.idOrgElemen}`;
  }

  get departamento(): string | null {
    return this.session.department;
  }

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get user(): string | null {
    return this.session.user;
  }

  getSolicitudes(): Observable<SolicitudListar[]> {
    return this.solicitudApi.listar();
  }

  getSolicitudesfiltro(value: any): Observable<SolicitudListar[]> {
    return this.solicitudApi.listarPorEstado(value);
  }

  getVerSolicitudes(id): Observable<VerSolicitud[]> {
    return this.solicitudApi.ver(id);
  }

  getAsignarA(): Observable<UsuPermisos[]> {
    return this.http.get(this.urlAsignarA).pipe(
      map(response => response as UsuPermisos[])
    );
  }

  editaExpediente(editexpediente: EditExpediente, id: number, instructor: string): Observable<EditExpediente> {
    return this.expedienteApi.editarInstructor(id, instructor) as Observable<EditExpediente>;
  }

  getDocumentosListar(): Observable<DocumentosListar[]> {
    return this.http.get(this.urldocsolicilistar).pipe(
      map(response => response as DocumentosListar[])
    );
  }

  getDocumentosPorSolicitud(idSolicitud: number | string): Observable<DocumentosListar[]> {
    return this.http.get(`${environment.apiUrl}documentoSolicitud/verDocProc/${idSolicitud}`).pipe(
      map(response => (Array.isArray(response) ? response : []) as DocumentosListar[])
    )
  }

  getDni(dni): Observable<ConsultaDni> {
    return this.personaEntidadApi.getDni(dni);
  }

  creaSolicitud(creasolicitud): Observable<CreaSolicitudNuevo> {
    return this.solicitudApi.crear(creasolicitud);
  }

  creaExpediente(id): Observable<any> {
    let varios = {
      "idsolicitud": id
    }
    let keys = JSON.stringify(varios);
    this.notificationService.success({ title: 'Nuevo Expediente  ', text: `Expediente ${id} creado con éxito` });
    return this.http.post(this.urlexpedientecrear, keys, {headers: this.httpHeaders});
  }

  getPermisoProcedi(): Observable<ProcediPermisos[]> {
    return this.http.get(this.urlPermisoProcedi).pipe(
      map(response => response as ProcediPermisos[])
    );
  }

  getPermisoProcediA(): Observable<ProcediPermisos[]> {
    return this.http.get(this.urlPermisoProcedi).pipe(
      map(response => response as ProcediPermisos[])
    );
  }

  editaSolicitud(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    return this.solicitudApi.editar(editasolicitud, id);
  }

  AsignarA(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    return this.solicitudApi.asignar(editasolicitud, id);
  }

  deleteSolicitud(id: any): Observable<CreaSolicitud> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.router.navigate(['/solicitudes']);
    return this.http.delete<CreaSolicitud>(`${this.urlborrarsolicitud}${id}`, {headers: httpHeaders})
  }

  deleteDocumento(id: any): Observable<DocumentosListar> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.router.navigate(['/solicitudes']);
    return this.http.delete<DocumentosListar>(`${this.urldocsoliciborrar}${id}`, {headers: httpHeaders})
  }
}
