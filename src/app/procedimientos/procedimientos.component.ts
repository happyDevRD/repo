import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  AtributosCrear,
  CreaPermisoProcedi,
  CrearProcedi,
  CreaTareaProcedi,
  EditarProcedi,
  EditaTareaProcedi,
  ListaTareaProcedi,
  MateriaProcedimiento,
  PermisProcedi,
  PlantillaTarea,
  Procedimiento,
  ProcediPermisos
} from './procedimiento';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { ACCIONES } from "../core/helper/tarea-acciones";
import { ReciboCabeceraDto } from "../core/models/recibo-cabecera.dto";
import * as bootstrap from 'bootstrap';
import { ProcedimientoService } from "./procedimiento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ModalService } from "../core/service/modal.service";
import { TablaClickHandler } from "../core/helper/tabla-click-handler";
import { GridRadioSelector } from "../core/helper/grid-radio-selector";
import { NotificationService } from "../core/service/notification.service";
import { ModalManagerService } from "../core/service/modal-manager.service";
import { ProcedimientoUiService } from './procedimiento-ui.service';
import { UserSessionService } from '../core/service/user-session.service';
import { Subscription } from 'rxjs';
import {
  FirmaListar,
  PermisoProcediCreado,
  ProcedimientoWorkspaceTab,
  RespuestasHttp,
  TareaProcediCreada,
} from './models/procedimientos-internal.models';
import {
  applyTipoAtributo,
  TIPO_ATRIBUTO_OPTIONS,
  toggleRequeridoAtributo,
} from './helpers/procedimientos-atributos.helper';
import { ProcedimientosWorkspaceFacade } from './services/procedimientos-workspace.facade';
import {
  buildColumnsAtributos,
  buildColumnsPermi,
  buildColumnsPro,
  buildColumnsTarea,
  createProcedimientosGridRenderers,
} from './config/procedimientos-grid.config';
import { ProcedimientosGridFacade } from './services/procedimientos-grid.facade';
import { ProcedimientosAtributosFacade } from './services/procedimientos-atributos.facade';
import { ProcedimientosProcedimientoFacade } from './services/procedimientos-procedimiento.facade';
import { ProcedimientosTareasFacade } from './services/procedimientos-tareas.facade';
import { ProcedimientosPermisosFacade } from './services/procedimientos-permisos.facade';
import { validateBootstrapForm } from '../core/helper/bootstrap-form.helper';
import { populateAtributoFromRow } from './helpers/procedimientos-atributos-row.helper';
import { applyTareaGridSelection, populateTareaEditForm } from './helpers/procedimientos-tarea-row.helper';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css'],
  providers: [
    ProcedimientosWorkspaceFacade,
    ProcedimientosGridFacade,
    ProcedimientosAtributosFacade,
    ProcedimientosProcedimientoFacade,
    ProcedimientosTareasFacade,
    ProcedimientosPermisosFacade,
  ],
})
export class ProcedimientosComponent implements OnDestroy {
  // Referencias a los grids
  @ViewChild('gridProcedimientos') gridProcedimientos: any;
  @ViewChild('gridTareas') gridTareas: any;
  @ViewChild('gridPermisos') gridPermisos: any;
  @ViewChild('gridAtributos') gridAtributos: any;

  public headers = new HttpResponse;
  public edicion: boolean = false;
  public idver!: number;
  public procedimiento: Procedimiento = new Procedimiento();
  public respuestahttp: any = new RespuestasHttp;
  public respuesta = new Response;
  public vermenu: boolean = false; // para ver el menu tiene que cambiar a true
  public editarprocedi: EditarProcedi = new EditarProcedi();
  public atributoscrear: AtributosCrear = new AtributosCrear();
  public firmaT!: string;

  get nivAcces(): string | null {
    return this.session.nivAcces;
  }

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get departamento(): string | null {
    return this.session.department;
  }

  get idpermis(): string | null {
    return this.session.idPermiso;
  }

  get userctrl(): string | null {
    return this.session.user;
  }

  public editatareaprocedi: any = new EditaTareaProcedi();
  public documentoInput: string = "";
  public idExpediente: number = 0;

