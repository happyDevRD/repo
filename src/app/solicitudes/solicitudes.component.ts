import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router'
import swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';
import { CreaSolicitud, SolicitudListar, ConsultaDni, ProcediPermisos, EditarSolicitud, DocumentosListar, UsuPermisos, ExpedienteListar, ExpedienteListar2, EditExpediente, VerSolicitud, CreaSolicitudNuevo } from './solicitudes';
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

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { PROVIN, MUNICIO } from 'src/app/core/constants/datos';





@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent {
  @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;

  @ViewChild('content', { static: false }) content: ElementRef;
  //@ViewChild('content') content!: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef | undefined; // para permitir borrar el nombre de archivo subido

  public title = 'Solicitudes';
  public edicion: boolean = false;
  public dniok: boolean = false;
  public activainiciaExpedi: boolean = false;
  public edicionPermisos: boolean = false;
  public vermenu: boolean = false; // para ver el menu tiene que cambiar a true
  public listadocmenu: boolean = false; // para ver el menu tiene que cambiar a true
  public puedesver: boolean = false; // para ver el menu tiene que cambiar a true
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
  // verexpediente!: VerExpediente[]; 
  procedimientos!: Procedimiento[];
  public documentoslistar!: DocumentosListar[];
  public expedienteslistar!: ExpedienteListar2[];
  procedipermiso!: ProcediPermisos[];
  public consultadni: ConsultaDni = new ConsultaDni();
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

  public httpHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json' }
    //{'Content-Type': 'multipart/form-data'}
  );
  // Datos para la paginación
  public page!: number;
  public npagina: number = 5;

  //datos consultadni
  public nombre!: string;
  public apellido1!: any;
  public apellido2!: any;
  public usuarioAsignado!: string;
  public isAsignando: boolean = false;
  public mostrarValidacionesAsignar: boolean = false;
  public isRechazando: boolean = false;
  public mostrarValidacionesRechazar: boolean = false;
  public isIniciandoExpediente: boolean = false;
  public mostrarValidacionesIniciarExpediente: boolean = false;
  public isModificandoSolicitud: boolean = false;
  public mostrarValidacionesModificarSolicitud: boolean = false;

  // para filtros 


  filtroasunto!: any;
  filtrointeresado!: any;
  filtrorepresentante!: any;
  filtrodepartamento!: any;
  filtroasignado!: any;
  filtroestado!: any;

  // subida de ficheros 
  percentDone!: number;
  nomArchiv!: string;
  uploadSuccess!: boolean;
  url!: string;
  archivoSubido!: any;
  nombreArchivoSubido!: any;
  base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  //anio:any = new Date().getFullYear() 
  mes: any = new Date().getMonth();
  dia: any = new Date().getDate()
  fechaarchivo: any = new Date();
  //fechaarchivo:any = this.anio+"-"+this.mes+"-"+this.dia;
  // fechaarchivo:any = new Date().toLocaleDateString()
  descripcionArchivo!: any;
  iddocumento!: number | null;

  name!: any;
  id!: number;
  myimage!: Observable<any>;
  base64code!: any;

  //EXPEDIENTES

  idexpediente!: number;
  intructorExpediente!: string;


  //recargo pagina

  public recargapagina() {
    location.reload();

  }


  verpagina() {



    if (this.session.canManageSolicitudes) {
      console.log("TIENE PERMISO");
      // console.log( `VALOR CADENA : ${this.soluser}`);


      this.solicitudesServices.getSolicitudes().subscribe(
        solicitudlistar => {
          this.solicitudlistar = solicitudlistar
        }
      );

      this.solicitudesServices.getDocumentosListar().subscribe(
        data1 =>// console.log( `DATA1: ${data1 }` ),
          (error1: HttpErrorResponse) => {




            console.error(`Datos del Error de página DOCUMENTOS: ${error1.status}`);
          }
      );


      this.solicitudesServices.getSolicitudes().subscribe(
        data =>//console.log( `DATA: ${data }` ),
          (error: HttpErrorResponse) => {
            this.statusGetSolicitudes = error.status;

            console.error(`Datos del Error de página : ${error.status}`);
          }
      );

      this.expedientesService.getProcedimientos().subscribe(
        procedimientos => this.procedimientos = procedimientos
      );

      this.solicitudesServices.getAsignarA().subscribe(
        usupermisos => this.usupermisos = usupermisos
        // solicitudlistar => this.solicitudlistar
      );

      this.solicitudesServices.getDocumentosListar().subscribe(
        documentoslistar => this.documentoslistar = documentoslistar
      );

      this.solicitudesServices.getPermisoProcedi().subscribe(
        procedipermisos => this.procedipermiso = procedipermisos
      );

    } else {
      console.log("NO TIENE PERMISO");
      //  console.log( `VALOR CADENA : ${cadena}`);
      //console.log( `VALOR trauser : ${this.trauser}`);
      //console.log( `VALOR user : ${this.session.user}`);

      swal.fire(`Lo sentimos, el usuario ${this.session.user} No tiene aceso a Solicitudes.`);

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
    observable.subscribe((d) => {
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
      swal.fire({
        icon: 'warning',
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
      swal.fire({
        icon: 'error',
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
    swal.fire({
      icon: 'success',
      title: 'Archivo seleccionado',
      text: `Archivo "${file.name}" seleccionado correctamente. Presiona "Guardar" para subirlo.`,
      timer: 2000,
      timerProgressBar: true
    });
  }

  /**
   * Método que se ejecuta al presionar el botón Guardar
   */
  guardarDocumento() {
    if (!this.selectedFile || !this.base64code) {
      swal.fire({
        icon: 'warning',
        title: 'No hay archivo seleccionado',
        text: 'Por favor, selecciona un archivo antes de guardar.'
      });
      return;
    }

    if (!this.descripcionArchivo || this.descripcionArchivo.trim() === '') {
      swal.fire({
        icon: 'warning',
        title: 'Descripción obligatoria',
        text: 'Por favor, introduce una descripción antes de guardar.'
      });
      return;
    }

    // Activar el spinner de subida
    this.subidaArchivo = true;

    // Mostrar progreso
    this.fileUploadService.showUploadProgress(this.selectedFile.name);

    // Preparar los datos para enviar
    const uploadData = {
      descripcion: this.descripcionArchivo,
      fechaSubida: new Date(),
      usuContr: this.session.user,
      idSolicitud: this.idsolicitud,
      nombreArchivo: this.selectedFile.name,
      ficBas64: this.base64code
    };

    // Enviar directamente al backend usando el servicio HTTP
    this.http.post(`${environment.apiUrl}documentoSolicitud/crear`, JSON.stringify(uploadData), {
      headers: this.httpHeaders
    })
      .subscribe({
        next: (response) => {
          // Desactivar el spinner
          this.subidaArchivo = false;

          this.fileUploadService.showUploadSuccess(this.selectedFile!.name);

          // Limpiar el formulario
          this.clearUploadForm();

          // Cerrar el modal automáticamente
          const modal = document.getElementById('documentoModal');
          if (modal) {
            const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            } else {
              this.cerrarModal('documentoModal');
            }
          }

          // Recargar la página después de un breve delay para evitar problemas con el modal
          setTimeout(() => {
            window.location.reload();
          }, 1500); // 1.5 segundos para que el usuario vea el mensaje de éxito
        },
        error: (error) => {
          // Desactivar el spinner en caso de error
          this.subidaArchivo = false;

          this.fileUploadService.showUploadError(error.error || 'Error al subir el archivo');
        }
      });
  }

  /**
   * Actualiza la lista de documentos después de una subida exitosa
   */
  private refreshDocumentList(): void {
    // Recargar los datos de la tabla de documentos
    this.solicitudesServices.getDocumentosListar().subscribe(
      documentoslistar => {
        this.documentoslistar = documentoslistar;

        // Actualizar el source de la tabla jqxGrid
        this.sourceListDoc = {
          dataType: 'json',
          dataFields: [
            { name: 'id', type: 'any' },
            { name: 'archivo', type: 'any' },
            { name: 'descripcion', type: 'any' },
            { name: 'nombreArchivo', type: 'any' },
            { name: 'fechaSubida', type: 'any' },
          ],
          url: `${environment.apiUrl}documentoSolicitud/verDocProc/${this.idsolicitud}`,
          id: 'id',
        };

        // Forzar la actualización de la tabla
        if (this.myGrid) {
          this.myGrid.updatebounddata();
        }
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
    /*
      for (let index = 0; index < this.solicitudlistar.length; index++) {
        if(this.solicitudlistar[index].estado !="ACEPTADA"){
          const element = this.solicitudlistar[index];
          console.log("DESCRIPCION SOLICITUD : " + element.estado);
    
        }
      
        
      } */
  }


  public limpiaDatosEditarSolicitudes() {
    this.representanteexplistar = new RepresentanteExpLIstar();
    this.editasolicitud = new EditarSolicitud();
    this.direccionRepresentante = "";
    this.representanteexplistar.dirPosta = "";

  }

  public getrepresentanteexpediente(idPerso: number, idHisPerso: number) {
    this.expedientesService.getRepresentanteExpediente(idPerso, idHisPerso).subscribe(response => {
      if (response.idPerso) {

        this.representanteexplistar.idPerso = response.idPerso
        this.editasolicitud.idRepre = response.idPerso;
        this.editasolicitud.idHisRepre = response.idHisPerso;
        this.representanteexplistar.idHisPerso = response.idHisPerso
        this.representanteexplistar.numDocum = response.numDocum
        this.representanteexplistar.tipPerso = response.tipPerso
        this.representanteexplistar.nombre = response.nombre
        this.representanteexplistar.particula1 = response.particula1
        this.representanteexplistar.apellido1 = response.apellido1
        this.representanteexplistar.particula2 = response.particula2
        this.representanteexplistar.apellido2 = response.apellido2
        this.representanteexplistar.razSocia = response.razSocia
        this.representanteexplistar.razSocReduc = response.razSocReduc
        this.representanteexplistar.desPerEntid = response.desPerEntid
        this.representanteexplistar.localidad = response.localidad
        this.representanteexplistar.codPosta = response.codPosta
        this.representanteexplistar.dirPosta = response.dirPosta
        this.representanteexplistar.municipio = response.municipio
        this.representanteexplistar.provincia = response.provincia
        this.representanteSolicitud = response.desPerEntid;




      } else {
        console.log("NO TIENE INTERESADO")

        this.representanteexplistar = new RepresentanteExpLIstar();


      }
    },
      (error: HttpErrorResponse) => {
        console.error("Estatus del error : " + error.status);
        if (error.status == 404) {

          this.representanteexplistar = new RepresentanteExpLIstar();
          this.creasolicitud.idHisRepre = null;
          this.creasolicitud.idRepre = null;
          this.editasolicitud.idHisRepre = null;
          this.editasolicitud.idRepre = null;



        }
      }
    );




    //representanteexplistar => this. = representanteexplistar,


    this.representanteSolicitud = "";



  }


  public cadenaEstadoSolicitudes: string;


  public limpiacadenaEstadoSolicitudes() {
    this.cadenaEstadoSolicitudes = "";


  }
  public valorEstato(value: any) {
    try {

      this.solicitudesServices.getSolicitudesfiltro(value).subscribe(
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
    this.consultadni = new ConsultaDni();

    console.log("LIMPIANDO");
    this.dniok = false;
    /*
    this.nuevoexpediente.forma_apertura ="";
    this.nuevoexpediente.formaNotifi=1000;
    this.nuevoexpediente.email ="";
    this.nuevoexpediente.titulo ="";
    this.nuevoexpediente.usuario ="";
    this.nuevoexpediente.procedimiento ="";
    this.consultadni.nombre ="";
    this.consultadni.apellido1 ="";
    this.consultadni.apellido2 ="";
    this.consultadni.dirPosta ="";
    this.consultadni.codPosta = 0;
    this.consultadni.provincia ="";
    this.consultadni.municipio ="";
    
  */


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


  // pruebas de subida de datos
  uploadFile(formData: string, id: number, name: string): Observable<any> {





    let urldocsolicicrear: string = `${environment.apiUrl}documentoSolicitud/crear`;


    let varios = {
      "descripcion": this.descripcionArchivo,
      "fechaSubida": this.fechaarchivo,

      "usuContr": this.session.user,
      "idSolicitud": id,
      "nombreArchivo": name,

      "ficBas64": this.base64code


    }
    let keys = JSON.stringify(varios);

    console.log(`JSON : ${keys}`);

    console.log(`EStamos enviando a :  : ${keys}`)

    return this.http.post(urldocsolicicrear, keys, { headers: this.httpHeaders });

  }
  subirArchivo(id: number) {
    let urldocsolicicrear: string = `${environment.apiUrl}documentoSolicitud/crear`;
    let urlvacia: string = "http://"

    let varios = {
      "descripcion": this.descripcionArchivo,
      "fecha": this.fechaarchivo,
      "usuContr": this.session.user,
      "file": this.filesToUpload,

    }
    let keys = JSON.stringify(varios);

    //this.http.post(urldocsolicicrear, file).subscribe(event => {console.log('done' })

    console.log(`datos del JSON creado : ${keys}`);

    return this.http.post(urldocsolicicrear, keys, { headers: this.httpHeaders });
  }




  public relleno: string = 'Datos de prueba';

  constructor(public solicitudesServices: SolicitudesService,
    public expedientesService: ExpedientesService,
    public router: Router,
    public http: HttpClient,
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService,
    private sanitizer: DomSanitizer
  ) { }

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
      this.mostrarValidacionesAsignar = false;
    } else if (modalId === 'rechazaSoliModal') {
      this.mostrarValidacionesRechazar = false;
    } else if (modalId === 'iniciarExpedieModal') {
      this.mostrarValidacionesIniciarExpediente = false;
    } else if (modalId === 'edicionSolicitudModal') {
      this.mostrarValidacionesModificarSolicitud = false;
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
    // Limpiar formularios específicos según sea necesario
    // Por ejemplo:
    // this.creasolicitud = new CreaSolicitudNuevo();
    // this.editasolicitud = new EditarSolicitud();
    // etc.
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


    this.solicitudesServices.getVerSolicitudes(id).subscribe(
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

  public iniciarExpediente() {
    console.log("actualizo dato" + this.asuntoexpedi);
    console.log(`DATOS DE VERSOLICITUD usuario : ${this.nuevoexpediente.asunto}`)
    if (!this.nuevoexpediente.titulo) {
      this.nuevoexpediente.titulo = this.versolicitud.asunto;
    }
    this.nuevoexpediente.idDocum = this.iddocum;
    this.nuevoexpediente.idHisDocum = this.idhisDocum;
    this.nuevoexpediente.idRepre = this.idRepre;
    this.nuevoexpediente.idHisRepre = this.idHisRepre;
    this.nuevoexpediente.idHisPerso = this.versolicitud.idHisPerso;
    this.nuevoexpediente.idPerso = this.versolicitud.idPerso;
    this.nuevoexpediente.ejercicio = this.versolicitud.ejercicio;
    this.nuevoexpediente.fechaInicio = this.fechanuevoExpedi;
    // this.nuevoexpediente.fechaInicio =this.fechanuevoExpedi;
    // this.nuevoexpediente.titulo =this.versolicitud.asunto;
    this.nuevoexpediente.forma_apertura = "INSTANCIA";
    this.nuevoexpediente.idsolicitud = this.idsolicitud;

    this.expedientesService.crearExpediente(this.nuevoexpediente).subscribe(response => {
      console.log("EXPEDIENTE CREADO : ---->" + JSON.stringify(response.numero))

      this.notificationService.success(`Se ha creado el expediente: ${response.ejercicio}/${response.numero}`);
      // this.router.navigate(['/solicitudes'])



      this.sourceSolici = new jqx.dataAdapter({

        dataType: 'json',

        dataFields: [
          { name: 'id', type: 'any' },
          { name: 'fecInicio', type: 'any' },
          { name: 'asunto', type: 'any' },
          { name: 'numDocum', type: 'any' },
          { name: 'estado', type: 'any' },
          { name: 'usuario', type: 'any' },
          { name: 'expediente', type: 'any' },
          { name: 'personaEntidad', type: 'any' },
          { name: 'ejeNumRegis', type: 'any' },
          { name: 'numero', type: 'any' },
          { name: 'ejercicio', type: 'any' },
          { name: 'idExpediente', type: 'any' },
          { name: 'nomRepre', type: 'any' },
          { name: 'idRepre', type: 'any' },
          { name: 'idHisRepre', type: 'any' },
          { name: 'dirRepre', type: 'any' },
          { name: 'idHisDocum', type: 'any' },
          { name: 'idDocum', type: 'any' },
        ],


        url: `${environment.apiUrl}solicitud/listar/${this.idOrgEleme}`,
        id: 'id',
        sortcolumn: 'id',
        sortdirection: 'desc'

      }
      );

    },
      (error: HttpErrorResponse) => { }
    );
  }


  public solicitadni(dni: string) {


    this.expedientesService.getDni(dni).subscribe(
      consultadni => this.consultadni = consultadni


    );
    //console.log(dni);
    this.dniok = true;



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


    this.solicitudesServices.creaExpediente(this.idexpediente).subscribe(response => this.router.navigate(['/solicitudes']));


  }

  public resultacrearsolici: string;

  public borraDatosSolicitud() {
    this.creasolicitud = new CreaSolicitudNuevo();
    this.consultadni = new ConsultaDni();
    this.dniok = false;
    this.documrepre = false;
    this.existeRepresentante = false;
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
  public controlpersonaentidadcrear: boolean = false;
  public crearPersonaEntidad(dni: string) {
    if (this.crearpersonaentidad.nombre || this, this.crearpersonaentidad.apellido1 || this.crearpersonaentidad.apellido2 ||
      this.crearpersonaentidad.dirPosta || this.crearpersonaentidad.municipio || this.crearpersonaentidad.provincia) {
      this.controlpersonaentidadcrear = true;
      this.expedientesService.crearPersonaEntidad(this.crearpersonaentidad, dni).subscribe(data => {
        this.controlpersonaentidadcrear = true;

      })


    } else {
      this.controlpersonaentidadcrear = false;
      this.notificationService.incompleteFields('Por favor, complete todos los campos obligatorios del interesado.');

    }

  }

  public selectnombre: boolean = false
  public selectape1: boolean = false
  public selectape2: boolean = false
  public selectRazonSocial: boolean = false
  //public selectnombre:boolean = false

  public selectCIF: boolean = false
  public selectTRESIDENTE: boolean = false


  public selecTipPerso(valor: any) {
    console.log(" valor : " + valor)

    switch (valor) {
      case "1":
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = true;
        this.selectRazonSocial = false;



        console.log("DNI")

        break;
      case "2":
        this.selectnombre = false;
        this.selectape1 = false;
        this.selectape2 = false;
        this.selectRazonSocial = true;
        console.log("CIF")

        break;
      case "3":
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = false;
        this.selectRazonSocial = false;


        console.log("Tar. Residencia")

        break;

    }

  }


  // provincias y municipios
  public provin: any[] = PROVIN;
  public municio: any[] = MUNICIO;

  public municiflitro: any[] = [];


  public gestimunicip(id: any) {
    this.municiflitro = [];



    for (let index = 0; index < this.municio.length; index++) {
      const element = this.municio[index];
      if (element.id.substring(0, 2) == id) {
        this.municiflitro.push(element)

      }


    }

  }
  public cambioRepresentante: boolean = false;
  public cambioRepresentantePideDocu: boolean = false;
  public documrepre: boolean = false;

  public cambiamosRepre() {
    this.cambioRepresentante = false;
    this.representanteok = false;
    this.existeRepresentante = false;
    this.documrepre = true;
    this.dniok = false;

    this.cambioRepresentantePideDocu = true;
    console.log("cambiamos repre")

  };
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

  public creaSolicitud() {

    this.creasolicitud.ejercicio = this.creasolicitud.fecInicio.toString().substring(0, 4)

    if (this.controlpersonaentidadcrear) {
      //  this.crearPersonaEntidad(this.creasolicitud.dni);

    }

    //this.creasolicitud.usuario = this.usuarioAsignado;
    console.log("ejercicio : ." + this.creasolicitud.ejercicio)
    console.log("ejercicio : ." + this.ejercicio)
    console.log("fecInicio : ." + this.creasolicitud.fecInicio)
    console.log("usuario : ." + this.creasolicitud.usuario)
    console.log("asunto : ." + this.creasolicitud.asunto)
    console.log("Representante : ." + this.creasolicitud.representante)
    if (this.seleccionoRepre == "1") {
      console.log("REPRESENTANTE SELECCIONADO")
      console.log("valor de seleccionoRepre : " + this.seleccionoRepre)
      this.creasolicitud.idHisRepre = this.representanteexplistar.idHisPerso;
      this.creasolicitud.idRepre = this.representanteexplistar.idPerso;
    } else {
      console.log("REPRESENTANTE NO SELECCIONADO")
      console.log("valor de seleccionoRepre : " + this.seleccionoRepre)

    }

    this.controlpersonaentidadcrear = true;

    // this.solicitudesServices.creaSolicitud(this.creasolicitud).subscribe(
    this.solicitudesServices.creaSolicitud(this.creasolicitud).subscribe({
      next: (data) => {
        console.log("mensaje de respuesta SOLICITUD : " + data.asunto);
        this.resultacrearsolici = data.asunto;

        if (data.asunto) {
          this.notificationService.saveSuccess('Solicitud');

          // Limpiar errores y cerrar modal solo en caso de éxito
          this.limpiarErroresSolicitud();
          this.modalManagerService.closeModal('nsolicitudModal');

          setTimeout(this.recargapagina, 1000);
        } else {
          this.notificationService.error('No se pudo crear la solicitud');
          // Mantener el modal abierto en caso de error
          this.modalManagerService.keepModalOpen('nsolicitudModal');
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 500) {
          this.notificationService.error('No se pudo crear la solicitud');
        } else {
          this.notificationService.error('Error al crear la solicitud');
        }

        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('nsolicitudModal');
      }
    });


  }




  public asignara(id: number): void {
    this.solicitudesServices.AsignarA(this.editasolicitud, id)
      .subscribe(response => this.router.navigate(['/solicitudes']));
    setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo
  };

  /**
   * Función de validación para el usuario asignado
   */
  public isUsuarioAsignadoInvalid(): boolean {
    return this.mostrarValidacionesAsignar && (!this.editasolicitud.usuario || this.editasolicitud.usuario === '');
  }

  /**
   * Función de validación para el motivo de rechazo
   */
  public isMotivoRechazoInvalid(): boolean {
    return this.mostrarValidacionesRechazar && (!this.editasolicitud.motivoRechazo || this.editasolicitud.motivoRechazo.trim() === '');
  }

  /**
   * Función de validación para el título del expediente
   */
  public isTituloExpedienteInvalid(): boolean {
    return this.mostrarValidacionesIniciarExpediente && (!this.nuevoexpediente.titulo || this.nuevoexpediente.titulo.trim() === '');
  }

  /**
   * Función de validación para el procedimiento
   */
  public isProcedimientoInvalid(): boolean {
    return this.mostrarValidacionesIniciarExpediente && (!this.nuevoexpediente.procedimiento || this.nuevoexpediente.procedimiento === '');
  }

  /**
   * Función de validación para el asunto en modificar solicitud
   */
  public isAsuntoModificarInvalid(): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!this.editasolicitud.asunto || this.editasolicitud.asunto.trim() === '');
  }

  /**
   * Función de validación para la fecha en modificar solicitud
   */
  public isFechaModificarInvalid(): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!this.editasolicitud.fecInicio);
  }

  /**
   * Función de validación para el DNI en modificar solicitud
   */
  public isDniModificarInvalid(): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!this.editasolicitud.dni || this.editasolicitud.dni.trim() === '');
  }

  /**
   * Maneja el envío del formulario de asignación con validaciones y feedback mejorado
   */
  public onAsignarSubmit(): void {
    // Activar validaciones visuales
    this.mostrarValidacionesAsignar = true;

    if (!this.editasolicitud.usuario) {
      this.notificationService.incompleteFields('Debe seleccionar un usuario para asignar la solicitud');
      return;
    }

    // Confirmar la asignación
    this.notificationService.confirm({
      title: '¿Confirmar asignación?',
      text: `¿Está seguro de asignar esta solicitud a ${this.editasolicitud.usuario}?`
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignacion();
      }
    });
  }

  /**
   * Ejecuta la asignación de la solicitud con manejo de errores mejorado
   */
  private ejecutarAsignacion(): void {
    this.isAsignando = true;

    this.solicitudesServices.AsignarA(this.editasolicitud, this.idsolicitud)
      .subscribe({
        next: (response) => {
          this.isAsignando = false;
          this.cerrarModal('asignarModal');

          this.notificationService.success(`Solicitud asignada correctamente a ${this.editasolicitud.usuario}`)
            .then(() => {
              this.router.navigate(['/solicitudes']);
              setTimeout(this.recargarpagina, 1000);
            });
        },
        error: (error) => {
          this.isAsignando = false;
          console.error('Error al asignar solicitud:', error);

          this.notificationService.error('Ha ocurrido un error al asignar la solicitud. Inténtelo de nuevo.');
        }
      });
  }





  /**
   * Maneja el envío del formulario de rechazo con validaciones y feedback mejorado
   */
  public onRechazarSubmit(): void {
    // Activar validaciones visuales
    this.mostrarValidacionesRechazar = true;

    if (!this.editasolicitud.motivoRechazo || this.editasolicitud.motivoRechazo.trim() === '') {
      this.notificationService.incompleteFields('Debe indicar un motivo para rechazar la solicitud');
      return;
    }

    // Confirmar el rechazo usando confirmDelete ya que es una acción destructiva
    this.notificationService.confirmDelete('solicitud').then((result) => {
      if (result.isConfirmed) {
        this.ejecutarRechazo();
      }
    });
  }

  /**
   * Ejecuta el rechazo de la solicitud con manejo de errores mejorado
   */
  private ejecutarRechazo(): void {
    this.isRechazando = true;
    this.editasolicitud.estado = "RECHAZADA";

    this.solicitudesServices.editaSolicitud(this.editasolicitud, this.idsolicitud)
      .subscribe({
        next: (response) => {
          this.isRechazando = false;
          this.cerrarModal('rechazaSoliModal');

          this.notificationService.success(`Solicitud rechazada correctamente.\nMotivo: ${this.editasolicitud.motivoRechazo}`)
            .then(() => {
              this.router.navigate(['/solicitudes']);
              setTimeout(this.recargarpagina, 1000);
            });
        },
        error: (error) => {
          this.isRechazando = false;
          console.error('Error al rechazar solicitud:', error);

          this.notificationService.error('Ha ocurrido un error al rechazar la solicitud. Inténtelo de nuevo.');
        }
      });
  }

  /**
   * Maneja el envío del formulario de iniciar expediente con validaciones y feedback mejorado
   */
  public onIniciarExpedienteSubmit(): void {
    // Activar validaciones visuales
    this.mostrarValidacionesIniciarExpediente = true;

    // Validar campos obligatorios
    if (!this.nuevoexpediente.titulo || this.nuevoexpediente.titulo.trim() === '') {
      this.notificationService.incompleteFields('Debe indicar un título para el expediente');
      return;
    }

    if (!this.nuevoexpediente.procedimiento || this.nuevoexpediente.procedimiento === '') {
      this.notificationService.incompleteFields('Debe seleccionar un procedimiento');
      return;
    }

    // Confirmar la creación del expediente
    this.notificationService.confirm({
      title: '¿Confirmar creación de expediente?',
      text: `¿Está seguro de crear el expediente con el título: "${this.nuevoexpediente.titulo}"?`
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarIniciarExpediente();
      }
    });
  }

  /**
   * Ejecuta la creación del expediente con manejo de errores mejorado
   */
  private ejecutarIniciarExpediente(): void {
    this.isIniciandoExpediente = true;

    // Preparar datos del expediente
    this.prepararDatosExpediente();

    this.expedientesService.crearExpediente(this.nuevoexpediente).subscribe({
      next: (response) => {
        this.isIniciandoExpediente = false;
        this.cerrarModal('iniciarExpedieModal');

        this.notificationService.success(`Se ha creado el expediente: ${response.ejercicio}/${response.numero}`)
          .then(() => {
            this.recargarpagina();
          });
      },
      error: (error) => {
        this.isIniciandoExpediente = false;
        console.error('Error al crear expediente:', error);

        this.notificationService.error('Ha ocurrido un error al crear el expediente. Inténtelo de nuevo.');
      }
    });
  }

  /**
   * Prepara los datos del expediente antes de enviarlo
   */
  private prepararDatosExpediente(): void {
    console.log("actualizo dato" + this.asuntoexpedi);
    console.log(`DATOS DE VERSOLICITUD usuario : ${this.nuevoexpediente.asunto}`)

    if (!this.nuevoexpediente.titulo) {
      this.nuevoexpediente.titulo = this.versolicitud.asunto;
    }

    this.nuevoexpediente.idDocum = this.iddocum;
    this.nuevoexpediente.idHisDocum = this.idhisDocum;
    this.nuevoexpediente.idRepre = this.idRepre;
    this.nuevoexpediente.idHisRepre = this.idHisRepre;
    this.nuevoexpediente.idHisPerso = this.versolicitud.idHisPerso;
    this.nuevoexpediente.idPerso = this.versolicitud.idPerso;
    this.nuevoexpediente.ejercicio = this.versolicitud.ejercicio;
    this.nuevoexpediente.fechaInicio = this.fechanuevoExpedi;
    this.nuevoexpediente.forma_apertura = "INSTANCIA";
    this.nuevoexpediente.idsolicitud = this.idsolicitud;
  }

  /**
   * Maneja el envío del formulario de modificar solicitud con validaciones y feedback mejorado
   */
  public onModificarSolicitudSubmit(): void {
    // Activar validaciones visuales
    this.mostrarValidacionesModificarSolicitud = true;

    // Validar campos obligatorios
    let hasErrors = false;

    if (!this.editasolicitud.asunto || this.editasolicitud.asunto.trim() === '') {
      this.notificationService.incompleteFields('El asunto es obligatorio');
      hasErrors = true;
    }

    if (!this.editasolicitud.fecInicio) {
      this.notificationService.incompleteFields('La fecha de solicitud es obligatoria');
      hasErrors = true;
    }

    if (!this.editasolicitud.dni || this.editasolicitud.dni.trim() === '') {
      this.notificationService.incompleteFields('El DNI del interesado es obligatorio');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Confirmar la modificación
    this.notificationService.confirm({
      title: '¿Confirmar modificación?',
      text: `¿Está seguro de modificar esta solicitud?`
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarModificarSolicitud();
      }
    });
  }

  /**
   * Ejecuta la modificación de la solicitud con manejo de errores mejorado
   */
  private ejecutarModificarSolicitud(): void {
    this.isModificandoSolicitud = true;

    // Preparar datos del representante
    this.prepararDatosRepresentante();

    this.solicitudesServices.editaSolicitud(this.editasolicitud, this.idsolicitud)
      .subscribe({
        next: (response) => {
          this.isModificandoSolicitud = false;
          this.cerrarModal('edicionSolicitudModal');

          this.notificationService.success('Solicitud modificada correctamente')
            .then(() => {
              this.recargarpagina();
              this.limpiarDatosModificar();
            });
        },
        error: (error) => {
          this.isModificandoSolicitud = false;
          console.error('Error al modificar solicitud:', error);

          this.notificationService.error('Ha ocurrido un error al modificar la solicitud. Inténtelo de nuevo.');
        }
      });
  }

  /**
   * Prepara los datos del representante antes de enviar
   */
  private prepararDatosRepresentante(): void {
    if (this.seleccionoRepre == "1") {
      this.editasolicitud.idHisRepre = this.representanteexplistar.idHisPerso;
      this.editasolicitud.idRepre = this.representanteexplistar.idPerso;
      console.log("Representante seleccionado");
    } else {
      this.editasolicitud.idHisRepre = null;
      this.editasolicitud.idRepre = null;
      this.representanteexplistar.idHisPerso = null;
      this.representanteexplistar.idPerso = null;
      console.log("Sin representante");
    }
  }

  /**
   * Limpia los datos del formulario de modificar
   */
  private limpiarDatosModificar(): void {
    this.representanteexplistar.desPerEntid = "";
    this.representanteSolicitud = "";
    this.limpiaDatosEditarSolicitudes();
  }

  public soliciUsuarioOLD(dni: string) {  // para borrar cuando toque


    this.solicitudesServices.getDni(dni).subscribe(
      consultadni => this.consultadni = consultadni


    );
    // console.log(dni);
    this.dniok = true;

    this.getrepresentanteexpediente(this.consultadni.idPerso, this.consultadni.idHisPerso)



    //console.log(this.consultadni.nombre);
    // console.log(this.apellido1);
    //console.log(this.apellido2);


    /*
      
      this.login(this.usuario).subscribe(response =>{
        console.log(response);
        //console.log(`DAtos de usuario : $`)
        
        
        
        //console.log(performance.navigation.type);
        //console.log(`datos del login : ${performance.navigation.type} `);
        
        
        this.router.navigate(['/inicio']);
        Swal.fire('Login',`Bienvenido ${response.usuario}`,'success');
        
          },err => {
            if (err.status ==404){
              Swal.fire('Error Login','Usuario o Clave incorrectas!!', 'error');
            }
          }
          );
        
        
        }
        
        
    */

  }


  public nombredni!: string
  public apellido1dni!: any
  public apellido2dni!: any
  public direcciondni!: string
  public cpdni!: any
  public provinciadni!: any
  public nommunicipiodni!: any
  public idhispersodni!: any;
  public idpersodni!: any;
  public seleccionoRepre!: String;
  public seleccionoNuevoRepre!: String;


  public soliciUsuarioEdicion(dni: string) {

    // this.formanotificacion = true;
    this.expedientesService.getDni2(dni).subscribe(response => {
      this.nombredni = response.desPerEntid;
      this.apellido1dni = response.apellido1;
      this.apellido2dni = response.apellido2;
      this.dirPosta = response.dirPosta;
      this.codPosta = response.codPosta.toString();
      this.provincia = response.provincia;
      this.idhispersodni = response.idHisPerso;
      this.idpersodni = response.idPerso;
      this.creasolicitud.idPerso = response.idPerso
      this.creasolicitud.idHisPerso = response.idHisPerso;
      this.Municipio = response.municipio;
      this.representanteSolicitud = response.desPerEntid;


      // consultadni =>this.consultadni = consultadni
      if (response.nombre) {
        console.log("RESPUESTA : " + response.nombre);
        this.getrepresentanteexpediente(response.idPerso, response.idHisPerso);

      }

    }



    );


    console.log(dni);
    this.dniok = true;


    //setTimeout(this.getrepresentanteexpediente,1500)
    // this.getrepresentanteexpediente ();



  }

  public existepersonaentidad: boolean = false;
  public existeRepresentante: boolean = false;

  public soliciUsuario(dni: string) {

    // this.formanotificacion = true;
    try {
      this.expedientesService.getDni2(dni).subscribe(response => {
        this.nombredni = response.desPerEntid;
        this.apellido1dni = response.apellido1;
        this.apellido2dni = response.apellido2;
        this.direcciondni = response.dirPosta;
        this.cpdni = response.codPosta;
        this.provinciadni = response.provincia;
        this.idhispersodni = response.idHisPerso;
        this.idpersodni = response.idPerso;
        this.creasolicitud.idPerso = response.idPerso
        this.creasolicitud.idHisPerso = response.idHisPerso;
        this.nommunicipiodni = response.municipio;

        // actualizamos lista de REPRESENTANTES



        this.sourceListRepre = new jqx.dataAdapter({
          dataType: 'json',

          dataFields: [
            { name: 'id', type: 'any' },
            { name: 'idPerso', type: 'any' },
            { name: 'idHisPerso', type: 'any' },
            { name: 'desPerEntid', type: 'any' },
            { name: 'dirPosta', type: 'any' },




          ],
          url: `${environment.apiUrl}personaRepresentante/listar/${this.creasolicitud.idPerso}/${this.creasolicitud.idHisPerso}`,

          // url: `${environment.apiUrl}personaRepresentante/listar/5022/2516` ,
          id: 'id',
          sortcolumn: 'id',
          sortdirection: 'desc'
        }



        );
        console.log("+++++ POR AQUI VOY +++++++")
        console.log(`${environment.apiUrl}personaRepresentante/listar/${this.creasolicitud.idPerso}/${this.creasolicitud.idHisPerso}`)
        console.log(` ------> ${this.creasolicitud.idPerso}/${this.creasolicitud.idHisPerso}`)




        // consultadni =>this.consultadni = consultadni
        if (response.nombre) {
          console.log("RESPUESTA : " + response.nombre);
          console.log("IDPERSO : " + response.idPerso);
          this.dniok = true;
          this.InteresadoSolicitud = response.desPerEntid;
          this.dirPosta = response.dirPosta;
          this.codPosta = response.codPosta.toString();
          this.provincia = response.provincia;
          this.Municipio = response.municipio;
          this.editasolicitud.idPerso = response.idPerso;
          this.editasolicitud.idHisPerso = response.idHisPerso;
          this.controlpersonaentidadcrear = true;


          //  this.getrepresentanteexpediente(response.idPerso,response.idHisPerso); //tenemos la consulta ya 
        } else {

          this.dniok = false;
          this.existepersonaentidad = true;
          this.controlpersonaentidadcrear = false;


        }

      }, err => {
        if (err.status == 404) {
          this.notificationService.error('El interesado no está registrado. Por favor introduzca los datos para el alta.');
          this.existepersonaentidad = true;
          this.dniok = false;

        } else {
          this.existepersonaentidad = false;

        }
      }



      );


    } catch (error) {
      console.log("ERROR ----> " + error);

      this.sourceListRepre = new jqx.dataAdapter({
        dataType: 'json',

        dataFields: [
          { name: 'id', type: 'any' },
          { name: 'idPerso', type: 'any' },
          { name: 'idHisPerso', type: 'any' },
          { name: 'desPerEntid', type: 'any' },
          { name: 'dirPosta', type: 'any' },





        ],
        url: `${environment.apiUrl}personaRepresentante/listar/${this.creasolicitud.idPerso}/${this.creasolicitud.idHisPerso}`,

        // url: `${environment.apiUrl}personaRepresentante/listar/5022/2516` ,
        id: 'id',
        //  sortcolumn: 'id',
        //  sortdirection: 'desc'

      }



      );

    }


    console.log(dni);
    //this.dniok =true;


    //setTimeout(this.getrepresentanteexpediente,1500)
    // this.getrepresentanteexpediente ();



  }

  public representanteok: boolean = false;

  public vernumerorepre: boolean = false;

  public soliciUsuarioparaRepre(dni: string) {

    console.log("DNI REPRESENTANTE: " + dni)

    // this.formanotificacion = true;
    this.expedientesService.getDni2(dni).subscribe(response => {


      this.nombredni = response.desPerEntid;
      this.apellido1dni = response.apellido1;
      this.apellido2dni = response.apellido2;
      this.direcciondni = response.dirPosta;
      this.cpdni = response.codPosta;
      this.provinciadni = response.provincia;
      this.idhispersodni = response.idHisPerso;
      this.idpersodni = response.idPerso;
      this.creasolicitud.idRepre = response.idPerso
      this.creasolicitud.idHisRepre = response.idHisPerso;
      this.nommunicipiodni = response.municipio;


      // consultadni =>this.consultadni = consultadni
      if (response.nombre) {
        console.log("RESPUESTA : " + response.nombre);
        console.log("IDPERSO : " + response.idPerso);
        this.dniok = false;
        this.representanteok = true;
        this.existeRepresentante = false;
        this.vernumerorepre = true;
        this.cambioRepresentantePideDocu = false;


        this.InteresadoSolicitud = response.desPerEntid;
        this.dirPosta = response.dirPosta;
        this.codPosta = response.codPosta.toString();
        this.provincia = response.provincia;
        this.Municipio = response.municipio;
        this.editasolicitud.idPerso = response.idPerso;
        this.editasolicitud.idHisPerso = response.idHisPerso;
        this.controlpersonaentidadcrear = true;




        //this.getrepresentanteexpediente(response.idPerso,response.idHisPerso); //tenemos la consulta ya 
      } else {
        this.existeRepresentante = true;
        this.representanteok = false;
        this.dniok = false;
        this.existepersonaentidad = true;
        this.controlpersonaentidadcrear = false;
        this.documrepre = true;


      }

    }, err => {
      if (err.status == 404) {
        swal.fire('El Representante no está registrado', 'Por favor introduzca los datos para el alta', 'error');
        this.existeRepresentante = true;
        this.dniok = false;
        this.representanteok = false;

      } else {
        this.existeRepresentante = false;
        this.representanteok = true;

      }
    }



    );


    console.log(dni);
    //this.dniok =true;


    //setTimeout(this.getrepresentanteexpediente,1500)
    // this.getrepresentanteexpediente ();



  }
  public soliciUsuarioparaRepreMuevo(dni: string) {

    console.log("DNI REPRESENTANTE: " + dni)

    // this.formanotificacion = true;
    this.expedientesService.getDni2(dni).subscribe(response => {


      this.nombredni = response.desPerEntid;
      this.apellido1dni = response.apellido1;
      this.apellido2dni = response.apellido2;
      this.direcciondni = response.dirPosta;
      this.cpdni = response.codPosta;
      this.provinciadni = response.provincia;
      this.idhispersodni = response.idHisPerso;
      this.idpersodni = response.idPerso;
      this.creasolicitud.idRepre = response.idPerso
      this.creasolicitud.idHisRepre = response.idHisPerso;
      this.nommunicipiodni = response.municipio;


      // consultadni =>this.consultadni = consultadni
      if (response.nombre) {
        console.log("RESPUESTA : " + response.nombre);
        console.log("IDPERSO : " + response.idPerso);
        this.dniok = false;
        this.representanteok = false;
        this.existeRepresentante = false;


        this.InteresadoSolicitud = response.desPerEntid;
        this.dirPosta = response.dirPosta;
        this.codPosta = response.codPosta.toString();
        this.provincia = response.provincia;
        this.Municipio = response.municipio;
        this.editasolicitud.idPerso = response.idPerso;
        this.editasolicitud.idHisPerso = response.idHisPerso;
        this.controlpersonaentidadcrear = true;




        //this.getrepresentanteexpediente(response.idPerso,response.idHisPerso); //tenemos la consulta ya 
      } else {
        this.representanteok = false;
        this.dniok = false;
        this.existepersonaentidad = true;
        this.controlpersonaentidadcrear = false;


      }

    }, err => {
      if (err.status == 404) {
        swal.fire('El Representante no está registrado', 'Por favor introduzca los datos para el alta', 'error');
        this.existeRepresentante = true;
        this.dniok = false;
        this.representanteok = false;

      } else {
        this.existeRepresentante = false;
        this.representanteok = true;

      }
    }



    );


    console.log(dni);
    //this.dniok =true;


    //setTimeout(this.getrepresentanteexpediente,1500)
    // this.getrepresentanteexpediente ();



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
  public InteresadoSolicitud!: any;
  public usuarioSolicitud!: string;
  public asuntoSolicitud!: string;
  public representanteSolicitud!: string;
  public persoEntiDocu!: any;
  public dirPosta!: string;
  public codPosta!: string;
  public provincia!: string;
  public Municipio!: string;
  public CambioFormatoFecha!: string;
  public fecInicio!: string;

  public preparaFechaGeneral(fechaDato: any) {

    let anio: string = fechaDato.toString().substring(0, 4);
    let mes: string = fechaDato.toString().substring(5, 7);
    let dia: string = fechaDato.toString().substring(8, 10);

    /*
      let year = this.fecha.getFullYear()
      let month =this.fecha.getMonth()
      let me = this.fecha.getDate()
    
    */

    let fechaordenada: string = dia + "/" + mes + "/" + anio;
    this.CambioFormatoFecha = fechaordenada;



    //console.log(`VER dia: ${dia}`);
    //console.log(`VER mes : ${mes}`);
    //console.log(`VER año: ${anio}`);
    //console.log(`VER CORTES DE FECHA DATO: ${fechaordenada}`);
    //console.log(` FECHA de sistema: ${this.fecha}`);

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

    swal.fire({
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
      this.expedientesService.getRegistroDocVer(rowData.idHisDocum).subscribe(
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
    this.InteresadoSolicitud = rowData.personaEntidad.desPerEntid;
    this.dirPosta = rowData.personaEntidad.dirPosta;
    this.codPosta = rowData.personaEntidad.codPosta;
    this.provincia = rowData.personaEntidad.provincia;
    this.Municipio = rowData.personaEntidad.municipio;
    this.usuarioSolicitud = rowData.usuario;
    this.asuntoSolicitud = rowData.asunto;
    this.representanteSolicitud = rowData.nomRepre;
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
      this.sourceListExpe = ({
        dataType: 'json',

        dataFields: [
          { name: 'id', type: 'any' },

          { name: 'ejercicio', type: 'any' },
          { name: 'solicitud', type: 'any' },
          { name: 'instructor', type: 'any' },
          { name: 'titulo', type: 'any' },
          { name: 'fecInicio', type: 'any' },
          { name: 'estado', type: 'any' }



        ],

        url: `${environment.apiUrl}expediente/ver/${this.idexpedienteAsoc}`,
        id: 'id',


      }



      );




    } else {
      this.activainiciaExpedi = false;
    }
    this.sourceListExpe = ({
      dataType: 'json',

      dataFields: [
        { name: 'id', type: 'any' },

        { name: 'ejercicio', type: 'any' },
        { name: 'solicitud', type: 'any' },
        { name: 'instructor', type: 'any' },
        { name: 'titulo', type: 'any' },
        { name: 'fecInicio', type: 'any' },
        { name: 'estado', type: 'any' }



      ],

      url: `${environment.apiUrl}expediente/ver/${this.idexpedienteAsoc}`,
      id: 'id',

    }



    );



    this.sourceListDoc = ({
      dataType: 'json',

      dataFields: [
        { name: 'id', type: 'any' },
        { name: 'archivo', type: 'any' },
        { name: 'descripcion', type: 'any' },
        { name: 'nombreArchivo', type: 'any' },
        { name: 'fechaSubida', type: 'any' },





      ],

      url: `${environment.apiUrl}documentoSolicitud/verDocProc/${this.idsolicitud}`,
      id: 'id',


    }



    );



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

    this.expedientesService.getExpediente2(this.idexpedienteAsoc).subscribe(
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
    if (this.seleccionoRepre == "1") {
      this.editasolicitud.idHisRepre = this.representanteexplistar.idHisPerso;
      this.editasolicitud.idRepre = this.representanteexplistar.idPerso;

      console.log("No QUEREMOS REPRESENTANTE!!!!");
    } else {
      this.editasolicitud.idHisRepre = null;
      this.editasolicitud.idRepre = null;
      this.representanteexplistar.idHisPerso = null;
      this.representanteexplistar.idPerso = null;
      console.log("No QUEREMOS REPRESENTANTE!!!!");
      console.log("idhisrepre " + this.representanteexplistar.idHisPerso);
      console.log("idrepre " + this.representanteexplistar.idPerso);


    }




    this.solicitudesServices.editaSolicitud(this.editasolicitud, id)

      .subscribe(response => {
        this.sourceSolici = new jqx.dataAdapter({

          dataType: 'json',

          dataFields: [
            { name: 'id', type: 'any' },
            { name: 'fecInicio', type: 'any' },
            { name: 'asunto', type: 'any' },
            { name: 'numDocum', type: 'any' },
            { name: 'estado', type: 'any' },
            { name: 'usuario', type: 'any' },
            { name: 'expediente', type: 'any' },
            { name: 'personaEntidad', type: 'any' },
            { name: 'ejeNumRegis', type: 'any' },
            { name: 'numero', type: 'any' },
            { name: 'ejercicio', type: 'any' },
            { name: 'idExpediente', type: 'any' },
            { name: 'nomRepre', type: 'any' },
            { name: 'idRepre', type: 'any' },
            { name: 'idHisRepre', type: 'any' },
            { name: 'dirRepre', type: 'any' },
            { name: 'idHisDocum', type: 'any' },
            { name: 'idDocum', type: 'any' }



          ],


          url: `${environment.apiUrl}solicitud/listar/${this.idOrgEleme}`,
          id: 'id',
          sortcolumn: 'id',
          sortdirection: 'desc'

        }



        );
        //this.router.navigate(['/solicitudes'])
        console.log("enviamos nueva fecha : " + this.editasolicitud.fecInicio)
      });
    //setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo

    this.representanteexplistar.desPerEntid = "";
    this.representanteSolicitud = "";
    //this.representanteexplistar.dirPosta ="";
    this.limpiaDatosEditarSolicitudes();




    //this.representanteexplistar = new RepresentanteExpLIstar();



  };

  rechazarSolicitud(id: number): void {

    if (!this.editasolicitud.motivoRechazo) {
      this.notificationService.incompleteFields('Por favor, complete el motivo de rechazo.');
      return;
    } else {
      this.notificationService.confirmDelete('solicitud').then((result) => {
        if (result.isConfirmed) {

          this.editasolicitud.estado = "RECHAZADA";



          this.solicitudesServices.editaSolicitud(this.editasolicitud, id)

            .subscribe(response => this.router.navigate(['/solicitudes']));

          setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo




          swal.fire(
            'Rechazada!',
            'La solicitud fue rechazada.',
            'success'
          )
        }
      })



    }


  };

  recargarpagina() {
    window.location.reload();
  }


  deleteSolicitudes(id: number) {

    swal.fire({
      title: "¿ Confirma eliminar la solicitud : " + this.ejerNumeroSolicitud + " ?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudesServices.deleteSolicitud(id).subscribe(response => {


          /*
            this.sourceSolici =({
             
              dataType: 'json',
              
              dataFields: [
                { name : 'id',type :'any'},      
                { name : 'fecInicio',type :'any'},
                { name : 'asunto',type :'any'},
                { name : 'numDocum',type :'any'},
                { name : 'estado',type :'any'},
                { name : 'usuario',type :'any'},
                { name : 'expediente',type :'any' },
                { name : 'personaEntidad',type :'any' },
                { name : 'ejeNumRegis',type :'any' },
                { name : 'numero',type :'any'},
                { name : 'ejercicio',type :'any'},
               { name : 'idExpediente',type :'any' },
               { name : 'nomRepre',type :'any' },
               { name : 'idRepre',type :'any' },
               { name : 'idHisRepre',type :'any' },
               { name : 'dirRepre',type :'any' },
               { name : 'idHisRepre',type :'any' }
               
                
                
                
              ],
              
              url: `${environment.apiUrl}solicitud/listar/${this.idOrgEleme}` ,
              id: 'id',
            //  sortcolumn: 'id',
              sortdirection: 'desc'
          
             }
          
             
             
             );//
          */


          swal.fire(
            'Eliminada!',
            `Solicitud  ${this.ejerNumeroSolicitud} eliminada!`,
            'success'
          )
          setTimeout(this.recargapagina, 1000);
          // this.router.navigate(['/solicitudes'])
        },
          (err: HttpErrorResponse) => {

            console.log('paso por error: ' + err.error.text);
            this.notificationService.warning('No se pudo borrar la solicitud. Tiene documentos asociados.')    // AQUI GESTIONAMOS EL ERROR
          },



        );
        console.log(`SOLICITUD  ${this.idsolicitud} ELIMINADA`);
        //setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo



      }
    })




  }


  // generamos pdf con datos de solicitudes



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




    /*
    const content = this.content.nativeElement;
  
      // Obtiene el contenido HTML del div
      const htmlContent = content.innerHTML;
  
    const doc = new jsPDF.jsPDF({
      orientation: 'landscape'
      
    });
  
   // doc.text('ASUNTO                            FECHA SOLICITUD   EJERCICIO/NÚMERO   ESTADO  ', 10, 5);
    let contador:any = 10
  
  
    for (let index = 0; index < this.solicitudlistar.length; index++) {
      if(this.solicitudlistar[index].estado !="ACEPTADA"){
        const element = this.solicitudlistar[index];
       
  
      contador= contador +5
  
  
      
     // doc.text(element.asunto +"   " + element.fecInicio +"         " + element.ejeNumRegis +"   " + element.estado, 5, contador);
      console.log("CONTADOR: " + contador)
      
  
      }
  
      
      
      
    }
  
    doc.text (htmlContent, 15, 15);
    //doc.text('Solicitudes Pendientes!', 10, 10);
    //doc.text('Solicitudes Pendientes1!', 10, 15);
    doc.save( `solicitudesPendientes${this.lafecha}.pdf`);
  
    
    const content = this.content.nativeElement;
  
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('assets/escudo.png');
      const pdf = new jspdf.jsPDF();
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
     // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('solicitudesPendientes.pdf');
    });
  
  
  
  */
  }






  deleteDocumento(id: number | null) {

    swal.fire({
      title: '¿ Confirma eliminar el documento  ?',
      text: this.nombreArchivoSubido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,

    }).then((result) => {
      if (result.isConfirmed && id !== null) {
        this.solicitudesServices.deleteDocumento(id).subscribe(response => {

          // this.router.navigate(['/solicitudes'])
          console.log(`documento  ${this.nombreArchivoSubido} ELIMINADO`);

          // Limpiar las variables de estado después de eliminar el documento
          this.iddocumento = null;
          this.listadocmenu = false;
          this.nombreArchivoSubido = null;
          this.descargafichero = null;

          this.sourceListDoc = ({
            dataType: 'json',

            dataFields: [
              { name: 'id', type: 'any' },
              { name: 'archivo', type: 'any' },
              { name: 'descripcion', type: 'any' },
              { name: 'nombreArchivo', type: 'any' },
              { name: 'fechaSubida', type: 'any' },
            ],
            url: `${environment.apiUrl}documentoSolicitud/verDocProc/${this.idsolicitud}`,
            id: 'id',
          }
          );
        });
        swal.fire(
          'Eliminada!',
          `Documento eliminado satisfactoriamente!`,
          'success'
        )
      }
    })




  }




  // PARA NUEVOS FILTROS JQX
  iconRenderer = (
    row: any,
    datafield: any,
    value: any,
    defaultcellsrenderer: any,
    columnProperties: any,
    rowData: any
  ): string => {

    //console.log("El row data : "+rowData );
    const valor = rowData.testsensor;
    let imgUrl = 'assets/opciones.svg';




    const img = '<div style="padding-top:5px;  text-align: center;"   title="Acciones del expediente"  mat-button [matMenuTriggerFor]="menu" ><img  width="20" height="20" src="' + imgUrl + '"></div>';
    return img;
  };


  public cellclick = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-family: Verdana;"  type="button" title="Modificar Tarea"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';
  }

  public columnrenderer = function (value) {

    if (value == "Interesado") {
      return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + '<img  src="assets/asignar.svg" width="25" height="25"/>' + value + '</div>';

    } else {
      return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
    }

  }


  public columnrendererSoliciPendi = function (value, row, column) {



    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';

  }







  // Renderer de radio button para selección de solicitudes usando GridRadioSelector
  public columnseleccion = GridRadioSelector.createRadioRenderer('Solicitudes', 'Selecciona Solicitud');

  public cellsrenderer = function (row, column, value) {
    // Determinar la alineación basada en el datafield de la columna
    let alignment = 'left'; // por defecto
    let padding = 'padding-left: 8px;';
    
    if (column.datafield === 'estado' || column.datafield === 'usuario' || column.datafield === 'ejeNumRegis') {
      alignment = 'center';
      padding = ''; // No aplicar padding izquierdo para columnas centradas
    }
    
    return '<div style="text-align: ' + alignment + '; margin-top: 5px; ' + padding + ' line-height: 1.2;">' + value + '</div>';
  }

  public cellsrendererRepre = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;"  >' + value + '</div>';
  }

  public cellsrendererinteresado = function (row, column, value) {
    return '<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">' + value.desPerEntid + '</div>';
  }

  public cellsrendererSolicitudes = function (row, column, value) {
    // Para la columna "Asunto" debe estar alineada a la izquierda
    return '<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">' + value + '</div>';
  }

  public cellsrendererSolicitudesPendi = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }
  public ejercicioSolicitud!: string;

  public cellsrendererEjercicio = function (row, column, value2) {
    this.ejercicioSolicitud = value2;
    return '<div style="text-align: center; margin-top: 5px;">' + value2 + '</div>';
  }

  public cellsrendererNumero = function (row, column, value, columnfield) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }

  public valorEstadoExpedi?: any;
  public cellsrendererAnidado = function (row, column, value, columnfield) {
    this.valorEstadoExpedi = value.id;

    if (!value.ejercicio || !value.numero) {

      return '<div style="text-align: center; margin-top: 5px;">' + '</div>';

    } else {
      return '<div style="text-align: center; margin-top: 5px;">' + value.ejercicio + '/' + value.numero + '</div>';
    }


  };
  public cellsrendererAnidadoEstado = function (row, column, value, columnfield) {



    return '<div style="text-align: center; margin-top: 5px;">' + value.estado + '</div>';
  }
  public cellsrendererFechaSolici = function (row, column, value) {
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);

    if (!value) {
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">-</div>`;
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + dia + "/" + mes + "/" + anio + '</div>';
    }
  }





  columnsSolici: any[] = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'dirRepre', datafield: 'dirRepre', width: '1%', hidden: true, align: 'center' },
    { text: 'idExpediente', datafield: 'idExpediente', width: '1%', hidden: true, align: 'center' },
    { text: 'Interesado', datafield: 'numDocum', width: '10%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, hidden: true, align: 'center' },
    { text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer },
    { text: 'Ejercicio', datafield: 'ejercicio', width: '6%', cellsrenderer: this.cellsrendererEjercicio, renderer: this.columnrenderer },
    { text: 'Numero', datafield: 'numero', width: '6%', cellsrenderer: this.cellsrendererNumero, renderer: this.columnrenderer },
    { text: 'Fecha Solicitud', datafield: 'fecInicio', width: '12%', cellsrenderer: this.cellsrendererFechaSolici, renderer: this.columnrenderer },
    { text: 'Asunto', datafield: 'asunto', width: '18%', cellsrenderer: this.cellsrendererSolicitudes, renderer: this.columnrenderer, align: 'left' },
    { text: 'Estado', datafield: 'estado', width: '9%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, align: 'center' },
    { text: 'Asignado a', datafield: 'usuario', width: '10%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, align: 'center' },
    { text: 'Interesado', datafield: 'personaEntidad', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer },
    { text: 'Número Registro', datafield: 'ejeNumRegis', width: '9%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, align: 'center' },
    { text: 'Expediente', datafield: 'expediente', width: '8%', cellsrenderer: this.cellsrendererAnidado, renderer: this.columnrenderer },
    { text: 'Representante', datafield: 'nomRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'idRepre', datafield: 'idRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'idHisRepre', datafield: 'idHisRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'idHisDocum', datafield: 'idHisDocum', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'iddocum', datafield: 'idDocum', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },


  ];

  public localizationObject: any = jqxGrid_ES;

  sourceSolici = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'fecInicio', type: 'any' },
      { name: 'asunto', type: 'any' },
      { name: 'numDocum', type: 'any' },
      { name: 'estado', type: 'any' },
      { name: 'usuario', type: 'any' },
      { name: 'expediente', type: 'any' },
      { name: 'personaEntidad', type: 'any' },
      { name: 'ejeNumRegis', type: 'any' },
      { name: 'numero', type: 'any' },
      { name: 'ejercicio', type: 'any' },
      { name: 'idExpediente', type: 'any' },
      { name: 'nomRepre', type: 'any' },
      { name: 'idRepre', type: 'any' },
      { name: 'idHisRepre', type: 'any' },
      { name: 'dirRepre', type: 'any' },
      { name: 'idHisDocum', type: 'any' },
      { name: 'idDocum', type: 'any' }
    ],
    url: `${environment.apiUrl}solicitud/listar/${this.idOrgEleme}`,
    sortcolumn: 'fecInicio',
    sortdirection: 'desc',
  }
  );





  public valorEspecifico: string = "PENDIENTE";


  columnsSoliciPendi: any[] = [
    { text: 'id',               datafield: 'id', width: '1%', hidden: true },
    { text: 'dirRepre',         datafield: 'dirRepre', width: '1%', hidden: true },
    { text: 'idExpediente',     datafield: 'idExpediente', width: '1%', hidden: true },
    { text: 'Interesado',       datafield: 'numDocum', width: '10%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, hidden: true },
    { text: '',                 datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer },
    { text: 'Ejercicio',        datafield: 'ejercicio', width: '6%', cellsrenderer: this.cellsrendererEjercicio, renderer: this.columnrenderer },
    { text: 'Numero',           datafield: 'numero', width: '6%', cellsrenderer: this.cellsrendererNumero, renderer: this.columnrenderer },
    { text: 'Fecha Solicitud',  datafield: 'fecInicio', width: '12%', cellsrenderer: this.cellsrendererFechaSolici, renderer: this.columnrenderer },
    { text: 'Asunto',           datafield: 'asunto', width: '18%', cellsrenderer: this.cellsrendererSolicitudes, renderer: this.columnrenderer, align: 'left' },
    { text: 'Estado',           datafield: 'estado', width: '9%', cellsrenderer: this.cellsrendererSolicitudesPendi, renderer: this.columnrendererSoliciPendi, align: 'center' },
    { text: 'Asignado a',       datafield: 'usuario', width: '10%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, align: 'center' },
    { text: 'Interesado',       datafield: 'personaEntidad', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer },
    { text: 'Número Registro',  datafield: 'ejeNumRegis', width: '9%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer, align: 'center' },
    { text: 'Expediente',       datafield: 'expediente', width: '8%', cellsrenderer: this.cellsrendererAnidado, renderer: this.columnrenderer },
    { text: 'Representante',    datafield: 'nomRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'idRepre',          datafield: 'idRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
    { text: 'idHisRepre',       datafield: 'idHisRepre', width: '20%', cellsrenderer: this.cellsrendererinteresado, renderer: this.columnrenderer, hidden: true },
  ];


  rendergridrows = (params: any): any => {
    console.log("datos " + params.defaultRender(params))
    return params.defaultRender(params);
  };

  sourceSPENDI: SolicitudListar[] = [

  ];
  sourceSolpen: any = {
    localdata: this.solicitudlistar,
    dataType: 'json',

    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'fecInicio', type: 'any' },
      { name: 'asunto', type: 'any' },
      { name: 'numDocum', type: 'any' },
      { name: 'estado', type: 'any' },
      { name: 'usuario', type: 'any' },
      { name: 'expediente', type: 'any' },
      { name: 'personaEntidad', type: 'any' },
      { name: 'ejeNumRegis', type: 'any' },
      { name: 'numero', type: 'any' },
      { name: 'ejercicio', type: 'any' },
      { name: 'idExpediente', type: 'any' },
      { name: 'nomRepre', type: 'any' },
      { name: 'idRepre', type: 'any' },
      { name: 'idHisRepre', type: 'any' },
      { name: 'dirRepre', type: 'any' }

    ],
    id: 'id',
  };

  sourceSoliciPendientes: any = new jqx.dataAdapter(this.sourceSPENDI);
  public verLisDoc: boolean = false;


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

  public cellsrendererListDoc = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }
  public cellsrendererDescargaDoc = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }

  // Renderer de radio button para selección de documentos usando GridRadioSelector
  public columnseleccionDoc = GridRadioSelector.createRadioRenderer('Documentos', 'Selecciona Documento');

  public cellsrendererListDocFecha = function (row, column, value) {
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "/" + mes + "/" + anio;

    return '<div style="text-align: center; margin-top: 5px;">' + fechaordenada + '</div>';
  }



  columnsListDoc: any[] = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'Archivo', datafield: 'archivo', width: '1%', hidden: true },
    { text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccionDoc, renderer: this.columnrenderer },
    { text: 'Descripción', datafield: 'descripcion', cellsrenderer: this.cellsrendererListDoc, renderer: this.columnrenderer },
    { text: 'Fecha Documento', datafield: 'fechaSubida', cellsrenderer: this.cellsrendererListDocFecha, renderer: this.columnrenderer },
    { text: 'Nombre Archivo', datafield: 'nombreArchivo', cellsrenderer: this.cellsrendererDescargaDoc, renderer: this.columnrenderer }
  ];


  sourceListDoc = new jqx.dataAdapter({
    dataType: 'json',

    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'archivo', type: 'any' },
      { name: 'descripcion', type: 'any' },
      { name: 'nombreArchivo', type: 'any' },
      { name: 'fechaSubida', type: 'any' },
    ],

    url: `${environment.apiUrl}documentoSolicitud/verDocProc/${this.idsolicitud}`,
    id: 'id',
  }

  );


  columnsListExpe: any[] = [
    //{ text: 'id', datafield: 'id', width: '1%', hidden: true },  
    { text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer, hidden: true },
    { text: 'Ejercicio', datafield: 'ejercicio', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Nùmero', width: '8%', datafield: 'id', cellsrenderer: this.cellsrendererEjercicio, renderer: this.columnrenderer },
    { text: 'Instructor ', datafield: 'instructor', cellsrenderer: this.cellsrendererNumero, renderer: this.columnrenderer },
    { text: 'Título', datafield: 'titulo', width: '30%', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Fecha Inicio', datafield: 'fecInicio', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Estado', datafield: 'estado', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },

  ];


  sourceListExpe = new jqx.dataAdapter({
    dataType: 'json',

    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'ejercicio', type: 'any' },
      { name: 'solicitud', type: 'any' },
      { name: 'instructor', type: 'any' },
      { name: 'titulo', type: 'any' },
      { name: 'fecInicio', type: 'any' },
      { name: 'estado', type: 'any' }



    ],

    url: `${environment.apiUrl}expediente/ver/${this.idexpedienteAsoc}`,
    id: 'id',
  }



  );

  columnsListRepre: any[] = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true },
    { text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true },
    { text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer },
    { text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: this.cellsrendererRepre, renderer: this.columnrenderer },
    { text: 'Dirección', datafield: 'dirPosta', cellsrenderer: this.cellsrendererRepre, renderer: this.columnrenderer },
  ];

  sourceListRepre = new jqx.dataAdapter({
    dataType: 'json',

    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'idPerso', type: 'any' },
      { name: 'idHisPerso', type: 'any' },
      { name: 'desPerEntid', type: 'any' },
      { name: 'dirPosta', type: 'any' },




    ],

    url: `${environment.apiUrl}personaRepresentante/listar/${this.creasolicitud.idPerso}/${this.creasolicitud.idHisPerso}`,
    id: 'id',
  }

  );

  public actualizoSourceRepre(idperso: any, idhisperso: any) {

    this.sourceListRepre = {}
    this.sourceListRepre = ({
      dataType: 'json',

      dataFields: [
        { name: 'id', type: 'any' },
        { name: 'idPerso', type: 'any' },
        { name: 'idHisPerso', type: 'any' },
        { name: 'desPerEntid', type: 'any' },
        { name: 'dirPosta', type: 'any' },
      ],

      url: `${environment.apiUrl}personaRepresentante/listar/${idperso}/${idhisperso}`,
      id: 'id',
    }
    );
  }

  public vacio(event) {
    console.log(`${environment.apiUrl}solicitud/listar/${this.idOrgEleme}`);
  }


}


