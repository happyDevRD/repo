import {Injectable, inject} from '@angular/core';
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
import {ModalManagerService} from '../../core/service/modal-manager.service';
import {UserSessionService} from '../../core/service/user-session.service';
import {NotificationService} from '../../core/service/notification.service';
import {catchNotFoundAsEmpty} from '../../core/helper/rxjs-error.helper';
import {TareaProcedimientoDTO} from "../../core/models/tarea-procedimiento.dto";
import {PersonaEntidad} from "../../core/models/personaentidad.model";
import {HabitanteDto} from "../../core/models/habitante.dto";
import {VehiculoDto} from "../../core/models/vehiculo.dto";
import {BajaHabitantes} from "../../core/models/baja-habitantes.model";
import {TareaTramiteExpedienteVer} from "../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto";
import {TipoObjetoTributarioDto} from "../../core/models/tipo-objeto-tributario.dto";
import {ObjetoTributarioDto} from "../../core/models/objeto-tributario.dto";
import {InteresadoListarDto} from "../../core/models/interesado.dto";
import {PersonaEntidadApiService} from '../../core/service/persona/persona-entidad-api.service';
import {ExpedienteApiService} from '../../core/service/expediente/expediente-api.service';
import {TareaTramiteExpedienteApiService} from '../../core/service/tarea-tramite/tarea-tramite-expediente-api.service';
import {RdDocumentoApiService} from '../../core/service/documento/rd-documento-api.service';
import {ProcedimientoApiService} from '../../core/service/procedimiento/procedimiento-api.service';


@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  private readonly personaEntidadApi = inject(PersonaEntidadApiService);
  private readonly expedienteApi = inject(ExpedienteApiService);
  private readonly tareaTramiteApi = inject(TareaTramiteExpedienteApiService);
  private readonly rdDocumentoApi = inject(RdDocumentoApiService);
  private readonly procedimientoApi = inject(ProcedimientoApiService);

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

  envioBajaHabitantes(bajahabitantes: BajaHabitantes, documento: string): Observable<unknown> {
    return this.personaEntidadApi.envioBajaHabitantes(bajahabitantes, documento)
  }

  getConsultaHabitantea(numDocum: string): Observable<HabitanteDto> {
    return this.personaEntidadApi.getConsultaHabitante(numDocum)
  }

  getPaises(): Observable<any> {
    return this.personaEntidadApi.getPaises()
  }

  getPersonaEntidad(numDocum: string): Observable<PersonaEntidad> {
    return this.personaEntidadApi.getPersonaEntidad(numDocum)
  }

  modificaPersonaEntidad(personaentidad: PersonaEntidad): Observable<PersonaEntidad> {
    return this.personaEntidadApi.modificaPersonaEntidad(personaentidad)
  }

