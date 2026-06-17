import {Usuario} from '../login/usuario';
import {SolicitudesService} from '../solicitudes/solicitudes.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router'
import {HttpClient} from '@angular/common/http';
import {ExpedientesService} from '../expedientes/expedientes.service';
import {
  TareaTramiteExpporExpedi,
  VerExpedientesInstructor,
  VerTareaTramiteExpporUsuario
} from '../expedientes/expedientes';
import {environment} from 'src/environments/environment';
import {jqxGrid_ES} from 'src/translations/jqxGrid_translate';
import html2canvas from 'html2canvas';
import jsPDF, * as jspdf from 'jspdf';
import {SolicitudListar} from '../solicitudes/solicitudes';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import { GridRadioSelector } from '../core/helper/grid-radio-selector';
import { TablaClickHandler } from '../core/helper/tabla-click-handler';
import { NotificationService } from '../core/service/notification.service';
import { ModalManagerService } from '../core/service/modal-manager.service';


export class FiltroUser {
  id!: number;
  ejercicio!: number;
  estado!: string;
  fase!: string;
  fecArchivo!: any;
  fecCancelacion!: any
  fecFin!: any;
  fecInicio!: string;
  formaApertura!: string
  numero!: number;
  titulo!: string;
  departamento!: string;
  instructor!: string;
  solicitud!: string;
  usuContr!: string;
  fecContr!: any;
  procedimiento: any = [{
    id: "",
    descripcion: "",
    departamento: {
      idOrgEleme: "",
      idOrgan: "",
      cadEleme: "",
      desEleme: "",
      accesible: "",
      organo: "",
      usuContr: "",
      idOrgElePadre: "",
      fecContr: ""
    },
    codigoSia: "",
    usuContr: "",
    fecContr: ""

  }]

}


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  @ViewChild('grid', {static: false}) grid: jqxGridComponent;
  @ViewChild('gridSolicitudes', {static: false}) gridSolicitudes: jqxGridComponent;
  @ViewChild('gridExpedientes', {static: false}) gridExpedientes: jqxGridComponent;
  @ViewChild('gridTareas', {static: false}) gridTareas: jqxGridComponent;
  @ViewChild('gridFirmasPendientes', {static: false}) gridFirmasPendientes: jqxGridComponent;
  @ViewChild('gridFirmasTerceros', {static: false}) gridFirmasTerceros: jqxGridComponent;
  @ViewChild('gridNotificaciones', {static: false}) gridNotificaciones: jqxGridComponent;
  @ViewChild('content', {static: false}) content: ElementRef;
  @ViewChild('contentExp', {static: false}) contentExp: ElementRef;


  public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  public fil: boolean = false;
  public accionesExpedi: boolean = false;
  public idexpediente!: number;
  public idtramite!: number;
  public idtarea!: number;
  public descargafichero!: any;
  public numeroArchivo!: number;
  public statusGetExpedientes!: number;
  public solicitudlistar!: SolicitudListar[];
  public verexpedientesinstructor!: VerExpedientesInstructor[];
  public vertareatramiteexpporusuario!: VerTareaTramiteExpporUsuario[];
  public tareatamiteexpporexpedi!: TareaTramiteExpporExpedi[];

  // Estados de carga para cada sección
  public isLoadingSolicitudes: boolean = false;
  public isLoadingExpedientes: boolean = false;
  public isLoadingTareas: boolean = false;
  public isLoadingFirmasPendientes: boolean = false;
  public isLoadingFirmasTerceros: boolean = false;
  public isLoadingNotificaciones: boolean = false;

  public editExpedientes: boolean = false;
  public filtrouser: FiltroUser = new FiltroUser;

  public lafecha = new Date().toLocaleString();


  // Datos para la paginación
  public page!: number;
  public npagina: number = 4;
// filtros Pipe
  public filtrotramitador: any = this.idOrgElemen; // pipe/filtramitador


  public user: any = sessionStorage.getItem('user');// lo usamos para filtrar contenidos sin login
  public soluser = sessionStorage.getItem('SolUsuari');// lo usamos para filtrar contenidos 1 ok 0 no
  public trauser = sessionStorage.getItem('TraUsuari');// lo usamos para filtrar contenidos 1 ok 0 no

  usuario = new Usuario;
  selected = new Date();
  public cambiofecha!: string;
  usuarioLogin: string = this.usuario.usuario;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  get paginatedData(): VerExpedientesInstructor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.verexpedientesinstructor.slice(startIndex, startIndex + this.itemsPerPage);
  }

