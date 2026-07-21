import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import {
  ArchivoFirmadoEF,
  ArchivoFirmantes,
  ConsultaDni,
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
import { ExpedientesService } from '../expedientes.service';
import { FormBuilder } from '@angular/forms';
import { ProcediPermisos, ProcediPermisosListar } from '../../procedimientos/procedimiento';
import { ProcedimientoService } from '../../procedimientos/procedimiento.service';
import { catchError, finalize, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { MUNICIO, PROVIN, TIPO_BAJA } from '../../core/constants/datos';
import { TareaProcedimientoDTO } from '../../core/models/tarea-procedimiento.dto';
import { TipoObjetoTributarioDto } from '../../core/models/tipo-objeto-tributario.dto';
import { EnvioNotificaInfo } from '../notificaciones/notificaciones-notifica-panel.component';
import { NotificacionesService } from '../services/notificaciones.service';
import { ReciboCabeceraDto } from '../../core/models/recibo-cabecera.dto';
import { tap } from 'rxjs/operators';
import { TareaTramiteExpedienteVer } from '../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';
import { ObjetoTributarioDto } from '../../core/models/objeto-tributario.dto';
import { TramitesService } from '../tramites.service';
import { TramiteExpedienteDto } from '../../core/models/tramite-expediente.dto';
import { InteresadoListarDto } from '../../core/models/interesado.dto';
import { TablaClickHandler } from '../../core/helper/tabla-click-handler';
import { GridRadioSelector } from '../../core/helper/grid-radio-selector';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { UserSessionService } from '../../core/service/user-session.service';
import { EditaExpedienteRefs } from './services/edita-expediente-refs.service';
import { EditaExpedienteNotificacionesFacade } from './notificaciones/edita-expediente-notificaciones.facade';
import { EditaExpedienteNotificacionesCrudFacade, EditaExpedienteNotificacionesCrudHost, SolicitarCrearNotificacionHost } from './notificaciones/edita-expediente-notificaciones-crud.facade';
import { EditaExpedienteTeuFacade, EditaExpedienteTeuHost } from './notificaciones/edita-expediente-teu.facade';
import {
  downloadTeuXml,
} from './notificaciones/notificaciones-modal.helper';
import { abrirArchivoTarea, abrirInformeFirma } from './tareas/tareas-archivo.helper';
import { onCheckboxTeuChange } from './notificaciones/notificaciones-teu-checkbox.helper';
import {
  limpiarErroresNuevaTareaForm,
  validarCampoFormularioTarea,
  validarFormularioNuevaTarea,
  validarTareaProcedimientoCampo,
} from './tareas/tareas-form-validation.helper';
import { EditaExpedienteArchivoService, ArchivoUploadHost } from './services/edita-expediente-archivo.service';
import { EditaExpedienteTramitesFacade, EditaExpedienteTramitesHost } from './tramites/edita-expediente-tramites.facade';
import {
  CrearTareaTramiteHost,
  EditaExpedienteTareasFacade,
  EditaExpedienteTareasHost,
  TareaProcedimientoHost,
} from './tareas/edita-expediente-tareas.facade';
import { buildDescargaHistoricoUrl } from './tareas/historico.helper';
import { cerrarModalesNuevaTarea, abrirModalEditarTareaTramite } from './tareas/tareas-modal.helper';
import { tieneArchivoPendienteSubida } from './tareas/tareas-creacion.helper';
import {
  aplicarSeleccionTareaNueva,
  SeleccionTareaNuevaHost,
} from './tareas/tareas-seleccion.helper';
import { EditaExpedienteInteresadosFacade, EditaExpedienteInteresadosHost } from './interesados/edita-expediente-interesados.facade';
import { EditaExpedienteBolsaFacade, EditaExpedienteBolsaHost } from './operaciones/edita-expediente-bolsa.facade';
import { EditaExpedienteSalidaFacade, EditaExpedienteSalidaHost } from './operaciones/edita-expediente-salida.facade';
import { EditaExpedienteTramitadoresFacade, EditaExpedienteTramitadoresHost } from './tramitadores/edita-expediente-tramitadores.facade';
import {
  EditaExpedienteObjetoTributarioFacade,
  ObjetoTributarioBajaHost,
} from './tareas/edita-expediente-objeto-tributario.facade';
import { EditaExpedienteTareasConsultaFacade } from './tareas/edita-expediente-tareas-consulta.facade';
import {
  EditaExpedienteTareasAccionFacade,
  EditaExpedienteTareasAccionHost,
} from './tareas/edita-expediente-tareas-accion.facade';
import { Habitantes, PersonaEntidad, Vehiculo } from './tareas/tareas-accion.models';
import {
  BootstrapModalesHost,
  EditaExpedienteBootstrapModalesFacade,
} from './shared/edita-expediente-bootstrap-modales.facade';
import { COLUMNS_RECIBOS } from './tareas/recibos-grid.config';
import { ListaTareaProcedi, Pais, RespuestasHttp } from './edita-expediente.models';
import { EditaExpedienteCargaFacade, EditaExpedienteCargaHost } from './services/edita-expediente-carga.facade';
import { EditaExpedienteInitFacade, EditaExpedienteInitHost } from './services/edita-expediente-init.facade';
import { EditaExpedienteFirmaFacade, FirmaTareaHost } from './tareas/edita-expediente-firma.facade';
import { EditaExpedienteGridFacade, EditaExpedienteNotificacionesGridHost } from './services/edita-expediente-grid.facade';
import { EditaExpedienteExpedienteFacade, EditaExpedienteExpedienteHost } from './services/edita-expediente-expediente.facade';
import { EditaExpedienteUiFacade } from './services/edita-expediente-ui.facade';
import { EditaExpedienteWorkspaceFacade } from './services/edita-expediente-workspace.facade';
import { EditaExpedienteNuevaTareaFacade, EditaExpedienteNuevaTareaHost } from './services/edita-expediente-nueva-tarea.facade';
import {
  EditaExpedienteNotificacionesFormFacade,
  EditaExpedienteNotificacionesFormHost,
} from './notificaciones/edita-expediente-notificaciones-form.facade';
import { EditaExpedienteNotificacionesUiFacade, EditaExpedienteNotificacionesUiHost } from './notificaciones/edita-expediente-notificaciones-ui.facade';
import { EditaExpedienteTramitesUiFacade, EditaExpedienteTramitesUiHost } from './tramites/edita-expediente-tramites-ui.facade';
import { EditaExpedienteCatalogosFacade, EditaExpedienteCatalogosHost } from './services/edita-expediente-catalogos.facade';
import { EditaExpedientePanelFacade, EditaExpedientePanelHost } from './services/edita-expediente-panel.facade';
import { EditaExpedienteWorkspaceRootHost } from './services/edita-expediente-workspace-host';
import {
  EditaExpedienteInsideFacade,
  EditaExpedienteInsideHost,
  InsideRemisionForm,
} from './inside/edita-expediente-inside.facade';
import { InsideSoapResponse } from '../../core/models/inside';
import { InsideEnvioRegistro } from '../../core/models/inside/inside-envio.models';
@Component({
  selector: 'app-edita-expediente',
  templateUrl: './edita-expediente.component.html',
  styleUrls: ['./edita-expediente.component.css'],
  providers: [
    EditaExpedienteRefs,
    EditaExpedienteNotificacionesFacade,
    EditaExpedienteTeuFacade,
    EditaExpedienteNotificacionesCrudFacade,
    EditaExpedienteTramitesFacade,
    EditaExpedienteTareasFacade,
    EditaExpedienteArchivoService,
    EditaExpedienteTramitadoresFacade,
    EditaExpedienteTareasConsultaFacade,
    EditaExpedienteTareasAccionFacade,
    EditaExpedienteInteresadosFacade,
    EditaExpedienteBolsaFacade,
    EditaExpedienteSalidaFacade,
    EditaExpedienteObjetoTributarioFacade,
    EditaExpedienteBootstrapModalesFacade,
    EditaExpedienteCargaFacade,
    EditaExpedienteFirmaFacade,
    EditaExpedienteInitFacade,
    EditaExpedienteGridFacade,
    EditaExpedienteExpedienteFacade,
    EditaExpedienteUiFacade,
    EditaExpedienteWorkspaceFacade,
    EditaExpedienteNuevaTareaFacade,
    EditaExpedienteNotificacionesFormFacade,
    EditaExpedienteNotificacionesUiFacade,
    EditaExpedienteTramitesUiFacade,
    EditaExpedienteCatalogosFacade,
    EditaExpedientePanelFacade,
    EditaExpedienteInsideFacade,
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
    EditaExpedienteNotificacionesFormHost,
    EditaExpedienteNotificacionesUiHost,
    EditaExpedienteTramitesUiHost,
    EditaExpedientePanelHost,
    EditaExpedienteCatalogosHost,
    EditaExpedienteWorkspaceRootHost,
    ObjetoTributarioBajaHost
{

  public provin = PROVIN;
  public municio = MUNICIO;
  public TipoBaja = TIPO_BAJA;
  public municifiltro: any[] = [];

  private get fileInput(): ElementRef | undefined {
    return this.refs.fileInput;
  }

  public get gridNotificaciones(): any {
    return this.refs.gridNotificaciones;
  }

  get teuFormRef(): any {
    return this.refs.teuFormRef;
  }

  public get gridRecibos(): ElementRef | undefined {
    return this.refs.gridRecibos;
  }

  constructor(
    public _location: Location,
    private _formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    public router: Router,
    public expedientesService: ExpedientesService,
    public procedimientoService: ProcedimientoService,
    public activatedRoute: ActivatedRoute,
    private notificacionesService: NotificacionesService,
    private tramitesService: TramitesService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private refs: EditaExpedienteRefs,
    private notificacionesFacade: EditaExpedienteNotificacionesFacade,
    private teuFacade: EditaExpedienteTeuFacade,
    private notificacionesCrudFacade: EditaExpedienteNotificacionesCrudFacade,
    private tramitesFacade: EditaExpedienteTramitesFacade,
    private tareasFacade: EditaExpedienteTareasFacade,
    private archivoService: EditaExpedienteArchivoService,
    private tramitadoresFacade: EditaExpedienteTramitadoresFacade,
    private tareasAccionFacade: EditaExpedienteTareasAccionFacade,
    private interesadosFacade: EditaExpedienteInteresadosFacade,
    private bolsaFacade: EditaExpedienteBolsaFacade,
    private salidaFacade: EditaExpedienteSalidaFacade,
    private objetoTributarioFacade: EditaExpedienteObjetoTributarioFacade,
    private bootstrapModalesFacade: EditaExpedienteBootstrapModalesFacade,
    private cargaFacade: EditaExpedienteCargaFacade,
    private firmaFacade: EditaExpedienteFirmaFacade,
    private initFacade: EditaExpedienteInitFacade,
    private workspaceGridFacade: EditaExpedienteGridFacade,
    private expedienteFacade: EditaExpedienteExpedienteFacade,
    private uiFacade: EditaExpedienteUiFacade,
    private workspaceFacade: EditaExpedienteWorkspaceFacade,
    private nuevaTareaFacade: EditaExpedienteNuevaTareaFacade,
    private notifFormFacade: EditaExpedienteNotificacionesFormFacade,
    private notifUiFacade: EditaExpedienteNotificacionesUiFacade,
    private tramitesUiFacade: EditaExpedienteTramitesUiFacade,
    public readonly catalogosFacade: EditaExpedienteCatalogosFacade,
    private panelFacade: EditaExpedientePanelFacade,
    private insideFacade: EditaExpedienteInsideFacade,
  ) {
    this.initWorkspaceGrids();
  }

  // Estado de la consulta de DNI (wizard interesado/representante), delegado a
  // EditaExpedienteCatalogosFacade. Se mantiene como getter/setter para que las
  // interfaces Host y las plantillas existentes sigan funcionando sin cambios.
  public get consultadni(): ConsultaDni {
    return this.catalogosFacade.consultadni;
  }
  public set consultadni(value: ConsultaDni) {
    this.catalogosFacade.consultadni = value;
  }

  public get dniok(): boolean {
    return this.catalogosFacade.dniok;
  }
  public set dniok(value: boolean) {
    this.catalogosFacade.dniok = value;
  }

  public get formanotificacion(): boolean {
    return this.catalogosFacade.formanotificacion;
  }
  public set formanotificacion(value: boolean) {
    this.catalogosFacade.formanotificacion = value;
  }

  public localizationObject: any = jqxGrid_ES;
  public nombreApe = '';
  public descripTarea!: string;
  public veonotificaciones = false;
  public modoVerNotificacion = false;
  columnsTramite!: any[];
  sourceTramite!: any;
  columnsTareasTramite!: any[];
  sourceTareasTramite!: any;
  columnsListarNotifi!: any[];
  sourceListarNotifi!: any;
  columnsTramitadores!: any[];
  sourceTramitadores!: any;
  columnsTareasProcedi!: any[];
  sourceTareasProcedi: any = null;
  columnsHistorico!: any[];
  sourceHistorico!: any;

  private initWorkspaceGrids(): void {
    Object.assign(this, this.workspaceGridFacade.buildWorkspaceGrids({
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
   * Método para limpiar todos los formularios de modales
   */
  private limpiarTodosLosFormularios(): void {
    this.uiFacade.limpiarTodosLosFormularios();
  }

  public limpiarErrores(): void {
    this.uiFacade.limpiarErroresValidacion();
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
  public tareatramiteexpedientever: any = new TareaTramiteExpedienteVer();
  public creartablonanuncio: CrearTablonAnuncio = new CrearTablonAnuncio();

  public temadocumentolistar: TemaDocumentoListar[];
  public tipoObjetoTributario: TipoObjetoTributarioDto[];

  public modeloteulistar: ModeloTeuListar[];
  public creanotificacion: CrearNotificacion = new CrearNotificacion();
  public creargenerarsalida: CrearGenerarSalida = new CrearGenerarSalida();
  public leernotificacion!: LeerNotificacion[];
  public vermetadatos: VerMetadatos = new VerMetadatos();
  public listatareaprocedi!: ListaTareaProcedi[];
  public listartramites!: ListarTramites[];
  public procedipermiso!: ProcediPermisos[];
  public pais!: Pais[];
  public modeloteucrear: ModeloTeuCrear = new ModeloTeuCrear()

  public procedipermisolistar!: ProcediPermisosListar[];
  public tareatramiteexpedientelistar!: TareaTramiteExpedienteListar[];
  public listarinteresados!: ListarInteresados[];
  public listarinteresadosdto!: InteresadoListarDto[];
  public receptornotifilistar!: ReceptorNotifiListar[];
  public motivonotificacioneslistar!: MotivoNotificacionesListar[];
  public notificadorlistar!: NotificadorListar[];


  public textoFormaNotif!: string;

  public tareaProcedimientoVer: TareaTramiteExpedienteVer = new TareaTramiteExpedienteVer();

  public notificacionver: any = {
    personaEntidad: {
      numDocum: '',
      desPerEntid: ''
    }
  };
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
  public ejerNumExpedi!: any;
  public procediExp!: number;
  public tareaProcedi!: number;
  public numeroArchivo!: number;
  public descargaArchivo!: any;
  public fecha = new Date();
  public idInteresado!: number;
  public respuestahttp: any = new RespuestasHttp;
  public headers = new HttpResponse;
  public respuesta = new Response;
  public identificadorFicheroSubido!: number | undefined;
  public archivoSubidaEnProgreso: boolean = false;
  public idNotificacion!: number;
  public idhisperso!: number;
  public verGenerarSalida: boolean = false;
  public verInsertarBolsa: boolean = false;
  public identificadorGenerarSalida!: string;
  public opcionselect: string = "0";
  public desSituacion!: string;
  public selected = new Date();
  public ejercicio = new Date();
  public year: any = this.fecha.getFullYear();
  public atrasruta!: string;
  public AsignaT: string = "Asignar Tramitador";
  public descargafichero!: any;
  public descargaficheroFirmado!: any;


  public verExpediente: any = new VerExpediente();
  public tramiteExpedienteListar!: TramiteExpedienteDto[];


  public percentDone!: number;
  public nomArchiv!: string;
  public uploadSuccess!: boolean;
  public url!: string;
  public archivoSubido!: any;
  public nombreArchivoSubido!: string;
  public base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  fechaarchivo: Date = new Date();
  public descripcionArchivo!: string;
  public iddocumento!: number;
  public name!: string;
  public id!: number;
  public myimage?: string;
  public base64code!: any;


  public IDModel!: number;
  public TextoLegal!: string;

  public paraTextoLegar() {

    for (let index = 0; index < this.modeloteulistar.length; index++) {
      const element = this.modeloteulistar[index].texLegal;

      if (this.modeloteulistar[index].idModel == this.IDModel || this.modeloteulistar[index].idModel == this.modeloteucrear.idModel) {
        this.modeloteucrear.texlegal = this.modeloteulistar[index].texLegal;
        this.TextoLegal = this.modeloteulistar[index].texLegal;
      }
    }
  }

  public xmlTeu: any;

  public verxml: boolean = false;

  public generaXml() {

  }

  public quitabotonesNotifi() {
    this.notifUiFacade.quitabotonesNotifi(this.notifUiHost());
  }

  public xmlDescargado!: any;
  public descargoTEU: boolean = false;


  public descargaXml() {
    downloadTeuXml(this.xmlDescargado);
  }

  public verBolsaCrear() {
    this.bolsaFacade.mostrarFormularioBolsa(this);
  }

  public solicitadni(dni: string) {
    this.catalogosFacade.solicitadni(this.catalogosHost(), dni);
  }

  public getTemaDocumentoListar() {
    this.catalogosFacade.getTemaDocumentoListar(this.catalogosHost());
  }

  public getTramiteProcedimientoVer(idtareP: any) {
    this.catalogosFacade.getTramiteProcedimientoVer(this.catalogosHost(), Number(idtareP));
  }

  public fsistema: any = new Date().toLocaleDateString();
  public fechaSistema!: string;

  public FechaSistema() {
    this.catalogosFacade.fechaSistema(this.catalogosHost());
  }

  introTObjTrubu: TipoObjetoTributarioDto;

  public getTipoObjetoTributario(): void {
    this.catalogosFacade.getTipoObjetoTributario(this.catalogosHost());
  }

  ngOnInit() {
    this.modalManagerService.forceCleanupAll()
    this.initFacade.cargarDatosIniciales(this.initHost());
  }

  ngOnDestroy(): void {
    this.modalManagerService.forceCleanupAll()
  }


  public limpiaInsertatBolsa() {
    this.bolsaFacade.limpiarFormularioBolsa(this.bolsaHost());
  }

  public clickAtrasBolsaCrear() {
    this.bolsaFacade.clickAtrasBolsaCrear(this.bolsaHost());
  }

  public crearInsertaBolsa() {
    this.bolsaFacade.crearInsertaBolsa(this.bolsaHost());
  }

  public limpiaGenerarSalida() {
    this.salidaFacade.limpiarFormularioGenerarSalida(this.salidaHost());
  }

  public crearGenerarSalidaLogica() {
    this.salidaFacade.ejecutarCrearGenerarSalida(this.salidaHost());
  }

  public crearGenerarSalida(): any {
    this.salidaFacade.prepararCrearGenerarSalida(this.salidaHost());
  }

  public crearInteresado() {
    this.interesadosFacade.crearInteresado(this.interesadosHost());
  }

  public creaTramExp() {
    this.tramitesFacade.crearTramite(this.tramitesHost());
  }

  public verListadoTareasModal() {
    this.panelFacade.verListadoTareasModal(this.panelHost());
  }

  upload(event: any, id: number) {
    this.archivoService.procesarArchivoDelInput(this.archivoHost(), event, id);
  }

  envioArchivo(callback?: () => void) {
    this.archivoService.enviarArchivo(this.archivoHost(), callback);
  }

  private readonly archivoHost = (): ArchivoUploadHost => this;

  public vertareas: boolean = true;

  public verNuevaTareaExp() {
    this.nuevaTareaFacade.verNuevaTareaExp(this.nuevaTareaHost());
  }

  public nuevaTareaExp() {
    this.nuevaTareaFacade.nuevaTareaExp(this.nuevaTareaHost(), this.archivoHost(), this.tareasHost() as CrearTareaTramiteHost);
  }

  public cerrarModalNuevaTareaSeguro() {
    this.nuevaTareaFacade.cerrarModalNuevaTareaSeguro(this.nuevaTareaHost(), this.refs.fileInput);
  }

  public abrirModalNuevaTarea() {
    this.nuevaTareaFacade.abrirModalNuevaTarea(this.nuevaTareaHost(), this.refs.fileInput);
  }

  private limpiarEstadoModalNuevaTarea() {
    this.nuevaTareaFacade.limpiarEstadoModal(this.nuevaTareaHost(), this.refs.fileInput);
  }

  onTareaCreada(): void {
    this.panelFacade.onTareaCreada(this.panelHost(), this.refs.fileInput);
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
    this.procedimientoService.getUsuarioListar(id).subscribe(
      procedimientoPermisoListar => this.procedipermisolistar = procedimientoPermisoListar
    );
  }


  public seleccionaInteresado(idInteresado: number) {
    this.interesadosFacade.seleccionarInteresado(this.interesadosHost(), idInteresado);
  }

  public borrarTramite() {
    this.tramitesFacade.borrarTramite(this.tramitesHost());
  }

  public getListaTareas(): Observable<ListaTareaProcedi[]> {
    return this.tareasFacade.getListaTareas(this.idprocedi, this.fasetramite);
  }

  // En edita-expediente.component.ts

  public borrarTareaTramiteExp() {
    this.tareasFacade.borrarTarea(this.tareasHost());
  }

  public borrarTramitador() {
    this.tramitadoresFacade.borrarTramitador(this.tramitadoresHost());
  }


  public borrarInteresados() {
    this.interesadosFacade.borrarInteresado(this.interesadosHost());
  }


  //-----------------------------------

  public getListarInteresado(idexp: number) {
    this.interesadosFacade.listarInteresados(this.interesadosHost(), idexp);
  }

  async cargarExpediente() {
    this.cargaFacade.cargarDesdeRuta(this.cargaHost(), this.activatedRoute);
  }

  public inicializarSourceListarNotifi() {
    this.workspaceGridFacade.inicializarSourceListarNotifi(this.notificacionesGridHost());
  }

  public actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]) {
    this.workspaceGridFacade.actualizarGridNotificaciones(this.notificacionesGridHost(), leerNotificacion);
  }

  public recargarSourceTramitadores() {
    this.tramitadoresFacade.refrescarGrid(this.tramitadoresHost());
  }

  public clickTramitadores(event: any) {
    this.workspaceFacade.clickTramitadores(this.tramitadoresHost(), event);
  }

  public fechaTramite!: string;
  public disabledArchivoTareaTramite: boolean = false;
  public plantillaDefecto!: string | null;
  veoAcciones: boolean = false;


  public clickTareProcedimiento(event: any) {
    this.tareasFacade.clickTareaProcedimiento(this.nuevaTareaHost(), event);
  }

  public idlistatareaProcedi!: any;

  veoModifiDatosPerso: boolean = false;

  modifiObjetoTribu: boolean = false;

  //--------------------- Eleazar
  public veoBajaHabitante: boolean = false;
  public veoConsultaObjetoTributario: boolean = false;
  // Propiedades de estado

  public cargando: boolean = false;
  public descripcionAccion: string = '';
  public ediquetaValorConsulta: string;
  public isConsultaAccionRunning = false;
  public veoTipoObjetoTributario: boolean = false;
  public veoGenerarEntrada: boolean = true;
  public introValorConsulta: string = '';


  // Propiedades para almacenar los resultados de consultas
  public habitantes: Habitantes = new Habitantes();
  public vehiculo: Vehiculo = new Vehiculo();
  public personaentidad: PersonaEntidad = new PersonaEntidad();


  public objetotributario: ObjetoTributarioDto;

  public tareatramiteprocedimiento: TareaProcedimientoDTO;

  public idExpediente!: number;

  public modalAnteriorId: string | null = null;
  public mostrarModalOperacion = false;

  public tipoObjetoSeleccionado: TipoObjetoTributarioDto = {
    idHisTipObjTribu: 0,
    idTipObjTribu: 0,
    codTipObjTribu: '',
    desTipObjTribu: ''
  };


  resetActionState(): void {
    this.tareasAccionFacade.resetActionState(this.tareasAccionHost());
  }

  public borraDatosNuevaTarea() {
    this.nuevaTareaFacade.borraDatosNuevaTarea(this.nuevaTareaHost());
  }

  getAccionButtonText(): string {
    return this.tareasAccionFacade.getAccionButtonText(this.tareasAccionHost());
  }

  isDNIAction(): boolean {
    return this.tareasAccionFacade.isDNIAction(this.tareasAccionHost());
  }

  onConsultaAccionClick() {
    this.tareasAccionFacade.onConsultaAccionClick(this.tareasAccionHost(), this.tareaProcedimientoHost());
  }

  consultaAccion(valor: any, idtipobje: any): void {
    this.tareasAccionFacade.consultaAccion(this.tareasAccionHost(), valor, idtipobje);
  }

  public idListaTareaProcedimiento(selectedValue: any): void {
    this.tareasFacade.seleccionarTareaProcedimiento(this.tareaProcedimientoHost(), selectedValue);
  }

  veoDIVBorrarObjetoTRibu: boolean = true;

  public darDeBajaObjeto(): void {
    this.objetoTributarioFacade.darDeBajaObjeto(this);
  }

  public cerrarModalBajaObjetoTributario(): void {
    this.modalManagerService.closeModal('bajaObjetoTributarioModal');
  }


  public abrirModalLiquidacion(): void {
    this.bootstrapModalesFacade.abrirModalLiquidacion(this.bootstrapModalesHost());
  }

  public cerrarModalLiquidacion(): void {
    this.bootstrapModalesFacade.cerrarModalLiquidacion(this.bootstrapModalesHost());
  }

  public abrirModalOperacion(): void {
    this.bootstrapModalesFacade.abrirModalOperacion(this.bootstrapModalesHost());
  }

  cerrarModalOperacion() {
    this.bootstrapModalesFacade.cerrarModalOperacion(this.bootstrapModalesHost());
  }

  //-------------------------------------------
  public sourceRecibos: any;
  public dataAdapter: any;

  public columnsRecibos: any[] = COLUMNS_RECIBOS;

  loadRecibos(): Observable<ReciboCabeceraDto[]> {
    return this.tareasAccionFacade.loadRecibos(this.tareasAccionHost());
  }


  //---------------------------------


  // -------------------------------


  public verTareasdelTramite: boolean = false
  public descriptramite!: string;
  public fechatramite!: any;
  public fasetramite!: string;
  public botonNuevaTareaTramite: boolean = false;
  public veoeditofasetramite: boolean = true;


  public borrarDatosTramite() {
    this.editartramiteexp = new EditarTramiteExp();
    this.FechaSistema();
  }

  public clickTramiteNuevo(event: any) {
    this.workspaceFacade.clickTramiteNuevo(this.workspaceRootHost(), event);
  }

  public verAccionesdeTarea: boolean = false;
  public veopropuestaresolu: boolean = true;
  public FecIniTarea!: any;
  public FecFinTarea!: any;
  public numeroArchiTarea!: any;

  public anexoTarea!: any;
  public docAportadaTarea!: any;
  public docEniTarea!: any;
  public DocumentacionTarea!: any;
  public documentacion: string[] = [
    "Documentación Adjunta Digitalizada",
    "Documentación Adjunta en Soporte Papel",
    "Documentación Adjunta Digitalizada y en Papel"

  ];

  public fechametadatabuena!: string;

  public fechaMetadata(fecha: Date) {
    this.catalogosFacade.formatearFechaMetadata(this.catalogosHost(), fecha);
  }

  public tipodefirma: boolean = true;
  public firmaAtendida: boolean = false;
  public firmaDesatendida: boolean = false;

  async gettipofirma() {
    this.firmaFacade.cargarTipoFirma(this.firmaHost());
  }

  public tareaprocedimientoid!: any;
  public nunRegisTarea!: any;
  public verAbreArchivo: boolean = false;
  public insideEnviando = false;
  public insideDryRun = environment.inside.dryRun === true;
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
  public numeroTareaTramite: any;
  public descripTareaTramite: any;
  public veoBorrar: boolean = true;
  public veoGenerarSalida: boolean = true;
  public veoNotificacion: boolean = true;
  public veoPropuestaResolucion: boolean = true;
  public veoFinalizar: boolean = true;
  public veoXml: boolean = true;
  public veoFirmaAtendida: boolean = false;
  public veoFirmaDEsatendida: boolean = false;
  public veoDocOriginal: boolean = true;

  public actualizoSourceTareaTramite() {
    this.sourceTareasTramite = this.tareasFacade.createGridAdapter(this.idTramite);
  }

  public crearTablonAnuncio() {
    this.tareasFacade.crearTablonAnuncio(this.tareasHost());
  }

  public spinnervisible: boolean = true;

  public conviertePDF() {
    this.tareasFacade.conviertePDF(this.tareasHost());
  }

  public borrarconfirma: boolean = true;
  public veoconviertePDF: boolean = true;

  public onTareaTramiteDoubleClick(event: any): void {
    this.workspaceFacade.onTareaTramiteDoubleClick(this.workspaceRootHost(), event);
  }

  public clicktareaNueva(event: any) {
    this.workspaceFacade.clicktareaNueva(this.seleccionTareaHost(), event, this.seleccionTareaCallbacks());
  }

  public clicktarea(id: number, codArchivo, tareaProcedi: number) {
    this.workspaceFacade.clicktarea(this.workspaceRootHost(), id, codArchivo, tareaProcedi);
  }

  public limpiaarchivofirmaEF() {
    this.firmaFacade.limpiarArchivoFirmaEF(this.firmaHost());
  }

  async descargaArchivoFirmadoEFNuevo() {
    this.firmaFacade.enviarFirmaAtendida(this.firmaHost());
  }

  async descargaArchivoFirmadoEFDesatendido() {
    this.firmaFacade.enviarFirmaDesatendida(this.firmaHost());
  }

  async descargaArchivoFirmado() {
    this.firmaFacade.descargarArchivoFirmado(this.firmaHost());
  }

  public resetvariables() {
    this.notifUiFacade.resetvariables(this.notifUiHost());
  }

  public clickAtrasGenerarSalida() {
    this.salidaFacade.clickAtrasGenerarSalida(this.salidaHost());
  }

  public clickGenerarSalida() {
    // reservado: el modal se abre desde el template
  }

  public clickNuevaNotificacion() {
    this.notifUiFacade.clickNuevaNotificacion(this.notifUiHost());
  }

  public cambioYearEjercicio() {
    this.notifUiFacade.cambioYearEjercicio(this.notifUiHost());
  }

  public fechNotifi!: any;

  public ejerNotifi!: string;
  public numeroNotifi!: string;
  public dniNotifi!: string;
  public desPerEntidNotifi!: string;
  public verInfoNotifi: boolean = false;
  public desMotNotif!: string;
  public observacionNotifi!: string;
  public veoenviar: boolean = true;
  public veoEnviarNotifica: boolean = false;
  public veoSincronizarNotifica: boolean = false;
  public envioNotifica: EnvioNotificaInfo | null = null;
  public veorecepcionar: boolean = true;
  public veopublicar: boolean = true;
  public veodevolver: boolean = true;
  public veoanular: boolean = true;
  public veoborrar: boolean = true;
  public veoteu: boolean = true;
  public veoReenviarTeu: boolean = false;
  public mostrarBotonDescargaTEU: boolean = false;
  public mostrarBotonDescargaTEUPrincipal: boolean = false;
  public mostrarValidacionesTEU: boolean = false; // Control para mostrar validaciones visuales

  public motNotif!: any;
  public receptor!: any;
  public notificador!: any;
  public situacion!: any;
  public fechaprueba!: any;
  public fechaenvioTEU!: any


  public clicknotificacionNuevo(event) {
    this.workspaceFacade.clicknotificacionNuevo(this.workspaceRootHost(), event);
  }

  public onNotificacionClick(event: any) {
    this.workspaceFacade.onNotificacionClick(this.workspaceRootHost(), event);
  }

  public onNotificacionDoubleClick(event: any) {
    this.workspaceFacade.onNotificacionDoubleClick(this.workspaceRootHost(), event);
  }

  habilitarBotonesNotificacion(rowData: any) {
    this.workspaceFacade.habilitarBotonesNotificacion(this.workspaceRootHost(), rowData);
  }

  public onTramiteClick(event: any) {
    this.workspaceFacade.onTramiteClick(event);
  }

  public onTramiteDoubleClick(event: any) {
    this.workspaceFacade.onTramiteDoubleClick(this.workspaceRootHost(), event);
  }

  public onTramitadorDoubleClick(event: any) {
    this.workspaceFacade.onTramitadorDoubleClick(this.workspaceRootHost(), event);
  }

  public onTareaClick(event: any) {
    this.workspaceFacade.onTareaClick(event);
  }

  public onTareaDoubleClick(event: any) {
    this.workspaceFacade.onTareaDoubleClick(this.workspaceRootHost(), event);
  }

  public fechaordenadafenvio: any;
  public fechaordenadafrecep: any;
  public fechaordenadafpubli: any;
  public fechaordenadafemision: any;

  public fechasNotifi(fenvio: any, frecep: any, fpubli: any, femision: any) {
    this.notificacionesFacade.aplicarFechasNotificacion(this, fenvio, frecep, fpubli, femision);
  }

  public vertramite: boolean = true;
  public botonVerNotifi: boolean = true;

  public enviandoTramite: boolean = false;
  public veoTramitadores: boolean = false;

  public cancelarnuevotramite() {
    this.tramitesUiFacade.cancelarnuevotramite(this.tramitesUiHost());
  }

  public limpiarFormularioTramite() {
    this.tramitesUiFacade.limpiarFormularioTramite(this.tramitesUiHost());
  }

  public veotramitadores() {
    this.tramitesUiFacade.veotramitadores(this.tramitesUiHost());
  }

  public verNotificaciones() {
    this.tramitesUiFacade.verNotificaciones(this.tramitesUiHost(), (ejercicio, numero) =>
      this.notificacionesFacade.createGridAdapter(ejercicio, numero),
    );
  }

  public leoMetadatos(codfiche: number) {
    this.catalogosFacade.leoMetadatos(this.catalogosHost(), codfiche);
  }

  public noverNotificaciones() {
    this.tramitesUiFacade.noverNotificaciones(this.tramitesUiHost());
  }

  // ----------------------------------
  //  Seccion de Notificaciones :
  //------------------------------------

  /*** consultas para  formulario de creacion de notificaciones de expedientes*/
  public listadodeNotificaciones() {
    this.notificacionesFacade.loadCatalogos(this);
  }

  private readonly teuHost = (): EditaExpedienteTeuHost => this;
  private readonly notifCrudHost = (): EditaExpedienteNotificacionesCrudHost => this;
  private readonly solicitarCrearNotificacionHost = (): SolicitarCrearNotificacionHost => this;
  private readonly tareasHost = (): EditaExpedienteTareasHost => this;
  private readonly tramitesHost = (): EditaExpedienteTramitesHost => this;
  private readonly tramitadoresHost = (): EditaExpedienteTramitadoresHost => this;
  private readonly tareaProcedimientoHost = (): TareaProcedimientoHost => this;
  private readonly tareasAccionHost = (): EditaExpedienteTareasAccionHost => this;
  private readonly interesadosHost = (): EditaExpedienteInteresadosHost => this;
  private readonly bolsaHost = (): EditaExpedienteBolsaHost => this;
  private readonly salidaHost = (): EditaExpedienteSalidaHost => this;
  private readonly insideHost = (): EditaExpedienteInsideHost => this;
  private readonly bootstrapModalesHost = (): BootstrapModalesHost => this;
  private readonly cargaHost = (): EditaExpedienteCargaHost => this;
  private readonly firmaHost = (): FirmaTareaHost => this;
  private readonly seleccionTareaHost = (): SeleccionTareaNuevaHost => this;
  private readonly initHost = (): EditaExpedienteInitHost => this;
  private readonly expedienteHost = (): EditaExpedienteExpedienteHost => this;
  private readonly notificacionesGridHost = (): EditaExpedienteNotificacionesGridHost => this;
  private readonly nuevaTareaHost = (): EditaExpedienteNuevaTareaHost => this;
  private readonly notifFormHost = (): EditaExpedienteNotificacionesFormHost => this;
  private readonly notifUiHost = (): EditaExpedienteNotificacionesUiHost => this;
  private readonly tramitesUiHost = (): EditaExpedienteTramitesUiHost => this;
  private readonly panelHost = (): EditaExpedientePanelHost & EditaExpedienteNuevaTareaHost => this;
  private readonly catalogosHost = (): EditaExpedienteCatalogosHost => this;
  private readonly workspaceRootHost = (): EditaExpedienteWorkspaceRootHost => this;

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
    this.teuFacade.crearModeloTeuFichero(this.teuHost());
  }

  public actualizarSourceNotificaciones(): void {
    this.workspaceGridFacade.actualizarSourceNotificaciones(this.notificacionesGridHost());
  }

  public cerrarModalTEU(): void {
    this.teuFacade.cerrarModal(this.teuHost());
  }

  public descargarFicheroTEU(): void {
    this.teuFacade.descargarFichero(this.teuHost());
  }

  public onCheckboxChange(checkboxName: string, value: boolean): void {
    onCheckboxTeuChange(checkboxName, value);
  }

  public inicializarFormularioTEU(): void {
    this.modeloteucrear = this.teuFacade.inicializarFormulario();
    this.mostrarValidacionesTEU = false;
  }

  public isFechaSolicInvalid(): boolean {
    return this.teuFacade.isFechaSolicInvalid(this.teuHost());
  }

  public isFechaGenerInvalid(): boolean {
    return this.teuFacade.isFechaGenerInvalid(this.teuHost());
  }

  public isFechaFirmaInvalid(): boolean {
    return this.teuFacade.isFechaFirmaInvalid(this.teuHost());
  }

  public getnotificacionListar() {
    this.notificacionesFacade.listarNotificacionesDelExpediente(this);
  }

  public borrarNotificacion(id: number) {
    this.notificacionesCrudFacade.borrarNotificacion(this.notifCrudHost(), id);
  }

  public publicarNotifi() {
    this.notificacionesCrudFacade.publicarNotifi(this.notifCrudHost());
  }

  public editaNotifi() {
    this.notificacionesCrudFacade.editaNotifi(this.notifCrudHost());
  }

  public onCambioEstadoNotificacion(event: any) {
    console.log('Cambio de estado de notificación:', Number(event.target.value));
    this.notifUiFacade.limpiarErroresVisuales();
  }

  public onFechaEnvioChange(event: any) {
    this.notifUiFacade.onFechaCampoChange(this.notifUiHost(), 'fecEnvio', event.target.value);
  }

  public onFechaRecNotifChange(event: any) {
    this.notifUiFacade.onFechaCampoChange(this.notifUiHost(), 'fecRecNotif', event.target.value);
  }

  public onFechaRegistSalidChange(event: any) {
    this.notifUiFacade.onFechaCampoChange(this.notifUiHost(), 'fecRegistSalid', event.target.value);
  }

  public onFechaPubBopChange(event: any) {
    this.notifUiFacade.onFechaCampoChange(this.notifUiHost(), 'fecPubBop', event.target.value);
  }

  public limpiarErroresVisuales() {
    this.notifUiFacade.limpiarErroresVisuales();
  }

  public cerrarModalNotificacion() {
    this.notifUiFacade.cerrarModalNotificacion(this.notifUiHost());
  }

  public abrirModalEnvioTeu(): void {
    this.notifUiFacade.abrirModalEnvioTeu(this.notifUiHost());
  }

  public abrirModalEnviarNotificacion() {
    this.notifUiFacade.abrirModalEnviarNotificacion(this.notifUiHost());
  }

  public enviarANotificaPlataforma(): void {
    this.notificacionesCrudFacade.enviarANotificaPlataforma(this.notifCrudHost());
  }

  public sincronizarConNotificaPlataforma(): void {
    this.notificacionesCrudFacade.sincronizarConNotificaPlataforma(this.notifCrudHost());
  }

  public async enviarNotificacion() {
    await this.notificacionesCrudFacade.enviarNotificacion(this.notifCrudHost());
  }

  public recepcionarNotificacion() {
    this.notificacionesCrudFacade.recepcionarNotificacion(this.notifCrudHost());
  }

  public devolverNotificacion() {
    this.notificacionesCrudFacade.devolverNotificacion(this.notifCrudHost());
  }

  public anularNotificacion() {
    this.notificacionesCrudFacade.anularNotificacion(this.notifCrudHost());
  }

  public borraDatosCrearNotifi() {
    this.notifUiFacade.borraDatosCrearNotifi(this.notifUiHost());
  }

  async vernotifi(id: number, modoVer = false): Promise<void> {
    return this.notificacionesCrudFacade.vernotifi(this.notifCrudHost(), id, modoVer);
  }

  public verNotificacion(id: number) {
    this.notifUiFacade.verNotificacion(this.notifUiHost(), id);
  }

  public editarNotificacion(id: number) {
    this.notifUiFacade.editarNotificacion(this.notifUiHost(), id);
  }

  public fecLimite!: Date;

  public fechamas15() {
    this.notifUiFacade.fechamas15(this.notifUiHost());
  }

  public borrarDatosPublicacion() {
    this.notifUiFacade.borrarDatosPublicacion(this.notifUiHost());
  }

  public borraDatosenviarNotifi() {
    this.notifUiFacade.borraDatosEnviarNotifi(this.notifUiHost());
  }

  public borraDatosRecepcion() {
    this.notifUiFacade.borraDatosRecepcion(this.notifUiHost());
  }


  public CierraPopup() {
    this.cerrarModal('CrearNotificacionModal');
  }

  public get formularioNotificacionValido(): boolean {
    return this.notifFormFacade.getFormularioValido(this.notifFormHost());
  }

  public validarFormularioNotificacion(): boolean {
    return this.notifFormFacade.validarFormulario(this.notifFormHost());
  }

  public limpiarCacheValidacion(): void {
    this.notifFormFacade.limpiarCacheValidacion();
  }

  public inicializarFechaNotificacion() {
    this.notifFormFacade.inicializarFechaNotificacion(this.notifFormHost());
  }



  public cargarDatosInteresado(dni: string) {
    this.notifUiFacade.cargarDatosInteresado(this.notifUiHost(), dni);
  }

  public crearnotificacion() {
    this.notificacionesCrudFacade.solicitarCreacionNotificacion(this.solicitarCrearNotificacionHost());
  }

  public limpiarFormularioNotificacion() {
    this.notifFormFacade.limpiarFormularioNotificacion(this.notifFormHost());
  }

  public cerrarModalCrearNotificacion() {
    this.notifUiFacade.cerrarModalCrearNotificacion(this.notifUiHost());
  }

  public onModalHidden() {
    this.notifUiFacade.onModalHidden();
  }

  public limpiarEstadoModalError() {
    this.notifUiFacade.limpiarEstadoModalError(this.notifUiHost());
  }

  public spinnervisiblefirma: boolean = true;

  public abreArchivo() {
    abrirArchivoTarea(this, this.notificationService);
  }

  public descargaArchiFirmado!: any;

  async abreArchiFirmado() {
    this.descargaArchiFirmado = abrirInformeFirma(this, this.notificationService);
  }

  editExpediente() {
    this.expedienteFacade.editExpediente(this.expedienteHost());
  }

  public finalizartarea() {
    this.tareasFacade.finalizarTarea(this.tareasHost());
  }

  public prueba: string = " prueba";

  editTareaTramiteExpediente() {
    this.tareasFacade.editarTarea(this.tareasHost());
  }

  onTareaEditada(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public faseEditTra: string;

  editarTramiteExpediente() {
    this.tramitesFacade.editarTramite(this.tramitesHost());
  }



  public habilitaTramiteExp() {
    this.tramitesUiFacade.habilitaTramiteExp(this.tramitesUiHost());
  }

  public validateAndCreateTramite(event: Event): void {
    this.tramitesUiFacade.validateAndCreateTramite(event, () => this.creaTramExp());
  }

  public validateAndEditTramite(event: Event): void {
    this.tramitesUiFacade.validateAndEditTramite(event, () => this.editarTramiteExpediente());
  }

  public limpiarErroresTramite(): void {
    this.tramitesUiFacade.limpiarErroresTramite();
  }

  public limpiarErroresEditarTramite(): void {
    this.tramitesUiFacade.limpiarErroresEditarTramite();
  }

  recargarpagina() {
    window.location.reload();

  }

  public refrescoSourceTramite() {
    this.tramitesFacade.refrescarGrid(this.tramitesHost());
  }

  public refrescoSourceTareasTramite(id: any) {
    this.tareasFacade.refrescarGrid(this.tareasHost(), Number(id));
  }

  public refresSourceListarNotifi() {
    this.workspaceGridFacade.refreshListarNotifi(this, false);
  }

  public refresSourceListarNotifiPRE() {
    this.workspaceGridFacade.refreshListarNotifi(this, true);
  }

  public vacio() {
    console.log(`${environment.apiUrl}tramite/listar/${this.idExpediente}`);

  }

  public descargaficheroHistorico(event: any) {
    const nArchivo = event.args.row.bounddata.archivo;
    this.descargafichero = buildDescargaHistoricoUrl(nArchivo, this.usuContrl);
    this.abreArchivo();
  }

  public marcaHistorico(event: any) {
    console.log("PULSASTE DOBLE CLICK HISTÓRICO!!!");
  }

  public cargaHistorico(idTarea: any) {
    this.tareasFacade.refrescarHistorico(this, idTarea);
  }

  public showGenerarEntrada: boolean = false;

  clickGenerarEntrada(): void {
    this.bootstrapModalesFacade.clickGenerarEntrada(this.bootstrapModalesHost());
  }

  closeGenerarEntradaModal(): void {
    this.bootstrapModalesFacade.closeGenerarEntradaModal(this.bootstrapModalesHost());
  }

  showObjetoTributarioModal(): void {
    this.bootstrapModalesFacade.abrirModalObjetoTributario();
  }

  /**
   * Método para validar formularios antes de enviar
   */
  public validateAndSubmit(event: Event, formId: string, submitFunction: () => void): void {
    this.uiFacade.validateAndSubmit(event, formId, submitFunction);
  }

  public handleValidationError(fieldName: string): void {
    this.uiFacade.handleValidationError(fieldName);
  }

  public confirmDelete(itemName: string, deleteFunction: () => void): void {
    this.uiFacade.confirmDelete(itemName, deleteFunction);
  }

  public showWarning(message: string): void {
    this.uiFacade.showWarning(message);
  }

  public showInfo(message: string): void {
    this.uiFacade.showInfo(message);
  }

  /**
   * Convierte una fecha en formato ISO o string a formato YYYY-MM-DD para inputs de fecha
   * @param fecha Fecha en cualquier formato válido
   * @returns Fecha en formato YYYY-MM-DD o string vacío si no hay fecha
   */
  public formatearFechaParaInput(fecha: any): string {
    return this.uiFacade.formatearFechaParaInput(fecha);
  }

  public validateAndCreateTarea(event: Event): void {
    if (!validarFormularioNuevaTarea(event)) {
      this.notificationService.incompleteFields();
      event.preventDefault();
      return;
    }
    this.nuevaTareaExp();
  }

  public limpiarErroresNuevaTarea(): void {
    limpiarErroresNuevaTareaForm();
  }

  public validarTareaProcedimiento(event: Event): void {
    validarTareaProcedimientoCampo(event);
  }

  public validarCampo(event: Event, campoId: string): void {
    validarCampoFormularioTarea(event, campoId);
  }

  /**
   * Navega de vuelta al listado de expedientes
   */
  public volverListadoExpedientes(): void {
    this.expedienteFacade.volverListadoExpedientes();
  }

  public abrirModalRemisionJusticia(): void {
    this.insideFacade.abrirModalRemisionJusticia(this.insideHost());
  }

  public handleEnviarDocumentoInside(): void {
    this.insideFacade.handleEnviarDocumentoTarea(this.insideHost());
  }

  public handleEnviarExpedienteInside(): void {
    this.insideFacade.handleEnviarExpedienteCompleto(this.insideHost());
  }

  public handleEnviarDocumentosInside(): void {
    this.insideFacade.handleEnviarDocumentosExpediente(this.insideHost());
  }

  public handleRemisionAJusticia(): void {
    this.insideFacade.handleRemisionAJusticia(this.insideHost());
  }

  public handleConsultarEstadoRemisionInside(): void {
    this.insideFacade.handleConsultarEstadoRemision(this.insideHost());
  }

  public handleValidarExpedienteInside(): void {
    this.insideFacade.handleValidarExpediente(this.insideHost());
  }

  public handleAltaExpedienteEniXmlInside(): void {
    this.insideFacade.handleAltaExpedienteEniXml(this.insideHost());
  }

  public handleAltaDocumentoEniXmlInside(): void {
    this.insideFacade.handleAltaDocumentoEniXml(this.insideHost());
  }

  public cargarEstadoInside(idExpediente: number): void {
    this.insideFacade.cargarEstadoEnvio(idExpediente, this.insideHost());
  }

  public handleVerHistorialEnviosInside(): void {
    this.insideFacade.handleVerHistorialEnvios(this.insideHost());
  }
}
