import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { SolicitudesService } from './solicitudes.service';
import { SolicitudListar, ProcediPermisos, EditarSolicitud, DocumentosListar, UsuPermisos, ExpedienteListar2, EditExpediente, VerSolicitud, CreaSolicitudNuevo } from './models';
import { ExpedientesService } from '../expedientes/expedientes.service';
import { CrearPersonaEntidad, CrearRepresentante, NuevoExpediente, Procedimiento, RegistroDocumento, RepresentanteExpLIstar, VerExpediente } from '../expedientes/expedientes';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { UserSessionService } from '../../core/service/user-session.service';
import { formatearFechaDDMMYYYY, fechaHoyISO, ejercicioActual } from '../../core/helper/fecha-legacy.helper';
import { mostrarRegistroDocumento } from '../../core/helper/registro-documento-notification.helper';
import { environment } from 'src/environments/environment';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import {
  buildColumnsListDoc,
  buildColumnsListExpe,
  buildColumnsListRepre,
  buildColumnsSoliciPendi,
  createSolicitudesGridRenderers,
  createSolicitudesPendientesLocalSource,
  SolicitudesGridRenderContext,
} from './config/solicitudes-grid.config';
import { SolicitudesGridFacade } from './services/solicitudes-grid.facade';
import { SolicitudesSolicitudFacade } from './services/solicitudes-solicitud.facade';
import { SolicitudesDocumentosFacade } from './services/solicitudes-documentos.facade';
import { SolicitudesExpedienteFacade } from './services/solicitudes-expediente.facade';
import { SolicitudesPersonaFacade } from './services/solicitudes-persona.facade';
import { SolicitudesPageFacade } from './services/solicitudes-page.facade';
import { JqxGridRowEvent } from '../../core/helper/jqx-grid-event.model';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { IflowGridLocalization, IflowGridSource } from 'src/app/shared/components/iflow-grid/iflow-grid.component';
import { PROVIN, MUNICIO } from 'src/app/core/constants/datos';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
  providers: [
    SolicitudesGridFacade,
    SolicitudesDocumentosFacade,
    SolicitudesSolicitudFacade,
    SolicitudesExpedienteFacade,
    SolicitudesPersonaFacade,
    SolicitudesPageFacade,
  ],
})
export class SolicitudesComponent {

  /** Asignado desde SolicitudesModalsAccionesComponent (#content / #fileInput) */
  content: ElementRef | undefined
  fileInput: ElementRef | undefined

  public title = 'Solicitudes';
  public edicion: boolean = false;
  public activainiciaExpedi: boolean = false;
  public edicionPermisos: boolean = false;
  public vermenu: boolean = false;
  public listadocmenu: boolean = false;
  public puedesver: boolean = false;
  public menuexpedientes: boolean = false;
  public idsolicitud!: number;
  public expsolicitud!: string;
  public idexpedienteAsoc!: number;
  public registrodocumento: RegistroDocumento = new RegistroDocumento();
  public solicitudlistar!: SolicitudListar[];
  public versolicitud: VerSolicitud = new VerSolicitud();
  public crearpersonaentidad: CrearPersonaEntidad = new CrearPersonaEntidad()
  public crearrepresentante: CrearRepresentante = new CrearRepresentante()
  public usupermisos!: UsuPermisos[];
  public procedipermisos: ProcediPermisos = new ProcediPermisos();
  public verexpediente: VerExpediente = new VerExpediente()
  procedimientos!: Procedimiento[];
  public documentoslistar!: DocumentosListar[];
  public documentosSolicitud: DocumentosListar[] = [];
  public documentosCargando = false;
  public expedienteslistar!: ExpedienteListar2[];
  procedipermiso!: ProcediPermisos[];
  public nuevoexpediente: NuevoExpediente = new NuevoExpediente();
  public selected = new Date("dd/mm/aaaa");
  public lafecha = new Date().toLocaleString();
  public ejercicio!: string | number;
  public creasolicitud: CreaSolicitudNuevo = new CreaSolicitudNuevo();
  public editasolicitud: EditarSolicitud = new EditarSolicitud();
  public editexpediente: EditExpediente = new EditExpediente();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public statusGetSolicitudes!: number;
  public descargafichero!: string | Blob | null;
  public progreso: number = 0;
  public intervalo!: number;
  public page!: number;
  public npagina: number = 5;
  public nombre!: string;
  public apellido1!: string;
  public apellido2!: string;
  public usuarioAsignado!: string;
  public isAsignando: boolean = false;
  public isRechazando: boolean = false;
  public isIniciandoExpediente: boolean = false;
  public isModificandoSolicitud: boolean = false;
  public mostrarValidacionesNuevaSolicitud = false
  filtroasunto!: string;
  filtrointeresado!: string;
  filtrorepresentante!: string;
  filtrodepartamento!: string;
  filtroasignado!: string;
  filtroestado!: string;
  percentDone!: number;
  nomArchiv!: string;
  uploadSuccess!: boolean;
  url!: string;
  archivoSubido!: File | string | null;
  nombreArchivoSubido!: string;
  base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  mes: number = new Date().getMonth();
  dia: number = new Date().getDate()
  fechaarchivo: Date = new Date();
  descripcionArchivo!: string;
  iddocumento!: number | null;
  name!: string;
  id!: number;
  myimage!: unknown;
  base64code!: string;