  public solicitadni(dni: string) {
    this.documentoInput = dni; // Store the input value
  }

  // ACCIONES DE TAREA
  public acciones = ACCIONES;
  acciondefecto = this.acciones[0].valor;

  public crearprocedi: CrearProcedi = new CrearProcedi();
  private nuevoProcedimientoSub?: Subscription;
  private routeParamsSub?: Subscription;
  private routeQuerySub?: Subscription;
  public isWorkspaceMode = false;
  public activeWorkspaceTab: ProcedimientoWorkspaceTab = 'datos';
  materiaprocedimiento!: MateriaProcedimiento[];
  procedimientos!: Procedimiento[];
  permisprocedi!: PermisProcedi[];

  // Datos para la paginación sin uso
  public page!: number;

  public npagina: number = 4;

  // GESTIÓN DE ATRIBUTOS DE TAREAS

  // Variables para atributos de tareas
  public tipoAtributo = TIPO_ATRIBUTO_OPTIONS;

  public maximoCaracAtributos: number;
  public tipocaracteresAtributos: string;
  public disabledAtrib = false;

  public asociaEtiquetaAtributosEditar(valor: number): void {
    applyTipoAtributo(this, valor);
  }

  public asociaEtiquetaAtributos(valor: number): void {
    applyTipoAtributo(this, valor);
  }

  public requerido(valor: unknown): void {
    toggleRequeridoAtributo(this.atributoscrear, valor);
  }

  constructor(
    public procedimientoService: ProcedimientoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public _location: Location,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    private procedimientoUi: ProcedimientoUiService,
    public session: UserSessionService,
    private workspaceFacade: ProcedimientosWorkspaceFacade,
    private gridFacade: ProcedimientosGridFacade,
    private atributosFacade: ProcedimientosAtributosFacade,
    private procedimientoFacade: ProcedimientosProcedimientoFacade,
    private tareasFacade: ProcedimientosTareasFacade,
    private permisosFacade: ProcedimientosPermisosFacade,
  ) {
    this.refresco = this._location.getState();
    this.gridFacade.initGridSources(this);
  }

  ngOnInit(): void {
    this.procedimientoService.getMateriaProcedi().subscribe(
      materiaprocedimiento => this.materiaprocedimiento = materiaprocedimiento
    );
    this.procedimientoService.getPermisoProcedi().subscribe(
      procedipermisos => this.procedipermiso = procedipermisos
    );
    this.procedimientoService.getPlantillaTareas().subscribe(
      plantillatarea => this.plantillatarea = plantillatarea
    );
    if (this.nivAcces === '6' || this.session.canManageProcedimientos) {
      this.procedimientoService.getProcedimientos().subscribe(
        procedimientos => this.procedimientos = procedimientos
      );
    }
    this.nuevoProcedimientoSub = this.procedimientoUi.onOpenNuevoProcedimiento.subscribe(() => {
      setTimeout(() => this.abrirNuevoProcedimientoModal(), 0);
    });

    if (this.procedimientoUi.consumePendingOpen()) {
      setTimeout(() => this.abrirNuevoProcedimientoModal(), 0);
    }

    this.routeParamsSub = this.activatedRoute.params.subscribe(params => {
      const rawId = params['id'];
      if (rawId) {
        this.isWorkspaceMode = true;
        this.loadWorkspace(+rawId);
        return;
      }
      this.isWorkspaceMode = false;
      this.resetWorkspaceState();
    });

    this.routeQuerySub = this.activatedRoute.queryParams.subscribe(query => {
      const tab = query['tab'] as ProcedimientoWorkspaceTab | undefined;
      if (tab && ['datos', 'tareas', 'permisos', 'atributos'].includes(tab)) {
        this.activeWorkspaceTab = tab;
      }
    });
  }

  ngOnDestroy(): void {
    this.nuevoProcedimientoSub?.unsubscribe();
    this.routeParamsSub?.unsubscribe();
    this.routeQuerySub?.unsubscribe();
  }

