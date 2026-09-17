import { ChangeDetectorRef, Component, DestroyRef, ViewChild, inject } from '@angular/core';
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
import { Router } from '@angular/router';
import { ExpedientesService } from './expedientes.service';

import { environment } from 'src/environments/environment';
import { ProcedimientoService } from '../procedimientos/procedimiento.service';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { AtributosCrear, ProcediPermisos, ProcediPermisosListar } from '../procedimientos/procedimiento';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { NotificationService } from "../../core/service/notification.service";
import { ModalManagerService } from "../../core/service/modal-manager.service";
import { UserSessionService } from "../../core/service/user-session.service";
import { fechaHoyISO } from '../../core/helper/fecha-legacy.helper';
import { mostrarRegistroDocumento } from '../../core/helper/registro-documento-notification.helper';
import * as bootstrap from 'bootstrap';
import {
  buildColumnsIndiceENI,
  buildColumnsListRepre,
  createExpedientesGridRenderers,
  ExpedientesGridRenderContext,
} from './config/expedientes-grid.config';
import { TareaProcedimientoDTO } from '../../core/models/tarea-procedimiento.dto';
import { ExpedientesGridFacade } from './services/expedientes-grid.facade';
import { ExpedientesExpedienteFacade } from './services/expedientes-expediente.facade';
import { ExpedientesInsideFacade, ExpedientesInsideHost } from './services/expedientes-inside.facade';
import {
  AtributoEditable,
  esTipoFecha,
  esTipoNumerico,
  ExpedientesAtributosFacade,
} from './services/expedientes-atributos.facade';
import { ModalInsideAccionesComponent } from './components/modals/modal-inside-acciones/modal-inside-acciones.component';
import { isInsideDryRun, etiquetaEstadoEnvioInside, insideEstadoBadgeClass } from '../../core/constants/inside-simulacion.constants';
import { JqxGridRowEvent } from '../../core/helper/jqx-grid-event.model';


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


  public editExpedientes: boolean = false;
  public formMode: 'crear' | 'editar' | 'ver' = 'crear'
  public formInsideEstado = ''
  public isModificandoExpediente = false

  /** true cuando hay fila seleccionada y la acci?n concreta aplica al estado del expediente */
  accionExpediente(requiere = true): boolean {
    return this.editExpedientes && requiere;
  }

  get formReadonly(): boolean {
    return this.formMode === 'ver'
  }

  get formTitle(): string {
    if (this.formMode === 'editar') return 'Modificar Expediente'
    if (this.formMode === 'ver') return 'Ver Expediente'
    return 'Nuevo Expediente'
  }

  get formSubmitLabel(): string {
    if (this.isCreandoExpediente) return 'Creando…'
    if (this.isModificandoExpediente) return 'Guardando…'
    if (this.formMode === 'editar') return 'Guardar cambios'
    return 'Crear expediente'
  }

  get numeroExpedientePreview(): string {
    const ejercicio = this.nuevoexpediente.ejercicio
    const numero = this.nuevoexpediente.numero
    if (ejercicio != null && String(ejercicio).trim() !== '' && numero != null && String(numero).trim() !== '') {
      return `${ejercicio}/${numero}`
    }
    if (ejercicio != null && String(ejercicio).trim() !== '') {
      return `${ejercicio}/—`
    }
    return 'Se asignará al guardar'
  }

  /** True si el instructor del formulario ya está en las opciones del select. */
  get instructorEnLista(): boolean {
    const actual = this.nuevoexpediente?.instructor
    if (!actual) {
      return true
    }
    return (this.procedipermiso ?? []).some((p) => p.usuario === actual)
  }

  public verExpedientes: boolean = false;
  public title = 'Expedientes';
  public crearmensaje: CrearMensaje = new CrearMensaje();
  public expedientesListado: ExpedienteListar[] = [];
  public cargandoExpedientesListado: boolean = false;
  public atributosleer!: Atributosleer[];
  public atributosEditables: AtributoEditable[] = [];
  public cargandoAtributos: boolean = false;
  public guardandoAtributos: boolean = false;
  public procedipermisolistar!: ProcediPermisosListar[];
  /** Usuarios con permiso de procedimiento (selector Instructor del formulario unificado). */
  public procedipermiso: ProcediPermisos[] = [];
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

      this.expedientesService.getProcedimientos().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        procedimientos => this.procedimientos = procedimientos
      );

      this.procedimientoService.getPermisoProcedi().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        procedipermisos => this.procedipermiso = procedipermisos ?? []
      );

    } else {
      this.notificationService.warning(`Lo sentimos. El usuario  ${this.session.user}  No tiene acceso a Expedientes.`);

    }
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

    if (this.isTareaAsignarInvalid() || this.isPersonaAsignarInvalid() || this.isDescripcionMensajeInvalid()) {
      this.notificationService.incompleteFields();
      return;
    }

    this.crearmensaje.idtarea = this.tareaSeleccionadaAsignar?.id;

    this.notificationService.confirm(
      `¿Confirma ofrecer este expediente a ${this.usuarioTarea} para la tarea "${this.tareaSeleccionadaAsignar?.descripcion}"?`
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignarTramitador();
      }
    });
  }

  private ejecutarAsignarTramitador(): void {
    this.expedienteFacade.ejecutarAsignarTramitador(this);
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

  get verEmailDisplay(): string {
    const email = this.verexpediente?.email
    if (!email || email === '0' || email === 'SinDAtos') {
      return '—'
    }
    return email
  }

  get verFormaNotificacionLabel(): string {
    const texto = this.verexpediente?.formaNotificacion || this.verexpediente?.forNotifTexto
    if (texto) {
      return String(texto)
    }
    const codigo = this.verexpediente?.forNotif
    if (codigo === 0 || codigo === '0') {
      return 'Correo postal'
    }
    if (codigo === 1 || codigo === '1') {
      return 'Telemática'
    }
    return '—'
  }

  get verInteresadoNombreDisplay(): string {
    const persona = this.verexpediente?.personaEntidad
    if (!persona) {
      return '—'
    }
    if (persona.desPerEntid) {
      return persona.desPerEntid
    }
    const nombre = [persona.nombre, persona.apellido1, persona.apellido2]
      .filter((parte) => !!parte && String(parte).trim() !== '')
      .join(' ')
      .trim()
    return nombre || '—'
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
  public cargandoTareasExpediente: boolean = false;
  public tareasExpedienteVacio: boolean = false;
  public tareasExpedienteList: TareaTramiteExpporExpedi[] = [];
  public tituloExp!: string;
  public pruebas: boolean = false;
  public veoAtributos: boolean = false;

  public borraAtributo(attr: AtributoEditable) {
    this.atributosFacade.eliminar(this, attr);
  }

  public listarAtributos() {
    this.atributosFacade.listar(this);
  }

  public actualizarFechaAtributo(attr: AtributoEditable, isoValue: string): void {
    this.atributosFacade.actualizarFecha(attr, isoValue);
  }

  public borraArrayAtributos() {
    this.atributosFacade.cerrarModal(this);
  }

  public envioAtributos() {
    this.atributosFacade.guardar(this);
  }

  public esTipoFechaAtributo = esTipoFecha;
  public esTipoNumericoAtributo = esTipoNumerico;

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
   * Doble clic: editar ficha si está ABIERTO; si no, ver en solo lectura.
   */
  public onExpedienteDoubleClick(rowData: ExpedienteListar): void {
    this.marcaExpedienteNuevo(rowData)
    this.idexpediente = rowData.id
    this.expedientesService.getExpediente(this.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (verexpediente) => {
        this.verexpediente = verexpediente
        this.veoCorreoVacio()
        const editable = String(rowData.estado ?? verexpediente.estado ?? '').toUpperCase() === 'ABIERTO'
        this.abrirFormularioDesdeSeleccion(editable ? 'editar' : 'ver', rowData)
      },
      error: () => {
        this.notificationService.error('No se pudo cargar el expediente')
      },
    })
  }

  /**
   * Abre el formulario unificado en modo ver (compatibilidad con acciones previas).
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
        this.veoCorreoVacio();
        this.abrirFormularioDesdeSeleccion('ver');
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

  public marcaExpedienteNuevo(rowData: ExpedienteListar) {
    this.expedienteFacade.marcarExpedienteSeleccionado(this, rowData)
    this.idExpedienteParaInside = rowData.id
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


  public seleccionoRepre!: string;

  public selecrepresentante(event: JqxGridRowEvent<{ idHisPerso: number; idPerso: number }>): void {
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

  public buscarInteresado(): void {
    this.expedienteFacade.buscarInteresado(this)
  }

  public handleFormaNotificacionChange(): void {
    this.expedienteFacade.handleFormaNotificacionChange(this)
  }

  public onDocumentoInteresadoInput(): void {
    this.expedienteFacade.onDocumentoInteresadoInput(this)
  }

  /** @deprecated Preferir `buscarInteresado`. */
  public solicitadni(dni: string): void {
    this.expedienteFacade.solicitadni(this, dni);
  }

  public selecTipPerso(valor: any): void {
    this.expedienteFacade.selecTipPerso(valor);
  }
  public limpiadatosnuevoexpediente() {
    this.nuevoexpediente = new NuevoExpediente();
    this.nuevoexpediente.forma_apertura = '';
    this.nuevoexpediente.procedimiento = '';
    this.nuevoexpediente.formaNotifi = null as unknown as number;
    this.nuevoexpediente.usuario = '';
    this.nuevoexpediente.titulo = '';
    this.nuevoexpediente.email = '';
    this.nuevoexpediente.estado = 'ABIERTO';
    this.nuevoexpediente.instructor = this.session.user ?? '';
    this.nuevoexpediente.numero = undefined as unknown as number;
    this.formInsideEstado = '';
    this.consultadni = new ConsultaDni();
    this.representanteexplistar = new RepresentanteExpLIstar()
    this.expedienteFacade.resetSolicitudDni();


    // Resetear validaciones
    this.mostrarValidacionesExpediente = false;
    this.isCreandoExpediente = false;
    this.isModificandoExpediente = false;
    this.FechaSistema();

  }

  public abrirFormularioCrear(): void {
    this.formMode = 'crear'
    this.limpiadatosnuevoexpediente()
    this.modalManagerService.openModal('nexpedienteModal')
  }

  public abrirFormularioDesdeSeleccion(mode: 'editar' | 'ver', row?: ExpedienteListar): void {
    this.formMode = mode
    this.mostrarValidacionesExpediente = false
    this.isModificandoExpediente = false
    this.hydrateFormularioDesdeSeleccion(row)
    this.modalManagerService.openModal('nexpedienteModal')
  }

  public hydrateFormularioDesdeSeleccion(row?: ExpedienteListar): void {
    const v = this.verexpediente
    const persona = v?.personaEntidad
    this.nuevoexpediente.titulo = v?.titulo ?? ''
    this.nuevoexpediente.fechaInicio = this.toDateInputValue(v?.fecInicio)
    this.nuevoexpediente.forma_apertura = v?.formaApertura ?? ''
    this.nuevoexpediente.procedimiento = String(v?.procedimiento?.id || v?.idProc || '')
    this.nuevoexpediente.formaNotifi = this.toFormaNotifiNumber(v)
    this.nuevoexpediente.email = this.verEmailDisplay === '—' ? '' : (this.verEmailDisplay || '')
    this.nuevoexpediente.usuario = persona?.numDocum ?? ''
    this.nuevoexpediente.instructor = v?.instructor ?? ''
    this.nuevoexpediente.estado = v?.estado || 'ABIERTO'
    this.nuevoexpediente.ejercicio = v?.ejercicio
    this.nuevoexpediente.numero = v?.numero
    this.nuevoexpediente.idPerso = persona?.idPerso ?? null
    this.nuevoexpediente.idHisPerso = persona?.idHisPerso ?? null
    this.formInsideEstado = row?.insideEstado || ''

    if (persona?.numDocum || persona?.desPerEntid || persona?.nombre) {
      this.expedienteFacade.dniok = true
      this.expedienteFacade.existepersonaentidad = false
      this.expedienteFacade.nombredni = this.verInteresadoNombreDisplay || persona.desPerEntid || persona.nombre || ''
      this.expedienteFacade.direcciondni = persona.dirPosta || ''
      this.expedienteFacade.cpdni = persona.codPosta != null ? String(persona.codPosta) : ''
      this.expedienteFacade.provinciadni = persona.provincia || ''
      this.expedienteFacade.nommunicipiodni = persona.municipio || ''
    } else {
      this.expedienteFacade.resetSolicitudDni()
    }
  }

  public syncEdicionDesdeFormulario(): void {
    this.editexpediente.titulo = this.nuevoexpediente.titulo
    this.editexpediente.fecInicio = this.nuevoexpediente.fechaInicio
    this.editexpediente.forma_apertura = this.nuevoexpediente.forma_apertura
    this.editexpediente.procedimiento = String(this.nuevoexpediente.procedimiento ?? '')
    this.editexpediente.dni = this.nuevoexpediente.usuario
    this.editexpediente.email = this.nuevoexpediente.email
    this.editexpediente.forNotif = this.nuevoexpediente.formaNotifi
    this.editexpediente.instructor = this.nuevoexpediente.instructor
    this.editexpediente.estado = this.nuevoexpediente.estado
    if (this.nuevoexpediente.idPerso != null) {
      this.editexpediente.idPerso = this.nuevoexpediente.idPerso
    }
  }

  public cerrarFormularioExpediente(): void {
    this.mostrarValidacionesExpediente = false
    this.isCreandoExpediente = false
    this.isModificandoExpediente = false
    if (this.formMode === 'crear') {
      this.limpiadatosnuevoexpediente()
    }
    this.formMode = 'crear'
    this.modalManagerService.closeModal('nexpedienteModal')
  }

  public validateAndSubmitFormularioExpediente(): void {
    if (this.formMode === 'ver') {
      return
    }
    if (this.formMode === 'editar') {
      this.mostrarValidacionesExpediente = true
      this.syncEdicionDesdeFormulario()
      if (
        this.isTituloExpedienteInvalid()
        || this.isFechaExpedienteInvalid()
        || this.isFormaAperturaInvalid()
        || this.isProcedimientoExpedienteInvalid()
        || this.isFormaNotificacionInvalid()
        || this.isInteresadoDNIInvalid()
        || this.isEmailExpedienteInvalid()
      ) {
        this.notificationService.incompleteFields()
        return
      }
      this.expedienteFacade.onEditarExpedienteSubmit(this)
      return
    }
    this.onCrearExpedienteSubmit()
  }

  private toDateInputValue(value: unknown): string {
    if (!value) {
      return ''
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.substring(0, 10)
    }
    const d = new Date(value as string)
    if (isNaN(d.getTime())) {
      return ''
    }
    return d.toISOString().substring(0, 10)
  }

  private toFormaNotifiNumber(v: VerExpediente | null | undefined): number {
    if (!v) {
      return null as unknown as number
    }
    if (v.forNotif === 0 || v.forNotif === '0') return 0
    if (v.forNotif === 1 || v.forNotif === '1') return 1
    const texto = String(v.formaNotificacion || v.forNotifTexto || '').toLowerCase()
    if (texto.includes('telem')) return 1
    if (texto.includes('postal') || texto.includes('correo')) return 0
    return null as unknown as number
  }

  // Gesti?n de modales
  public abrirModal(modalId: string): void {
    if (modalId === 'nexpedienteModal') {
      this.abrirFormularioCrear();
      return;
    } else if (modalId === 'cancelarExpModal') {
      this.fechacancelacionexpedi = fechaHoyISO();
    } else if (modalId === 'cerrarExpModal') {
      this.fechacierreexpedi = fechaHoyISO();
      this.serieDocumental = this.serieDocumental ?? '';
    }
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    // Resetea validaciones específicas según el modal
    if (modalId === 'nexpedienteModal') {
      this.cerrarFormularioExpediente();
      return;
    }

    this.modalManagerService.closeModal(modalId);
  }

  public isDescripcionMensajeInvalid(): boolean {
    return this.mostrarValidacionesAsignarTramitador && (!this.crearmensaje.descripcion || this.crearmensaje.descripcion.trim() === '');
  }

  limpiarDatosAsignarTramitador(): void {
    this.isAsignandoTramitador = false;
    this.mostrarValidacionesAsignarTramitador = false;
    this.tareasAsignarTramitador = [];
    this.permisosAsignarTramitador = [];
    this.tareaSeleccionadaAsignar = null;
    this.personaSeleccionadaAsignar = null;
    this.usuarioPermiso = undefined;
    this.usuarioTarea = undefined;
    this.veoPermisoProcedi = false;
    this.crearmensaje = new CrearMensaje();
  }

  // Funciones específicas para modales con lógica previa
  public abrirModalTareasExpediente(): void {
    const idExp = this.getExpedienteIdSeleccionado();
    if (!idExp) {
      this.notificationService.warning('Seleccione un expediente');
      return;
    }

    this.expEjerNum = `${this.ejerexpe ?? ''}/${this.numExp ?? ''}`;
    this.cargandoTareasExpediente = true;
    this.tareasExpedienteVacio = false;
    this.tareasExpedienteList = [];
    this.numeroArchivo = undefined as unknown as number;
    this.abrirModal('TareaExpedienteModal');

    this.expedientesService.getTareaTramiteExpeporExpe(idExp).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareas) => {
        this.tareasExpedienteList = tareas ?? [];
        this.tareasExpedienteVacio = this.tareasExpedienteList.length === 0;
        this.cargandoTareasExpediente = false;
      },
      error: () => {
        this.tareasExpedienteList = [];
        this.tareasExpedienteVacio = true;
        this.cargandoTareasExpediente = false;
      },
    });
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

  public fechacancelacionexpedi!: string;

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

  /** Modificador de `estado-badge` según el estado de envío INSIDE (listado de expedientes). */
  public insideBadgeClass(estado: string): string {
    return insideEstadoBadgeClass(estado);
  }

  /** Etiqueta visible: SIMULADO se muestra como ENVIADO (demo transparente). */
  public etiquetaEstadoInside(estado: string): string {
    return etiquetaEstadoEnvioInside(estado);
  }

  /** Resalta en el listado la fila del expediente actualmente seleccionado. */
  public readonly expedienteRowClass = (row: ExpedienteListar): Record<string, boolean> => ({
    'table-active': row.id === this.idexpediente,
  });

  public readonly procedimientoDescripcionValue = (row: ExpedienteListar): string =>
    row.procedimiento?.descripcion ?? '';

  public readonly interesadoNombreValue = (row: ExpedienteListar): string =>
    row.personaEntidad?.desPerEntid ?? '';

  private readonly insideListHost = (): ExpedientesInsideHost => this as unknown as ExpedientesInsideHost;

  public get usuario(): string {
    return this.session.user ?? '';
  }

  public puedeEnviarInside(): boolean {
    return this.insideFacade.puedeEnviarInside(this.insideListHost());
  }

  public idExpedienteParaInside: number | null = null;

  @ViewChild('insideAcciones') insideAcciones?: ModalInsideAccionesComponent

  get insideAccionesEnviando(): boolean {
    return !!this.insideAcciones?.insideEnviando
  }

  /** Prepara el host INSIDE del expediente seleccionado (sin abrir el modal Acciones). */
  public ensureInsideAccionesHost(): boolean {
    const id = this.getExpedienteIdSeleccionado() || this.idexpediente
    if (!id) {
      this.notificationService.warning('Seleccione un expediente')
      return false
    }
    this.idExpedienteParaInside = Number(id)
    this.cdr.detectChanges()
    return true
  }

  public handleInsideHistorialDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleVerHistorialEnvios())
  }

  public handleInsideValidarDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleValidarExpediente())
  }

  public handleInsideExpedienteDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleEnviarExpedienteCompleto())
  }

  public handleInsideAltaXmlDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleAltaExpedienteEniXml())
  }

  public handleInsideDocumentosDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleEnviarDocumentosExpediente())
  }

  public handleInsideRemisionDesdeListado(): void {
    if (!this.ensureInsideAccionesHost()) {
      return
    }
    setTimeout(() => this.insideAcciones?.handleAbrirModalRemisionJusticia())
  }

  /** @deprecated El listado ya muestra las acciones INSIDE en la toolbar. */
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
    this.router.navigate(['/expedientes', this.idexpediente, 'tramitar'], {
      state: { returnUrl: this.router.url.split('?')[0] || '/expedientes' },
    })
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
    public expedienteFacade: ExpedientesExpedienteFacade,
    private insideFacade: ExpedientesInsideFacade,
    private atributosFacade: ExpedientesAtributosFacade,
  ) {
    this.gridRenderContext.setUsuarioTarea = (id) => this.session.setUsuarioTarea(String(id));
    this.gridFacade.initGridSources(this, this.session.user ?? '');
  }

  private readonly gridRenderContext: ExpedientesGridRenderContext = {};
  private readonly gridRenderers = createExpedientesGridRenderers(this.gridRenderContext);
  columnsListRepre = buildColumnsListRepre(this.gridRenderers);
  columnsIndiceENI = buildColumnsIndiceENI(this.gridRenderers);
  public localizationObject: any = jqxGrid_ES;
  sourceListRepre!: any;
  sourceIndiceENI!: any;

  public syncGridRenderContext(): void {
    this.gridRenderContext.valorEstado = this.valorEstado;
  }

  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSistema() {
    this.fsistema = new Date().toLocaleDateString()
    this.fechaSistema = fechaHoyISO()
    this.nuevoexpediente.fechaInicio = this.fechaSistema
  }


  async ngOnInit() {
    this.FechaSistema();
    if (this.consultadni.idPerso || this.consultadni.idHisPerso) {
      this.getrepresentanteexpediente(this.consultadni.idPerso, this.consultadni.idHisPerso)

    }


    this.verpagina();
    this.insideFacade.actualizarResumenPendientes(this.insideListHost());
  }


  public clicktareExpediente(tarea: TareaTramiteExpporExpedi) {
    this.numeroArchivo = tarea.archivo != null ? Number(tarea.archivo) : undefined as unknown as number;
  }


  public fechaTramite!: any;
  public fechatramite!: any;

  // ===== Asignar Tramitador: paso 1 (tarea del procedimiento) y paso 2 (persona con permiso) =====
  public tareasAsignarTramitador: TareaProcedimientoDTO[] = [];
  public permisosAsignarTramitador: ProcediPermisosListar[] = [];
  public tareaSeleccionadaAsignar: TareaProcedimientoDTO | null = null;
  public personaSeleccionadaAsignar: ProcediPermisosListar | null = null;
  public cargandoTareasAsignar = false;
  public cargandoPermisosAsignar = false;
  public errorTareasAsignar = false;
  public errorPermisosAsignar = false;
  public usuarioTarea!: any;
  public usuarioPermiso!: any;
  public veoPermisoProcedi: boolean = false;

  /**
   * Se llama al abrir el modal (y al seleccionar una fila del listado, para tener
   * las tareas listas de antemano) — antes esto dependía de un click en el campo
   * "Asunto", que no tiene relación funcional con cargar tareas.
   */
  public lanzaTareaProcedi(): void {
    this.tareasAsignarTramitador = [];
    this.permisosAsignarTramitador = [];
    this.tareaSeleccionadaAsignar = null;
    this.personaSeleccionadaAsignar = null;
    this.usuarioPermiso = undefined;
    this.usuarioTarea = undefined;
    this.veoPermisoProcedi = false;
    this.errorTareasAsignar = false;

    if (!this.idProcedimiento) {
      return;
    }

    this.cargandoTareasAsignar = true;
    this.expedientesService.getTareasProcedimientoListar(this.idProcedimiento).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareas) => {
        this.tareasAsignarTramitador = tareas ?? [];
        this.cargandoTareasAsignar = false;
      },
      error: () => {
        this.tareasAsignarTramitador = [];
        this.errorTareasAsignar = true;
        this.cargandoTareasAsignar = false;
      },
    });
  }

  public seleccionarTareaAsignar(tarea: TareaProcedimientoDTO | null): void {
    if (!tarea || this.tareaSeleccionadaAsignar?.id === tarea.id) {
      return;
    }
    this.tareaSeleccionadaAsignar = tarea;
    this.personaSeleccionadaAsignar = null;
    this.usuarioPermiso = undefined;
    this.usuarioTarea = undefined;
    this.veoPermisoProcedi = true;
    this.permisosAsignarTramitador = [];
    this.errorPermisosAsignar = false;
    this.cargandoPermisosAsignar = true;

    this.expedientesService.getPermisosTareaListar(tarea.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (permisos) => {
        this.permisosAsignarTramitador = permisos ?? [];
        this.cargandoPermisosAsignar = false;
      },
      error: () => {
        this.permisosAsignarTramitador = [];
        this.errorPermisosAsignar = true;
        this.cargandoPermisosAsignar = false;
      },
    });
  }

  public seleccionarPersonaAsignar(persona: ProcediPermisosListar | null): void {
    if (!persona) {
      return;
    }
    this.personaSeleccionadaAsignar = persona;
    this.usuarioPermiso = persona.idOrgUsuar;
    this.usuarioTarea = persona.usuario;
  }

  public isTareaAsignarInvalid(): boolean {
    return this.mostrarValidacionesAsignarTramitador && !this.tareaSeleccionadaAsignar;
  }

  public isPersonaAsignarInvalid(): boolean {
    return this.mostrarValidacionesAsignarTramitador
      && !!this.tareaSeleccionadaAsignar
      && !this.personaSeleccionadaAsignar;
  }


  public limpioSourceTareasExpediente(): void {
    this.tareasExpedienteList = [];
    this.cargandoTareasExpediente = false;
    this.tareasExpedienteVacio = false;
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
