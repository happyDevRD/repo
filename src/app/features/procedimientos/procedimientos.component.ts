import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  AtributosListar,
} from './procedimiento';
import { ACCIONES } from "../../core/helper/tarea-acciones";
import { ProcedimientoService } from "./procedimiento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../core/service/notification.service";
import { ModalManagerService } from "../../core/service/modal-manager.service";
import { UserSessionService } from '../../core/service/user-session.service';
import {
  FirmaListar,
  MATERIA_LABELS,
  MODALIDAD_LABELS,
  ProcedimientoWorkspaceTab,
} from './models/procedimientos-internal.models';
import {
  applyTipoAtributo,
  TIPO_ATRIBUTO_OPTIONS,
  toggleRequeridoAtributo,
} from './helpers/procedimientos-atributos.helper';
import { ProcedimientosWorkspaceFacade } from './services/procedimientos-workspace.facade';
import { ProcedimientosGridFacade } from './services/procedimientos-grid.facade';
import { ProcedimientosAtributosFacade } from './services/procedimientos-atributos.facade';
import { ProcedimientosProcedimientoFacade } from './services/procedimientos-procedimiento.facade';
import { ProcedimientosTareasFacade } from './services/procedimientos-tareas.facade';
import { ProcedimientosPermisosFacade } from './services/procedimientos-permisos.facade';
import { validateBootstrapForm, clearFormValidation } from '../../core/helper/bootstrap-form.helper';
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
export class ProcedimientosComponent {
  private readonly destroyRef = inject(DestroyRef)

  public idver!: number;
  public procedimiento: Procedimiento = new Procedimiento();
  public editarprocedi: EditarProcedi = new EditarProcedi();
  public atributoscrear: AtributosCrear = new AtributosCrear();
  public firmaT!: string;

  get idOrgElemen(): string | null {
    return this.session.idOrgEleme;
  }

  get departamento(): string | null {
    return this.session.department;
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
  public isWorkspaceMode = false;
  public activeWorkspaceTab: ProcedimientoWorkspaceTab = 'datos';
  /** Fila seleccionada en el listado (antes de entrar al workspace). */
  public procedimientoSeleccionado: Procedimiento | null = null;
  /** Modo del modal unificado de procedimiento (crear / editar / ver). */
  public formMode: 'crear' | 'editar' | 'ver' = 'crear';
  materiaprocedimiento!: MateriaProcedimiento[];
  procedimientos: Procedimiento[] = [];
  cargandoProcedimientos: boolean = false;

  get formReadonly(): boolean {
    return this.formMode === 'ver';
  }

  get formTitle(): string {
    if (this.formMode === 'editar') return 'Modificar Procedimiento';
    if (this.formMode === 'ver') return 'Ver Procedimiento';
    return 'Nuevo Procedimiento';
  }

  get formSubmitLabel(): string {
    if (this.formMode === 'editar') return 'Guardar cambios';
    return 'Guardar';
  }

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
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private workspaceFacade: ProcedimientosWorkspaceFacade,
    private gridFacade: ProcedimientosGridFacade,
    private atributosFacade: ProcedimientosAtributosFacade,
    private procedimientoFacade: ProcedimientosProcedimientoFacade,
    private tareasFacade: ProcedimientosTareasFacade,
    private permisosFacade: ProcedimientosPermisosFacade,
  ) {}

