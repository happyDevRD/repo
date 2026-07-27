import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import {
  ArchivoFirmadoEF,
  ArchivoFirmantes,
  CrearGenerarSalida,
  CrearInteresado,
  CrearMensaje,
  CrearNotificacion,
  CrearTablonAnuncio,
  CrearTareaTramiteExp,
  CrearTramiteExp,
  EditarTramiteExp,
  EditExpediente,
  InsertaBolsaCrear,
  LeerNotificacion,
  ListarInteresados,
  ListarTramites,
  ModeloTeuCrear,
  ModeloTeuListar,
  MotivoNotificacionesListar,
  NotificadorListar,
  ReceptorNotifiListar,
  RepresentanteExpLIstar,
  TareaTramiteExpedienteCrear,
  TareaTramiteExpedienteEditar,
  TareaTramiteExpedienteListar,
  TemaDocumentoListar,
  TramiteExpListar,
  VerExpediente,
  VerMetadatos
} from '../expedientes';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'
import { ProcediPermisos, ProcediPermisosListar } from '../../procedimientos/procedimiento';
import { catchError, finalize, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { MUNICIO, PROVIN, TIPO_BAJA } from '../../../core/constants/datos'
import {
  IflowGridColumns,
  IflowGridComponent,
  IflowGridLocalization,
  IflowGridSource,
} from '../../../shared/components/iflow-grid/iflow-grid.component';
import {
  resolveTareaHeaderActions,
  resolveTareaToolbarActions,
  TareaToolbarContext,
} from './tareas/tarea-actions.helper'
import {
  resolveTramiteToolbarActions,
  TramiteToolbarContext,
} from './tramites/tramite-actions.helper'
import { TareaProcedimientoDTO } from '../../../core/models/tarea-procedimiento.dto';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { ReciboCabeceraDto } from '../../../core/models/recibo-cabecera.dto';
import { tap } from 'rxjs/operators';
import { TareaTramiteExpedienteVer } from '../../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';
import { TramiteExpedienteDto } from '../../../core/models/tramite-expediente.dto';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import { JqxGridRowEvent } from '../../../core/helper/jqx-grid-event.model';
import { NotificacionGridRow } from './notificaciones/notificaciones-seleccion.helper';
import { TramiteGridRow } from './tramites/tramites-edicion.helper';
import { TareaTramiteGridRow } from './tareas/tareas-modal.helper';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { UserSessionService } from '../../../core/service/user-session.service';
import { EditaExpedienteRefs } from './services/edita-expediente-refs.service';
import {
  EditaExpedienteNotificacionesCrudHost,
  EditaExpedienteNotificacionesUiFacade,
  EditaExpedienteNotificacionesUiHost,
  EditaExpedienteTeuHost,
  SolicitarCrearNotificacionHost,
  TeuFormRefLike,
} from './notificaciones/edita-expediente-notificaciones-ui.facade';
import { EditaExpedienteNotificacionesTeuFacade } from './notificaciones/edita-expediente-notificaciones-teu.facade';
import { EditaExpedienteNotificacionesCrudFacade } from './notificaciones/edita-expediente-notificaciones-crud.facade';
import {
  downloadTeuXml,
} from './notificaciones/notificaciones-modal.helper';
import { abrirArchivoTarea, abrirInformeFirma } from './tareas/tareas-archivo.helper';
import { onCheckboxTeuChange } from './notificaciones/notificaciones-teu-checkbox.helper';
import { EditaExpedienteArchivoService, ArchivoUploadHost } from './services/edita-expediente-archivo.service';
import { EditaExpedienteTramitesFacade, EditaExpedienteTramitesHost, EditaExpedienteTramitesUiHost } from './tramites/edita-expediente-tramites.facade';
import {
  CrearTareaTramiteHost,
  EditaExpedienteTareasFacade,
  EditaExpedienteTareasHost,
  TareaProcedimientoHost,
  FirmaTareaHost,
  EditaExpedienteNuevaTareaHost,
  EditaExpedientePanelHost,
  EditaExpedienteTareasAccionHost,
  ObjetoTributarioBajaHost,
} from './tareas/edita-expediente-tareas.facade';
import { EditaExpedienteTareasFirmaFacade } from './tareas/edita-expediente-tareas-firma.facade';
import { EditaExpedienteTareasNuevaFacade } from './tareas/edita-expediente-tareas-nueva.facade';
import { EditaExpedienteTareasAccionFacade } from './tareas/edita-expediente-tareas-accion.facade';
import { buildDescargaHistoricoUrl } from './tareas/historico.helper';
import { cerrarModalesNuevaTarea, abrirModalEditarTareaTramite } from './tareas/tareas-modal.helper';
import { tieneArchivoPendienteSubida } from './tareas/tareas-creacion.helper';
import {
  aplicarSeleccionTareaNueva,
  SeleccionTareaNuevaHost,
  TareaTramiteSeleccionRow,
} from './tareas/tareas-seleccion.helper';
import {
  EditaExpedienteOperacionesFacade,
  EditaExpedienteBolsaHost,
  EditaExpedienteSalidaHost,
  EditaExpedienteInteresadosHost,
  EditaExpedienteInsideHost,
  InsideRemisionForm,
} from './operaciones/edita-expediente-operaciones.facade';
import { ListaTareaProcedi, Pais, RespuestasHttp } from './edita-expediente.models';
import { EditaExpedienteWorkspaceFacade, BootstrapModalesHost, EditaExpedienteTramitadoresHost, HistoricoGridRow, TramitadorGridRow } from './services/edita-expediente-workspace.facade';
import {
  EditaExpedienteLifecycleFacade,
  EditaExpedienteInitHost,
  EditaExpedienteCargaHost,
  EditaExpedienteExpedienteHost,
  EditaExpedienteNotificacionesGridHost,
  EditaExpedienteCatalogosHost,
} from './services/edita-expediente-lifecycle.facade';
import { EditaExpedienteWorkspaceRootHost } from './services/edita-expediente-workspace-host';
import { InsideSoapResponse } from '../../../core/models/inside';
import { InsideEnvioRegistro } from '../../../core/models/inside/inside-envio.models';


@Component({
  selector: 'app-edita-expediente',
  templateUrl: './edita-expediente.component.html',
  styleUrls: ['./edita-expediente.component.css'],
  providers: [
    EditaExpedienteRefs,
    EditaExpedienteTramitesFacade,
    EditaExpedienteTareasFirmaFacade,
    EditaExpedienteTareasNuevaFacade,
    EditaExpedienteTareasAccionFacade,
    EditaExpedienteTareasFacade,
    EditaExpedienteArchivoService,
    EditaExpedienteOperacionesFacade,
    EditaExpedienteWorkspaceFacade,
    EditaExpedienteNotificacionesTeuFacade,
    EditaExpedienteNotificacionesCrudFacade,
    EditaExpedienteNotificacionesUiFacade,
    EditaExpedienteLifecycleFacade,
  ],
})
export class EditaExpedienteComponent
  implements
  OnInit,
  OnDestroy,
  ArchivoUploadHost,
  EditaExpedienteTeuHost,
  SolicitarCrearNotificacionHost,
  FirmaTareaHost,
  EditaExpedienteTramitesHost,
  EditaExpedienteTramitadoresHost,
  TareaProcedimientoHost,
  EditaExpedienteTareasAccionHost,
  EditaExpedienteInteresadosHost,
  EditaExpedienteBolsaHost,
  EditaExpedienteSalidaHost,
  EditaExpedienteInsideHost,
  BootstrapModalesHost,
  EditaExpedienteCargaHost,
  SeleccionTareaNuevaHost,
  EditaExpedienteInitHost,
  EditaExpedienteExpedienteHost,
  EditaExpedienteNotificacionesGridHost,
  EditaExpedienteNuevaTareaHost,
  EditaExpedienteNotificacionesUiHost,
  EditaExpedienteTramitesUiHost,
  EditaExpedientePanelHost,
  EditaExpedienteCatalogosHost,
  EditaExpedienteWorkspaceRootHost,
  ObjetoTributarioBajaHost {
  public provin = PROVIN;
  public municio = MUNICIO;
  public TipoBaja = TIPO_BAJA;

  private get fileInput(): ElementRef | undefined {
    return this.refs.fileInput;
  }

  public get gridNotificaciones(): IflowGridComponent | undefined {
    return this.refs.gridNotificaciones;
  }

  get teuFormRef(): TeuFormRefLike | null {
    return this.refs.teuFormRef ?? null;
  }

  public get gridRecibos(): IflowGridComponent | undefined {
    return this.refs.gridRecibos
  }

  constructor(
    public _location: Location,
    public cdr: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private refs: EditaExpedienteRefs,
    public readonly tramitesFacade: EditaExpedienteTramitesFacade,
    public readonly tareasFacade: EditaExpedienteTareasFacade,
    private archivoService: EditaExpedienteArchivoService,
    public readonly operacionesFacade: EditaExpedienteOperacionesFacade,
    public readonly workspaceFacade: EditaExpedienteWorkspaceFacade,
    public readonly notifUiFacade: EditaExpedienteNotificacionesUiFacade,
    public readonly lifecycleFacade: EditaExpedienteLifecycleFacade,
  ) {
    this.initWorkspaceGrids();
  }

  public localizationObject: IflowGridLocalization = jqxGrid_ES;
  public nombreApe = '';
  public descripTarea!: string;
  public veonotificaciones = false;
  /** @deprecated ownership en notifUiFacade; bridge para Hosts/templates */
  get modoVerNotificacion() { return this.notifUiFacade.modoVerNotificacion }
  set modoVerNotificacion(value: boolean) { this.notifUiFacade.modoVerNotificacion = value }
  columnsTramite!: IflowGridColumns;
  sourceTramite!: IflowGridSource;
  columnsTareasTramite!: IflowGridColumns;
  sourceTareasTramite!: IflowGridSource;
  columnsListarNotifi!: IflowGridColumns;
  sourceListarNotifi!: IflowGridSource & { records?: LeerNotificacion[] };
  columnsTramitadores!: IflowGridColumns;
  sourceTramitadores!: IflowGridSource;
  columnsTareasProcedi!: IflowGridColumns;
  sourceTareasProcedi: IflowGridSource = null;
  columnsHistorico!: IflowGridColumns;
  sourceHistorico!: IflowGridSource;

  private initWorkspaceGrids(): void {
    Object.assign(this, this.lifecycleFacade.buildWorkspaceGrids({
      idExpediente: this.idExpediente ?? 0,
      idTarea: this.idTarea ?? 0,
      getFecIniTarea: () => this.FecIniTarea,
      setNombreApe: (nombre) => { this.nombreApe = nombre; },
      getNombreApe: () => this.nombreApe,
      setDescripTarea: (value) => { this.descripTarea = String(value ?? ''); },
    }));
  }

  get user(): string | null {
    return this.session.user;
  }

  get usuContrl(): string | null {
    return this.session.user;
  }

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get idprocedi(): string | null {
    return this.session.idProcedimiento;
  }

  /**
   * Método para abrir modales usando ModalManagerService
   */
  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  /**
   * Método para cerrar modales usando ModalManagerService
   */
  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  /**
   * Método para mantener abierto un modal usando ModalManagerService
   */
  public mantenerModalAbierto(modalId: string): void {
    this.modalManagerService.keepModalOpen(modalId);
  }

  /**
   * Limpieza de formularios: usar `lifecycleFacade.limpiarTodosLosFormularios()`.
   */

  public limpiarErrores(): void {
    this.lifecycleFacade.limpiarErroresValidacion();
  }

  public nuevotramite: boolean = false;
  public verformnuevatarea: boolean = false;
  public nuevotramitador: boolean = false;
  public verlistadotramitadores: boolean = false;
  public verasignatramite: boolean = false;
  public editExpedientes: boolean = false;
  public menuexpediente: boolean = false;
  public verlistadotareas: boolean = true;
  public verNuevaNotifi: boolean = false;
  public verEditartareatramite: boolean = false;
  public verborrarinteresado: boolean = false;
  public verojointeresado: boolean = true;
  public tareatramiteexpedientever: TareaTramiteExpedienteVer = new TareaTramiteExpedienteVer();
  public creartablonanuncio: CrearTablonAnuncio = new CrearTablonAnuncio();

  public temadocumentolistar: TemaDocumentoListar[];
  public tipoObjetoTributario: TipoObjetoTributarioDto[];

  get modeloteulistar() { return this.notifUiFacade.modeloteulistar }
  set modeloteulistar(value: ModeloTeuListar[]) { this.notifUiFacade.modeloteulistar = value }
  get creanotificacion() { return this.notifUiFacade.creanotificacion }
  set creanotificacion(value: CrearNotificacion) { this.notifUiFacade.creanotificacion = value }
  public creargenerarsalida: CrearGenerarSalida = new CrearGenerarSalida();
  public leernotificacion!: LeerNotificacion[];
  public vermetadatos: VerMetadatos = new VerMetadatos();
  public listatareaprocedi!: ListaTareaProcedi[];
  public listartramites!: ListarTramites[];
  public procedipermiso!: ProcediPermisos[];
  public pais!: Pais[];
  get modeloteucrear() { return this.notifUiFacade.modeloteucrear }
  set modeloteucrear(value: ModeloTeuCrear) { this.notifUiFacade.modeloteucrear = value }

  public procedipermisolistar!: ProcediPermisosListar[];
  public tareatramiteexpedientelistar!: TareaTramiteExpedienteListar[];
  public listarinteresados!: ListarInteresados[];
  public listarinteresadosdto!: InteresadoListarDto[];
  get receptornotifilistar() { return this.notifUiFacade.receptornotifilistar }
  set receptornotifilistar(value: ReceptorNotifiListar[]) { this.notifUiFacade.receptornotifilistar = value }
  get motivonotificacioneslistar() { return this.notifUiFacade.motivonotificacioneslistar }
  set motivonotificacioneslistar(value: MotivoNotificacionesListar[]) { this.notifUiFacade.motivonotificacioneslistar = value }
  get notificadorlistar() { return this.notifUiFacade.notificadorlistar }
  set notificadorlistar(value: NotificadorListar[]) { this.notifUiFacade.notificadorlistar = value }

  get textoFormaNotif() { return this.notifUiFacade.textoFormaNotif }
  set textoFormaNotif(value: string) { this.notifUiFacade.textoFormaNotif = value }

  public tareaProcedimientoVer: TareaTramiteExpedienteVer = new TareaTramiteExpedienteVer();

  get notificacionver() { return this.notifUiFacade.notificacionver }
  set notificacionver(value: LeerNotificacion) { this.notifUiFacade.notificacionver = value }
  public editexpediente: EditExpediente = new EditExpediente();
  public creartramiteexp: CrearTramiteExp = new CrearTramiteExp();
  public archivofirmadoef: ArchivoFirmadoEF = new ArchivoFirmadoEF();
  public archivofirmantes!: ArchivoFirmantes[];
  public crearmensaje: CrearMensaje = new CrearMensaje();
  public crearinteresado: CrearInteresado = new CrearInteresado();
  public tareatramiteexpedientecrear: TareaTramiteExpedienteCrear = new TareaTramiteExpedienteCrear();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public creartareatramiteexp: CrearTareaTramiteExp = new CrearTareaTramiteExp();
  public tareatramiteexpedienteeditar: TareaTramiteExpedienteEditar = new TareaTramiteExpedienteEditar();
  public editartramiteexp: EditarTramiteExp = new EditarTramiteExp();
  public insertabolsacrear: InsertaBolsaCrear = new InsertaBolsaCrear();

  public idTramitador!: number;
  public idTramite!: number;
  public idProcedimiento: number
  public numeroTramite!: number;
  public TramiteFase!: string;
  public idTarea!: number;
  public ejerNumExpedi!: string;
  public procediExp!: number;
  public tareaProcedi!: number;
  public numeroArchivo!: number;
  public descargaArchivo!: string;
  public fecha = new Date();
  public idInteresado!: number;
  public respuestahttp: RespuestasHttp = new RespuestasHttp();
  public headers = new HttpResponse;
  public respuesta = new Response;
  public identificadorFicheroSubido!: number | undefined;
  public archivoSubidaEnProgreso: boolean = false;
  get idNotificacion() { return this.notifUiFacade.idNotificacion }
  set idNotificacion(value: number) { this.notifUiFacade.idNotificacion = value }
  public idhisperso!: number;
  public verGenerarSalida: boolean = false;
  public verInsertarBolsa: boolean = false;
  public identificadorGenerarSalida!: string;
  public opcionselect: string = "0";
  public desSituacion!: string;
  public selected = new Date();
  public ejercicio = new Date();
  public year: number = this.fecha.getFullYear();
  public atrasruta!: string;
  public AsignaT: string = "Asignar Tramitador";
  public descargafichero!: string;
  public descargaficheroFirmado!: string;

  public verExpediente: VerExpediente = new VerExpediente();
  public tramiteExpedienteListar!: TramiteExpedienteDto[];

  public percentDone!: number;
  public nomArchiv!: string;
  public uploadSuccess!: boolean;
  public url!: string;
  public archivoSubido!: Event;
  public nombreArchivoSubido!: string;
  public base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  fechaarchivo: Date = new Date();
  public descripcionArchivo!: string;
  public iddocumento!: number;
  public name!: string;
  public id!: number;
  public myimage?: string;
  public base64code!: string;


  public IDModel!: number;
  public TextoLegal!: string;

  public paraTextoLegar() {
    this.notifUiFacade.paraTextoLegar(this);
  }

  public xmlTeu: string | null = null;

  public verxml: boolean = false;

  public quitabotonesNotifi() {
    this.notifUiFacade.quitabotonesNotifi(this);
  }

  public xmlDescargado: string | null = null;
  public descargoTEU: boolean = false;


  public descargaXml() {
    if (!this.xmlDescargado) {
      return
    }
    downloadTeuXml(this.xmlDescargado);
  }

  public verBolsaCrear() {
    this.operacionesFacade.mostrarFormularioBolsa(this);
  }

  public solicitadni(dni: string) {
    this.lifecycleFacade.solicitadni(this, dni);
  }

  public getTemaDocumentoListar() {
    this.lifecycleFacade.getTemaDocumentoListar(this);
  }

  public getTramiteProcedimientoVer(idtareP: number) {
    this.lifecycleFacade.getTramiteProcedimientoVer(this, Number(idtareP));
  }

  public fsistema: string = new Date().toLocaleDateString();
  public fechaSistema!: string;

  public FechaSistema() {
    this.lifecycleFacade.fechaSistema(this);
  }

  public getTipoObjetoTributario(): void {
    this.lifecycleFacade.getTipoObjetoTributario(this);
  }

  ngOnInit() {
    this.modalManagerService.forceCleanupAll()
    this.notifUiFacade.bindCrossHost(this)
    this.lifecycleFacade.cargarDatosIniciales(this);
  }

  ngOnDestroy(): void {
    this.modalManagerService.forceCleanupAll()
  }


  public crearInteresado() {
    this.operacionesFacade.crearInteresado(this);
  }

  public verListadoTareasModal() {
    this.tareasFacade.verListadoTareasModal(this);
  }

  upload(event: Event, id: number) {
    this.archivoService.procesarArchivoDelInput(this, event, id);
  }

  envioArchivo(callback?: () => void) {
    this.archivoService.enviarArchivo(this, callback);
  }


  public vertareas: boolean = true;

  public verNuevaTareaExp() {
    this.tareasFacade.verNuevaTareaExp(this);
  }

  public nuevaTareaExp() {
    this.tareasFacade.nuevaTareaExp(this, this, this as CrearTareaTramiteHost);
  }

  public cerrarModalNuevaTareaSeguro() {
    this.tareasFacade.cerrarModalNuevaTareaSeguro(this, this.refs.fileInput);
  }

  public abrirModalNuevaTarea() {
    this.tareasFacade.abrirModalNuevaTarea(this, this.refs.fileInput);
  }

  private limpiarEstadoModalNuevaTarea() {
    this.tareasFacade.limpiarEstadoModal(this, this.refs.fileInput);
  }

  onTareaCreada(): void {
    this.tareasFacade.onTareaCreada(this, this.refs.fileInput);
  }

  public getListarTramites(idexp: number) {
    this.sourceTramite = this.tramitesFacade.configurarGridTramites(idexp, (tramites) => {
      this.listartramites = tramites;
    });
  }

  public getTareaTramiteExpedienteListar() {
    this.refrescoSourceTareasTramite(this.idTramite)
  }


  public getUsuarioListar(id: number) {
    this.lifecycleFacade.getUsuarioListar(this, id);
  }


  public seleccionaInteresado(idInteresado: number) {
    this.operacionesFacade.seleccionarInteresado(this, idInteresado);
  }

  public borrarTramite() {
    this.tramitesFacade.borrarTramite(this);
  }

  public getListaTareas(): Observable<ListaTareaProcedi[]> {
    return this.tareasFacade.getListaTareas(this.idprocedi, this.fasetramite);
  }

  public borrarTareaTramiteExp() {
    this.tareasFacade.borrarTarea(this);
  }

  public borrarTramitador() {
    this.workspaceFacade.borrarTramitador(this);
  }


  public borrarInteresados() {
    this.operacionesFacade.borrarInteresado(this);
  }

  public getListarInteresado(idexp: number) {
    this.operacionesFacade.listarInteresados(this, idexp);
  }

  async cargarExpediente() {
    this.lifecycleFacade.cargarDesdeRuta(this, this.activatedRoute);
  }

  public inicializarSourceListarNotifi() {
    this.lifecycleFacade.inicializarSourceListarNotifi(this);
  }

  public actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]) {
    this.lifecycleFacade.actualizarGridNotificaciones(this, leerNotificacion);
  }

  public recargarSourceTramitadores() {
    this.workspaceFacade.refrescarGrid(this);
  }

  public clickTramitadores(event: JqxGridRowEvent<TramitadorGridRow>) {
    this.workspaceFacade.clickTramitadores(this, event);
  }

  public fechaTramite!: string;
  public disabledArchivoTareaTramite: boolean = false;
  public plantillaDefecto!: string | null;

  public clickTareProcedimiento(event: JqxGridRowEvent<{ plantillaDefecto: unknown }>) {
    this.tareasFacade.clickTareaProcedimiento(this, event);
  }

  public idlistatareaProcedi!: number | string | null;

  public tareatramiteprocedimiento: TareaProcedimientoDTO;

  public idExpediente!: number;

  public modalAnteriorId: string | null = null;
  public mostrarModalOperacion = false;

  resetActionState(): void {
    this.tareasFacade.resetActionState(this);
  }

  public borraDatosNuevaTarea() {
    this.tareasFacade.borraDatosNuevaTarea(this);
  }

  isDNIAction(): boolean {
    return this.tareasFacade.isDNIAction(this.tareatramiteprocedimiento?.accion);
  }

  consultaAccion(valor: string, idtipobje: TipoObjetoTributarioDto): void {
    this.tareasFacade.consultaAccion(this, valor, idtipobje);
  }

  public idListaTareaProcedimiento(selectedValue: number | string): void {
    this.tareasFacade.seleccionarTareaProcedimiento(this, selectedValue);
  }

  public cerrarModalBajaObjetoTributario(): void {
    this.modalManagerService.closeModal('bajaObjetoTributarioModal');
  }


  public abrirModalLiquidacion(): void {
    this.workspaceFacade.abrirModalLiquidacion(this);
  }

  public cerrarModalLiquidacion(): void {
    this.workspaceFacade.cerrarModalLiquidacion(this);
  }

  public abrirModalOperacion(): void {
    this.workspaceFacade.abrirModalOperacion(this);
  }

  loadRecibos(): Observable<ReciboCabeceraDto[]> {
    return this.tareasFacade.loadRecibos(this);
  }


  public verTareasdelTramite: boolean = false
  public descriptramite!: string;
  public fechatramite!: string;
  public fasetramite!: string;
  public botonNuevaTareaTramite: boolean = false;
  public veoeditofasetramite: boolean = true;


  public borrarDatosTramite() {
    this.editartramiteexp = new EditarTramiteExp();
    this.FechaSistema();
  }

  public clickTramiteNuevo(event: JqxGridRowEvent<TramiteGridRow>) {
    this.workspaceFacade.clickTramiteNuevo(this, event);
  }

  public verAccionesdeTarea: boolean = false;
  public veopropuestaresolu: boolean = true;
  public FecIniTarea!: string;
  public FecFinTarea!: string | null;
  public numeroArchiTarea!: number | null;

  public anexoTarea!: string | number | null;
  public docAportadaTarea!: string | number | null;
  public docEniTarea!: string | number | null;
  public DocumentacionTarea!: string | number | null;
  public documentacion: string[] = [
    "Documentación Adjunta Digitalizada",
    "Documentación Adjunta en Soporte Papel",
    "Documentación Adjunta Digitalizada y en Papel"

  ];

  public fechametadatabuena!: string;

  public fechaMetadata(fecha: Date) {
    this.lifecycleFacade.formatearFechaMetadata(this, fecha);
  }

  public tipodefirma: boolean = true;
  public firmaAtendida: boolean = false;
  public firmaDesatendida: boolean = false;

  async gettipofirma() {
    this.tareasFacade.cargarTipoFirma(this);
  }

  public tareaprocedimientoid!: number;
  public nunRegisTarea!: string | number | null;
  public verAbreArchivo: boolean = false;
  public insideEnviando = false;
  public insideDryRun = environment.inside?.dryRun === true;
  public insideUltimaRespuesta: InsideSoapResponse | null = null;
  public insideUltimoEnvio: InsideEnvioRegistro | null = null;
  public insideRemision: InsideRemisionForm = {
    idexpEni: '',
    dir3Juzgado: '',
    dir3Remitente: '',
    nig: '',
    claseProcedimiento: '',
    anyoProcedimiento: '',
    numeroProcedimiento: '',
    descripcion: '',
    codigoEnvioATEA: '',
  };
  public nombreArchivoTarea!: string;
  public veoMetadatos: boolean = false;
  public errorArchivoFirmantes: string;
  public tareayafirmada: boolean = true;
  public puedoEditarTarea: boolean = true;
  public numeroTareaTramite: number | string;
  public descripTareaTramite: string;
  public veoBorrar: boolean = true;
  public veoGenerarSalida: boolean = true;
  public veoNotificacion: boolean = true;
  public veoPropuestaResolucion: boolean = true;
  public veoFinalizar: boolean = true;
  public veoXml: boolean = true;
  public veoFirmaAtendida: boolean = false;
  public veoFirmaDEsatendida: boolean = false;
  public veoDocOriginal: boolean = true;

  get tareaHeaderActions() {
    return resolveTareaHeaderActions(this.tareaToolbarContext())
  }

  get tareaToolbarActions() {
    return resolveTareaToolbarActions(this.tareaToolbarContext())
  }

  get tramiteToolbarActions() {
    return resolveTramiteToolbarActions(this.tramiteToolbarContext())
  }

  private tramiteToolbarContext(): TramiteToolbarContext {
    return {
      botonVerNotifi: this.botonVerNotifi,
      vertramite: this.vertramite,
      verasignatramite: this.verasignatramite,
    }
  }

  private tareaToolbarContext(): TareaToolbarContext {
    return {
      botonNuevaTareaTramite: this.botonNuevaTareaTramite,
      verAccionesdeTarea: this.verAccionesdeTarea,
      veoBorrar: this.veoBorrar,
      borrarconfirma: this.borrarconfirma,
      verAbreArchivo: this.verAbreArchivo,
      verxml: this.verxml,
      veoXml: this.veoXml,
      veoconviertePDF: this.veoconviertePDF,
      spinnervisible: this.spinnervisible,
      veoMetadatos: this.veoMetadatos,
      insideEnviando: this.insideEnviando,
      tareayafirmada: this.tareayafirmada,
      firmaDesatendida: this.firmaDesatendida,
      firmaAtendida: this.firmaAtendida,
      veoFirmaAtendida: this.veoFirmaAtendida,
      veoFirmaDEsatendida: this.veoFirmaDEsatendida,
      veoDocOriginal: this.veoDocOriginal,
      spinnervisiblefirma: this.spinnervisiblefirma,
      veoPropuestaResolucion: this.veoPropuestaResolucion,
      veoNotificacion: this.veoNotificacion,
      veoGenerarSalida: this.veoGenerarSalida,
      veoFinalizar: this.veoFinalizar,
    }
  }

  public actualizoSourceTareaTramite() {
    this.sourceTareasTramite = this.tareasFacade.createGridAdapter(this.idTramite);
  }

  public spinnervisible: boolean = true;

  public conviertePDF() {
    this.tareasFacade.conviertePDF(this);
  }

  public borrarconfirma: boolean = true;
  public veoconviertePDF: boolean = true;

  public onTareaTramiteDoubleClick(event: JqxGridRowEvent<TareaTramiteGridRow>): void {
    this.workspaceFacade.onTareaTramiteDoubleClick(this, event);
  }

  public clicktareaNueva(event: JqxGridRowEvent<TareaTramiteSeleccionRow>) {
    this.workspaceFacade.clicktareaNueva(this, event, this.seleccionTareaCallbacks());
  }

  public clicktarea(id: number, codArchivo: number | string | null, tareaProcedi: number) {
    this.workspaceFacade.clicktarea(this, id, codArchivo, tareaProcedi);
  }

  async descargaArchivoFirmadoEFDesatendido() {
    this.tareasFacade.enviarFirmaDesatendida(this);
  }

  async descargaArchivoFirmado() {
    this.tareasFacade.descargarArchivoFirmado(this);
  }

  public resetvariables() {
    this.notifUiFacade.resetvariables(this);
  }

  public clickNuevaNotificacion() {
    this.notifUiFacade.clickNuevaNotificacion(this);
  }

  public cambioYearEjercicio() {
    this.notifUiFacade.cambioYearEjercicio(this);
  }

  public clicknotificacionNuevo(event: JqxGridRowEvent<NotificacionGridRow>) {
    this.workspaceFacade.clicknotificacionNuevo(this, event);
  }

  public onNotificacionClick(event: JqxGridRowEvent<NotificacionGridRow>) {
    this.workspaceFacade.onNotificacionClick(this, event);
  }

  public onNotificacionDoubleClick(event: JqxGridRowEvent<Pick<NotificacionGridRow, 'idNotif'>>) {
    this.workspaceFacade.onNotificacionDoubleClick(this, event);
  }

  habilitarBotonesNotificacion(rowData: NotificacionGridRow) {
    this.workspaceFacade.habilitarBotonesNotificacion(this, rowData);
  }

  public onTramiteDoubleClick(event: JqxGridRowEvent<TramiteGridRow>) {
    this.workspaceFacade.onTramiteDoubleClick(this, event);
  }

  public onTramitadorDoubleClick(event: JqxGridRowEvent<TramitadorGridRow>) {
    this.workspaceFacade.onTramitadorDoubleClick(this, event);
  }

  public onTareaDoubleClick(event: JqxGridRowEvent<TareaTramiteSeleccionRow>) {
    this.workspaceFacade.onTareaDoubleClick(this, event);
  }

  public fechasNotifi(
    fenvio: string | Date | null | undefined,
    frecep: string | Date | null | undefined,
    fpubli: string | Date | null | undefined,
    femision: string | Date | null | undefined,
  ) {
    this.notifUiFacade.aplicarFechasNotificacion(this.notifUiFacade, fenvio, frecep, fpubli, femision);
  }

  public vertramite: boolean = true;
  public botonVerNotifi: boolean = true;

  public enviandoTramite: boolean = false;
  public veoTramitadores: boolean = false;

  public cancelarnuevotramite() {
    this.tramitesFacade.cancelarnuevotramite(this);
  }

  public limpiarFormularioTramite() {
    this.tramitesFacade.limpiarFormularioTramite(this);
  }

  public veotramitadores() {
    this.tramitesFacade.veotramitadores(this);
    this.sincronizarVistaEnUrl('tramitadores');
  }

  public verNotificaciones() {
    this.tramitesFacade.verNotificaciones(this, (ejercicio, numero) =>
      this.notifUiFacade.createGridAdapter(ejercicio, numero),
    );
    this.sincronizarVistaEnUrl('notificaciones');
  }

  public leoMetadatos(codfiche: number) {
    this.lifecycleFacade.leoMetadatos(this, codfiche);
  }

  public noverNotificaciones() {
    this.tramitesFacade.noverNotificaciones(this);
    this.sincronizarVistaEnUrl(null);
  }

  /** Refleja la vista activa (Notificaciones/Tramitadores) en el query param `vista`,
   *  para que recargar la página o compartir el enlace mantenga la vista abierta. */
  private sincronizarVistaEnUrl(vista: 'notificaciones' | 'tramitadores' | null): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { vista },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  // ----------------------------------
  //  Seccion de Notificaciones :
  //------------------------------------

  /*** consultas para  formulario de creacion de notificaciones de expedientes*/
  public listadodeNotificaciones() {
    this.notifUiFacade.loadCatalogos();
  }


  private seleccionTareaCallbacks = () => ({
    cargaHistorico: (id: number) => this.cargaHistorico(id),
    getTramiteProcedimientoVer: (id: number) => this.getTramiteProcedimientoVer(id),
    getListaTareas: () => this.getListaTareas(),
    leoMetadatos: (archivo: number) => this.leoMetadatos(archivo),
    gettipofirma: () => this.gettipofirma(),
    getTemaDocumentoListar: () => this.getTemaDocumentoListar(),
    getUsuarioListar: (id: number) => this.getUsuarioListar(id),
  });

  public crearModeloTeuFichero() {
    this.notifUiFacade.crearModeloTeuFichero(this);
  }

  public actualizarSourceNotificaciones(): void {
    this.lifecycleFacade.actualizarSourceNotificaciones(this);
  }

  public cerrarModalTEU(): void {
    this.notifUiFacade.cerrarModal(this);
  }

  public descargarFicheroTEU(): void {
    this.notifUiFacade.descargarFichero(this);
  }

  public onCheckboxChange(checkboxName: string, value: boolean): void {
    onCheckboxTeuChange(checkboxName, value);
  }

  public inicializarFormularioTEU(): void {
    this.modeloteucrear = this.notifUiFacade.inicializarFormulario();
    this.notifUiFacade.mostrarValidacionesTEU = false;
  }

  public isFechaSolicInvalid(): boolean {
    return this.notifUiFacade.isFechaSolicInvalid(this);
  }

  public isFechaGenerInvalid(): boolean {
    return this.notifUiFacade.isFechaGenerInvalid(this);
  }

  public isFechaFirmaInvalid(): boolean {
    return this.notifUiFacade.isFechaFirmaInvalid(this);
  }

  public getnotificacionListar() {
    this.notifUiFacade.listarNotificacionesDelExpediente(this);
  }

  public borrarNotificacion(id: number) {
    this.notifUiFacade.borrarNotificacion(this, id);
  }

  public publicarNotifi() {
    this.notifUiFacade.publicarNotifi(this);
  }

  public editaNotifi() {
    this.notifUiFacade.editaNotifi(this);
  }

  public cerrarModalNotificacion() {
    this.notifUiFacade.cerrarModalNotificacion(this);
  }

  public abrirModalEnvioTeu(): void {
    this.notifUiFacade.abrirModalEnvioTeu(this);
  }

  public abrirModalEnviarNotificacion() {
    this.notifUiFacade.abrirModalEnviarNotificacion(this);
  }

  public enviarANotificaPlataforma(): void {
    this.notifUiFacade.enviarANotificaPlataforma(this);
  }

  public sincronizarConNotificaPlataforma(): void {
    this.notifUiFacade.sincronizarConNotificaPlataforma(this);
  }

  public async enviarNotificacion() {
    await this.notifUiFacade.enviarNotificacion(this);
  }

  public recepcionarNotificacion() {
    this.notifUiFacade.recepcionarNotificacion(this);
  }

  public devolverNotificacion() {
    this.notifUiFacade.devolverNotificacion(this);
  }

  public anularNotificacion() {
    this.notifUiFacade.anularNotificacion(this);
  }

  public borraDatosCrearNotifi() {
    this.notifUiFacade.borraDatosCrearNotifi(this);
  }

  async vernotifi(id: number, modoVer = false): Promise<void> {
    return this.notifUiFacade.vernotifi(this, id, modoVer);
  }

  public verNotificacion(id: number) {
    this.notifUiFacade.verNotificacion(this, id);
  }

  public editarNotificacion(id: number) {
    this.notifUiFacade.editarNotificacion(this, id);
  }

  public fecLimite!: Date;

  public fechamas15() {
    this.notifUiFacade.fechamas15(this);
  }

  public borrarDatosPublicacion() {
    this.notifUiFacade.borrarDatosPublicacion(this);
  }

  public borraDatosenviarNotifi() {
    this.notifUiFacade.borraDatosEnviarNotifi(this);
  }

  public borraDatosRecepcion() {
    this.notifUiFacade.borraDatosRecepcion(this);
  }


  public CierraPopup() {
    this.cerrarModal('CrearNotificacionModal');
  }

  public get formularioNotificacionValido(): boolean {
    return this.notifUiFacade.getFormularioValido(this);
  }

  public validarFormularioNotificacion(): boolean {
    return this.notifUiFacade.validarFormulario(this);
  }

  public limpiarCacheValidacion(): void {
    this.notifUiFacade.limpiarCacheValidacion();
  }

  public inicializarFechaNotificacion() {
    this.notifUiFacade.inicializarFechaNotificacion(this);
  }



  public cargarDatosInteresado(dni: string) {
    this.notifUiFacade.cargarDatosInteresado(this, dni);
  }

  public crearnotificacion() {
    this.notifUiFacade.solicitarCreacionNotificacion(this);
  }

  public limpiarFormularioNotificacion() {
    this.notifUiFacade.limpiarFormularioNotificacion(this);
  }

  public cerrarModalCrearNotificacion() {
    this.notifUiFacade.cerrarModalCrearNotificacion(this);
  }

  public onModalHidden() {
    this.notifUiFacade.onModalHidden();
  }

  public limpiarEstadoModalError() {
    this.notifUiFacade.limpiarEstadoModalError(this);
  }

  public spinnervisiblefirma: boolean = true;

  public abreArchivo() {
    abrirArchivoTarea(this, this.notificationService);
  }

  public descargaArchiFirmado!: string;

  async abreArchiFirmado() {
    this.descargaArchiFirmado = abrirInformeFirma(this, this.notificationService);
  }

  editExpediente() {
    this.lifecycleFacade.editExpediente(this);
  }

  public finalizartarea() {
    this.tareasFacade.finalizarTarea(this);
  }

  public prueba: string = " prueba";

  onTareaEditada(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public faseEditTra: string;

  public habilitaTramiteExp() {
    this.tramitesFacade.habilitaTramiteExp(this);
  }

  recargarpagina() {
    window.location.reload();

  }

  public refrescoSourceTramite() {
    this.tramitesFacade.refrescarGrid(this);
  }

  public refrescoSourceTareasTramite(id: number) {
    this.tareasFacade.refrescarGrid(this, Number(id));
  }

  public refresSourceListarNotifi() {
    this.lifecycleFacade.refreshListarNotifi(this, false);
  }

  public refresSourceListarNotifiPRE() {
    this.lifecycleFacade.refreshListarNotifi(this, true);
  }

  public vacio() {
  }

  public descargaficheroHistorico(event: JqxGridRowEvent<HistoricoGridRow>) {
    const nArchivo = event.args.row.bounddata.archivo;
    this.descargafichero = buildDescargaHistoricoUrl(nArchivo, this.usuContrl);
    this.abreArchivo();
  }

  public marcaHistorico(_event: JqxGridRowEvent) { }

  public cargaHistorico(idTarea: number | string) {
    this.tareasFacade.refrescarHistorico(this, idTarea);
  }

  public showGenerarEntrada: boolean = false;

  clickGenerarEntrada(): void {
    this.workspaceFacade.clickGenerarEntrada(this);
  }

  closeGenerarEntradaModal(): void {
    this.workspaceFacade.closeGenerarEntradaModal(this);
  }

  showObjetoTributarioModal(): void {
    this.workspaceFacade.abrirModalObjetoTributario();
  }

  /** Delegado Host para grids/helpers; la lógica vive en lifecycleFacade. */
  public formatearFechaParaInput(fecha: unknown): string {
    return this.lifecycleFacade.formatearFechaParaInput(fecha)
  }

  public volverListadoExpedientes(): void {
    this.lifecycleFacade.volverListadoExpedientes(this);
  }

  public abrirModalRemisionJusticia(): void {
    this.operacionesFacade.abrirModalRemisionJusticia(this);
  }

  public handleEnviarExpedienteInside(): void {
    this.operacionesFacade.handleEnviarExpedienteCompleto(this);
  }

  public handleEnviarDocumentosInside(): void {
    this.operacionesFacade.handleEnviarDocumentosExpediente(this);
  }

  public handleValidarExpedienteInside(): void {
    this.operacionesFacade.handleValidarExpediente(this);
  }

  public handleAltaExpedienteEniXmlInside(): void {
    this.operacionesFacade.handleAltaExpedienteEniXml(this);
  }

  public cargarEstadoInside(idExpediente: number): void {
    this.operacionesFacade.cargarEstadoEnvio(idExpediente, this);
  }

  public handleVerHistorialEnviosInside(): void {
    this.operacionesFacade.handleVerHistorialEnvios(this);
  }
}
