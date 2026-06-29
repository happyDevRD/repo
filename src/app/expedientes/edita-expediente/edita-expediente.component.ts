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
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'
import { ExpedientesService } from '../expedientes.service';
import { FormBuilder } from '@angular/forms';
import { ProcediPermisos, ProcediPermisosListar } from '../../procedimientos/procedimiento';
import { ProcedimientoService } from '../../procedimientos/procedimiento.service';
import { catchError, finalize, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { MUNICIO, PROVIN, TIPO_BAJA } from '../../core/constants/datos';
import { TareaProcedimientoDTO } from '../../core/models/tarea-procedimiento.dto';
import { ACCIONES } from '../../core/helper/tarea-acciones';
import { TipoObjetoTributarioDto } from '../../core/models/tipo-objeto-tributario.dto';
import { EnvioNotificaInfo } from '../notificaciones/notificaciones-notifica-panel.component';
import { NotificacionesService } from '../services/notificaciones.service';
import { ReciboCabeceraDto } from '../../core/models/recibo-cabecera.dto';
import { tap } from 'rxjs/operators';
import { TareaTramiteExpedienteVer } from '../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';
import { ObjetoTributarioDto } from '../../core/models/objeto-tributario.dto';
import { TramitesService } from '../tramites.service';
import { TramiteExpedienteDto } from '../../core/models/tramite-expediente.dto';
import { InteresadoListarDto } from '../../core/dto/interesado.dto';
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
  crearNotificacionVacia,
  cargarDatosInteresadoNotificacion,
  nuevaConsultaDni,
  resetEdicionNotificacion,
} from './notificaciones/notificaciones-data.helper';
import {
  abrirModalEnviarNotificacion as abrirModalEnvioNotificacion,
  abrirModalVerNotificacion,
  cerrarModalVerNotificacion,
  downloadTeuXml,
  limpiarErroresVisualesNotificacion,
  limpiarEstadoModalNotificacion as limpiarModalNotificacionDom,
  cerrarModalCrearNotificacion as cerrarModalCrearNotificacionDom,
  limpiarEstadoModalCrearNotificacion,
  onModalHiddenBootstrap,
} from './notificaciones/notificaciones-modal.helper';
import { calcularFechasNotificacion, formatearFechaNotificacionSeleccionada } from './notificaciones/notificaciones-fechas.helper';
import { actualizarCheckboxNotificaciones } from './notificaciones/notificaciones-grid-radio.helper';
import {
  actualizarSourceNotificacionesGrid,
  ActualizarGridNotificacionesHost,
} from './notificaciones/notificaciones-grid-refresh.helper';
import { abrirArchivoTarea, abrirInformeFirma } from './tareas/tareas-archivo.helper';
import {
  aplicarClickNotificacionNuevo,
  asignarFechaCampoNotificacion,
  actualizarEjercicioDesdeFechaNotificacion,
  calcularFechaLimiteDesdePublicacion,
} from './notificaciones/notificaciones-form-campos.helper';
import { onCheckboxTeuChange } from './notificaciones/notificaciones-teu-checkbox.helper';
import {
  aplicarVistaNotificaciones,
  aplicarVistaTramitadores,
  aplicarVistaTramite,
} from './shared/edita-expediente-panel-navegacion.helper';
import {
  aplicarFechaTramitePorDefecto,
  crearTramiteExpVacio,
  limpiarErroresFormularioTramite,
  validarFormularioBootstrap,
} from './tramites/tramites-form-validation.helper';
import { aplicarEdicionTramiteDesdeFila } from './tramites/tramites-edicion.helper';
import {
  limpiarErroresNuevaTareaForm,
  validarCampoFormularioTarea,
  validarFormularioNuevaTarea,
  validarTareaProcedimientoCampo,
} from './tareas/tareas-form-validation.helper';
import { EditaExpedienteArchivoService, ArchivoUploadHost } from './services/edita-expediente-archivo.service';
import {
  createDescripcionTareasRenderer,
  createNotiDniRenderer,
  createNotiNombreRenderer,
  createPlazoRenderer,
  editaExpedienteGridRenderers,
} from './shared/edita-expediente-grid-renderers';
import { EditaExpedienteTramitesFacade, EditaExpedienteTramitesHost } from './tramites/edita-expediente-tramites.facade';
import { calcularSeleccionTramite } from './tramites/tramites-seleccion.helper';
import {
  CrearTareaTramiteHost,
  EditaExpedienteTareasFacade,
  EditaExpedienteTareasHost,
  TareaProcedimientoHost,
} from './tareas/edita-expediente-tareas.facade';
import { createHistoricoGridAdapter } from './tareas/historico-grid.config';
import { buildDescargaHistoricoUrl } from './tareas/historico.helper';
import { normalizarPlantillaDefectoSeleccion } from './tareas/tareas-procedimiento.helper';
import { EditaExpedienteInteresadosFacade, EditaExpedienteInteresadosHost } from './interesados/edita-expediente-interesados.facade';
import { EditaExpedienteBolsaFacade, EditaExpedienteBolsaHost } from './operaciones/edita-expediente-bolsa.facade';
import { EditaExpedienteSalidaFacade, EditaExpedienteSalidaHost } from './operaciones/edita-expediente-salida.facade';
import { EditaExpedienteTramitadoresFacade, EditaExpedienteTramitadoresHost } from './tramitadores/edita-expediente-tramitadores.facade';
import { createTramitadorGridAdapter } from './tramitadores/tramitadores-grid.config';
import { EditaExpedienteObjetoTributarioFacade } from './tareas/edita-expediente-objeto-tributario.facade';
import {
  EditaExpedienteTareasConsultaFacade,
  ConsultaAccionHost,
} from './tareas/edita-expediente-tareas-consulta.facade';
import { Habitantes, PersonaEntidad, Vehiculo } from './tareas/tareas-accion.models';
import {
  configurarAccionTarea,
  getAccionButtonText,
  isDNIAction,
  resetActionState,
  ResetActionStateHost,
  validarConsultaAccionClick,
} from './tareas/tareas-accion.helper';
import { createColumnsTareasTramite } from './tareas/tareas-grid-columns';
import { createTareaGridAdapter } from './tareas/tareas-grid.config';
import { cerrarModalesNuevaTarea, abrirModalEditarTareaTramite } from './tareas/tareas-modal.helper';
import { tieneArchivoPendienteSubida } from './tareas/tareas-creacion.helper';
import {
  aplicarSeleccionTareaNueva,
  SeleccionTareaNuevaHost,
} from './tareas/tareas-seleccion.helper';
import { createColumnsListarNotifi } from './notificaciones/notificaciones-grid-columns';
import {
  createColumnsHistorico,
  createColumnsTareasProcedi,
  createColumnsTramitadores,
} from './shared/edita-expediente-aux-grid-columns';
import { marcarRadioButtonGrid } from './shared/grid-radio-marker.helper';
import { createTramiteGridAdapter } from './tramites/tramites-grid.config';
import { createColumnsTramite } from './tramites/tramites-grid-columns';
import { notificacionesGridRenderers } from './notificaciones/notificaciones-grid-renderers';
import { createNotificacionGridAdapter, buildNotificacionGridSourceFromLocal } from './notificaciones/notificaciones-grid.config';
import { calcularSeleccionNotificacion } from './notificaciones/notificaciones-seleccion.helper';
import {
  isFechaTeuInvalida,
  validarFormularioCreacionNotificacion,
} from './notificaciones/notificaciones-form.validator';
import {
  BootstrapModalesHost,
  EditaExpedienteBootstrapModalesFacade,
} from './shared/edita-expediente-bootstrap-modales.facade';
import { COLUMNS_RECIBOS } from './tareas/recibos-grid.config';
import { ListaTareaProcedi, Pais, RespuestasHttp } from './edita-expediente.models';
import { EditaExpedienteCargaFacade, EditaExpedienteCargaHost } from './services/edita-expediente-carga.facade';
import { EditaExpedienteInitFacade, EditaExpedienteInitHost } from './services/edita-expediente-init.facade';
import { EditaExpedienteFirmaFacade, FirmaTareaHost } from './tareas/edita-expediente-firma.facade';
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
    EditaExpedienteInteresadosFacade,
    EditaExpedienteBolsaFacade,
    EditaExpedienteSalidaFacade,
    EditaExpedienteObjetoTributarioFacade,
    EditaExpedienteBootstrapModalesFacade,
    EditaExpedienteCargaFacade,
    EditaExpedienteFirmaFacade,
    EditaExpedienteInitFacade,
  ],
})
export class EditaExpedienteComponent implements OnInit, OnDestroy {