  //EXPEDIENTES

  idexpediente!: number;
  intructorExpediente!: string;
  public recargapagina() {
    this.gridFacade.refreshSolicitudesList(this, true)
  }

  verpagina() {
    this.pageFacade.cargarPagina(this)
  }

  public updateProgressBar(): void {
    const bar = document.getElementById('barprogreso')
    if (!bar) { return }
    bar.style.width = `${this.progreso}%`
    bar.setAttribute('aria-valuenow', String(this.progreso))
  }

  public abreArchivo(url: unknown): void {
    const href = String(url ?? this.descargafichero ?? '').trim()
    if (!href) {
      this.notificationService.warning({
        title: 'Sin archivo',
        text: 'Seleccione un documento del listado para descargarlo.',
      })
      return
    }
    this.documentosFacade.abrirDocumentoSeleccionado(this, href, this.nombreArchivoSubido)
  }

  public verDocumentoSeleccionado(): void {
    this.documentosFacade.abrirDocumentoSeleccionado(this)
  }

  selectedFile: File | null = null;

  upload(event: Event, id: number): void {
    this.documentosFacade.seleccionarArchivo(this, event, id)
  }

  guardarDocumento(): void {
    this.documentosFacade.guardar(this);
  }

  public clearUploadForm(): void {
    this.documentosFacade.clearForm(this)
  }

  public cancelarDocumento(): void {
    this.clearUploadForm();
  }

  public limpiaDatosEditarSolicitudes() {
    this.representanteexplistar = new RepresentanteExpLIstar();
    this.editasolicitud = new EditarSolicitud();
    this.direccionRepresentante = "";
    this.representanteexplistar.dirPosta = "";
  }

  public getrepresentanteexpediente(idPerso: number, idHisPerso: number) {
    this.personaFacade.consultarRepresentanteExpediente(this, idPerso, idHisPerso);
  }

  public cadenaEstadoSolicitudes: string;

  public limpiacadenaEstadoSolicitudes() {
    this.cadenaEstadoSolicitudes = "";
  }

  public valorEstato(value: string | number) {
    this.pageFacade.filtrarPorEstado(this, value)
  }

  filtroUsuarios() {
    this.pageFacade.aplicarFiltroUsuarios(this)
  }

  public subidaArchivo: boolean = false;
  public relleno: string = 'Datos de prueba';

