import {Component} from '@angular/core';
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
  VerExpediente
} from './expedientes';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {ExpedientesService} from './expedientes.service';

import swal from 'sweetalert2';
import {environment} from 'src/environments/environment';
import {ProcedimientoService} from '../procedimientos/procedimiento.service';
import {jqxGrid_ES} from 'src/translations/jqxGrid_translate'
import {AtributosCrear, ProcediPermisosListar} from '../procedimientos/procedimiento';
import {FormGroup} from '@angular/forms';
import {SolicitudesService} from '../solicitudes/solicitudes.service';
import {MUNICIO, PROVIN} from "../core/constants/datos";
import {GridRadioSelector} from "../core/helper/grid-radio-selector";
import {TablaClickHandler} from "../core/helper/tabla-click-handler";
import {NotificationService} from "../core/service/notification.service";
import {ModalManagerService} from "../core/service/modal-manager.service";
import * as bootstrap from 'bootstrap';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})

export class ExpedientesComponent {// pruebas de formularios
  public editExpedientes: boolean = false;
  public verExpedientes: boolean = false;
  public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  public title = 'Expedientes';
  public user = sessionStorage.getItem('user');// lo usamos para filtrar contenidos sin login
  public soluser = sessionStorage.getItem('solUsuar');// lo usamos para filtrar contenidos
  public trauser = sessionStorage.getItem('traUsuar');// lo usamos para filtrar contenidos
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
  public dniok: boolean = false;

  // Propiedades de validación para Nuevo Expediente
  public isCreandoExpediente: boolean = false;
  public mostrarValidacionesExpediente: boolean = false;

  // Propiedades de validación para Asignar Tramitador
  public isAsignandoTramitador: boolean = false;
  public mostrarValidacionesAsignarTramitador: boolean = false;

  public columna: any;
  public source: any;


  // Datos para la paginación
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
  // RENDERERS DE RADIO BUTTONS - NUEVA LÓGICA
  // ============================================
  
  // Renderer para el grid principal de expedientes
  public columnseleccionExpedientes = GridRadioSelector.createRadioRenderer('Expedientes', 'Selecciona Expediente', true);
  
    // Renderer para el grid de tareas de procedimientos
  public columnseleccionTareaProcedi = GridRadioSelector.createRadioRenderer('TareaProcedi', 'Selecciona Tarea', true);

  // Renderer para el grid de permisos
  public columnseleccionPermisos = GridRadioSelector.createRadioRenderer('Permisos', 'Selecciona Permiso', true);

  // Renderer para el grid de tareas del expediente
  public columnseleccionTareasExpediente = GridRadioSelector.createRadioRenderer('TareasExpediente', 'Selecciona Tarea', true);

  // Renderer para el grid de atributos
  public columnseleccionAtributos = GridRadioSelector.createRadioRenderer('Atributos', 'Selecciona Atributo', true);