// --------------------------------------

  ngOnInit(): void {
    this.cargoExpedientes();
    this.expedientesService.getExpedientesInstructor().subscribe(
      data => this.verexpedientesinstructor = data,
      error => console.error("Error en getExpedientesInstructor: ", error)
    );
    this.expedientesService.getTareaTramiteExpedientesUsuario().subscribe(
      data => this.vertareatramiteexpporusuario = data,
      error => console.error("Error en getTareaTramiteExpedientesUsuario: ", error)
    );
  }

  public cadenaEstadoSolicitudes: string;

  public cerrartareastramite() {
    this.vertareatramiteexpporusuario = [];

  }

  public estado: string = "ACEPTADA";

  public limpiacadenaEstadoSolicitudes() {
    this.cadenaEstadoSolicitudes = "";


  }

  public generoPDFEXP() {

    const contentExpe = this.contentExp.nativeElement;

    html2canvas(contentExpe).then(canvas => {
      const imgData2 = canvas.toDataURL('./assets/escudo_generico.png');
      const pdf2 = new jspdf.jsPDF();
      const imgProps2 = pdf2.getImageProperties(imgData2);
      const pdfWidth2 = pdf2.internal.pageSize.getWidth();
      const pdfHeight2 = (imgProps2.height * pdfWidth2) / imgProps2.width;

      pdf2.addImage(imgData2, 'PNG', 0, 0, pdfWidth2, pdfHeight2);
      pdf2.save(`expedientesInstructor${this.lafecha}.pdf`);
    });

  }

  public veoexp: boolean = false

  public generaPdfExpeInstructor() {

    const doc = new jsPDF();
    let xx = 20;
    let yy = 10
    let x = 24;
    let y = 20;
    let lineabase = 'LISTADO DE EXPEDIENTE DE LOS QUE SOY INSTRUCTOR'
    doc.setFontSize(12)
    doc.text(lineabase, xx, yy);

    for (let index = 0; index < this.verexpedientesinstructor.length; index++) {
      let ejercicio = this.verexpedientesinstructor[index].ejercicio + "/" + this.verexpedientesinstructor[index].numero;
      let finicio = this.verexpedientesinstructor[index].fecInicio;
      let titulo = this.verexpedientesinstructor[index].titulo;
      let estado = this.verexpedientesinstructor[index].estado;
      let fase = this.verexpedientesinstructor[index].fase;
      let instructor = this.verexpedientesinstructor[index].instructor
      let linea = `EJERCICIO : ${ejercicio} , FECHA INICIO :  ${finicio} ,TITULO :  ${titulo}, ESTADO :  ${estado}, FASE :  ${fase}, USUARIO :  ${instructor}`;
      doc.setFontSize(6)
      doc.text(linea, x, y);
      y += 10; // Incrementa la coordenada Y para la siguiente línea
    }
    // Guarda el PDF con un nombre especificado
    doc.setFontSize(2)
    doc.save(`expedientesInstructor${this.lafecha}.pdf`);
    this.veoexp = true;

    this.veoexp = false;

  }

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

  public valorEstato(value: any): void {
    this.solicitudesServices.getSolicitudesfiltro(value).subscribe(
      data => this.solicitudlistar = data,
      error => console.error("Error en getSolicitudesfiltro: ", error)
    );
    console.log("valor estado solicitud: ", JSON.stringify(value));
    console.log("cadena estado solicitud: ", this.cadenaEstadoSolicitudes);
  }


  constructor(
    public solicitudesServices: SolicitudesService,
    public expedientesService: ExpedientesService,
    public router: Router,
    public http: HttpClient,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService
  ) {

  }

  // ===== GESTIÓN DE MODALES =====
  
  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  // ===== FUNCIONES DE CONSULTA CON ESTADOS DE CARGA =====

  public async consultarSolicitudes(): Promise<void> {
    try {
      this.isLoadingSolicitudes = true;
      await this.cargarSolicitudes();
      this.abrirModal('modalSolicitudesPendientes');
    } catch (error) {
      this.notificationService.error('Error al cargar las solicitudes pendientes');
      console.error('Error loading solicitudes:', error);
    } finally {
      this.isLoadingSolicitudes = false;
    }
  }

  public async consultarExpedientes(): Promise<void> {
    try {
      this.isLoadingExpedientes = true;
      this.ordenarTabla();
      await this.cargarExpedientesInstructor();
      this.abrirModal('modalExpedientesInstructor');
    } catch (error) {
      this.notificationService.error('Error al cargar los expedientes del instructor');
      console.error('Error loading expedientes:', error);
    } finally {
      this.isLoadingExpedientes = false;
    }
  }

  public async consultarTareas(): Promise<void> {
    try {
      this.isLoadingTareas = true;
      await this.cargarTareasUsuario();
      this.abrirModal('modalTareasPendientes');
    } catch (error) {
      this.notificationService.error('Error al cargar las tareas pendientes');
      console.error('Error loading tareas:', error);
    } finally {
      this.isLoadingTareas = false;
    }
  }

  public async consultarFirmasPendientes(): Promise<void> {
    try {
      this.isLoadingFirmasPendientes = true;
      await this.cargaFirmasPendientes();
      this.abrirModal('modalFirmasPendientes');
    } catch (error) {
      this.notificationService.error('Error al cargar las firmas pendientes');
      console.error('Error loading firmas pendientes:', error);
    } finally {
      this.isLoadingFirmasPendientes = false;
    }
  }

  public async consultarFirmasTerceros(): Promise<void> {
    try {
      this.isLoadingFirmasTerceros = true;
      await this.cargaFirmasTerceros();
      this.abrirModal('modalFirmasTerceros');
    } catch (error) {
      this.notificationService.error('Error al cargar las firmas solicitadas a terceros');
      console.error('Error loading firmas terceros:', error);
    } finally {
      this.isLoadingFirmasTerceros = false;
    }
  }

  public async consultarNotificaciones(): Promise<void> {
    try {
      this.isLoadingNotificaciones = true;
      await this.cargaNotificaciones();
      this.abrirModal('modalNotificaciones');
    } catch (error) {
      this.notificationService.error('Error al cargar las notificaciones pendientes');
      console.error('Error loading notificaciones:', error);
    } finally {
      this.isLoadingNotificaciones = false;
    }
  }

