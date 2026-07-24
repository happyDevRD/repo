import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AtributosModificar,
  Atributosleer,
  ConsultaDni,
  CrearMensaje,
  EditExpediente,
  ExpedienteListar,
  InsertaBolsaCrear,
  NuevoExpediente,
  Procedimiento,
  RegistroDocumento,
  RepresentanteExpLIstar,
  TareaTramiteExpporExpedi,
  VerExpediente
} from './expedientes';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ExpedientesService } from './expedientes.service';

import { environment } from 'src/environments/environment';
import { ProcedimientoService } from '../procedimientos/procedimiento.service';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { AtributosCrear, ProcediPermisosListar } from '../procedimientos/procedimiento';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { NotificationService } from "../../core/service/notification.service";
import { ModalManagerService } from "../../core/service/modal-manager.service";
import { UserSessionService } from "../../core/service/user-session.service";
import { formatearFechaDDMMYYYY, formatearFechaISODesdeLocale } from '../../core/helper/fecha-legacy.helper';
import { mostrarRegistroDocumento } from '../../core/helper/registro-documento-notification.helper';
import * as bootstrap from 'bootstrap';
import { IflowGridComponent } from 'src/app/shared/components/iflow-grid/iflow-grid.component';
import { INICIO_GRID_RENDERERS as R } from '../inicio/shared/inicio-grid-renderers';
import {
  buildColumnsAtributo,
  buildColumnsExpe,
  buildColumnsIndiceENI,
  buildColumnsListRepre,
  buildColumnsPermi,
  buildColumnsTareaProcedi,
  buildColumnsTareasExpediente,
  createExpedientesGridRenderers,
  ExpedientesGridRenderContext,
} from './config/expedientes-grid.config';
import { ExpedientesGridFacade } from './services/expedientes-grid.facade';
import { ExpedientesExpedienteFacade } from './services/expedientes-expediente.facade';
import { ExpedientesInsideFacade, ExpedientesInsideHost } from './services/expedientes-inside.facade';
import { ExpedientesAtributosFacade } from './services/expedientes-atributos.facade';
import { isInsideDryRun } from '../../core/constants/inside-simulacion.constants';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css'],
  providers: [
    ExpedientesGridFacade,
    ExpedientesExpedienteFacade,
    ExpedientesInsideFacade,
    ExpedientesAtributosFacade,
  ],
})

export class ExpedientesComponent {// pruebas de formularios
  private readonly destroyRef = inject(DestroyRef)
  /** Asignados desde componentes hijos (modales) */
  gridAtributosExp?: IflowGridComponent
  gridTareasExpediente?: IflowGridComponent


  public editExpedientes: boolean = false;

  /** true cuando hay fila seleccionada y la acci?n concreta aplica al estado del expediente */
  accionExpediente(requiere = true): boolean {
    return this.editExpedientes && requiere;
  }
  public verExpedientes: boolean = false;
  public title = 'Expedientes';
  public crearmensaje: CrearMensaje = new CrearMensaje();
  public expedienteslistar!: ExpedienteListar[];
  public atributosleer!: Atributosleer[];
  public procedipermisolistar!: ProcediPermisosListar[];
  procedimientos!: Procedimiento[];
  public nuevoexpediente: NuevoExpediente = new NuevoExpediente();
  public registrodocumento: RegistroDocumento = new RegistroDocumento();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public insertabolsacrear: InsertaBolsaCrear = new InsertaBolsaCrear();
  public verexpediente: VerExpediente = new VerExpediente();
  public atributoscrear: AtributosCrear = new AtributosCrear();
  public editexpediente: EditExpediente = new EditExpediente();
  public atributoseditar: AtributosModificar = new AtributosModificar();
  public consultadni: ConsultaDni = new ConsultaDni();
  public variable!: any;
  public statusGetExpedientes!: number;

  // Propiedades de validaci?n para Nuevo Expediente
  public isCreandoExpediente: boolean = false;
  public mostrarValidacionesExpediente: boolean = false;

  // Propiedades de validaci?n para Asignar Tramitador
  public isAsignandoTramitador: boolean = false;
  public mostrarValidacionesAsignarTramitador: boolean = false;