// SERVICIO PARA OBTENER LOS TIPOS
  getTipoObjetoTributario(): Observable<TipoObjetoTributarioDto[]> {
    return this.http.get<TipoObjetoTributarioDto[]>(`${environment.apiUrl}/tipoObjetoTributario/listar`);
  }

  // SERVICIO PARA DAR DE BAJA UN OBJETO
  putBajaObjetoTributario(dto: Partial<ObjetoTributarioDto>): Observable<ObjetoTributarioDto> {
    return this.http.put<ObjetoTributarioDto>(`${environment.apiUrl}/objetoTributario/baja`, dto);
  }


  getObjetoTributario(idtipobjeto: string, numDocum: string): Observable<ObjetoTributarioDto> {
    return this.http.get<ObjetoTributarioDto>(`${environment.apiUrl}objetoTributario/ver/${idtipobjeto}/${numDocum}`)
  }

  getConsultaVehiculo(matricula: string): Observable<VehiculoDto> {
    return this.http.get<VehiculoDto>(`${environment.apiUrl}vehiculo/ver/${matricula}`)
  }

  deleteAtributo(idGrupo: any, etiGruAtrib: any, idExped: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<any>(`${this.urlBorrarAtributo}${idGrupo}/${etiGruAtrib}/${idExped}`, {headers: httpHeaders})
  }

  modificaAtributo(atributomodificar: any, idExpedi: any): Observable<any> {
    if (atributomodificar.valor.includes('-')) {
      let dia = atributomodificar.valor.substring(8, 10)//ok
      let mes = atributomodificar.valor.substring(5, 7)//ok
      let year = atributomodificar.valor.substring(0, 4)//ok
      let nuevafecha = dia + '/' + mes + '/' + year
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
    return this.http.put<any>(`${this.urlEditarAtributo}`, keys, {headers: this.httpHeaders});
  }

  getAtributosListar(idExpediente: any): Observable<Atributosleer[]> {
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

    return this.http.post <ArchivoFirmadoEF>(`${this.urlArchivoFirmaEF}/${usuario}/${idTarea}`, keys, {headers: this.httpHeaders});

  }

  postArchivoFirmadoEFDesatendida(usuario: any, idTarea: any): Observable<any> {
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
    return this.http.post<CrearGenerarSalida>(`${environment.apiUrl}rdDocumento/crear/${idperso}/${idHisPerso}/${codArchi}/${idTarea}`, keys, {headers: this.httpHeaders});
  }

  conviertopdf(idTarea: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}tareaTramiteExpediente/convertirPDF/${this.usuContrl}/${idTarea}`, {headers: this.httpHeaders});
  }


  getMetadatosVer(nundocu: number): Observable<VerMetadatos> {
    return this.rdDocumentoApi.getMetadatosVer(nundocu)
  }

  getRegistroDocVer(regdocu: any): Observable<RegistroDocumento> {
    return this.rdDocumentoApi.getRegistroDocVer(regdocu)
  }


  DevolverExpediente(idexpedi: any) {

    let varios = {}

    let keys = JSON.stringify(varios);

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
    return this.http.put<EditarMensaje>(`${this.urlMensajeEditar}/${id}`, keys, {headers: this.httpHeaders});
  }

  TramitaMensaje(editarmensaje: EditarMensaje, id: number): Observable<any> {
    let varios = {}
    let keys = JSON.stringify(varios);
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
      catchNotFoundAsEmpty<LeerMensajeRecibidos[]>(),
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

    return this.http.post<CrearTablonAnuncio>(this.urlCrearTablonAnuncio + idTarea, keys, {headers: this.httpHeaders});
  }

  crearMensaje(crearmensaje: CrearMensaje): Observable<any> {

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
    return this.http.post<CrearMensaje>(this.urlMensajeCrear, keys, {headers: this.httpHeaders});
  }

  deleteTareaTramiteExpediente(idtarea: any): Observable<TareaTramiteExpedienteCrear> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.delete<TareaTramiteExpedienteCrear>(`${this.urlTareaTramiteExpedienteBorrar}/${idtarea}`, {headers: httpHeaders})
  }

  crearExpediente(nuevoexpediente: NuevoExpediente): Observable<any> {
    return this.expedienteApi.crearExpediente(nuevoexpediente)
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
    return this.http.put<EditarTramiteExp>(`${this.urlTramiteExpedienteEditar}/${id}`, keys, {headers: this.httpHeaders});

  }

  finalizarTarea(idtarea: number): Observable<any> {
    let varios = {}
    let keys = JSON.stringify(varios);
    return this.http.put<EditarTramiteExp>(`${this.urlfinalizarTarea}/${idtarea}`, keys, {headers: this.httpHeaders});
  }

  getTareaTramiteExpedienteListar(idTramite: number): Observable<TareaTramiteExpedienteListar[]> {
    return this.http.get(`${this.urlTareaTramiteExpedienteListar}/${idTramite}`).pipe(
      map(response => response as TareaTramiteExpedienteListar[]),
      catchNotFoundAsEmpty<TareaTramiteExpedienteListar[]>(),
    );
  }

  getTareaTramiteExpedienteUsuarioListar(): Observable<TareaTramiteExpedienteUsuarioListar[]> {
    return this.tareaTramiteApi.listarUsuario()
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
    return this.tareaTramiteApi.listarPorExpediente(idexpe)
  }

  getExpedientesListar(): Observable<ExpedienteListar[]> {
    return this.http.get(`${this.urlexpedientelistar}/${this.instructor}`).pipe(
      map(response => response as ExpedienteListar[])
    );
  }

  getExpedientesInstructor(): Observable<VerExpedientesInstructor[]> {
    return this.expedienteApi.getExpedientesInstructor()
  }

  getTareaTramiteExpedientesUsuario(): Observable<VerTareaTramiteExpporUsuario[]> {
    return this.tareaTramiteApi.listarPendientesPorUsuario()
  }

  getInteresadoListar(idexpe: number): Observable<ListarInteresados[]> {
    return this.expedienteApi.getInteresadoListar(idexpe)
  }

  getInteresadoListarDto(idexpe: number): Observable<InteresadoListarDto[]> {
    const url = `${environment.apiUrl}interesado/listar/${idexpe}`;
    return this.http.get<InteresadoListarDto[]>(url).pipe(
      map(response => response)
    );
  }

  getTramitesListar(idexpe: number): Observable<ListarTramites[]> {
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
    return this.expedienteApi.getExpediente(id)
  }

  public getTareaTramiteExpVer(id: number): Observable<TareaTramiteExpedienteVer> {
    this.idTarea = id
    return this.tareaTramiteApi.ver(id)
  }

  public getExpediente2(id: number): Observable<VerExpediente> {
    return this.expedienteApi.getExpediente2(id)
  }

  getFormaNotif(idExped: number): Observable<number> {
    const url = `${environment.apiUrl}expediente/formaNotif/${idExped}`;
    return this.http.get<number>(url);
  }


  getDni(dni): Observable<ConsultaDni> {
    return this.personaEntidadApi.getDni(dni)
  }

  getDni2(dni): Observable<ConsultaDni> {
    return this.personaEntidadApi.getDni2(dni)
  }

  crearPersonaEntidad(crearpersonaentidad: CrearPersonaEntidad, dni: string): Observable<any> {
    return this.personaEntidadApi.crearPersonaEntidad(crearpersonaentidad, dni)
  }

  getProcedimientos(): Observable<Procedimiento[]> {
    return this.procedimientoApi.listar()
  }

  getRepresentanteExpediente(idperso: any, idHisperso: any): Observable<RepresentanteExpLIstar> {
    return this.personaEntidadApi.getRepresentante(idperso, idHisperso)
  }

  // public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  getTemaDocumentoListar(): Observable<TemaDocumentoListar[]> {
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
    return this.http.put<EditExpediente>(urlEditaT, keys, {headers: this.httpHeaders});
  }



  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
