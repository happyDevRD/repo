import {Injectable} from '@angular/core';
import {
  ArchivoFirmadoEF,
  ArchivoFirmantes,
  Atributosleer,
  ConsultaDni,
  CrearGenerarSalida,
  CrearInteresado,
  CrearMensaje,
  CrearNotificacion,
  CrearPersonaEntidad,
  CrearTablonAnuncio,
  CrearTramiteExp,
  CreaTramitador,
  EditarMensaje,
  EditarTramiteExp,
  EditExpediente,
  ExpedienteListar,
  InsertaBolsaCrear,
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  ListarInteresados,
  ListarTramitador,
  ListarTramites,
  ModeloTeuListar,
  NuevoExpediente,
  Procedimiento,
  RechazarMensaje,
  RegistroDocumento,
  RepresentanteExpLIstar,
  TareaTramiteExpedienteCrear,
  TareaTramiteExpedienteEditar,
  TareaTramiteExpedienteListar,
  TareaTramiteExpedienteUsuarioListar,
  TareaTramiteExpporExpedi,
  TemaDocumentoListar,
  TramiteExpListar,
  VerExpediente,
  VerExpedientesInstructor,
  VerMetadatos,
  VerTareaTramiteExpporUsuario
} from './expedientes';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {ModalManagerService} from '../core/service/modal-manager.service';
import {UserSessionService} from '../core/service/user-session.service';
import {NotificationService} from '../core/service/notification.service';
import {TareaProcedimientoDTO} from "../core/models/tarea-procedimiento.dto";
import {PersonaEntidad} from "../core/models/personaentidad.model";
import {TareaTramiteExpedienteVer} from "../core/models/tareaTramite/tarea-tramite-expediente-ver.dto";
import {TipoObjetoTributarioDto} from "../core/models/tipo-objeto-tributario.dto";
import {ObjetoTributarioDto} from "../core/models/objeto-tributario.dto";
import {InteresadoListarDto} from "../core/models/interesado.dto";


