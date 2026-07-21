import {Injectable} from '@angular/core';
import {
  AtributosCrear,
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
  ProcediPermisosListar,
  ProcesoFirmadoListar,
  UsuariosListar
} from './procedimiento';
import {map, Observable, of, tap, catchError, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {UserSessionService} from '../core/service/user-session.service';
import {ReciboCabeceraDto} from "../core/models/recibo-cabecera.dto";
import {TareaTramiteExpedienteVer} from "../core/models/tareaTramite/tarea-tramite-expediente-ver.dto";


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
  public urlPermisoUsuarioListar: string = `${environment.apiUrl}permiso/listar`;
  public urlUsuarios: string = `${environment.apiUrl}usuario/listar`;
  public urlTareaProcedimientoVer: string = `${environment.apiUrl}tareaProcedimiento/ver/`;
  public urlMateriaProcediListar: string = `${environment.apiUrl}materiaProcedimiento/listar`;


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

  get nivAcces(): string | null {
    return this.session.nivAcces;
  }

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

    if (this.nivAcces == '6') {
      this.http.get(this.urlEndPoint).pipe(
        map(response => response as Procedimiento[])
      );
      console.log(`ELEMENTO: ${this.idOrgElemen}`);
      console.log(`url: ${this.urlEndPoint}`)
      return this.http.get(this.urlEndPoint).pipe(
        map(response => response as Procedimiento[])
      );
    } else {
      return of();
    }
  }

  getRecibosPendientes(numDocum: string): Observable<ReciboCabeceraDto[]> {
    console.log(numDocum)
    const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${numDocum}`;
    return this.http.get<ReciboCabeceraDto[]>(url);
  }

  getCertificadoDeuda(numDocum: string, idExpediente: number, usuario: string): Observable<Blob> {
    const url = `${environment.apiUrl}reciboCabecera/certificadoDeuda/${numDocum}/${idExpediente}/${usuario}`;
    return this.http.get(url, { responseType: 'blob' });
  }


  getTareaProcedimientoVer(idtproce: any): Observable<TareaTramiteExpedienteVer> {
    console.log("desde service ver tarea procedimeinte url : " + this.urlTareaProcedimientoVer + idtproce)
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

  getFirma(plantilla: string): Observable<ProcesoFirmadoListar[]> {
    const url = `${environment.apiUrl}procesoFirmado/listar/${plantilla}`;
    return this.http.get(url).pipe(map(response => response as ProcesoFirmadoListar[]));
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
    console.log(`DATOS KEY!!! : ${keys}`)
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
    console.log(`DATOS KEY!!! : ${keys}`)
    console.log(` URL de atributos : ${this.urlCrearAtributo}/${idprocedi}`)
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
    console.log(`DATOS KEY!!! : ${keys}`)
    console.log(` URL de editar atributos : ${this.urlEditarAtributo}`)
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
    console.log("Payload para nueva tarea:", JSON.stringify(payload));
    console.log("URL:", this.urlcreaTareaProcedi);
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
    console.log("JSON NUEVO PERMISO : " + keys)
    return this.http.post<CreaPermisoProcedi>(this.urlCreaPermisoProcedi, keys, {headers: this.httpHeaders});
  }

  deleteTareaProcedimiento(id: any): Observable<CreaTareaProcedi> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    console.log(`URL DELETE TAREA : ${this.urlborrarTareaProcedi}${id}`)
    return this.http.delete<CreaTareaProcedi>(`${this.urlborrarTareaProcedi}${id}`, {headers: httpHeaders})
  }

  getUsuarios(): Observable<UsuariosListar[]> {
    console.log(`URL DE CONSULTA De USUARIOS : ${this.urlUsuarios}`);
    return this.http.get(`${this.urlUsuarios}`).pipe(
      map(response => response as UsuariosListar[])
    );
  }


  getUsuarioListar(id): Observable<ProcediPermisosListar[]> {
    console.log(`URL DE CONSULTA De usuario listar : ${this.urlPermisoUsuarioListar}/${id}`)
    return this.http.get(`${this.urlPermisoUsuarioListar}/${id}`).pipe(
      map(response => response as ProcediPermisosListar[])
    );
  }

  deletePermisoProcedimiento(id: any): Observable<CreaPermisoProcedi> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CreaPermisoProcedi>(`${this.urlborrarPermisoProcedi}/${id}`, {headers: httpHeaders})
  }

  editaTareaProcedimiento(editartareaprocedi: EditaTareaProcedi, id: number): Observable<EditaTareaProcedi> {
    console.log('--- Iniciando editaTareaProcedimiento ---');
    console.log('Argumento id:', id);
    // Clonamos el objeto para no mostrar referencias en el log
    console.log('Argumento editartareaprocedi (original):', JSON.parse(JSON.stringify(editartareaprocedi)));

    if (editartareaprocedi.plantillaDefecto === "SINPLANTILLA") {
      console.log('Modificando editartareaprocedi para SINPLANTILLA');
      editartareaprocedi.plantillaDefecto = 0;
      editartareaprocedi.firmaPorDefecto = 0;
    }

    // El objeto que se enviará en la solicitud
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

    console.log('URL para la solicitud PUT:', urlEditaT);
    console.log('Payload a enviar (objeto):', varios);
    console.log('Payload a enviar (JSON string):', keys);

    return this.http.put<EditaTareaProcedi>(urlEditaT, keys, { headers: this.httpHeaders }).pipe(
      tap(response => {
        console.log('--- Respuesta exitosa de editaTareaProcedimiento ---');
        console.log('Respuesta recibida:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('--- Error en editaTareaProcedimiento ---');
        console.error('Error:', error);
        console.error('Status:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Respuesta del error:', error.error);
        return throwError(() => new Error('Ocurrió un error al editar la tarea del procedimiento.'));
      })
    );
  }


  editaProcedi(editarprocedi: EditarProcedi, id: number): Observable<EditarProcedi> {
    let idprocedi: number = id;
    let result = JSON.stringify(editarprocedi);
    this.identiprocedi = id;
    console.log("idMatProce : " + editarprocedi.materia);

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

    console.log(`DATOS de la url procedimientos !!! : ${urlEdita}`);
    console.log(`DATOS KEY!!! : ${keys}`)

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