  constructor(public solicitudesServices: SolicitudesService,
    public expedientesService: ExpedientesService,
    public router: Router,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private gridFacade: SolicitudesGridFacade,
    private solicitudFacade: SolicitudesSolicitudFacade,
    private documentosFacade: SolicitudesDocumentosFacade,
    private expedienteFacade: SolicitudesExpedienteFacade,
    public readonly personaFacade: SolicitudesPersonaFacade,
    private pageFacade: SolicitudesPageFacade,
  ) {
    this.gridFacade.initGridSources(this);
    this.sourceSolpen = createSolicitudesPendientesLocalSource(this.solicitudlistar ?? []);
    this.sourceSoliciPendientes = new jqx.dataAdapter(this.sourceSolpen);
  }

  get depart(): string | null {
    return this.session.department;
  }

  get idOrgEleme(): string | null {
    return this.session.idOrgEleme;
  }

  get hasSolicitudSeleccionada(): boolean {
    return this.vermenu === true && !!this.idsolicitud
  }

  get estadoSolicitudSeleccionada(): string {
    return this.editasolicitud?.estado ?? ''
  }

  get estadoSolicitudLabel(): string {
    const estado = this.estadoSolicitudSeleccionada
    if (estado === 'PENDIENTE') return 'Pendiente'
    if (estado === 'ACEPTADA') return 'Aceptada'
    if (estado === 'RECHAZADA') return 'Rechazada'
    return estado || 'Sin estado'
  }

  get canEditarSolicitud(): boolean {
    return this.hasSolicitudSeleccionada && this.modificoSolicitud
  }

  get canEliminarSolicitud(): boolean {
    return this.hasSolicitudSeleccionada && !this.expsolicitud
  }

  get canAsignarInstructor(): boolean {
    return this.hasSolicitudSeleccionada && this.veoIniciarExp && this.veoRechazaSolici
  }

  get canRechazarSolicitud(): boolean {
    return this.hasSolicitudSeleccionada && this.veoIniciarExp && this.veoRechazaSolici
  }

  get canIniciarExpediente(): boolean {
    return this.hasSolicitudSeleccionada && this.veoIniciarExp && this.veoRechazaSolici
  }

  abrirEdicionSolicitudSeleccionada(): void {
    if (!this.hasSolicitudSeleccionada) {
      return
    }
    if (!this.modificoSolicitud) {
      this.notificationService.warning('Esta solicitud no puede ser editada en su estado actual')
      return
    }
    this.versolici(this.idsolicitud)
    this.modalManagerService.openModal('edicionSolicitudModal')
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
    // Resetear validaciones específicas según el modal
    if (modalId === 'asignarModal') {
      this.solicitudFacade.mostrarValidacionesAsignar = false;
    } else if (modalId === 'rechazaSoliModal') {
      this.limpiarDatosRechazar();
    } else if (modalId === 'iniciarExpedieModal') {
      this.expedienteFacade.mostrarValidacionesIniciarExpediente = false;
    } else if (modalId === 'edicionSolicitudModal') {
      this.solicitudFacade.mostrarValidacionesModificarSolicitud = false;
    }
    this.modalManagerService.closeModal(modalId);
  }

  public limpiarDatosRechazar(): void {
    this.solicitudFacade.mostrarValidacionesRechazar = false;
    this.isRechazando = false;
    if (this.editasolicitud) {
      this.editasolicitud.motivoRechazo = '';
    }
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
  }

  ngOnInit() {
    this.verpagina();
    this.FechaSolicitud();


  };



  public selecDocumento(id: number | null, nombre: string): void {
    this.iddocumento = id;
    this.listadocmenu = true;
    this.nombreArchivoSubido = nombre;

    this.progreso = this.progreso + 20;
    this.updateProgressBar();





  }

  public selecDocumentoNuevos(event: JqxGridRowEvent<DocumentosListar>): void {
    this.documentosFacade.seleccionarDocumentoNuevo(this, event)
  }

  public selecExpediente(id: number): void {
    this.idexpediente = id;
    this.menuexpedientes = true;








  }

  public versolici(id: number): void {
    this.solicitudFacade.versolici(this, id);
  }

  public limpiadatosIniciarExpediente() {
    this.nuevoexpediente = new NuevoExpediente()
    this.nuevoexpediente.procedimiento = ''
    this.nuevoexpediente.formaNotifi = 0
    this.expedienteFacade.mostrarValidacionesIniciarExpediente = false
    this.isIniciandoExpediente = false
  }