  verpagina() {

    if (this.trauser == "1") {

      console.log('Tiene permiso a Expedientes!!');

      this.expedientesService.getExpedientesListar().subscribe(
        expedienteslistar => this.expedienteslistar = expedienteslistar
      );

      // consulta de codigo de respuesta de la consulta
      this.expedientesService.getExpedientesListar().subscribe(
        data => console.log(`Exp Listados: ${data.length}`),
        (error: HttpErrorResponse) => {
          this.statusGetExpedientes = error.status;

          console.error(`Datos del Error de página : ${error.status}`);
        }
      );


      this.expedientesService.getProcedimientos().subscribe(
        procedimientos => this.procedimientos = procedimientos
      );


    } else {
      console.log(' NO tiene permiso a Expedientes!!');
      swal.fire(`Lo sentimos. El usuario  ${this.user}  No tiene acceso a Expedientes.`);

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
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

// provincias y municipios

  public provin = PROVIN;

  public municio = MUNICIO;

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

  public DevolverExpe() {
    swal.fire({
      title: `¿Confirma devolver el expediente ${this.ejerexpe}/${this.numExp} ?`,
      text: "Este paso no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.DevolverExpediente(this.idexpediente).subscribe(response => {
          this.sourceExp = ({
            dataType: 'json',
            dataFields: [
              {name: 'ejercicio', type: 'number'},
              {name: 'numero', type: 'number'},
              {name: "titulo", type: 'string'},
              {name: "formaApertura", type: 'string'},
              {name: "estado", type: 'string'},
              {name: "fecInicio", type: 'string'},
              {name: "fecFin", type: 'string'},
              {name: "fecCancelacion", type: 'string'},
              {name: "procedimiento", type: 'string'},
              {name: "instructor", type: 'string'},
              {name: "personaEntidad", type: 'string'},
              {name: "email", type: 'string'},
              {name: "forNotif", type: 'string'},
              {name: 'id', type: 'any'},
              {name: 'forNotifTexto', type: 'any'},
              {name: 'idHisDocum', type: 'any'},
            ],
            url: `${environment.apiUrl}expediente/listarExpediente/${this.user}`,
          });
          console.log("Expediente devuelto");
        });
      }
    })
  }

  public ArchivaExp() {
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Parece que no hay conexión con la red SARA'

    })

  }

  // Nueva función principal para asignar tramitador
  public onAsignarTramitadorSubmit(): void {
    this.mostrarValidacionesAsignarTramitador = true;

    // Validar campos obligatorios
    if (this.isDescripcionMensajeInvalid()) {
      this.notificationService.incompleteFields();
      return;
    }

    // Confirmar asignación
    this.notificationService.confirm(
      '¿Está seguro de que desea asignar este tramitador?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignarTramitador();
      }
    });
  }

  // Función de ejecución separada
  private ejecutarAsignarTramitador(): void {
    this.isAsignandoTramitador = true;
    
    this.crearmensaje.idExpediente = this.idexpediente;
    this.crearmensaje.destinatario = this.usuarioPermiso;
    this.crearmensaje.fecEnvio = this.Fecha;
    
    this.expedientesService.crearMensaje(this.crearmensaje).subscribe({
      next: (response) => {
        this.notificationService.success('El tramitador fue asignado');
        this.veoPermisoProcedi = false;
        this.limpiarDatosAsignarTramitador();
        this.cerrarModal('AsigfnarTramitadorModal');
      },
      error: (err: HttpErrorResponse) => {
        console.log('paso por error: ' + err.error.message);
        this.notificationService.error(err.error.message);
        this.isAsignandoTramitador = false;
      }
    });
  }

  // Función original mantenida para compatibilidad
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

      swal.fire({
        title: 'Esta seguro?',
        text: "Abrir Expediente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          swal.fire(
            'Expediente Abierto',
            '',
            'success'
          )
          this.sourceExp = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              {name: 'ejercicio', type: 'number'},
              {name: 'numero', type: 'number'},
              {name: "titulo", type: 'string'},
              {name: "formaApertura", type: 'string'},
              {name: "estado", type: 'string'},
              {name: "fecInicio", type: 'string'},
              {name: "fecFin", type: 'string'},
              {name: "fecCancelacion", type: 'string'},
              {name: "procedimiento", type: 'string'},
              {name: "instructor", type: 'string'},
              {name: "personaEntidad", type: 'string'},
              {name: "email", type: 'string'},
              {name: "forNotif", type: 'string'},
              {name: 'id', type: 'any'},
              {name: 'forNotifTexto', type: 'any'},
              {name: 'idHisDocum', type: 'any'},


            ],
            url: `${environment.apiUrl}expediente/listarExpediente/${this.user}`,

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
  public vernumerorepre: boolean = false;
  async getrepresentanteexpediente(idPerso: number, idHisPerso: number) {
    this.expedientesService.getRepresentanteExpediente(idPerso, idHisPerso).subscribe(
      representanteexplistar => this.representanteexplistar = representanteexplistar,
      (err: HttpErrorResponse) => {
        this.representanteexplistar.desPerEntid = "Sin representante asociado"

        console.log('paso por error: ' + err.error.message);
        this.nuevoexpediente.idHisRepre = null;
        this.nuevoexpediente.idRepre = null;
        this.representanteexplistar.idHisPerso = null;
        this.representanteexplistar.idPerso = null;
        console.log("idhisrepre : " + this.nuevoexpediente.idHisRepre);

      },
    );


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
  //pinta ejercicio y número
  public expEjerNum: string;
  public cargotareasexpedi: boolean = false;
  public tituloExp!: string;
  public pruebas: boolean = false;
  public veoAtributos: boolean = false;

  public veoBorrarAtributo: boolean = false;

  public idGrupo: any;
  public etiGruAtrib: any;

  public marcaAtributo(event: any) {
    // Usar la nueva lógica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'Atributos', (rowData) => {
      this.veoBorrarAtributo = true;
      this.idGrupo = rowData.idGrupo;
      this.etiGruAtrib = rowData.etiGruAtrib;
      console.log("ID  DEL ATRIBUTO : " + rowData.idAtrib);
    });
  }

  public borraAtributo() {
    this.notificationService.confirmDelete('Eliminar Atributo').then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteAtributo(this.idGrupo, this.etiGruAtrib, this.idExpediente).subscribe({
          next: (response) => {
            this.sourceAtributo = new jqx.dataAdapter({
              dataType: 'json',
              dataFields: [
                {name: 'etiGruAtrib'},
                {name: 'desGruAtrib'},
                {name: "valor"},
                {name: 'desProce'},
                {name: "desTareaProce"},
                {name: 'idGrupo'},
                {name: 'idAtrib'},
                {name: 'usuContr'},
              ],
              url: `${environment.apiUrl}atributoExpediente/listar/${this.idExpediente!}`,
              id: 'id',
            });
            this.notificationService.success('Atributo eliminado');
            this.atributosleer.length = 0;
          },
          error: (err: HttpErrorResponse) => {
            console.log('paso por error borrado atributo: ' + err.error.text);
            this.notificationService.warning(err.error.message);
          }
        });
      }
    });
  }



  public listarAtributos() {


    this.expedientesService.getAtributosListar(this.idExpediente).subscribe(
      atributosleer => this.atributosleer = atributosleer
    )


  }


  public borraArrayAtributos() {
    location.reload();
    console.log("borrado realizado");
  }
  public envioAtributos() {
    //capturamos el valor de los input
    for (let index = 0; index < this.atributosleer.length; index++) {
      const element = this.atributosleer[index];
      let valor: any = document.getElementById(`nuevoinput${index}`);

      let nuevoValor: any = {
        valor: valor.value,
        idGrupo: this.atributosleer[index].idGrupo,
        etiGruAtrib: this.atributosleer[index].etiGruAtrib

      }
      console.log("EL RESULTADO DEL VALOR : --> " + JSON.stringify(nuevoValor));


      this.expedientesService.modificaAtributo(nuevoValor, this.idexpediente).subscribe(response => {

          if (response.status) {
            console.log("ATRIBUTOS GENERADOS")
            this.borraArrayAtributos()
          }
        }, (error: HttpErrorResponse) => {
          swal.fire(error.error.message, '', 'warning')
        }
      );
    }
    setTimeout(this.borraArrayAtributos, 1000)
  }

  public valornuevoInput: string;

  public generaInputdinamicos() {
    const contenedor = document.getElementById('divform')!;
    contenedor.innerHTML = ''; // limpiamos cualquier inyección previa

    this.atributosleer.forEach((attr, idx) => {
      // Creamos label + input
      const label = document.createElement('label');
      label.htmlFor = `nuevoinput${idx}`;
      label.className = 'form-label';
      label.textContent = attr.etiGruAtrib.toString();
      const input = document.createElement('input');
      input.id = `nuevoinput${idx}`;
      input.className = 'form-control mb-3';
      // longitud viene de tu DTO
      const max = attr.longitud || 255;
      input.setAttribute('maxlength', max.toString());

      // Elegimos tipo y modo
      switch (attr.tipo) {
        case 'NUMERO':
        case 'COEFICIENTE':
        case 'MONEDA':
          input.type = 'text';
          input.setAttribute('inputmode', 'numeric');
          input.setAttribute('pattern', '[0-9]*');
          break;
        case 'FECHACORTA':
          input.type = 'date';
          break;
        default:
          input.type = 'text';
      }

      // Insertamos en DOM
      contenedor.appendChild(label);
      contenedor.appendChild(input);
    });
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



  /**
   * Maneja el doble click en la tabla de expedientes
   * Abre el modal de edición del expediente
   */
  public onExpedienteDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos completos del expediente
      this.idexpediente = rowData.id;
      this.expedientesService.getExpediente(this.idexpediente).subscribe(
        verexpediente => {
          this.verexpediente = verexpediente;
          // Abrir modal de edición después de cargar los datos
          this.abrirModalVerExpediente();
        }
      );
    });
  }

  /**
   * Abre el modal de ver expediente
   */
  public abrirModalVerExpediente(): void {
    // Verificar que hay un expediente seleccionado
    if (!this.idExpedienteString) {
      this.notificationService.warning('Debe seleccionar un expediente primero');
      return;
    }

    // Cargar datos completos del expediente antes de abrir el modal
    this.idexpediente = parseInt(this.idExpedienteString);
    
    this.expedientesService.getExpediente(this.idexpediente).subscribe({
      next: (verexpediente) => {
        this.verexpediente = verexpediente;
        // Abrir modal después de cargar los datos
        this.abrirModal('verexpedienteModal');
      },
      error: (error) => {
        console.error('Error al cargar el expediente:', error);
        this.notificationService.error('No se pudo cargar el expediente');
      }
    });
  }

  public marcaExpedienteNuevo(event: any) {
    GridRadioSelector.handleRowClick(event, 'Expedientes', (rowData) => {
    
    this.idExpediente = rowData.id;
    this.idExpedienteString = rowData.id;

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
          {name: 'archivo'},
          {name: 'nombre'},
          {name: "huella"}
        ],
        url: `${environment.apiUrl}archivo/verIndice/${rowData.id}`,
        id: 'id',
      });
    }

    this.valorEstado = rowData.estado

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
      console.log("ESTADO : " + this.valorEstado);
    } else {
      this.verAbrirExpediente = false;
      this.cancelarexp = true;
      this.cerrarexp = true;
      this.valorEstado = rowData.estado
    }

    this.expedienteSelecVisible = true;
    this.idProcedimiento = rowData.procedimiento.id
    sessionStorage.setItem("idprocedimiento", rowData.procedimiento.id);
    this.lanzaTareaProcedi();
    this.descripcionProcedimiento = rowData.procedimiento.descripcion;
    this.expeSelecDescrip = rowData.titulo;
    this.idexpediente = rowData.id;
    this.ejerexpe = rowData.ejercicio;
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


  public nombredni!: string
  public apellido1dni!: any
  public apellido2dni!: any
  public direcciondni!: string
  public cpdni!: any
  public provinciadni!: any
  public nommunicipiodni!: any
  public idhispersodni!: any;
  public idpersodni!: any;
  public seleccionoRepre!: string;
  public InteresadoSolicitud!: string;
  public dirPosta!: string;
  public codPosta!: string;
  public provincia!: string;
  public Municipio!: string;
  public existepersonaentidad = false;
  public controlpersonaentidadcrear = false;


  public selecrepresentante(event) {
    console.log("seleccionamos ----> " + event.args.row.bounddata.idPerso + "/" + event.args.row.bounddata.idHisPerso)
    this.nuevoexpediente.idHisRepre = event.args.row.bounddata.idHisPerso;
    this.nuevoexpediente.idRepre = event.args.row.bounddata.idPerso;

  };

  public cambioRepresentante = true;
  public representanteok = true;
  public existeRepresentante = false;
  public documrepre = false;
  public cambioRepresentantePideDocu = false;

  public cambiamosRepre() {
    this.cambioRepresentante = false;
    this.representanteok = false;
    this.existeRepresentante = false;
    this.documrepre = true;
    this.dniok = false;

    this.cambioRepresentantePideDocu = true;
    console.log("cambiamos repre")

  };
  public solicitadni(dni: string) {

    this.expedientesService.getDni2(dni).subscribe(response => {
        this.nombredni = response.desPerEntid;
        this.apellido1dni = response.apellido1;
        this.apellido2dni = response.apellido2;
        this.direcciondni = response.dirPosta;
        this.cpdni = response.codPosta;
        this.provinciadni = response.provincia;
        this.idhispersodni = response.idHisPerso;
        this.nommunicipiodni = response.municipio;
        this.idpersodni = response.idPerso;
        this.nuevoexpediente.idPerso = response.idPerso;
        this.nuevoexpediente.idHisPerso = response.idHisPerso;
        console.log("IDPERSO USUARIO : " + response.idPerso)


        // actualizamos lista de REPRESENTANTES


        this.sourceListRepre = new jqx.dataAdapter({
            dataType: 'json',

            dataFields: [
              {name: 'id', type: 'any'},
              {name: 'idPerso', type: 'any'},
              {name: 'idHisPerso', type: 'any'},
              {name: 'desPerEntid', type: 'any'},
              {name: 'dirPosta', type: 'any'},


            ],
            url: `${environment.apiUrl}personaRepresentante/listar/${this.nuevoexpediente.idPerso}/${this.nuevoexpediente.idHisPerso}`,

            // url: `${environment.apiUrl}personaRepresentante/listar/5022/2516` ,
            id: 'id',
            sortcolumn: 'id',
            sortdirection: 'desc'
          }
        );


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
          // this.editasolicitud.idPerso =response.idPerso;
          //this.editasolicitud.idHisPerso =response.idHisPerso;
          this.controlpersonaentidadcrear = true;
          //  this.getrepresentanteexpediente(response.idPerso,response.idHisPerso);

        } else {

          this.dniok = false;
          this.existepersonaentidad = true;
          this.controlpersonaentidadcrear = false;


        }

      }, err => {
        if (err.status == 404) {
          swal.fire('El interesado no está registrado', 'Por favor introduzca los datos para el alta', 'error');
          this.existepersonaentidad = true;
          this.dniok = false;

        } else {
          this.existepersonaentidad = false;

        }
      }
    );

    this.dniok = true;

  }


  public selectnombre: boolean = false
  public selectape1: boolean = false
  public selectape2: boolean = false
  public selectRazonSocial: boolean = false

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
  public limpiadatosnuevoexpediente() {

    this.nuevoexpediente = new NuevoExpediente();
    this.consultadni = new ConsultaDni();
    this.representanteexplistar = new RepresentanteExpLIstar()
    this.existepersonaentidad = false;

    console.log("LIMPIANDO");
    this.dniok = false;

      // Resetear validaciones
  this.mostrarValidacionesExpediente = false;
  this.isCreandoExpediente = false;

}