  public provin = PROVIN;
  public municio = MUNICIO;
  public TipoBaja = TIPO_BAJA;
  public municifiltro: any[] = [];

  private get fileInput(): ElementRef | undefined {
    return this.refs.fileInput;
  }

  private get gridNotificaciones(): any {
    return this.refs.gridNotificaciones;
  }

  get teuFormRef(): any {
    return this.refs.teuFormRef;
  }

  private get gridRecibos(): ElementRef | undefined {
    return this.refs.gridRecibos;
  }

  constructor(
    public _location: Location,
    public http: HttpClient,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
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
    private tareasConsultaFacade: EditaExpedienteTareasConsultaFacade,
    private interesadosFacade: EditaExpedienteInteresadosFacade,
    private bolsaFacade: EditaExpedienteBolsaFacade,
    private salidaFacade: EditaExpedienteSalidaFacade,
    private objetoTributarioFacade: EditaExpedienteObjetoTributarioFacade,
    private bootstrapModalesFacade: EditaExpedienteBootstrapModalesFacade,
    private cargaFacade: EditaExpedienteCargaFacade,
    private firmaFacade: EditaExpedienteFirmaFacade,
    private initFacade: EditaExpedienteInitFacade,
  ) {}

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
    const formIds = [
      'formNuevaTarea',
      'formNuevoTramite',
      'formNuevaNotificacion',
      'formEditarTarea',
      'formEditarTramite',
      'formEditarNotificacion',
      'formGenerarSalida',
      'formInsertarBolsa',
      'formTEU'
    ];
    