  public prepararIniciarExpediente(): void {
    this.limpiadatosIniciarExpediente()
    const titulo = this.asuntoSolicitud || this.versolicitud?.asunto || ''
    this.nuevoexpediente.titulo = titulo
    this.asuntoexpedi = titulo
    this.FechaSistema = new Date().toLocaleDateString()
    this.fechanuevoExpedi = fechaHoyISO()
    this.solicitudFacade.obtenerFormaNotificacionInteresado(this)
  }

  public fecha: Date = new Date()

  public fecha2: string = new Date().toLocaleDateString()
  public FechaSistema!: string;

  public asuntoexpedi!: string;
  public cambioasuntoexpe(dato: string) {
    this.versolicitud.asunto = dato;
    this.asuntoexpedi = dato;
    this.nuevoexpediente.titulo = this.asuntoexpedi;
  }

  public fechanuevoExpedi = fechaHoyISO()

  public iniciarExpediente(): void {
    this.expedienteFacade.iniciarLegacy(this);
  }

  public descargarDocumento(archivo: string): void {

    this.nombreArchivoSubido = archivo;
  }

  public editExpediente() {
    this.expedienteFacade.editExpediente(this)
  }

  public creaExpediente() {
    this.expedienteFacade.creaExpediente(this)
  }

  public resultacrearsolici: string;

  public borraDatosSolicitud() {
    this.creasolicitud = new CreaSolicitudNuevo()
    this.creasolicitud.usuario = ''
    this.creasolicitud.tipPerso = ''
    this.creasolicitud.codProvi = ''
    this.creasolicitud.codMunic = ''
    this.creasolicitud.codProviRepre = ''
    this.creasolicitud.codMunicRepre = ''
    this.crearpersonaentidad = new CrearPersonaEntidad()
    this.representanteexplistar = new RepresentanteExpLIstar()
    this.seleccionoRepre = ''
    this.personaFacade.resetWizardNuevaSolicitud()
    this.FechaSolicitud()
  }

  /** Prepara el modal Nueva Solicitud: estado limpio + fecha de hoy (sin form.reset). */
  public prepararNuevaSolicitud(): void {
    this.mostrarValidacionesNuevaSolicitud = false
    this.borraDatosSolicitud()
    const form = document.getElementById('formNuevaSolicitud') as HTMLFormElement | null
    form?.classList.remove('was-validated')
  }

  public fsistema: string = new Date().toLocaleDateString()
  public fechaSistema!: string;

  public FechaSolicitud() {
    this.fsistema = new Date().toLocaleDateString()
    this.fechaSistema = fechaHoyISO()
    this.creasolicitud.fecInicio = this.fechaSistema
  }

  public crearPersonaEntidad(dni: string) {
    this.personaFacade.crearPersonaEntidad(this, dni);
  }

  /**
   * Wizard de tipo de documento / provincia-municipio / alta de representante.
   * El estado (selectnombre, selectape1..., municiflitro, cambioRepresentante...)
   * y la lógica viven en SolicitudesPersonaFacade.
   */
  public selecTipPerso(valor: string | number): void {
    this.personaFacade.selecTipPerso(valor);
  }

  // provincias y municipios
  public provin: typeof PROVIN = PROVIN;
  public municio: typeof MUNICIO = MUNICIO;

  public gestimunicip(id: string | number | null | undefined): void {
    this.personaFacade.gestimunicip(id);
  }

  public cambiamosRepre(): void {
    this.personaFacade.cambiamosRepre()
  }

  public cancelarAltaRepresentante(): void {
    this.personaFacade.cancelarAltaRepresentante(this)
  }

  public buscarInteresado(): void {
    this.personaFacade.consultarInteresado(this, this.creasolicitud.numDocum)
  }

  public seleccionarRepresentanteLista(item: RepresentanteExpLIstar): void {
    this.personaFacade.seleccionarRepresentanteLista(this, item)
  }

