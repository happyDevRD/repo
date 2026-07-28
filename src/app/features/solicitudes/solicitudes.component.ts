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
  buildColumnsSolici,
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

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { IflowGridComponent, IflowGridLocalization, IflowGridSource } from 'src/app/shared/components/iflow-grid/iflow-grid.component';
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

  /** Asignado desde SolicitudesListComponent (#gridSolicitudes) */
  myGrid: IflowGridComponent | undefined

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
  public versolicitud: any = new VerSolicitud();
  public crearpersonaentidad: any = new CrearPersonaEntidad()
  public crearrepresentante: any = new CrearRepresentante()
  public usupermisos!: UsuPermisos[];
  public procedipermisos: any = new ProcediPermisos();
  public verexpediente: any = new VerExpediente()
  procedimientos!: Procedimiento[];
  public documentoslistar!: DocumentosListar[];
  public documentosSolicitud: DocumentosListar[] = [];
  public documentosCargando = false;
  public expedienteslistar!: ExpedienteListar2[];
  procedipermiso!: ProcediPermisos[];
  public nuevoexpediente: NuevoExpediente = new NuevoExpediente();
  public selected = new Date("dd/mm/aaaa");
  public lafecha = new Date().toLocaleString();
  public ejercicio!: any;
  public creasolicitud: CreaSolicitudNuevo = new CreaSolicitudNuevo();
  public editasolicitud: EditarSolicitud = new EditarSolicitud();
  public editexpediente: EditExpediente = new EditExpediente();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public statusGetSolicitudes!: number;
  public descargafichero!: any;
  public progreso: number = 0;
  public intervalo!: number;
  public page!: number;
  public npagina: number = 5;
  public nombre!: string;
  public apellido1!: any;
  public apellido2!: any;
  public usuarioAsignado!: string;
  public isAsignando: boolean = false;
  public isRechazando: boolean = false;
  public isIniciandoExpediente: boolean = false;
  public isModificandoSolicitud: boolean = false;
  public mostrarValidacionesNuevaSolicitud = false
  filtroasunto!: any;
  filtrointeresado!: any;
  filtrorepresentante!: any;
  filtrodepartamento!: any;
  filtroasignado!: any;
  filtroestado!: any;
  percentDone!: number;
  nomArchiv!: string;
  uploadSuccess!: boolean;
  url!: string;
  archivoSubido!: any;
  nombreArchivoSubido!: any;
  base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  mes: any = new Date().getMonth();
  dia: any = new Date().getDate()
  fechaarchivo: any = new Date();
  descripcionArchivo!: any;
  iddocumento!: number | null;
  name!: any;
  id!: number;
  myimage!: unknown;
  base64code!: any;

  //EXPEDIENTES

  idexpediente!: number;
  intructorExpediente!: string;
  public recargapagina() {
    location.reload();
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

  public valorEstato(value: any) {
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

  sortGrid(): void {
    this.myGrid?.sortby('id', 'desc')
  }

  ngOnInit() {
    this.verpagina();
    this.FechaSolicitud();


  };
  ngAfterViewInit(): void {
    // el código de ordenación se moverá aquí
    // this.myGrid.onBindingcomplete.subscribe(() => {

    // });
  }



  public selecDocumento(id, nombre): void {
    this.iddocumento = id;
    this.listadocmenu = true;
    this.nombreArchivoSubido = nombre;

    this.progreso = this.progreso + 20;
    this.updateProgressBar();





  }

  public selecDocumentoNuevos(event: any): void {
    this.documentosFacade.seleccionarDocumentoNuevo(this, event)
  }

  public selecExpediente(id): void {
    this.idexpediente = id;
    this.menuexpedientes = true;








  }

  public versolici(id): void {
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
    this.fechanuevoExpedi = new Date()
    this.solicitudFacade.obtenerFormaNotificacionInteresado(this)
  }

  public fecha: Date = new Date()

  public fecha2: any = new Date().toLocaleDateString()
  public FechaSistema!: any;

  public asuntoexpedi!: string;
  public cambioasuntoexpe(dato: any) {
    this.versolicitud.asunto = dato;
    this.asuntoexpedi = dato;
    this.nuevoexpediente.titulo = this.asuntoexpedi;
  }

  public fechanuevoExpedi = new Date()

  public iniciarExpediente(): void {
    this.expedienteFacade.iniciarLegacy(this);
  }

  public descargarDocumento(archivo): void {

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

  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

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
  public selecTipPerso(valor: any): void {
    this.personaFacade.selecTipPerso(valor);
  }

  // provincias y municipios
  public provin: any[] = PROVIN;
  public municio: any[] = MUNICIO;

  public gestimunicip(id: any): void {
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
    const formInvalido = !!form && !form.checkValidity()
    const dniVacio = !numDocum
    const interesadoSinResolver =
      !dniVacio &&
      !this.personaFacade.dniok &&
      !this.personaFacade.existepersonaentidad

    if (formInvalido || dniVacio || interesadoSinResolver) {
      form?.classList.add('was-validated')
      if (dniVacio) {
        this.notificationService.incompleteFields('El DNI del interesado es obligatorio')
      } else if (interesadoSinResolver) {
        this.notificationService.incompleteFields(
          'Consulta el DNI del interesado (sal del campo) antes de guardar',
        )
      } else {
        this.notificationService.incompleteFields()
      }
      this.modalManagerService.keepModalOpen('nsolicitudModal')
      return
    }

    this.creaSolicitud()
  }

  public isDniNuevaInvalid(): boolean {
    return this.mostrarValidacionesNuevaSolicitud && !String(this.creasolicitud.numDocum ?? '').trim()
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
    this.representanteexplistar.desPerEntid = "";
    this.personaFacade.representanteSolicitud = "";
    this.limpiaDatosEditarSolicitudes();
  }

  public seleccionoRepre!: String;
  public seleccionoNuevoRepre!: String;

  public soliciUsuario(dni: string) {
    this.personaFacade.consultarInteresado(this, dni);
  }

  public selecrepresentante(event) {
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
  public FIniSolicitud!: any;
  public ejerNumeroSolicitud!: any;
  public NumeroRegistroSolicitud!: any;
  public usuarioSolicitud!: string;
  public asuntoSolicitud!: string;
  public persoEntiDocu!: any;
  public CambioFormatoFecha!: string;
  public fecInicio!: string;

  public preparaFechaGeneral(fechaDato: any) {
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
  public selecsolicitudNueva(event: any): void {
    this.solicitudFacade.seleccionarSolicitud(this, event.args.row.bounddata)
  }
  // Método para abrir modal de edición con doble click
  public abrirModalEdicionSolicitud(event: any) {
    const rowData = event.args.row.bounddata;

    // Solo abrir el modal si la solicitud es editable
    if (this.modificoSolicitud) {
      // Cargar datos para edición
      this.versolici(rowData.id);

      // Abrir el modal de edición usando ModalManagerService
      this.modalManagerService.openModal('edicionSolicitudModal');
    } else {
      // Mostrar mensaje si la solicitud no es editable usando NotificationService
      this.notificationService.warning('Esta solicitud no puede ser editada en su estado actual');
    }
  }

  public abrirModalVerDocumento(event: any) {
    this.documentosFacade.abrirVerDocumento(this, event)
  }

  public selecsolicitud(id, expedi, idexpedienteA) {
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

  recargarpagina() {
    window.location.reload();
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
  columnsSolici = buildColumnsSolici(this.gridRenderers);
  columnsSoliciPendi = buildColumnsSoliciPendi(this.gridRenderers);
  columnsListDoc = buildColumnsListDoc(this.gridRenderers);
  columnsListExpe = buildColumnsListExpe(this.gridRenderers);
  columnsListRepre = buildColumnsListRepre(this.gridRenderers);
  public localizationObject: IflowGridLocalization = jqxGrid_ES;
  public valorEspecifico = 'PENDIENTE';
  sourceSolici!: IflowGridSource;
  sourceListDoc!: IflowGridSource;
  sourceListExpe!: IflowGridSource;
  sourceListRepre!: IflowGridSource;
  sourceSPENDI: SolicitudListar[] = [];
  sourceSolpen!: IflowGridSource;
  sourceSoliciPendientes!: IflowGridSource;
  rendergridrows = (params: any): any => {
    return params.defaultRender(params);
  };
  public verLisDoc = false;


  public selecListDoc(event: any): void {
    const rowData = event.args.row.bounddata
    if (rowData.solicitud == this.idsolicitud) {
      this.verLisDoc = true
    }
  }
  public selectExpSolicitudt(event) {



    if (event.args.row.bounddata.solicitud == this.idsolicitud) {
      this.verLisDoc = true;
    }
  }

  public actualizoSourceRepre(idperso: number | string, idhisperso: number | string): void {
    this.gridFacade.assignRepresentantesSourcePlain(this, idperso, idhisperso);
  }


}


