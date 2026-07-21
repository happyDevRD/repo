import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';
import { CreaSolicitud, SolicitudListar, ProcediPermisos, EditarSolicitud, DocumentosListar, UsuPermisos, ExpedienteListar, ExpedienteListar2, EditExpediente, VerSolicitud, CreaSolicitudNuevo } from './solicitudes';
import { ExpedientesService } from '../expedientes/expedientes.service';
import { CrearPersonaEntidad, CrearRepresentante, NuevoExpediente, Procedimiento, RegistroDocumento, RepresentanteExpLIstar, VerExpediente } from '../expedientes/expedientes';
import { FileUploadService, FileUploadConfig } from '../core/service/file-upload.service';
import { ModalService } from '../core/service/modal.service';
import { NotificationService } from '../core/service/notification.service';
import { ModalManagerService } from '../core/service/modal-manager.service';
import { UserSessionService } from '../core/service/user-session.service';
import { environment } from 'src/environments/environment';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import { GridRadioSelector } from '../core/helper/grid-radio-selector';
import { TablaClickHandler } from '../core/helper/tabla-click-handler';
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
import { applyRepresentanteToEdit } from './helpers/solicitudes-representante.helper';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { PROVIN, MUNICIO } from 'src/app/core/constants/datos';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
  providers: [
    SolicitudesGridFacade,
    SolicitudesSolicitudFacade,
    SolicitudesDocumentosFacade,
    SolicitudesExpedienteFacade,
    SolicitudesPersonaFacade,
  ],
})
export class SolicitudesComponent {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;

  @ViewChild('content', { static: false }) content: ElementRef;
  //@ViewChild('content') content!: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef | undefined; 

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
  public pdfViewerUrl: string | null = null;
  public pdfSafeUrl: SafeResourceUrl | null = null;
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
  myimage!: Observable<any>;
  base64code!: any;

  //EXPEDIENTES

  idexpediente!: number;
  intructorExpediente!: string;
  public recargapagina() {
    location.reload();
  }

  verpagina() {
    if (this.session.canManageSolicitudes) {
      console.log("TIENE PERMISO");
      this.solicitudesServices.getSolicitudes().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        solicitudlistar => {
          this.solicitudlistar = solicitudlistar
        }
      );

      this.solicitudesServices.getDocumentosListar().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        data1 =>
          (error1: HttpErrorResponse) => {
            console.error(`Datos del Error de página DOCUMENTOS: ${error1.status}`);
          }
      );