  public setWorkspaceTab(tab: ProcedimientoWorkspaceTab): void {
    this.workspaceFacade.setWorkspaceTab(this, tab);
  }

  public volverAlListado(): void {
    this.workspaceFacade.volverAlListado();
  }

  public getModalidadLabel(): string {
    return this.workspaceFacade.getModalidadLabel(this.modalidad);
  }

  public getMateriaLabel(): string {
    return this.workspaceFacade.getMateriaLabel(this.materia, this.editarprocedi, this.materiaprocedimiento);
  }

  private resetWorkspaceState(): void {
    this.workspaceFacade.resetWorkspaceFlags(this);
  }

  public loadWorkspace(id: number): void {
    this.workspaceFacade.loadWorkspace(this, id);
  }

  public abrirOffcanvas(offcanvasId: string): void {
    const element = document.getElementById(offcanvasId);
    if (!element) {
      return;
    }
    const instance = bootstrap.Offcanvas.getOrCreateInstance(element);
    instance.show();
  }

  public cerrarOffcanvas(offcanvasId: string): void {
    const element = document.getElementById(offcanvasId);
    if (!element) {
      return;
    }
    const instance = bootstrap.Offcanvas.getInstance(element);
    instance?.hide();
  }

  public prepararFormularioNuevoProcedimiento(): void {
    this.crearprocedi = new CrearProcedi();
    this.crearprocedi.depart = this.session.idOrgEleme ?? '';
  }

  public abrirNuevoProcedimientoModal(): void {
    this.prepararFormularioNuevoProcedimiento();
    this.abrirModal('NprocediModal');
    setTimeout(() => this.prepararFormularioNuevoProcedimiento(), 0);
  }

  public idAtrib: any;
  public idGrupo: any;
  public etiGruAtrib;
  public desGruAtrib;
  public valInici;
  public valMinim;
  public valMaxim;
  public longitud;


  public veoborraratributo: boolean = false;
  public EtiquetaatributosActual: any;
  public Requerido: any;


  public marcoAtributos(event: any): void {
    GridRadioSelector.handleRowClick(event, 'Atributos', (rowData) => {
      populateAtributoFromRow(this, rowData);
    });
  }

  public deleteatributo(): void {
    this.atributosFacade.eliminar(this);
  }

  public nuevaetiqueta: string;

  public validateAndEditAtributo(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.atributosFacade.editar(this);
  }

  public editoAtributo(): void {
    this.atributosFacade.editar(this);
  }

  public limpioAtributosformulario(): void {
    this.atributosFacade.limpiarAtributos(this);
  }

  public validateAndCreateAtributo(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.atributosFacade.crear(this);
  }

  public creoAtributo(): void {
    this.atributosFacade.crear(this);
  }

  public refrescaProcedimientos() {
    if (this.isWorkspaceMode) {
      return;
    }

    this.veoeliminaProcedimiento = false;
    this.veoTarea = false;
    this.veoPermiso = false;
    this.veoAtributos = false;
    this.gridFacade.refreshProcedimientosList(this);
  }



  public validateAndEditProcedimiento(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.procedimientoFacade.editar(this);
  }

  public editaProcedi(): void {
    this.procedimientoFacade.editar(this);
  }

  //---------------------Eleazar
  lanzaSourcePermi(id: any) {
    this.gridFacade.lanzaSourcePermi(this, id);
  }


  public idverTarea!: any;
  public idtrigger!: any;
  public descripcionT!: string;
  public faseT!: any;
  public plazot!: any;

  public tipoPlazoT!: any;

  public plantillaT!: any;


  public activaFormNuevoPermiso() {
    this.veoAccionesPermiso = false;
    this.activoFormNuevoPermiso = true;
    this.veoBorrarTarea = false;
    console.log("nuevo permiso pulsado");


  }

  public refrescavista: boolean = true;
  public idProcedimiento!: number;


  public creapermisoprocedi: CreaPermisoProcedi = new CreaPermisoProcedi();
  public permisoprocedicreado: any = new PermisoProcediCreado;
  public procedipermisos: any = new ProcediPermisos();
  procedipermiso!: ProcediPermisos[];