// ordena tabla expedientes

  public ordenarTabla() {

    console.log(`URL DE EXPEDIENTES : ${environment.apiUrl}expediente/listarPorInstructor/${this.user!}`)
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tablaExpedi");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = parseInt(rows[i].getElementsByTagName("td")[1].innerHTML);
        y = parseInt(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


  public modificaformatofecha(valor: string): string {
    if (!valor) return "";
    const anio = valor.substring(0, 4);
    const mes = valor.substring(5, 7);
    const dia = valor.substring(8, 10);
    return `${dia}/${mes}/${anio}`;
  }


  public sourceSolici: any = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'id', type: 'any'},
      {name: 'fecInicio', type: 'any'},
      {name: 'asunto', type: 'any'},
      {name: 'numDocum', type: 'any'},
      {name: 'estado', type: 'any'},
      {name: 'usuario', type: 'any'},
      {name: 'expediente', type: 'any'},
      {name: 'personaEntidad', type: 'any'},
      {name: 'ejeNumRegis', type: 'any'},
      {name: 'numero', type: 'any'},
      {name: 'ejercicio', type: 'any'},
      {name: 'idExpediente', type: 'any'},
      {name: 'nomRepre', type: 'any'},
      {name: 'idRepre', type: 'any'},
      {name: 'idHisRepre', type: 'any'},
      {name: 'dirRepre', type: 'any'},
      {
        name: 'ejercicioNumero',
        type: 'string',
        map: (data: any) => data.ejercicio + '/' + data.numero,
      },
      {
        name: 'desPerEntid',
        type: 'string',
        map: (data: any) => data.personaEntidad ? data.personaEntidad.desPerEntid : '',
      },
    ],
    localdata: [],
    url: `${environment.apiUrl}tareaTramiteExpediente/listarSolicitudesPendientesPorUsuario/${this.user}`
  });

  public cargarSolicitudes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.solicitudesServices.getSolicitudes().subscribe(
        data => {
          this.solicitudlistar = data;
          this.sourceSolici.localdata = data;
          if (this.gridSolicitudes) {
            this.gridSolicitudes.source(new jqx.dataAdapter(this.sourceSolici));
            this.gridSolicitudes.updatebounddata();
          }
          resolve();
        },
        error => {
          console.error("Error al obtener las solicitudes: ", error);
          reject(error);
        }
      );
    });
  }

  public cargarExpedientesInstructor(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.expedientesService.getExpedientesInstructor().subscribe(
        data => {
          this.verexpedientesinstructor = data;
          this.sourceExpedientesInstructor.localdata = data;
          if (this.gridExpedientes) {
            this.gridExpedientes.source(new jqx.dataAdapter(this.sourceExpedientesInstructor));
            this.gridExpedientes.updatebounddata();
          }
          resolve();
        },
        error => {
          console.error("Error al obtener los expedientes del instructor: ", error);
          reject(error);
        }
      );
    });
  }

  public cargarTareasUsuario(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.expedientesService.getTareaTramiteExpedientesUsuario().subscribe(
        data => {
          this.vertareatramiteexpporusuario = data;
          this.sourceTareasTramiteUsuarios.localdata = data;
          if (this.gridTareas) {
            this.gridTareas.source(new jqx.dataAdapter(this.sourceTareasTramiteUsuarios));
            this.gridTareas.updatebounddata();
          }
          resolve();
        },
        error => {
          console.error("Error al obtener las tareas del usuario: ", error);
          reject(error);
        }
      );
    });
  }


  public columnsSolici = [
    {text: 'Ejercicio/Número', datafield: 'ejercicioNumero', width: 140, align: 'center', cellsalign: 'center'},
    {text: 'Fecha Solicitud', datafield: 'fecInicio', width: 120, align: 'center', cellsalign: 'center'},
    {text: 'Asunto', datafield: 'asunto', width: 280, align: 'center', cellsalign: 'center'},
    {text: 'Estado', datafield: 'estado', width: 100, align: 'center', cellsalign: 'center'},
    {text: 'Asignado a', datafield: 'usuario', width: 150, align: 'center', cellsalign: 'center'},
    {text: 'Interesado', datafield: 'desPerEntid', width: 280, align: 'center', cellsalign: 'center'},
    {text: 'N. Registro', datafield: 'ejeNumRegis', width: 100, align: 'center', cellsalign: 'center'}
  ];


  public modificaformatoEstado(valor: string): string {
    switch (valor) {
      case "VERDE":
        return '<img src="../assets/boton_verde.png" width="20" height="20"/>';
      case "AMARILLO":
        return '<img src="../assets/boton_amarillo.png" width="20" height="20"/>';
      default:
        return "";
    }
  }

  public lanzaGetTareaTramiteEXp(id: any): void {
    this.expedientesService.getTareaTramiteExpeporExpe(id).subscribe(
      data => {
        this.tareatamiteexpporexpedi = data;
        console.log(`DIRECCION: ${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${id}`);
      },
      error => console.error("Error en getTareaTramiteExpeporExpe: ", error)
    );
  }


  numeroExpe: string;
  tituloExpe: string;
  idexpedi?: string;
  public delvalue?: any;

  public clickExpediente(event: any): void {
    const rowData = event.args.row.bounddata;
    this.lanzaGetTareaTramiteEXp(rowData.id);
    this.numeroExpe = `${rowData.ejercicio}/${rowData.numero}`;
    this.tituloExpe = rowData.titulo;
    // Se asigna el id del expediente para otras operaciones
    this.idexpedi = rowData.id;
    console.log("Numero EXPEDIENTE:", this.numeroExpe);
    console.log("ID EXPEDIENTE:", rowData.id);

    this.sourceTareasExpediente = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'numero', type: 'number'},
        {name: 'descripcion', type: 'string'},
        {name: 'fecInicio', type: 'string'},
        {name: "fecFin", type: 'string'},
        {name: "propuestaResolucion", type: 'string'},
        {name: "usuario", type: 'string'},
        {name: "firmado", type: 'string'},
        {name: "fecPlazo", type: 'string'},
        {name: "color", type: 'string'},
        {name: "archivo", type: 'string'},
        {name: 'tareaProcedimiento', type: 'any'},
        {name: 'id', type: 'any'},
        {name: 'tipAnexo', type: 'any'},
        {name: 'docAport', type: 'any'},
        {name: 'tipDocEni', type: 'any'},
        {name: 'documentacion', type: 'any'},
        {name: 'visible', type: 'any'},
        {name: 'numRegis', type: 'any'},
        {name: 'idHisDocum', type: 'any'},
        {name: 'ejeNumNotif', type: 'any'},
        {name: 'nombreArchivo', type: 'any'},
        {name: 'idAnunc', type: 'any'},
        {name: 'desTramite', type: 'any'},
      ],
      url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${rowData.id}`,
      id: 'id'
    });
  }

  public ocultarFilasPorValorEspecifico(valorEspecifico: number): void {
    this.grid.showrowdetails(0);
    const rows = this.grid.getrows();
    rows.forEach((row: any, index: number) => {
      if (row.valor === "") {
        this.grid.hiderowdetails(index);
      }
    });
  }


  public cargoExpedientes(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`URL CARGA EXPEDIENTES: ${environment.apiUrl}tareaTramiteExpediente/porInstructor/${this.user}`);
      
      // Usar HTTP client para obtener los datos
      this.http.get<any[]>(`${environment.apiUrl}tareaTramiteExpediente/porInstructor/${this.user}`).subscribe(
        data => {
          this.sourceTareasExpediente = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              {name: 'numero', type: 'number'},
              {name: 'descripcion', type: 'string'},
              {name: 'fecInicio', type: 'string'},
              {name: "fecFin", type: 'string'},
              {name: "propuestaResolucion", type: 'string'},
              {name: "usuario", type: 'string'},
              {name: "firmado", type: 'string'},
              {name: "fecPlazo", type: 'string'},
              {name: "color", type: 'string'},
              {name: "archivo", type: 'string'},
              {name: 'tareaProcedimiento', type: 'any'},
              {name: 'id', type: 'any'},
              {name: 'tipAnexo', type: 'any'},
              {name: 'docAport', type: 'any'},
              {name: 'tipDocEni', type: 'any'},
              {name: 'documentacion', type: 'any'},
              {name: 'visible', type: 'any'},
              {name: 'numRegis', type: 'any'},
              {name: 'idHisDocum', type: 'any'},
              {name: 'ejeNumNotif', type: 'any'},
              {name: 'nombreArchivo', type: 'any'},
              {name: 'idAnunc', type: 'any'},
              {name: 'desTramite', type: 'any'},
              {name: 'ejeExped', type: 'any'},
              {name: 'numExped', type: 'any'},
              {name: 'titulo', type: 'any'},
            ],
            localdata: data,
            id: 'id'
          });
          resolve();
        },
        error => {
          console.error("Error al obtener los expedientes: ", error);
          reject(error);
        }
      );
    });
  }


  public clicktareExpediente(event: any): void {
    this.numeroArchivo = event.args.row.bounddata.archivo;
    console.log("tiene documento?", this.numeroArchivo);
  }

  // Método para abrir modal de edición de tarea trámite con doble click
  public abrirModalEditarTareaTramite(event: any) {
    const rowData = event.args.row.bounddata;
    
    // Cargar datos de la tarea trámite
    this.numeroArchivo = rowData.archivo;
    
    // Abrir el modal de edición
    const modal = document.getElementById('EditarTareaTramiteModal');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }


  public localizationObject: any = jqxGrid_ES;
  public columnseleccionTareaTramite = function (value) {
    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea del Expediente"  ><input type="radio"  value="" name="RadioIdb" id="RadioIdb">   </div>';
  }

  public columnseleccionExpInstructor = function (value) {
    return ' <div style="padding-top:5px;  text-align: center;"  type="button"  data-bs-target="#modalExpe2" data-bs-toggle="modal" ><input type="radio"  value="" name="RadioIdb" id="RadioIdb">   </div>';
  }


  public columnrenderer = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }


  public columnrendererdeFecha = function (value) {
    if (value) {
      this.delvalue = value;
      return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + '</div>';
    } else {
      return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
    }
  }


  public cellsrendererTareaExpedi = function (row, column, value) {

    if (this.valorEstado == "CERRADO" || this.valorEstado == "CANCELADO") {
      return `<div style="text-align: center;color:red; margin-top: 5px;"  type="button"  >` + value + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
    }
  }


  public cellsrenderer = function (row, column, value) {
    if (this.valorEstado == "CERRADO" || this.valorEstado == "CANCELADO") {
      return `<div style="text-align: center; color:red; margin-top: 5px;">` + value + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
    }
  }


  public cellsrendererExpInstructor = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }

  public cellsrendererNotificacion = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
  }

  public cellsrendererFecha = function (row, column, value) {
    let recorteFecha: string = value.substr(0, 10);
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "/" + mes + "/" + anio;

    let recorteHora: string = value.substring(12, 14);
    let reverse: string = (recorteFecha)

    if (!value) {
      recorteFecha = ""
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;"  type="button"  >` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;"  type="button" >` + dia + "/" + mes + "/" + anio + '</div>';
    }
  }


  public cellsrendererFechaPlazo = function (row, column, value) {
    if (!value) {
      return `<div style="text-align: center;margin-top: 5px;"  type="button"  >` + 'SIN FECHA' + '</div>';
    } else {
      return `<div style="text-align: center;margin-top: 5px;"  type="button" >` + value + '</div>';
    }
  }


  public cellsrendererColor = function (row, column, value) {
    if (value == "VERDE") {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';
    }
    if (value == "AMARILLO") {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_amarillo.png" width="20" height="20"/>' + '</div>';
    }
    if (value == "ROJO") {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }
    if (!value) {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + 'SIN DATOS' + '</div>';
    } else {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + '</div>';
    }
  }


  public columnrendererDescarga = function (value) {
    return '<div (click)="abreArchivo()" style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }


  public cellsrendererContieneArchivo = function (row, column, value) {
    if (value) {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    } else {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }

  }

  public cellsrendererTramiteTarea = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }

  public cellsrendererArchivo = function (row, column, value) {
    if (value == "1") {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';
    } else {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }

  }


  public cellsrendererPlazo = function (row, column, value) {

    console.log("Fecha inicio: " + this.FecIniTarea);
    console.log("Fecha Fin: " + this.FecIniTarea)
    var dato1: string = this.FecIniTarea;
    return `<div style="text-align: center; margin-top: 5px;"  type="button"  data-bs-toggle="modal" data-bs-target="#editarTramiteModal" data-bs-whatever="@mdo" >` + value + '</div>';
  }


  columnsTareasExpediente = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true},
    {
      text: '',
      width: '3%',
      datafield: '',
      cellsrenderer: this.columnseleccionTareaTramite,
      renderer: this.columnrenderer
    },
    {
      text: 'Ejecicio Exp',
      width: '8%',
      datafield: 'ejeExped',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Número Exp',
      width: '8%',
      datafield: 'numExped',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Título Exp',
      width: '15%',
      datafield: 'titulo',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Número Tarea',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Tarea',
      width: '15%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Trámite',
      width: '15%',
      datafield: 'desTramite',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Tarea',
      width: '8%',
      datafield: 'fecInicio',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Finalización',
      width: '10%',
      datafield: 'fecFin',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Plazo',
      width: '8%',
      datafield: 'fecPlazo',
      cellsrenderer: this.cellsrendererFechaPlazo,
      renderer: this.columnrenderer
    },
    {
      text: 'Estado',
      width: '5%',
      datafield: 'color',
      cellsrenderer: this.cellsrendererColor,
      renderer: this.columnrendererDescarga
    },
    {
      text: 'Archivo',
      width: '5%',
      datafield: 'archivo',
      cellsrenderer: this.cellsrendererContieneArchivo,
      renderer: this.columnrenderer
    },
    {
      text: 'Nombre archivo',
      width: '10%',
      datafield: 'nombreArchivo',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Firmado',
      width: '5%',
      datafield: 'firmado',
      cellsrenderer: this.cellsrendererArchivo,
      renderer: this.columnrendererDescarga
    },
    {
      text: 'Propuesta',
      width: '5%',
      datafield: 'propuestaResolucion',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Salida',
      width: '8%',
      datafield: 'numRegis',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Notificación',
      width: '8%',
      datafield: 'ejeNumNotif',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Tablón',
      width: '5%',
      datafield: 'idAnunc',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Usuario',
      width: '5%',
      datafield: 'usuario',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'tipAnexo',
      datafield: 'tipAnexo',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'docAport',
      datafield: 'docAport',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'tipDocEni',
      datafield: 'tipDocEni',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'documentacion',
      datafield: 'documentacion',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'visible',
      datafield: 'visible',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'idHisDocum',
      datafield: 'idHisDocum',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
  ];


  sourceTareasExpediente = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'numero', type: 'number'},
      {name: 'descripcion', type: 'string'},
      {name: 'fecInicio', type: 'string'},
      {name: "fecFin", type: 'string'},
      {name: "propuestaResolucion", type: 'string'},
      {name: "usuario", type: 'string'},
      {name: "firmado", type: 'string'},
      {name: "fecPlazo", type: 'string'},
      {name: "color", type: 'string'},
      {name: "archivo", type: 'string'},
      {name: 'tareaProcedimiento', type: 'any'},
      {name: 'id', type: 'any'},
      {name: 'tipAnexo', type: 'any'},
      {name: 'docAport', type: 'any'},
      {name: 'tipDocEni', type: 'any'},
      {name: 'documentacion', type: 'any'},
      {name: 'visible', type: 'any'},
      {name: 'visible', type: 'any'},
      {name: 'numRegis', type: 'any'},
      {name: 'idHisDocum', type: 'any'},
      {name: 'ejeNumNotif', type: 'any'},
      {name: 'nombreArchivo', type: 'any'},
      {name: 'idAnunc', type: 'any'},
      {name: 'desTramite', type: 'any'},
      {name: 'ejeExped', type: 'any'},
      {name: 'numExped', type: 'any'},
      {name: 'titulo', type: 'any'},
    ],
    url: `${environment.apiUrl}tareaTramiteExpediente/porInstructor/${this.user!}`,
    id: 'id',
  });

  columnsExpedientesInstructor = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {
      text: '',
      width: '5%',
      datafield: '',
      cellsrenderer: this.columnseleccionExpInstructor,
      renderer: this.columnrenderer
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejercicio',
      cellsrenderer: this.cellsrendererExpInstructor,
      renderer: this.columnrenderer
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererExpInstructor,
      renderer: this.columnrenderer
    },
    {
      text: 'Título',
      datafield: 'titulo',
      cellsrenderer: this.cellsrendererExpInstructor,
      renderer: this.columnrenderer
    },
    {
      text: 'Estado',
      width: '15%',
      datafield: 'estado',
      cellsrenderer: this.cellsrendererExpInstructor,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Inicio',
      datafield: 'fecInicio',
      cellsrenderer: this.cellsrendererExpInstructor,
      renderer: this.columnrenderer,
      hidden: true
    },
  ];


  public sourceExpedientesInstructor = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'numero', type: 'number'},
      {name: 'ejercicio', type: 'number'},
      {name: 'titulo', type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'estado', type: 'string'},
      {name: 'fecInicio', type: 'string'},
    ],
    url: `${environment.apiUrl}expediente/listarPorInstructor/${this.user!}`,
  });


  columnsTareasTramiteUsuarios = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true},
    {text: '', datafield: '', cellsrenderer: this.columnseleccionTareaTramite, renderer: this.columnrenderer},
    {
      text: 'Ejerc. Exp.',
      width: '10%',
      datafield: 'ejeExped',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Número Exp.',
      width: '10%',
      datafield: 'numExped',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Nº Tarea',
      width: '10%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Tarea',
      width: '25%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Trámite',
      width: '25%',
      datafield: 'desTramite',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Tarea',
      width: '10%',
      datafield: 'fecInicio',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Finalización',
      width: '15%',
      datafield: 'fecFin',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Plazo',
      width: '10%',
      datafield: 'fecPlazo',
      cellsrenderer: this.cellsrendererFechaPlazo,
      renderer: this.columnrenderer
    },
    {
      text: 'Estado',
      width: '10%',
      datafield: 'color',
      cellsrenderer: this.cellsrendererColor,
      renderer: this.columnrendererDescarga
    },
    {
      text: 'Archivo',
      width: '10%',
      datafield: 'archivo',
      cellsrenderer: this.cellsrendererContieneArchivo,
      renderer: this.columnrenderer
    },
    {
      text: 'Nombre archivo',
      width: '35%',
      datafield: 'nombreArchivo',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Firmado',
      width: '8%',
      datafield: 'firmado',
      cellsrenderer: this.cellsrendererArchivo,
      renderer: this.columnrendererDescarga
    },
    {
      text: 'Propuesta',
      width: '8%',
      datafield: 'propuestaResolucion',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Salida',
      width: '8%',
      datafield: 'numRegis',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Notificación',
      width: '8%',
      datafield: 'ejeNumNotif',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Tablón',
      width: '8%',
      datafield: 'idAnunc',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Usuario',
      width: '8%',
      datafield: 'usuario',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'tipAnexo',
      width: '8%',
      datafield: 'tipAnexo',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'docAport',
      width: '8%',
      datafield: 'docAport',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'tipDocEni',
      width: '8%',
      datafield: 'tipDocEni',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'documentacion',
      width: '8%',
      datafield: 'documentacion',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'visible',
      width: '8%',
      datafield: 'visible',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'idHisDocum',
      width: '8%',
      datafield: 'idHisDocum',
      cellsrenderer: this.cellsrendererPlazo,
      renderer: this.columnrenderer,
      hidden: true
    },
  ];


  public sourceTareasTramiteUsuarios = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'numero', type: 'number'},
      {name: 'descripcion', type: 'string'},
      {name: 'fecInicio', type: 'string'},
      {name: "fecFin", type: 'string'},
      {name: "propuestaResolucion", type: 'string'},
      {name: "usuario", type: 'string'},
      {name: "firmado", type: 'string'},
      {name: "fecPlazo", type: 'string'},
      {name: "color", type: 'string'},
      {name: "archivo", type: 'string'},
      {name: "ejeExped", type: 'string'},
      {name: "numExped", type: 'string'},
      {name: 'tareaProcedimiento', type: 'any'},
      {name: 'id', type: 'any'},
      {name: 'tipAnexo', type: 'any'},
      {name: 'docAport', type: 'any'},
      {name: 'tipDocEni', type: 'any'},
      {name: 'documentacion', type: 'any'},
      {name: 'visible', type: 'any'},
      {name: 'visible', type: 'any'},
      {name: 'numRegis', type: 'any'},
      {name: 'idHisDocum', type: 'any'},
      {name: 'ejeNumNotif', type: 'any'},
      {name: 'nombreArchivo', type: 'any'},
      {name: 'idAnunc', type: 'any'},
      {name: 'desTramite', type: 'any'},
    ],
    url: `${environment.apiUrl}tareaTramiteExpediente/listarTareasPendientesPorUsuario/${this.user!}`,
    id: 'id',
  });


  columnsNotificaciones = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {
      text: '',
      width: '5%',
      datafield: '',
      cellsrenderer: this.columnseleccionExpInstructor,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejeExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Nº Tarea',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
  ];


  public sourceNotificaciones = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'ejeExped', type: 'number'},
      {name: 'numExped', type: 'number'},
      {name: 'numero', type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'descripcion', type: 'string'},
    ],
    url: `${environment.apiUrl}tareaTramiteExpediente/listarNotificacionPendiente/${this.user!}`,
  });

  public cargaNotificaciones(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceNotificaciones = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          {name: 'ejeExped', type: 'number'},
          {name: 'numExped', type: 'number'},
          {name: 'numero', type: 'string'},
          {name: 'id', type: 'any'},
          {name: 'descripcion', type: 'string'},
        ],
        url: `${environment.apiUrl}tareaTramiteExpediente/listarNotificacionPendiente/${this.user}`
      });
      
      if (this.gridNotificaciones) {
        this.gridNotificaciones.source(this.sourceNotificaciones);
        this.gridNotificaciones.updatebounddata();
      }
      resolve();
    });
  }


  columnsFirmasTerceros = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {
      text: '',
      width: '5%',
      datafield: '',
      cellsrenderer: this.columnseleccionExpInstructor,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejeExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Nº Tarea',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Archivo',
      datafield: 'nombreArchivo',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Firmante',
      datafield: 'firmante',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
  ];


  sourceFirmasTerceros = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'ejeExped', type: 'number'},
      {name: 'numExped', type: 'number'},
      {name: 'numero', type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'descripcion', type: 'string'},
      {name: 'nombreArchivo', type: 'string'},
      {name: 'firmante', type: 'string'},
    ],
    url: `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendienteTerceros/${this.user!}`,
  });


  public cargaFirmasTerceros(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceFirmasTerceros = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          {name: 'ejeExped', type: 'number'},
          {name: 'numExped', type: 'number'},
          {name: 'numero', type: 'string'},
          {name: 'id', type: 'any'},
          {name: 'descripcion', type: 'string'},
          {name: 'nombreArchivo', type: 'string'},
          {name: 'firmante', type: 'string'},
        ],
        url: `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendienteTerceros/${this.user}`
      });
      
      if (this.gridFirmasTerceros) {
        this.gridFirmasTerceros.source(this.sourceFirmasTerceros);
        this.gridFirmasTerceros.updatebounddata();
      }
      resolve();
    });
  }


  columnsFirmasPendientes = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {
      text: '',
      width: '5%',
      datafield: '',
      cellsrenderer: this.columnseleccionExpInstructor,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejeExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numExped',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Nº Tarea',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Archivo',
      datafield: 'nombreArchivo',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
    {
      text: 'Firmante',
      datafield: 'firmante',
      cellsrenderer: this.cellsrendererNotificacion,
      renderer: this.columnrenderer
    },
  ];


  public sourceFirmasPendientes = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'ejeExped', type: 'number'},
      {name: 'numExped', type: 'number'},
      {name: 'numero', type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'descripcion', type: 'string'},
      {name: 'nombreArchivo', type: 'string'},
      {name: 'firmante', type: 'string'},

    ],

    url: `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendiente/${this.user!}`,
  });


  public cargaFirmasPendientes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceFirmasPendientes = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          {name: 'ejeExped', type: 'number'},
          {name: 'numExped', type: 'number'},
          {name: 'numero', type: 'string'},
          {name: 'id', type: 'any'},
          {name: 'descripcion', type: 'string'},
          {name: 'nombreArchivo', type: 'string'},
          {name: 'firmante', type: 'string'},
        ],
        url: `${environment.apiUrl}tareaTramiteExpediente/listarFirmaPendiente/${this.user}`
      });
      
      if (this.gridFirmasPendientes) {
        this.gridFirmasPendientes.source(this.sourceFirmasPendientes);
        this.gridFirmasPendientes.updatebounddata();
      }
      resolve();
    });
  }
}