      this.solicitudesServices.getSolicitudes().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        data =>
          (error: HttpErrorResponse) => {
            this.statusGetSolicitudes = error.status;

            console.error(`Datos del Error de página : ${error.status}`);
          }
      );

      this.expedientesService.getProcedimientos().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        procedimientos => this.procedimientos = procedimientos
      );

      this.solicitudesServices.getAsignarA().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        usupermisos => this.usupermisos = usupermisos
      );

      this.solicitudesServices.getDocumentosListar().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        documentoslistar => this.documentoslistar = documentoslistar
      );

      this.solicitudesServices.getPermisoProcedi().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        procedipermisos => this.procedipermiso = procedipermisos
      );

    } else {
      console.log("NO TIENE PERMISO");
      this.notificationService.warning(`Lo sentimos, el usuario ${this.session.user} No tiene aceso a Solicitudes.`);

    }
  }

  public veoPdf(ruta: string): void {
    this.pdfViewerUrl = ruta;
    this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ruta);
    this.abrirModal('VerPdfModal');
  }

  private updateProgressBar(): void {
    const bar = document.getElementById('barprogreso');
    if (!bar) { return; }
    bar.style.width = `${this.progreso}%`;
    bar.setAttribute('aria-valuenow', String(this.progreso));
  }


  public abreArchivo(url) {
    console.log("ABRE FICHERO : " + url)
    window.open(url, "_blank");
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  };

  convertToBase64(file: File, name: string, id: number, fichero: any) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((d) => {
      console.log(this.myimage)
      this.name = name;
      this.id = id;
      this.myimage = d;
      let fiche = d.split(',');

      this.base64code = fiche[1];
      let compresion: string = btoa(fiche);
      console.log(`BASE64 ENCODE :  ${this.base64code}`);
    })
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();

    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };

  }

  // Variable para almacenar el archivo seleccionado
  selectedFile: File | null = null;

  upload(event: any, id: number) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que la descripción no esté vacía
    if (!this.descripcionArchivo || this.descripcionArchivo.trim() === '') {
      this.notificationService.warning({
        title: 'Descripción obligatoria',
        text: 'Por favor, introduce una descripción antes de seleccionar el archivo.'
      });
      // Limpiar el input de archivo para permitir volver a seleccionar
      if (this.fileInput) {
        this.fileUploadService.clearFileInput(this.fileInput.nativeElement);
      }
      return;
    }

    // Validar el archivo usando el servicio
    const config: FileUploadConfig = {
      maxFileSize: 50,
      allowedTypes: ['.pdf', '.docx', '.odt', '.jpg', '.jpeg', '.png'],
      timeout: 300000,
      retryAttempts: 3,
      showProgress: true
    };

    const validation = this.fileUploadService.validateFile(file, config);
    if (!validation.valid) {
      this.notificationService.error({
        title: 'Archivo no válido',
        text: validation.error
      });
      // Limpiar el input de archivo
      if (this.fileInput) {
        this.fileUploadService.clearFileInput(this.fileInput.nativeElement);
      }
      return;
    }

    // Guardar el archivo seleccionado y convertirlo a base64
    this.selectedFile = file;
    this.name = file.name;
    this.id = id;

    // Convertir el archivo a base64
    this.convertToBase64(file, file.name, id, null);

    // Mostrar mensaje de confirmación
    this.notificationService.success({
      title: 'Archivo seleccionado',
      text: `Archivo "${file.name}" seleccionado correctamente. Presiona "Guardar" para subirlo.`,
      timer: 2000,
      timerProgressBar: true
    });
  }

  /**
   * Método que se ejecuta al presionar el botón Guardar
   */
  guardarDocumento(): void {
    this.documentosFacade.guardar(this);
  }

  /**
   * Actualiza la lista de documentos después de una subida exitosa
   */
  private refreshDocumentList(): void {
    // Recargar los datos de la tabla de documentos
    this.solicitudesServices.getDocumentosListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      documentoslistar => {
        this.documentoslistar = documentoslistar;

        this.gridFacade.refreshDocumentosAdapter(this);
      },
      error => {
        console.error('Error al actualizar la lista de documentos:', error);
      }
    );
  }

  /**
   * Limpia el formulario de subida
   */
  public clearUploadForm(): void {
    this.descripcionArchivo = null;
    this.base64code = "";
    this.id = 0;
    this.name = "";
    this.selectedFile = null; // Limpiar el archivo seleccionado

    if (this.fileInput) {
      this.fileUploadService.clearFileInput(this.fileInput.nativeElement);
    }
  }

  /**
   * Método que se ejecuta al presionar el botón Cancelar
   */
  public cancelarDocumento(): void {
    // Limpiar el formulario
    this.clearUploadForm();
  }

  public solicitudesPendientes() {
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
    try {

      this.solicitudesServices.getSolicitudesfiltro(value).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        solicitudlistar => {
          this.solicitudlistar = solicitudlistar
        }

      );

      let myObjectString = JSON.stringify(value);

      console.log("valor estado solicitud : " + myObjectString)

      console.log("cadena estado solicitud : " + this.cadenaEstadoSolicitudes)
    } catch (error) {
      console.log(" ESTE ES EL ERROR : " + error)

    }

  }


  public limpiadatosnuevoexpediente() {
    this.nuevoexpediente = new NuevoExpediente();
    this.personaFacade.resetConsulta();
    console.log("LIMPIANDO");
  }


  filtroUsuarios() {
    if (!this.session.canManageSolicitudes) {
      this.puedesver = true;


    }
  }
  public subidaArchivo: boolean = false;
  envio() {
    // Este método ya no es necesario ya que la subida se maneja automáticamente en el método upload()
    // Se mantiene por compatibilidad pero ahora es un método vacío
    console.log('Método envio() llamado - la subida se maneja automáticamente en upload()');
  }


  public relleno: string = 'Datos de prueba';

  constructor(public solicitudesServices: SolicitudesService,
    public expedientesService: ExpedientesService,
    public router: Router,
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private sanitizer: DomSanitizer,
    private gridFacade: SolicitudesGridFacade,
    private solicitudFacade: SolicitudesSolicitudFacade,
    private documentosFacade: SolicitudesDocumentosFacade,
    private expedienteFacade: SolicitudesExpedienteFacade,
    public readonly personaFacade: SolicitudesPersonaFacade,
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
      this.solicitudFacade.mostrarValidacionesRechazar = false;
    } else if (modalId === 'iniciarExpedieModal') {
      this.expedienteFacade.mostrarValidacionesIniciarExpediente = false;
    } else if (modalId === 'edicionSolicitudModal') {
      this.solicitudFacade.mostrarValidacionesModificarSolicitud = false;
    }
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
  }

  sortGrid(): void {
    this.myGrid.sortby('id', 'desc');

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



  public prueba(id): void {

    console.log('Elemento CLICKEADO');
    console.log(`ID DE SOLICITUD : ${id}`);





  }
  public selecDocumento(id, nombre): void {
    this.iddocumento = id;
    this.listadocmenu = true;
    this.nombreArchivoSubido = nombre;

    this.progreso = this.progreso + 20;
    this.updateProgressBar();
    console.log(`PROGRESO : ${this.progreso}`)


    console.log('Elemento CLICKEADO');
    console.log(`ID DOCUMENTO : ${this.iddocumento}`);
    console.log(`DOCUMENTO : ${this.nombreArchivoSubido}`);





  }

  // Método de selección de documentos nuevos usando GridRadioSelector
  public selecDocumentoNuevos = GridRadioSelector.createClickHandler('Documentos', (rowData: any) => {
    this.iddocumento = rowData.id;
    this.listadocmenu = true;
    this.nombreArchivoSubido = rowData.nombreArchivo;
    this.descargafichero = `${environment.apiUrl}archivo/descargaSolicitud/${rowData.archivo}`;

    console.log("url ARCHIVO : " + this.descargafichero);

    this.progreso = this.progreso + 20;
    this.updateProgressBar();
    console.log(`PROGRESO : ${this.progreso}`);

    console.log('Elemento CLICKEADO');
    console.log(`ID DOCUMENTO : ${this.iddocumento}`);
    console.log(`Nombre DOCUMENTO : ${this.nombreArchivoSubido}`);
    this.listadocmenu = true;

    this.veoPdf(this.descargafichero);
  });
  public selecExpediente(id): void {
    this.idexpediente = id;
    this.menuexpedientes = true;


    console.log('Elemento CLICKEADO');
    console.log(`ID expediente : ${this.idexpediente}`);






  }

  public versolici(id) {


    this.solicitudesServices.getVerSolicitudes(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      versolicitud => {
        this.versolicitud = versolicitud;

        // Obtener la forma de notificación del interesado
        if (this.versolicitud && this.versolicitud.personaEntidad && this.versolicitud.personaEntidad[0]) {
          const interesado = this.versolicitud.personaEntidad[0];
          if (interesado.numDocum) {
            this.obtenerFormaNotificacionInteresado(interesado.numDocum);
          }
        }
      }
    )

  }

  // Función para obtener la forma de notificación del interesado
  public obtenerFormaNotificacionInteresado(numDocum: string) {
    // NOTA: La información de tipForNotif viene del endpoint /interesado/listar/{idExpediente}
    // pero en este contexto aún no tenemos un expediente creado.
    // Por lo tanto, establecemos la forma de notificación basada en el tipo de persona.

    if (this.versolicitud && this.versolicitud.personaEntidad && this.versolicitud.personaEntidad[0]) {
      const interesado = this.versolicitud.personaEntidad[0];

      // Establecer forma de notificación basada en el tipo de persona
      if (interesado.tipPerso === 'Física') {
        // Para personas físicas, usar correo postal por defecto (valor 0)
        this.nuevoexpediente.formaNotifi = 0;
        console.log('Persona física detectada, estableciendo forma de notificación: Correo postal');
      } else {
        // Para entidades, usar telemática por defecto (valor 1)
        this.nuevoexpediente.formaNotifi = 1;
        console.log('Entidad detectada, estableciendo forma de notificación: Telemática');
      }
    } else {
      // Si no hay información del interesado, usar correo postal por defecto
      this.nuevoexpediente.formaNotifi = 0;
      console.log('No se encontró información del interesado, estableciendo forma de notificación: Correo postal por defecto');
    }

    // TODO: Una vez que se cree el expediente, se puede actualizar esta información
    // llamando al endpoint /interesado/listar/{idExpediente} para obtener el tipForNotif real
  }

  public limpiadatosIniciarExpediente() {
    this.nuevoexpediente = new NuevoExpediente();
    // Reiniciar la forma de notificación
    this.nuevoexpediente.formaNotifi = 0; // Correo postal por defecto

  }
  public fecha: Date = new Date()

  public fecha2: any = new Date().toLocaleDateString()
  public FechaSistema!: any;

  public preparaFecha() {

    let anio: string = this.fecha.toString().substring(0, 4);
    let mes: string = this.fecha.toString().substring(5, 7);
    let dia: string = this.fecha.toString().substring(8, 10);


    let year = this.fecha.getFullYear()
    let month = this.fecha.getMonth()
    let me = this.fecha.getDate()

    let fechaordenada: string = me + "/" + month + "/" + year;
    this.FechaSistema = new Date().toLocaleDateString()
    console.log(`VER CORTES DE FECHA: ${fechaordenada}`);
    console.log(` FECHA de sistema: ${this.fecha}`);
    console.log(` FECHA de sistema Modificada: ${this.fecha2}`);

  }
  public asuntoexpedi!: string;
  public cambioasuntoexpe(dato: any) {
    this.versolicitud.asunto = dato;
    this.asuntoexpedi = dato;
    this.nuevoexpediente.titulo = this.asuntoexpedi;

    console.log("actualizo dato" + this.nuevoexpediente.titulo);
    console.log("dato a cambiar" + dato)


  }
  public fechanuevoExpedi = new Date()

  public iniciarExpediente(): void {
    this.expedienteFacade.iniciarLegacy(this);
  }


  public descargarDocumento(archivo): void {

    this.nombreArchivoSubido = archivo;
    console.log(`NOMBRE ARCHIVO : ${this.nombreArchivoSubido}`);






  }

  public editExpediente() {

    console.log(`INSTRUCTOR: ${this.intructorExpediente}`);
    console.log(`ID EXPEDIENTE: ${this.idexpediente}`);
    console.log(`ID SOLICITUD: ${this.idsolicitud}`);

    this.solicitudesServices.editaExpediente(this.editexpediente, this.idexpediente, this.intructorExpediente)

    // setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo



  }

  public creaExpediente() {


    this.solicitudesServices.creaExpediente(this.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(response => this.router.navigate(['/solicitudes']));


  }

  public resultacrearsolici: string;

  public borraDatosSolicitud() {
    this.creasolicitud = new CreaSolicitudNuevo();
    this.personaFacade.resetWizardNuevaSolicitud();
    this.FechaSolicitud();
  }
  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSolicitud() {
    console.log("FEcha Sistema : " + this.fsistema)
    let aniofenvio: string = this.fsistema.substring(6, 10);
    let mesfenvio: string = this.fsistema.substring(3, 5);
    let diafenvio: string = this.fsistema.substring(0, 2);
    //let fechaordenadafenvio:string = diafenvio+"-"+mesfenvio+"-"+aniofenvio;
    let fechaordenadafenvio: any = aniofenvio + "-" + mesfenvio + "-" + diafenvio;
    this.fechaSistema = fechaordenadafenvio;
    this.creasolicitud.fecInicio = fechaordenadafenvio // AQUI LE DAMOS EL VALOR EN LA VARIABLE QUE TIENE EL FORMULARIO PARA EL ENVIO DE INFORMACION Y QUITAMOS EL VALUE DEL INPUT
    // console.log("FEcha año : " + aniofenvio)
    //console.log("FEcha mes : " + mesfenvio)
    //console.log("FEcha dia : " + diafenvio)

    console.log("FEcha Sistema : " + this.fechaSistema)



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
    this.personaFacade.cambiamosRepre();
  }

  public validateAndCreateSolicitud(event: Event): void {
    event.preventDefault();

    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Mantener el modal abierto
      this.modalManagerService.keepModalOpen('nsolicitudModal');
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.creaSolicitud();
  }

  public limpiarErroresSolicitud(): void {
    const form = document.getElementById('formNuevaSolicitud') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }

  public creaSolicitud(): void {
    this.solicitudFacade.crear(this);
  }




  public asignara(id: number): void {
    this.solicitudFacade.asignar(this, id);
  };

  /**
   * Validaciones y envío de los formularios de asignar/rechazar/modificar/iniciar expediente.
   * Las banderas mostrarValidaciones* y la lógica de confirmación viven en
   * SolicitudesSolicitudFacade / SolicitudesExpedienteFacade; el componente solo delega.
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

  /**
   * Prepara los datos del representante antes de enviar
   */
  private prepararDatosRepresentante(): void {
    applyRepresentanteToEdit(this.editasolicitud, this.representanteexplistar, this.seleccionoRepre);
  }

  /**
   * Limpia los datos del formulario de modificar
   */
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

  public soliciUsuarioparaRepre(dni: string) {
    this.personaFacade.consultarRepresentante(this, dni);
  }

  public gestionEjercicio(): void {

    let ano: string = Date()
    this.ejercicio = ano.substr(11, 4);
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

    let anio: string = fechaDato.toString().substring(0, 4);
    let mes: string = fechaDato.toString().substring(5, 7);
    let dia: string = fechaDato.toString().substring(8, 10);

    let fechaordenada: string = dia + "/" + mes + "/" + anio;
    this.CambioFormatoFecha = fechaordenada;


  }


  public idRepre!: string;
  public idHisRepre!: string;
  public modificoSolicitud: boolean = true;
  public direccionRepresentante: string;

  public selecrepresentante(event) {
    console.log("seleccionamos ----> " + event.args.row.bounddata.idPerso + "/" + event.args.row.bounddata.idHisPerso)
    this.creasolicitud.idHisRepre = event.args.row.bounddata.idHisPerso;
    this.creasolicitud.idRepre = event.args.row.bounddata.idPerso;

  };

  public VeoRegDoc: boolean = false;
  public CargoRegistroDocu() {

    let ejercicio: any = this.registrodocumento.ejeRegis;
    let numero: any = this.registrodocumento.numRegis;
    let extracto: string = this.registrodocumento.extracto;
    let fecha: any = this.registrodocumento.fecRegis;
    //let recorteFecha:string = fecha.substr(0,10);
    let anio: string = fecha.substring(0, 4);
    let mes: string = fecha.substring(5, 7);
    let dia: string = fecha.substring(8, 10);
    let hora: string = fecha.substring(11, 19);

    let fechaordenada: string = dia + "/" + mes + "/" + anio;

    this.notificationService.custom({
      title: "<strong><u>Registro de Documentos</u></strong>",

      html: `
    <h4><strong> NÚMERO:</strong> ${ejercicio}/${numero} </h4>
    <h4> <strong> EXTRACTO:</strong> ${extracto} </h4>
    <h4> <strong> FECHA REGISTRO:</strong> ${fechaordenada}  ${hora}</h4>
    
    
    `,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,

    });


  }
  public iddocum: string;
  public idhisDocum: string;
  // Método de selección de solicitudes usando GridRadioSelector
  public selecsolicitudNueva = GridRadioSelector.createClickHandler('Solicitudes', (rowData: any) => {
    this.direccionRepresentante = rowData.dirRepre;

    if (rowData.idHisDocum) {
      this.idhisDocum = rowData.idHisDocum;
      this.iddocum = rowData.idDocum;
      this.expedientesService.getRegistroDocVer(rowData.idHisDocum).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        registrodocumento => this.registrodocumento = registrodocumento
      );
      console.log("Tenemos Registro de Documento --------> " + rowData.idHisDocum);
      this.VeoRegDoc = true;
    } else {
      console.log("NO Tenemos Registro de Documento --------> " + rowData.idHisDocum);
      this.VeoRegDoc = false;
    }

    if (rowData.estado != "PENDIENTE") {
      this.modificoSolicitud = false;
    } else {
      this.modificoSolicitud = true;
    }

    this.preparaFechaGeneral(rowData.fecInicio);
    this.fecInicio = rowData.fecInicio;
    this.FIniSolicitud = this.CambioFormatoFecha;
    console.log("Fecha inicio solicitud: +++++++++++++++++++++ " + this.FIniSolicitud);

    this.preparaFecha();
    console.log("ID SOLICITUD: " + rowData.id);
    this.ejerNumeroSolicitud = rowData.ejercicio + "/" + rowData.numero;

    this.idRepre = rowData.idRepre;
    this.idHisRepre = rowData.idHisRepre;
    this.NumeroRegistroSolicitud = rowData.ejeNumRegis;
    this.personaFacade.InteresadoSolicitud = rowData.personaEntidad.desPerEntid;
    this.personaFacade.dirPosta = rowData.personaEntidad.dirPosta;
    this.personaFacade.codPosta = rowData.personaEntidad.codPosta;
    this.personaFacade.provincia = rowData.personaEntidad.provincia;
    this.personaFacade.Municipio = rowData.personaEntidad.municipio;
    this.usuarioSolicitud = rowData.usuario;
    this.asuntoSolicitud = rowData.asunto;
    this.personaFacade.representanteSolicitud = rowData.nomRepre;
    this.persoEntiDocu = rowData.personaEntidad.numDocum;

    // Inicializar editasolicitud con los datos de la solicitud seleccionada
    this.editasolicitud.dni = rowData.personaEntidad.numDocum;
    this.editasolicitud.asunto = rowData.asunto;
    this.editasolicitud.fecInicio = rowData.fecInicio;
    this.editasolicitud.estado = rowData.estado;
    this.editasolicitud.usuario = rowData.usuario;
    //this.FIniSolicitud = event.args.row.bounddata.personaEntidad.fecInicio;



    console.log(" ESTADO: " + rowData.estado);

    if (rowData.estado == "RECHAZADA") {
      this.veoRechazaSolici = false;
    } else {
      this.veoRechazaSolici = true;
    }

    if (rowData.estado == "ACEPTADA") {
      this.edicion = false;
    } else {
      this.edicion = true;
    }

    if (rowData.expediente) {
      this.veoIniciarExp = false;
    } else {
      this.veoIniciarExp = true;
    }

    this.listadocmenu = false;
    this.verLisDoc = true;
    this.progreso = this.progreso + 20;
    this.updateProgressBar();
    this.vermenu = true;
    this.edicion = true;
    this.idsolicitud = rowData.id;
    this.expsolicitud = rowData.expediente;
    this.idexpedienteAsoc = rowData.idExpediente;


    if (this.idexpedienteAsoc) {
      this.activainiciaExpedi = true;
      console.log("id expediente asociado : " + this.idexpedienteAsoc)
    } else {
      this.activainiciaExpedi = false;
    }
    this.gridFacade.assignExpedientesSource(this, this.idexpedienteAsoc ?? 0);
    this.gridFacade.assignDocumentosSource(this, rowData.id);



    console.log(`ID SOLICITUD :  ${rowData.id}`);
    console.log(`ID EXP ASOC :  ${this.idexpedienteAsoc}`);

    this.versolici(rowData.id);
    this.getExpediente(rowData.idexpediente);
  });

  // Método para abrir modal de edición con doble click usando TablaClickHandler
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

  // Método para abrir modal de visualización de documento con doble click
  public abrirModalVerDocumento(event: any) {
    const rowData = event.args.row.bounddata;

    // Configurar datos del documento para visualización
    this.iddocumento = rowData.id;
    this.nombreArchivoSubido = rowData.nombreArchivo;
    this.descargafichero = `${environment.apiUrl}archivo/descargaSolicitud/${rowData.archivo}`;

    // Abrir el modal de visualización de PDF usando ModalManagerService
    this.modalManagerService.openModal('VerPdfModal');

    // Configurar el enlace para visualizar el documento
    setTimeout(() => {
      const linkView = document.getElementById('linkView') as HTMLAnchorElement;
      if (linkView) {
        linkView.href = this.descargafichero;
        linkView.target = '_blank';
      }
    }, 100);
  }

  public selecsolicitud(id, expedi, idexpedienteA) {
    this.progreso = this.progreso + 20;
    this.updateProgressBar();
    this.vermenu = true;
    this.edicion = true;
    this.idsolicitud = id;
    this.expsolicitud = expedi;
    this.idexpedienteAsoc = idexpedienteA

    if (this.idexpedienteAsoc) {
      this.activainiciaExpedi = true;
    } else {
      this.activainiciaExpedi = false;
    }


    console.log(`ID SOLICITUD :  ${id}`);
    console.log(`ID EXP ASOC :  ${this.idexpedienteAsoc}`);

    this.versolici(id);
    //this.verExpAsoc(idexpedienteA);
    this.getExpediente(idexpedienteA);




  };

  public getExpediente(id: number) {

    // console.log("SE A ENVIADO LA CONSULTA");
    //console.log(`ID DEL EXPEDIENTE DESDE MODAL: ${this.idexpedienteAsoc}`);

    this.expedientesService.getExpediente2(this.idexpedienteAsoc).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      verexpediente => this.verexpediente = verexpediente
    );

    this.activainiciaExpedi = false;

  }

  public consultita() {

    // para realizar pruebas -- borrar una ver se ponga en produccion!!!

    console.log(`DATOS DEL idDDD = ${this.verexpediente.id}`)

    for (let index = 0; index < this.verexpediente.length; index++) {

      // al tener un solo registro no es necesario el for
      console.log(`DATOS DEL id = ${this.verexpediente.id}`)

    }
  }

  editaSolicitud(id: number): void {
    this.solicitudFacade.editar(this, id);
    this.personaFacade.representanteSolicitud = '';
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


    const content = this.content.nativeElement;

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
  public localizationObject: any = jqxGrid_ES;
  public valorEspecifico = 'PENDIENTE';
  sourceSolici!: any;
  sourceListDoc!: any;
  sourceListExpe!: any;
  sourceListRepre!: any;
  sourceSPENDI: SolicitudListar[] = [];
  sourceSolpen!: any;
  sourceSoliciPendientes!: any;
  rendergridrows = (params: any): any => {
    console.log('datos ' + params.defaultRender(params));
    return params.defaultRender(params);
  };
  public verLisDoc = false;


  // Método de selección de documentos usando GridRadioSelector
  public selecListDoc = GridRadioSelector.createClickHandler('Documentos', (rowData: any) => {
    console.log("idsolicitud : " + this.idsolicitud);
    console.log("idsolicitud event : " + rowData.solicitud);

    if (rowData.solicitud == this.idsolicitud) {
      this.verLisDoc = true;
    }
  });

  public selectExpSolicitudt(event) {
    console.log("idExpediente  solicitud : " + event.args.row.bounddata.id);
    console.log("idExpediente titulo : " + event.args.row.bounddata.titulo);



    if (event.args.row.bounddata.solicitud == this.idsolicitud) {
      this.verLisDoc = true;
    }
  }

  public actualizoSourceRepre(idperso: number | string, idhisperso: number | string): void {
    this.gridFacade.assignRepresentantesSourcePlain(this, idperso, idhisperso);
  }

  public vacio(event) {
    console.log(`${environment.apiUrl}solicitud/listar/${this.idOrgEleme}`);
  }


}


