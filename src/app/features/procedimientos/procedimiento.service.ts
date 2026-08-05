import {Injectable} from '@angular/core';
import {
  AtributosCrear,
  AtributosListar,
  CreaPermisoProcedi,
  CrearProcedi,
  CreaTareaProcedi,
  EditarProcedi,
  EditaTareaProcedi,
  ListaTareaProcedi,
  MateriaProcedimiento,
  PlantillaTarea,
  Procedimiento,
  ProcediPermisos,
  ProcediPermisosListar
} from './procedimiento';
import { FirmaListar } from './models/procedimientos-internal.models';
import {map, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {UserSessionService} from '../../core/service/user-session.service';
import {catchNotFoundAsEmpty} from '../../core/helper/rxjs-error.helper';
import {ReciboCabeceraDto} from "../../core/models/recibo-cabecera.dto";
import {TareaTramiteExpedienteVer} from "../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto";


@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService {

  public identiprocedi!: number;

  public urlModifica: string = `${environment.apiUrl}procedimiento/ver`;
  public urlCrear: string = `${environment.apiUrl}procedimiento/crear`;
  public urlCrearAtributo: string = `${environment.apiUrl}metadatoGrupoAtributo/crear`;
  public urlEditarAtributo: string = `${environment.apiUrl}metadatoGrupoAtributo/editar`;
  public urlBorrarAtributo: string = `${environment.apiUrl}metadatoGrupoAtributo/borrar`;

  public urlborrar: string = `${environment.apiUrl}procedimiento/borrar`;
  public urlcreaTareaProcedi: string = `${environment.apiUrl}tareaProcedimiento/crear`;
  public urlborrarTareaProcedi: string = `${environment.apiUrl}tareaProcedimiento/borrar/`;
  public urlPermisoProcedi: string = `${environment.apiUrl}organizacionUsuario/listar`;
  public urlCreaPermisoProcedi: string = `${environment.apiUrl}permiso/crear`;
  public urlborrarPermisoProcedi: string = `${environment.apiUrl}permiso/borrar`;
  public pantillaTareaProcedi: string = `${environment.apiUrl}plantilla/listar/22`;
  public urlPermisoListar: string = `${environment.apiUrl}permiso/listar`;
  public urlTareaProcedimientoVer: string = `${environment.apiUrl}tareaProcedimiento/ver/`;
  public urlMateriaProcediListar: string = `${environment.apiUrl}materiaProcedimiento/listar`;
  public urlAtributosListarPorProc: string = `${environment.apiUrl}metadatoGrupoAtrib/listarPorProc`;


  public response = new Response();
  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(
    public http: HttpClient,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private session: UserSessionService
  ) { }

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get user(): string | null {
    return this.session.user;
  }

  get urlEndPoint(): string {
    return `${environment.apiUrl}procedimiento/listar/${this.idOrgElemen}`;
  }

  getProcedimientos(): Observable<Procedimiento[]> {

    if (this.session.canManageProcedimientos) {
      return this.http.get(this.urlEndPoint).pipe(
        map(response => response as Procedimiento[])
      );
    } else {
      return of([]);
    }
  }

  getRecibosPendientes(numDocum: string): Observable<ReciboCabeceraDto[]> {
    const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${numDocum}`;
    return this.http.get<ReciboCabeceraDto[]>(url);
  }

  getCertificadoDeuda(numDocum: string, idExpediente: number, usuario: string): Observable<Blob> {
    const url = `${environment.apiUrl}reciboCabecera/certificadoDeuda/${numDocum}/${idExpediente}/${usuario}`;
    return this.http.get(url, { responseType: 'blob' });
  }


  getTareaProcedimientoVer(idtproce: any): Observable<TareaTramiteExpedienteVer> {
    return this.http.get(this.urlTareaProcedimientoVer + idtproce).pipe(
      map(response => response as TareaTramiteExpedienteVer)
    );
  }

  getPlantillaTareas(): Observable<PlantillaTarea[]> {

    return this.http.get(this.pantillaTareaProcedi).pipe(
      map(response => response as PlantillaTarea[])
    );
  }

  getTareaProcedimiento(idprocedi: any): Observable<ListaTareaProcedi[]> {
    let urlListatareas: string = `${environment.apiUrl}tareaProcedimiento/listar/${idprocedi}`;


    return this.http.get(urlListatareas).pipe(
      map(response => response as ListaTareaProcedi[])
    );
  }

  getFirma(plantilla: string): Observable<FirmaListar[]> {
    const url = `${environment.apiUrl}procesoFirmado/listar/${plantilla}`;
    return this.http.get(url).pipe(map(response => response as FirmaListar[]));
  }

  create(crearprocedi: CrearProcedi): Observable<CrearProcedi> {
    const idOrgEleme = this.resolveIdOrgEleme(crearprocedi)
    const idOrgElemeNum = Number(idOrgEleme)

    const body = {
      descripcion: crearprocedi.descripcion?.trim(),
      departamento: Number.isFinite(idOrgElemeNum) ? { idOrgEleme: idOrgElemeNum } : undefined,
      siglas: crearprocedi.siglas?.trim(),
      codigoSia: crearprocedi.codigoSia?.trim(),
      usuContr: this.user,
      modalidad: crearprocedi.modalidad != null
        ? Number(crearprocedi.modalidad)
        : undefined,
      idMatProce: crearprocedi.materia != null
        ? Number(crearprocedi.materia)
        : undefined
    }

    const keys = JSON.stringify(body)
    return this.http.post<CrearProcedi>(this.urlCrear, keys, { headers: this.httpHeaders })
  }

  private resolveIdOrgEleme(crearprocedi: CrearProcedi): string {
    const dept = this.resolveDepartamento(crearprocedi)
    if (dept.idOrgEleme) {
      return dept.idOrgEleme
    }
    if (this.idOrgElemen) {
      return this.idOrgElemen
    }
    return crearprocedi.depart ?? ''
  }

  private resolveDepartamento(crearprocedi: CrearProcedi): { idOrgan: string; idOrgEleme: string } {
    const raw = crearprocedi.departamento as unknown
    const fromObject = raw && !Array.isArray(raw) ? raw as { idOrgan?: string; idOrgEleme?: string } : null
    const fromArray = Array.isArray(raw) && raw.length ? raw[0] as { idOrgan?: string; idOrgEleme?: string } : null
    const dept = fromObject ?? fromArray ?? {}

    return {
      idOrgan: dept.idOrgan ?? this.idOrgElemen ?? '',
      idOrgEleme: dept.idOrgEleme ?? this.idOrgElemen ?? ''
    }
  }


  crearAtributo(atributocrear: AtributosCrear, idprocedi: any): Observable<AtributosCrear> {
    JSON.stringify(atributocrear);
    let varios = {
      "etiGruAtrib": atributocrear.etiGruAtrib,
      "desGruAtrib": atributocrear.desGruAtrib,
      "requerido": atributocrear.requerido,
      "valInici": atributocrear.valInici,
      "valMinim": atributocrear.valMinim,
      "valMaxim": atributocrear.valMaxim,
      "idAtrib": atributocrear.idAtrib,
      "longitud": atributocrear.longitud,
      "usuario": this.user,
    }
    let keys = JSON.stringify(varios);
    return this.http.post<AtributosCrear>(`${this.urlCrearAtributo}/${idprocedi}`, keys, {headers: this.httpHeaders});
  }


  modificaAtributo(atributocrear: AtributosCrear, etiGruAtrib: any, idGrupo: any, EtiquetaActual: any): Observable<AtributosCrear> {
    JSON.stringify(atributocrear);
    let varios = {
      "etiGruAtrib": atributocrear.etiGruAtrib,
      "desGruAtrib": atributocrear.desGruAtrib,
      "requerido": atributocrear.requerido,
      "valInici": atributocrear.valInici,
      "valMinim": atributocrear.valMinim,
      "valMaxim": atributocrear.valMaxim,
      "idAtrib": atributocrear.idAtrib,
      "longitud": atributocrear.longitud,
      "usuario": this.user,
      "idGrupo": idGrupo
    }
    let keys = JSON.stringify(varios);
    return this.http.put<AtributosCrear>(`${this.urlEditarAtributo}`, keys, {headers: this.httpHeaders});
  }

  deleteAtributo(idGrupo: any, etiGruAtrib: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<any>(`${this.urlBorrarAtributo}/${idGrupo}/${etiGruAtrib}`, {headers: httpHeaders})
  }

  createTareaProcedi(creatareaprocedi: CreaTareaProcedi, procedimientoId: number): Observable<CreaTareaProcedi> {
    if (creatareaprocedi.plantilladefecto === 'SINPLANTILLA') {
      creatareaprocedi.plantilladefecto = null;
      creatareaprocedi.firmapordefecto = null;
    }

    const payload = {
      descripcion: creatareaprocedi.descripcion,
      faseTarea: creatareaprocedi.fasetarea,
      plazo: creatareaprocedi.plazo,
      tipoPlazo: creatareaprocedi.tipoplazo,
      procedimiento: procedimientoId,
      plantillaDefecto: creatareaprocedi.plantilladefecto,
      usuContr: this.user,
      procesoFirmadoDefecto: creatareaprocedi.firmapordefecto,
      accion: creatareaprocedi.acciones,
    };
    return this.http.post<CreaTareaProcedi>(this.urlcreaTareaProcedi, payload, {headers: this.httpHeaders});
  }


  createPermisoProcedi(createpermisoprocedi: CreaPermisoProcedi, idprocedi: number, idtarea: number, usuctrl: any, usu: string): Observable<CreaPermisoProcedi> {

    let result = JSON.stringify(createpermisoprocedi);

    let varios = {
      "procedimiento": idprocedi,
      "idTarProce": idtarea,
      "usuario": usu,
      "usuContr": usuctrl
    }
    let keys = JSON.stringify(varios);
    return this.http.post<CreaPermisoProcedi>(this.urlCreaPermisoProcedi, keys, {headers: this.httpHeaders});
  }

  deleteTareaProcedimiento(id: any): Observable<CreaTareaProcedi> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CreaTareaProcedi>(`${this.urlborrarTareaProcedi}${id}`, {headers: httpHeaders})
  }

  getPermisosListar(idTarea: number | string): Observable<ProcediPermisosListar[]> {
    const id = Number(idTarea)
    if (!Number.isFinite(id) || id <= 0) {
      return of([])
    }
    return this.http.get(`${this.urlPermisoListar}/${id}`).pipe(
      map(response => response as ProcediPermisosListar[]),
      catchNotFoundAsEmpty<ProcediPermisosListar[]>(),
    );
  }

  getAtributosListarPorProc(idprocedimiento: number): Observable<AtributosListar[]> {
    return this.http.get(`${this.urlAtributosListarPorProc}/${idprocedimiento}`).pipe(
      map(response => response as AtributosListar[])
    );
  }

  deletePermisoProcedimiento(id: any): Observable<CreaPermisoProcedi> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CreaPermisoProcedi>(`${this.urlborrarPermisoProcedi}/${id}`, {headers: httpHeaders})
  }

  editaTareaProcedimiento(editartareaprocedi: EditaTareaProcedi, id: number): Observable<EditaTareaProcedi> {
    // El backend (TareaProcedimientoController.editar) solo limpia plantillaDefecto/procesoFirmadoDefecto
    // cuando el valor recibido es exactamente "0" — un `null` es un no-op que deja el valor anterior
    // intacto (verificado contra el backend real). No usar `null` aquí aunque `crear` sí lo use.
    if (editartareaprocedi.plantillaDefecto === "SINPLANTILLA") {
      editartareaprocedi.plantillaDefecto = 0;
      editartareaprocedi.firmaPorDefecto = 0;
    }

    const varios = {
      "descripcion": editartareaprocedi.descripcion,
      "faseTarea": editartareaprocedi.faseTarea,
      "plazo": editartareaprocedi.plazo,
      "tipoPlazo": editartareaprocedi.tipoPlazo,
      "plantillaDefectoModulo": editartareaprocedi.plantillaDefectoModulo,
      "plantillaDefecto": editartareaprocedi.plantillaDefecto,
      "procesoFirmadoDefecto": editartareaprocedi.firmaPorDefecto,
      "accion": editartareaprocedi.acciones,
    };

    const keys = JSON.stringify(varios);
    const urlEditaT: string = `${environment.apiUrl}tareaProcedimiento/editar/${id}`;

    return this.http.put<EditaTareaProcedi>(urlEditaT, keys, { headers: this.httpHeaders });
  }


  editaProcedi(editarprocedi: EditarProcedi, id: number): Observable<EditarProcedi> {
    let idprocedi: number = id;
    let result = JSON.stringify(editarprocedi);
    this.identiprocedi = id;

    let varios = {

      "descripcion": editarprocedi.descripcion,
      "idOrgan": editarprocedi.departamento.idOrgan,
      "idOrgEleme": editarprocedi.departamento.idOrgEleme,
      "codigoSia": editarprocedi.codigoSia,
      "usuContr": this.user,
      "modalidad": editarprocedi.modalidad,
      "idMatProce": editarprocedi.materia


    }
    let keys = JSON.stringify(varios);
    let urlEdita: string = `${environment.apiUrl}procedimiento/editar/${id}`


    return this.http.put<EditarProcedi>(urlEdita, keys, {headers: this.httpHeaders});
  }

  getProcedimiento(id: any): Observable<Procedimiento> {
    return this.http.get<Procedimiento>(`${this.urlModifica}/${id}`)

  }

  deleteProcedimiento(id: any): Observable<Procedimiento> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<Procedimiento>(`${this.urlborrar}/${id}`, {headers: httpHeaders})
  }

  getPermisoProcedi(): Observable<ProcediPermisos[]> {
    return this.http.get(this.urlPermisoProcedi).pipe(
      map(response => response as ProcediPermisos[])
    );
  }


  getMateriaProcedi(): Observable<MateriaProcedimiento[]> {
    return this.http.get(this.urlMateriaProcediListar).pipe(
      map(response => response as MateriaProcedimiento[])
    );
  }
}