  public validateAndCreateSolicitud(event: Event): void {
    event.preventDefault()

    this.mostrarValidacionesNuevaSolicitud = true

    const form = event.target as HTMLFormElement
    const numDocum = String(this.creasolicitud.numDocum ?? '').trim()
    const dniVacio = !numDocum
    const interesadoSinResolver =
      !dniVacio &&
      !this.personaFacade.dniok &&
      !this.personaFacade.existepersonaentidad
    const camposInvalidos =
      this.isAsuntoNuevaInvalid() ||
      this.isFechaNuevaInvalid() ||
      this.isAsignadoNuevaInvalid() ||
      this.isDniNuevaInvalid()

    if (camposInvalidos || interesadoSinResolver) {
      form?.classList.add('was-validated')
      if (dniVacio) {
        this.notificationService.incompleteFields('El DNI del interesado es obligatorio')
      } else if (interesadoSinResolver) {
        this.notificationService.incompleteFields(
          'Busca el interesado (botón Buscar) antes de guardar',
        )
      } else {
        this.notificationService.incompleteFields()
      }
      this.modalManagerService.keepModalOpen('nsolicitudModal')
      this.focusPrimerCampoInvalidoNuevaSolicitud()
      return
    }

    this.creaSolicitud()
  }

  public isAsuntoNuevaInvalid(): boolean {
    return this.mostrarValidacionesNuevaSolicitud && !String(this.creasolicitud.asunto ?? '').trim()
  }

  public isFechaNuevaInvalid(): boolean {
    return this.mostrarValidacionesNuevaSolicitud && !this.creasolicitud.fecInicio
  }

  public isAsignadoNuevaInvalid(): boolean {
    return this.mostrarValidacionesNuevaSolicitud && !String(this.creasolicitud.usuario ?? '').trim()
  }

  public isDniNuevaInvalid(): boolean {
    return this.mostrarValidacionesNuevaSolicitud && !String(this.creasolicitud.numDocum ?? '').trim()
  }

  public handleBuscarInteresado(): void {
    this.buscarInteresado()
  }

  public handleAnadirRepresentante(): void {
    this.cambiamosRepre()
  }

  public handleCancelarAltaRepresentante(): void {
    this.cancelarAltaRepresentante()
  }

  private focusPrimerCampoInvalidoNuevaSolicitud(): void {
    const fieldIds = [
      this.isAsuntoNuevaInvalid() ? 'soli-alta-asunto' : null,
      this.isFechaNuevaInvalid() ? 'soli-alta-fecha' : null,
      this.isAsignadoNuevaInvalid() ? 'soli-alta-asignado' : null,
      this.isDniNuevaInvalid() ? 'soli-alta-interesado-doc' : null,
    ].filter((id): id is string => !!id)

    const firstId = fieldIds[0] ?? 'soli-alta-interesado-doc'
    const el = document.getElementById(firstId) as HTMLElement | null
    el?.focus()
  }

  public limpiarErroresSolicitud(): void {
    this.prepararNuevaSolicitud()
  }

  public creaSolicitud(): void {
    this.solicitudFacade.crear(this);
  }




  public asignara(id: number): void {
    this.solicitudFacade.asignar(this, id);
  };

  /**
   * Validaciones y envío de los formularios de asignar/rechazar/modificar/iniciar expediente.
   */
  public isUsuarioAsignadoInvalid(): boolean {
    return this.solicitudFacade.isUsuarioAsignadoInvalid(this);
  }

  public isMotivoRechazoInvalid(): boolean {
    return this.solicitudFacade.isMotivoRechazoInvalid(this);
  }

  public isTituloExpedienteInvalid(): boolean {
    return this.expedienteFacade.isTituloExpedienteInvalid(this);
  }

  public isProcedimientoInvalid(): boolean {
    return this.expedienteFacade.isProcedimientoInvalid(this);
  }

  public isAsuntoModificarInvalid(): boolean {
    return this.solicitudFacade.isAsuntoModificarInvalid(this);
  }

  public isFechaModificarInvalid(): boolean {
    return this.solicitudFacade.isFechaModificarInvalid(this);
  }