    formIds.forEach(formId => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        form.reset();
      }
    });
  }

  /**
   * Método para limpiar errores de validación
   */
  public limpiarErrores(): void {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    const formElements = document.querySelectorAll('.form-control.is-invalid');
    formElements.forEach(element => {
      element.classList.remove('is-invalid');
    });
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
  public consultadni: ConsultaDni = new ConsultaDni();
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
  public dniok: boolean = false;
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
  public myimage!: Observable<any>;
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
    this.veoenviar = false;
    this.veoEnviarNotifica = false;
    this.veoSincronizarNotifica = false;
    this.veorecepcionar = false;
    this.veopublicar = false;
    this.veodevolver = false;
    this.veoanular = false;
    this.veoborrar = false;
    this.veoteu = false;
    this.veoReenviarTeu = false;
    this.mostrarBotonDescargaTEUPrincipal = false;
  }

  public xmlDescargado!: any;
  public descargoTEU: boolean = false;


  public descargaXml() {
    downloadTeuXml(this.xmlDescargado);
  }

  public verBolsaCrear() {
    this.verTareasdelTramite = false;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = false;
    this.verEditartareatramite = false;
    this.verNuevaNotifi = false;
    this.verGenerarSalida = false;
    this.verInsertarBolsa = true;

    console.log("INSERTA BOLSA CREAR!!!")


  }

  public solicitadni(dni: string) {
    this.formanotificacion = true;
    this.expedientesService.getDni(dni).subscribe(
      consultadni => this.consultadni = consultadni
    );
    console.log(dni);
    this.dniok = true;
  }


  public getTemaDocumentoListar() {
    this.expedientesService.getTemaDocumentoListar().subscribe(
      temadocumentolistar => this.temadocumentolistar = temadocumentolistar
    )
  }

  public getTramiteProcedimientoVer(idtareP: any) {
    this.procedimientoService.getTareaProcedimientoVer(idtareP).pipe(
      tap({
        next: (tareaProceDiver: TareaTramiteExpedienteVer) => {
          this.tareaProcedimientoVer = tareaProceDiver;
          console.log('Tarea Tramite Expediente Ver:', this.tareaProcedimientoVer);
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error en Tarea Procedimiento: ' + err.error.text);
        }
      })
    ).subscribe();
  }


  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSistema() {
    const hoy = new Date()
    const anio = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    this.fechaSistema = `${anio}-${mes}-${dia}`
    this.creartramiteexp.fecTramite = this.fechaSistema
    this.tareatramiteexpedientecrear.fecInicio = this.fechaSistema
  }

  introTObjTrubu: TipoObjetoTributarioDto;

  public getTipoObjetoTributario(): void {
    this.expedientesService.getTipoObjetoTributario().subscribe({
      next: (data: TipoObjetoTributarioDto[]) => {
        this.tipoObjetoTributario = data;
      },
      error: (error) => {
        console.error("Error al obtener la lista:", error);
      }
    });
  }

  ngOnInit() {
    this.modalManagerService.forceCleanupAll()
    this.initFacade.cargarDatosIniciales(this.initHost());
  }

  ngOnDestroy(): void {
    this.modalManagerService.forceCleanupAll()
  }


  public limpiaInsertatBolsa() {
    this.insertabolsacrear = new InsertaBolsaCrear();
  }

  public clickAtrasBolsaCrear() {
    this.verInsertarBolsa = false;
    this.limpiaInsertatBolsa();
  }

  public crearInsertaBolsa() {
    this.bolsaFacade.crearInsertaBolsa(this.bolsaHost());
  }

  public limpiaGenerarSalida() {
    this.creargenerarsalida = new CrearGenerarSalida();
    this.temadocumentolistar = new TemaDocumentoListar[0];

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
    this.veoModifiDatosPerso = false;
    this.veoAcciones = false;
    this.verformnuevatarea = true;
    this.verTareasdelTramite = true;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = true;
    this.verEditartareatramite = false;
    this.borraDatosNuevaTarea()
    this.introValorConsulta = "";
  }

  upload(event: any, id: number) {
    this.archivoService.procesarArchivoDelInput(this.archivoHost(), event, id);
  }

  envioArchivo(callback?: () => void) {
    this.archivoService.enviarArchivo(this.archivoHost(), callback);
  }

  private readonly archivoHost = () => this as unknown as ArchivoUploadHost;

  public vertareas: boolean = true;

  public verNuevaTareaExp() {
    // Limpiar cualquier modal que pueda estar abierto
    this.cerrarModalNuevaTareaSeguro();

    // Limpiar variables de estado
    this.vertareas = false;
    this.verlistadotareas = false;
    this.nuevotramitador = false;
    this.verlistadotramitadores = false;
    this.verEditartareatramite = false;

    // Resetear el estado de acciones
    this.resetActionState();

    // Limpiar datos de la nueva tarea
    this.borraDatosNuevaTarea();

    window.setTimeout(() => {
      this.modalManagerService.reconcileModalDomState()
    }, 200)
  }

  public nuevaTareaExp() {
    if (this.archivoSubidaEnProgreso) {
      this.notificationService.warning('Por favor, espera a que se complete la subida del archivo antes de crear la tarea.');
      return;
    }

    if (tieneArchivoPendienteSubida(this.base64code, this.name, this.identificadorFicheroSubido)) {
      this.notificationService.info('Se está subiendo el archivo. Por favor, espera...');
      this.envioArchivo(() => {
        if (this.identificadorFicheroSubido) {
          this.crearTareaConArchivo();
        } else {
          this.notificationService.error('No se pudo crear la tarea porque el archivo no se subió correctamente.');
        }
      });
      return;
    }

    this.crearTareaConArchivo();
  }

  private crearTareaConArchivo() {
    this.tareasFacade.crearTarea(this.tareasHost() as CrearTareaTramiteHost);
  }

  onTareaCreada(): void {
    this.veoModifiDatosPerso = false;
    this.introValorConsulta = '';
    this.disabledArchivoTareaTramite = false;
    this.veoTipoObjetoTributario = false;
    this.verformnuevatarea = false;
    this.veoBajaHabitante = false;
    this.vertareas = true;
    this.veoAcciones = false;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Método para cerrar el modal de nueva tarea de manera segura
   */
  public cerrarModalNuevaTareaSeguro() {
    this.limpiarEstadoModalNuevaTarea();
    try {
      cerrarModalesNuevaTarea();
    } catch {
      this.modalManagerService.closeModal('NuevaTareaTra');
      this.modalManagerService.closeModal('ntareatramiteModal');
    }
  }

  /**
   * Método para abrir el modal de nueva tarea de manera segura
   */
  public abrirModalNuevaTarea() {
    // Limpiar el estado antes de abrir
    this.limpiarEstadoModalNuevaTarea();
    
    // Abrir modal usando el servicio
    this.modalManagerService.openModal('NuevaTareaTra');
  }

  /**
   * Método para limpiar el estado del modal de nueva tarea
   */
  private limpiarEstadoModalNuevaTarea() {
    // Resetear variables de estado
    this.veoModifiDatosPerso = false;
    this.veoBajaHabitante = false;
    this.veoConsultaObjetoTributario = false;
    this.veoTipoObjetoTributario = false;
    this.verformnuevatarea = false;
    this.veoAcciones = false;

    // Limpiar datos de entrada
    this.introValorConsulta = '';
    this.introTObjTrubu = {} as TipoObjetoTributarioDto;

    // Limpiar archivo
    this.identificadorFicheroSubido = undefined;
    this.base64code = undefined;
    this.name = '';
    this.archivoSubidaEnProgreso = false;

    // Limpiar plantilla defecto
    this.plantillaDefecto = null;

    // Limpiar input de archivo
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Limpiar clases de validación del formulario
    setTimeout(() => {
      const form = document.getElementById('formNuevaTarea') as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        
        // Limpiar clases de validación de todos los campos
        const allFields = form.querySelectorAll('.form-control, .form-select');
        allFields.forEach(field => {
          field.classList.remove('is-invalid', 'is-valid');
        });
      }
    }, 100);

    // Forzar detección de cambios
    this.cdr.detectChanges();
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
    this.verborrarinteresado = true;
    this.idInteresado = idInteresado;

    console.log(`ID INTERESADO : ${this.idInteresado}`);
  }

  public borrarTramite() {
    this.tramitesFacade.borrarTramite(this.tramitesHost());
  }

  public getListaTareas(): Observable<ListaTareaProcedi[]> {
    let urlListatareas: string = `${environment.apiUrl}tareaProcedimiento/listar/${this.idprocedi}/${this.fasetramite}`;

    console.log(`********** TAREAS DEL PROCEDIMIENTO LISTAR  *********************`);
    console.log(`url LISTAR TAREAS  : ${urlListatareas}`);
    console.log(`id Procedimiento  : ${this.idprocedi}`);
    console.log(`id Procedimiento  : ${this.fasetramite}`);

    return this.http.get(urlListatareas).pipe(
      map(response => response as ListaTareaProcedi[])
    );

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
    this.expedientesService.getInteresadoListarDto(idexp).subscribe({
      next: (listarInteresados) => {
        this.listarinteresadosdto = listarInteresados;
      },
      error: (error) => {
        console.error('Error al obtener interesados:', error);
        this.listarinteresadosdto = [];
      }
    });
  }

  //-----------------------------------

  async cargarExpediente() {
    this.cargaFacade.cargarDesdeRuta(this.cargaHost(), this.activatedRoute);
  }

  public inicializarSourceListarNotifi() {
    this.sourceListarNotifi = buildNotificacionGridSourceFromLocal([], {
      withSort: false,
      withId: true,
    });
  }

  public actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]) {
    this.leernotificacion = leerNotificacion;
    this.sourceListarNotifi = buildNotificacionGridSourceFromLocal(leerNotificacion, {
      withSort: false,
      withId: true,
    });
  }

  public recargarSourceTramitadores() {
    this.tramitadoresFacade.refrescarGrid(this.tramitadoresHost());
  }

  public clickTramitadores(event: any) {
    const rowIndex = event.args.rowindex;
    setTimeout(() => this.marcarRadioButtonTramitador(rowIndex), 10);
    this.tramitadoresFacade.seleccionarTramitador(this.tramitadoresHost(), event.args.row.bounddata);
  }

  public fechaTramite!: string;
  public disabledArchivoTareaTramite: boolean = false;
  public plantillaDefecto!: string | null;
  veoAcciones: boolean = false;


  public clickTareProcedimiento(event: any) {
    this.veoAcciones = true;
    this.disabledArchivoTareaTramite = true;
    this.plantillaDefecto = normalizarPlantillaDefectoSeleccion(event.args.row.bounddata.plantillaDefecto);
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
    resetActionState(this as unknown as ResetActionStateHost);
  }

  public borraDatosNuevaTarea() {
    this.tareatramiteexpedientecrear = new TareaTramiteExpedienteCrear();
    this.tareatramiteexpedientecrear.tareaProcedimiento = -1;
    this.tareatramiteexpedientecrear.visible = true;
    this.tareatramiteexpedientecrear.fecInicio = new Date();
    this.tareatramiteexpedientecrear.fecContr = new Date();
    this.tareatramiteexpedientecrear.archivo = null;
    this.tareatramiteexpedientecrear.descripcion = '';
    this.tareatramiteexpedientecrear.firmante = null;
    this.tareatramiteexpedientecrear.propuestaResolucion = null;
    this.tareatramiteexpedientecrear.anexo = null;
    this.tareatramiteexpedientecrear.documAportada = null;
    this.tareatramiteexpedientecrear.tipoDocumEni = null;
    this.tareatramiteexpedientecrear.documentacion = null;

    // Limpiar archivo
    this.identificadorFicheroSubido = undefined;
    this.base64code = undefined;
    this.name = '';
    this.archivoSubidaEnProgreso = false;

    // Limpiar plantilla defecto
    this.plantillaDefecto = null;

    this.FechaSistema();
    this.resetActionState();

    // Cerrar el modal de manera segura si está abierto
    setTimeout(() => {
      this.cerrarModalNuevaTareaSeguro();
    }, 100);
  }


  // ACCIONES DE TAREA
  public acciones = ACCIONES;

  getAccionButtonText(): string {
    return getAccionButtonText(this.tareatramiteprocedimiento);
  }

  isDNIAction(): boolean {
    return isDNIAction(this.tareatramiteprocedimiento?.accion);
  }

  onConsultaAccionClick() {
    this.idListaTareaProcedimiento(this.tareatramiteexpedientecrear.tareaProcedimiento);

    if (this.isConsultaAccionRunning) {
      return;
    }

    if (!validarConsultaAccionClick(this)) {
      return;
    }

    this.isConsultaAccionRunning = true;
    this.tareasConsultaFacade.consultaAccion(this.consultaHost(), this.introValorConsulta, this.introTObjTrubu);
  }

  consultaAccion(valor: any, idtipobje: any): void {
    this.tareasConsultaFacade.consultaAccion(this.consultaHost(), valor, idtipobje);
  }

  public idListaTareaProcedimiento(selectedValue: any): void {
    this.tareasFacade.seleccionarTareaProcedimiento(this.tareaProcedimientoHost(), selectedValue);
  }

  veoDIVBorrarObjetoTRibu: boolean = true;

  /**
   * Configura la descripcion y el label segun el valor de data.accion.
   */
  private configurarAccionTarea(data: TareaProcedimientoDTO): void {
    configurarAccionTarea(this, data);
  }

  public darDeBajaObjeto(): void {
    this.objetoTributarioFacade.darDeBajaObjeto(this as any);
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
    return this.tareasConsultaFacade.loadRecibos(this.consultaHost());
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
    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata;

    setTimeout(() => this.marcarRadioButtonTramite(rowIndex), 10);

    const estado = calcularSeleccionTramite(rowData, (fecha) => this.formatearFechaParaInput(fecha));
    Object.assign(this, estado);
    this.editartramiteexp.fecTramite = estado.fecTramiteEdicion;

    this.getListaTareas().subscribe({
      next: (listaTareaProcedimiento) => (this.listatareaprocedi = listaTareaProcedimiento),
      error: (err: HttpErrorResponse) => {
        console.log('Error Listar Tarea Procedimientos: ' + err.error?.text);
      },
    });

    this.refrescoSourceTareasTramite(rowData.id);
    this.getnotificacionListar();
  }

  public marcarRadioButtonTramite(rowIndex: number) {
    marcarRadioButtonGrid('RadioTramite', rowIndex);
  }

  public marcarRadioButtonTarea(rowIndex: number) {
    marcarRadioButtonGrid('TareasTramite', rowIndex);
  }

  public marcarRadioButtonTramitador(rowIndex: number) {
    marcarRadioButtonGrid('RadioTramitador', rowIndex);
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

    let recorteFecha: string = fecha.toString().substr(0, 10);
    let anio: string = fecha.toString().substring(0, 4);
    let mes: string = fecha.toString().substring(5, 7);
    let dia: string = fecha.toString().substring(8, 10);
    let fechaordenada: string = dia + "-" + mes + "-" + anio;
    this.fechametadatabuena = fechaordenada;

    let recorteHora: string = fecha.toString().substring(12, 14);
    let reverse: string = (recorteFecha)

    console.log("FECHA CAPTURA ++++++++++++++++++ : " + fecha);
    console.log("FECHa recortada ++++++++++++++++++ : " + fechaordenada);


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
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      abrirModalEditarTareaTramite(this, rowData);
    });
  }

  public clicktareaNueva(event: any) {
    const rowIndex = event.args.rowindex;
    this.marcarRadioButtonTarea(rowIndex);

    GridRadioSelector.handleRowClick(event, 'TareasTramite', (rowData) => {
      aplicarSeleccionTareaNueva(
        this.seleccionTareaHost(),
        rowData,
        this.expedientesService,
        {
          cargaHistorico: (id) => this.cargaHistorico(id),
          getTramiteProcedimientoVer: (id) => this.getTramiteProcedimientoVer(id),
          getListaTareas: () => this.getListaTareas(),
          leoMetadatos: (archivo) => this.leoMetadatos(archivo),
          gettipofirma: () => this.gettipofirma(),
          getTemaDocumentoListar: () => this.getTemaDocumentoListar(),
          getUsuarioListar: (id) => this.getUsuarioListar(id),
        },
      );
    });
  }


  public previoGenerarSalida() {

    if (this.nunRegisTarea) {
      return `<div style="text-align: center; margin-top: 5px;">` + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + '</div>';
    }
  }


  public clicktarea(id: number, codArchivo, tareaProcedi: number) {
    console.log(`ID TAREA: ${id}`);
    this.idTarea = id;
    this.numeroArchivo = codArchivo;
    this.tareaProcedi = tareaProcedi;
    this.getUsuarioListar(tareaProcedi);

    this.ejerNumExpedi = `${this.verExpediente.ejercicio}/${this.verExpediente.numero}`;

    console.log(`ID ARCHIVO: ${this.numeroArchivo}`);
    console.log(`ID TAREA PROCEDI: ${this.tareaProcedi}`);
    this.getTemaDocumentoListar();
    this.expedientesService.getTareaTramiteExpVer(id).subscribe(
      tareatramiteexpedientever => this.tareatramiteexpedientever = tareatramiteexpedientever
    );
    this.descargafichero = `${environment.apiUrl}archivo/descarga/${this.numeroArchivo}`; // Reemplaza con la URL del archivo que deseas descargar
    for (let index = 0; index < this.tareatramiteexpedientelistar.length; index++) {
      const datos = this.tareatramiteexpedientelistar[index].fecInicio;
    }
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
    this.dniok = false;
    this.verTareasdelTramite = true;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = true;
    this.verEditartareatramite = false;
    this.verNuevaNotifi = false;
    this.verGenerarSalida = false;
    this.borraDatosCrearNotifi()
  }

  public clickAtrasGenerarSalida() {
    this.verTareasdelTramite = true;
    this.verGenerarSalida = false;
    this.refrescoSourceTareasTramite(this.idTramite);
    this.limpiaGenerarSalida();

  }

  public clickGenerarSalida() {
    //this.verTareasdelTramite =false;
    //  this.verformnuevatarea =false;
    //  this.verlistadotramitadores = false;
    // this.nuevotramitador = false;
    // this.verlistadotareas = false;
    // this.verEditartareatramite = false;
    // this.verNuevaNotifi = false;
    // this.verGenerarSalida = true;
  }

  public clickNuevaNotificacion() {
    this.creanotificacion = crearNotificacionVacia({
      usuContrl: this.usuContrl!,
      ejercicioExpediente: this.verExpediente.ejercicio,
      numeroExpediente: this.verExpediente.numero,
      identificadorFicheroSubido: this.identificadorFicheroSubido,
      fechaActual: this.fecha,
    });
    this.textoFormaNotif = '';
    this.dniok = false;
    this.consultadni = nuevaConsultaDni();
    this.limpiarCacheValidacion();
  }


  public cambioYearEjercicio() {
    actualizarEjercicioDesdeFechaNotificacion(this.creanotificacion, this.fecha);
    this.limpiarCacheValidacion();
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
    aplicarClickNotificacionNuevo(this, event.args.row.bounddata);
    this.vernotifi(event.args.row.bounddata.idNotif, false);
  }

  // ============================================
  // NUEVA LÓGICA PARA CLICK SIMPLE Y DOBLE CLICK
  // ============================================

  /**
   * Maneja el click simple en una fila de notificaciones
   * Solo selecciona la fila y habilita los botones de acción
   */
  public onNotificacionClick(event: any) {
    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata;

    if (!rowData) {
      return;
    }

    actualizarCheckboxNotificaciones(rowIndex);
    this.habilitarBotonesNotificacion(rowData);
    this.fechNotifi = formatearFechaNotificacionSeleccionada(rowData.fecNotif);
  }

  /**
   * Maneja el doble click en una fila de notificaciones
   * Abre el modal en modo edición
   */
  public onNotificacionDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      const idNotificacion = rowData.idNotif;
      // Abrir modal en modo edición
      this.editarNotificacion(idNotificacion);
    });
  }



  /**
   * Habilita los botones de acción según el estado de la notificación
   */
  habilitarBotonesNotificacion(rowData: any) {
    Object.assign(this, calcularSeleccionNotificacion(rowData));
    this.notificacionesFacade.cargarEnvioNotificaActivo(this.idNotificacion, (envio) => {
      this.envioNotifica = envio;
    });
  }

  // ============================================
  // FIN NUEVA LÓGICA
  // ============================================

  // ============================================
  // EJEMPLO DE IMPLEMENTACIÓN PARA OTRAS TABLAS
  // ============================================

  /**
   * Ejemplo: Maneja el click simple en una fila de trámites
   * Solo selecciona la fila
   */
  public onTramiteClick(event: any) {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTramite"]', (rowData) => {
      // Lógica específica para trámites
    });
  }

  /**
   * Ejemplo: Maneja el doble click en una fila de trámites
   * Abre el modal de edición
   */
  public onTramiteDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      aplicarEdicionTramiteDesdeFila(this, rowData);
      this.modalManagerService.openModal('editarTramiteModal');
    });
  }

  public onTramitadorDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos del tramitador para edición
      this.idTramitador = rowData.id;
      
      // Mostrar información del tramitador seleccionado
      this.notificationService.info(`Tramitador seleccionado: ${rowData.nombre || 'Sin nombre'}`);
      
      // TODO: Añadir lógica para abrir el modal de edición de tramitador
      console.log('Datos del tramitador seleccionado:', rowData);
    });
  }

  /**
   * Ejemplo: Maneja el click simple en una fila de tareas
   * Solo selecciona la fila
   */
  public onTareaClick(event: any) {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTareasTramite"]', (rowData) => {
      // Aquí puedes agregar lógica específica para tareas
      console.log('Tarea seleccionada:', rowData);
    });
  }

  public onTareaDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      this.clicktarea(rowData.id, rowData.codArchivo, rowData.tareaProcedi);
    });
  }

  public fechaordenadafenvio: any;
  public fechaordenadafrecep: any;
  public fechaordenadafpubli: any;
  public fechaordenadafemision: any;

  public fechasNotifi(fenvio: any, frecep: any, fpubli: any, femision: any) {
    Object.assign(this, calcularFechasNotificacion(fenvio, frecep, fpubli, femision));
  }

  public vertramite: boolean = true;
  public botonVerNotifi: boolean = true;

  public cancelarnuevotramite() {
    this.nuevotramite = false;
    this.limpiarFormularioTramite();
    this.FechaSistema();
  }

  public limpiarFormularioTramite() {
    this.creartramiteexp = crearTramiteExpVacio();
    this.nuevotramite = false;
  }

  public enviandoTramite: boolean = false;
  public veoTramitadores: boolean = false;

  public veotramitadores() {
    aplicarVistaTramitadores(this);
  }

  public verNotificaciones() {
    aplicarVistaNotificaciones(this, (ejercicio, numero) =>
      this.notificacionesFacade.createGridAdapter(ejercicio, numero),
    );
  }

  public leoMetadatos(codfiche: number) {

    this.expedientesService.getMetadatosVer(codfiche).subscribe(
      vermetadatos => this.vermetadatos = vermetadatos
    );


  }

  public noverNotificaciones() {
    aplicarVistaTramite(this);
  }

  // ----------------------------------
  //  Seccion de Notificaciones :
  //------------------------------------

  /*** consultas para  formulario de creacion de notificaciones de expedientes*/
  public listadodeNotificaciones() {
    this.notificacionesFacade.loadCatalogos(this);
  }

  private readonly teuHost = () => this as unknown as EditaExpedienteTeuHost;
  private readonly notifCrudHost = () => this as unknown as EditaExpedienteNotificacionesCrudHost;
  private readonly tareasHost = () => this as unknown as EditaExpedienteTareasHost;
  private readonly tramitesHost = () => this as unknown as EditaExpedienteTramitesHost;
  private readonly tramitadoresHost = () => this as unknown as EditaExpedienteTramitadoresHost;
  private readonly tareaProcedimientoHost = () => this as unknown as TareaProcedimientoHost;
  private readonly consultaHost = () => this as unknown as ConsultaAccionHost;
  private readonly interesadosHost = () => this as unknown as EditaExpedienteInteresadosHost;
  private readonly bolsaHost = () => this as unknown as EditaExpedienteBolsaHost;
  private readonly salidaHost = () => this as unknown as EditaExpedienteSalidaHost;
  private readonly bootstrapModalesHost = () => this as unknown as BootstrapModalesHost;
  private readonly cargaHost = () => this as unknown as EditaExpedienteCargaHost;
  private readonly firmaHost = () => this as unknown as FirmaTareaHost;
  private readonly seleccionTareaHost = () => this as unknown as SeleccionTareaNuevaHost;
  private readonly initHost = () => this as unknown as EditaExpedienteInitHost;

  public crearModeloTeuFichero() {
    this.teuFacade.crearModeloTeuFichero(this.teuHost());
  }

  public actualizarSourceNotificaciones(): void {
    const host: ActualizarGridNotificacionesHost = {
      verExpediente: this.verExpediente,
      sourceListarNotifi: this.sourceListarNotifi,
      idNotificacion: this.idNotificacion,
      gridNotificaciones: this.gridNotificaciones,
      cdr: this.cdr,
      habilitarBotonesNotificacion: (rowData) => this.habilitarBotonesNotificacion(rowData),
    };
    actualizarSourceNotificacionesGrid(host, this.notificacionesFacade);
    this.sourceListarNotifi = host.sourceListarNotifi;
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
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecSolic);
  }

  public isFechaGenerInvalid(): boolean {
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecGener);
  }

  public isFechaFirmaInvalid(): boolean {
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecFirma);
  }

  public getnotificacionListar() {
    const { ejercicio, numero } = this.verExpediente;
    if (!ejercicio || !numero) {
      return;
    }

    this.notificacionesService.getNotificacionListar(ejercicio, numero).subscribe({
      next: (leernotificacion) => this.actualizarGridNotificaciones(leernotificacion ?? []),
      error: () => this.actualizarGridNotificaciones([]),
    });
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

  // Método para manejar el cambio de estado de la notificación
  public onCambioEstadoNotificacion(event: any) {
    const nuevoEstado = Number(event.target.value);
    console.log('Cambio de estado de notificación:', nuevoEstado);

    // Solo limpiar errores visuales, NO modificar los datos hasta que se guarden
    this.limpiarErroresVisuales();

    // Nota: Los cambios en los campos se aplicarán solo cuando se guarde la notificación
    // No modificamos this.creanotificacion aquí para evitar cambios visuales inmediatos
  }

  // Método para manejar cambios en la fecha de envío
  public onFechaEnvioChange(event: any) {
    asignarFechaCampoNotificacion(this.creanotificacion, 'fecEnvio', event.target.value);
  }

  public onFechaRecNotifChange(event: any) {
    asignarFechaCampoNotificacion(this.creanotificacion, 'fecRecNotif', event.target.value);
  }

  public onFechaRegistSalidChange(event: any) {
    asignarFechaCampoNotificacion(this.creanotificacion, 'fecRegistSalid', event.target.value);
  }

  public onFechaPubBopChange(event: any) {
    asignarFechaCampoNotificacion(this.creanotificacion, 'fecPubBop', event.target.value);
  }

  // Método para limpiar errores visuales
  public limpiarErroresVisuales() {
    limpiarErroresVisualesNotificacion();
  }

  public cerrarModalNotificacion() {
    try {
      cerrarModalVerNotificacion(() => resetEdicionNotificacion(this));
    } catch {
      this.modalManagerService.closeModal('verNotifiModal');
      resetEdicionNotificacion(this);
    }
  }

  public abrirModalEnvioTeu(): void {
    this.inicializarFormularioTEU();
    this.abrirModal('EnvioTeu');
  }

  public abrirModalEnviarNotificacion() {
    this.vernotifi(this.idNotificacion, false).then(() => abrirModalEnvioNotificacion());
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
    // Limpiar los datos del formulario
    this.creanotificacion = new CrearNotificacion();

    // También limpiar el estado del modal si es necesario
    this.limpiarEstadoModalError();
  }

  async vernotifi(id: number, modoVer = false): Promise<void> {
    return this.notificacionesCrudFacade.vernotifi(this.notifCrudHost(), id, modoVer);
  }

  private limpiarEstadoModalNotificacion() {
    limpiarModalNotificacionDom();
  }

  public verNotificacion(id: number) {
    this.limpiarEstadoModalNotificacion();
    this.idNotificacion = id;
    this.modoVerNotificacion = true;
    this.vernotifi(id, true);
    abrirModalVerNotificacion();
  }

  public editarNotificacion(id: number) {
    this.limpiarEstadoModalNotificacion();
    this.vernotifi(id, false);
    abrirModalVerNotificacion();
  }

  // ----------------------------------
  //  Fin de la Seccion de Notificaciones
  //------------------------------------


  public fecLimite!: Date;

  public fechamas15() {
    const limite = calcularFechaLimiteDesdePublicacion(this.creanotificacion.fecPubBop);
    if (limite) {
      this.fecLimite = limite;
    }
  }

  public borrarDatosPublicacion() {
    this.creanotificacion = new CrearNotificacion();
  }

  public borraDatosenviarNotifi() {
    this.creanotificacion = new CrearNotificacion();

  }

  public borraDatosRecepcion() {
    this.creanotificacion = new CrearNotificacion()
  }


  public CierraPopup() {
    this.cerrarModal('CrearNotificacionModal');
  }

  public formanotificacion: boolean = false

  // Método para inicializar la fecha de notificación
  public inicializarFechaNotificacion() {
    const hoy = new Date();
    this.creanotificacion.fecNotif = hoy;
  }

  // Propiedades privadas para cachear la validación
  private _formularioValido: boolean = false;
  private _ultimaValidacion: any = null;

  // Getter público que cachea el resultado de la validación
  public get formularioNotificacionValido(): boolean {
    // Crear un objeto con los valores actuales para comparar
    const valoresActuales = {
      fecha: this.creanotificacion?.fecNotif,
      dni: this.creanotificacion?.dni,
      observacion: this.creanotificacion?.observacion,
      idTarea: this.idTarea,
      interesadosLength: this.listarinteresadosdto?.length || 0
    };

    // Solo recalcular si los valores han cambiado
    if (JSON.stringify(valoresActuales) !== JSON.stringify(this._ultimaValidacion)) {
      this._ultimaValidacion = valoresActuales;
      this._formularioValido = this.validarFormularioNotificacion();
    }

    return this._formularioValido;
  }

  // Método público para validar si el formulario está completo (usado internamente)
  public validarFormularioNotificacion(): boolean {
    return validarFormularioCreacionNotificacion({
      creanotificacion: this.creanotificacion,
      idTarea: this.idTarea,
      interesados: this.listarinteresadosdto,
    });
  }

  // Método para limpiar el cache de validación cuando sea necesario
  public limpiarCacheValidacion(): void {
    this._ultimaValidacion = null;
    this._formularioValido = false;
  }



  // Método para cargar datos del interesado seleccionado
  public cargarDatosInteresado(dni: string) {
    cargarDatosInteresadoNotificacion(this, dni);
    if (dni) {
      this.solicitadni(dni);
    }
    this.limpiarCacheValidacion();
  }

  public crearnotificacion() {
    this.notificacionesCrudFacade.solicitarCreacionNotificacion(
      this.notifCrudHost() as unknown as SolicitarCrearNotificacionHost,
    );
  }

  private crearNotificacionConfirmada() {
    this.notificacionesCrudFacade.crearNotificacionConfirmada(this.notifCrudHost() as any);
  }

  // Método para limpiar el formulario de notificación
  public limpiarFormularioNotificacion() {
    this.creanotificacion = new CrearNotificacion();
    this.textoFormaNotif = '';
    this.inicializarFechaNotificacion();
  }

  // Método para cerrar el modal de crear notificación
  public cerrarModalCrearNotificacion() {
    cerrarModalCrearNotificacionDom(
      () => this.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => this.cerrarModal(modalId),
    );
  }

  public onModalHidden() {
    onModalHiddenBootstrap(() => this.cdr.detectChanges());
  }

  public limpiarEstadoModalError() {
    limpiarEstadoModalCrearNotificacion(
      () => this.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => this.cerrarModal(modalId),
    );
  }

  public spinnervisiblefirma: boolean = true;

  public abreArchivo() {
    abrirArchivoTarea(this);
  }

  public descargaArchiFirmado!: any;

  async abreArchiFirmado() {
    this.descargaArchiFirmado = abrirInformeFirma(this);
  }

  editExpediente() {

    console.log("FORNOTIF : " + this.editexpediente.forNotif);

    this.expedientesService.editarExpediente(this.editexpediente, this.idExpediente).subscribe(response => this.router.navigate([`/editaexpediente/${this.idExpediente}`]));
    setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo

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
    this.nuevotramite = true;
    this.verTareasdelTramite = false;
    aplicarFechaTramitePorDefecto(this.creartramiteexp);
  }

  public validateAndCreateTramite(event: Event): void {
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields();
      return;
    }
    this.creaTramExp();
  }

  public validateAndEditTramite(event: Event): void {
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields();
      return;
    }
    this.editarTramiteExpediente();
  }

  public limpiarErroresTramite(): void {
    limpiarErroresFormularioTramite('formNuevoTramite', true);
  }

  public limpiarErroresEditarTramite(): void {
    limpiarErroresFormularioTramite('formEditarTramite');
  }

  recargarpagina() {
    window.location.reload();

  }


  // PARA NUEVOS FILTROS JQX

  public cellclick = editaExpedienteGridRenderers.cellclick;
  public columnrenderer = editaExpedienteGridRenderers.columnrenderer;
  public columnrendererDescarga = editaExpedienteGridRenderers.columnrendererDescarga;
  public columnseleccion = editaExpedienteGridRenderers.columnseleccionTramite as any;
  public columnseleccionTareaProcedi = editaExpedienteGridRenderers.columnseleccionTareaProcedi;
  public columnseleccionDEscargaHistorico = editaExpedienteGridRenderers.columnseleccionDescargaHistorico;

  public columnseleccionTareaTramite = GridRadioSelector.createRadioRenderer('TareasTramite', 'Selecciona Tarea del Trámite', true);

  public columnseleccionListarNotifi = notificacionesGridRenderers.columnseleccionListarNotifi as any;
  public cellsrendererListarNotifi = notificacionesGridRenderers.cellsrendererListarNotifi;
  public cellsrendererListarNotifiSituacionSimple = notificacionesGridRenderers.cellsrendererListarNotifiSituacionSimple;
  public cellsrendererListarNotifiBOPSimple = notificacionesGridRenderers.cellsrendererListarNotifiBOPSimple;
  public cellsrendererListarNotifiSituacion = notificacionesGridRenderers.cellsrendererListarNotifiSituacion;
  public cellsrendererListarNotifiBOP = notificacionesGridRenderers.cellsrendererListarNotifiBOP;
  public cellsrendererFechaListarNotifi = notificacionesGridRenderers.cellsrendererFechaListarNotifi;
  public cellsrendererAccionesNotificacion = notificacionesGridRenderers.cellsrendererAccionesNotificacion;

  public cellsrendererTramiteTarea = editaExpedienteGridRenderers.cellsrendererTramiteTarea;
  public cellsrenderer = editaExpedienteGridRenderers.cellsrendererCentrado;
  public cellsrendererTRamitadores = editaExpedienteGridRenderers.cellsrendererTramitadores;
  public cellsrendererTRamitadoresPosesion = editaExpedienteGridRenderers.cellsrendererTramitadoresPosesion;
  public cellsrendererPlazo = createPlazoRenderer(() => this.FecIniTarea);
  public cellsrendererTramite = editaExpedienteGridRenderers.cellsrendererTramite;

  public nombreApe = '';
  public cellsrendererNotiDNI = createNotiDniRenderer((nombre) => { this.nombreApe = nombre; });
  public cellsrendererNotiNombre = createNotiNombreRenderer(() => this.nombreApe);

  public descripTarea!: string;
  public cellsrendererDEscripTareas = createDescripcionTareasRenderer((value) => {
    this.descripTarea = String(value ?? '');
  });

  public cellsrendererContieneArchivo = editaExpedienteGridRenderers.cellsrendererContieneArchivo;
  public cellsrendererArchivo = editaExpedienteGridRenderers.cellsrendererArchivo;
  public cellsrendererColor = editaExpedienteGridRenderers.cellsrendererColor;
  public cellsrendererFecha = editaExpedienteGridRenderers.cellsrendererFecha;
  public cellsrendererFechaHistorico = editaExpedienteGridRenderers.cellsrendererFechaHistorico;
  public cellsrendererFechaPlazo = editaExpedienteGridRenderers.cellsrendererFechaPlazo;
  public cellsrendererFechaTRamitadores = editaExpedienteGridRenderers.cellsrendererFechaTramitadores;


  columnsTramite = createColumnsTramite({
    columnseleccion: this.columnseleccion,
    columnrenderer: this.columnrenderer,
    cellsrenderer: this.cellsrenderer,
    cellsrendererDEscripTareas: this.cellsrendererDEscripTareas,
    cellsrendererTramite: this.cellsrendererTramite,
    cellsrendererFecha: this.cellsrendererFecha,
  });
  public localizationObject: any = jqxGrid_ES;

  sourceTramite = createTramiteGridAdapter(this.idExpediente);

  columnsTareasTramite = createColumnsTareasTramite({
    columnseleccionTareaTramite: this.columnseleccionTareaTramite,
    columnrenderer: this.columnrenderer,
    columnrendererDescarga: this.columnrendererDescarga,
    cellsrendererTramiteTarea: this.cellsrendererTramiteTarea,
    cellsrendererFecha: this.cellsrendererFecha,
    cellsrendererFechaPlazo: this.cellsrendererFechaPlazo,
    cellsrendererColor: this.cellsrendererColor,
    cellsrendererContieneArchivo: this.cellsrendererContieneArchivo,
    cellsrendererArchivo: this.cellsrendererArchivo,
    cellsrendererPlazo: this.cellsrendererPlazo,
  });
  sourceTareasTramite = createTareaGridAdapter(0);

  public refrescoSourceTramite() {
    this.tramitesFacade.refrescarGrid(this.tramitesHost());
  }

  public refrescoSourceTareasTramite(id: any) {
    this.tareasFacade.refrescarGrid(this.tareasHost(), Number(id));
  }


  columnsListarNotifi = createColumnsListarNotifi({
    columnseleccionListarNotifi: this.columnseleccionListarNotifi,
    columnrenderer: this.columnrenderer,
    columnrendererDescarga: this.columnrendererDescarga,
    cellsrendererListarNotifi: this.cellsrendererListarNotifi,
    cellsrendererFechaListarNotifi: this.cellsrendererFechaListarNotifi,
    cellsrendererListarNotifiSituacionSimple: this.cellsrendererListarNotifiSituacionSimple,
    cellsrendererListarNotifiBOPSimple: this.cellsrendererListarNotifiBOPSimple,
    cellsrendererNotiDNI: this.cellsrendererNotiDNI,
    cellsrendererNotiNombre: this.cellsrendererNotiNombre,
    cellsrendererAccionesNotificacion: this.cellsrendererAccionesNotificacion,
  });

  sourceListarNotifi = createNotificacionGridAdapter(0, 0);

  public veonotificaciones: boolean = false;
  public modoVerNotificacion: boolean = false;

  columnsTramitadores = createColumnsTramitadores({
    columnrenderer: this.columnrenderer,
    cellsrendererTRamitadores: this.cellsrendererTRamitadores,
    cellsrendererFechaTRamitadores: this.cellsrendererFechaTRamitadores,
    cellsrendererTRamitadoresPosesion: this.cellsrendererTRamitadoresPosesion,
  });
  sourceTramitadores = createTramitadorGridAdapter(this.idExpediente);

  columnsTareasProcedi = createColumnsTareasProcedi({
    columnseleccionTareaProcedi: this.columnseleccionTareaProcedi,
    columnrenderer: this.columnrenderer,
    cellsrendererTRamitadores: this.cellsrendererTRamitadores,
  });

  sourceTareasProcedi: unknown = null;


  public refresSourceListarNotifi() {
    this.sourceListarNotifi = this.notificacionesFacade.createGridSource(
      this.verExpediente.ejercicio,
      this.verExpediente.numero,
      { withSort: false },
    );
  }

  public refresSourceListarNotifiPRE() {
    this.sourceListarNotifi = this.notificacionesFacade.createGridSource(
      this.verExpediente.ejercicio,
      this.verExpediente.numero,
      { withSort: false, withId: true },
    );
  }


  public vacio() {
    console.log(`${environment.apiUrl}tramite/listar/${this.idExpediente}`);

  }


  columnsHistorico = createColumnsHistorico({
    columnseleccionTareaProcedi: this.columnseleccionTareaProcedi,
    columnseleccionDEscargaHistorico: this.columnseleccionDEscargaHistorico,
    columnrenderer: this.columnrenderer,
    cellsrendererTRamitadores: this.cellsrendererTRamitadores,
    cellsrendererFechaHistorico: this.cellsrendererFechaHistorico,
  });

  sourceHistorico = createHistoricoGridAdapter(this.idTarea);

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
    this.bootstrapModalesFacade.abrirModalGenerarEntrada(() => {
      this.showGenerarEntrada = true;
    });
  }

  closeGenerarEntradaModal(): void {
    this.bootstrapModalesFacade.cerrarModalGenerarEntrada(() => {
      this.showGenerarEntrada = false;
    });
  }

  showObjetoTributarioModal(): void {
    this.bootstrapModalesFacade.abrirModalObjetoTributario();
  }

  /**
   * Método para validar formularios antes de enviar
   */
  public validateAndSubmit(event: Event, formId: string, submitFunction: () => void): void {
    event.preventDefault();
    
    const form = document.getElementById(formId) as HTMLFormElement;
    if (form && form.checkValidity()) {
      submitFunction();
    } else {
      this.notificationService.incompleteFields();
      form?.classList.add('was-validated');
    }
  }

  /**
   * Método para manejar errores de validación
   */
  public handleValidationError(fieldName: string): void {
    this.notificationService.validationError(fieldName);
  }

  /**
   * Método para confirmar eliminación usando NotificationService
   */
  public confirmDelete(itemName: string, deleteFunction: () => void): void {
    this.notificationService.confirmDelete(itemName).then((result) => {
      if (result.isConfirmed) {
        deleteFunction();
      }
    });
  }

  /**
   * Método para mostrar advertencias
   */
  public showWarning(message: string): void {
    this.notificationService.warning(message);
  }

  /**
   * Método para mostrar información
   */
  public showInfo(message: string): void {
    this.notificationService.info(message);
  }

  /**
   * Convierte una fecha en formato ISO o string a formato YYYY-MM-DD para inputs de fecha
   * @param fecha Fecha en cualquier formato válido
   * @returns Fecha en formato YYYY-MM-DD o string vacío si no hay fecha
   */
  public formatearFechaParaInput(fecha: any): string {
    if (!fecha) {
      return '';
    }
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return '';
      }
      return fechaObj.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error al formatear fecha:', error);
      return '';
    }
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
    this.router.navigate(['/expedientes']);
  }
}