// Gestión de modales
public abrirModal(modalId: string): void {
  this.modalManagerService.openModal(modalId);
}

public cerrarModal(modalId: string): void {
  // Resetear validaciones específicas según el modal
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

// Función de validación para Asignar Tramitador
public isDescripcionMensajeInvalid(): boolean {
  return this.mostrarValidacionesAsignarTramitador && (!this.crearmensaje.descripcion || this.crearmensaje.descripcion.trim() === '');
}

// Función de limpieza para Asignar Tramitador
private limpiarDatosAsignarTramitador(): void {
  this.isAsignandoTramitador = false;
  this.mostrarValidacionesAsignarTramitador = false;
  this.atrasNuevoMensaje();
}

// Funciones específicas para modales con lógica previa
public abrirModalTareasExpediente(): void {
  this.actualizoSourceTareasExpediente(this.idExpedienteString);
  this.abrirModal('TareaExpedienteModal');
}

public abrirModalAtributos(): void {
  this.generaInputdinamicos();
  this.abrirModal('NAtributosModal2');
}
  // Funciones de validación para Nuevo Expediente
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

    // Confirmar creación del expediente
    this.notificationService.confirm(
      '¿Está seguro de que desea crear el expediente?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarCrearExpediente();
      }
    });
  }

  private ejecutarCrearExpediente(): void {
    this.isCreandoExpediente = true;
    let ejer = this.ejercicio.getFullYear();

    console.log("FORMA DE APERTURA : " + this.nuevoexpediente.forma_apertura);
    this.nuevoexpediente.ejercicio = ejer;

    this.nuevoexpediente.idRepre = this.representanteexplistar.idPerso;
    this.nuevoexpediente.idHisRepre = this.representanteexplistar.idHisPerso;

    if (this.seleccionoRepre == "1") {
      console.log("REPRESENTANTE SELECCIONADO")
      console.log("valor de seleccionoRepre : " + this.seleccionoRepre)
      this.nuevoexpediente.idHisRepre = this.representanteexplistar.idHisPerso;
      this.nuevoexpediente.idRepre = this.representanteexplistar.idPerso;
    } else {
      console.log("REPRESENTANTE NO SELECCIONADO")
      console.log("valor de seleccionoRepre : " + this.seleccionoRepre)
      this.nuevoexpediente.idHisRepre = null;
      this.nuevoexpediente.idRepre = null;
    }

    this.expedientesService.crearExpediente(this.nuevoexpediente).subscribe({
      next: (data) => {
        console.log("mensaje de respuesta : " + data.status);
        this.notificationService.success('El expediente se ha creado exitosamente');
        this.limpiarDatosExpediente();
        setTimeout(this.recargarpagina, 1000);
      },
      error: (error: HttpErrorResponse) => {
        console.log("STATUS ERROR : " + error.status);
        this.notificationService.error('Ha ocurrido un error al crear el expediente');
        this.isCreandoExpediente = false;
      }
    });
  }

  private limpiarDatosExpediente(): void {
    this.isCreandoExpediente = false;
    this.mostrarValidacionesExpediente = false;
    this.limpiadatosnuevoexpediente();
    this.cerrarModal('nexpedienteModal');
  }

  public creaExpediente() {
    this.onCrearExpedienteSubmit();
  }

  public fechacancelacionexpedi!: Date;

  public cancelarExpediente() {
    console.log("pulsando cancelacion deexpediente!!!");
    console.log("fecha de cancelacion: " + this.fechacancelacionexpedi);

    if (this.fechacancelacionexpedi == undefined) {
      this.notificationService.warning('Por favor rellene la fecha de cancelación');
      return;
    }

    this.notificationService.confirmDelete(
      'Al confirmar cancelará el Expediente Seleccionado!'
    ).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.cancelarExpediente(this.idexpediente, this.fechacancelacionexpedi).subscribe({
          next: (response) => {
            this.editExpedientes = false;
            this.sourceExp = ({
              dataType: 'json',
              dataFields: [
                {name: 'ejercicio', type: 'number'},
                {name: 'numero', type: 'number'},
                {name: "titulo", type: 'string'},
                {name: "formaApertura", type: 'string'},
                {name: "estado", type: 'string'},
                {name: "fecInicio", type: 'string'},
                {name: "fecFin", type: 'string'},
                {name: "fecCancelacion", type: 'string'},
                {name: "procedimiento", type: 'string'},
                {name: "instructor", type: 'string'},
                {name: "personaEntidad", type: 'string'},
                {name: "email", type: 'string'},
                {name: "forNotif", type: 'string'},
                {name: 'id', type: 'any'},
                {name: 'forNotifTexto', type: 'any'},
                {name: 'idHisDocum', type: 'any'},
              ],
              url: `${environment.apiUrl}expediente/listarExpediente/${this.user}`,
            });
            this.notificationService.success('El Expediente ha sido cancelado');
            this.cerrarModal('cancelarExpModal');
          },
          error: (error) => {
            this.notificationService.error('Error al cancelar el expediente');
          }
        });
      } else {
        console.log("CANCELADO BOTON PULSADO");
        this.fechacancelacionexpedi = new Date();
      }
    });
  }


  // para ver el boton cerrarExpediente
  public cerrarexp: boolean = false;
  public fechacierreexpedi!: any;
  public serieDocumental!: any;


  public cerrarExpediente() {
    if (this.fechacierreexpedi == undefined || this.serieDocumental == undefined) {
      this.notificationService.incompleteFields();
      return;
    }

    this.notificationService.confirm(
      'Al confirmar cerrará el Expediente Seleccionado!'
    ).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.cerrarExpediente(this.idexpediente, this.fechacierreexpedi, this.serieDocumental).subscribe({
          next: (response) => {
            this.notificationService.success('El Expediente ha sido cerrado');
            console.log("Cerrando...");
            this.sourceExp = new jqx.dataAdapter({
              dataType: 'json',
              dataFields: [
                {name: 'ejercicio', type: 'number'},
                {name: 'numero', type: 'number'},
                {name: "titulo", type: 'string'},
                {name: "formaApertura", type: 'string'},
                {name: "estado", type: 'string'},
                {name: "fecInicio", type: 'string'},
                {name: "fecFin", type: 'string'},
                {name: "fecCancelacion", type: 'string'},
                {name: "procedimiento", type: 'string'},
                {name: "instructor", type: 'string'},
                {name: "personaEntidad", type: 'string'},
                {name: "email", type: 'string'},
                {name: "forNotif", type: 'string'},
                {name: 'id', type: 'any'},
                {name: 'forNotifTexto', type: 'any'},
                {name: 'idHisDocum', type: 'any'},
              ],
              url: `${environment.apiUrl}expediente/listarExpediente/${this.user}`,
              sortcolumn: 'id',
              sortdirection: 'desc'
            });
            this.cerrarModal('cerrarExpModal');
          },
          error: (err: HttpErrorResponse) => {
            this.notificationService.warning(err.error.message);
          }
        });
      }
    });
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
    public http: HttpClient,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService
  ) {
  };

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
    // console.log("FEcha año : " + aniofenvio)
    //console.log("FEcha mes : " + mesfenvio)
    //console.log("FEcha dia : " + diafenvio)

    console.log("FEcha Sistema : " + this.fechaSistema)


  }


  async ngOnInit() {
    this.FechaSistema();
    if (this.consultadni.idPerso || this.consultadni.idHisPerso) {
      this.getrepresentanteexpediente(this.consultadni.idPerso, this.consultadni.idHisPerso)

    }


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
        {name: 'visible', type: 'any'},
        {name: 'numRegis', type: 'any'},
        {name: 'idHisDocum', type: 'any'},
        {name: 'ejeNumNotif', type: 'any'},
        {name: 'nombreArchivo', type: 'any'},
        {name: 'idAnunc', type: 'any'},
        {name: 'desTramite', type: 'any'},


      ],
      //url:` `,
      url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/0`,
      id: 'id',
      //sortcolumn: 'fecFin',
      //sortdirection: 'asc'

    });


    this.verpagina();


  }


  public clicktareExpediente(event: any) {
    // Usar la nueva lógica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'TareasExpediente', (rowData) => {
      this.numeroArchivo = rowData.archivo;
      console.log("tiene documento?" + this.numeroArchivo);
    });
  }


  public fechaTramite!: any;
  public fechatramite!: any;

  lanzaSourcePermi(id: any) {
    console.log("valor del triggeri!!!!" + id);


    this.sourcePermi = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'usuario'},
        {name: 'desProce'},
        {name: "desTareaProce"},
        {name: "idOrgUsuar"},

        {name: 'id'},


      ],

      url: `${environment.apiUrl}permiso/listar/${id}`,

      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'

    });


    console.log("LANZANDO lanzaSourcePermi!!!!");
    console.log(`${environment.apiUrl}permiso/listar/${id}`);
  }


  public usuarioTarea!: any;
  public usuarioPermiso!: any;

  public idpermisosPermi(event: any) {
    // Usar la nueva lógica de GridRadioSelector
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
    // Usar la nueva lógica de GridRadioSelector
    GridRadioSelector.handleRowClick(event, 'TareaProcedi', (rowData) => {
      this.veoPermisoProcedi = true;
      this.lanzaSourcePermi(rowData.id);
      this.idPermisoProcedimiento = rowData.id;
      this.idverTarea = rowData.id;
    });
  }


  // PARA NUEVOS FILTROS JQX
  public columnrenderer = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }


  public columnrendererIndiceENI = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }

  public columnseleccion = function (value) {


    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Expediente" (click)="marcaExpedienteNuevo($event)" ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';


  }

  public cellsrendererRepre = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;"  >' + value + '</div>';
  }

  public cellsrendererEjercico = function (row, column, value) {


    return ' <div style="padding-top:5px;  text-align: center;"  type="button"  (click)="marcaExpedienteNuevo($event)" >' + value.args.row.bounddata.ejercicio + '/' + value.args.row.bounddata.numero + '</div>';


  }


  public cellsrendererIndiceENI = function (row, column, value) {


    return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';


  }

  public cellsrenderer = function (row, column, value) {

    if (this.valorEstado == "CERRADO" || this.valorEstado == "CANCELADO") {
      return `<div style="text-align: left; color:red; margin-top: 5px; padding-left: 8px; line-height: 1.2;">` + value + '</div>';


    } else {
      return `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">` + value + '</div>';

    }


  }
  public cellsrendererTareaExpedi = function (row, column, value) {

    if (this.valorEstado == "CERRADO" || this.valorEstado == "CANCELADO") {
      return `<div style="text-align: center;color:red; margin-top: 5px;"  type="button"  >` + value + '</div>';


    } else {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';

    }


  }
  public cellsrendererInteresado = function (row, column, value) {


    return `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">` + value.desPerEntid + '</div>';


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
      recorteFecha = "Sin fecha registrada"
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;"  type="button"  >` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;"  type="button" >` + dia + "/" + mes + "/" + anio + '</div>';

    }


  }
  public cellsrendererProcedimientoExpe = function (row, column, value) {

    return '<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">' + value.descripcion + '</div>';
  }
  public columnseleccionTarea = function (event: any) {


    // console.log("id solicitud : " + event );
    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea" (click)="selecsolicitudNueva($event)" ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';
    //return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selñecciona Expediente" (click)="marcaExpedienteNuevo($event)" >  </div>';


  }
  public columnseleccionPermiso = function (event: any) {


    // console.log("id solicitud : " + event );
    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea" (click)="selecsolicitudNueva($event)" ><input type="radio"  value="" name="RadioIdPermiso" id="RadioId">   </div>';
    //return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selñecciona Expediente" (click)="marcaExpedienteNuevo($event)" >  </div>';


  }

  public cellsrendererTareaDescrip = function (row, column, value) {
    return '<div  style="overflow-wrap: auto; text-align: center; margin-top: 5px;">' + value + '</div>';
  }

  public cellsrendererTarea = function (row, column, value) {
    return '<div style=" text-align: center; margin-top: 5px;">' + value + '</div>';
  }
  public cellsrendererPermi = function (row, column, value) {

    const resultado: any = value.id;
    sessionStorage.setItem('usuarioTarea', resultado);


    if (value == 'ANOS') {
      value = 'AÑOS';
    }


    return '<div style="text-align: center;font-family: Verdana; margin-top: 5px;"  >' + value + '</div>';
  }
  public columnrendererPermi = function (value) {

    return '<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">' + value + '</div>';
  }


  public columnseleccionTareaTramite = function (value) {


    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea del Expediente"  ><input type="radio"  value="" name="RadioIdb" id="RadioIdb">   </div>';


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
      // value = "Pulsa para descargar"
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    } else {

      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }


  }


  public cellsrendererTramiteTarea = function (row, column, value) {


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';

  }


  public cellsrendererPlazo = function (row, column, value) {

    console.log("Fecha inicio: " + this.FecIniTarea);
    console.log("Fecha Fin: " + this.FecIniTarea)

    var dato1: string = this.FecIniTarea;


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }


  public cellsrendererArchivo = function (row, column, value) {

    if (value == "1") {
      // value = "Pulsa para descargar"
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    } else {

      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }


  }

  public cellsrendererFechaPlazo = function (row, column, value) {


    if (!value) {
      return `<div style="text-align: center;margin-top: 5px;"  type="button"  >` + 'SIN FECHA' + '</div>';


    } else {
      return `<div style="text-align: center;margin-top: 5px;"  type="button" >` + value + '</div>';


    }


  }


  columnsExpe = [
    {text: 'id', datafield: 'id', hidden: true},
    //{text: 'Id', datafield: 'id'},
    {text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccionExpedientes, renderer: this.columnrenderer},
    {
      text: 'Ejercicio',
      width: '5%',
      datafield: 'ejercicio',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Número',
      width: '5%',
      sortby: 'desc',
      datafield: 'numero',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {text: 'Título', width: '18%', datafield: 'titulo', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {
      text: 'Forma apertura',
      width: '9%',
      datafield: 'formaApertura',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Estado',
      width: '7%',
      datafield: 'estado',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Expediente',
      width: '9%',
      datafield: 'fecInicio',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha cierre',
      width: '9%',
      datafield: 'fecFin',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Fecha cancela',
      width: '9%',
      datafield: 'fecCancelacion',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Procedimiento',
      datafield: 'procedimiento',
      width: '25%',
      cellsrenderer: this.cellsrendererProcedimientoExpe,
      renderer: this.columnrenderer
    },
    {
      text: 'Instructor',
      width: '8%',
      datafield: 'instructor',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Interesado',
      width: '21%',
      datafield: 'personaEntidad',
      cellsrenderer: this.cellsrendererInteresado,
      renderer: this.columnrenderer
    },
    {
      text: 'Email',
      datafield: 'email',
      cellsrenderer: this.cellsrendererInteresado,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'ForNotif',
      datafield: 'forNotif',
      cellsrenderer: this.cellsrendererInteresado,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'forNotifTexto',
      datafield: 'forNotifTexto',
      cellsrenderer: this.cellsrendererInteresado,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'idHisDocum',
      datafield: 'idHisDocum',
      cellsrenderer: this.cellsrendererInteresado,
      renderer: this.columnrenderer,
      hidden: true
    },
  ];
  public localizationObject: any = jqxGrid_ES;


  sourceExp = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'ejercicio', type: 'number'},
      {name: 'numero', type: 'number'},
      {name: "titulo", type: 'string'},
      {name: "formaApertura", type: 'string'},
      {name: "estado", type: 'string'},
      {name: "fecInicio", type: 'string'},
      {name: "fecFin", type: 'string'},
      {name: "fecCancelacion", type: 'string'},
      {name: "procedimiento", type: 'string'},
      {name: "instructor", type: 'string'},
      {name: "personaEntidad", type: 'string'},
      {name: "email", type: 'string'},
      {name: "forNotif", type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'forNotifTexto', type: 'any'},
      {name: 'idHisDocum', type: 'any'},


    ],
    url: `${environment.apiUrl}expediente/listarExpediente/${this.user}`,

    // id: 'OrderID',
    // sortname: 'id',
    // sortcolumn: 'numero',
    sortcolumn: 'fecInicio',
    sortdirection: 'desc'

  });
  sourceTramite = ({});


  columnsTareaProcedi = [
    {text: 'id', datafield: 'id', width: 10, hidden: true},
    {text: 'plantillaDefecto', datafield: 'plantillaDefecto', width: 10, hidden: true},
    {text: '', datafield: '', width: '5%', cellsrenderer: this.columnseleccionTareaProcedi, renderer: this.columnrenderer},
    {
      text: 'Descripción',
      width: '50%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererTareaDescrip,
      renderer: this.columnrenderer
    },
    {text: 'Fase', datafield: 'faseTarea', cellsrenderer: this.cellsrendererTarea, renderer: this.columnrenderer},
    {
      text: 'Plazo',
      width: 60,
      datafield: 'plazo',
      cellsrenderer: this.cellsrendererTarea,
      renderer: this.columnrenderer
    },
    {text: 'Tipo plazo', datafield: 'tipoPlazo', cellsrenderer: this.cellsrendererTarea, renderer: this.columnrenderer},
  ];


  sourceTareaProcedi = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'descripcion', type: 'string'},
      {name: 'faseTarea', type: 'string'},
      {name: "plazo", type: 'string'},
      {name: "tipoPlazo", type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'plantillaDefecto', type: 'any'},


    ],

    url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idProcedimiento,

    id: 'id',
    // sortcolumn: 'id',
    // sortdirection: 'desc'


  });


  columnsPermi = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {text: 'idOrgUsuar', datafield: 'idOrgUsuar', width: '1%', hidden: true},
    {text: '', datafield: '', width: '5%', cellsrenderer: this.columnseleccionPermisos, renderer: this.columnrenderer},
    {text: 'Usuario', datafield: 'usuario', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrendererPermi},
    {
      text: 'Procedimiento',
      datafield: 'desProce',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrenderer,
      hidden: true
    },
    {text: 'Descripción', datafield: "descripcion", renderer: this.columnrenderer, hidden: true},
    {
      text: 'Tarea',
      datafield: 'desTareaProce',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrenderer,
      hidden: true
    },

  ];


  sourcePermi = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'usuario'},
      {name: 'desProce'},
      {name: "desTareaProce"},
      {name: 'descripcion'},
      {name: 'id'},
      {name: 'idOrgUsuar'},


    ],
    url: `${environment.apiUrl}permiso/listar/${this.idPermisoProcedimiento}`,
    id: 'id',
  });


  columnsListRepre: any[] = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true},
    {text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true},
    {text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer},
    {text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: this.cellsrendererRepre, renderer: this.columnrenderer},
    // {text: 'Nùmero', width: '8%',datafield:'id',cellsrenderer: this.cellsrendererEjercicio,renderer: this.columnrenderer},
//  {text: 'Instructor ', datafield: 'instructor', cellsrenderer: this.cellsrendererNumero,renderer: this.columnrenderer},
    {text: 'Dirección', datafield: 'dirPosta', cellsrenderer: this.cellsrendererRepre, renderer: this.columnrenderer},
    // {text: 'Fecha Inicio', datafield: 'fecInicio',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer},
    //{text: 'Estado',datafield: 'estado',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer},


  ];


  sourceListRepre = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'id', type: 'any'},
        {name: 'idPerso', type: 'any'},
        {name: 'idHisPerso', type: 'any'},
        {name: 'desPerEntid', type: 'any'},
        {name: 'dirPosta', type: 'any'},
      ],
      url: `${environment.apiUrl}personaRepresentante/listar/${this.nuevoexpediente.idPerso}/${this.nuevoexpediente.idHisPerso}`,
      id: 'id',
    }
  );


  public veoasignatramitador: boolean = false;

  public lanzaTareaProcedi() {

    this.sourceTareaProcedi = ({
      dataType: 'json',
      dataFields: [
        {name: 'descripcion', type: 'string'},
        {name: 'faseTarea', type: 'string'},
        {name: "plazo", type: 'string'},
        {name: "tipoPlazo", type: 'string'},
        {name: 'id', type: 'any'},
        {name: 'plantillaDefecto', type: 'any'},


      ],

      url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idProcedimiento,

      id: 'id',
      // sortcolumn: 'id',
      // sortdirection: 'desc'


    });

    this.veoasignatramitador = true;

  }


  public actualizaSourceTramite() {
    this.sourceTramite = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'numero', type: 'number'},
        {name: 'descripcion', type: 'string'},
        {name: 'fase', type: 'string'},
        {name: "fecTramite", type: 'string'},
        {name: "fecContr", type: 'string'},
        {name: "usuContr", type: 'string'},
        {name: 'id', type: 'any'},
      ],
      //url:`  http://10.234.252.145:8090/api/gos/tareaTramiteExpediente/listar/57`
      url: `${environment.apiUrl}tramite/listar/${this.idexpediente}`,
      id: 'id',
      // sortcolumn: 'id',
      //  sortdirection: 'desc'

    });
  }


  public vacio(event) {

  }

  columnsIndiceENI = [
    {text: 'total', datafield: 'total', width: '1%', hidden: true},

    {
      text: 'Archivo',
      datafield: 'archivo',
      cellsrenderer: this.cellsrendererIndiceENI,
      renderer: this.columnrendererIndiceENI
    },
    {
      text: 'Nombre',
      datafield: 'nombre',
      cellsrenderer: this.cellsrendererIndiceENI,
      renderer: this.columnrendererIndiceENI
    },
    {
      text: 'Huella',
      datafield: "huella",
      cellsrenderer: this.cellsrendererIndiceENI,
      renderer: this.columnrendererIndiceENI
    },


  ];
  sourceIndiceENI!: any;

  if(idExpedienteString: string) {
    console.log("Me llega valores a idExpedienteString!!!");
    this.sourceIndiceENI = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'archivo', type: 'any'},
        {name: 'nombre', type: 'any'},
        {name: "huella", type: 'any'},


      ],

      url: `${environment.apiUrl}archivo/verIndice/${this.idExpedienteString}`,


      // id: 'id',
      // sortcolumn: 'id',
      //   sortdirection: 'desc'


    });


  }


  columnsTareasExpediente = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},
    {text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true},
    {text: '', datafield: '', cellsrenderer: this.columnseleccionTareasExpediente, renderer: this.columnrenderer},
    {
      text: 'Número',
      width: '5%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererTareaExpedi,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Tarea',
      width: '20%',
      datafield: 'descripcion',
      cellsrendererTareaExpedi: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción Trámite',
      width: '20%',
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
      width: '12%',
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


    ],

    url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/1`,
    id: 'id',
// sortcolumn: 'fecFin',
    // sortdirection: 'asc'

  });


  actualizoSourceTareasExpediente(idExpedi: any) {

    // swal.showLoading();
    this.source = this.sourceTareasExpediente;

    this.columna = this.columnsTareasExpediente;
    // swal.close();
//  this.limpioSourceTareasExpediente();

    this.pruebas = true;
    console.log("id que envio para listar tareas : " + idExpedi)


    setTimeout(() => {
      this.actualizoTareaExpedienteBis();
      console.log("se lanza el segundo SOURCE!!!!!")

    }, 200);


    this.sourceTareasExpediente = ({
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


      ],

      url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${idExpedi}`,
      id: 'id',
      // sortcolumn: 'fecFin',
      // sortdirection: 'asc'

    });


    console.log("url de JQX: " + `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${this.idExpedienteString}`)


  }

  public actualizoTareaExpedienteBis() {


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
        {name: 'visible', type: 'any'},
        {name: 'numRegis', type: 'any'},
        {name: 'idHisDocum', type: 'any'},
        {name: 'ejeNumNotif', type: 'any'},
        {name: 'nombreArchivo', type: 'any'},
        {name: 'idAnunc', type: 'any'},
        {name: 'desTramite', type: 'any'},


      ],

      url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${this.idExpedienteString}`,
      id: 'id',
      // sortcolumn: 'fecFin',
      // sortdirection: 'asc'

    });


  }

  public limpioSourceTareasExpediente() {
    console.log("LIMPIAMOS SOURCE ----->")
    this.sourceTareasExpediente = ({})

  }


  public lanzoIndiceENI(idexpe: string) {

    this.sourceIndiceENI = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'archivo', type: 'any'},
        {name: 'nombre', type: 'any'},
        {name: "huella", type: 'any'},


      ],

      url: `${environment.apiUrl}archivo/verIndice/${idexpe}`,


      // id: 'id',
      // sortcolumn: 'id',
      //   sortdirection: 'desc'


    });

  }


  columnsAtributo = [
    {text: 'idAtrib', datafield: 'idAtrib', width: '1%', hidden: true},
    {text: 'idGrupo', datafield: 'idGrupo', width: '1%', hidden: true},
    {text: 'usuContr', datafield: 'usuContr', width: '1%', hidden: true},
    {text: '', datafield: '', width: '5%', cellsrenderer: this.columnseleccionAtributos, renderer: this.columnrenderer},
    {
      text: 'Etiqueta',
      datafield: 'etiGruAtrib',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrendererPermi
    },
    {
      text: 'Descripción',
      datafield: 'desGruAtrib',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrendererPermi
    },
    {text: 'valor', datafield: 'valor', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrenderer},

  ];

  sourceAtributo = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'etiGruAtrib'},
      {name: 'desGruAtrib'},
      {name: "valor"},
      {name: 'desProce'},
      {name: "desTareaProce"},
      {name: 'idGrupo'},
      {name: 'idAtrib'},
      {name: 'usuContr'},


    ],

    url: `${environment.apiUrl}atributoExpediente/listar/${this.idExpediente!}`,


    id: 'id',
    // sortcolumn: 'id',
    //   sortdirection: 'desc'


  });


  public descargafichero!: any;

  public abreArchivo() {

    this.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${this.numeroArchivo}`; // Reemplaza con la URL del archivo que deseas descargar


    if (!this.numeroArchivo) {
      console.log("Documento  Archgivo: " + this.descargafichero);
      swal.fire('Esta tarea No tiene ningún documento asociado')


    } else {
      window.open(this.descargafichero, "_blank");


    }

  }


  // HASTA AQUI FILTROS JQX

}
