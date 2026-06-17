import { Component, ViewChild } from '@angular/core';
import {
  AtributosCrear,
  CreaPermisoProcedi,
  CrearProcedi,
  CreaTareaProcedi,
  EditarProcedi,
  EditaTareaProcedi,
  ListaTareaProcedi,
  MateriaProcedimiento,
  PermisProcedi,
  PlantillaTarea,
  Procedimiento,
  ProcediPermisos
} from './procedimiento';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { map, Observable } from 'rxjs';
import { ACCIONES } from "../core/helper/tarea-acciones";
import { ReciboCabeceraDto } from "../core/models/recibo-cabecera.dto";
import * as bootstrap from 'bootstrap';
import { ProcedimientoService } from "./procedimiento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ModalService } from "../core/service/modal.service";
import { TablaClickHandler } from "../core/helper/tabla-click-handler";
import { GridRadioSelector } from "../core/helper/grid-radio-selector";
import { NotificationService } from "../core/service/notification.service";
import { FormValidatorHelper } from "../core/helper/form-validator.helper";
import { ModalManagerService } from "../core/service/modal-manager.service";

class RespuestasHttp {
  error!: any;
  headers!: any;
  status!: number;
  statusText!: string;
  url!: string;
}

class TareaProcediCreada {
  // clase creada para usar los datos que retorna la creacion de tareas desde createTareaProcedi
  id!: number;
  procedimiento!: number;
  descripcion!: string;
  faseTarea!: string;
  plazo!: number;
  tipoPlazo!: string;
  tareaAutomatica!: string;
  plantillaDefectoModulo!: number;
  plantillaDefecto!: string;
  procesoFirmadoDefecto!: string;
  usuContr!: string

}

class FirmaListar {
  // clase creada para usar los datos del json que nos devuelve listado de firma
  idProFirma!: number;
  tipFirma!: number;
  modulo!: number;
  conDesat!: boolean;
  activo!: boolean;
  descripcionCircuito!: string;
  usuContr!: any;
  fecContr!: any;
  codEntid!: number;
  plantilla!: string;
  procesoFirmadoDefecto!: number;
}