@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  public fecha = new Date();
  public idTarea!: number;
  public urlexpedientelistar: string = `${environment.apiUrl}expediente/listarExpediente`;
  public urltareatramiteexpedienteusuariolistar: string = `${environment.apiUrl}tareaTramiteExpediente/listarTareasPendientesPorUsuario`;
  public urlregistrodocumentolistar: string = `${environment.apiUrl}rdDocumento/ver/`;
  public urlexpedientelistarInstructor: string = `${environment.apiUrl}expediente/listarPorInstructor`;
  public urlexpedientecrear: string = `${environment.apiUrl}expediente/crear`;
  public urlexpeditramitecrear: string = `${environment.apiUrl}tramite/crear`;
  public urlexpeditramitelistar: string = `${environment.apiUrl}tramite/listar`;
  public urltramitadorcrear: string = `${environment.apiUrl}tramitador/crear`;
  public urltramitadorlistar: string = `${environment.apiUrl}tramitador/listar`;
  public urltramitelistar: string = `${environment.apiUrl}tramite/listar`;
  public urltramiteborrar: string = `${environment.apiUrl}tramite/borrar`;
  public urlinteresadolistar: string = `${environment.apiUrl}interesado/listar`;
  public urlinteresadocrear: string = `${environment.apiUrl}interesado/crear`;
  public urlinteresadoBorrar: string = `${environment.apiUrl}interesado/borrar`;
  public urltramitadorBorrar: string = `${environment.apiUrl}tramitador/borrar`;
  public urlTareaTramiteExpedienteListar: string = `${environment.apiUrl}tareaTramiteExpediente/listar`;
  public urlTareaTramiteExpedienteListarExpedi: string = `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente`;
  public urlTareaTramiteExpedienteCrear: string = `${environment.apiUrl}tareaTramiteExpediente/crear`;
  public urlTareaTramiteExpedienteBorrar: string = `${environment.apiUrl}tareaTramiteExpediente/borrar`;
  public urlTareaTramiteExpedienteEditar: string = `${environment.apiUrl}tareaTramiteExpediente/editar`;
  public urlTareaTramiteExpedienteUsuarioListar: string = `${environment.apiUrl}tareaTramiteExpediente/listarUsuario`;
  public urlMensajeCrear: string = `${environment.apiUrl}mensaje/crear`;
  public urlMensajeListarRecibidos: string = `${environment.apiUrl}mensaje/listarRecibidos`;
  public urlMensajeListarEnviados: string = `${environment.apiUrl}mensaje/listarEnviados`;
  public urlMensajeEditar: string = `${environment.apiUrl}mensaje/editar`;
  public urlMensajeTramitar: string = `${environment.apiUrl}mensaje/tramitar`;
  public urlMensajeBorrar: string = `${environment.apiUrl}mensaje/borrar`;
  public urlRdDocumentoCrear: string = `${environment.apiUrl}rdDocumento/crear/`;
  public urlTemaDocumentoListar: string = `${environment.apiUrl}temaDocumento/listar/`;
  public urlBolsaPuntosCrear: string = `${environment.apiUrl}seBolsaPuntos/crear/`;
  public urlArchivoFirmaEF: string = `${environment.apiUrl}archivo/firmaEF`;
  public urlArchivoFirmaEFDesatendida: string = `${environment.apiUrl}archivo/firma`;
  public urlPersonaEntidadcrear: string = `${environment.apiUrl}personaEntidad/crear`;
  public urlModeloTeuListar: string = `${environment.apiUrl}modeloTeu/listar`;
  public urlTramiteExpedienteEditar: string = `${environment.apiUrl}tramite/editar`;
  public urlDevolverExpediente: string = `${environment.apiUrl}expediente/devolverExpediente/`;
  public urlMensajeRechazar: string = `${environment.apiUrl}mensaje/rechazar`;
  public urlExpedienteRepresentanteListar: string = `${environment.apiUrl}personaRepresentante/listar`;
  public urlfinalizarTarea: string = `${environment.apiUrl}tareaTramiteExpediente/finalizar`;
  public urlMetadatosVer: string = `${environment.apiUrl}archivo/verMetadatos`;
  public urlCrearTablonAnuncio: string = `${environment.apiUrl}seTablonAnuncios/crear/`;
  public urlBorrarAtributo: string = `${environment.apiUrl}atributoExpediente/borrar/`;
  public urlEditarAtributo: string = `${environment.apiUrl}atributoExpediente/editar`;
  public urlEditarPersonaEntidad: string = `${environment.apiUrl}personaEntidad/editar`;
  public urlBajaHabitante: string = `${environment.apiUrl}habitante/baja`;

  public response = new Response();
  public httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  public urleditaexpedientemail!: string;

  private baseUrlExpediente = `${environment.apiUrl}expediente`;


  constructor(
    public http: HttpClient,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private modalManager: ModalManagerService,
    private session: UserSessionService,
    private notificationService: NotificationService
  ) {
  }

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get idOrgUsuar(): string | null {
    return this.session.idOrgUsuar;
  }

  get usuContrl(): string | null {
    return this.session.user;
  }

  get instructor(): string | null {
    return this.session.user;
  }

  get urlEndPoint(): string {
    return `${environment.apiUrl}procedimiento/listar/${this.idOrgElemen}`;
  }

  getCertificadoDeuda(numDocum: string, idExpediente: number, usuario: string): Observable<Blob> {
    const url = `${environment.apiUrl}reciboCabecera/certificadoDeuda/${numDocum}/${idExpediente}/${usuario}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getTramiteTarea(idlistatareap: number): Observable<TareaProcedimientoDTO> {
    return this.http.get<TareaProcedimientoDTO>(`${environment.apiUrl}tareaProcedimiento/ver/${idlistatareap}`);
  }

  getVolanteEmpadronamiento(numDocum: string, idExpediente: number, usuario: string) {
    const url = `${environment.apiUrl}habitante/volante/${numDocum}/${idExpediente}/${usuario}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getCertificadoEmpadronamiento(numDocum: string, idExpediente: number, usuario: string) {
    const url = `${environment.apiUrl}habitante/certificadoEmp/${numDocum}/${idExpediente}/${usuario}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getTipoFirma(idtarea: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}archivo/tipoFirma/${idtarea}`).pipe(
      map(response => response)
    );

  }

  envioBajaHabitantes(bajahabitantes: any, documento: any): Observable<any> {
    JSON.stringify(bajahabitantes);
    let keys = JSON.stringify(bajahabitantes);
    console.log(`MODIFICAR PERSONA ENTIDAD `);
    console.table(bajahabitantes)
    return this.http.put<any>(`${this.urlBajaHabitante}/${documento}`, keys, {headers: this.httpHeaders});
  }

  getConsultaHabitantea(numDocum: any): Observable<any> {
    console.log("NUMERO DE DOCUMENTO : " + numDocum)
    return this.http.get(`${environment.apiUrl}/habitante/ver/${numDocum}`).pipe(
      map(response => response)
    );
  }

  getPaises(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/pais/listar`).pipe(
      map(response => response)
    );
  }

  getPersonaEntidad(numDocum: any): Observable<any> {
    console.log(`${environment.apiUrl}/personaEntidad/ver/${numDocum}`)
    return this.http.get(`${environment.apiUrl}/personaEntidad/ver/${numDocum}`).pipe(
      map(response => response)
    );
  }


  modificaPersonaEntidad(personaentidad: PersonaEntidad): Observable<any> {
    console.log(personaentidad);
    return this.http.put<any>(`${environment.apiUrl}personaEntidad/editar`, personaentidad, {headers: this.httpHeaders}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error modificando persona entidad:', error);
        return throwError(() => new Error('Error modificando persona entidad'));
      })
    );
  }

// SERVICIO PARA OBTENER LOS TIPOS
  getTipoObjetoTributario(): Observable<TipoObjetoTributarioDto[]> {
    return this.http.get<TipoObjetoTributarioDto[]>(`${environment.apiUrl}/tipoObjetoTributario/listar`);
  }

  // SERVICIO PARA DAR DE BAJA UN OBJETO
  putBajaObjetoTributario(dto: Partial<ObjetoTributarioDto>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/objetoTributario/baja`, dto);
  }


  getObjetoTributario(idtipobjeto: any, numDocum: any): Observable<any> {
    console.log("GET OBJETO TRIBUTARIO : --> " + `${environment.apiUrl}objetoTributario/ver/${idtipobjeto}/${numDocum}`)
    return this.http.get(`${environment.apiUrl}objetoTributario/ver/${idtipobjeto}/${numDocum}`).pipe(
      map(response => response)
    );
  }

  getConsultaVehiculo(numDocum: any): Observable<any> {
    console.log("NUMERO DE DOCUMENTO : " + numDocum)
    return this.http.get(`${environment.apiUrl}vehiculo/ver/${numDocum}`).pipe(
      map(response => response)
    );
  }

  deleteAtributo(idGrupo: any, etiGruAtrib: any, idExped: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    console.log(`RUTA PARA BORRADO DE ATRIBUTOS: ${this.urlBorrarAtributo}${idGrupo}/${etiGruAtrib}/${idExped}`)
    return this.http.delete<any>(`${this.urlBorrarAtributo}${idGrupo}/${etiGruAtrib}/${idExped}`, {headers: httpHeaders})
  }

  modificaAtributo(atributomodificar: any, idExpedi: any): Observable<any> {
    if (atributomodificar.valor.includes('-')) {
      let dia = atributomodificar.valor.substring(8, 10)//ok
      let mes = atributomodificar.valor.substring(5, 7)//ok
      let year = atributomodificar.valor.substring(0, 4)//ok
      let nuevafecha = dia + '/' + mes + '/' + year
      console.log("fecha: -> " + nuevafecha)
      atributomodificar.valor = nuevafecha;

    }
    JSON.stringify(atributomodificar);
    let varios = {
      "etiGruAtrib": atributomodificar.etiGruAtrib,
      "idGrupo": atributomodificar.idGrupo,
      "valor": atributomodificar.valor,
      "idExped": idExpedi,
      "usuContr": this.usuContrl
    }
    let keys = JSON.stringify(varios);
    console.log(`DATOS KEY!!! : ${keys}`)
    console.log(` URL de editar atributos : ${this.urlEditarAtributo}`)
    return this.http.put<any>(`${this.urlEditarAtributo}`, keys, {headers: this.httpHeaders});
  }

  getAtributosListar(idExpediente: any): Observable<Atributosleer[]> {
    console.log("CONSULTA ATRIBUTOS : -->" + `${environment.apiUrl}atributoExpediente/listar/${idExpediente}`);
    return this.http.get(`${environment.apiUrl}atributoExpediente/listar/${idExpediente}`).pipe(
      map(response => (response as Atributosleer[]) ?? []),
    );

  }

  getModeloTeuListar(): Observable<ModeloTeuListar[]> {

    return this.http.get(`${this.urlModeloTeuListar}`).pipe(
      map(response => response as ModeloTeuListar[])
    );

  }

  postArchivoFirmadoEF(archivofirmadoef: ArchivoFirmadoEF, usuario: any, idTarea: any): Observable<any> {
    let varios = {
      "asunto": archivofirmadoef.asunto,
      "texto": archivofirmadoef.texto,
      "prioridad": archivofirmadoef.prioridad
    }

    let keys = JSON.stringify(varios);

    console.log(`NUEVO  FIRMA EF DESDE SERVICE: ${keys}`);
    console.log(`URL GENERAR ARCHIVO FIRMA EF DESDE SERVICE  : ${this.urlArchivoFirmaEF}/${usuario}/${idTarea} `);
    return this.http.post <ArchivoFirmadoEF>(`${this.urlArchivoFirmaEF}/${usuario}/${idTarea}`, keys, {headers: this.httpHeaders});

  }

  postArchivoFirmadoEFDesatendida(usuario: any, idTarea: any): Observable<any> {
    console.log(`URL GENERAR ARCHIVO FIRMA DESATENDIDA DESDE SERVICE  : ${this.urlArchivoFirmaEFDesatendida}/${usuario}/${idTarea}`);
    return this.http.post <any>(`${this.urlArchivoFirmaEFDesatendida}/${usuario}/${idTarea}`, {headers: this.httpHeaders});
  }

  crearInsertaBolsa(insertarbolsacrear: InsertaBolsaCrear, idperso: number, idHisPerso: number, codArchi: number, idTarea: number): Observable<any> {

    let varios = {
      "usuContr": insertarbolsacrear.usuContr,
      "prioridad": insertarbolsacrear.prioridad,
      "tipSesion": insertarbolsacrear.tipSesion,
      "fecAlta": insertarbolsacrear.fecAlta,
      "fecPrefe": insertarbolsacrear.fecPrefe,
      "extracto": insertarbolsacrear.extracto,
      "observaciones": insertarbolsacrear.observaciones,
      "expMotiv": insertarbolsacrear.expMotiv,
      "refExped": insertarbolsacrear.refExped,
      "fecMaxResol": insertarbolsacrear.fecMaxResol,
      "tipPunto": insertarbolsacrear.tipPunto,
      "estado": insertarbolsacrear.estado,
      "idOrgEleme": insertarbolsacrear.idOrgEleme,
      "dictamen": insertarbolsacrear.dictamen
    }

    let keys = JSON.stringify(varios);
    return this.http.post<InsertaBolsaCrear>(`${this.urlBolsaPuntosCrear}${idperso}/${idHisPerso}/${codArchi}/${idTarea}`, keys, {headers: this.httpHeaders});
  }

  crearGenerarSalida(creargenerarsalida: CrearGenerarSalida, idperso: number, idHisPerso: number, codArchi: number, idTarea: number): Observable<any> {
    let varios = {
      "usuContr": creargenerarsalida.usuContr,
      "codTema": creargenerarsalida.codTema,
      "extracto": creargenerarsalida.extracto,
      "observaciones": creargenerarsalida.observaciones,
      "forNotif": creargenerarsalida.forNotif,
      "idOrgEleOrige": this.idOrgElemen,
      "ejeExped": creargenerarsalida.ejeExped,
      "numExped": creargenerarsalida.numExped
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVO MENSAJE DESDE SERVICE: ${keys}`);
    console.log(`URL GENERAR SALIDA : ${this.urlRdDocumentoCrear}${idperso}/${idHisPerso}/${codArchi}/${idTarea} `);
    return this.http.post<CrearGenerarSalida>(`${environment.apiUrl}rdDocumento/crear/${idperso}/${idHisPerso}/${codArchi}/${idTarea}`, keys, {headers: this.httpHeaders});
  }

  conviertopdf(idTarea: any): Observable<any> {

    console.log(`conversion a pdf: ${environment.apiUrl}tareaTramiteExpediente/convertirPDF/${this.usuContrl}/${idTarea}`);
    return this.http.post<any>(`${environment.apiUrl}tareaTramiteExpediente/convertirPDF/${this.usuContrl}/${idTarea}`, {headers: this.httpHeaders});
  }


  getMetadatosVer(nundocu: number): Observable<VerMetadatos> {

    console.log(`RESPUESTA DESDE SERVICE URLMETADATOS : ${this.urlMetadatosVer}/${nundocu}`)
    return this.http.get(`${this.urlMetadatosVer}/${nundocu}`).pipe(
      map(response => response as VerMetadatos)
    );

  }

  getRegistroDocVer(regdocu: any): Observable<RegistroDocumento> {

    console.log(`RESPUESTA DESDE SERVICE REGISTRO DOCUMENTOS : ${this.urlregistrodocumentolistar}/${regdocu}`)
    return this.http.get(`${this.urlregistrodocumentolistar}/${regdocu}`).pipe(
      map(response => response as RegistroDocumento)
    );

  }


  DevolverExpediente(idexpedi: any) {

    let varios = {}

    let keys = JSON.stringify(varios);

    console.log(`DEvolver Expediente: ${keys}`);
    console.log(`URL de DEvolver EXpediente : ${this.urlDevolverExpediente}${idexpedi}/${this.idOrgUsuar}/${this.usuContrl}`);
    return this.http.put<CrearNotificacion>(`${this.urlDevolverExpediente}${idexpedi}/${this.idOrgUsuar}/${this.usuContrl}`, keys, {headers: this.httpHeaders});
  }


  CierraModal() {
    this.modalManager.closeModal('CrearNotificacionModal');
  }


  LeerMensaje(rechazarmensaje: RechazarMensaje, id: number): Observable<any> {

    let varios = {


      "fecLectura": rechazarmensaje.fecLectura,
      "estado": rechazarmensaje.estado

    }

    let keys = JSON.stringify(varios);
    return this.http.put<RechazarMensaje>(`${this.urlMensajeEditar}/${id}`, keys, {headers: this.httpHeaders});

  }

  RechazarMensaje(rechazarmensaje: RechazarMensaje, id: number): Observable<any> {

    let varios = {

      "fecRechazo": rechazarmensaje.fecRechazo,

      "nomDesti": rechazarmensaje.destinatario,
      "EstadoMensaje": rechazarmensaje.EstadoMensaje,
      "descripcionRechazo": rechazarmensaje.descripcionRechazo,
      "estado": rechazarmensaje.estado

    }

    let keys = JSON.stringify(varios);
    console.log(`RECHAZO MENSAJE DESDE SERVICE: ${keys}`);
    console.log(` URL RECHAZO : ${this.urlMensajeEditar}/${id}`);
    return this.http.put<RechazarMensaje>(`${this.urlMensajeRechazar}/${id}`, keys, {headers: this.httpHeaders});
  }

  EditarMensaje(editarmensaje: EditarMensaje, id: number): Observable<any> {
    let varios = {
      "idTarea": editarmensaje.idTarea,
      "idOrgUsuar": this.idOrgUsuar,
      "idOrgElemen": this.idOrgElemen,
      "usuContrl": this.usuContrl,
      "fecEnvio": editarmensaje.fecEnvio,
      "descripcion": editarmensaje.descripcion,
      "fecLectura": editarmensaje.fecLectura,
      "fecTramitacion": editarmensaje.fecTramitacion,
      "fecRechazo": editarmensaje.fecRechazo,
      "remitente": this.idOrgUsuar,
      "destinatario": editarmensaje.destinatario,
      "EstadoMensaje": editarmensaje.EstadoMensaje,
      "estado": editarmensaje.estado,
      "nomDesti": editarmensaje.nomDesti,
      "informativo": editarmensaje.informativo,
      "descripcionRechazo": editarmensaje.descripcionRechazo

    }
    let keys = JSON.stringify(varios);
    console.log(`EDITAR MENSAJE DESDE SERVICE: ${keys}`);
    console.log("URL EDITAR :" + `${this.urlMensajeEditar}/${id}`)
    return this.http.put<EditarMensaje>(`${this.urlMensajeEditar}/${id}`, keys, {headers: this.httpHeaders});
  }

  TramitaMensaje(editarmensaje: EditarMensaje, id: number): Observable<any> {
    let varios = {}
    let keys = JSON.stringify(varios);
    console.log(`EDITAR MENSAJE DESDE SERVICE: ${keys}`);
    console.log(`url: ${keys}` + `${this.urlMensajeTramitar}/${id}`);
    return this.http.put<EditarMensaje>(`${this.urlMensajeTramitar}/${id}`, keys, {headers: this.httpHeaders});
  }


  getArchivoFirmantes(usuario: string, idtarea: any): Observable<ArchivoFirmantes[]> {
    return this.http.get(`${environment.apiUrl}archivo/firmantes/${usuario}/${idtarea}`).pipe(
      map(response => response as ArchivoFirmantes[])
    );
  }

  getMensajeListarRecibidos(): Observable<LeerMensajeRecibidos[]> {
    return this.http.get(`${this.urlMensajeListarRecibidos}/${this.idOrgUsuar}`).pipe(
      map(response => response as LeerMensajeRecibidos[]),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of([]);
        }
        return throwError(() => error);
      }),
    );
  }

  getMensajeListarEnviados(): Observable<LeerMensajeEnviados[]> {
    return this.http.get(`${this.urlMensajeListarEnviados}/${this.idOrgUsuar}`).pipe(
      map(response => response as LeerMensajeEnviados[])
    );
  }

  deleteMensaje(idMensaje: any): Observable<CrearMensaje> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CrearMensaje>(`${this.urlMensajeBorrar}/${idMensaje}`, {headers: httpHeaders})
  }

  creaTablonAnuncio(creatablonanuncio: CrearTablonAnuncio, idTarea) {


    let varios = {
      "idOrgEleme": this.idOrgElemen,
      "tipAnunc": creatablonanuncio.tipAnunc,
      "desAnunc": creatablonanuncio.desAnunc,
      "fecDesde": creatablonanuncio.fecDesde,
      "fecHasta": creatablonanuncio.fecHasta,
    }
    let keys = JSON.stringify(varios);

    console.log(`NUEVO TABLON DE ANUNCIOS DESDE SERVICE: ${keys}`);
    console.log(`URL de CREAR TABLON : ${this.urlMensajeCrear} `)
    return this.http.post<CrearTablonAnuncio>(this.urlCrearTablonAnuncio + idTarea, keys, {headers: this.httpHeaders});
  }

  crearMensaje(crearmensaje: CrearMensaje): Observable<any> {

    //  console.log("* *************** TRAZA 01 ************************");
    let varios = {
      "idExped": crearmensaje.idExpediente,
      "idOrgUsuar": this.idOrgUsuar,
      "fecEnvio": crearmensaje.fecEnvio,
      "descripcion": crearmensaje.descripcion,
      "fecLectura": crearmensaje.fecLectura,
      "fecTramitacion": crearmensaje.fecTramitacion,
      "fecRechazo": crearmensaje.fecRechazo,
      "remitente": this.idOrgUsuar,
      "destinatario": crearmensaje.destinatario,
      "EstadoMensaje": crearmensaje.EstadoMensaje,
      "informativo": crearmensaje.informativo,
      "descripcionRechazo": crearmensaje.descripcionRechazo,
      "posesion": crearmensaje.posesion


    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVO MENSAJE DESDE SERVICE: ${keys}`);
    console.log(`URL de CREAR : ${this.urlMensajeCrear} `)
    return this.http.post<CrearMensaje>(this.urlMensajeCrear, keys, {headers: this.httpHeaders});
  }

  deleteTareaTramiteExpediente(idtarea: any): Observable<TareaTramiteExpedienteCrear> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<TareaTramiteExpedienteCrear>(`${this.urlTareaTramiteExpedienteBorrar}/${idtarea}`, {headers: httpHeaders})
  }

  crearExpediente(nuevoexpediente: NuevoExpediente): Observable<any> {

    let result = JSON.stringify(nuevoexpediente);

    let varios = {
      "estado": "ABIERTO",
      "fase": "INICIO",
      "idHisDocum": nuevoexpediente.idHisDocum,
      "idDocum": nuevoexpediente.idDocum,
      "fecInicio": nuevoexpediente.fechaInicio,
      "formaApertura": "OFICIO",
      "titulo": nuevoexpediente.titulo,
      "instructor": this.instructor,
      "procedimiento": nuevoexpediente.procedimiento,
      "usuContr": this.usuContrl,
      "departamento": this.idOrgElemen,
      "idHisPerso": nuevoexpediente.idHisPerso,
      "idPerso": nuevoexpediente.idPerso,
      "ejercicio": nuevoexpediente.ejercicio,
      "solicitud": nuevoexpediente.idsolicitud,
      "idRepre": nuevoexpediente.idRepre,
      "idHisRepre": nuevoexpediente.idHisRepre,
      "asunto": nuevoexpediente.asunto,

    }
    let keys = JSON.stringify(varios);

    if (nuevoexpediente.email == null) {
      nuevoexpediente.email = "0";

    }
    let email: string = nuevoexpediente.email;
    let fnotifi: number = nuevoexpediente.formaNotifi;
    let url: string = `${this.urlexpedientecrear}/${email}/${fnotifi}`;
    console.log(`DATOS RECIBIDOS DESDE SERVICE: ${keys}`);
    console.log(`URL DEFINITIVA MONTADA: ${url}`);
    return this.http.post<NuevoExpediente>(url, keys, {headers: this.httpHeaders});
  }

  crearTareaTramiteExpedientes(tareatramiteexpedientecrear: TareaTramiteExpedienteCrear, plantillaDefecto: string | null): Observable<any> {
    const plantillaParam = plantillaDefecto || 'null'

    const datosTarea = {
      descripcion: tareatramiteexpedientecrear.descripcion || '',
      fecFin: tareatramiteexpedientecrear.fecFin || null,
      fecInicio: tareatramiteexpedientecrear.fecInicio || new Date(),
      firmante: tareatramiteexpedientecrear.firmante || null,
      visible: tareatramiteexpedientecrear.visible !== undefined ? tareatramiteexpedientecrear.visible : true,
      tareaProcedimiento: tareatramiteexpedientecrear.tareaProcedimiento || null,
      tramite: tareatramiteexpedientecrear.tramite || null,
      usuario: this.usuContrl || '',
      propuestaResolucion: tareatramiteexpedientecrear.propuestaResolucion || null,
      id_His_Docum: tareatramiteexpedientecrear.id_His_Docum || null,
      idDocum: tareatramiteexpedientecrear.idDocum || null,
      usuContr: this.usuContrl || '',
      fecContr: tareatramiteexpedientecrear.fecContr || new Date(),
      archivo: tareatramiteexpedientecrear.archivo || null,
      tipAnexo: tareatramiteexpedientecrear.anexo || null,
      docAport: tareatramiteexpedientecrear.documAportada || null,
      tipDocEni: tareatramiteexpedientecrear.tipoDocumEni || null,
      documentacion: tareatramiteexpedientecrear.documentacion || null
    }

    return this.http.post<TareaTramiteExpedienteCrear>(
      this.urlTareaTramiteExpedienteCrear + '/' + plantillaParam,
      datosTarea,
      {headers: this.httpHeaders}
    )
  }

  EditarTareaTramiteExpedientes(tareatramiteexpedienteeditar: TareaTramiteExpedienteEditar, id: number): Observable<any> {
    const datosTarea = {
      descripcion: tareatramiteexpedienteeditar.descripcion || '',
      fecFin: tareatramiteexpedienteeditar.fecFin || null,
      visible: tareatramiteexpedienteeditar.visible !== undefined ? tareatramiteexpedienteeditar.visible : true,
      archivo: tareatramiteexpedienteeditar.archivo || null,
      tramite: tareatramiteexpedienteeditar.tramite || null,
      usuario: tareatramiteexpedienteeditar.usuario || '',
      propuestaResolucion: tareatramiteexpedienteeditar.propuestaResolucion || null,
      idDocum: tareatramiteexpedienteeditar.idDocum || null,
      usuContr: this.usuContrl || '',
      fecContr: tareatramiteexpedienteeditar.fecContr || new Date(),
      tipAnexo: tareatramiteexpedienteeditar.anexo || null,
      docAport: tareatramiteexpedienteeditar.documAportada || null,
      tipDocEni: tareatramiteexpedienteeditar.tipoDocumEni || null,
      documentacion: tareatramiteexpedienteeditar.documentacion || null,
      fecInicio: tareatramiteexpedienteeditar.fecInicio || new Date()
    }

    return this.http.put<TareaTramiteExpedienteEditar>(
      `${this.urlTareaTramiteExpedienteEditar}/${id}`,
      datosTarea,
      {headers: this.httpHeaders}
    )
  }

  EditarTramiteExpedientes(tramiteexpedienteeditar: EditarTramiteExp, id: number): Observable<any> {
    let varios = {
      "id": id,
      "descripcion": tramiteexpedienteeditar.descripcion,
      "fase": tramiteexpedienteeditar.fase,
      "fecTramite": tramiteexpedienteeditar.fecTramite,
      "numero": tramiteexpedienteeditar.numero,
      "expediente": tramiteexpedienteeditar.expediente,
      "usuContr": this.usuContrl,
      "fecContr": tramiteexpedienteeditar.fecContr
    }
    let keys = JSON.stringify(varios);
    console.log(`EDITAR TRAMITE DESDE SERVICE: ${keys}`);
    console.log(`URL EDICION TRAMITE ${this.urlTramiteExpedienteEditar}/${id}`)
    return this.http.put<EditarTramiteExp>(`${this.urlTramiteExpedienteEditar}/${id}`, keys, {headers: this.httpHeaders});

  }

  finalizarTarea(idtarea: number): Observable<any> {
    let varios = {}
    let keys = JSON.stringify(varios);
    console.log(`EDITAR TRAMITE DESDE SERVICE: ${keys}`);
    console.log(`URL EDICION TRAMITE ${this.urlfinalizarTarea}/${idtarea}`)
    return this.http.put<EditarTramiteExp>(`${this.urlfinalizarTarea}/${idtarea}`, keys, {headers: this.httpHeaders});
  }

  getTareaTramiteExpedienteListar(idTramite: number): Observable<TareaTramiteExpedienteListar[]> {
    console.log(`URL DE CONSULTA DE TAREA : ${this.urlTareaTramiteExpedienteListar}/${idTramite}`)
    return this.http.get(`${this.urlTareaTramiteExpedienteListar}/${idTramite}`).pipe(
      map(response => response as TareaTramiteExpedienteListar[]),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of([]);
        }
        return throwError(() => error);
      }),
    );
  }

  getTareaTramiteExpedienteUsuarioListar(): Observable<TareaTramiteExpedienteUsuarioListar[]> {
    console.log(`URL DE CONSULTA DE TAREA : ${this.urlTareaTramiteExpedienteListar}/${this.instructor}`)
    return this.http.get(`${this.urlTareaTramiteExpedienteUsuarioListar}/${this.instructor}`).pipe(
      map(response => response as TareaTramiteExpedienteUsuarioListar[])
    );
  }

  deleteTramite(id: any): Observable<CrearTramiteExp> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CrearTramiteExp>(`${this.urltramiteborrar}/${id}`, {headers: httpHeaders})
  }

  deleteInteresado(id: any): Observable<CrearInteresado> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CrearInteresado>(`${this.urlinteresadoBorrar}/${id}`, {headers: httpHeaders})
  }

  deleteTramitador(id: any): Observable<CreaTramitador> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<CreaTramitador>(`${this.urltramitadorBorrar}/${id}`, {headers: httpHeaders})
  }

  getTareaTramiteExpeporExpe(idexpe: any): Observable<TareaTramiteExpporExpedi[]> {
    console.log(`URL DE CONSULTA  Expedientes: ${this.urlTareaTramiteExpedienteListarExpedi}/${idexpe}`)
    return this.http.get(`${this.urlTareaTramiteExpedienteListarExpedi}/${idexpe}`).pipe(
      map(response => response as TareaTramiteExpporExpedi[])
    );
  }

  getExpedientesListar(): Observable<ExpedienteListar[]> {
    console.log(`URL DE CONSULTA  Expedientes: ${this.urlexpedientelistar}/${this.instructor}`)
    return this.http.get(`${this.urlexpedientelistar}/${this.instructor}`).pipe(
      map(response => response as ExpedienteListar[])
    );
  }

  getExpedientesInstructor(): Observable<VerExpedientesInstructor[]> {
    console.log(`URL DE CONSULTA  Expedientes listar Instructor: ${this.urlexpedientelistarInstructor}/${this.instructor}`)
    return this.http.get(`${this.urlexpedientelistarInstructor}/${this.instructor}`).pipe(
      map(response => response as VerExpedientesInstructor[])
    );
  }

  getTareaTramiteExpedientesUsuario(): Observable<VerTareaTramiteExpporUsuario[]> {
    console.log(`URL DE CONSULTA  Expedientes listar Instructor: ${this.urltareatramiteexpedienteusuariolistar}/${this.instructor}`)
    return this.http.get(`${this.urltareatramiteexpedienteusuariolistar}/${this.instructor}`).pipe(
      map(response => response as VerTareaTramiteExpporUsuario[])
    );
  }

  getInteresadoListar(idexpe: number): Observable<ListarInteresados[]> {
    const url = `${environment.apiUrl}interesado/listar/${idexpe}`;
    return this.http.get<ListarInteresados[]>(url).pipe(
      map(response => response)
    );
  }

  getInteresadoListarDto(idexpe: number): Observable<InteresadoListarDto[]> {
    const url = `${environment.apiUrl}interesado/listar/${idexpe}`;
    return this.http.get<InteresadoListarDto[]>(url).pipe(
      map(response => response)
    );
  }

  getTramitesListar(idexpe: number): Observable<ListarTramites[]> {
    console.log(`url de listado de trámites :  ${this.urltramitelistar}/${idexpe}`)
    return this.http.get(`${this.urltramitelistar}/${idexpe}`).pipe(
      map(response => response as ListarTramites[])
    );
  }

  cancelarExpediente(id: number, fcancela: Date): Observable<EditExpediente> {
    const varios = {
      "estado": "CANCELADO",
      "fecCancelacion": fcancela
    }
    const keys = JSON.stringify(varios)
    const urlEdita: string = `${environment.apiUrl}expediente/editar/${id}`
    return this.http.put<EditExpediente>(urlEdita, keys, {headers: this.httpHeaders})
  }

  cerrarExpediente(id: number, fechacierre: any, serieDocu): Observable<EditExpediente> {
    const varios = {
      "estado": "CERRADO",
      "fecFin": fechacierre,
      "serieDocumental": serieDocu
    }
    const keys = JSON.stringify(varios)
    const urlEdita: string = `${environment.apiUrl}expediente/cerrar/${id}`
    return this.http.put<EditExpediente>(urlEdita, keys, {headers: this.httpHeaders})
  }

  getTramiteExpListar(idexpe: number): Observable<TramiteExpListar[]> {
    return this.http.get(`${this.urlexpeditramitelistar}/${idexpe}`).pipe(
      map(response => response as TramiteExpListar[])
    );
  }

  getTramitadorListar(idexpe: number): Observable<ListarTramitador[]> {
    return this.http.get(`${this.urltramitadorlistar}/${idexpe}`).pipe(
      map(response => response as ListarTramitador[])
    );
  }

  crearTramiteExp(creartramitexp: CrearTramiteExp): Observable<any> {
    let varios = {
      "fase": creartramitexp.fase,
      "fecTramite": creartramitexp.fecTramite,
      "expediente": creartramitexp.idexpediente,
      "descripcion": creartramitexp.descripcion,
      "usuContr": this.usuContrl,
    }
    let keys = JSON.stringify(varios);
    console.log(`DATOS RECIBIDOS DESDE SERVICE: ${keys}`);
    this.notificationService.success({ title: 'Nuevo Trámite de Expediente  ', text: ` creado con éxito` })
    return this.http.post<CrearTramiteExp>(this.urlexpeditramitecrear, keys, {headers: this.httpHeaders});

  }

  crearInteresado(crearinteresado: CrearInteresado): Observable<any> {
    let varios = {
      "fecInicio": crearinteresado.fechaInicio,
      "forma_apertura": crearinteresado.forma_apertura,
      "instructor": this.instructor,
      "procedimiento": crearinteresado.procedimiento,
      "usuContr": this.usuContrl,
      "departamento": this.idOrgElemen,
      "idHisPerso": crearinteresado.idHisPerso,
      "idPerso": crearinteresado.idPerso,
      "ejercicio": crearinteresado.ejercicio,
      "solicitud": crearinteresado.idsolicitud,
      "expediente": crearinteresado.idexpediente,
      "emailNotif": crearinteresado.email,
      "forNotif": crearinteresado.tipForNotif,
      "principal": 0,
      "idHisRepre": crearinteresado.idHisRepre,
      "idRepre": crearinteresado.idPersoRepre
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVO INTERESADO DESDE SERVICE: ${keys}`);
    console.log(`URL DESDE SERVICE: ${this.urlinteresadocrear}`);
    return this.http.post<CrearInteresado>(this.urlinteresadocrear, keys, {headers: this.httpHeaders});

  }

  crearTramitadorExp(creatramitador: CreaTramitador): Observable<any> {
    let varios = {
      "idTarea": creatramitador.idTarea,
      "fecAsignacion": this.fecha,
      "expediente": creatramitador.expediente,
      "usuario": creatramitador.usuario,
      "estadoTramitacion": creatramitador.estadoTramitacion,
      "fecContr": creatramitador.fecContr,
      "usuContr": this.usuContrl
    }
    let keys = JSON.stringify(varios);
    return this.http.post<CreaTramitador>(`${this.urltramitadorcrear}/${creatramitador.idTarea}`, keys, {headers: this.httpHeaders});
  }

  public getExpediente(id: number): Observable<VerExpediente> {
    let consulta: string = `${this.baseUrlExpediente}/ver/${id}`;
    
    return this.http.get(consulta).pipe(
      map(response => response as VerExpediente)
    );
  }

  public getTareaTramiteExpVer(id: number): Observable<TareaTramiteExpedienteVer> {
    console.log(`ID DE LA TAREA  DESDE SERVICES: ${id}`);
    this.idTarea = id;
    let consulta: string = `${environment.apiUrl}tareaTramiteExpediente/ver/${id}`;
    console.log(`URL DE LA TAREA  DESDE SERVICES: ${consulta}`);
    return this.http.get(consulta).pipe(map(response => response as TareaTramiteExpedienteVer));
  }

  public getExpediente2(id: number): Observable<VerExpediente> {
    console.log(`ID DEL EXPEDIENTE DESDE SERVICES: ${id}`);
    let consulta: string = `${environment.apiUrl}expediente/ver/${id}`;
    console.log(`datos URL: ${consulta}`)
    return this.http.get(consulta).pipe(map(response => response as VerExpediente));
  }

  getFormaNotif(idExped: number): Observable<number> {
    const url = `${environment.apiUrl}expediente/formaNotif/${idExped}`;
    return this.http.get<number>(url);
  }


  getDni(dni): Observable<ConsultaDni> {
    let urldni: string = `${environment.apiUrl}personaEntidad/ver/${dni}`
    console.log("consultaDNI : " + urldni)
    return this.http.get(urldni).pipe(map(response => response as ConsultaDni)
    );
  }

  getDni2(dni): Observable<ConsultaDni> {
    let urldni: string = `${environment.apiUrl}personaEntidad/ver/${dni}`
    console.log("consultaDNI : " + urldni)
    return this.http.get(urldni).pipe(map(response => response as ConsultaDni)
    );
  }

  crearPersonaEntidad(crearpersonaentidad: CrearPersonaEntidad, dni: string): Observable<any> {
    let varios = {
      "numDocum": dni,
      "tipPerso": crearpersonaentidad.tipPerso,
      "nombre": crearpersonaentidad.nombre,
      "apellido1": crearpersonaentidad.apellido1,
      "apellido2": crearpersonaentidad.apellido2,
      "razSocia": crearpersonaentidad.razSocia,
      "localidad": crearpersonaentidad.localidad,
      "codPosta": crearpersonaentidad.codPosta,
      "dirPosta": crearpersonaentidad.dirPosta,
      "municipio": crearpersonaentidad.municipio,
      "provincia": crearpersonaentidad.provincia
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVO PERSONA ENTIDAD DESDE SERVICE: ${keys}`);
    console.log(`URL DESDE SERVICE CREAR PERSONA ENTIDAD: ${this.urlPersonaEntidadcrear}`);
    return this.http.post<CrearPersonaEntidad>(this.urlPersonaEntidadcrear, keys, {headers: this.httpHeaders});

  }

  getProcedimientos(): Observable<Procedimiento[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Procedimiento[])
    );
  }

  getRepresentanteExpediente(idperso: any, idHisperso: any): Observable<RepresentanteExpLIstar> {
    console.log("DATOS DE LISTADO DE REPRESENTANTE: " + `${this.urlExpedienteRepresentanteListar}/${idperso}/${idHisperso}`);
    return this.http.get(`${this.urlExpedienteRepresentanteListar}/${idperso}/${idHisperso}`).pipe(
      map(response => response as RepresentanteExpLIstar)
    );
  }

  // public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  getTemaDocumentoListar(): Observable<TemaDocumentoListar[]> {
    console.log("LANZAMOS CONSULTA DE TEMA")
    return this.http.get(`${environment.apiUrl}temaDocumento/listar/${this.idOrgElemen}`).pipe(
      map(response => response as TemaDocumentoListar[])
    );
  }

  editarExpediente(editartarexpediente: EditExpediente, id: any): Observable<EditExpediente> {
    JSON.stringify(editartarexpediente);
    let varios = {
      "idExpediente": id,
      "titulo": editartarexpediente.titulo,
      "formaApertura": editartarexpediente.forma_apertura,
      "procedimiento": editartarexpediente.procedimiento,
      "fecInicio": editartarexpediente.fecInicio,
      "interesado": editartarexpediente.dni,
      "email": editartarexpediente.email,
      "forNotif": editartarexpediente.forNotif
    }
    let keys = JSON.stringify(varios);
    this.urleditaexpedientemail = `${environment.apiUrl}expediente/editar/${id}`
    let urlEditaT: string = this.urleditaexpedientemail;
    console.log("KEY editar EXP : " + keys);
    console.log("URL editar EXP : " + urlEditaT)
    return this.http.put<EditExpediente>(urlEditaT, keys, {headers: this.httpHeaders});
  }



  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio:', error);
    return throwError(() => error);
  }
}