  public isDniModificarInvalid(): boolean {
    return this.solicitudFacade.isDniModificarInvalid(this);
  }

  public onAsignarSubmit(): void {
    this.solicitudFacade.onAsignarSubmit(this);
  }


  public onRechazarSubmit(): void {
    this.solicitudFacade.onRechazarSubmit(this);
  }

  public onIniciarExpedienteSubmit(): void {
    this.expedienteFacade.onIniciarExpedienteSubmit(this);
  }

  public onModificarSolicitudSubmit(): void {
    this.solicitudFacade.onModificarSolicitudSubmit(this);
  }

  limpiarDatosModificar(): void {
    this.limpiaDatosEditarSolicitudes();
  }

  public seleccionoRepre!: String;
  public seleccionoNuevoRepre!: String;

  public soliciUsuario(dni: string) {
    this.personaFacade.consultarInteresado(this, dni);
  }

  public selecrepresentante(event?: JqxGridRowEvent<RepresentanteExpLIstar>) {
    const row = event?.args?.row?.bounddata
    if (!row) {
      return
    }
    this.personaFacade.seleccionarRepresentanteLista(this, row)
  };

  public soliciUsuarioparaRepre(dni: string) {
    this.personaFacade.consultarRepresentante(this, dni);
  }

  public gestionEjercicio(): void {
    this.ejercicio = ejercicioActual();
  }

  public veoIniciarExp: boolean = true;
  public veoRechazaSolici: boolean = true;
  public FIniSolicitud!: string;
  public ejerNumeroSolicitud!: string | number;
  public NumeroRegistroSolicitud!: string | number;
  public usuarioSolicitud!: string;
  public asuntoSolicitud!: string;
  public persoEntiDocu!: string;
  public CambioFormatoFecha!: string;
  public fecInicio!: string;

  public preparaFechaGeneral(fechaDato: string | Date | null | undefined) {
    this.CambioFormatoFecha = formatearFechaDDMMYYYY(fechaDato)
  }


  public idRepre!: string;
  public idHisRepre!: string;
  public modificoSolicitud: boolean = true;
  public direccionRepresentante: string;

  public VeoRegDoc: boolean = false;
  public CargoRegistroDocu() {
    mostrarRegistroDocumento(this.registrodocumento, this.notificationService)
  }
  public iddocum: string;
  public idhisDocum: string;
  public selecsolicitudNueva(rowData: SolicitudListar): void {
    this.solicitudFacade.seleccionarSolicitud(this, rowData)
  }

  readonly solicitudRowClass = (row: SolicitudListar): Record<string, boolean> => ({
    'table-active': row.id === this.idsolicitud,
  });

  readonly interesadoSolicitudValue = (row: SolicitudListar): string => row.personaEntidad?.desPerEntid ?? '';

  readonly expedienteSolicitudValue = (row: SolicitudListar): string => {
    const expediente = row.expediente as { ejercicio?: unknown; numero?: unknown } | null;
    if (!expediente?.ejercicio || !expediente?.numero) {
      return '';
    }
    return `${expediente.ejercicio}/${expediente.numero}`;
  };

  estadoSolicitudBadgeClass(estado: string): string {
    const key = String(estado ?? '').trim().toUpperCase();
    if (key === 'PENDIENTE') return 'soli-badge soli-badge--pendiente';
    if (key === 'ACEPTADA') return 'soli-badge soli-badge--aceptada';
    if (key === 'RECHAZADA') return 'soli-badge soli-badge--rechazada';
    return 'soli-badge';
  }

  // Método para abrir modal de edición con doble click
  public abrirModalEdicionSolicitud(rowData: SolicitudListar) {
    // Cargar todos los datos de la fila (interesado, representante, editasolicitud, modificoSolicitud...)
    // igual que al hacer clic simple, ya que el doble clic puede llegar sin selección previa.
    this.selecsolicitudNueva(rowData);

    // Solo abrir el modal si la solicitud es editable
    if (this.modificoSolicitud) {
      // Abrir el modal de edición usando ModalManagerService
      this.modalManagerService.openModal('edicionSolicitudModal');
    } else {
      // Mostrar mensaje si la solicitud no es editable usando NotificationService
      this.notificationService.warning('Esta solicitud no puede ser editada en su estado actual');
    }
  }