class PermisoProcediCreado {
  // clase creada para usar los datos que retorna la creacion de tareas desde createpermisoprocedi
  idproceso!: number;
  idtarea!: number;
  usuario!: string;
  usuctrl!: string;
}

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent {
  // Referencias a los grids
  @ViewChild('gridProcedimientos') gridProcedimientos: any;
  @ViewChild('gridTareas') gridTareas: any;
  @ViewChild('gridPermisos') gridPermisos: any;
  @ViewChild('gridAtributos') gridAtributos: any;

  public headers = new HttpResponse;
  public edicion: boolean = false;
  public idver!: number;
  public nivAcces = localStorage.getItem('nivAcces');
  public userorg = sessionStorage.getItem('nivAcces');
  public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  public departamento = sessionStorage.getItem('departamento');
  public procedimiento: Procedimiento = new Procedimiento();
  public respuestahttp: any = new RespuestasHttp;
  public respuesta = new Response;
  public vermenu: boolean = false; // para ver el menu tiene que cambiar a true
  public idpermis: any = sessionStorage.getItem('idpermiso');
  public editarprocedi: EditarProcedi = new EditarProcedi();
  public atributoscrear: AtributosCrear = new AtributosCrear();
  public firmaT!: string;
  public userctrl: any = sessionStorage.getItem('user');


  // --------------------Eleazar garcia
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
  materiaprocedimiento!: MateriaProcedimiento[];
  procedimientos!: Procedimiento[];
  permisprocedi!: PermisProcedi[];
  dataSource!: any;

  // Datos para la paginación sin uso
  public page!: number;

  public npagina: number = 4;

  // GESTIÓN DE ATRIBUTOS DE TAREAS

  // Variables para atributos de tareas
  public tipoAtributo: any[] = [
    { descripcion: "Texto (Sin Límite de Caracteres)", valor: 1 },
    { descripcion: "Texto (1 Carácter)", valor: 2 },
    { descripcion: "Texto (2 Caracteres Máximo)", valor: 3 },
    { descripcion: "Texto (3 Caracteres Máximo)", valor: 4 },
    { descripcion: "Texto (4 Caracteres Máximo)", valor: 5 },
    { descripcion: "Texto (5 Caracteres Máximo)", valor: 6 },
    { descripcion: "Texto (6 Caracteres Máximo)", valor: 7 },
    { descripcion: "Texto (7 Caracteres Máximo)", valor: 8 },
    { descripcion: "Texto (8 Caracteres Máximo)", valor: 9 },
    { descripcion: "Texto (9 Caracteres Máximo)", valor: 10 },
    { descripcion: "Texto (10 Caracteres Máximo)", valor: 11 },
    { descripcion: "Texto (11 Caracteres Máximo)", valor: 12 },
    { descripcion: "Texto (12 Caracteres Máximo)", valor: 13 },
    { descripcion: "Texto (15 Caracteres Máximo)", valor: 14 },
    { descripcion: "Texto (20 Caracteres Máximo)", valor: 15 },
    { descripcion: "Texto (50 Caracteres Máximo)", valor: 16 },
    { descripcion: "Texto (100 Caracteres Máximo)", valor: 17 },
    { descripcion: "Texto (200 Caracteres Máximo)", valor: 18 },
    { descripcion: "Texto (500 Caracteres Máximo)", valor: 19 },
    { descripcion: "Texto (1000 Caracteres Máximo)", valor: 20 },
    { descripcion: "Fecha Corta (Formato Numérico dd/MM/yyyy)", valor: 21 },
    { descripcion: "Número (1 Dígito)", valor: 27 },
    { descripcion: "Número (2 Dígitos Máximo)", valor: 28 },
    { descripcion: "Número (3 Dígitos Máximo)", valor: 29 },
    { descripcion: "Número (4 Dígitos Máximo)", valor: 30 },
    { descripcion: "Número (5 Dígitos Máximo)", valor: 31 },
    { descripcion: "Número (6 Dígitos Máximo)", valor: 32 },
    { descripcion: "Número (7 Dígitos Máximo)", valor: 33 },
    { descripcion: "Número (8 Dígitos Máximo)", valor: 34 },
    { descripcion: "Número (9 Dígitos Máximo)", valor: 35 },
    { descripcion: "Número (10 Dígitos Máximo)", valor: 36 },
    { descripcion: "Número (11 Dígitos Máximo)", valor: 37 },
    { descripcion: "Número (12 Dígitos Máximo)", valor: 38 },
    { descripcion: "Moneda (Euro)", valor: 39 },
    { descripcion: "Coeficiente", valor: 42 }
  ];


  public maximoCaracAtributos: number;
  public tipocaracteresAtributos: string;

  public asociaEtiquetaAtributosEditar(valor: any) {

    for (let index = 0; index < this.tipoAtributo.length; index++) {
      if (this.tipoAtributo[index].valor == valor) {
        this.atributoscrear.desGruAtrib = this.tipoAtributo[index].descripcion;
        let str = this.tipoAtributo[index].descripcion;
        let firstWord = str.split(' ')[0];
        console.log(firstWord);
        this.atributoscrear.etiGruAtrib = firstWord;
      }
    }

    switch (this.atributoscrear.desGruAtrib) {
      case "Texto (1 Carácter)":
        this.maximoCaracAtributos = 1;
        this.tipocaracteresAtributos = "text";
        this.disabledAtrib = false;
        break;

      case "Texto (2 Caracteres Máximo)":
        this.maximoCaracAtributos = 2;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (3 Caracteres Máximo)":
        this.maximoCaracAtributos = 3;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (4Caracteres Máximo)":
        this.maximoCaracAtributos = 4;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (5 Caracteres Máximo)":
        this.maximoCaracAtributos = 5;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (6 Caracteres Máximo)":
        this.maximoCaracAtributos = 6;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (7 Caracteres Máximo)":
        this.maximoCaracAtributos = 7;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (8 Caracteres Máximo)":
        this.maximoCaracAtributos = 8;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (9Caracteres Máximo)":
        this.maximoCaracAtributos = 9;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (10 Caracteres Máximo)":
        this.maximoCaracAtributos = 10;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (11 Caracteres Máximo)":
        this.maximoCaracAtributos = 11;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (12 Caracteres Máximo)":
        this.maximoCaracAtributos = 12;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (15 Caracteres Máximo)":
        this.maximoCaracAtributos = 15;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (20 Caracteres Máximo)":
        this.maximoCaracAtributos = 20;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (50 Caracteres Máximo)":
        this.maximoCaracAtributos = 50;
        this.tipocaracteresAtributos = "text"

        break;
      case "Texto (100 Caracteres Máximo)":
        this.maximoCaracAtributos = 100;
        this.tipocaracteresAtributos = "text"

        break;
      case "Número (1 Dígito)":
        this.maximoCaracAtributos = 1;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (2 Dígitos Máximo)":
        this.maximoCaracAtributos = 2;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (3 Dígitos Máximo)":
        this.maximoCaracAtributos = 3;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (4 Dígitos Máximo)":
        this.maximoCaracAtributos = 4;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (5 Dígitos Máximo)":
        this.maximoCaracAtributos = 5;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (6 Dígitos Máximo)":
        this.maximoCaracAtributos = 6;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (7 Dígitos Máximo)":
        this.maximoCaracAtributos = 7;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (8 Dígitos Máximo)":
        this.maximoCaracAtributos = 8;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (9 Dígitos Máximo)":
        this.maximoCaracAtributos = 9;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (10 Dígitos Máximo)":
        this.maximoCaracAtributos = 10;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (11 Dígitos Máximo)":
        this.maximoCaracAtributos = 11;
        this.tipocaracteresAtributos = "number"

        break;
      case "Número (12 Dígitos Máximo)":
        this.maximoCaracAtributos = 12;
        this.tipocaracteresAtributos = "number"

        break;
      case "Fecha Corta (Formato Numérico dd/MM/yyyy)":
        this.maximoCaracAtributos = 10;
        this.tipocaracteresAtributos = "datetime"
        this.disabledAtrib = true;

        break;
      case "Coeficiente":
        this.maximoCaracAtributos = 10;
        this.tipocaracteresAtributos = "number"
        this.disabledAtrib = false;

        break;
      case "Moneda (Euro)":
        this.maximoCaracAtributos = 10;
        this.tipocaracteresAtributos = "number"
        this.disabledAtrib = false;
        break;
    }
    console.log("VALOR ETIQUETA : " + this.atributoscrear.desGruAtrib);
  }

  constructor(
    public procedimientoService: ProcedimientoService,
    public router: Router, public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public _location: Location,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService) { }

  public disabledAtrib: boolean = false;

  ngOnInit(): void {
    this.procedimientoService.getMateriaProcedi().subscribe(
      materiaprocedimiento => this.materiaprocedimiento = materiaprocedimiento
    );
    this.procedimientoService.getPermisoProcedi().subscribe(
      procedipermisos => this.procedipermiso = procedipermisos
    );
    this.procedimientoService.getPlantillaTareas().subscribe(
      plantillatarea => this.plantillatarea = plantillatarea
    );
    if (this.nivAcces === '6') {
      this.procedimientoService.getProcedimientos().subscribe(
        procedimientos => this.procedimientos = procedimientos
      );
    }
    this.dataSource = new MatTableDataSource(this.procedimientos);
  }

  // Función para observar cambios en el sidebar - DESHABILITADO
  // private observeSidebarChanges(): void {
  //   const sidebar = document.getElementById('sidebar');
  //   if (sidebar) {
  //     // Observar cambios en las clases del sidebar
  //     const observer = new MutationObserver(() => {
  //       this.updateGridLayouts();
  //     });
  //     
  //     observer.observe(sidebar, {
  //       attributes: true,
  //       attributeFilter: ['class']
  //     });
  //   }
  // }

  // Función para actualizar los layouts de los grids - DESHABILITADO
  // private updateGridLayouts(): void {
  //   setTimeout(() => {
  //     // Forzar actualización de todos los grids
  //     if (this.gridProcedimientos) {
  //       this.gridProcedimientos.refresh();
  //     }
  //     if (this.gridTareas) {
  //       this.gridTareas.refresh();
  //     }
  //     if (this.gridPermisos) {
  //       this.gridPermisos.refresh();
  //     }
  //     if (this.gridAtributos) {
  //       this.gridAtributos.refresh();
  //     }
  //     
  //     // Agregar clase temporal para forzar reflow
  //     const contenido = document.querySelector('.contenido-principal');
  //     if (contenido) {
  //       contenido.classList.add('force-update');
  //       setTimeout(() => {
  //         contenido.classList.remove('force-update');
  //       }, 100);
  //     }
  //   }, 50);
  // }

  // Método público para forzar actualización manual - DESHABILITADO
  // public forceUpdateLayout(): void {
  //   this.updateGridLayouts();
  // }


  public asociaEtiquetaAtributos(valor: any) {
    // Busca la descripción y la etiqueta
    const tipo = this.tipoAtributo.find(t => t.valor === valor);
    if (!tipo) { return; }
    this.atributoscrear.desGruAtrib = tipo.descripcion;
    this.atributoscrear.etiGruAtrib = tipo.descripcion.split(' ')[0];

    // Resetea bandera
    this.disabledAtrib = false;

    // Detectar texto vs número vs fecha/coefi/moneda
    if (tipo.descripcion.startsWith('Texto')) {
      // Extraer número si lo hay
      const m = tipo.descripcion.match(/(\d+)/);
      this.maximoCaracAtributos = m ? +m[1] : Infinity;
      this.tipocaracteresAtributos = 'text';
    }
    else if (tipo.descripcion.startsWith('Número')) {
      // Extraer cantidad de dígitos del texto
      const m = tipo.descripcion.match(/(\d+)/);
      this.maximoCaracAtributos = m ? +m[1] : 1;
      this.tipocaracteresAtributos = 'text';
    }
    else if (tipo.descripcion.startsWith('Fecha Corta')) {
      this.maximoCaracAtributos = 10;
      this.tipocaracteresAtributos = 'text';
      this.disabledAtrib = true;
    }
    else if (tipo.descripcion.startsWith('Coeficiente') ||
      tipo.descripcion.startsWith('Moneda')) {
      this.maximoCaracAtributos = 10;
      this.tipocaracteresAtributos = 'number';
    }
    else {
      // Sin límite
      this.maximoCaracAtributos = Infinity;
      this.tipocaracteresAtributos = 'text';
    }

    console.log(`Tipo: ${tipo.descripcion} — maxlength=${this.maximoCaracAtributos}`);
  }



  public requerido(valor: any) {

    if (valor == this.atributoscrear.requerido) {
      this.atributoscrear.requerido = 0
    } else {
      this.atributoscrear.requerido = 1;
    }
    console.log("VALOR REQUERIDO : " + this.atributoscrear.requerido);
  }

  public idAtrib: any;
  public idGrupo: any;
  public etiGruAtrib;
  public desGruAtrib;
  public valInici;
  public valMinim;
  public valMaxim;
  public longitud;


  public veoborraratributo: boolean = false;
  public EtiquetaatributosActual: any;
  public Requerido: any;


  public marcoAtributos(event: any): void {
    GridRadioSelector.handleRowClick(event, 'Atributos', (rowData) => {
      // Lógica específica del atributo
      this.veoborraratributo = true;
      this.EtiquetaatributosActual = rowData.etiGruAtrib;
      this.Requerido = rowData.requerido;
      console.log("ETIQUETA ACTUAL:", this.EtiquetaatributosActual);
      this.idAtrib = rowData.idAtrib;
      this.idGrupo = rowData.idGrupo;
      this.atributoscrear.idAtrib = rowData.idAtrib;
      this.etiGruAtrib = rowData.etiGruAtrib;
      this.atributoscrear.desGruAtrib = rowData.desGruAtrib;
      this.atributoscrear.valInici = rowData.valInici;
      this.atributoscrear.valMinim = rowData.valMinim;
      this.atributoscrear.valMaxim = rowData.valMaxim;
      this.atributoscrear.longitud = rowData.longitud;
    });
  }

  public deleteatributo() {
    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar Atributo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedimientoService.deleteAtributo(this.idGrupo, this.etiGruAtrib).subscribe(response => {
          this.disabledAtrib = false;

          // Actualizar el grid de atributos usando el método mejorado
          this.actualizaSourceAtributo(this.idprocedi);
          
          Swal.fire('Atributo Eliminado!', '', 'success');
          this.veoborraratributo = false;
          this.disabledAtrib = false;
          this.atributoscrear = new AtributosCrear();
        },
          (err: HttpErrorResponse) => {
            console.log('paso por error borrado atributo: ' + err.error.text);
            Swal.fire(err.error.message, '', 'warning')
            this.veoborraratributo = false;
            this.disabledAtrib = false;
            this.atributoscrear = new AtributosCrear();
          },
        );
      }
    },
    );
  }

  public nuevaetiqueta: string;

  public validateAndEditAtributo(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la edición
    this.editoAtributo();
  }

  public editoAtributo() {
    this.atributoscrear.etiGruAtrib = this.etiGruAtrib;
    if (!this.atributoscrear.requerido) {
      this.atributoscrear.requerido = 0
    }

    if (!this.nuevaetiqueta) {
      this.nuevaetiqueta = this.etiGruAtrib
    } else {
      this.atributoscrear.etiGruAtrib = this.nuevaetiqueta
    }

    this.procedimientoService.modificaAtributo(this.atributoscrear, this.idAtrib, this.idGrupo, this.etiGruAtrib).subscribe({
      next: (response) => {
        this.notificationService.saveSuccess('Atributo');
        
        // Cerrar el modal usando el servicio
        this.modalManagerService.closeModal('EditoAtributosModal');
        
        // Actualizar el grid de atributos usando el método mejorado
        this.actualizaSourceAtributo(this.idprocedi);
        
        this.atributoscrear = new AtributosCrear();
      }, 
      error: (err) => {
        this.notificationService.error('No se pudo modificar el Atributo: ' + err.error.message);
        
        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('EditoAtributosModal');
      }
    })
  }

  public limpioAtributosformulario() {
    this.atributoscrear = new AtributosCrear();
    // Limpiar errores de ambos formularios de atributos
    const formEditar = document.getElementById('formEditarAtributos') as HTMLFormElement;
    const formNuevo = document.getElementById('formNuevosAtributos') as HTMLFormElement;
    
    if (formEditar) {
      formEditar.classList.remove('was-validated');
    }
    if (formNuevo) {
      formNuevo.classList.remove('was-validated');
    }
  }

  public validateAndCreateAtributo(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.creoAtributo();
  }

  public creoAtributo() {
    if (this.atributoscrear.requerido != 1) {
      this.atributoscrear.requerido = 0;
    }

    this.procedimientoService.crearAtributo(this.atributoscrear, this.idProcedi).subscribe({
      next: (response) => {
        this.notificationService.saveSuccess('Atributo');
        
        // Cerrar el modal usando el servicio
        this.modalManagerService.closeModal('NAtributosModal');
        
        // Actualizar el grid de atributos
        this.actualizaSourceAtributo(this.idProcedi);
        
        this.atributoscrear = new AtributosCrear();
      },
      error: (err) => {
        this.notificationService.error('Error en el alta del Atributo: ' + err.error.message);
        
        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('NAtributosModal');
      }
    });
  }

  public refrescaProcedimientos() {
    // Limpiar selección actual
    this.veoeliminaProcedimiento = false;
    this.veoTarea = false;
    this.veoPermiso = false;
    this.veoAtributos = false;
    
    // Recrear completamente el dataAdapter
    this.sourcePro = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'descripcion', type: 'string' },
        { name: "desEleme", type: 'string' },
        { name: 'codigoSia', type: 'string' },
        { name: 'idMatProce', type: 'string' },
        { name: 'modalidad', type: 'string' },
        { name: 'siglas', type: 'string' },
        { name: 'id', type: 'any' }
      ],
      url: `${environment.apiUrl}procedimiento/listar/${this.idOrgElemen}?_t=${Date.now()}`,
      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'
    });
    
    // Forzar actualización del grid
    setTimeout(() => {
      if (this.gridProcedimientos) {
        this.gridProcedimientos.refresh();
        this.gridProcedimientos.updatebounddata();
      }
    }, 200);
    
    // Segundo intento para asegurar la actualización
    setTimeout(() => {
      if (this.gridProcedimientos) {
        this.gridProcedimientos.refresh();
        this.gridProcedimientos.updatebounddata();
      }
    }, 500);
  }



  public validateAndEditProcedimiento(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la edición
    this.editaProcedi();
  }

  public editaProcedi(): void {
    this.procedimientoService.editaProcedi(this.editarprocedi, this.idprocedi)
      .subscribe({
        next: (response) => {
          this.notificationService.saveSuccess('Procedimiento');
          this.refrescaProcedimientos();
          
          // Cerrar el modal usando el servicio
          this.modalManagerService.closeModal('editarProcedimientoModal');
          
          // Forzar recarga de la página después de 1 segundo
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message || 'No se pudo editar el procedimiento.');
          
          // Mantener el modal abierto en caso de error
          this.modalManagerService.keepModalOpen('editarProcedimientoModal');
        }
      });
  }

  //---------------------Eleazar
  lanzaSourcePermi(id: any) {
    if (!id) {
      console.error("id inválido en lanzaSourcePermi");
      return;
    }
    this.sourcePermi = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'usuario' },
        { name: 'desProce' },
        { name: 'desTareaProce' },
        { name: 'id' },
      ],
      url: `${environment.apiUrl}permiso/listar/${id}`,
      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'
    });
    console.log("LANZANDO lanzaSourcePermi!!!!");
    console.log(`${environment.apiUrl}permiso/listar/${id}`);
  }


  public idverTarea!: any;
  public idtrigger!: any;
  public descripcionT!: string;
  public faseT!: any;
  public plazot!: any;

  public tipoPlazoT!: any;

  public plantillaT!: any;


  public activaFormNuevoPermiso() {
    this.veoAccionesPermiso = false;
    this.activoFormNuevoPermiso = true;
    this.veoBorrarTarea = false;
    console.log("nuevo permiso pulsado");


  }

  public refrescavista: boolean = true;
  public idProcedimiento!: number;


  public creapermisoprocedi: CreaPermisoProcedi = new CreaPermisoProcedi();
  public permisoprocedicreado: any = new PermisoProcediCreado;
  public procedipermisos: any = new ProcediPermisos();
  procedipermiso!: ProcediPermisos[];


  public validateAndCreatePermiso(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.createPermisoProcedi();
  }

  public createPermisoProcedi(): void {
    this.refrescavista = true;
    this.activoFormNuevoPermiso = false;
    this.botonNuevoPermiso = true;
    let usuarioPermiso: string = this.creapermisoprocedi.usuario;

    this.procedimientoService.createPermisoProcedi(this.creapermisoprocedi, this.idprocedi, this.idverTarea, this.userctrl, usuarioPermiso)
      .subscribe({
        next: (response) => {
          this.permisoprocedicreado = response;
          this.notificationService.saveSuccess('Permiso');

          // Cerrar el modal usando el servicio
          this.modalManagerService.closeModal('nuevoPermisoModal');

          // guardamos la respuesta http en la clase TareaProcediCreada
          this.sourcePermi = ({
            dataType: 'json',
            dataFields: [
              { name: 'usuario', type: 'string' },
              { name: 'desProce', type: 'string' },
              { name: "desTareaProce", type: 'string' },
              { name: 'id', type: 'any' },
            ],

            url: `${environment.apiUrl}permiso/listar/${this.idverTarea}`,
            id: 'id',
          });
          
          // Solo limpiar el formulario si fue exitoso
          this.atrasCrearPermisoProcedi();
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message);
          // Mantener el modal abierto en caso de error
          this.modalManagerService.keepModalOpen('nuevoPermisoModal');
        }
      });
  }

  public activoFormNuevoPermiso: boolean = false;
  public botonNuevoPermiso: boolean = true;
  public veoAccionesPermiso: boolean = false;
  public accionTarea: any;
  public verEliminaTarea: boolean = false;


  //-------------------------Eleazar
  enviamos(event: any) {
    GridRadioSelector.handleRowClick(event, 'Procedimientos', (rowData) => {
      // Lógica específica del procedimiento principal
      this.veoeliminaProcedimiento = true;
      this.idProcedi = rowData.id;
      this.siglas = rowData.siglas;
      this.materia = rowData.idMatProce;
      this.modalidad = rowData.modalidad;
      this.idprocedi = rowData.id;
      this.edicion = true;
      this.veoTarea = true;
      this.veoPermiso = false;
      this.veoAtributos = false; // Ocultar atributos hasta que se seleccione una tarea
      this.descripProcedimiento = rowData.descripcion;
      this.departProcedimiento = rowData.desEleme;
      this.siaProcedimiento = rowData.codigoSia;

      // Limpiar el grid de atributos cuando se selecciona un nuevo procedimiento
      this.sourceAtributos = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          { name: 'etiGruAtrib' },
          { name: 'desGruAtrib' },
          { name: 'requerido' },
          { name: 'valInici' },
          { name: 'valMinim' },
          { name: 'valMaxim' },
          { name: 'tipo' },
          { name: 'longitud' },
          { name: 'idAtrib' },
          { name: 'idGrupo' }
        ],
        data: [], // Grid vacío hasta que se seleccione una tarea
        id: 'idAtrib',
        sortcolumn: 'idAtrib',
        sortdirection: 'desc'
      });
      
      // Limpiar selección de atributos, tareas y permisos
      GridRadioSelector.clearGridSelection('Atributos');
      GridRadioSelector.clearGridSelection('Tareas');
      GridRadioSelector.clearGridSelection('Permisos');
      
      this.getListaTareas(rowData.id);

      let idprocedimiento = rowData.id;
      sessionStorage.setItem('idprocedimiento', idprocedimiento);

      console.log("Valor del ID :" + rowData.id);
      this.lanzaSourceTarea();
    });
  }

  /**
   * Maneja el click en una fila del grid de tareas
   * Selecciona la fila y carga los datos de la tarea
   */
  public envioTareaProcedi(event: any): void {
    GridRadioSelector.handleRowClick(event, 'Tareas', (rowData) => {
      // Lógica específica del procedimiento
      this.accionTarea = rowData.accion;
      this.plantillaT = rowData.plantillaDefecto || "Sin plantilla";
      if (rowData.id) {
        this.lanzaSourcePermi(rowData.id);
      } else {
        console.error("El id del registro es nulo");
      }
      this.verEliminaTarea = true;
      this.veoPermiso = true;
      this.veoAccionesPermiso = true;
      this.veoAtributos = true; // Mostrar atributos cuando se selecciona una tarea
      this.usuarioTarea = "";
      this.vermenu = true;
      this.veoBorrarTarea = false;
      this.idPermisoProcedimiento = rowData.id;
      this.idverTarea = rowData.id;
      this.idtrigger = rowData.id;
      this.descripcionT = rowData.descripcion;
      this.faseT = rowData.faseTarea;
      this.plazot = rowData.plazo;
      this.tipoPlazoT = rowData.tipoPlazo;
      this.firmaT = rowData.procesoFirmadoDefecto;
      sessionStorage.setItem('idpermiso', rowData.id);
      this.peparadatosfirma(rowData.plantillaDefecto);
      
      // Cargar los atributos de la tarea seleccionada
      this.actualizaSourceAtributo(this.idProcedi);
    });
  }



  public deleteTareaProcedimiento(): void {
    if (!this.idPermisoProcedimiento) {
      Swal.fire('Error', 'No se puede eliminar una tarea sin ID válido.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción eliminará la tarea permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.procedimientoService.deleteTareaProcedimiento(this.idPermisoProcedimiento)
        .subscribe({
          next: () => {
            this.notificationService.deleteSuccess('Tarea');
            this.lanzaSourceTarea(); // Refrescar el jqxGrid
          },
          error: (err: HttpErrorResponse) => {
            console.error("Error eliminando tarea:", err);
            this.notificationService.error(err.error.message || 'No se pudo eliminar la tarea.');
          }
        });
    });
  }


  public idprocedi!: any;
  public veoTarea: boolean = false;
  public veoeliminaProcedimiento: boolean = false
  public descripProcedimiento!: string;
  public departProcedimiento!: string;
  public siaProcedimiento!: string;
  public materia!: any;
  public modalidad!: any;
  public idProcedi!: any;
  public siglas!: any;



  public usuarioTareaDescrip!: any;

  public veoBorrarTarea: boolean = false;
  public usuarioTarea!: any;
  public idPermisoProcedimiento!: any;

  /**
   * Maneja el click en una fila del grid de permisos
   * Selecciona la fila y carga los datos del permiso
   */
  public idpermisosPermi(event: any) {
    GridRadioSelector.handleRowClick(event, 'Permisos', (rowData) => {
      // Lógica específica del permiso
      this.veoBorrarTarea = true;
      this.usuarioTareaDescrip = this.usuarioTarea = rowData.usuario;
      this.idPermisoProcedimiento = rowData.id;

      console.log(`usuario de tarea: ${this.usuarioTarea}`);
      this.nuevojqx(this.idPermisoProcedimiento);
    });
  }


  public atrasCrearPermisoProcedi() {
    this.botonNuevoPermiso = true;
    this.creapermisoprocedi = new CreaPermisoProcedi();
    // Limpiar errores del formulario
    const form = document.getElementById('formNuevoPermiso') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
    }
  }

  /**
   * Limpia los errores visuales del formulario
   */
  public limpiarErrores(): void {
    const form = document.getElementById('formNuevoProcedimiento') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }


  public validateAndCreateProcedimiento(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      event.preventDefault();
      return;
    }

    // Validar longitud de siglas
    if (this.crearprocedi.siglas && this.crearprocedi.siglas.length > 5) {
      this.notificationService.error('El campo Siglas debe tener máximo 5 caracteres.');
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.create(this.crearprocedi.descripcion, this.crearprocedi.codigoSia, this.crearprocedi.depart, this.crearprocedi.siglas);
  }

  public create(descrip: string, sia: string, depart: string, siglas: string): void {
    this.procedimientoService.create(this.crearprocedi).subscribe({
      next: (response) => {
        if (response.id) {
          this.notificationService.saveSuccess('Procedimiento');
          this.limpiarErrores();
          this.refrescaProcedimientos();
          
          // Cerrar el modal usando el servicio
          this.modalManagerService.closeModal('NprocediModal');
          
          // Forzar recarga de la página después de 1 segundo
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      },
      error: (err) => {
        if (err.status == 403) {
          this.notificationService.error(err.error.message);
        } else {
          this.notificationService.error('Error al crear el procedimiento');
        }
        
        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('NprocediModal');
      },
    });
  }

  public deleteProcedimiento(dato: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Eliminar Procedimiento",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedimientoService.deleteProcedimiento(dato).subscribe({
          next: (response) => {
            this.notificationService.deleteSuccess('Procedimiento');
            this.refrescaProcedimientos();
            
            // Forzar recarga de la página después de 1 segundo si el grid no se actualiza
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error: (err: HttpErrorResponse) => {
            this.notificationService.error(err.error.message);
            this.refrescaProcedimientos();
          }
        });
      }
    })
  }


  public abrirModalEditarTarea(event: any): void {
    const target = event.originalEvent?.target as HTMLElement;
    if (target && target.closest('input[type="radio"]')) {
      return;
    }
    this.envioTareaProcedi(event);
    this.modalService.openModal('modifitareasModalListado');
  }



  // PARA NUEVOS FILTROS JQX
  public columnrenderer = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }

  public cellsrenderer = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }

  public cellsrendererAcciones = (row, column, value) => {
    // Si el valor es null, undefined, vacío o -1, mostrar espacio en blanco
    if (value === null || value === undefined || value === '' || value === -1) {
      return '<div style="text-align: center; margin-top: 5px;">-</div>';
    }
    
    // Convertir a número para la comparación
    const valorNumerico = Number(value);
    
    // Buscar la acción en el array ACCIONES por su valor
    const accionEncontrada = ACCIONES.find(accion => accion.valor === valorNumerico);
    
    // Si se encuentra, se usa su descripción; de lo contrario, mostrar el valor original
    const label = accionEncontrada ? accionEncontrada.descripcion : value;
    
    return `<div style="text-align: center; margin-top: 5px; padding-left: 5px; padding-right: 5px;">${label}</div>`;
  };


  public cellsrendererPocediDescrip = function (row, column, value) {
    return '<div style="text-align: left; margin-top: 5px; padding-left: 10px;">' + value + '</div>';
  };

  public cellsrendererPocediCodigoSIA = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  };

  public cellsrendererPocediSiglas = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  };

  public cellsrendererPocediModalidad = function (row, column, value) {
    switch (value) {
      case 1:
        return '<div style="text-align: center; margin-top: 5px;">Presencial</div>';
      case 2:
        return '<div style="text-align: center; margin-top: 5px;">Web con certificado</div>';
      case 3:
        return '<div style="text-align: center; margin-top: 5px;">Web sin certificado</div>';
      case 4:
        return '<div style="text-align: center; margin-top: 5px;">Presencial y Web con certificado</div>';
      case 5:
        return '<div style="text-align: center; margin-top: 5px;">Presencial y Web sin certificado</div>';
      default:
        return '<div style="text-align: center; margin-top: 5px; color: #718096;">Sin Datos</div>';
    }
  }

  public cellsrendererPocediMateria = function (row, column, value) {
    switch (value) {
      case 1:
        return '<div style="text-align: center; margin-top: 5px;">SIN MATERIA</div>';
      case 2:
        return '<div style="text-align: center; margin-top: 5px;">RECAUDACIÓN</div>';
      case 3:
        return '<div style="text-align: center; margin-top: 5px;">URBANISMO</div>';
      default:
        return '<div style="text-align: center; margin-top: 5px; color: #718096;">Sin Datos</div>';
    }
  }

  public cellsrendererTarea = function (row, column, value) {
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  };

  public cellsrendererTareaDescrip = function (row, column, value) {
    return '<div style="text-align: left; margin-top: 5px; padding-left: 10px;">' + value + '</div>';
  };


  // ============================================
  // RENDERERS DE RADIO BUTTONS PARA GRIDS
  // ============================================
  public columnseleccion = GridRadioSelector.createRadioRenderer('Procedimientos', 'Selecciona Procedimiento');
  public columnseleccionPermiso = GridRadioSelector.createRadioRenderer('Permisos', 'Selecciona Permiso');
  public columnseleccionTarea = GridRadioSelector.createRadioRenderer('Tareas', 'Selecciona Tarea', true);
  public columnseleccionAtributos = GridRadioSelector.createRadioRenderer('Atributos', 'Selecciona Atributo');

  public cellsrendererPermi = function (row, column, value) {
    return '<div style="text-align: left; margin-top: 5px; padding-left: 10px;">' + value + '</div>';
  }

  public cellsrendererAtributos = function (row, column, value) {
    return '<div style="text-align: left; margin-top: 5px; padding-left: 10px;">' + value + '</div>';
  };

  public cellsrendererAtributosRequerido = function (row, column, value) {
    if (value == 1) {
      value = "SI"
    } else if (value == 0) {
      value = "NO"
    }
    return '<div style="text-align: center; margin-top: 5px;">' + value + '</div>';
  }

  // Listado de Procedimientos del Departamento
  columnsPro = [
    { text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer },
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    {
      text: 'Descripción',
      width: '45%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererPocediDescrip,
      renderer: this.columnrenderer
    },
    {
      text: 'Código SIA',
      width: '12%',
      datafield: 'codigoSia',
      cellsrenderer: this.cellsrendererPocediCodigoSIA,
      renderer: this.columnrenderer
    },
    {
      text: 'Siglas',
      width: '8%',
      datafield: 'siglas',
      cellsrenderer: this.cellsrendererPocediSiglas,
      renderer: this.columnrenderer
    },
    {
      text: 'Modalidad',
      width: '20%',
      datafield: 'modalidad',
      cellsrenderer: this.cellsrendererPocediModalidad,
      renderer: this.columnrenderer
    },
    {
      text: 'Materia',
      width: '12%',
      datafield: 'idMatProce',
      cellsrenderer: this.cellsrendererPocediMateria,
      renderer: this.columnrenderer
    },
    {
      text: 'Departamento',
      datafield: 'desEleme',
      cellsrenderer: this.cellsrendererPocediDescrip,
      renderer: this.columnrenderer,
      hidden: true
    },
  ];

  public localizationObject: any = jqxGrid_ES;
  public sourcePro = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'descripcion', type: 'string' },
      { name: 'desEleme', type: 'string' },
      { name: 'codigoSia', type: 'string' },
      { name: 'idMatProce', type: 'string' },
      { name: 'modalidad', type: 'string' },
      { name: 'siglas', type: 'string' },
      { name: 'id', type: 'any' }
    ],
    url: `${environment.apiUrl}procedimiento/listar/${this.idOrgElemen}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc'
  });

  columnsTarea = [
    { text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccionTarea, renderer: this.columnrenderer },
    { text: 'id', datafield: 'id', width: 10, hidden: true },
    { text: 'procesoFirmadoDefecto', datafield: 'procesoFirmadoDefecto', width: 10, hidden: true },
    { text: 'plantillaDefecto', datafield: 'plantillaDefecto', width: 10, hidden: true },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      width: '40%',
      cellsrenderer: this.cellsrendererTareaDescrip,
      renderer: this.columnrenderer
    },
    {
      text: 'Acciones',
      datafield: 'accion',
      width: '35%',
      cellsrenderer: this.cellsrendererAcciones,
      renderer: this.columnrenderer
    },
    {
      text: 'Fase',
      datafield: 'faseTarea',
      width: '15%',
      cellsrenderer: this.cellsrendererTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Plazo',
      datafield: 'plazo',
      width: '9%',
      cellsrenderer: this.cellsrendererTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Tipo plazo',
      datafield: 'tipoPlazo',
      width: '11%',
      cellsrenderer: this.cellsrendererTarea,
      renderer: this.columnrenderer
    },
  ];

  public sourceTarea: any = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'descripcion', type: 'string' },
      { name: 'faseTarea', type: 'string' },
      { name: 'plazo', type: 'string' },
      { name: 'tipoPlazo', type: 'string' },
      { name: 'id', type: 'any' },
      { name: 'plantillaDefecto', type: 'any' },
      { name: 'procesoFirmadoDefecto', type: 'any' },
      { name: 'accion', type: 'any' }
    ],
    url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idprocedi,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc'
  });


  columnsPermi = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccionPermiso, renderer: this.columnrenderer },
    { 
      text: 'Usuario', 
      datafield: 'usuario', 
      width: '15%',
      cellsrenderer: this.cellsrendererPermi, 
      renderer: this.columnrenderer 
    },
    {
      text: 'Procedimiento',
      datafield: 'desProce',
      width: '45%',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrenderer
    },
    { 
      text: 'Tarea', 
      datafield: 'desTareaProce', 
      width: '45%',
      cellsrenderer: this.cellsrendererPermi, 
      renderer: this.columnrenderer 
    },
    { text: 'Descripción', datafield: "descripcion", renderer: this.columnrenderer, hidden: true },
  ];
  refresco: any = this._location.getState();


  public sourcePermi: any = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'usuario' },
      { name: 'desProce' },
      { name: 'desTareaProce' },
      { name: 'descripcion' },
      { name: 'id' }
    ],
    url: `${environment.apiUrl}permiso/listar/${this.idpermis}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc'
  });

  // Métodos para gestión de tareas
  public lanzaSourceTarea(): void {
    this.sourceTarea = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'descripcion', type: 'string' },
        { name: 'faseTarea', type: 'string' },
        { name: 'plazo', type: 'string' },
        { name: 'tipoPlazo', type: 'string' },
        { name: 'id', type: 'any' },
        { name: 'plantillaDefecto', type: 'any' },
        { name: 'procesoFirmadoDefecto', type: 'any' },
        { name: 'accion', type: 'any' }
      ],
      url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idprocedi,
      id: 'id'
    });
  }


  nuevojqx(idpermis: any) {
    const columnsPermi = [
      { text: 'id', datafield: 'id', width: '1%', hidden: true },
      { text: 'Usuario', datafield: 'usuario', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
      { text: 'Procedimiento', datafield: 'desProce', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
      { text: 'Tarea', datafield: 'desTareaProce', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    ];
  }


  columnsAtributos = [
    { text: 'idGrupo', datafield: 'idGrupo', width: '1%', hidden: true },
    { text: 'idAtrib', datafield: 'idAtrib', width: '1%', hidden: true },
    { text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccionAtributos, renderer: this.columnrenderer },
    {
      text: 'Etiqueta',
      width: '15%',
      datafield: 'etiGruAtrib',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      width: '28%',
      datafield: 'desGruAtrib',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Requerido',
      width: '8%',
      datafield: "requerido",
      cellsrenderer: this.cellsrendererAtributosRequerido,
      renderer: this.columnrenderer
    },
    {
      text: 'Val.Inici',
      width: '10%',
      datafield: 'valInici',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Val.Minim',
      width: '10%',
      datafield: 'valMinim',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Val.Maxim',
      width: '10%',
      datafield: 'valMaxim',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Tipo',
      width: '10%',
      datafield: 'tipo',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
    {
      text: 'Longitud',
      width: '8%',
      datafield: 'longitud',
      cellsrenderer: this.cellsrendererAtributos,
      renderer: this.columnrenderer
    },
  ];


  public sourceAtributos: any = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'etiGruAtrib' },
      { name: 'desGruAtrib' },
      { name: 'requerido' },
      { name: 'valInici' },
      { name: 'valMinim' },
      { name: 'valMaxim' },
      { name: 'tipo' },
      { name: 'longitud' },
      { name: 'idAtrib' },
      { name: 'idGrupo' }
    ],
    url: `${environment.apiUrl}metadatoGrupoAtrib/listarPorProc/${this.idprocedi}`,
    id: 'idAtrib'
  });


  public actualizaSourceAtributo(idprocedimiento: any): void {
    this.sourceAtributos = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'etiGruAtrib' },
        { name: 'desGruAtrib' },
        { name: 'requerido' },
        { name: 'valInici' },
        { name: 'valMinim' },
        { name: 'valMaxim' },
        { name: 'tipo' },
        { name: 'longitud' },
        { name: 'idAtrib' },
        { name: 'idGrupo' }
      ],
      url: `${environment.apiUrl}metadatoGrupoAtrib/listarPorProc/${idprocedimiento}?_t=${Date.now()}`,
      id: 'idAtrib',
      sortcolumn: 'idAtrib',
      sortdirection: 'desc'
    });

    // Forzar actualización del grid
    setTimeout(() => {
      if (this.gridAtributos) {
        this.gridAtributos.refresh();
        this.gridAtributos.updatebounddata();
      }
    }, 200);
  }

  public deletePermisoProcedimiento() {
    console.log('RESULTADO DE ID PERMISOS PROCEDIMIENTOS : ' + this.idPermisoProcedimiento);


    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar Permiso a : " + this.usuarioTarea,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedimientoService.deletePermisoProcedimiento(this.idPermisoProcedimiento).subscribe(response => {

          this.respuestahttp = response;//
          this.veoBorrarTarea = false;
          console.log(`RESPUESTA body : ${this.headers} `);


          this.sourcePermi = ({
            dataType: 'json',
            dataFields: [
              { name: 'usuario' },
              { name: 'desProce' },
              { name: "desTareaProce" },
              { name: 'id' },
            ],
            url: `${environment.apiUrl}permiso/listar/${this.idtrigger}`,
            id: 'id',
          });
        }
        );
        let resulta = JSON.stringify(this.respuesta.headers);

        console.log(`MAS DATOS :  ${resulta}`)
        let statusCode = this.respuesta.body;
        if (this.respuesta.status == 200) {

          Swal.fire('Permiso Eliminado!', '', 'success')
        } else {
          Swal.fire('No se pudo eliminar el Permiso!', '', 'info')
        }
      }
    })
  }

  firmalistar!: FirmaListar[];
  plantillatarea!: PlantillaTarea[];


  public getFirma(plantilla: string): Observable<FirmaListar[]> {
    const url = `${environment.apiUrl}procesoFirmado/listar/${plantilla}`;
    return this.http.get(url).pipe(map(response => response as FirmaListar[]));
  }

  public tpsinfirma: boolean = true;
  public veoPermiso: boolean = false;
  public veoAtributos: boolean = false; // Controla la visibilidad de la sección de atributos
  public accionDescripcion: string;

  // Método que prepara la acción seleccionada en el select
  preparoAccion(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const accion = selectElement.value;
    console.log('Acción seleccionada:', accion);

    // Buscar la descripción en ACCIONES usando el valor numérico
    const accionEncontrada = ACCIONES.find(a => a.valor === Number(accion));
    if (accionEncontrada) {
      this.accionDescripcion = accionEncontrada.descripcion;
    } else {
      this.accionDescripcion = "ACCIÓN NO RECONOCIDA";
    }
    console.log(`PREPARANDO ACCIÓN: ${accion} --> ${this.accionDescripcion}`);

  }




  ////-------------------------------------------------------------------

  public peparadatosfirma(plantilla: string): void {
    if (plantilla === "SINPLANTILLA") {
      plantilla = this.plantillatarea[0].plantilla;
      this.tpsinfirma = false;
    } else {
      this.tpsinfirma = true;
    }
    this.getFirma(plantilla).subscribe({
      next: firmalistar => {
        this.firmalistar = firmalistar;
        // Asignar automáticamente la primera firma disponible
        if (this.firmalistar && this.firmalistar.length > 0) {
          this.creatareaprocedi.firmapordefecto = this.firmalistar[0].procesoFirmadoDefecto;
        }
      },
      error: error => console.error("Error obteniendo firmas:", error)
    });
    console.log(`EJECUTANDO peparadatosfirma: ${plantilla}`);
  }


  public validateAndEditTarea(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la edición
    this.editaTareaProcedim();
  }

  public editaTareaProcedim(): void {
    this.procedimientoService.editaTareaProcedimiento(this.editatareaprocedi, this.idverTarea)
      .subscribe({
        next: () => {
          this.notificationService.saveSuccess('Tarea');
          
          // Cerrar el modal usando el servicio
          this.modalManagerService.closeModal('modifitareasModalListado');
          
          this.lanzaSourceTarea();
          this.editatareaprocedi = new EditaTareaProcedi();
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message || 'No se pudo editar la tarea.');
          
          // Mantener el modal abierto en caso de error
          this.modalManagerService.keepModalOpen('modifitareasModalListado');
        }
      });
  }

  public getListaTareas(idproce: any): void {
    this.procedimientoService.getTareaProcedimiento(idproce).subscribe(
      listatareaprocedi => this.listatareaprocedi = listatareaprocedi
    );
  }

  listatareaprocedi!: ListaTareaProcedi[];

  // CREAR NUEVA TAREA PROCEDIMIENTO
  public verListProcedi: boolean = true;
  public httpHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );
  public creatareaprocedi: CreaTareaProcedi = new CreaTareaProcedi();
  public tareaprocedicreada: any = new TareaProcediCreada;

  public borravaloresNuevaTarea(): void {
    this.creatareaprocedi = new CreaTareaProcedi();
    this.firmalistar = [];
    this.tpsinfirma = true; // Resetear la visibilidad del campo firma
    console.log("Valores de nueva tarea borrados");
    // Limpiar errores del formulario
    const form = document.getElementById('formNuevaTarea') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }

  public limpiarErroresModificarTarea(): void {
    const form = document.getElementById('formModificarTarea') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
    }
  }

  public limpiarErroresEditarProcedimiento(): void {
    const form = document.getElementById('formEditarProcedimiento') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }

  public limpiarErroresAlAbrirModal(): void {
    // El servicio ModalManagerService se encarga de limpiar los errores automáticamente
    // Este método se mantiene por compatibilidad con los event listeners existentes
  }

  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  /**
   * Método para limpiar todos los formularios de modales
   */
  private limpiarTodosLosFormularios(): void {
    const formIds = [
      'formNuevoProcedimiento',
      'formEditarProcedimiento',
      'formNuevoPermiso',
      'formEditarAtributos',
      'formNuevosAtributos',
      'formModificarTarea',
      'formNuevaTarea'
    ];
    
    formIds.forEach(formId => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        form.reset();
      }
    });
  }





  public onRowDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos de la tarea para edición
      this.accionTarea = rowData.accion;
      this.plantillaT = rowData.plantillaDefecto || "Sin plantilla";
      this.idverTarea = rowData.id;
      this.idtrigger = rowData.id;
      this.descripcionT = rowData.descripcion;
      this.faseT = rowData.faseTarea;
      this.plazot = rowData.plazo;
      this.tipoPlazoT = rowData.tipoPlazo;
      this.firmaT = rowData.procesoFirmadoDefecto;

      // Cargar datos en el objeto de edición
      this.editatareaprocedi.descripcion = rowData.descripcion;
      this.editatareaprocedi.faseTarea = rowData.faseTarea;
      this.editatareaprocedi.plazo = rowData.plazo;
      this.editatareaprocedi.tipoPlazo = rowData.tipoPlazo;
      this.editatareaprocedi.plantillaDefecto = rowData.plantillaDefecto;
      this.editatareaprocedi.acciones = rowData.accion;

      // Preparar datos de firma si hay plantilla
      if (rowData.plantillaDefecto) {
        this.peparadatosfirma(rowData.plantillaDefecto);
      }

      // Abrir modal de edición
      const modalEl = document.getElementById('modifitareasModalListado');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('No encontré el elemento #modifitareasModalListado');
      }
    });
  }

  /**
   * Maneja el doble click en la tabla de procedimientos
   * Abre el modal de edición del procedimiento
   */
  public onProcedimientoDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos del procedimiento para edición
      this.editarprocedi.id = rowData.id;
      this.editarprocedi.descripcion = rowData.descripcion;
      this.editarprocedi.codigoSia = rowData.codigoSia;
      this.editarprocedi.modalidad = rowData.modalidad;
      this.editarprocedi.materia = rowData.idMatProce;

      // Abrir modal de edición
      const modalEl = document.getElementById('editarProcedimientoModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('No se encontró el modal de edición de procedimiento');
      }
    });
  }

  /**
   * Maneja el doble click en la tabla de atributos
   * Abre el modal de edición de atributos
   */
  public onAtributoDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos del atributo para edición
      this.veoborraratributo = true;
      this.EtiquetaatributosActual = rowData.etiGruAtrib;
      this.Requerido = rowData.requerido;
      this.idAtrib = rowData.idAtrib;
      this.idGrupo = rowData.idGrupo;
      this.atributoscrear.idAtrib = rowData.idAtrib;
      this.etiGruAtrib = rowData.etiGruAtrib;
      this.atributoscrear.desGruAtrib = rowData.desGruAtrib;
      this.atributoscrear.valInici = rowData.valInici;
      this.atributoscrear.valMinim = rowData.valMinim;
      this.atributoscrear.valMaxim = rowData.valMaxim;
      this.atributoscrear.longitud = rowData.longitud;

      // Abrir modal de edición
      const modalEl = document.getElementById('EditoAtributosModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('No se encontró el modal de edición de atributos');
      }
    });
  }

  public validateAndCreateTarea(event: Event): void {
    if (!this.idprocedi) {
      this.notificationService.error('No se puede crear una tarea sin un ID de procedimiento válido.');
      return;
    }

    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.classList.add('was-validated');
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.createTareaProcedi(this.idprocedi);
  }

  public createTareaProcedi(procedimientoId: number): void {
    this.creatareaprocedi.acciones = this.creatareaprocedi.acciones || this.acciondefecto;
    this.creatareaprocedi.plazo = this.creatareaprocedi.tipoplazo === "SINPLAZO" ? 0 : this.creatareaprocedi.plazo;

    this.procedimientoService.createTareaProcedi(this.creatareaprocedi, procedimientoId)
      .subscribe({
        next: response => {
          this.tareaprocedicreada = response;
          this.notificationService.saveSuccess('Tarea');
          
          // Cerrar el modal usando el servicio
          this.modalManagerService.closeModal('tareasModal');
          
          this.lanzaSourceTarea();
          
          // Limpiar el formulario después de cerrar
          this.borravaloresNuevaTarea();
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message || 'No se pudo crear la tarea.');
          
          // Mantener el modal abierto en caso de error
          this.modalManagerService.keepModalOpen('tareasModal');
        }
      });
  }

}