  ngOnInit(): void {
    this.procedimientoService.getMateriaProcedi().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      materiaprocedimiento => this.materiaprocedimiento = materiaprocedimiento
    );
    this.procedimientoService.getPermisoProcedi().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      procedipermisos => this.procedipermiso = procedipermisos
    );
    this.procedimientoService.getPlantillaTareas().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      plantillatarea => this.plantillatarea = plantillatarea
    );
    if (this.session.canManageProcedimientos) {
      this.cargarProcedimientos();
    }

    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params => {
      const rawId = params['id'];
      if (rawId) {
        this.isWorkspaceMode = true;
        this.loadWorkspace(+rawId);
        return;
      }
      this.isWorkspaceMode = false;
      this.resetWorkspaceState();
    });

    this.activatedRoute.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => {
      const tab = query['tab'] as ProcedimientoWorkspaceTab | undefined;
      if (this.workspaceFacade.isValidTab(tab)) {
        this.activeWorkspaceTab = tab;
      }
    });
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

  public getModalidadLabelFor(modalidad: unknown): string {
    return MODALIDAD_LABELS[Number(modalidad)] ?? '—';
  }

  public getMateriaLabelFor(idMatProce: unknown): string {
    const id = Number(idMatProce);
    const found = this.materiaprocedimiento?.find((item) => Number(item.idMatProce) === id);
    return found?.descripcion ?? MATERIA_LABELS[id] ?? '—';
  }

  private resetWorkspaceState(): void {
    this.workspaceFacade.resetWorkspaceFlags(this);
  }

  public loadWorkspace(id: number): void {
    this.workspaceFacade.loadWorkspace(this, id);
  }

  public prepararFormularioNuevoProcedimiento(): void {
    this.crearprocedi = new CrearProcedi();
    this.crearprocedi.depart = this.session.idOrgEleme ?? '';
  }

  public abrirNuevoProcedimientoModal(): void {
    this.formMode = 'crear';
    this.prepararFormularioNuevoProcedimiento();
    clearFormValidation('formProcedimiento');
    this.modalManagerService.openModal('NprocediModal');
  }

  public abrirFormularioProcedimiento(mode: 'editar' | 'ver', row?: Procedimiento): void {
    const id = row?.id ?? this.procedimientoSeleccionado?.id ?? this.idprocedi;
    if (!id) {
      this.notificationService.warning('Debe seleccionar un procedimiento primero');
      return;
    }

    this.formMode = mode;
    this.procedimientoService.getProcedimiento(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (proc) => {
        this.hydrateFormularioProcedimiento(proc);
        clearFormValidation('formProcedimiento');
        this.modalManagerService.openModal('NprocediModal');
      },
      error: () => {
        this.notificationService.error('No se pudo cargar el procedimiento');
      },
    });
  }

  public hydrateFormularioProcedimiento(proc: Procedimiento): void {
    const deptRaw = proc.departamento as unknown;
    const deptObj = deptRaw && !Array.isArray(deptRaw)
      ? deptRaw as { idOrgan?: string; idOrgEleme?: string; desEleme?: string }
      : Array.isArray(deptRaw) && deptRaw.length
        ? deptRaw[0] as { idOrgan?: string; idOrgEleme?: string; desEleme?: string }
        : null;
    const idOrgEleme = String(deptObj?.idOrgEleme ?? this.session.idOrgEleme ?? '');
    const idOrgan = String(deptObj?.idOrgan ?? this.session.idOrgEleme ?? '');

    this.idprocedi = proc.id;
    this.crearprocedi = new CrearProcedi();
    this.crearprocedi.descripcion = proc.descripcion ?? '';
    this.crearprocedi.codigoSia = proc.codigoSia ?? '';
    this.crearprocedi.siglas = proc.siglas ?? '';
    this.crearprocedi.modalidad = proc.modalidad as CrearProcedi['modalidad'];
    this.crearprocedi.materia = proc.idMatProce as CrearProcedi['materia'];
    this.crearprocedi.depart = idOrgEleme;
    this.crearprocedi.departamento = { idOrgan, idOrgEleme };

    this.editarprocedi = new EditarProcedi();
    this.editarprocedi.id = proc.id;
    this.editarprocedi.descripcion = proc.descripcion ?? '';
    this.editarprocedi.codigoSia = proc.codigoSia ?? '';
    this.editarprocedi.modalidad = proc.modalidad as EditarProcedi['modalidad'];
    this.editarprocedi.materia = proc.idMatProce as EditarProcedi['materia'];
    this.editarprocedi.departamento = { idOrgan, idOrgEleme };
  }

  public syncEdicionDesdeFormulario(): void {
    this.editarprocedi.descripcion = this.crearprocedi.descripcion;
    this.editarprocedi.codigoSia = this.crearprocedi.codigoSia;
    this.editarprocedi.modalidad = this.crearprocedi.modalidad;
    this.editarprocedi.materia = this.crearprocedi.materia;
    if (!this.editarprocedi.departamento || Array.isArray(this.editarprocedi.departamento)) {
      const idOrgEleme = this.session.idOrgEleme ?? '';
      this.editarprocedi.departamento = { idOrgan: idOrgEleme, idOrgEleme };
    }
  }

  public cerrarFormularioProcedimiento(): void {
    clearFormValidation('formProcedimiento');
    if (this.formMode === 'crear') {
      this.prepararFormularioNuevoProcedimiento();
    }
    this.formMode = 'crear';
    this.modalManagerService.closeModal('NprocediModal');
  }

  public validateAndSubmitProcedimiento(event: Event): void {
    if (this.formMode === 'ver') {
      return;
    }
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    if (this.formMode === 'editar') {
      this.syncEdicionDesdeFormulario();
      this.procedimientoFacade.editar(this);
      return;
    }
    if (this.crearprocedi.siglas?.length > 5) {
      this.notificationService.error('Las siglas no pueden tener más de 5 caracteres');
      return;
    }
    this.procedimientoFacade.crear(this);
  }

  public limpiarErrores(): void {
    clearFormValidation('formProcedimiento');
    this.formMode = 'crear';
    this.prepararFormularioNuevoProcedimiento();
  }

  public idAtrib: any;
  public idGrupo: any;
  public etiGruAtrib;

  public veoborraratributo: boolean = false;
  public EtiquetaatributosActual: any;
  public Requerido: any;

  public atributosList: AtributosListar[] = [];
  public cargandoAtributosList: boolean = false;

  public marcoAtributos(rowData: AtributosListar): void {
    populateAtributoFromRow(this, rowData)
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

  public limpioAtributosformulario(): void {
    this.atributosFacade.limpiarAtributos(this);
  }

  public validateAndCreateAtributo(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.atributosFacade.crear(this);
  }

  public cargarProcedimientos(): void {
    this.gridFacade.cargarProcedimientos(this);
  }

  public refrescaProcedimientos() {
    if (this.isWorkspaceMode) {
      return;
    }

    this.cargarProcedimientos();
  }

  //---------------------Eleazar
  cargarPermisos(id: any) {
    this.gridFacade.cargarPermisos(this, id);
  }


  public idverTarea!: any;
  public descripcionT!: string;
  public faseT!: any;
  public plazot!: any;

  public tipoPlazoT!: any;

  public plantillaT!: any;


  public activaFormNuevoPermiso() {
    this.veoBorrarTarea = false;
    this.creapermisoprocedi = new CreaPermisoProcedi();
    this.creapermisoprocedi.usuario = this.procedipermiso?.[0]?.usuario ?? '';
  }

  public creapermisoprocedi: CreaPermisoProcedi = new CreaPermisoProcedi();
  procedipermiso!: ProcediPermisos[];


  public validateAndCreatePermiso(event: Event): void {
    if (!validateBootstrapForm(event, this.notificationService)) {
      return;
    }
    this.permisosFacade.crear(this);
  }

  public verEliminaTarea: boolean = false;

  /** Resalta la fila del procedimiento seleccionado en el listado. */
  public readonly procedimientoRowClass = (row: Procedimiento): Record<string, boolean> => ({
    'table-active': row.id === this.procedimientoSeleccionado?.id,
  });

  public seleccionarProcedimiento(row: Procedimiento): void {
    this.procedimientoSeleccionado = row;
  }

  public abrirProcedimiento(id: number, tab: ProcedimientoWorkspaceTab = 'datos'): void {
    this.router.navigate(['/procedimientos', id], { queryParams: { tab } });
  }

  /**
   * Maneja el click en una fila de la tabla de tareas
   * Selecciona la fila y carga los datos de la tarea
   */
  public envioTareaProcedi(rowData: ListaTareaProcedi): void {
    applyTareaGridSelection(this, rowData, {
      setIdPermiso: (id) => this.session.setIdPermiso(id),
      cargarPermisos: (id) => this.cargarPermisos(id),
      peparadatosfirma: (plantilla) => this.peparadatosfirma(plantilla),
    })
  }

  public deleteTareaProcedimiento(): void {
    this.tareasFacade.eliminar(this);
  }


  public idprocedi!: any;
  public tareas: ListaTareaProcedi[] = [];
  public cargandoTareas: boolean = false;
  public descripProcedimiento!: string;
  public departProcedimiento!: string;
  public siaProcedimiento!: string;
  public materia!: any;
  public modalidad!: any;
  public siglas!: any;



  public usuarioTareaDescrip!: any;

  public veoBorrarTarea: boolean = false;
  public usuarioTarea!: any;
  public idPermisoProcedimiento!: any;
  public permisos: ProcediPermisosListar[] = [];
  public cargandoPermisos: boolean = false;

  /**
   * Maneja el click en una fila de la tabla de permisos
   * Selecciona la fila y carga los datos del permiso
   */
  public idpermisosPermi(rowData: ProcediPermisosListar): void {
    this.veoBorrarTarea = true
    this.usuarioTareaDescrip = this.usuarioTarea = rowData.usuario
    this.idPermisoProcedimiento = rowData.id
  }

  public atrasCrearPermisoProcedi(): void {
    this.permisosFacade.resetFormularioNuevo(this);
  }

  public deleteProcedimiento(dato: number): void {
    this.procedimientoFacade.eliminar(this, dato);
  }

  public cargarTareas(): void {
    this.gridFacade.cargarTareas(this);
  }

  public cargarAtributos(idprocedimiento: any): void {
    this.gridFacade.cargarAtributos(this, idprocedimiento);
  }

  public deletePermisoProcedimiento(): void {
    this.permisosFacade.eliminar(this);
  }

  firmalistar!: FirmaListar[];
  plantillatarea!: PlantillaTarea[];

  public tpsinfirma: boolean = true;
  public accionDescripcion: string;

  preparoAccion(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const accion = selectElement.value;
    const accionEncontrada = ACCIONES.find((a) => a.valor === Number(accion));
    this.accionDescripcion = accionEncontrada ? accionEncontrada.descripcion : 'ACCIÓN NO RECONOCIDA';
  }

  public getAccionLabel(valor: unknown): string {
    if (valor === null || valor === undefined || valor === '' || valor === -1) {
      return '—';
    }
    const accionEncontrada = ACCIONES.find((a) => a.valor === Number(valor));
    return accionEncontrada ? accionEncontrada.descripcion : String(valor);
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

  // CREAR NUEVA TAREA PROCEDIMIENTO
  public creatareaprocedi: CreaTareaProcedi = new CreaTareaProcedi();

  public borravaloresNuevaTarea(): void {
    this.tareasFacade.borrarValoresNuevaTarea(this);
  }

  public limpiarErroresModificarTarea(): void {
    clearFormValidation('formModificarTarea');
  }

  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  public onRowDoubleClick(rowData: ListaTareaProcedi): void {
    populateTareaEditForm(this, rowData)
    if (rowData.plantillaDefecto) {
      this.peparadatosfirma(rowData.plantillaDefecto)
    }
    this.abrirModal('modifitareasModalListado')
  }

  /**
   * Maneja el doble click en la tabla de atributos
   */
  public onAtributoDoubleClick(rowData: AtributosListar): void {
    populateAtributoFromRow(this, rowData)
    this.modalManagerService.openModal('EditoAtributosModal')
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

}