  public validateAndCreatePermiso(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.permisosFacade.crear(this);
  }

  public createPermisoProcedi(): void {
    this.permisosFacade.crear(this);
  }

  public activoFormNuevoPermiso: boolean = false;
  public botonNuevoPermiso: boolean = true;
  public veoAccionesPermiso: boolean = false;
  public accionTarea: any;
  public verEliminaTarea: boolean = false;

  enviamos(event: any) {
    GridRadioSelector.handleRowClick(event, 'Procedimientos', (rowData) => {
      this.router.navigate(['/procedimientos', rowData.id]);
    });
  }

  /**
   * Maneja el click en una fila del grid de tareas
   * Selecciona la fila y carga los datos de la tarea
   */
  public envioTareaProcedi(event: any): void {
    GridRadioSelector.handleRowClick(event, 'Tareas', (rowData) => {
      applyTareaGridSelection(this, rowData, {
        setIdPermiso: (id) => this.session.setIdPermiso(id),
        lanzaSourcePermi: (id) => this.lanzaSourcePermi(id),
        peparadatosfirma: (plantilla) => this.peparadatosfirma(plantilla),
        actualizaSourceAtributo: (id) => this.actualizaSourceAtributo(id),
        idProcedi: this.idProcedi,
      });
    });
  }

  public deleteTareaProcedimiento(): void {
    this.tareasFacade.eliminar(this);
  }


  public idprocedi!: any;
  public veoTarea: boolean = false;
  public veoeliminaProcedimiento: boolean = false
  public descripProcedimiento!: string;
  public departProcedimiento!: string;
  public siaProcedimiento!: string;
  public materia!: any;
  public modalidad!: any;
  public idProcedi!: any;
  public siglas!: any;



  public usuarioTareaDescrip!: any;

  public veoBorrarTarea: boolean = false;
  public usuarioTarea!: any;
  public idPermisoProcedimiento!: any;

  /**
   * Maneja el click en una fila del grid de permisos
   * Selecciona la fila y carga los datos del permiso
   */
  public idpermisosPermi(event: any): void {
    GridRadioSelector.handleRowClick(event, 'Permisos', (rowData) => {
      this.veoBorrarTarea = true;
      this.usuarioTareaDescrip = this.usuarioTarea = rowData.usuario;
      this.idPermisoProcedimiento = rowData.id;
    });
  }

  public atrasCrearPermisoProcedi(): void {
    this.permisosFacade.resetFormularioNuevo(this);
  }

