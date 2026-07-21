import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { FormGroup } from '@angular/forms';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { GridRadioSelector } from "../core/helper/grid-radio-selector";
import { TablaClickHandler } from "../core/helper/tabla-click-handler";
import { NotificationService } from "../core/service/notification.service";
import { ModalManagerService } from "../core/service/modal-manager.service";
import { UserSessionService } from "../core/service/user-session.service";
import * as bootstrap from 'bootstrap';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
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
  @ViewChild('gridAtributosExp', { static: false }) gridAtributosExp?: jqxGridComponent;
  @ViewChild('gridTareasExpediente', { static: false }) gridTareasExpediente?: jqxGridComponent;

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

      console.log('Tiene permiso a Expedientes!!');

      this.expedientesService.getExpedientesListar().subscribe(
        expedienteslistar => this.expedienteslistar = expedienteslistar
      );

      // consulta de codigo de respuesta de la consulta
      this.expedientesService.getExpedientesListar().subscribe(
        data => console.log(`Exp Listados: ${data.length}`),
        (error: HttpErrorResponse) => {
          this.statusGetExpedientes = error.status;

          console.error(`Datos del Error de p?gina : ${error.status}`);
        }
      );


      this.expedientesService.getProcedimientos().subscribe(
        procedimientos => this.procedimientos = procedimientos
      );


    } else {
      console.log(' NO tiene permiso a Expedientes!!');
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

  public ArchivaExp() {
    this.notificationService.error({
      title: 'Oops...',
      text: 'Parece que no hay conexi?n con la red SARA'
    })

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
    console.log("INSERTA BOLSA CREAR!!!")
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

  public editExpediente() {

    this.editexpediente.idPerso = this.consultadni.idPerso;
    this.expedientesService.editarExpediente(this.editexpediente, this.idexpediente).subscribe(response => {

      //this.router.navigate(['/expedientes'])
      console.log("EDITANDO");

    });

    setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo


  }

  public AbrirExpediente() {


    //this.editexpediente.procedimiento = this.envioSelect;
    this.editexpediente.estado = "ABIERTO";


    //this.editexpediente.idPerso = this.consultadni.idPerso;
    this.expedientesService.editarExpediente(this.editexpediente, this.idexpediente).subscribe(response => {

      this.notificationService.confirm({
        title: 'Esta seguro?',
        text: "Abrir Expediente",
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.notificationService.success({ title: 'Expediente Abierto' })
          this.sourceExp = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              { name: 'ejercicio', type: 'number' },
              { name: 'numero', type: 'number' },
              { name: "titulo", type: 'string' },
              { name: "formaApertura", type: 'string' },
              { name: "estado", type: 'string' },
              { name: "fecInicio", type: 'string' },
              { name: "fecFin", type: 'string' },
              { name: "fecCancelacion", type: 'string' },
              { name: "procedimiento", type: 'string' },
              { name: "instructor", type: 'string' },
              { name: "personaEntidad", type: 'string' },
              { name: "email", type: 'string' },
              { name: "forNotif", type: 'string' },
              { name: 'id', type: 'any' },
              { name: 'forNotifTexto', type: 'any' },
              { name: 'idHisDocum', type: 'any' },


            ],
            url: `${environment.apiUrl}expediente/listarExpediente/${this.session.user}`,

            // id: 'OrderID',
            // sortname: 'id',
            sortcolumn: 'numero',
            sortdirection: 'desc'

          });
        }
      })


      // this.router.navigate(['/expedientes'])
      console.log("Abriendo");

    });

  }
  getrepresentanteexpediente(idPerso: number, idHisPerso: number): void {
    this.expedienteFacade.getrepresentanteexpediente(this, idPerso, idHisPerso);
  }

  public getExpediente() {

    console.log("SE A ENVIADO LA CONSULTA");
    console.log(`ID DEL EXPEDIENTE DESDE MODAL: ${this.idexpediente}`);

    // let consulta:string =`${environment.apiUrl}expediente/ver/${this.idexpediente}`;
    return this.expedientesService.getExpediente(this.idexpediente).subscribe(
      verexpediente => this.verexpediente = verexpediente
      //return this.http.get(consulta).pipe(map(response => response as VerExpediente));
    )
  }

  public marcaExpediente(id) {
    this.idexpediente = id;
    this.editExpedientes = true;
    this.verExpedientes = true;
    console.log(`IDE EXPEDIENTE : ${this.idexpediente}`);


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


    console.log("valor = " + suma.toString())
  }


  public idExpediente!: any;
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
        <h4><strong> N??MERO:</strong> ${ejercicio}/${numero} </h4>
        <h4> <strong> EXTRACTO:</strong> ${extracto} </h4>
        <h4> <strong> FECHA REGISTRO:</strong> ${fechaordenada}  ${hora}</h4>


        `,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,

    });


  }



  /**
   * Maneja el doble click en la tabla de expedientes
   * Abre el modal de edici?n del expediente
   */
  public onExpedienteDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos completos del expediente
      this.idexpediente = rowData.id;
      this.expedientesService.getExpediente(this.idexpediente).subscribe(
        verexpediente => {
          this.verexpediente = verexpediente;
          // Abrir modal de edici?n despu?s de cargar los datos
          this.abrirModalVerExpediente();
        }
      );
    });
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

    this.expedientesService.getExpediente(this.idexpediente).subscribe({
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
    GridRadioSelector.handleRowClick(event, 'Expedientes', (rowData) => {

      this.idExpediente = rowData.id;
      this.idExpedienteString = rowData.id;
      this.refrescarSourceAtributo();

      if (rowData.idHisDocum) {
        this.expedientesService.getRegistroDocVer(rowData.idHisDocum).subscribe(
          registrodocumento => this.registrodocumento = registrodocumento
        );
        console.log("Tenemos Registro de Documento --------> " + rowData.idHisDocum);
        this.VeoRegDoc = true;
      } else {
        console.log("NO Tenemos Registro de Documento --------> " + rowData.idHisDocum);
        this.VeoRegDoc = false;
      }

      if (rowData.email == '0') {
        this.verexpediente.email = "";
      }

      this.listarAtributos();
      this.veoAtributos = true;
      console.log("consola y sousrce -------->" + this.source)
      this.tituloExp = rowData.titulo!

      console.log("TITULO EXPEDIENTE : " + this.tituloExp);

      this.veoAbrir = true;
      this.puedoEditarExpe = true;

      if (rowData.estado == "CERRADO") {
        console.log("EXPEDIENTE CERRADO!!!!")
        this.lanzoIndiceENI(rowData.id)

        this.sourceIndiceENI = new jqx.dataAdapter({
          dataType: 'json',
          dataFields: [
            { name: 'archivo' },
            { name: 'nombre' },
            { name: "huella" }
          ],
          url: `${environment.apiUrl}archivo/verIndice/${rowData.id}`,
          id: 'id',
        });
      }

      this.valorEstado = rowData.estado
      this.syncGridRenderContext();

      if (rowData.email == "0") {
        this.verEmail = "";
      } else {
        this.verEmail = rowData.email;
      }

      if (rowData.email == "SinDAtos") {
        this.verEmail = "";
      }

      if (rowData.estado == "CERRADO") {
        this.verArchivar = true;
      } else {
        this.verArchivar = false;
      }

      if (rowData.estado == "CERRADO" || rowData.estado == "CANCELADO") {
        this.verAbrirExpediente = true;
        this.cancelarexp = false;
        this.cerrarexp = false;
        this.valorEstado = rowData.estado
        this.syncGridRenderContext();
        this.syncGridRenderContext();
        console.log("ESTADO : " + this.valorEstado);
      } else {
        this.verAbrirExpediente = false;
        this.cancelarexp = true;
        this.cerrarexp = true;
        this.valorEstado = rowData.estado
        this.syncGridRenderContext();
        this.syncGridRenderContext();
      }

      this.expedienteSelecVisible = true;
      this.idProcedimiento = rowData.procedimiento.id
      this.session.setIdProcedimiento(rowData.procedimiento.id);
      this.lanzaTareaProcedi();
      this.descripcionProcedimiento = rowData.procedimiento.descripcion;
      this.expeSelecDescrip = rowData.titulo;
      this.idexpediente = rowData.id;
      this.ejerexpe = rowData.ejercicio;
      this.numExp = rowData.numero;
      this.editExpedientes = true;
      this.verExpedientes = true;
      console.log(`ID EXPEDIENTE NUEVO: ${rowData.id}`);
      console.log(`ID PROCEDIMIENTO: ${this.idProcedimiento}`);

      this.getExpediente()
      this.actualizaSourceTramite();

      //gestion de fecha ordenamos con DD/MM/AAAA
      // inicio
      let recorteFecha: string = rowData.fecInicio.substr(0, 10);
      let anio: string = rowData.fecInicio.substring(0, 4);
      let mes: string = rowData.fecInicio.substring(5, 7);
      let dia: string = rowData.fecInicio.substring(8, 10);
      let fechaordenada: string = dia + "/" + mes + "/" + anio;

      //cierre
      if (rowData.fecFin == undefined) {
        this.fechaCierre = ""
      }
      if (rowData.fecFin) {
        let recorteFechaCierre: string = rowData.fecFin.substr(0, 10);
        let anioCierre: string = rowData.fecFin.substring(0, 4);
        let mesCierre: string = rowData.fecFin.substring(5, 7);
        let diaCierre: string = rowData.fecFin.substring(8, 10);
        let fechaordenadaCierre: string = dia + "/" + mes + "/" + anio;
        this.fechaCierre = fechaordenadaCierre;
      }

      //cancelacion
      if (rowData.fecCancelacion == undefined) {
        this.fechaCancelacion = ""
      }
      if (rowData.fecCancelacion) {
        let recorteFechaCancela: string = rowData.fecCancelacion.substr(0, 10);
        let anioCancela: string = rowData.fecCancelacion.substring(0, 4);
        let mesCancela: string = rowData.fecCancelacion.substring(5, 7);
        let diaCancela: string = rowData.fecCancelacion.substring(8, 10);
        let fechaordenadaCancela: string = dia + "/" + mes + "/" + anio;
        this.fechaCancelacion = fechaordenadaCancela;
      }

      console.log("FECHA ORDENADA : " + fechaordenada);
      this.fechaExpediente = fechaordenada;

      let recorteHora: string = rowData.fecInicio.substring(12, 14);
      let reverse: string = (recorteFecha);
    });
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

    console.log("LIMPIANDO");

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
  // Funciones de validaci?n para Nuevo Expediente
  public isFechaExpedienteInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.fechaInicio);
  }

  public isFormaAperturaInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.forma_apertura);
  }

  public isFormaNotificacionInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.formaNotifi);
  }

  public isEmailExpedienteInvalid(): boolean {
    return this.mostrarValidacionesExpediente && this.nuevoexpediente.formaNotifi == 1 && (!this.nuevoexpediente.email);
  }

  public isTituloExpedienteInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.titulo);
  }

  public isInteresadoDNIInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.usuario);
  }

  public isProcedimientoExpedienteInvalid(): boolean {
    return this.mostrarValidacionesExpediente && (!this.nuevoexpediente.procedimiento);
  }

  public onCrearExpedienteSubmit(): void {
    this.mostrarValidacionesExpediente = true;

    // Validar campos obligatorios
    if (this.isFechaExpedienteInvalid() || this.isFormaAperturaInvalid() ||
      this.isFormaNotificacionInvalid() || this.isTituloExpedienteInvalid() ||
      this.isInteresadoDNIInvalid() || this.isProcedimientoExpedienteInvalid() ||
      this.isEmailExpedienteInvalid()) {

      this.notificationService.incompleteFields();
      return;
    }

    // Confirmar creaci?n del expediente
    this.notificationService.confirm(
      '?Est? seguro de que desea crear el expediente?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarCrearExpediente();
      }
    });
  }

  private ejecutarCrearExpediente(): void {
    this.expedienteFacade.ejecutarCrear(this);
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
  public insideDryRun = environment.inside.dryRun === true;
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

  public handleEnviarInsideDesdeListado(): void {
    this.insideFacade.handleEnviarDesdeListado(this.insideListHost());
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
    this.router.navigate(['/editaexpediente/' + this.idexpediente])
  }

  public reenvioInteresados() {
    this.router.navigate(['/interesado/interesado/' + this.idexpediente])
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

  private syncGridRenderContext(): void {
    this.gridRenderContext.valorEstado = this.valorEstado;
  }

  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSistema() {
    console.log("FEcha Sistema : " + this.fsistema)
    let aniofenvio: string = this.fsistema.substring(6, 10);
    let mesfenvio: string = this.fsistema.substring(3, 5);
    let diafenvio: string = this.fsistema.substring(0, 2);
    //let fechaordenadafenvio:string = diafenvio+"-"+mesfenvio+"-"+aniofenvio;
    let fechaordenadafenvio: any = aniofenvio + "-" + mesfenvio + "-" + diafenvio;
    this.fechaSistema = fechaordenadafenvio;
    this.nuevoexpediente.fechaInicio = fechaordenadafenvio
    // console.log("FEcha a?o : " + aniofenvio)
    //console.log("FEcha mes : " + mesfenvio)
    //console.log("FEcha dia : " + diafenvio)

    console.log("FEcha Sistema : " + this.fechaSistema)


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
    // Usar la nueva l?gica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'TareasExpediente', (rowData) => {
      this.numeroArchivo = rowData.archivo;
      console.log("tiene documento?" + this.numeroArchivo);
    });
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
    // Usar la nueva l?gica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'Permisos', (rowData) => {
      this.usuarioPermiso = rowData.idOrgUsuar;
      console.log(`ID USUARIO PERMISO: ${this.usuarioPermiso}`);
      this.usuarioTarea = rowData.usuario;
      this.idPermisoProcedimiento = rowData.id;
      console.log(`usuario de tarea: ${this.usuarioTarea}`);
    });
  }

  public idPermisoProcedimiento!: any;
  public idverTarea!: any;
  public veoPermisoProcedi: boolean = false;


  public envioTareaProcedi(event: any) {
    // Usar la nueva l?gica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'TareaProcedi', (rowData) => {
      this.veoPermisoProcedi = true;
      this.lanzaSourcePermi(rowData.id);
      this.idPermisoProcedimiento = rowData.id;
      this.idverTarea = rowData.id;
    });
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
      console.log("Documento  Archgivo: " + this.descargafichero);
      this.notificationService.warning('Esta tarea No tiene ning?n documento asociado')


    } else {
      window.open(this.descargafichero, "_blank");


    }

  }
}
  