  public columna: any;
  public source: any;


  // Datos para la paginaci?n
  public page!: number;
  public npagina: number = 10;

  // para filtros
  public numeroArchivo!: number;

  public Fecha = new Date();
  public selected = new Date();
  public ejercicio = new Date();

  // ***** VARIABLES PARA MODAL ********
  // editar expedientes

  public idexpediente!: number;
  public idExpedienteString!: string;

  // ============================================
  // RENDERERS DE RADIO BUTTONS - delegados en gridRenderers
  // ============================================

  verpagina() {

    if (this.session.canManageExpedientes) {


      this.expedientesService.getExpedientesListar().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (expedienteslistar) => (this.expedienteslistar = expedienteslistar),
        error: (error: HttpErrorResponse) => {
          this.statusGetExpedientes = error.status;
        },
      });

      this.expedientesService.getProcedimientos().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        procedimientos => this.procedimientos = procedimientos
      );


    } else {
      this.notificationService.warning(`Lo sentimos. El usuario  ${this.session.user}  No tiene acceso a Expedientes.`);

    }
  }

  public verTareasdelTramite: boolean = false
  public nuevotramitador: boolean = false;

  public atrasNuevoMensaje() {
    this.verTareasdelTramite = true;
    this.nuevotramitador = false;
    this.veoPermisoProcedi = false;
    this.crearmensaje = new CrearMensaje();

  }
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];


  public DevolverExpe() {
    this.expedienteFacade.devolver(this, this.ejerexpe, this.numExp);
  }

  /**
   * Archivar sin REDSARA: marca ARCHIVADO en iFlow (demo).
   * TODO SARA real: sustituir por integración red SARA en cutover.
   */
  public ArchivaExp() {
    this.expedienteFacade.archivarSimulado(this)
  }

  // Nueva funci?n principal para asignar tramitador
  public onAsignarTramitadorSubmit(): void {
    this.mostrarValidacionesAsignarTramitador = true;

    // Validar campos obligatorios
    if (this.isDescripcionMensajeInvalid()) {
      this.notificationService.incompleteFields();
      return;
    }

    // Confirmar asignaci?n
    this.notificationService.confirm(
      '?Est? seguro de que desea asignar este tramitador?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignarTramitador();
      }
    });
  }

  // Funci?n de ejecuci?n separada
  private ejecutarAsignarTramitador(): void {
    this.expedienteFacade.ejecutarAsignarTramitador(this);
  }

  // Funci?n original mantenida para compatibilidad
  public crearMensaje() {
    this.onAsignarTramitadorSubmit();
  }
  public insertaBolsaCrear() {
  }
  public veoCorreoVacio() {
    if (this.verexpediente.email == "SinDAtos" || this.verexpediente.email == '0') {
      this.verexpediente.email = "";

    } else {
      this.verexpediente.email = this.verexpediente.email;

    }
  }

  public limpiaDatosEditarExpediente() {

    this.editexpediente = new EditExpediente();
  }

  public editExpediente(): void {
    this.expedienteFacade.editExpediente(this);
  }

  public AbrirExpediente(): void {
    this.expedienteFacade.abrirExpediente(this);
  }
  getrepresentanteexpediente(idPerso: number, idHisPerso: number): void {
    this.expedienteFacade.getrepresentanteexpediente(this, idPerso, idHisPerso);
  }

  public getExpediente() {


    // let consulta:string =`${environment.apiUrl}expediente/ver/${this.idexpediente}`;
    return this.expedientesService.getExpediente(this.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      verexpediente => this.verexpediente = verexpediente
      //return this.http.get(consulta).pipe(map(response => response as VerExpediente));
    )
  }

  public marcaExpediente(id) {
    this.idexpediente = id;
    this.editExpedientes = true;
    this.verExpedientes = true;


    //sessionStorage.setItem("idexpediente",id);
    this.getExpediente()


  }

  public expeSelecDescrip!: string;
  public expedienteSelecVisible: boolean = false;


  //variables para pintar datos de expedientes
  public descripcionProcedimiento!: string;
  public ejerexpe!: any;
  public numExp!: any;
  public idProcedimiento!: any;
  public valorEstado!: string;
  public fechaExpediente!: string;
  public fechaCierre!: string;
  public fechaCancelacion!: string;
  public cancelarexp: boolean = true;
  public verAbrirExpediente: boolean = false;
  public verArchivar: boolean = false;
  public verformaNotifi!: string;
  public verEmail!: string;
  public verDevolver: boolean = true;
  public veoAsignoTramitador: boolean = true;
  public veoInteresado: boolean = true;
  public veoCancelar: boolean = true;
  public veoCerrar: boolean = true;
  public veoArchiva: boolean = true;
  public veoAbrir: boolean = true;
  public puedoEditarExpe: boolean = true;
  //pinta ejercicio y n?mero
  public expEjerNum: string;
  public cargotareasexpedi: boolean = false;
  public cargandoTareasExpediente: boolean = false;
  public tareasExpedienteVacio: boolean = false;
  public tareasExpedienteList: TareaTramiteExpporExpedi[] = [];
  public tituloExp!: string;
  public pruebas: boolean = false;
  public veoAtributos: boolean = false;

  public veoBorrarAtributo: boolean = false;

  public idGrupo: any;
  public etiGruAtrib: any;

  public marcaAtributo(event: any) {
    this.atributosFacade.marcar(this, event);
  }

  public borraAtributo() {
    this.atributosFacade.eliminar(this);
  }

  public listarAtributos() {
    this.atributosFacade.listar(this);
  }

  private refrescarSourceAtributo(localData?: Atributosleer[]): void {
    this.gridFacade.refrescarSourceAtributo(this, localData);
  }

  public borraArrayAtributos() {
    this.atributosFacade.limpiarFormulario(this);
  }

  public envioAtributos() {
    this.atributosFacade.enviar(this);
  }

  public valor: number = 1

  public cargadatos() {
    let suma = this.valor + 1;


  }


  public idExpediente!: any;
  public VeoRegDoc: boolean = false;

  public CargoRegistroDocu() {
    mostrarRegistroDocumento(this.registrodocumento, this.notificationService)
  }



  /**
   * Maneja el doble click en la tabla de expedientes
   * Abre el modal de edici?n del expediente
   */
  public onExpedienteDoubleClick(event: any): void {
    const rowData = event.args.row.bounddata
    this.idexpediente = rowData.id
    this.expedientesService.getExpediente(this.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      verexpediente => {
        this.verexpediente = verexpediente
        this.abrirModalVerExpediente()
      }
    )
  }

  /**
   * Abre el modal de ver expediente
   */
  public abrirModalVerExpediente(): void {
    const idExp = this.getExpedienteIdSeleccionado();
    if (!idExp) {
      this.notificationService.warning('Debe seleccionar un expediente primero');
      return;
    }

    this.idexpediente = parseInt(idExp, 10);

    this.expedientesService.getExpediente(this.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (verexpediente) => {
        this.verexpediente = verexpediente;
        this.abrirModal('verexpedienteModal');
      },
      error: () => {
        this.notificationService.error('No se pudo cargar el expediente');
      }
    });
  }

  private getExpedienteIdSeleccionado(): string {
    const id = this.idExpediente ?? this.idexpediente ?? this.idExpedienteString;
    if (id == null || id === '') {
      return '';
    }
    return String(id);
  }

  public marcaExpedienteNuevo(event: any) {
    this.expedienteFacade.marcarExpedienteSeleccionado(this, event.args.row.bounddata)
    this.pestanaFlujo = 'tramitacion'
  }

  /** Pestaña de flujo: Tramitación (clásico) vs INSIDE */
  public pestanaFlujo: 'tramitacion' | 'inside' = 'tramitacion'

  public handlePestanaFlujo(pestana: 'tramitacion' | 'inside'): void {
    this.pestanaFlujo = pestana
  }

  public veoTablaExp: boolean = true;

  public veoAsignarTramitador() {
    this.veoTablaExp = false;


  }

  recargarpagina() {
    window.location.reload();
  }


  public seleccionoRepre!: string;

  public selecrepresentante(event: any): void {
    this.expedienteFacade.selecrepresentante(this, event);
  }

  /**
   * Wizard de consulta de DNI / persona / representante para "Nuevo Expediente".
   * El estado (dniok, existepersonaentidad, selectnombre, municiflitro, cambioRepresentante...)
   * y la l?gica viven en ExpedientesExpedienteFacade.
   */
  public cambiamosRepre(): void {
    this.expedienteFacade.cambiamosRepre();
  }
  public solicitadni(dni: string): void {
    this.expedienteFacade.solicitadni(this, dni);
  }

  public selecTipPerso(valor: any): void {
    this.expedienteFacade.selecTipPerso(valor);
  }
  public limpiadatosnuevoexpediente() {
    this.nuevoexpediente = new NuevoExpediente();
    this.consultadni = new ConsultaDni();
    this.representanteexplistar = new RepresentanteExpLIstar()
    this.expedienteFacade.resetSolicitudDni();


    // Resetear validaciones
    this.mostrarValidacionesExpediente = false;
    this.isCreandoExpediente = false;

  }

  // Gesti?n de modales
  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    // Resetear validaciones espec?ficas seg?n el modal
    if (modalId === 'nexpedienteModal') {
      this.limpiadatosnuevoexpediente();
    } else if (modalId === 'NAtributosModal2') {
      this.borraArrayAtributos();
    } else if (modalId === 'TareaExpedienteModal') {
      this.limpioSourceTareasExpediente();
    } else if (modalId === 'AsigfnarTramitadorModal') {
      this.limpiarDatosAsignarTramitador();
    }

    this.modalManagerService.closeModal(modalId);
  }

  // Funci?n de validaci?n para Asignar Tramitador
  public isDescripcionMensajeInvalid(): boolean {
    return this.mostrarValidacionesAsignarTramitador && (!this.crearmensaje.descripcion || this.crearmensaje.descripcion.trim() === '');
  }

  // Funci?n de limpieza para Asignar Tramitador
  limpiarDatosAsignarTramitador(): void {
    this.isAsignandoTramitador = false;
    this.mostrarValidacionesAsignarTramitador = false;
    this.atrasNuevoMensaje();
  }

  // Funciones espec?ficas para modales con l?gica previa
  public abrirModalTareasExpediente(): void {
    const idExp = this.getExpedienteIdSeleccionado();
    if (!idExp) {
      this.notificationService.warning('Seleccione un expediente');
      return;
    }

    this.expEjerNum = `${this.ejerexpe ?? ''}/${this.numExp ?? ''}`;
    this.cargotareasexpedi = true;
    this.cargandoTareasExpediente = true;
    this.tareasExpedienteVacio = false;
    this.tareasExpedienteList = [];
    this.refrescarSourceTareasExpedientePorUrl(idExp);
    this.cdr.detectChanges();
    this.abrirModal('TareaExpedienteModal');
    this.scheduleTareasExpedienteModalRefresh();
  }

  public onTareasExpedienteBindingComplete(): void {
    this.cargandoTareasExpediente = false;
    const rows = (this.gridTareasExpediente?.getrows() ?? []) as TareaTramiteExpporExpedi[];
    this.tareasExpedienteList = rows;
    this.tareasExpedienteVacio = rows.length === 0;
    this.cdr.detectChanges();
  }

  public abrirModalAtributos(): void {
    this.atributosFacade.abrirModal(this);
  }
  public isFechaExpedienteInvalid(): boolean {
    return this.expedienteFacade.isFechaExpedienteInvalid(this);
  }

  public isFormaAperturaInvalid(): boolean {
    return this.expedienteFacade.isFormaAperturaInvalid(this);
  }

  public isFormaNotificacionInvalid(): boolean {
    return this.expedienteFacade.isFormaNotificacionInvalid(this);
  }

  public isEmailExpedienteInvalid(): boolean {
    return this.expedienteFacade.isEmailExpedienteInvalid(this);
  }

  public isTituloExpedienteInvalid(): boolean {
    return this.expedienteFacade.isTituloExpedienteInvalid(this);
  }

  public isInteresadoDNIInvalid(): boolean {
    return this.expedienteFacade.isInteresadoDNIInvalid(this);
  }

  public isProcedimientoExpedienteInvalid(): boolean {
    return this.expedienteFacade.isProcedimientoExpedienteInvalid(this);
  }

  public onCrearExpedienteSubmit(): void {
    this.expedienteFacade.onCrearExpedienteSubmit(this);
  }

  limpiarDatosExpediente(): void {
    this.isCreandoExpediente = false;
    this.mostrarValidacionesExpediente = false;
    this.limpiadatosnuevoexpediente();
    this.cerrarModal('nexpedienteModal');
  }

  public creaExpediente() {
    this.onCrearExpedienteSubmit();
  }

  public fechacancelacionexpedi!: Date;

  public cancelarExpediente(): void {
    this.expedienteFacade.cancelar(this);
  }


  // para ver el boton cerrarExpediente
  public cerrarexp: boolean = false;
  public fechacierreexpedi!: any;
  public serieDocumental!: any;


  public cerrarExpediente(): void {
    this.expedienteFacade.cerrar(this);
  }

  public insideEnviando = false;
  public insideDryRun = isInsideDryRun();
  public filtroInsidePendientes = false;
  public insidePendientesCount = 0;
  public insidePendientesErrorCount = 0;

  private readonly insideListHost = (): ExpedientesInsideHost => this as unknown as ExpedientesInsideHost;

  public get usuario(): string {
    return this.session.user ?? '';
  }

  public puedeEnviarInside(): boolean {
    return this.insideFacade.puedeEnviarInside(this.insideListHost());
  }

  public idExpedienteParaInside: number | null = null;

  public abrirModalInsideDesdeListado(idexpediente: number): void {
    this.idExpedienteParaInside = idexpediente;
    this.cdr.detectChanges();
    this.modalManagerService.openModal('insideAccionesModal');
  }

  public toggleFiltroInsidePendientes(): void {
    this.insideFacade.toggleFiltroPendientes(this.insideListHost());
  }

  public refreshExpedientesList(): void {
    this.filtroInsidePendientes = false;
    this.gridFacade.refreshExpedientesList(this, this.usuario, true);
    this.insideFacade.actualizarResumenPendientes(this.insideListHost());
  }


  public reenvioEditar() {
    this.router.navigate(['/expedientes', this.idexpediente, 'tramitar'])
  }

  public idExpedienteParaInteresados: number | null = null;

  public abrirModalInteresadosDesdeListado(idexpediente: number): void {
    this.idExpedienteParaInteresados = idexpediente;
    this.cdr.detectChanges();
    this.modalManagerService.openModal('interesadosExpedienteModal');
  }


  constructor(
    public expedientesService: ExpedientesService,
    public solicitudesServices: SolicitudesService,
    public procedimientoService: ProcedimientoService,
    public router: Router,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    private cdr: ChangeDetectorRef,
    public session: UserSessionService,
    public gridFacade: ExpedientesGridFacade,
    private expedienteFacade: ExpedientesExpedienteFacade,
    private insideFacade: ExpedientesInsideFacade,
    private atributosFacade: ExpedientesAtributosFacade,
  ) {
    this.gridRenderContext.setUsuarioTarea = (id) => this.session.setUsuarioTarea(String(id));
    this.gridFacade.initGridSources(this, this.session.user ?? '');
  }

  private readonly gridRenderContext: ExpedientesGridRenderContext = {};
  private readonly gridRenderers = createExpedientesGridRenderers(this.gridRenderContext);
  columnsExpe = buildColumnsExpe(this.gridRenderers);
  columnsTareaProcedi = buildColumnsTareaProcedi(this.gridRenderers);
  columnsPermi = buildColumnsPermi(this.gridRenderers);
  columnsListRepre = buildColumnsListRepre(this.gridRenderers);
  columnsIndiceENI = buildColumnsIndiceENI(this.gridRenderers);
  columnsTareasExpediente = buildColumnsTareasExpediente(this.gridRenderers);
  columnsAtributo = buildColumnsAtributo(this.gridRenderers);
  public localizationObject: any = jqxGrid_ES;
  sourceExp!: any;
  sourceTareaProcedi!: any;
  sourcePermi!: any;
  sourceListRepre!: any;
  sourceTramite: any = {};
  sourceIndiceENI!: any;
  sourceTareasExpediente!: any;
  sourceAtributo!: any;

  public syncGridRenderContext(): void {
    this.gridRenderContext.valorEstado = this.valorEstado;
  }

  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSistema() {
    this.fsistema = new Date().toLocaleDateString()
    const fechaordenadafenvio = formatearFechaISODesdeLocale(this.fsistema)
    this.fechaSistema = fechaordenadafenvio
    this.nuevoexpediente.fechaInicio = fechaordenadafenvio as unknown as Date
  }


  async ngOnInit() {
    this.FechaSistema();
    if (this.consultadni.idPerso || this.consultadni.idHisPerso) {
      this.getrepresentanteexpediente(this.consultadni.idPerso, this.consultadni.idHisPerso)

    }


    this.gridFacade.refrescarSourceTareasExpediente(this, []);


    this.verpagina();
    this.insideFacade.actualizarResumenPendientes(this.insideListHost());
  }


  public clicktareExpediente(event: any) {
    this.numeroArchivo = event.args.row.bounddata.archivo
  }


  public fechaTramite!: any;
  public fechatramite!: any;

  lanzaSourcePermi(id: number | string): void {
    this.gridFacade.lanzaSourcePermi(this, id);
  }

  public veoasignatramitador = false;

  public lanzaTareaProcedi(): void {
    this.gridFacade.lanzaTareaProcedi(this, this.idProcedimiento);
    this.veoasignatramitador = true;
  }

  public actualizaSourceTramite(): void {
    this.gridFacade.actualizaSourceTramite(this);
  }

  private refrescarSourceTareasExpedientePorUrl(idExp: string): void {
    this.gridFacade.refrescarSourceTareasExpedientePorUrl(this, idExp);
  }

  private refrescarSourceTareasExpediente(localData: TareaTramiteExpporExpedi[]): void {
    this.gridFacade.refrescarSourceTareasExpediente(this, localData);
  }


  public usuarioTarea!: any;
  public usuarioPermiso!: any;

  public idpermisosPermi(event: any) {
    const rowData = event.args.row.bounddata
    this.usuarioPermiso = rowData.idOrgUsuar
    this.usuarioTarea = rowData.usuario
    this.idPermisoProcedimiento = rowData.id
  }

  public idPermisoProcedimiento!: any;
  public idverTarea!: any;
  public veoPermisoProcedi: boolean = false;


  public envioTareaProcedi(event: any) {
    const rowData = event.args.row.bounddata
    this.veoPermisoProcedi = true
    this.lanzaSourcePermi(rowData.id)
    this.idPermisoProcedimiento = rowData.id
    this.idverTarea = rowData.id
  }


  private scheduleTareasExpedienteModalRefresh(): void {
    const modalEl = document.getElementById('TareaExpedienteModal')
    const refresh = (): void => {
      window.setTimeout(() => this.refreshGridTareasExpediente(), 60)
      window.setTimeout(() => this.refreshGridTareasExpediente(), 250)
      window.setTimeout(() => this.refreshGridTareasExpediente(), 500)
    }

    if (!modalEl) {
      refresh()
      return
    }

    modalEl.addEventListener('shown.bs.modal', refresh, { once: true })
  }

  private refreshGridTareasExpediente(): void {
    this.gridFacade.refreshGridTareasExpediente(this);
  }

  public limpioSourceTareasExpediente(): void {
    this.tareasExpedienteList = [];
    this.cargotareasexpedi = false;
    this.cargandoTareasExpediente = false;
    this.tareasExpedienteVacio = false;
    this.gridFacade.refrescarSourceTareasExpediente(this, []);
  }

  public lanzoIndiceENI(idexpe: string): void {
    this.gridFacade.lanzoIndiceENI(this, idexpe);
  }

  cargarIndiceENI(idExpedienteString: string): void {
    this.gridFacade.cargarIndiceENI(this, idExpedienteString);
  }


  public descargafichero!: any;

  public abreArchivo() {

    this.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${this.numeroArchivo}`; // Reemplaza con la URL del archivo que deseas descargar


    if (!this.numeroArchivo) {
      this.notificationService.warning('Esta tarea No tiene ning?n documento asociado')


    } else {
      window.open(this.descargafichero, "_blank");


    }

  }
}