  /**
   * Limpia los errores visuales del formulario
   */
  public limpiarErrores(): void {
    const form = document.getElementById('formNuevoProcedimiento') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
    }
    this.prepararFormularioNuevoProcedimiento();
  }


  public validateAndCreateProcedimiento(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }

    if (this.crearprocedi.siglas && this.crearprocedi.siglas.length > 5) {
      this.notificationService.error('El campo Siglas debe tener máximo 5 caracteres.');
      event.preventDefault();
      return;
    }

    this.procedimientoFacade.crear(this);
  }

  public create(_descrip: string, _sia: string, _depart: string, _siglas: string): void {
    this.procedimientoFacade.crear(this);
  }

  public deleteProcedimiento(dato: number): void {
    this.procedimientoFacade.eliminar(this, dato);
  }


  public abrirModalEditarTarea(event: any): void {
    const target = event.originalEvent?.target as HTMLElement;
    if (target && target.closest('input[type="radio"]')) {
      return;
    }
    this.envioTareaProcedi(event);
    this.abrirOffcanvas('modificarTareaOffcanvas');
  }



  private readonly gridRenderers = createProcedimientosGridRenderers();
  columnsPro = buildColumnsPro(this.gridRenderers);
  columnsTarea = buildColumnsTarea(this.gridRenderers);
  columnsPermi = buildColumnsPermi(this.gridRenderers);
  columnsAtributos = buildColumnsAtributos(this.gridRenderers);
  public localizationObject: any = jqxGrid_ES;
  refresco: any;
  public sourcePro: any;
  public sourceTarea: any;
  public sourcePermi: any;
  public sourceAtributos: any;

  public lanzaSourceTarea(): void {
    this.gridFacade.lanzaSourceTarea(this);
  }

  public actualizaSourceAtributo(idprocedimiento: any): void {
    this.gridFacade.actualizaSourceAtributo(this, idprocedimiento);
  }

  public deletePermisoProcedimiento(): void {
    this.permisosFacade.eliminar(this);
  }

  firmalistar!: FirmaListar[];
  plantillatarea!: PlantillaTarea[];

  public tpsinfirma: boolean = true;
  public veoPermiso: boolean = false;
  public veoAtributos: boolean = false;
  public accionDescripcion: string;

  preparoAccion(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const accion = selectElement.value;
    const accionEncontrada = ACCIONES.find((a) => a.valor === Number(accion));
    this.accionDescripcion = accionEncontrada ? accionEncontrada.descripcion : 'ACCIÓN NO RECONOCIDA';
  }

  public peparadatosfirma(plantilla: string): void {
    this.tareasFacade.prepararDatosFirma(this, plantilla);
  }

  public validateAndEditTarea(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.tareasFacade.editar(this);
  }

  public editaTareaProcedim(): void {
    this.tareasFacade.editar(this);
  }

  public getListaTareas(idproce: any): void {
    this.procedimientoService.getTareaProcedimiento(idproce).subscribe(
      listatareaprocedi => this.listatareaprocedi = listatareaprocedi
    );
  }

  listatareaprocedi!: ListaTareaProcedi[];

  // CREAR NUEVA TAREA PROCEDIMIENTO
  public verListProcedi: boolean = true;
  public httpHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );
  public creatareaprocedi: CreaTareaProcedi = new CreaTareaProcedi();
  public tareaprocedicreada: any = new TareaProcediCreada;

  public borravaloresNuevaTarea(): void {
    this.tareasFacade.borrarValoresNuevaTarea(this);
  }

  public limpiarErroresModificarTarea(): void {
    const form = document.getElementById('formModificarTarea') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
    }
  }

  public limpiarErroresEditarProcedimiento(): void {
    const form = document.getElementById('formEditarProcedimiento') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }

  public limpiarErroresAlAbrirModal(): void {
    // El servicio ModalManagerService se encarga de limpiar los errores automáticamente
  }

  public abrirModal(modalId: string): void {
    if (modalId === 'NprocediModal') {
      this.prepararFormularioNuevoProcedimiento();
    }
    this.modalManagerService.openModal(modalId);
    if (modalId === 'NprocediModal') {
      setTimeout(() => this.prepararFormularioNuevoProcedimiento(), 0);
    }
  }

  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  /**
   * Limpia todos los formularios de modales
   */
  private limpiarTodosLosFormularios(): void {
    const formIds = [
      'formNuevoProcedimiento',
      'formEditarProcedimiento',
      'formNuevoPermiso',
      'formEditarAtributos',
      'formNuevosAtributos',
      'formModificarTarea',
      'formNuevaTarea'
    ];

    formIds.forEach(formId => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        form.reset();
      }
    });
  }





  public onRowDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      populateTareaEditForm(this, rowData);
      if (rowData.plantillaDefecto) {
        this.peparadatosfirma(rowData.plantillaDefecto);
      }
      this.abrirOffcanvas('modificarTareaOffcanvas');
    });
  }

  public onProcedimientoDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      this.router.navigate(['/procedimientos', rowData.id], { queryParams: { tab: 'datos' } });
    });
  }

  /**
   * Maneja el doble click en la tabla de atributos
   */
  public onAtributoDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      populateAtributoFromRow(this, rowData);
      this.modalManagerService.openModal('EditoAtributosModal');
    });
  }

  public validateAndCreateTarea(event: Event): void {
    if (!this.idprocedi) {
      this.notificationService.error('No se puede crear una tarea sin un ID de procedimiento válido.');
      return;
    }
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.tareasFacade.crear(this, this.idprocedi);
  }

  public createTareaProcedi(procedimientoId: number): void {
    this.tareasFacade.crear(this, procedimientoId);
  }

}