  public abrirModalVerDocumento(event: JqxGridRowEvent<DocumentosListar>) {
    this.documentosFacade.abrirVerDocumento(this, event)
  }

  public selecsolicitud(id: number, expedi: unknown, idexpedienteA: number) {
    this.progreso = this.progreso + 20;
    this.updateProgressBar();
    this.vermenu = true;
    this.edicion = true;
    this.idsolicitud = id;
    this.expsolicitud = this.formatExpedienteRef(expedi);
    this.idexpedienteAsoc = idexpedienteA

    if (this.idexpedienteAsoc) {
      this.activainiciaExpedi = true;
    } else {
      this.activainiciaExpedi = false;
    }

    this.versolici(id);
    this.getExpediente(idexpedienteA);
  };

  private formatExpedienteRef(expediente: unknown): string {
    if (!expediente) {
      return ''
    }
    if (typeof expediente === 'string' || typeof expediente === 'number') {
      return String(expediente)
    }

    const exp = expediente as { ejercicio?: string | number; numero?: string | number }
    if (exp.ejercicio == null || exp.numero == null) {
      return ''
    }

    return `${exp.ejercicio}/${exp.numero}`
  }

  public getExpediente(id: number) {
    this.expedienteFacade.getExpediente(this)
  }

  rechazarSolicitud(id: number): void {
    this.solicitudFacade.rechazarLegacy(this, id);
  }

  deleteSolicitudes(id: number): void {
    this.solicitudFacade.eliminar(this, id);
  }

  public estado: string = "ACEPTADA";

  public generaPdfSolicitudes() {
    if (!this.content?.nativeElement) {
      return
    }

    const content = this.content.nativeElement

    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('./assets/escudo_generico.png');
      const pdf = new jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`solicitudesPendientes${this.lafecha}.pdf`);
    });


  }

  deleteDocumento(id: number | null): void {
    this.documentosFacade.eliminar(this, id);
  }

  private readonly gridRenderContext: SolicitudesGridRenderContext = {};
  private readonly gridRenderers = createSolicitudesGridRenderers(this.gridRenderContext);
  columnsSoliciPendi = buildColumnsSoliciPendi(this.gridRenderers);
  columnsListDoc = buildColumnsListDoc(this.gridRenderers);
  columnsListExpe = buildColumnsListExpe(this.gridRenderers);
  columnsListRepre = buildColumnsListRepre(this.gridRenderers);
  public localizationObject: IflowGridLocalization = jqxGrid_ES;
  public valorEspecifico = 'PENDIENTE';
  solicitudesListado: SolicitudListar[] = [];
  cargandoSolicitudesListado = false;
  sourceListDoc!: IflowGridSource;
  sourceListExpe!: IflowGridSource;
  sourceListRepre!: IflowGridSource;
  sourceSPENDI: SolicitudListar[] = [];
  sourceSolpen!: IflowGridSource;
  sourceSoliciPendientes!: IflowGridSource;
  rendergridrows = (params: { defaultRender: (p: unknown) => unknown }): unknown => {
    return params.defaultRender(params);
  };
  public verLisDoc = false;


  public selecListDoc(event: JqxGridRowEvent<DocumentosListar>): void {
    const rowData = event.args.row.bounddata
    if (rowData.solicitud == this.idsolicitud) {
      this.verLisDoc = true
    }
  }
  public selectExpSolicitudt(event: JqxGridRowEvent<{ solicitud?: number | string }>) {



    if (event.args.row.bounddata.solicitud == this.idsolicitud) {
      this.verLisDoc = true;
    }
  }

  public actualizoSourceRepre(idperso: number | string, idhisperso: number | string): void {
    this.gridFacade.assignRepresentantesSourcePlain(this, idperso, idhisperso);
  }


}


