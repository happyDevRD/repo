import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import {
  ArchivoFirmadoEF,
  ArchivoFirmantes,
  ConsultaDni,
  CrearGenerarSalida,
  CrearInteresado,
  CrearMensaje,
  CrearNotificacion,
  CrearTablonAnuncio,
  CrearTareaTramiteExp,
  CrearTramiteExp,
  EditarTramiteExp,
  EditExpediente,
  InsertaBolsaCrear,
  LeerNotificacion,
  ListarInteresados,
  ListarTramites,
  ModeloTeuCrear,
  ModeloTeuListar,
  MotivoNotificacionesListar,
  NotificadorListar,
  ReceptorNotifiListar,
  RepresentanteExpLIstar,
  TareaTramiteExpedienteCrear,
  TareaTramiteExpedienteEditar,
  TareaTramiteExpedienteListar,
  TemaDocumentoListar,
  TramiteExpListar,
  VerExpediente,
  VerMetadatos
} from './expedientes';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'
import { ExpedientesService } from './expedientes.service';
import { FormBuilder } from '@angular/forms';
import { ProcediPermisos, ProcediPermisosListar } from '../procedimientos/procedimiento';
import { ProcedimientoService } from '../procedimientos/procedimiento.service';
import { catchError, finalize, map, Observable, of, Subscriber, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { MUNICIO, PROVIN, TIPO_BAJA } from "../core/constants/datos";
import { TareaProcedimientoDTO } from "../core/models/tarea-procedimiento.dto";
import { ACCIONES } from "../core/helper/tarea-acciones";
import * as bootstrap from "bootstrap";
import { Modal } from "bootstrap";
import { TipoObjetoTributarioDto } from "../core/models/tipo-objeto-tributario.dto";
import {
  botonesPorEstadoNotificacion,
  resolverEstadoNotificacion
} from './notificaciones/notificacion-estado.helper';
import { EnvioNotificaInfo } from './notificaciones/notificaciones-notifica-panel.component';
import { NotificacionesService } from "./services/notificaciones.service";
import { ReciboCabeceraDto } from "../core/models/recibo-cabecera.dto";
import { tap } from "rxjs/operators";
import { TareaTramiteExpedienteVer } from '../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';
import { ObjetoTributarioDto } from '../core/models/objeto-tributario.dto';
import { TramitesService } from "./tramites.service";
import { TramiteExpedienteDto } from "../core/models/tramite-expediente.dto";
import { InteresadoListarDto } from '../core/dto/interesado.dto';
import { TablaClickHandler } from '../core/helper/tabla-click-handler';
import { GridRadioSelector } from '../core/helper/grid-radio-selector';
import { NotificationService } from '../core/service/notification.service';
import { ModalManagerService } from '../core/service/modal-manager.service';
import { ModalService } from '../core/service/modal.service';

class Pais {
  codPais: any;
  desPais: string;
  sigLarga: string;
  sigCorta: string;
  uniEurop: any;
  usuContr: string;
  fecContr: string

}

class Habitantes {
  nombre: any;
  particula1: any;
  apellido1: any;
  particula2: any;
  apellido2: any;
  tipDocum: any;
  numDocum: any;
  domicilio: any;
  distrito: any;
  seccion: any;
  numHojPadro: any;
  numFamil: any;
  numOrden: any;
  fecNacim: any;
  proNacim: any;
  munNacim: any;
  situacion: any;
  fecSituacion: any;
  telefono: any;
  email: any;
  observaciones: any;
  fecPadro: any;

}

class Vehiculo {
  desPerEntid: any;
  numDocum: any;
  domicilio: any;
  cp: any;
  provincia: any;
  municipio: any;
  matricula: any;
  bastidor: any;
  tipoVehiculo: any;
  marca: any;
  modelo: any;

}

class PersonaEntidad {
  usuContr: any;
  idPerso: any;
  idHisPerso: any;
  numDocum: any;
  tipPerso: any;
  nombre: string;
  particula1: any;
  apellido1: string;
  particula2: any;
  apellido2: string;
  razSocia: string;
  razSocReduc: string;
  desPerEntid: string;
  localidad: string;
  codPosta: any;
  dirPosta: string;
  municipio: string;
  provincia: string;
  codMunic: any;
  codProvi: any;
  email: string;
  telFijo: string;
  telMovil: string;


}

class ListaTareaProcedi {
  id!: number;
  procedimiento!: number;
  descripcion!: string;
  faseTarea!: string;
  plazo!: number;
  tipoPlazo!: string;
  tareaAutomatica!: boolean;
  plantillaDefectoModulo!: number
  plantillaDefecto!: string;
  procesoFirmadoDefecto!: number;
  usuContr!: string;

}

class RespuestasHttp {
  error!: any;
  headers!: any;
  status!: number;
  statusText!: string;
  url!: string;
}

@Component({
  selector: 'app-edita-expediente',
  templateUrl: './edita-expediente.component.html',
  styleUrls: ['./edita-expediente.component.css']
})
export class EditaExpedienteComponent implements OnInit {

  public provin = PROVIN;
  public municio = MUNICIO;
  public TipoBaja = TIPO_BAJA;
  public municifiltro: any[] = [];

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('gridNotificaciones') gridNotificaciones: any;
  @ViewChild('teuFormRef') teuFormRef: any;

  constructor(
    public _location: Location,
    public http: HttpClient,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public expedientesService: ExpedientesService,
    public procedimientoService: ProcedimientoService,
    public activatedRoute: ActivatedRoute,
    private notificacionesService: NotificacionesService,
    private tramitesService: TramitesService,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    private modalService: ModalService
  ) {
    console.log('Constructor - creartramiteexp inicializado:', this.creartramiteexp);
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
    const formIds = [
      'formNuevaTarea',
      'formNuevoTramite',
      'formNuevaNotificacion',
      'formEditarTarea',
      'formEditarTramite',
      'formEditarNotificacion',
      'formGenerarSalida',
      'formInsertarBolsa',
      'formTEU'
    ];
    
    formIds.forEach(formId => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        form.reset();
      }
    });
  }

  /**
   * Método para limpiar errores de validación
   */
  public limpiarErrores(): void {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    const formElements = document.querySelectorAll('.form-control.is-invalid');
    formElements.forEach(element => {
      element.classList.remove('is-invalid');
    });
  }


  public httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public nuevotramite: boolean = false;
  public verformnuevatarea: boolean = false;
  public nuevotramitador: boolean = false;
  public verlistadotramitadores: boolean = false;
  public verasignatramite: boolean = false;
  public editExpedientes: boolean = false;
  public menuexpediente: boolean = false;
  public verlistadotareas: boolean = true;
  public verNuevaNotifi: boolean = false;
  public verEditartareatramite: boolean = false;
  public verborrarinteresado: boolean = false;
  public verojointeresado: boolean = true;
  public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  public user = sessionStorage.getItem('user');
  public soluser = sessionStorage.getItem('solUsuar');
  public trauser = sessionStorage.getItem('traUsuar');
  public idprocedi = sessionStorage.getItem('idprocedimiento');
  public tareatramiteexpedientever: any = new TareaTramiteExpedienteVer();
  public creartablonanuncio: CrearTablonAnuncio = new CrearTablonAnuncio();

  public temadocumentolistar: TemaDocumentoListar[];
  public tipoObjetoTributario: TipoObjetoTributarioDto[];

  public modeloteulistar: ModeloTeuListar[];
  public creanotificacion: CrearNotificacion = new CrearNotificacion();
  public creargenerarsalida: CrearGenerarSalida = new CrearGenerarSalida();
  public leernotificacion!: LeerNotificacion[];
  public vermetadatos: VerMetadatos = new VerMetadatos();
  public listatareaprocedi!: ListaTareaProcedi[];
  public listartramites!: ListarTramites[];
  public procedipermiso!: ProcediPermisos[];
  public pais!: Pais[];
  public modeloteucrear: ModeloTeuCrear = new ModeloTeuCrear()

  public procedipermisolistar!: ProcediPermisosListar[];
  public tareatramiteexpedientelistar!: TareaTramiteExpedienteListar[];
  public listarinteresados!: ListarInteresados[];
  public listarinteresadosdto!: InteresadoListarDto[];
  public receptornotifilistar!: ReceptorNotifiListar[];
  public motivonotificacioneslistar!: MotivoNotificacionesListar[];
  public notificadorlistar!: NotificadorListar[];


  public textoFormaNotif!: string;

  public tareaProcedimientoVer: TareaTramiteExpedienteVer = new TareaTramiteExpedienteVer();

  public notificacionver: any = {
    personaEntidad: {
      numDocum: '',
      desPerEntid: ''
    }
  };
  public consultadni: ConsultaDni = new ConsultaDni();
  public editexpediente: EditExpediente = new EditExpediente();
  public creartramiteexp: CrearTramiteExp = new CrearTramiteExp();
  public archivofirmadoef: ArchivoFirmadoEF = new ArchivoFirmadoEF();
  public archivofirmantes!: ArchivoFirmantes[];
  public crearmensaje: CrearMensaje = new CrearMensaje();
  public crearinteresado: CrearInteresado = new CrearInteresado();
  public tareatramiteexpedientecrear: TareaTramiteExpedienteCrear = new TareaTramiteExpedienteCrear();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public creartareatramiteexp: CrearTareaTramiteExp = new CrearTareaTramiteExp();
  public tareatramiteexpedienteeditar: TareaTramiteExpedienteEditar = new TareaTramiteExpedienteEditar();
  public editartramiteexp: EditarTramiteExp = new EditarTramiteExp();
  public insertabolsacrear: InsertaBolsaCrear = new InsertaBolsaCrear();

  public idTramitador!: number;
  public idTramite!: number;
  public idProcedimiento: number
  public numeroTramite!: number;
  public TramiteFase!: string;
  public idTarea!: number;
  public ejerNumExpedi!: any;
  public procediExp!: number;
  public tareaProcedi!: number;
  public numeroArchivo!: number;
  public descargaArchivo!: any;
  public fecha = new Date();
  public idInteresado!: number;
  public respuestahttp: any = new RespuestasHttp;
  public headers = new HttpResponse;
  public respuesta = new Response;
  public identificadorFicheroSubido!: number | undefined;
  public archivoSubidaEnProgreso: boolean = false;
  public idNotificacion!: number;
  public idhisperso!: number;
  public verGenerarSalida: boolean = false;
  public verInsertarBolsa: boolean = false;
  public identificadorGenerarSalida!: string;
  public opcionselect: string = "0";
  public desSituacion!: string;
  public selected = new Date();
  public ejercicio = new Date();
  public year: any = this.fecha.getFullYear();
  public atrasruta!: string;
  public AsignaT: string = "Asignar Tramitador";
  public dniok: boolean = false;
  public descargafichero!: any;
  public descargaficheroFirmado!: any;


  public verExpediente: any = new VerExpediente();
  public tramiteExpedienteListar!: TramiteExpedienteDto[];


  public percentDone!: number;
  public nomArchiv!: string;
  public uploadSuccess!: boolean;
  public url!: string;
  public archivoSubido!: any;
  public nombreArchivoSubido!: string;
  public base64EncodedString!: string;
  public filesToUpload!: Array<File>;
  fechaarchivo: Date = new Date();
  public descripcionArchivo!: string;
  public iddocumento!: number;
  public name!: string;
  public id!: number;
  public myimage!: Observable<any>;
  public base64code!: any;


  public IDModel!: number;
  public TextoLegal!: string;

  public paraTextoLegar() {

    for (let index = 0; index < this.modeloteulistar.length; index++) {
      const element = this.modeloteulistar[index].texLegal;

      if (this.modeloteulistar[index].idModel == this.IDModel || this.modeloteulistar[index].idModel == this.modeloteucrear.idModel) {
        this.modeloteucrear.texlegal = this.modeloteulistar[index].texLegal;
        this.TextoLegal = this.modeloteulistar[index].texLegal;
      }
    }
  }

  public xmlTeu: any;

  public verxml: boolean = false;

  public generaXml() {

  }

  public quitabotonesNotifi() {
    this.veoenviar = false;
    this.veoEnviarNotifica = false;
    this.veoSincronizarNotifica = false;
    this.veorecepcionar = false;
    this.veopublicar = false;
    this.veodevolver = false;
    this.veoanular = false;
    this.veoborrar = false;
    this.veoteu = false;
    this.veoReenviarTeu = false;
    this.mostrarBotonDescargaTEUPrincipal = false;
  }

  public xmlDescargado!: any;
  public descargoTEU: boolean = false;


  public descargaXml() {

    var blob = new Blob([this.xmlDescargado], { type: 'text/xml' });

    var url = URL.createObjectURL(blob);
    var urldescarga = window.URL.createObjectURL(blob);
    console.log("url" + urldescarga);

    var enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = 'TEU.xml';

    enlaceDescarga.click();


  }

  public verBolsaCrear() {
    this.verTareasdelTramite = false;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = false;
    this.verEditartareatramite = false;
    this.verNuevaNotifi = false;
    this.verGenerarSalida = false;
    this.verInsertarBolsa = true;

    console.log("INSERTA BOLSA CREAR!!!")


  }

  public solicitadni(dni: string) {
    this.formanotificacion = true;
    this.expedientesService.getDni(dni).subscribe(
      consultadni => this.consultadni = consultadni
    );
    console.log(dni);
    this.dniok = true;
  }


  public getTemaDocumentoListar() {
    this.expedientesService.getTemaDocumentoListar().subscribe(
      temadocumentolistar => this.temadocumentolistar = temadocumentolistar
    )
  }

  public getTramiteProcedimientoVer(idtareP: any) {
    this.procedimientoService.getTareaProcedimientoVer(idtareP).pipe(
      tap({
        next: (tareaProceDiver: TareaTramiteExpedienteVer) => {
          this.tareaProcedimientoVer = tareaProceDiver;
          console.log('Tarea Tramite Expediente Ver:', this.tareaProcedimientoVer);
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error en Tarea Procedimiento: ' + err.error.text);
        }
      })
    ).subscribe();
  }


  public fsistema: any = new Date().toLocaleDateString()
  public fechaSistema!: any;

  public FechaSistema() {
    console.log("FEcha Sistema : " + this.fsistema)
    let aniofenvio: string = this.fsistema.substring(6, 10);
    let mesfenvio: string = this.fsistema.substring(3, 5);
    let diafenvio: string = this.fsistema.substring(0, 2);
    let fechaordenadafenvio: any = aniofenvio + "-" + mesfenvio + "-" + diafenvio;
    this.fechaSistema = fechaordenadafenvio;
    this.creartramiteexp.fecTramite = fechaordenadafenvio
    this.tareatramiteexpedientecrear.fecInicio = fechaordenadafenvio;


    console.log("Fecha Sistema : " + this.fechaSistema)


  }

  introTObjTrubu: TipoObjetoTributarioDto;

  public getTipoObjetoTributario(): void {
    this.expedientesService.getTipoObjetoTributario().subscribe({
      next: (data: TipoObjetoTributarioDto[]) => {
        this.tipoObjetoTributario = data;
      },
      error: (error) => {
        console.error("Error al obtener la lista:", error);
      }
    });
  }

  private ntareatramiteModal: Modal;
  private generarEntradaModal: Modal;


  ngOnInit() {

    const ntareatramiteElement = document.getElementById('ntareatramiteModal');
    const generarEntradaElement = document.getElementById('GenerarEntradaModal');
    const nuevaTareaElement = document.getElementById('NuevaTareaTra');


    if (ntareatramiteElement) {
      this.ntareatramiteModal = new bootstrap.Modal(ntareatramiteElement);
    }
    if (generarEntradaElement) {
      this.generarEntradaModal = new bootstrap.Modal(generarEntradaElement);
    }

    console.log("[ngOnInit] Iniciando EditaExpedienteComponent...");
    console.log("[ngOnInit] Fecha sistema:", this.fsistema);
    this.FechaSistema();
    this.cargarExpediente();
    this.getListarTramites(this.idExpediente);
    this.listadodeNotificaciones();
    this.getTipoObjetoTributario();

    console.log("[ngOnInit] idExpediente:", this.idExpediente);
    console.log("[ngOnInit] verexpediente:", this.verExpediente);

    this.procedimientoService.getPermisoProcedi().subscribe(
      procedipermisos => {
        this.procedipermiso = procedipermisos;
        console.log("[ngOnInit] Permisos obtenidos:", procedipermisos);
      }
    );

    this.expedientesService.getPaises().subscribe(
      pais => {
        this.pais = pais;
        console.log("[ngOnInit] Países recibidos:", pais);
      }
    );

    this.expedientesService.getModeloTeuListar().subscribe(
      modeloteulistar => {
        this.modeloteulistar = modeloteulistar;
        console.log("[ngOnInit] Modelos TEU:", modeloteulistar);
      }
    );

    this.notificacionesService.getNotificacionListar(this.verExpediente.ejercicio, this.verExpediente.numero).subscribe(
      leerNotificacion => this.leernotificacion = leerNotificacion
    );

    (window as any).verNotificacion = (id: number) => this.verNotificacion(id);
    (window as any).editarNotificacion = (id: number) => this.editarNotificacion(id);

  }


  public limpiaInsertatBolsa() {
    this.insertabolsacrear = new InsertaBolsaCrear();
  }

  public clickAtrasBolsaCrear() {
    this.verInsertarBolsa = false;
    this.limpiaInsertatBolsa();
  }

  public crearInsertaBolsa() {
    this.insertabolsacrear.usuContr = this.usuContrl!;
    this.insertabolsacrear.idOrgEleme = this.idOrgElemen!;
    this.insertabolsacrear.refExped = this.ejerNumExpedi;
    this.insertabolsacrear.estado = 0;

    if (!this.insertabolsacrear.fecAlta || !this.insertabolsacrear.fecPrefe || !this.insertabolsacrear.fecMaxResol ||
      !this.insertabolsacrear.prioridad || !this.insertabolsacrear.tipSesion || !this.insertabolsacrear.tipPunto
    ) {
      this.notificationService.incompleteFields();
      return;
    } else {
      if (!this.numeroArchivo) {
        this.notificationService.error('Esta tarea no tiene archivo asociado por lo que no se puede generar la propuesta.');
        return;
      } else {
        this.expedientesService.crearInsertaBolsa(this.insertabolsacrear, this.verExpediente.personaEntidad.idPerso, this.verExpediente.personaEntidad.idHisPerso, this.numeroArchivo, this.idTarea)
          .subscribe(response => {

            this.respuestahttp = response;
            console.log(`RESPUESTA body : ${response} `);
            if (response == null) {
              this.notificationService.saveSuccess('Propuesta de resolución');
              this.limpiaInsertatBolsa();

              this.verTareasdelTramite = true;
              this.verInsertarBolsa = false;
              this.refrescoSourceTareasTramite(this.idTramite);
            }
          },

            (response: HttpErrorResponse) => {
              this.identificadorGenerarSalida = response.error.text;
              let error: boolean = true;

              if (response.status == 500) {
                error = false;
                this.notificationService.error('No se ha generado la propuesta de resolución.');
                this.limpiaInsertatBolsa();
              }
              if (error) {
                this.notificationService.saveSuccess('Propuesta de resolución');
                this.limpiaInsertatBolsa();
              }
            }
          );
      }
    }
  }

  public limpiaGenerarSalida() {
    this.creargenerarsalida = new CrearGenerarSalida();
    this.temadocumentolistar = new TemaDocumentoListar[0];

  }

  public crearGenerarSalidaLogica() {
    if (this.creargenerarsalida.codTema || this.creargenerarsalida.extracto || this.creargenerarsalida.observaciones) {
      this.expedientesService.crearGenerarSalida(this.creargenerarsalida, this.verExpediente.personaEntidad.idPerso, this.verExpediente.personaEntidad.idHisPerso, this.numeroArchivo, this.idTarea)
        .subscribe(response => {
        },
          (err: HttpErrorResponse) => {
            this.identificadorGenerarSalida = err.error.text;
            console.log("error Status : " + err.status);
            console.log('ERROR: DEL SUSCRIBE ' + err.error.message);
            console.log('identificadorGenerarSalida ' + err.error.text);

            if (err.status == 201) {
              this.notificationService.saveSuccess(`Registro de salida: ${this.identificadorGenerarSalida}`);

              this.sourceTareasTramite = new jqx.dataAdapter({
                dataType: 'json',
                dataFields: [
                  { name: 'numero', type: 'number' },
                  { name: 'descripcion', type: 'string' },
                  { name: 'fecInicio', type: 'string' },
                  { name: "fecFin", type: 'string' },
                  { name: "propuestaResolucion", type: 'string' },
                  { name: "usuario", type: 'string' },
                  { name: "firmado", type: 'string' },
                  { name: "fecPlazo", type: 'string' },
                  { name: "color", type: 'string' },
                  { name: "archivo", type: 'string' },
                  { name: 'tareaProcedimiento', type: 'any' },
                  { name: 'id', type: 'any' },
                  { name: 'tipAnexo', type: 'any' },
                  { name: 'docAport', type: 'any' },
                  { name: 'tipDocEni', type: 'any' },
                  { name: 'documentacion', type: 'any' },
                  { name: 'visible', type: 'any' },
                  { name: 'visible', type: 'any' },
                  { name: 'numRegis', type: 'any' },
                  { name: 'idHisDocum', type: 'any' },
                  { name: 'ejeNumNotif', type: 'any' },
                  { name: 'nombreArchivo', type: 'any' },
                  { name: 'idAnunc', type: 'any' },
                ],
                url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
                id: 'id',
                sortcolumn: 'numero',
                sortdirection: 'desc'
              });
            }
          }
        )
    } else {
      Swal.fire(`Debe rellenar todos los campos obligatorios.`)
    }
    this.creargenerarsalida = new CrearGenerarSalida();
    this.temadocumentolistar = new TemaDocumentoListar[0];
  }

  public crearGenerarSalida(): any {

    this.creargenerarsalida.ejeExped = this.verExpediente.ejercicio;
    this.creargenerarsalida.numExped = this.verExpediente.numero;
    this.creargenerarsalida.usuContr = this.usuContrl!;

    if (this.nunRegisTarea) {
      if (this.nunRegisTarea) {
        Swal.fire({
          title: "Esta tarea ya tiene generada un registro de salida número : " + this.nunRegisTarea,
          text: "¿Quiere Generar uno nuevo?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',

        }).then((result) => {

          console.log("Se ha confirmado la acción!!!");
          this.crearGenerarSalidaLogica();
        })

      }
    } else {
      this.crearGenerarSalidaLogica();
    }
  }

  public crearInteresado() {

    this.crearinteresado.idHisPerso = this.consultadni.idHisPerso;
    this.crearinteresado.idPerso = this.consultadni.idPerso;
    this.crearinteresado.idexpediente = this.idExpediente;
    this.expedientesService.crearInteresado(this.crearinteresado).subscribe(response => this.router.navigate([`/editaexpediente/${this.idExpediente}`]),
      (error: HttpErrorResponse) => {
        console.error(`Errores al crear INTERESADO!!!! ${error.status}`);
        if (error.status != 500) {

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se a creado el interesado con exito!!!',
            showConfirmButton: false,
            timer: 1500
          })

        } else {

          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'No se pudo crear el nuevo interesado',
            showConfirmButton: false,
            timer: 2500
          })

        }

      }
    );

    setTimeout(this.recargarpagina, 1000);


  }

  public creaTramExp() {
    // Prevenir envíos múltiples
    if (this.enviandoTramite) {
      return;
    }

    this.creartramiteexp.idexpediente = this.idExpediente;

    // Validar campos obligatorios: descripción y fase
    if (!this.creartramiteexp.descripcion || !this.creartramiteexp.fase) {
      this.notificationService.incompleteFields();
      return;
    }

    // Validar longitud mínima de descripción
    if (this.creartramiteexp.descripcion.length < 1) {
      this.notificationService.error('La descripción debe tener al menos 1 carácter.');
      return;
    }

    // Validar longitud máxima de descripción
    if (this.creartramiteexp.descripcion.length > 500) {
      this.notificationService.error('La descripción no puede exceder los 500 caracteres.');
      return;
    }

    // Si no se especifica fecha, usar la fecha actual
    if (!this.creartramiteexp.fecTramite) {
      const today = new Date();
      this.creartramiteexp.fecTramite = today.toISOString().split('T')[0];
    }

    this.enviandoTramite = true;

    console.log("datos del select : " + this.selected)
    console.log("CREANDO TRAMITE : " + this.creartramiteexp.fecTramite);

    this.expedientesService.crearTramiteExp(this.creartramiteexp).subscribe({
      next: (response) => {
        this.enviandoTramite = false;
        this.notificationService.saveSuccess('Trámite');
        
        // Cerrar el modal usando el servicio
        this.modalManagerService.closeModal('NuevoTramiteModal');
        
        this.refrescoSourceTramite();
        this.limpiarFormularioTramite();
        this.nuevotramite = false;
        setTimeout(this.recargarpagina, 1000);
      },
      error: (error) => {
        this.enviandoTramite = false;
        console.error('Error al crear trámite:', error);

        let errorMessage = 'Ha ocurrido un error al crear el trámite.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 409) {
          errorMessage = 'Ya existe un trámite con estas características.';
        } else if (error.status === 400) {
          errorMessage = 'Los datos proporcionados no son válidos.';
        }

        this.notificationService.error(errorMessage);
        
        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('NuevoTramiteModal');
      }
    });
  }

  public verListadoTareasModal() {
    this.veoModifiDatosPerso = false;
    this.veoAcciones = false;
    this.verformnuevatarea = true;
    this.verTareasdelTramite = true;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = true;
    this.verEditartareatramite = false;
    this.borraDatosNuevaTarea()
    this.introValorConsulta = "";
  }

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

      this.envioArchivo();
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

  upload(event: any, id: number) {
    const file = event.target.files[0];
    const fichero = event.target.files[0];
    let name = event.target.files[0].name;
    // No sobrescribir la plantilla defecto aquí

    this.convertToBase64(file, name, id, fichero)
    this.archivoSubido = event;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      console.log(`DATOS EVENTO :  ${fichero}`);

      this.base64EncodedString = window.btoa(unescape(encodeURIComponent(event)));
      // console.log( `DATOS BASE64 :  ${this.base64EncodedString}` );
      console.log(`DATOS JSON :  ${formData}`);

      // Enviar archivo automáticamente después de convertirlo a base64
      setTimeout(() => {
        this.envioArchivo();
      }, 100); // Pequeño delay para asegurar que base64code esté listo
    }
  }


  // enviamos fichero en base64 una vez que lo adjuntamos al formulario html
  envioArchivo(callback?: () => void) {
    console.log('=== ENVIO ARCHIVO ===');
    console.log('Base64 disponible:', !!this.base64code);
    console.log('Nombre archivo:', this.name);

    if (!this.base64code || !this.name) {
      console.log('No hay archivo para enviar');
      if (callback) callback();
      return;
    }

    // Marcar que hay una subida en progreso
    this.archivoSubidaEnProgreso = true;

    try {
      this.uploadFile(this.base64code, this.name).subscribe({
        next: (response) => {
          console.log('=== RESPUESTA ENVIO ARCHIVO ===');
          console.log('Response completa:', response);
          console.log('ID del archivo:', response);

          this.identificadorFicheroSubido = response;
          this.tareatramiteexpedienteeditar.archivo = this.identificadorFicheroSubido;
          this.tareatramiteexpedientecrear.archivo = this.identificadorFicheroSubido;

          console.log('Archivo asignado correctamente:', this.identificadorFicheroSubido);

          // Marcar que la subida se completó exitosamente
          this.archivoSubidaEnProgreso = false;

          Swal.fire({
            icon: 'success',
            title: 'Archivo subido',
            text: `El archivo "${this.name}" se ha subido correctamente.`
          });

          // Ejecutar callback si existe
          if (callback) callback();
        },
        error: (error: HttpErrorResponse) => {
          console.log('=== ERROR ENVIO ARCHIVO ===');
          console.log('Error completo:', error);

          // Marcar que la subida falló
          this.archivoSubidaEnProgreso = false;

          let errorMessage = 'Error al subir el archivo';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'No hay conexión con el servidor';
          } else if (error.status === 413) {
            errorMessage = 'El archivo es demasiado grande';
          } else if (error.status === 400) {
            errorMessage = 'Formato de archivo no válido';
          }

          Swal.fire({
            icon: 'error',
            title: 'Error al subir archivo',
            text: errorMessage
          });

          // Ejecutar callback incluso en caso de error
          if (callback) callback();
        }
      });
    } catch (error) {
      console.log('Error en envioArchivo:', error);

      // Marcar que la subida falló
      this.archivoSubidaEnProgreso = false;

      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error inesperado al procesar el archivo'
      });

      // Ejecutar callback incluso en caso de error
      if (callback) callback();
    }
  }


  // subida de ficheros para nueva tareea
  uploadFile(formData: string, name: string): Observable<any> {

    let urlarchivocarga: string = `${environment.apiUrl}archivo/carga`;

    const datosArchivo = {
      usuContr: this.user || '',
      ejeExped: this.verExpediente?.ejercicio || null,
      numExped: this.verExpediente?.numero || null,
      sNomFiche: name || '',
      sFichero64: this.base64code || ''
    };

    console.log(`DATOS ENVIO ARCHIVO:`, datosArchivo);
    return this.http.post(urlarchivocarga, datosArchivo, { headers: this.httpHeaders });

  }

  public vertareas: boolean = true;

  public verNuevaTareaExp() {
    // Limpiar cualquier modal que pueda estar abierto
    this.cerrarModalNuevaTareaSeguro();

    // Limpiar variables de estado
    this.vertareas = false;
    this.verlistadotareas = false;
    this.nuevotramitador = false;
    this.verlistadotramitadores = false;
    this.verEditartareatramite = false;

    // Resetear el estado de acciones
    this.resetActionState();

    // Limpiar datos de la nueva tarea
    this.borraDatosNuevaTarea();

    // Asegurar que el body no tenga clases de modal
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
    }, 200);
  }

  public nuevaTareaExp() {

    console.log("Iniciando la creación de una nueva tarea para el trámite ID:", this.idTramite);

    // Verificar si hay una subida de archivo en progreso
    if (this.archivoSubidaEnProgreso) {
      this.notificationService.warning('Por favor, espera a que se complete la subida del archivo antes de crear la tarea.');
      return;
    }

    // Verificar si hay un archivo seleccionado pero no subido
    if (this.base64code && this.name && !this.identificadorFicheroSubido) {
      console.log('Hay archivo pendiente de subir, enviando primero...');

      // Mostrar mensaje de que se está subiendo el archivo
      this.notificationService.info('Se está subiendo el archivo. Por favor, espera...');

      this.envioArchivo(() => {
        // Este callback se ejecuta cuando se completa la subida del archivo
        // Solo crear la tarea si el archivo se subió exitosamente
        if (this.identificadorFicheroSubido) {
          this.crearTareaConArchivo();
        } else {
          this.notificationService.error('No se pudo crear la tarea porque el archivo no se subió correctamente.');
        }
      });
      return;
    }

    // Si no hay archivo seleccionado, proceder normalmente
    this.crearTareaConArchivo();
  }

  private crearTareaConArchivo() {
    // Validación final: si hay archivo seleccionado pero no subido, no permitir crear la tarea
    if (this.base64code && this.name && !this.identificadorFicheroSubido) {
      this.notificationService.error('El archivo seleccionado no se ha subido correctamente. Por favor, intenta subir el archivo nuevamente.');
      return;
    }

    // Asignar valores obligatorios
    this.tareatramiteexpedientecrear.tramite = this.idTramite;
    this.tareatramiteexpedientecrear.visible = true;
    this.tareatramiteexpedientecrear.fecContr = new Date();
    this.tareatramiteexpedientecrear.usuario = this.usuContrl || '';

    // Asignar archivo si existe
    if (this.identificadorFicheroSubido) {
      this.tareatramiteexpedientecrear.archivo = this.identificadorFicheroSubido;
      console.log('Archivo asignado:', this.identificadorFicheroSubido);
    } else {
      console.log('No hay archivo para asignar');
    }

    // Convertir campos string a números si es necesario
    if (typeof this.tareatramiteexpedientecrear.tareaProcedimiento === 'string') {
      this.tareatramiteexpedientecrear.tareaProcedimiento = parseInt(this.tareatramiteexpedientecrear.tareaProcedimiento);
    }

    // Validar plantilla defecto
    if (!this.plantillaDefecto || this.plantillaDefecto === 'null' || this.plantillaDefecto === 'undefined') {
      this.plantillaDefecto = null;
    }

    if (!this.tareatramiteexpedientecrear.descripcion || !this.tareatramiteexpedientecrear.fecInicio || !this.tareatramiteexpedientecrear.tareaProcedimiento) {
      this.notificationService.incompleteFields();
      return;
    }

    console.log('Datos de la tarea a enviar:', this.tareatramiteexpedientecrear);
    console.log('Plantilla defecto:', this.plantillaDefecto);

    this.expedientesService.crearTareaTramiteExpedientes(this.tareatramiteexpedientecrear, this.plantillaDefecto).subscribe({
      next: (response) => {
        this.notificationService.saveSuccess('Tarea');
        this.modalManagerService.closeModal('NuevaTareaTra');

        // Limpiar variables de estado
        this.veoModifiDatosPerso = false;
        this.introValorConsulta = "";
        this.disabledArchivoTareaTramite = false;
        this.veoTipoObjetoTributario = false;
        this.verformnuevatarea = false;
        this.veoBajaHabitante = false;
        this.vertareas = true;
        this.veoAcciones = false;

        // Limpiar archivo
        if (this.fileInput?.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }

        // Refrescar la lista de tareas
        this.refrescoSourceTareasTramite(this.idTramite);
        this.borraDatosNuevaTarea();
      },

      error: (err: HttpErrorResponse) => {
        // --- MANEJO DE ERRORES ---
        let errorMessage = 'Ocurrió un error inesperado al guardar la tarea.';
        if (err.status === 400) {
          errorMessage = 'Datos inválidos. Por favor, revisa la información ingresada.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.notificationService.error(errorMessage);
        this.modalManagerService.keepModalOpen('NuevaTareaTra');
      }
    });
  }

  /**
   * Método para cerrar el modal de nueva tarea de manera segura
   */
  public cerrarModalNuevaTareaSeguro() {
    // Limpiar el estado antes de cerrar
    this.limpiarEstadoModalNuevaTarea();

    try {
      // Método 1: Usar Bootstrap Modal API para el modal NuevaTareaTra
      const modalElement = document.getElementById('NuevaTareaTra');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // Si no hay instancia, crear una nueva y ocultarla
          const newModal = new bootstrap.Modal(modalElement);
          newModal.hide();
        }
      }

      // Método 2: Usar Bootstrap Modal API para el modal ntareatramiteModal
      const modalElement2 = document.getElementById('ntareatramiteModal');
      if (modalElement2) {
        const modalInstance2 = bootstrap.Modal.getInstance(modalElement2);
        if (modalInstance2) {
          modalInstance2.hide();
        } else {
          const newModal2 = new bootstrap.Modal(modalElement2);
          newModal2.hide();
        }
      }

      // Método 3: Limpiar manualmente todos los backdrops y clases
      setTimeout(() => {
        // Eliminar todos los backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
          backdrop.remove();
        });

        // Remover clases del body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');

        // Ocultar forzadamente todos los modales que puedan estar abiertos
        const modalesAbiertos = document.querySelectorAll('.modal.show');
        modalesAbiertos.forEach(modal => {
          (modal as HTMLElement).style.display = 'none';
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('tabindex');
        });

        // Limpiar cualquier backdrop restante
        const backdropsRestantes = document.querySelectorAll('.modal-backdrop');
        backdropsRestantes.forEach(backdrop => backdrop.remove());

      }, 150);

    } catch (error) {
      console.error('Error al cerrar modal:', error);

      // Método de respaldo: usar jQuery si está disponible
      if ((window as any).$) {
        (window as any).$('#NuevaTareaTra').modal('hide');
        (window as any).$('#ntareatramiteModal').modal('hide');
        (window as any).$('.modal-backdrop').remove();
        (window as any).$('body').removeClass('modal-open');
      }
    }
  }

  /**
   * Método para abrir el modal de nueva tarea de manera segura
   */
  public abrirModalNuevaTarea() {
    // Limpiar el estado antes de abrir
    this.limpiarEstadoModalNuevaTarea();
    
    // Abrir modal usando el servicio
    this.modalManagerService.openModal('NuevaTareaTra');
  }

  /**
   * Método para limpiar el estado del modal de nueva tarea
   */
  private limpiarEstadoModalNuevaTarea() {
    // Resetear variables de estado
    this.veoModifiDatosPerso = false;
    this.veoBajaHabitante = false;
    this.veoConsultaObjetoTributario = false;
    this.veoTipoObjetoTributario = false;
    this.verformnuevatarea = false;
    this.veoAcciones = false;

    // Limpiar datos de entrada
    this.introValorConsulta = '';
    this.introTObjTrubu = {} as TipoObjetoTributarioDto;

    // Limpiar archivo
    this.identificadorFicheroSubido = undefined;
    this.base64code = undefined;
    this.name = '';
    this.archivoSubidaEnProgreso = false;

    // Limpiar plantilla defecto
    this.plantillaDefecto = null;

    // Limpiar input de archivo
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Limpiar clases de validación del formulario
    setTimeout(() => {
      const form = document.getElementById('formNuevaTarea') as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        
        // Limpiar clases de validación de todos los campos
        const allFields = form.querySelectorAll('.form-control, .form-select');
        allFields.forEach(field => {
          field.classList.remove('is-invalid', 'is-valid');
        });
      }
    }, 100);

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  public getListarTramites(idexp: number) {

    console.log(` ESTA ES LA PAGINA QUE CARGA : ${environment.apiUrl}tramite/listar/${this.idExpediente}`);

    this.sourceTramite = ({
      dataType: 'json',
      dataFields: [
        { name: 'numero', type: 'number' },
        { name: 'descripcion', type: 'string' },
        { name: 'fase', type: 'string' },
        { name: "fecTramite", type: 'string' },
        { name: "fecContr", type: 'string' },
        { name: "usuContr", type: 'string' },
        { name: 'id', type: 'any' },
      ],
      url: `${environment.apiUrl}tramite/listar/${idexp}`,
      id: 'id',
    });

    this.expedientesService.getTramitesListar(idexp).subscribe(
      listartramites => this.listartramites = listartramites
    );

    // para realizar pruebas
    this.expedientesService.getTramitesListar(idexp).subscribe({
      error(err) {
        // console.log("ESTE ES EL ERROR DE LISTAR TRAMITES: ",err.status );
        if (err.status == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que no hay conexión con la Base de Datos',
            footer: 'Inténtalo mas tarde '
          })
        }
      },
    })
  }

  public getTareaTramiteExpedienteListar() {
    this.expedientesService.getTareaTramiteExpedienteListar(this.idTramite).subscribe(
      (tareaTramiteExpedienteListar: TareaTramiteExpedienteListar[]) => {
        this.tareatramiteexpedientelistar = tareaTramiteExpedienteListar;
      },
      (err: HttpErrorResponse) => {
        console.log('paso por error: ' + err.error.message);
        try {
          this.veoeditofasetramite = false;
          this.tareatramiteexpedientelistar.length = 0;
          console.log('borrado de : length ' + this.tareatramiteexpedientelistar.length);
        } catch (error) {
        }
      },
      () => {
        console.log('getTareaTramiteExpedienteListar completed');
      }
    );
  }


  public getUsuarioListar(id: number) {
    this.procedimientoService.getUsuarioListar(id).subscribe(
      procedimientoPermisoListar => this.procedipermisolistar = procedimientoPermisoListar
    );
  }


  public seleccionaInteresado(idInteresado: number) {
    this.verborrarinteresado = true;
    this.idInteresado = idInteresado;

    console.log(`ID INTERESADO : ${this.idInteresado}`);
  }

  public borrarTramite() {

    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar Trámite",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'

    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteTramite(this.idTramite).subscribe({
          next: (response) => {
            this.refrescoSourceTramite();
            this.respuestahttp = response;
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 403) {
              Swal.fire({
                title: error.error.message,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              }).then(r => r);
            }
          }
        });

        if (this.respuesta.status == 200) {
                      this.notificationService.deleteSuccess('Trámite');
          } else {
            this.notificationService.error('No se pudo eliminar el Trámite');
        }
      }
    })

  }

  public getListaTareas(): Observable<ListaTareaProcedi[]> {
    let urlListatareas: string = `${environment.apiUrl}tareaProcedimiento/listar/${this.idprocedi}/${this.fasetramite}`;

    console.log(`********** TAREAS DEL PROCEDIMIENTO LISTAR  *********************`);
    console.log(`url LISTAR TAREAS  : ${urlListatareas}`);
    console.log(`id Procedimiento  : ${this.idprocedi}`);
    console.log(`id Procedimiento  : ${this.fasetramite}`);

    return this.http.get(urlListatareas).pipe(
      map(response => response as ListaTareaProcedi[])
    );

  }

  // En edita-expediente.component.ts

  public borrarTareaTramiteExp() {
    // --- PUNTO DE VERIFICACIÓN 2 ---
    // Lo primero que hacemos es imprimir en la consola el valor de this.idTarea
    // EN EL MOMENTO EXACTO en que el usuario hace clic en el botón de borrar.
    console.log(
      `%c[INTENTO DE BORRADO]`,
      'color: red; font-weight: bold;',
      `ID al momento de borrar: ${this.idTarea}`
    );

    // --- AJUSTE DE SEGURIDAD (GUARDA) ---
    // Si por alguna razón el ID es nulo, indefinido o 0, detenemos la ejecución aquí.
    // Esto previene el error "id no puede ser nulo" y da feedback útil.
    if (!this.idTarea) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Selección',
        text: 'No se ha seleccionado ninguna tarea para borrar. Por favor, haz clic en una tarea de la lista primero.'
      });
      return; // Detiene la función aquí mismo.
    }

    // Si pasamos la guarda de seguridad, significa que this.idTarea es válido y podemos continuar.
    Swal.fire({
      title: `¿Confirma eliminar la tarea ${this.numeroTareaTramite}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        // --- PUNTO DE VERIFICACIÓN 3 ---
        // Un último log para confirmar el ID que se está enviando al servicio.
        console.log(
          `%c[ENVIANDO A BACKEND]`,
          'color: green; font-weight: bold;',
          `Llamando a deleteTareaTramiteExpediente con ID: ${this.idTarea}`
        );

        this.expedientesService.deleteTareaTramiteExpediente(this.idTarea).subscribe({
          next: (response) => {
            this.notificationService.deleteSuccess('Tarea');
            this.refrescoSourceTareasTramite(this.idTramite);
            this.verAccionesdeTarea = false; // Ocultamos el panel de acciones.
          },
          error: (error: HttpErrorResponse) => {
            const mensaje = error.error?.message || 'Ocurrió un error inesperado.';
            this.notificationService.error(`Error al eliminar: ${mensaje}`);
          }
        });
      }
    });
  }

  public borrarTramitador() {

    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar Tramitador",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteTramitador(this.idTramitador).subscribe(response => {

          this.respuestahttp = response;// guardamos la respuesta http en la clase procedimientocreado
          // console.log(`RESPUESTA body : ${this.headers } `);
        }, (error: HttpErrorResponse) => {
          console.error(`Errores al borrar  Tramitador!!!! ${error.status}`);
          if (error.status == 403) {

            Swal.fire({
              title: error.error.message,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })

          }
        }
        );

        setTimeout(this.recargarpagina, 1500);// para que le de tiempo a ejecutarl todo

        let resulta = JSON.stringify(this.respuesta.headers);

        // console.log(`MAS DATOS :  ${resulta}`)
        let statusCode = this.respuesta.body;

        if (this.respuesta.status == 200) {
          this.notificationService.deleteSuccess('Tramitador');
        } else {
          this.notificationService.error('No se pudo eliminar el Tramitador');
        }
      }
    })

  }


  public borrarInteresados() {

    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar interesado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteInteresado(this.idInteresado).subscribe(response => {

          this.respuestahttp = response;// guardamos la respuesta http en la clase procedimientocreado
          // console.log(`RESPUESTA body : ${this.headers } `);
        }, (error: HttpErrorResponse) => {
          console.error(`Errores al crear INTERESADO!!!! ${error.status}`);
          if (error.status == 403) {

            Swal.fire({
              title: `No se ha podido borrar el elemento. Existen elementos dependientes asociados `,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })

          }
        }
        );


        setTimeout(this.recargarpagina, 1500);// para que le de tiempo a ejecutarl todo


        let resulta = JSON.stringify(this.respuesta.headers);

        let statusCode = this.respuesta.body;

        if (this.respuesta.status == 200) {
          this.notificationService.deleteSuccess('Interesado');
        } else {
          this.notificationService.error('No se pudo eliminar el Interesado');
        }
      }
    })

  }


  //-----------------------------------

  public getListarInteresado(idexp: number) {
    this.expedientesService.getInteresadoListarDto(idexp).subscribe({
      next: (listarInteresados) => {
        this.listarinteresadosdto = listarInteresados;
      },
      error: (error) => {
        console.error('Error al obtener interesados:', error);
        this.listarinteresadosdto = [];
      }
    });
  }

  //-----------------------------------

  async cargarExpediente() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.idExpediente = id;
      console.log(`ID EXPEDIENTE: ${this.idExpediente}`);
      console.log(`PROCEDIMIENTO: ${this.procediExp}`);
      this.atrasruta = `editaexpediente/${id}`;

      if (id) {
        // Cargar expediente
        this.expedientesService.getExpediente(id).subscribe({
          next: (verExpediente: VerExpediente) => {
            this.verExpediente = verExpediente;
            // Inicializar sourceListarNotifi después de cargar el expediente
            this.inicializarSourceListarNotifi();
            // Cargar lista de interesados después de cargar el expediente
            this.getListarInteresado(this.idExpediente);
          },
          error: (error) => {
            if (error.status === 0) {
              console.error("NO HAY CONEXION CON LA BASE DE DATOS!!!!!");
            }
          }
        });

        // Cargar lista de trámites
        this.tramitesService.getTramiteExpediente(id).subscribe({
          next: (tramiteExpedientelista: TramiteExpedienteDto[]) => {
            this.tramiteExpedienteListar = tramiteExpedientelista;
          },
          error: (error) => {
            if (error.status === 0) {
              console.error("NO HAY CONEXION CON LA BASE DE DATOS!!!!!");
            }
          }
        });
      }
    });
  }

  public inicializarSourceListarNotifi() {
    this.sourceListarNotifi = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'desMotNotif', type: 'string' },
        { name: 'observacion', type: 'string' },
        { name: 'desSituacion', type: 'string' },
        { name: 'fecNotif', type: 'string' },
        { name: "fecRecNotif", type: 'string' },
        { name: "personaEntidad", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "ejeNotif", type: 'number' },
        { name: 'idNotif', type: 'number' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'numNotif', type: 'number' },
        { name: 'numDocum', type: 'any' },
        { name: 'desPerEntid', type: 'any' },
        { name: 'fecEnvio', type: 'string' },
        { name: 'numTarea', type: 'any' },
        { name: 'desTramite', type: 'any' },
        { name: 'bop', type: 'any' },
        { name: 'numBop', type: 'any' },
        { name: 'fecEmiBop', type: 'any' },
        { name: 'fecPubBop', type: 'any' },
        { name: 'numEnvioTeu', type: 'any' },
        { name: 'desReceptor', type: 'any' },
        { name: 'desNotificador', type: 'any' },
        { name: 'situacion', type: 'any' },
        { name: 'fecRegistSalid', type: 'any' },
        { name: 'acciones', type: 'any' },
      ],
      url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
      sortcolumn: 'numNotif',
      sortdirection: 'desc'
    });
  }

  public recargarSourceTramitadores() {
    this.sourceTramitadores = ({
      dataType: 'json',
      dataFields: [
        { name: 'fecAsignacion', type: 'string' },
        { name: 'estadoTramitacion', type: 'string' },
        { name: 'usuario', type: 'string' },
        { name: 'posesion', type: 'string' },
      ],
      url: `${environment.apiUrl}tramitador/listar/${this.idExpediente}`,
      id: 'id',

    });
  }

  public clickTramitadores(event) {
    // Marcar el radio button correspondiente
    const rowIndex = event.args.rowindex;

    // Agregar un pequeño retraso para asegurar que el DOM esté renderizado
    setTimeout(() => {
      this.marcarRadioButtonTramitador(rowIndex);
    }, 10);

    // Cargar datos del tramitador seleccionado
    const rowData = event.args.row.bounddata;
    this.idTramitador = rowData.id;
    
    console.log('Tramitador seleccionado:', rowData);
  }

  public fechaTramite!: string;
  public disabledArchivoTareaTramite: boolean = false;
  public plantillaDefecto!: string | null;
  veoAcciones: boolean = false;


  public clickTareProcedimiento(event: any) {
    this.veoAcciones = true
    this.disabledArchivoTareaTramite = true;

    // Obtener la plantilla defecto de la tarea seleccionada
    const plantilla = event.args.row.bounddata.plantillaDefecto;
    this.plantillaDefecto = plantilla && plantilla !== 'null' && plantilla !== 'undefined' ? plantilla : null;

    console.log('Plantilla defecto seleccionada:', this.plantillaDefecto);
  }

  public idlistatareaProcedi!: any;

  veoModifiDatosPerso: boolean = false;

  modifiObjetoTribu: boolean = false;

  //--------------------- Eleazar
  public veoBajaHabitante: boolean = false;
  public veoConsultaObjetoTributario: boolean = false;
  // Propiedades de estado

  public cargando: boolean = false;
  public descripcionAccion: string = '';
  public ediquetaValorConsulta: string;
  public isConsultaAccionRunning = false;
  public veoTipoObjetoTributario: boolean = false;
  public veoGenerarEntrada: boolean = true;
  public mostrarModalOperacion: boolean = false;
  public introValorConsulta: string = '';


  // Propiedades para almacenar los resultados de consultas
  public habitantes: Habitantes = new Habitantes();
  public vehiculo: Vehiculo = new Vehiculo();
  public personaentidad: PersonaEntidad = new PersonaEntidad();


  public objetotributario: ObjetoTributarioDto;

  public usuContrl = sessionStorage.getItem('user');


  public tareatramiteprocedimiento: TareaProcedimientoDTO;

  public idExpediente!: number;

  private modalAnterior: bootstrap.Modal | null = null;

  public tipoObjetoSeleccionado: TipoObjetoTributarioDto = {
    idHisTipObjTribu: 0,
    idTipObjTribu: 0,
    codTipObjTribu: '',
    desTipObjTribu: ''
  };


  /**
   * Método para reiniciar las variables de estado que controlan la UI de acciones y modales.
   */
  resetActionState(): void {
    this.isConsultaAccionRunning = false;
    this.veoTipoObjetoTributario = false;
    this.veoModifiDatosPerso = false;
    this.descripcionAccion = '';
    this.veoBajaHabitante = false;
    this.veoConsultaObjetoTributario = false;
    this.modifiObjetoTribu = false;
    //this.objetotributario = null;
    this.introValorConsulta = '';
    this.introTObjTrubu = {} as TipoObjetoTributarioDto;
    this.cdr.detectChanges();
  }

  public borraDatosNuevaTarea() {
    this.tareatramiteexpedientecrear = new TareaTramiteExpedienteCrear();
    this.tareatramiteexpedientecrear.tareaProcedimiento = -1;
    this.tareatramiteexpedientecrear.visible = true;
    this.tareatramiteexpedientecrear.fecInicio = new Date();
    this.tareatramiteexpedientecrear.fecContr = new Date();
    this.tareatramiteexpedientecrear.archivo = null;
    this.tareatramiteexpedientecrear.descripcion = '';
    this.tareatramiteexpedientecrear.firmante = null;
    this.tareatramiteexpedientecrear.propuestaResolucion = null;
    this.tareatramiteexpedientecrear.anexo = null;
    this.tareatramiteexpedientecrear.documAportada = null;
    this.tareatramiteexpedientecrear.tipoDocumEni = null;
    this.tareatramiteexpedientecrear.documentacion = null;

    // Limpiar archivo
    this.identificadorFicheroSubido = undefined;
    this.base64code = undefined;
    this.name = '';
    this.archivoSubidaEnProgreso = false;

    // Limpiar plantilla defecto
    this.plantillaDefecto = null;

    this.FechaSistema();
    this.resetActionState();

    // Cerrar el modal de manera segura si está abierto
    setTimeout(() => {
      this.cerrarModalNuevaTareaSeguro();
    }, 100);
  }


  // ACCIONES DE TAREA
  public acciones = ACCIONES;

  getAccionButtonText(): string {
    if (this.tareatramiteprocedimiento && this.tareatramiteprocedimiento.accion === -1) {
      return "";
    }
    const accionObj = ACCIONES.find(item => item.valor === this.tareatramiteprocedimiento?.accion);
    return accionObj ? accionObj.etiquetaBoton : "";
  }


  // Método para determinar si la acción requiere DNI (ejemplo para acciones 6-10)
  isDNIAction(): boolean {
    const accion = this.tareatramiteprocedimiento?.accion;
    return accion === 6 || accion === 7 || accion === 8 || accion === 9 || accion === 10;
  }


  showModalBajaObjetoTributario: boolean = false;

  // Este método se invoca al hacer click en el botón de consulta
  onConsultaAccionClick() {
    console.log("pulsamos onConsultaAccionClick getAccionButtonText ")
    // Actualiza la selección de tarea
    this.idListaTareaProcedimiento(this.tareatramiteexpedientecrear.tareaProcedimiento);

    if (this.isConsultaAccionRunning) {
      return;
    }

    // Si la acción es diferente a 10, se valida que se haya ingresado el dato requerido
    if (this.tareatramiteprocedimiento.accion !== 10) {
      if (!this.introValorConsulta || this.introValorConsulta.trim() === "") {
        Swal.fire({
          icon: 'warning',
          title: 'Dato requerido',
          text: 'Por favor, ingrese el dato requerido para la consulta',
        }).then(r => r);
        return;
      }
    } else {
      // Para la acción 10, validamos que se haya seleccionado un objeto tributario
      if (!this.introTObjTrubu || Object.keys(this.introTObjTrubu).length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Dato requerido',
          text: 'Por favor, seleccione el tipo de objeto tributario',
        }).then(r => r);
        return;
      }
    }

    this.isConsultaAccionRunning = true;
    this.consultaAccion(this.introValorConsulta, this.introTObjTrubu);
  }


  /**
   * Método principal que procesa la acción a ejecutar según tareatramiteprocedimiento.accion.
   */
  consultaAccion(valor: any, idtipobje: any): void {
    console.log('consultaAccion called with action:', this.tareatramiteprocedimiento.accion);
    console.log("[consultaAccion] Valor recibido:", valor, " idtipobje:", idtipobje);
    console.log("[consultaAccion] Acción actual:", this.tareatramiteprocedimiento.accion);

    if (this.tareatramiteprocedimiento.accion === null || this.tareatramiteprocedimiento.accion === undefined) {
      this.isConsultaAccionRunning = false;
      this.veoAcciones = false;
      return;
    }

    switch (this.tareatramiteprocedimiento.accion) {
      case 0:
        this.ediquetaValorConsulta = "Introduzca documento";
        this.veoTipoObjetoTributario = false;
        this.expedientesService.getConsultaHabitantea(valor).subscribe(
          respuesta => {
            this.habitantes = respuesta;
            this.isConsultaAccionRunning = false;
            console.log(JSON.stringify(this.habitantes));

            Swal.fire({
              title: "<strong>Consulta Habitantes</strong>",
              html: `
                    <h4>${this.habitantes.nombre || ''} ${this.habitantes.apellido1 || ''} ${this.habitantes.apellido2 || ''}</h4>
                    <h4><strong>Tipo Doc.</strong> ${this.habitantes.tipDocum || ''} <strong>Número</strong> ${this.habitantes.numDocum || ''}</h4>
                    <h4><strong>Domicilio</strong> ${this.habitantes.domicilio || ''}</h4>
                    <h4><strong>Teléfono</strong> ${this.habitantes.telefono || ''} <strong>Email</strong> ${this.habitantes.email || ''}</h4>
                    <h4><strong>Distrito</strong> ${this.habitantes.distrito || ''} <strong>Sección</strong> ${this.habitantes.seccion || ''}</h4>
                    <h4><strong>Hoja Padrón</strong> ${this.habitantes.numHojPadro || ''} <strong>Número de familia</strong> ${this.habitantes.numFamil || ''}</h4>
                    <h4><strong>Número de orden</strong> ${this.habitantes.numOrden || ''}</h4>
                    <h4><strong>Fecha Padrón</strong> ${this.habitantes.fecPadro || ''} <strong>Fecha Nacimiento</strong> ${this.habitantes.fecNacim || ''}</h4>
                    <h4><strong>Provincia</strong> ${this.habitantes.proNacim || ''} <strong>Municipio</strong> ${this.habitantes.munNacim || ''}</h4>
                    <h4><strong>Situación</strong> ${this.habitantes.situacion || ''}</h4>
                    <h4><strong>Fecha Situación</strong> ${this.habitantes.fecSituacion || ''}</h4>
                    <h4><strong>Observaciones</strong> ${this.habitantes.observaciones || ''}</h4>`,
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: `<i class="fa fa-thumbs-up"></i>Cerrar`
            });
          },
          error => {
            Swal.fire(error.error.message).then(r => r);
            this.isConsultaAccionRunning = false;
          }
        );
        break;

      case 1:
        this.ediquetaValorConsulta = "Introduzca Matrícula";
        this.veoTipoObjetoTributario = false;
        this.expedientesService.getConsultaVehiculo(valor)
          .subscribe({
            next: (respuesta) => {
              this.vehiculo = respuesta;
              console.log(JSON.stringify(this.vehiculo));
              Swal.fire({
                title: "<strong>Consulta Vehículos</strong>",
                html: `
                    <h4><strong>Documento identidad</strong> ${this.vehiculo.numDocum}</h4>
                    <h4><strong>Domicilio</strong> ${this.vehiculo.domicilio}</h4>
                    <h4><strong>Código Postal</strong> ${this.vehiculo.cp} <strong>Provincia</strong> ${this.vehiculo.provincia} <strong>Municipio</strong> ${this.vehiculo.municipio}</h4>
                    <h4><strong>Matrícula</strong> ${this.vehiculo.matricula} <strong>Bastidor</strong> ${this.vehiculo.bastidor}</h4>
                    <h4><strong>Tipo Vehículo</strong> ${this.vehiculo.tipoVehiculo} <strong>Marca</strong> ${this.vehiculo.marca} <strong>Modelo</strong> ${this.vehiculo.modelo}</h4>
                    `,
                showCloseButton: false,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: `<i class="fa fa-thumbs-up"></i>Cerrar`
              }).then(r => r);
              this.isConsultaAccionRunning = false;
            },
            error: (error) => {
              Swal.fire(error.error.message).then(r => r);
              this.isConsultaAccionRunning = false;
            }
          });
        break;

      case 2:
        this.ediquetaValorConsulta = "Introduzca documento";
        this.veoTipoObjetoTributario = true;

        if (!idtipobje || !valor) {
          Swal.fire('Debe seleccionar el tipo de objeto tributario y documento.');
          this.isConsultaAccionRunning = false;
          return;
        }

        const idHisTip2 = idtipobje.idHisTipObjTribu;
        const idTip2 = idtipobje.idTipObjTribu;

        console.log(`GET OBJETO TRIBUTARIO : --> ${environment.apiUrl}/objetoTributario/ver/${idHisTip2}/${idTip2}/${valor}`);

        this.expedientesService.getObjetoTributario(`${idHisTip2}/${idTip2}`, valor).subscribe({
          next: (respuesta) => {
            this.objetotributario = respuesta;
            this.veoConsultaObjetoTributario = true;
            this.isConsultaAccionRunning = false;
          },
          error: (error) => {
            Swal.fire(error.error.message).then(r => r);
            this.isConsultaAccionRunning = false;
          }
        });
        break;


      case 3:
        this.descripcionAccion = "Modificar datos Persona";
        this.ediquetaValorConsulta = "Introduzca documento";
        this.expedientesService.getPersonaEntidad(valor)
          .subscribe({
            next: respuesta => {
              this.veoModifiDatosPerso = true;
              this.personaentidad = respuesta;
              this.isConsultaAccionRunning = false;
            },
            error: error => {
              Swal.fire(error.error.message).then(r => r);
              this.isConsultaAccionRunning = false;
              this.resetActionState();
            }
          });

        break;


      case 4:
        this.descripcionAccion = "Baja Habitante";
        this.ediquetaValorConsulta = "Introduzca documento";
        this.expedientesService.getPersonaEntidad(valor)
          .subscribe({
            next: (respuesta) => {
              this.veoBajaHabitante = true;
              this.personaentidad = respuesta;
            },
            error: (error) => {
              Swal.fire(error.error.message).then(r => r);
              this.resetActionState();
            }
          });

        this.isConsultaAccionRunning = false;
        break;


      case 5:
        this.descripcionAccion = "Baja Objeto Tributario";
        this.ediquetaValorConsulta = "Introduzca documento";

        if (!this.introValorConsulta || !this.introTObjTrubu) {
          Swal.fire('Debe ingresar el documento y tipo de objeto tributario.').then(r => r);
          this.isConsultaAccionRunning = false;
          return;
        }

        const idHisTip5 = this.introTObjTrubu.idHisTipObjTribu;
        const idTip5 = this.introTObjTrubu.idTipObjTribu;
        const numDocum = this.introValorConsulta;

        console.log('introTObjTrubu seleccionado (objeto):', this.introTObjTrubu);
        console.log('ID HIS:', idHisTip5, 'ID TIP:', idTip5);

        this.expedientesService.getObjetoTributario(`${idHisTip5}/${idTip5}`, numDocum)
          .subscribe({
            next: (respuesta: ObjetoTributarioDto) => {
              this.objetotributario = respuesta;

              this.modifiObjetoTribu = true;
              this.veoConsultaObjetoTributario = false;
              this.veoTipoObjetoTributario = false;

              if (this.objetotributario.codMovim === 'BAJA') {
                this.objetotributario.observaciones = null;
              }

              this.cdr.detectChanges();
              this.isConsultaAccionRunning = false;
              this.resetActionState();
            },
            error: (error) => {
              Swal.fire('Error', error.error.message, 'error').then(r => r);
              this.isConsultaAccionRunning = false;
              this.resetActionState();
            }
          });
        break;


      case 6:
        this.cargando = true;
        this.descripcionAccion = "Volante de Empadronamiento";
        this.ediquetaValorConsulta = "Introduzca DNI";
        this.expedientesService.getVolanteEmpadronamiento(valor, this.idExpediente, this.usuContrl!)
          .pipe(
            finalize(() => {
              this.cargando = false;
            })
          )
          .subscribe({
            next: (response: Blob) => {
              const blob = new Blob([response], { type: response.type });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'VolanteEmpadronamiento.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
              Swal.fire({
                title: 'Descarga completada',
                text: 'El Volante de Empadronamiento se ha descargado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => this.resetActionState());
            },
            error: (error: any) => {
              const msg = error?.error?.message || 'No se pudo generar el Volante de Empadronamiento.';
              Swal.fire('Error', msg, 'error').then(() => this.resetActionState());
            }
          });
        break;

      // Caso 7: Certificado de Empadronamiento
      case 7:
        this.cargando = true;
        this.descripcionAccion = "Certificado de Empadronamiento";
        this.ediquetaValorConsulta = "Introduzca DNI";
        this.expedientesService.getCertificadoEmpadronamiento(valor, this.idExpediente, this.usuContrl!)
          .pipe(
            finalize(() => {
              this.cargando = false;
              this.resetActionState();
              this.cdr.detectChanges();
            })
          )
          .subscribe({
            next: (response: any) => {
              const blob = new Blob([response], { type: response.type });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'CertificadoEmpadronamiento.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
              Swal.fire({
                title: 'Descarga completada',
                text: 'El Certificado de Empadronamiento se ha descargado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => this.resetActionState());
            },
            error: (error) => {
              const msg = error?.error?.message || 'No se pudo generar el Certificado de Empadronamiento.';
              Swal.fire('Error', msg, 'error').then(() => this.resetActionState());
            }
          });
        break;

      // Caso 8: Recibos Pendientes de Pago
      case 8:
        this.cargando = true;
        this.descripcionAccion = "Recibos Pendientes de Pago";
        this.ediquetaValorConsulta = "Introduzca DNI";
        this.veoTipoObjetoTributario = false;

        if (!valor || valor.trim() === '') {
          Swal.fire({
            title: 'Atención',
            text: 'Debe introducir un DNI',
            icon: 'warning'
          }).then(r => r);
          this.isConsultaAccionRunning = false;
          this.cargando = false;
          break;
        }

        this.introValorConsulta = valor.trim();
        this.loadRecibos().pipe(
          finalize(() => {
            this.cargando = false;
            this.resetActionState();
            this.cdr.detectChanges();
          })
        ).subscribe({
          next: () => {
            this.isConsultaAccionRunning = false;
          },
          error: (error) => {
            Swal.fire(error.error.message);
            this.cargando = false;
            this.resetActionState();
          }
        });
        break;


      // Caso 9: Certificado de deudas
      case 9:
        this.cargando = true;
        this.descripcionAccion = "Certificado de deudas";
        this.ediquetaValorConsulta = "Introduzca DNI";
        this.expedientesService.getCertificadoDeuda(valor, this.idExpediente, this.usuContrl!)
          .pipe(
            finalize(() => {
              this.cargando = false;
              this.resetActionState();
              this.cdr.detectChanges();
            })
          )
          .subscribe({
            next: (blob: Blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'certificado_deuda.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
              Swal.fire({
                title: 'Descarga completada',
                text: 'El Certificado de Deudas se ha descargado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(r => r);
            },
            error: (error) => {
              Swal.fire(error.error.message).then(r => r);
            }
          });
        break;

      // Caso 10: Generar liquidaciones
      case 10:
        this.cargando = true;
        this.descripcionAccion = "Generar liquidaciones";
        this.veoTipoObjetoTributario = true;

        const idHis10 = this.introTObjTrubu.idHisTipObjTribu;
        const idTip10 = this.introTObjTrubu.idTipObjTribu;
        const encontrado = this.tipoObjetoTributario.find(tipo =>
          tipo.idHisTipObjTribu === idHis10 && tipo.idTipObjTribu === idTip10
        );

        if (encontrado) {
          this.tipoObjetoSeleccionado = encontrado;
        } else {
          console.warn("[consultaAccion] No se encontró el objeto tributario. Asignando objeto por defecto.");
          this.tipoObjetoSeleccionado = { idHisTipObjTribu: 0, idTipObjTribu: 0, codTipObjTribu: '', desTipObjTribu: '' };
        }

        this.abrirModalLiquidacion();
        this.isConsultaAccionRunning = false;
        this.cargando = false;
        this.resetActionState();
        this.cdr.detectChanges();
        break;


      default:
        Swal.fire({
          title: 'Acción no reconocida',
          text: `La acción con código ${this.tareatramiteprocedimiento.accion} no está implementada.`,
          icon: 'error',
          confirmButtonText: 'Cerrar'
        }).then(r => r);
        this.isConsultaAccionRunning = false;
        break;
    }
  }

  /**
   * Método que se llama al seleccionar/recibir un id de tarea procedimental
   */
  public idListaTareaProcedimiento(selectedValue: any): void {
    console.log('idListaTareaProcedimiento:', selectedValue);

    // Si se selecciona "Sin tarea del procedimiento"
    if (!selectedValue || selectedValue === '' || selectedValue === -1) {
      this.disabledArchivoTareaTramite = false;
      this.idlistatareaProcedi = null; // Limpiamos la selección
      this.sourceTareasProcedi = null; // Limpiamos la fuente del grid
      this.tareatramiteexpedientecrear.tareaProcedimiento = -1;
      // Ocultamos y limpiamos controles de acción y el componente de modificación
      this.veoAcciones = false;
      this.veoModifiDatosPerso = false;
      this.veoConsultaObjetoTributario = false;
      this.veoBajaHabitante = false;
      this.descripcionAccion = '';
      this.ediquetaValorConsulta = '';
      return;
    }

    // Si se selecciona una tarea válida, se procede a cargar sus acciones
    this.disabledArchivoTareaTramite = false;
    this.idlistatareaProcedi = selectedValue;
    console.log('ID TAREA PROCEDI: --->', selectedValue);

    this.sourceTareasProcedi = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'descripcion', type: 'string' },
        { name: 'faseTarea', type: 'string' },
        { name: 'plazo', type: 'string' },
        { name: 'tipoPlazo', type: 'string' },
        { name: 'plantillaDefecto', type: 'string' },
        { name: 'usuContr', type: 'string' },
        { name: 'accion', type: 'number' }
      ],
      url: `${environment.apiUrl}tareaProcedimiento/ver/${selectedValue}`,
      id: 'id'
    });

    this.expedientesService.getTramiteTarea(selectedValue).subscribe({
      next: (data: TareaProcedimientoDTO) => {
        console.log('Received data:', data);
        this.tareatramiteprocedimiento = data;
        console.log("Datos recibidos:", data);
        this.veoAcciones = true;
        this.configurarAccionTarea(data);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener tarea procedimiento:', error);
      }
    });
  }

  veoDIVBorrarObjetoTRibu: boolean = true;

  /**
   * Configura la descripción y el label según el valor de data.accion.
   */
  private configurarAccionTarea(data: TareaProcedimientoDTO): void {
    // Reiniciamos el estado general de acciones, incluyendo el de Baja de Objeto Tributario
    this.resetActionState();

    if (data.accion === null || data.accion === undefined) {
      return;
    }

    const accionObj = ACCIONES.find(item => item.valor === data.accion);
    if (accionObj) {
      this.descripcionAccion = accionObj.descripcion;
      this.ediquetaValorConsulta = accionObj.etiqueta;
      this.veoTipoObjetoTributario = accionObj.veoTipoObjetoTributario || false;
    } else {
      console.warn('Acción no reconocida:', data.accion);
      this.descripcionAccion = '';
      this.ediquetaValorConsulta = '';
    }

    // Si la acción es 5, preparamos el proceso de Baja de Objeto Tributario
    if (data.accion === 5) {

      console.log("EL VALOR ES 5 ---> : ", data.accion);
      // Aquí se reinician (o se inicia la carga) las variables específicas
      this.veoDIVBorrarObjetoTRibu = false;  // nuevo modal Enrique
      this.modifiObjetoTribu = true;
      // Por ejemplo, podrías iniciar una llamada para cargar el objeto tributario o dejarlo vacío para que el usuario lo complete
      // this.objetotributario = null; // O asigna un objeto vacío si se requiere
    }

    if (data.accion !== -1) {
      this.veoAcciones = true;
    }
    if (data.accion === 11) {
      this.abrirModalOperacion();
    }
    if (data.accion !== 3) {
      this.veoModifiDatosPerso = false;
    }
    if (data.accion !== 4) {
      this.veoBajaHabitante = false;
    }
    if (data.accion !== 2) {
      this.veoConsultaObjetoTributario = false;
    }
  }

  // -------------------------------------------
  // Baja de Objeto Tributario
  // -------------------------------------------

  private recargarObjetoTributario(): Observable<ObjetoTributarioDto> {
    const hisTip = this.objetotributario.idHisTipObjTribu;
    const tip = this.objetotributario.idTipObjTribu;
    const num = this.objetotributario.numDocum;
    return this.expedientesService.getObjetoTributario(`${hisTip}/${tip}`, num);
  }


  public darDeBajaObjeto(): void {
    if (!this.objetotributario) {
      Swal.fire('Error', 'No hay objeto tributario seleccionado', 'error').then(r => r);
      return;
    }

    Swal.fire({
      title: 'Confirmar Baja',
      text: '¿Estás seguro de dar de baja este objeto tributario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      const dto: Partial<ObjetoTributarioDto> = {
        idHisObjTribu: this.objetotributario.idHisObjTribu,
        idObjTribu: this.objetotributario.idObjTribu,
        numDocum: this.objetotributario.numDocum,
        codMovim: 'BAJA',
        fecMovim: new Date().toISOString().slice(0, 10),
        observaciones: this.objetotributario.observaciones?.trim() || null
      };

      this.expedientesService.putBajaObjetoTributario(dto).pipe(
        switchMap(() => this.recargarObjetoTributario())
      ).subscribe({
        next: updated => {
          this.objetotributario = updated;  // actualiza el DTO en pantalla
          this.cdr.detectChanges();
          Swal.fire('Éxito', 'Objeto dado de baja y recargado', 'success').then(r => r);
        },
        error: err => {
          Swal.fire('Error', err.error?.message || 'Error al procesar baja', 'error').then(r => r);
          console.error(err);
        }
      });
    });
  }

  public cerrarModalBajaObjetoTributario(): void {
    this.showModalBajaObjetoTributario = false;
  }


  private modalLiquidacionInstance: any = null;


  public abrirModalLiquidacion(): void {
    const modalLiquidacion = document.getElementById('liquidacionModal');
    if (modalLiquidacion) {
      // Ocultar el modal que estuviera mostrado (diferente al de liquidación)
      const modalAnteriorElement = document.querySelector('.modal.show') as HTMLElement;
      if (modalAnteriorElement && modalAnteriorElement.id !== 'liquidacionModal') {
        this.modalAnterior = bootstrap.Modal.getInstance(modalAnteriorElement);
        this.modalAnterior?.hide();
      }

      // Si ya existe una instancia previa, liberarla para evitar conflictos
      if (this.modalLiquidacionInstance) {
        this.modalLiquidacionInstance.dispose();
      }

      // Crear y mostrar la nueva instancia del modal de liquidación
      this.modalLiquidacionInstance = new bootstrap.Modal(modalLiquidacion, {
        backdrop: 'static',
        keyboard: false,
        focus: true
      });
      this.modalLiquidacionInstance.show();
      console.log("[abrirModalLiquidacion] Modal de liquidación mostrado.");
    } else {
      console.error("[abrirModalLiquidacion] No se encontró el modal de liquidación.");
    }
  }

  public cerrarModalLiquidacion(): void {
    if (this.modalLiquidacionInstance) {
      this.modalLiquidacionInstance.hide();
      // Si existía otro modal abierto previamente, volver a mostrarlo
      if (this.modalAnterior) {
        this.modalAnterior.show();
        this.modalAnterior = null;
      }
      this.modalLiquidacionInstance = null;
    } else {
      console.error("[cerrarModalLiquidacion] No se encontró instancia del modal de liquidación.");
    }
  }

  public abrirModalOperacion(): void {
    this.mostrarModalOperacion = true;
    setTimeout(() => {
      const modalElement = document.getElementById('operacionModal');
      if (modalElement) {
        // Guardar referencia al modal anterior si existe
        const modalAnteriorElement = document.querySelector('.modal.show') as HTMLElement;
        if (modalAnteriorElement && modalAnteriorElement.id !== 'operacionModal') {
          this.modalAnterior = bootstrap.Modal.getInstance(modalAnteriorElement);
          this.modalAnterior?.hide(); // Ocultar el modal anterior
        }

        // Configurar y mostrar el modal de operación
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false,
          focus: true
        });
        modal.show();

        // Configurar el evento de cierre
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.mostrarModalOperacion = false;
          if (this.modalAnterior) {
            this.modalAnterior.show(); // Mostrar el modal anterior
            this.modalAnterior = null; // Limpiar la referencia
          }
        });
      } else {
        console.error("No se encontró el modal de Operación con ID 'operacionModal'");
      }
    }, 0);
  }

  cerrarModalOperacion() {
    this.mostrarModalOperacion = false;
  }

  //-------------------------------------------
  public sourceRecibos: any;
  public dataAdapter: any;


  public columnsRecibos: any[] = [
    { text: 'Ejercicio', datafield: 'ejeRecib', width: '10%' },
    { text: 'Recibo', datafield: 'numRecib', width: '15%' },
    { text: 'Padrón', datafield: 'nomPadro', width: '20%' },
    { text: 'Descripción', datafield: 'desImpue', width: '25%' },
    { text: 'Fecha', datafield: 'fecRecib', width: '15%', cellsformat: 'dd/MM/yyyy' },
    {
      text: 'Total',
      datafield: 'impRecib',
      width: '15%',
      cellsrenderer: this.totalRenderer.bind(this)
    }
  ];

  totalRenderer(row: number, column: string, value: any): string {
    if (value === null || value === undefined) {
      return `<div style="text-align: right; margin-top: 4px;">€ 0.00</div>`;
    }
    const num = Number(value);
    return `<div style="text-align: right; margin-top: 4px;">${num.toFixed(2)} €</div>`;
  }

  loadRecibos(): Observable<ReciboCabeceraDto[]> {
    if (!this.introValorConsulta) {
      console.warn('No se puede cargar recibos: DNI no proporcionado.');
      // Devuelve un observable con un array vacío para evitar errores
      return of([]);
    }
    const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${this.introValorConsulta}`;
    return this.http.get<ReciboCabeceraDto[]>(url).pipe(
      tap((data) => {
        console.log("Datos recibidos:", data);
        if (!data || data.length === 0) {
          Swal.fire({
            title: 'Sin resultados',
            text: 'No se encontraron recibos pendientes de pago para el DNI ingresado.',
            icon: 'info'
          });
          const modalElement = document.getElementById('recibosPendientesModal');
          if (modalElement) {
            let modal = Modal.getInstance(modalElement);
            if (!modal) {
              modal = new Modal(modalElement, { backdrop: 'static', keyboard: false, focus: false });
            }
            modal.hide();
          }
        } else {
          // Configuramos la fuente de datos del grid
          this.sourceRecibos = {
            localdata: data,
            datatype: 'array',
            datafields: [
              { name: 'ejeRecib', type: 'number' },
              { name: 'numRecib', type: 'number' },
              { name: 'nomPadro', type: 'string' },
              { name: 'desImpue', type: 'string' },
              { name: 'fecRecib', type: 'date', dateformat: 'yyyy-MM-dd' },
              { name: 'impRecib', type: 'number' }
            ]
          };
          this.dataAdapter = new jqx.dataAdapter(this.sourceRecibos);
          this.cdr.detectChanges();
          if (this.gridRecibos && this.gridRecibos.nativeElement) {
            this.gridRecibos.nativeElement.on('bindingComplete', () => {
              const modalElement = document.getElementById('recibosPendientesModal');
              if (modalElement) {
                const modal = new Modal(modalElement, { backdrop: 'static', keyboard: false, focus: false });
                modal.show();
              }
            });
          } else {
            const modalElement = document.getElementById('recibosPendientesModal');
            if (modalElement) {
              const modal = new Modal(modalElement, { backdrop: 'static', keyboard: false, focus: false });
              modal.show();
            }
          }
        }
      }),
      catchError((error) => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error'
        });
        return throwError(error);
      })
    );
  }


  //---------------------------------


  // -------------------------------


  public verTareasdelTramite: boolean = false
  public descriptramite!: string;
  public fechatramite!: any;
  public fasetramite!: string;
  public botonNuevaTareaTramite: boolean = false;
  public veoeditofasetramite: boolean = true;


  public borrarDatosTramite() {
    this.editartramiteexp = new EditarTramiteExp();
    this.FechaSistema();
  }

  public clickTramiteNuevo(event: any) {
    // Marcar el radio button correspondiente
    const rowIndex = event.args.rowindex;

    // Agregar un pequeño retraso para asegurar que el DOM esté renderizado
    setTimeout(() => {
      this.marcarRadioButtonTramite(rowIndex);
    }, 10);

    this.botonNuevaTareaTramite = true;
    // MIRAR ESTE MODELO PARA VER LA FECHA EN LA EDICION DE TRAMITE
    this.fechatramite = this.formatearFechaParaInput(event.args.row.bounddata.fecTramite);
    this.fasetramite = event.args.row.bounddata.fase;


    this.getListaTareas().subscribe({
      next: (listaTareaProcedimiento) => this.listatareaprocedi = listaTareaProcedimiento,
      error: (err: HttpErrorResponse) => {
        console.log('Error Listar Tarea Procedimientos: ' + err.error.text);
      },
    });

    this.fasetramite = event.args.row.bounddata.fase;
    this.nuevotramite = false;


    this.verAccionesdeTarea = true;


    this.verTareasdelTramite = true
    console.log(`URL PARA TRAMITE :${environment.apiUrl}tramite/listar/${this.idExpediente}`)
    console.log(`ID TRAMITE nueva tabla : ${event.args.row.bounddata.id}`);
    this.verasignatramite = true;
    this.menuexpediente = true;
    this.idTramite = event.args.row.bounddata.id;
    this.descriptramite = event.args.row.bounddata.descripcion;
    this.numeroTramite = event.args.row.bounddata.numero;
    console.log(`NÚMERO TRAMITE  : ${event.args.row.bounddata.numero}`);
    console.log(`NÚMERO EXPEDIENTE  : ${this.verExpediente.numero}`);

    this.TramiteFase = event.args.row.bounddata.fase;


    // Gestión de fecha simplificada
    this.editartramiteexp.fecTramite = this.formatearFechaParaInput(event.args.row.bounddata.fecTramite);
    console.log(`Fecha formateada para edición: ${this.editartramiteexp.fecTramite}`);

    this.getTareaTramiteExpedienteListar()
    this.refrescoSourceTareasTramite(event.args.row.bounddata.id);
    this.getnotificacionListar();// esta funcion es para listar notificiones , que se necesitará mas adelante
    this.getListaTareas().subscribe(listatareaprocedi => this.listatareaprocedi = listatareaprocedi);
  }

  public marcarRadioButtonTramite(rowIndex: number) {
    console.log(`Marcando radio button para fila: ${rowIndex}`);

    // Desmarcar todos los radio buttons primero
    const radioButtons = document.querySelectorAll('input[name="RadioTramite"]') as NodeListOf<HTMLInputElement>;
    console.log(`Encontrados ${radioButtons.length} radio buttons de trámites`);

    radioButtons.forEach((radio, index) => {
      radio.checked = false;
      console.log(`Radio button ${index}: data-row="${radio.getAttribute('data-row')}"`);
    });

    // Marcar el radio button de la fila seleccionada
    const selectedRadio = document.querySelector(`input[name="RadioTramite"][data-row="${rowIndex}"]`) as HTMLInputElement;
    if (selectedRadio) {
      selectedRadio.checked = true;
      console.log(`Radio button marcado correctamente para fila ${rowIndex}`);
    } else {
      console.log(`No se encontró radio button para fila ${rowIndex}`);
      // Intentar buscar por índice alternativo
      const allRadios = document.querySelectorAll('input[name="RadioTramite"]') as NodeListOf<HTMLInputElement>;
      if (allRadios[rowIndex]) {
        allRadios[rowIndex].checked = true;
        console.log(`Radio button marcado por índice alternativo para fila ${rowIndex}`);
      }
    }
  }

  public marcarRadioButtonTarea(rowIndex: number) {
    // Desmarcar todos los radio buttons primero
    const radioButtons = document.querySelectorAll('input[name="TareasTramite"]') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach(radio => {
      radio.checked = false;
    });

    // Marcar el radio button de la fila seleccionada
    const selectedRadio = document.querySelector(`input[name="TareasTramite"][data-row="${rowIndex}"]`) as HTMLInputElement;
    if (selectedRadio) {
      selectedRadio.checked = true;
    }
  }

  public marcarRadioButtonTramitador(rowIndex: number) {
    console.log(`Marcando radio button de tramitador para fila: ${rowIndex}`);

    // Desmarcar todos los radio buttons primero
    const radioButtons = document.querySelectorAll('input[name="RadioTramitador"]') as NodeListOf<HTMLInputElement>;
    console.log(`Encontrados ${radioButtons.length} radio buttons de tramitadores`);

    radioButtons.forEach((radio, index) => {
      radio.checked = false;
      console.log(`Radio button ${index}: data-row="${radio.getAttribute('data-row')}"`);
    });

    // Marcar el radio button de la fila seleccionada
    const selectedRadio = document.querySelector(`input[name="RadioTramitador"][data-row="${rowIndex}"]`) as HTMLInputElement;
    if (selectedRadio) {
      selectedRadio.checked = true;
      console.log(`Radio button de tramitador marcado correctamente para fila ${rowIndex}`);
    } else {
      console.log(`No se encontró radio button de tramitador para fila ${rowIndex}`);
      // Intentar buscar por índice alternativo
      const allRadios = document.querySelectorAll('input[name="RadioTramitador"]') as NodeListOf<HTMLInputElement>;
      if (allRadios[rowIndex]) {
        allRadios[rowIndex].checked = true;
        console.log(`Radio button de tramitador marcado por índice alternativo para fila ${rowIndex}`);
      }
    }
  }

  public verAccionesdeTarea: boolean = false;
  public veopropuestaresolu: boolean = true;
  public FecIniTarea!: any;
  public FecFinTarea!: any;
  public numeroArchiTarea!: any;

  public anexoTarea!: any;
  public docAportadaTarea!: any;
  public docEniTarea!: any;
  public DocumentacionTarea!: any;
  public documentacion: string[] = [
    "Documentación Adjunta Digitalizada",
    "Documentación Adjunta en Soporte Papel",
    "Documentación Adjunta Digitalizada y en Papel"

  ];

  public fechametadatabuena!: string;

  public fechaMetadata(fecha: Date) {

    let recorteFecha: string = fecha.toString().substr(0, 10);
    let anio: string = fecha.toString().substring(0, 4);
    let mes: string = fecha.toString().substring(5, 7);
    let dia: string = fecha.toString().substring(8, 10);
    let fechaordenada: string = dia + "-" + mes + "-" + anio;
    this.fechametadatabuena = fechaordenada;

    let recorteHora: string = fecha.toString().substring(12, 14);
    let reverse: string = (recorteFecha)

    console.log("FECHA CAPTURA ++++++++++++++++++ : " + fecha);
    console.log("FECHa recortada ++++++++++++++++++ : " + fechaordenada);


  }

  public tipodefirma: boolean = true;
  public firmaAtendida: boolean = false;
  public firmaDesatendida: boolean = false;

  async gettipofirma() {
    this.expedientesService.getTipoFirma(this.idTarea).subscribe(
      data => console.log("MENSAJE DE RESPUESTA : " + data),
      (error: HttpErrorResponse) => {
        console.error("Tipo de Firma : " + error.error.text);

        switch (error.error.text) {
          case "ATENDIDA":
            this.firmaAtendida = true
            this.firmaDesatendida = false

            break;
          case "DESATENDIDA":
            this.firmaAtendida = false
            this.firmaDesatendida = true

            break;

          default:
            this.firmaAtendida = false
            this.firmaDesatendida = false
            break;
        }


      }
    )
  }

  public tareaprocedimientoid!: any;
  public nunRegisTarea!: any;
  public verAbreArchivo: boolean = false;
  public nombreArchivoTarea!: string;
  public veoMetadatos: boolean = false;
  public errorArchivoFirmantes: string;
  public tareayafirmada: boolean = true;
  public puedoEditarTarea: boolean = true;
  public numeroTareaTramite: any;
  public descripTareaTramite: any;
  public veoBorrar: boolean = true;
  public veoGenerarSalida: boolean = true;
  public veoNotificacion: boolean = true;
  public veoPropuestaResolucion: boolean = true;
  public veoFinalizar: boolean = true;
  public veoXml: boolean = true;
  public veoFirmaAtendida: boolean = false;
  public veoFirmaDEsatendida: boolean = false;
  public veoDocOriginal: boolean = true;

  public actualizoSourceTareaTramite() {
    this.sourceTareasTramite = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'numero', type: 'number' },
        { name: 'descripcion', type: 'string' },
        { name: 'fecInicio', type: 'string' },
        { name: "fecFin", type: 'string' },
        { name: "propuestaResolucion", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "firmado", type: 'string' },
        { name: "fecPlazo", type: 'string' },
        { name: "color", type: 'string' },
        { name: "archivo", type: 'string' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'id', type: 'any' },
        { name: 'tipAnexo', type: 'any' },
        { name: 'docAport', type: 'any' },
        { name: 'tipDocEni', type: 'any' },
        { name: 'documentacion', type: 'any' },
        { name: 'visible', type: 'any' },
        { name: 'visible', type: 'any' },
        { name: 'numRegis', type: 'any' },
        { name: 'idHisDocum', type: 'any' },
        { name: 'ejeNumNotif', type: 'any' },
        { name: 'nombreArchivo', type: 'any' },
        { name: 'idAnunc', type: 'any' },


      ],
      //url:` http://10.234.252.145:8090/api/gos/tareaTramiteExpediente/listar/57`
      url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
      id: 'id',
      // sortcolumn: 'id',
      //  sortdirection: 'desc'

    });
  }

  public crearTablonAnuncio() {
    try {
      if (!this.creartablonanuncio.tipAnunc || !this.creartablonanuncio.desAnunc || !this.creartablonanuncio.fecDesde || !this.creartablonanuncio.fecHasta) {
        Swal.fire(`Debe rellenar todos los campos obligatorios.`)
      } else {

        this.expedientesService.creaTablonAnuncio(this.creartablonanuncio, this.idTarea).subscribe(response => {
          this.actualizoSourceTareaTramite();
          Swal.fire('Enviado Tablón de anuncio', '', 'success');
          this.creartablonanuncio = new CrearTablonAnuncio;
        }, (err: HttpErrorResponse) => {
          Swal.fire('No se pudo crear el Tablón deanuncios', '', 'warning');
        })
      }
    } catch (error) {
    }
  }

  public spinnervisible: boolean = true;

  public conviertePDF() {
    this.spinnervisible = false;
    this.expedientesService.conviertopdf(this.idTarea).subscribe(
      data => {
        console.log("DATA : " + data)
        if (data != null) {
          Swal.fire('Se ha realizado la conversión', '', 'success')
        } else {
          Swal.fire('la conversión a pdf no fue posible', '', 'warning')
        }
      },

      (error: HttpErrorResponse) => {
        console.error("TIPO DE FIRMA  +++++++++++++++ : " + error.error.text);
        if (error.error.text == "OK") {
          this.spinnervisible = true;
          Swal.fire('Conversión realizada', '', 'success');
          this.sourceTareasTramite = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              { name: 'numero', type: 'number' },
              { name: 'descripcion', type: 'string' },
              { name: 'fecInicio', type: 'string' },
              { name: "fecFin", type: 'string' },
              { name: "propuestaResolucion", type: 'string' },
              { name: "usuario", type: 'string' },
              { name: "firmado", type: 'string' },
              { name: "fecPlazo", type: 'string' },
              { name: "color", type: 'string' },
              { name: "archivo", type: 'string' },
              { name: 'tareaProcedimiento', type: 'any' },
              { name: 'id', type: 'any' },
              { name: 'tipAnexo', type: 'any' },
              { name: 'docAport', type: 'any' },
              { name: 'tipDocEni', type: 'any' },
              { name: 'documentacion', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'numRegis', type: 'any' },
              { name: 'idHisDocum', type: 'any' },
              { name: 'ejeNumNotif', type: 'any' },
              { name: 'nombreArchivo', type: 'any' },
              { name: 'idAnunc', type: 'any' },
            ],
            url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
            id: 'id',
          });
        } else {
          Swal.fire(error.error.message, '', 'warning')
        }
      }
    );
  }

  public borrarconfirma: boolean = true;
  public veoconviertePDF: boolean = true;

  /**
   * Maneja el doble click en la tabla de tareas del trámite
   * Abre el modal de edición de la tarea
   */
  public onTareaTramiteDoubleClick(event: any): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos de la tarea para edición
      this.tareatramiteexpedienteeditar.descripcion = rowData.descripcion;
      this.tareatramiteexpedienteeditar.numero = rowData.numero;
      this.tareatramiteexpedienteeditar.fecInicio = rowData.fecInicio;
      this.tareatramiteexpedienteeditar.fecFin = rowData.fecFin;

      // Abrir modal de edición
      const modalEl = document.getElementById('EditarTareaTramiteModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('No se encontró el modal de edición de tarea del trámite');
      }
    });
  }

  public clicktareaNueva(event: any) {
    // Marcar el radio button correspondiente
    const rowIndex = event.args.rowindex;
    this.marcarRadioButtonTarea(rowIndex);

    GridRadioSelector.handleRowClick(event, 'TareasTramite', (rowData) => {

      this.cargaHistorico(rowData.id);

      const nombreArchivo: string = (rowData.nombreArchivo || "").trim();
      const archivo = rowData.archivo; // Puede ser null si no existe

      const fileIsPdf = nombreArchivo.toLowerCase().endsWith(".pdf");
      const fileError = nombreArchivo.includes("Error al buscar el archivo");

      this.veoconviertePDF = !nombreArchivo || fileIsPdf || fileError;

      this.verAbreArchivo = Boolean(archivo);

      this.borrarconfirma = rowData.firmado !== "1";

      this.numeroTareaTramite = rowData.numero;
      this.descripTareaTramite = rowData.descripcion;

      if (rowData.usuario === this.user || this.user === this.verExpediente.instructor) {
        this.veoXml = true;
        this.verAccionesdeTarea = true;
        this.puedoEditarTarea = true;
        this.veoBorrar = true;
        this.veoGenerarSalida = true;
        this.veoNotificacion = true;
        this.veoPropuestaResolucion = true;
        this.veoFinalizar = true;
        this.veoFirmaAtendida = false;
        this.veoFirmaDEsatendida = false;
        console.log("*************************** COINCIDEN ***************************");
      } else {
        this.veoXml = false;
        this.verAccionesdeTarea = false;
        this.puedoEditarTarea = false;
        this.veoBorrar = false;
        this.veoGenerarSalida = false;
        this.veoNotificacion = false;
        this.veoPropuestaResolucion = false;
        this.veoFinalizar = false;
        this.veoFirmaAtendida = true;
        this.veoFirmaDEsatendida = true;
        console.log("***************** NO COINCIDEN ************************ ");
      }

      this.tareayafirmada = !rowData.firmado;

      this.expedientesService.getArchivoFirmantes(this.usuContrl!, rowData.id).subscribe(
        archivofirmantes => this.archivofirmantes = archivofirmantes,
        (err: HttpErrorResponse) => this.errorArchivoFirmantes = err.error.text
      );

      this.nombreArchivoTarea = nombreArchivo;

      this.nunRegisTarea = rowData.numRegis;
      this.tareaprocedimientoid = rowData.tareaProcedimiento;
      this.getTramiteProcedimientoVer(rowData.tareaProcedimiento);
      this.anexoTarea = rowData.tipAnexo;
      this.docAportadaTarea = rowData.docAport;
      this.DocumentacionTarea = rowData.documentacion;
      console.log("anexoTarea:", this.anexoTarea);
      console.log("docAportadaTarea:", this.docAportadaTarea);
      console.log("documentacion:", rowData.documentacion);
      this.docEniTarea = rowData.tipDocEni;

      if (rowData.fecFin && archivo) {
        this.veoMetadatos = true;
        this.leoMetadatos(archivo);
      } else {
        this.veoMetadatos = false;
      }

      this.verAccionesdeTarea = !rowData.fecFin;
      this.FecIniTarea = rowData.fecInicio ? rowData.fecInicio.slice(0, 10) : "";
      this.FecFinTarea = rowData.fecFin;
      this.numeroArchiTarea = archivo;

      this.getListaTareas();

      this.veopropuestaresolu = !rowData.propuestaResolucion;

      this.tareatramiteexpedienteeditar.descripcion = rowData.descripcion;
      this.descripTarea = rowData.descripcion;
      console.log(`ID TAREA: ${rowData.id}`);
      this.idTarea = rowData.id;
      this.numeroArchivo = archivo;
      this.tareaProcedi = rowData.tareaProcedimiento;

      this.numeroTareaTramite = rowData.numero;


      console.log(
        `%c[SELECCIÓN DE TAREA]`,
        'color: blue; font-weight: bold;',
        `ID guardado: ${this.idTarea}, Tipo: ${typeof this.idTarea}`
      );

      this.ejerNumExpedi = `${this.verExpediente.ejercicio}/${this.verExpediente.numero}`;

      this.gettipofirma();
      this.getTemaDocumentoListar();
      this.getUsuarioListar(rowData.tareaProcedimiento);

      this.expedientesService.getTareaTramiteExpVer(rowData.id).subscribe(
        tareaTramiteExpedienteVer => this.tareatramiteexpedientever = tareaTramiteExpedienteVer
      );

      const sinespacios = this.usuContrl?.replaceAll(' ', '');
      this.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${this.numeroArchivo}/${sinespacios}`;

      try {
        for (let index = 0; index < this.tareatramiteexpedientelistar.length; index++) {
          const datos = this.tareatramiteexpedientelistar[index].fecInicio;
        }
      } catch (error) {
        console.log("ERROR del BUCLE:", error);
      }
    });
  }


  public previoGenerarSalida() {

    if (this.nunRegisTarea) {
      return `<div style="text-align: center; margin-top: 5px;">` + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + '</div>';
    }
  }


  public clicktarea(id: number, codArchivo, tareaProcedi: number) {
    console.log(`ID TAREA: ${id}`);
    this.idTarea = id;
    this.numeroArchivo = codArchivo;
    this.tareaProcedi = tareaProcedi;
    this.getUsuarioListar(tareaProcedi);

    this.ejerNumExpedi = `${this.verExpediente.ejercicio}/${this.verExpediente.numero}`;

    console.log(`ID ARCHIVO: ${this.numeroArchivo}`);
    console.log(`ID TAREA PROCEDI: ${this.tareaProcedi}`);
    this.getTemaDocumentoListar();
    this.expedientesService.getTareaTramiteExpVer(id).subscribe(
      tareatramiteexpedientever => this.tareatramiteexpedientever = tareatramiteexpedientever
    );
    this.descargafichero = `${environment.apiUrl}archivo/descarga/${this.numeroArchivo}`; // Reemplaza con la URL del archivo que deseas descargar
    for (let index = 0; index < this.tareatramiteexpedientelistar.length; index++) {
      const datos = this.tareatramiteexpedientelistar[index].fecInicio;
    }
  }

  public limpiaarchivofirmaEF() {
    this.archivofirmadoef = new ArchivoFirmadoEF();
  }

  async descargaArchivoFirmadoEFNuevo() {
    this.spinnervisiblefirma = false;

    if (this.archivofirmadoef.asunto && this.archivofirmadoef.prioridad && this.archivofirmadoef.texto) {
      this.expedientesService.getTipoFirma(this.idTarea).subscribe(
        data => console.log("MENSAJE DE RESPUESTA : " + data),
        (error: HttpErrorResponse) => {
          console.error("TIPO DE FIRMA  +++++++++++++++" + error.error.text);

          if (error.error.text == "ATENDIDA") {
            this.expedientesService.postArchivoFirmadoEF(this.archivofirmadoef, this.usuContrl, this.idTarea).subscribe(response => {
              //en esta parte ponemos el codigo que necesitemos
              Swal.fire('Envio de firma ATENDIDA realizado con exito!', '', 'success');
              this.limpiaarchivofirmaEF();
              this.sourceTareasTramite = new jqx.dataAdapter({
                dataType: 'json',
                dataFields: [
                  { name: 'numero', type: 'number' },
                  { name: 'descripcion', type: 'string' },
                  { name: 'fecInicio', type: 'string' },
                  { name: "fecFin", type: 'string' },
                  { name: "propuestaResolucion", type: 'string' },
                  { name: "usuario", type: 'string' },
                  { name: "firmado", type: 'string' },
                  { name: "fecPlazo", type: 'string' },
                  { name: "color", type: 'string' },
                  { name: "archivo", type: 'string' },
                  { name: 'tareaProcedimiento', type: 'any' },
                  { name: 'id', type: 'any' },
                  { name: 'tipAnexo', type: 'any' },
                  { name: 'docAport', type: 'any' },
                  { name: 'tipDocEni', type: 'any' },
                  { name: 'documentacion', type: 'any' },
                  { name: 'visible', type: 'any' },
                  { name: 'visible', type: 'any' },
                  { name: 'numRegis', type: 'any' },
                  { name: 'idHisDocum', type: 'any' },
                  { name: 'ejeNumNotif', type: 'any' },
                  { name: 'nombreArchivo', type: 'any' },
                  { name: 'idAnunc', type: 'any' },
                ],
                url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
                id: 'id',
              });
              this.spinnervisiblefirma = true;
            },
              (err: HttpErrorResponse) => {
                console.log('paso por error: ' + err.error.text);
                Swal.fire(err.error.message, '', 'warning')
                this.spinnervisiblefirma = true;
              },
            );
          }


          if (error.error.text == undefined) {
            Swal.fire('La Tarea de Procedimiento no tiene Proceso firmado')
          }
        }
      )
    } else {
      Swal.fire(`Debe rellenar todos los campos obligatorios.`)
    }
  }

  async descargaArchivoFirmadoEFDesatendido() {
    console.log("FIRMA DESATENDIDA")
    this.expedientesService.postArchivoFirmadoEFDesatendida(this.usuContrl, this.idTarea).subscribe(response => {
      //en esta parte ponemos el codigo que necesitemos
      Swal.fire('Envio de firma realizado con exito!', '', 'success');
      this.limpiaarchivofirmaEF();
      this.sourceTareasTramite = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          { name: 'numero', type: 'number' },
          { name: 'descripcion', type: 'string' },
          { name: 'fecInicio', type: 'string' },
          { name: "fecFin", type: 'string' },
          { name: "propuestaResolucion", type: 'string' },
          { name: "usuario", type: 'string' },
          { name: "firmado", type: 'string' },
          { name: "fecPlazo", type: 'string' },
          { name: "color", type: 'string' },
          { name: "archivo", type: 'string' },
          { name: 'tareaProcedimiento', type: 'any' },
          { name: 'id', type: 'any' },
          { name: 'tipAnexo', type: 'any' },
          { name: 'docAport', type: 'any' },
          { name: 'tipDocEni', type: 'any' },
          { name: 'documentacion', type: 'any' },
          { name: 'visible', type: 'any' },
          { name: 'visible', type: 'any' },
          { name: 'numRegis', type: 'any' },
          { name: 'idHisDocum', type: 'any' },
          { name: 'ejeNumNotif', type: 'any' },
          { name: 'nombreArchivo', type: 'any' },
          { name: 'idAnunc', type: 'any' },
        ],
        url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
        id: 'id',
      });


    },
      (err: HttpErrorResponse) => {

        console.log('paso por error: ' + err.error.text);
        Swal.fire(err.error.message, '', 'warning')    // AQUI GESTIONAMOS EL ERROR
      },
    );


  }


  async descargaArchivoFirmado() {
    console.log(this.descargaficheroFirmado);
    this.descargaficheroFirmado = await `${environment.apiUrl}archivo/firma/${this.numeroArchivo}/${this.usuContrl}/${this.idTarea}`; // Reemplaza con la URL del archivo que deseas descargar
    if (!this.numeroArchivo) {
      Swal.fire('Esta tarea No tiene ningún documento asociado')
    } else {
      this.http.get(this.descargaficheroFirmado).subscribe(response => {
      },
        (err: HttpErrorResponse) => {
          if (err.status == 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Firma realizado con exito`,
              showConfirmButton: false,
              timer: 2500
            });
            this.sourceTareasTramite = ({
              dataType: 'json',
              dataFields: [
                { name: 'numero', type: 'number' },
                { name: 'descripcion', type: 'string' },
                { name: 'fecInicio', type: 'string' },
                { name: "fecFin", type: 'string' },
                { name: "propuestaResolucion", type: 'string' },
                { name: "usuario", type: 'string' },
                { name: "firmado", type: 'string' },
                { name: "fecPlazo", type: 'string' },
                { name: "color", type: 'string' },
                { name: "archivo", type: 'string' },
                { name: 'tareaProcedimiento', type: 'any' },
                { name: 'id', type: 'any' },
                { name: 'tipAnexo', type: 'any' },
                { name: 'docAport', type: 'any' },
                { name: 'tipDocEni', type: 'any' },
                { name: 'documentacion', type: 'any' },
                { name: 'visible', type: 'any' },
                { name: 'visible', type: 'any' },
                { name: 'numRegis', type: 'any' },
                { name: 'idHisDocum', type: 'any' },
                { name: 'ejeNumNotif', type: 'any' },
                { name: 'nombreArchivo', type: 'any' },
                { name: 'idAnunc', type: 'any' },
              ],
              url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
              id: 'id',
            });
          } else {
            Swal.fire(err.error.message)
          }

          this.sourceTareasTramite = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              { name: 'numero', type: 'number' },
              { name: 'descripcion', type: 'string' },
              { name: 'fecInicio', type: 'string' },
              { name: "fecFin", type: 'string' },
              { name: "propuestaResolucion", type: 'string' },
              { name: "usuario", type: 'string' },
              { name: "firmado", type: 'string' },
              { name: "fecPlazo", type: 'string' },
              { name: "color", type: 'string' },
              { name: "archivo", type: 'string' },
              { name: 'tareaProcedimiento', type: 'any' },
              { name: 'id', type: 'any' },
              { name: 'tipAnexo', type: 'any' },
              { name: 'docAport', type: 'any' },
              { name: 'tipDocEni', type: 'any' },
              { name: 'documentacion', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'numRegis', type: 'any' },
              { name: 'idHisDocum', type: 'any' },
              { name: 'ejeNumNotif', type: 'any' },
              { name: 'nombreArchivo', type: 'any' },
              { name: 'idAnunc', type: 'any' },
            ],
            url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
            id: 'id',
          });
          console.log('paso por error: ' + err.error.message);
          this.refrescoSourceTareasTramite(this.idTramite);
        }
      )
    }
  }

  public resetvariables() {
    this.dniok = false;
    this.verTareasdelTramite = true;
    this.verformnuevatarea = false;
    this.verlistadotramitadores = false;
    this.nuevotramitador = false;
    this.verlistadotareas = true;
    this.verEditartareatramite = false;
    this.verNuevaNotifi = false;
    this.verGenerarSalida = false;
    this.borraDatosCrearNotifi()
  }

  public clickAtrasGenerarSalida() {
    this.verTareasdelTramite = true;
    this.verGenerarSalida = false;
    this.refrescoSourceTareasTramite(this.idTramite);
    this.limpiaGenerarSalida();

  }

  public clickGenerarSalida() {
    //this.verTareasdelTramite =false;
    //  this.verformnuevatarea =false;
    //  this.verlistadotramitadores = false;
    // this.nuevotramitador = false;
    // this.verlistadotareas = false;
    // this.verEditartareatramite = false;
    // this.verNuevaNotifi = false;
    // this.verGenerarSalida = true;
  }

  public clickNuevaNotificacion() {
    // Inicializar el objeto de notificación con valores por defecto
    this.creanotificacion = new CrearNotificacion();

    // Configurar valores iniciales
    this.creanotificacion.ejeNotif = this.fecha.getFullYear();
    this.creanotificacion.situacion = 1;
    this.creanotificacion.usuContr = this.usuContrl!;
    this.creanotificacion.ejeExped = this.verExpediente.ejercicio;
    this.creanotificacion.numExped = this.verExpediente.numero;

    // Inicializar campos obligatorios con valores por defecto
    this.creanotificacion.forNotif = 0;
    this.creanotificacion.notificador = 0;
    this.creanotificacion.motNotif = '';
    this.creanotificacion.receptor = 0;
    this.creanotificacion.observacion = '';
    this.creanotificacion.dni = '';

    // Inicializar campos numéricos
    this.creanotificacion.numNotif = 0;
    this.creanotificacion.numBop = 0;
    this.creanotificacion.bop = 0;
    this.creanotificacion.numEnvioTeu = '';
    this.creanotificacion.codArchiAcuse = '';
    this.creanotificacion.codArchi = this.identificadorFicheroSubido;

    // Inicializar campos de texto
    this.creanotificacion.desNotificador = '';
    this.creanotificacion.desMotNotif = '';
    this.creanotificacion.desSituacion = '';
    this.creanotificacion.tipVial = '';
    this.creanotificacion.desVial = '';
    this.creanotificacion.letInfer = '';
    this.creanotificacion.bloque = '';
    this.creanotificacion.portal = '';
    this.creanotificacion.escalera = '';
    this.creanotificacion.planta = '';
    this.creanotificacion.puerta = '';
    this.creanotificacion.localidad = '';
    this.creanotificacion.domicilio = '';

    // Inicializar campos numéricos adicionales
    this.creanotificacion.numInfer = 0;
    this.creanotificacion.numSuper = 0;
    this.creanotificacion.codPosta = 0;
    this.creanotificacion.codProvi = 0;
    this.creanotificacion.codMunic = 0;
    this.creanotificacion.numRegisSalid = 0;

    // Las fechas se inicializarán cuando sea necesario
    // this.creanotificacion.fecRecNotif = new Date();
    // this.creanotificacion.fecArchi = new Date();
    // this.creanotificacion.fecRegistSalid = new Date();
    // this.creanotificacion.fecEnvio = new Date();
    // this.creanotificacion.fecCaduc = new Date();
    // this.creanotificacion.fecEmiBop = new Date();
    // this.creanotificacion.fecPubBop = new Date();

    // Inicializar fecha automáticamente
    this.inicializarFechaNotificacion();

    // Limpiar forma de notificación para que se cargue desde el interesado seleccionado
    this.textoFormaNotif = '';

    // Limpiar datos del DNI
    this.dniok = false;
    this.consultadni = new ConsultaDni();

    // Limpiar cache de validación
    this.limpiarCacheValidacion();

    console.log(`Expediente ---------------------------------------------------------- : ${this.idExpediente}`);
    console.log(`BOP : ${this.creanotificacion.ejeNotif}`);
    console.log(`Datos iniciales de notificación:`, this.creanotificacion);
  }


  public cambioYearEjercicio() {
    if (this.creanotificacion.fecNotif) {
      console.log(`Fecha de notificación: ${this.creanotificacion.fecNotif}`);

      // Convertir la fecha a string y extraer el año
      const fechaString = this.creanotificacion.fecNotif.toString();
      if (fechaString.length >= 4) {
        const soloyear: string = fechaString.substring(0, 4);
        this.creanotificacion.ejeNotif = parseInt(soloyear);
        console.log(`Año del ejercicio actualizado: ${this.creanotificacion.ejeNotif}`);
      } else {
        console.warn('La fecha de notificación no tiene el formato esperado');
        this.creanotificacion.ejeNotif = this.fecha.getFullYear();
      }
    } else {
      console.warn('No hay fecha de notificación seleccionada');
      this.creanotificacion.ejeNotif = this.fecha.getFullYear();
    }

    // Limpiar cache de validación ya que cambió la fecha
    this.limpiarCacheValidacion();
  }

  public fechNotifi!: any;

  public ejerNotifi!: string;
  public numeroNotifi!: string;
  public dniNotifi!: string;
  public desPerEntidNotifi!: string;
  public verInfoNotifi: boolean = false;
  public desMotNotif!: string;
  public observacionNotifi!: string;
  public veoenviar: boolean = true;
  public veoEnviarNotifica: boolean = false;
  public veoSincronizarNotifica: boolean = false;
  public envioNotifica: EnvioNotificaInfo | null = null;
  public veorecepcionar: boolean = true;
  public veopublicar: boolean = true;
  public veodevolver: boolean = true;
  public veoanular: boolean = true;
  public veoborrar: boolean = true;
  public veoteu: boolean = true;
  public veoReenviarTeu: boolean = false;
  public mostrarBotonDescargaTEU: boolean = false;
  public mostrarBotonDescargaTEUPrincipal: boolean = false;
  public mostrarValidacionesTEU: boolean = false; // Control para mostrar validaciones visuales

  public motNotif!: any;
  public receptor!: any;
  public notificador!: any;
  public situacion!: any;
  public fechaprueba!: any;
  public fechaenvioTEU!: any


  public clicknotificacionNuevo(event) {
    this.descargoTEU = false;
    if (event.args.row.bounddata.fecEmiBop) {
      // this.fechaenvioTEU = event.args.row.bounddata.fecRegistSalid.substring(0,10)
      this.fechaenvioTEU = event.args.row.bounddata.fecEmiBop.substring(0, 10)

    }
    let fechahoy: any = new Date().toLocaleDateString()
    this.fechaprueba = event.args.row.bounddata.fecEnvio;
    console.log(" fecha selected :  ==============> " + this.creanotificacion.fecEnvio)
    console.log(" fecha envio :  ==============> " + this.fechaprueba)
    console.log(" fecha envio TEU :  ==============> " + this.fechaenvioTEU)
    console.log("valor MOTNOTIF DE BASE : " + event.args.row.bounddata.desMotNotif);

    this.situacion = event.args.row.bounddata.desSituacion;
    this.motNotif = event.args.row.bounddata.desMotNotif;
    this.receptor = event.args.row.bounddata.desReceptor;
    this.notificador = event.args.row.bounddata.desNotificador;

    // console.log("NOTIFICADOR : " +this.notificador );

    this.vernotifi(event.args.row.bounddata.idNotif, false) // Modo editar por defecto


    this.verInfoNotifi = true;
    this.desMotNotif = event.args.row.bounddata.desMotNotif;
    this.desPerEntidNotifi = event.args.row.bounddata.personaEntidad.desPerEntid;
    this.dniNotifi = event.args.row.bounddata.personaEntidad.numDocum;
    this.ejerNotifi = event.args.row.bounddata.ejeNotif;
    this.numeroNotifi = event.args.row.bounddata.numNotif;
    this.idNotificacion = event.args.row.bounddata.idNotif;
    // this.fechNotifi = event.args.row.bounddata.fecNotif;
    this.observacionNotifi = event.args.row.bounddata.observacion;
    this.desSituacion = event.args.row.bounddata.desSituacion;


    // gestion de fecha de Notificacion

    let anio: string = event.args.row.bounddata.fecNotif.toString().substring(0, 4);
    let mes: string = event.args.row.bounddata.fecNotif.toString().substring(5, 7);
    let dia: string = event.args.row.bounddata.fecNotif.toString().substring(8, 10);
    let fechaordenada: string = dia + "/" + mes + "/" + anio;
    this.fechNotifi = fechaordenada


    console.log("id notificacion: " + this.idNotificacion);
    console.log("id notificacion de base: " + event.args.row.bounddata.idNotif);
    console.log("Fecha denotificacion: " + event.args.row.bounddata.fechNotifi);


    switch (event.args.row.bounddata.desSituacion) {
      case "GENERADA":
        this.veoenviar = true
        this.veoborrar = true
        this.veorecepcionar = false
        this.veodevolver = false
        this.veopublicar = false  // cambiar despues de las pruebas a false
        this.veoanular = true
        this.veoteu = false
        break;
      case "ENVIADA":
        this.veoenviar = false
        this.veoborrar = false
        this.veorecepcionar = true
        this.veodevolver = true
        this.veopublicar = false
        this.veoanular = true
        this.veoteu = false
        break;
      case "RECEPCIONADA":
        this.veoenviar = false
        this.veoborrar = false
        this.veorecepcionar = false
        this.veodevolver = false
        this.veopublicar = false
        this.veoanular = true
        this.veoteu = false
        break;
      case "ANULADA":
        this.veoenviar = false
        this.veoborrar = false
        this.veorecepcionar = false
        this.veodevolver = false
        this.veopublicar = false
        this.veoanular = false
        this.veoteu = false
        break;
      case "DEVUELTA":
        this.veoenviar = false
        this.veoborrar = false
        this.veorecepcionar = false
        this.veodevolver = false
        this.veopublicar = true
        this.veoanular = true
        this.veoteu = true
        break;


    }    // datos para ver los datos en editar notificacion

    this.creanotificacion.id = event.args.row.bounddata.id;
    this.creanotificacion.observacion = event.args.row.bounddata.observacion;
    this.notificacionver.ejeNotif = event.args.row.bounddata.ejeNotif;
    this.notificacionver.numNotif = event.args.row.bounddata.numNotif;
    this.notificacionver.fecNotif = event.args.row.bounddata.fecNotif;
    this.creanotificacion.fecRecNotif = event.args.row.bounddata.fecRecNotif;
    this.creanotificacion.forNotif = 1;
    this.creanotificacion.notificador = event.args.row.bounddata.personaEntidad.numDocum;

    this.fechasNotifi(event.args.row.bounddata.fecEnvio, event.args.row.bounddata.fecRecNotif, event.args.row.bounddata.fecPubBop, event.args.row.bounddata.fecEmiBop)


  }

  // ============================================
  // NUEVA LÓGICA PARA CLICK SIMPLE Y DOBLE CLICK
  // ============================================

  /**
   * Maneja el click simple en una fila de notificaciones
   * Solo selecciona la fila y habilita los botones de acción
   */
  public onNotificacionClick(event: any) {
    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata;

    if (!rowData) {
      return;
    }

    this.actualizarCheckboxNotificaciones(rowIndex);
    this.habilitarBotonesNotificacion(rowData);
    this.cargarDatosNotificacionSeleccionada(rowData);
  }

  /**
   * Maneja el doble click en una fila de notificaciones
   * Abre el modal en modo edición
   */
  public onNotificacionDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      const idNotificacion = rowData.idNotif;
      // Abrir modal en modo edición
      this.editarNotificacion(idNotificacion);
    });
  }



  /**
   * Habilita los botones de acción según el estado de la notificación
   */
  private habilitarBotonesNotificacion(rowData: any) {
    console.log('=== HABILITAR BOTONES NOTIFICACIÓN ===');
    console.log('rowData:', rowData);

    this.descargoTEU = false;
    if (rowData.fecEmiBop) {
      this.fechaenvioTEU = rowData.fecEmiBop.substring(0, 10);
    }

    this.fechaprueba = rowData.fecEnvio;
    const estadoNotificacion = rowData.desSituacion || rowData.situacion || rowData.desSituacionNotif;

    this.situacion = estadoNotificacion;
    this.motNotif = rowData.desMotNotif;
    this.receptor = rowData.desReceptor;
    this.notificador = rowData.desNotificador;

    this.verInfoNotifi = true;
    this.desMotNotif = rowData.desMotNotif;
    this.desPerEntidNotifi = rowData.personaEntidad?.desPerEntid || '';
    this.dniNotifi = rowData.personaEntidad?.numDocum || '';
    this.ejerNotifi = rowData.ejeNotif;
    this.numeroNotifi = rowData.numNotif;
    this.idNotificacion = rowData.idNotif;
    this.observacionNotifi = rowData.observacion;

    const estadoString = resolverEstadoNotificacion(estadoNotificacion);
    this.desSituacion = estadoString;

    if (estadoString === 'DEVUELTA') {
      const tieneNumeroTeu = rowData.numEnvioTeu &&
        (typeof rowData.numEnvioTeu === 'string' ?
          rowData.numEnvioTeu.trim() !== '' :
          rowData.numEnvioTeu > 0);
      if (!tieneNumeroTeu) {
        this.veoenviar = false;
        this.veoEnviarNotifica = false;
        this.veoSincronizarNotifica = false;
        this.veoanular = true;
        this.veoborrar = false;
        this.veorecepcionar = false;
        this.veodevolver = false;
        this.veopublicar = false;
        this.veoteu = true;
        this.veoReenviarTeu = false;
        this.mostrarBotonDescargaTEUPrincipal = false;
      } else {
        this.veoenviar = false;
        this.veoEnviarNotifica = false;
        this.veoSincronizarNotifica = false;
        this.veoanular = true;
        this.veoborrar = false;
        this.veorecepcionar = false;
        this.veodevolver = false;
        this.veopublicar = true;
        this.veoteu = false;
        this.veoReenviarTeu = true;
        this.mostrarBotonDescargaTEUPrincipal = true;
      }
    } else {
      const botones = botonesPorEstadoNotificacion(estadoString, rowData);
      this.veoenviar = botones.veoenviar;
      this.veoEnviarNotifica = botones.veoEnviarNotifica;
      this.veoSincronizarNotifica = botones.veoSincronizarNotifica;
      this.veoanular = botones.veoanular;
      this.veoborrar = botones.veoborrar;
      this.veorecepcionar = botones.veorecepcionar;
      this.veodevolver = botones.veodevolver;
      this.veopublicar = botones.veopublicar;
      this.veoteu = botones.veoteu;
      this.veoReenviarTeu = botones.veoReenviarTeu;
      this.mostrarBotonDescargaTEUPrincipal = botones.mostrarBotonDescargaTEUPrincipal;
    }

    this.cargarEnvioNotificaActivo();
  }

  private cargarEnvioNotificaActivo(): void {
    if (!this.idNotificacion) {
      this.envioNotifica = null;
      return;
    }
    this.notificacionesService.consultarEnvioNotifica(this.idNotificacion).subscribe({
      next: (envio) => {
        this.envioNotifica = envio ? {
          idEnvioExterno: envio.idEnvioExterno,
          estadoNotifica: envio.estadoNotifica,
          fecEnvio: envio.fecEnvio,
          idAcuseExterno: envio.idAcuseExterno
        } : null;
      },
      error: () => {
        this.envioNotifica = null;
      }
    });
  }

  /**
   * Carga los datos de la notificación seleccionada para mostrar en la interfaz
   */
  private cargarDatosNotificacionSeleccionada(rowData: any) {
    // Formatear fecha de notificación
    if (rowData.fecNotif) {
      let anio: string = rowData.fecNotif.toString().substring(0, 4);
      let mes: string = rowData.fecNotif.toString().substring(5, 7);
      let dia: string = rowData.fecNotif.toString().substring(8, 10);
      let fechaordenada: string = dia + "/" + mes + "/" + anio;
      this.fechNotifi = fechaordenada;
    }
  }

  // ============================================
  // FIN NUEVA LÓGICA
  // ============================================

  // ============================================
  // EJEMPLO DE IMPLEMENTACIÓN PARA OTRAS TABLAS
  // ============================================

  /**
   * Ejemplo: Maneja el click simple en una fila de trámites
   * Solo selecciona la fila
   */
  public onTramiteClick(event: any) {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTramite"]', (rowData) => {
      // Lógica específica para trámites
    });
  }

  /**
   * Ejemplo: Maneja el doble click en una fila de trámites
   * Abre el modal de edición
   */
  public onTramiteDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos del trámite para edición
      this.editartramiteexp.id = rowData.id;
      this.editartramiteexp.numero = rowData.numero;
      this.editartramiteexp.descripcion = rowData.descripcion;
      this.editartramiteexp.fase = rowData.fase;
      
      // Convertir la fecha al formato correcto para el input de fecha
      this.editartramiteexp.fecTramite = this.formatearFechaParaInput(rowData.fecTramite);
      
      this.faseEditTra = rowData.fase;
      this.idTramite = rowData.id;

      // Abrir modal de edición usando el servicio
      this.modalManagerService.openModal('editarTramiteModal');
    });
  }

  public onTramitadorDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Cargar datos del tramitador para edición
      this.idTramitador = rowData.id;
      
      // Mostrar información del tramitador seleccionado
      this.notificationService.info(`Tramitador seleccionado: ${rowData.nombre || 'Sin nombre'}`);
      
      // TODO: Añadir lógica para abrir el modal de edición de tramitador
      console.log('Datos del tramitador seleccionado:', rowData);
    });
  }

  /**
   * Ejemplo: Maneja el click simple en una fila de tareas
   * Solo selecciona la fila
   */
  public onTareaClick(event: any) {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTareasTramite"]', (rowData) => {
      // Aquí puedes agregar lógica específica para tareas
      console.log('Tarea seleccionada:', rowData);
    });
  }

  public onTareaDoubleClick(event: any) {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      // Abrir modal de edición de tarea
      this.clicktarea(rowData.id, rowData.codArchivo, rowData.tareaProcedi);
    });
  }

  /**
   * Actualiza el checkbox de notificaciones usando ViewChild
   * @param rowIndex Índice de la fila seleccionada
   */
  private actualizarCheckboxNotificaciones(rowIndex: number) {
    try {
      const gridElement = document.querySelector('#gridNotificaciones') as HTMLElement;
      if (gridElement) {
        const radioButtons = gridElement.querySelectorAll('input[type="radio"]');

        // Desmarcar todos los radio buttons primero
        radioButtons.forEach((radio: Element) => {
          (radio as HTMLInputElement).checked = false;
        });

        // Estrategia 1: Buscar filas con clase de selección específica de jqxGrid
        const selectedRows = gridElement.querySelectorAll('.jqx-grid-row-selected, .jqx-grid-row-selected-alt');

        let targetRowIndex = -1;

        if (selectedRows.length > 0) {
          // Encontrar el índice de la primera fila seleccionada
          const allRows = gridElement.querySelectorAll('tr');
          for (let i = 0; i < allRows.length; i++) {
            if (allRows[i].classList.contains('jqx-grid-row-selected') ||
              allRows[i].classList.contains('jqx-grid-row-selected-alt')) {
              targetRowIndex = i;
              break;
            }
          }
        }

        // Estrategia 2: Si no encontramos por clase, buscar por atributos de datos
        if (targetRowIndex === -1) {
          const allRows = gridElement.querySelectorAll('tr');
          for (let i = 0; i < allRows.length; i++) {
            const row = allRows[i];
            // Buscar filas que tengan atributos de selección de jqxGrid
            if (row.getAttribute('aria-selected') === 'true' ||
              row.getAttribute('data-selected') === 'true' ||
              row.style.backgroundColor.includes('240') ||
              row.style.backgroundColor.includes('245')) {
              targetRowIndex = i;
              break;
            }
          }
        }

        // Estrategia 3: Si aún no encontramos, usar el índice proporcionado pero invertido
        if (targetRowIndex === -1) {
          // En jqxGrid, a veces el orden visual es inverso al orden de datos
          targetRowIndex = radioButtons.length - 1 - rowIndex;
        }

        // Marcar el radio button de la fila objetivo
        if (targetRowIndex >= 0 && targetRowIndex < radioButtons.length) {
          (radioButtons[targetRowIndex] as HTMLInputElement).checked = true;

          // Forzar la actualización visual
          (radioButtons[targetRowIndex] as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } catch (error) { }
  }



  public fechaordenadafenvio: any;
  public fechaordenadafrecep: any;
  public fechaordenadafpubli: any;
  public fechaordenadafemision: any;

  public fechasNotifi(fenvio: any, frecep: any, fpubli: any, femision: any) {
    if (fenvio == undefined || frecep == undefined || fpubli == undefined || femision == undefined) {
      this.fechaordenadafenvio = "";
      this.fechaordenadafrecep = "";
      this.fechaordenadafpubli = "";
      this.fechaordenadafemision = "";


    }

    console.log("Fechas : " + fenvio)
    if (fenvio) {
      let recorteFechafenvio: string = fenvio.substring(0, 10);
      let aniofenvio: string = fenvio.substring(0, 4);
      let mesfenvio: string = fenvio.substring(5, 7);
      let diafenvio: string = fenvio.substring(8, 10);
      //let fechaordenadafenvio:string = diafenvio+"-"+mesfenvio+"-"+aniofenvio;
      let fechaordenadafenvio: string = aniofenvio + "-" + mesfenvio + "-" + diafenvio;

      this.fechaordenadafenvio = fechaordenadafenvio;
      console.log("FEcha Envio : " + this.fechaordenadafenvio);
    }
    if (frecep) {
      let recorteFechafrecep: string = frecep.substring(0, 10);
      let aniofrecep: string = frecep.substring(0, 4);
      let mesfrecep: string = frecep.substring(5, 7);
      let diafrecep: string = frecep.substring(8, 10);
      let fechaordenadafrecep: string = diafrecep + "-" + mesfrecep + "-" + aniofrecep;
      this.fechaordenadafrecep = fechaordenadafrecep;
    }

    if (fpubli) {
      let recorteFechafpubli: string = fpubli.substring(0, 10);
      let aniofpubli: string = fpubli.substring(0, 4);
      let mesfpubli: string = fpubli.substring(5, 7);
      let diafpubli: string = fpubli.substring(8, 10);
      //let fechaordenadafpubli:string = diafpubli+"-"+mesfpubli+"-"+aniofpubli;
      let fechaordenadafpubli: string = aniofpubli + "-" + mesfpubli + "-" + diafpubli;
      this.fechaordenadafpubli = fechaordenadafpubli;
      console.log("FEcha publicacion : " + this.fechaordenadafpubli);

    }
    if (femision) {
      console.log("ESTAMOS POR AQUI : " + femision);
      // let recorteFechafemision:string = femision.substring(0,10);
      let aniofemision: string = femision.substring(0, 4);
      let mesfemision: string = femision.substring(5, 7);
      let diafemision: string = femision.substring(8, 10);
      let fechaordenadafemision: string = diafemision + "-" + mesfemision + "-" + aniofemision;
      this.fechaordenadafemision = fechaordenadafemision;
    }


  }

  public vertramite: boolean = true;
  public botonVerNotifi: boolean = true;

  public cancelarnuevotramite() {
    this.nuevotramite = false;
    this.limpiarFormularioTramite();
    this.FechaSistema();
  }

  public limpiarFormularioTramite() {
    this.creartramiteexp = new CrearTramiteExp();
    this.nuevotramite = false;
    // Establecer la fecha actual por defecto
    const today = new Date();
    this.creartramiteexp.fecTramite = today.toISOString().split('T')[0];
  }

  public enviandoTramite: boolean = false;
  public veoTramitadores: boolean = false;

  public veotramitadores() {
    var cambiatexto = document.getElementById("tramite");

    if (cambiatexto) {
      cambiatexto.innerHTML = "Tramitadores";
    }

    this.botonVerNotifi = false;
    this.vertramite = false;
    this.nuevotramite = false;
    this.verTareasdelTramite = false;
    this.verAccionesdeTarea = false;
    this.veonotificaciones = false;
    this.veoTramitadores = true;
    this.recargarSourceTramitadores();

  }

  public verNotificaciones() {

    var cambiatexto = document.getElementById("tramite");

    if (cambiatexto) {
      cambiatexto.innerHTML = "Notificaciones";
    }

    this.botonVerNotifi = false;
    this.vertramite = false;
    this.nuevotramite = false;
    this.verTareasdelTramite = false;
    this.verAccionesdeTarea = false;
    this.veonotificaciones = true;
    this.verInfoNotifi = false; // No mostrar botones hasta seleccionar una notificación
    this.idNotificacion = 0; // Resetear la notificación seleccionada

    //this.refresSourceListarNotifi();

    setTimeout(() => {
      console.log("REFRESCO DATOS DEL NOTIFICADOR *********************")
      this.sourceListarNotifi = new jqx.dataAdapter({
        dataType: 'json',
        dataFields: [
          { name: 'desMotNotif', type: 'string' },
          { name: 'observacion', type: 'string' },
          { name: 'desSituacion', type: 'string' },
          { name: 'fecNotif', type: 'string' },
          { name: "fecRecNotif", type: 'string' },
          { name: "personaEntidad", type: 'string' },
          { name: "usuario", type: 'string' },
          { name: "ejeNotif", type: 'number' },
          { name: 'idNotif', type: 'number' },
          { name: 'tareaProcedimiento', type: 'any' },
          { name: 'numNotif', type: 'number' },
          { name: 'numDocum', type: 'any' },
          { name: 'desPerEntid', type: 'any' },
          { name: 'fecEnvio', type: 'string' },
          { name: 'numTarea', type: 'any' },
          { name: 'desTramite', type: 'any' },
          { name: 'bop', type: 'any' },
          { name: 'numBop', type: 'any' },
          { name: 'fecEmiBop', type: 'any' },
          { name: 'fecPubBop', type: 'any' },
          { name: 'numEnvioTeu', type: 'any' },
          { name: 'desReceptor', type: 'any' },
          { name: 'desNotificador', type: 'any' },
          { name: 'situacion', type: 'any' },
          { name: 'fecRegistSalid', type: 'any' },
          { name: 'acciones', type: 'any' },
        ],
        url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
        sortcolumn: 'numNotif',
        sortdirection: 'desc'
      });
    }, 500)


  }

  public leoMetadatos(codfiche: number) {

    this.expedientesService.getMetadatosVer(codfiche).subscribe(
      vermetadatos => this.vermetadatos = vermetadatos
    );


  }

  public noverNotificaciones() {
    var cambiatexto = document.getElementById("tramite");
    if (cambiatexto) {
      cambiatexto.innerHTML = "Trámite";
    }
    this.veoTramitadores = false;
    this.botonVerNotifi = true;
    this.vertramite = true;
    this.nuevotramite = false;
    this.verInfoNotifi = false;
    this.verTareasdelTramite = false;
    this.verAccionesdeTarea = true;
    this.veonotificaciones = false;
  }

  // ----------------------------------
  //  Seccion de Notificaciones :
  //------------------------------------

  /*** consultas para  formulario de creacion de notificaciones de expedientes*/
  public listadodeNotificaciones() {
    this.notificacionesService.getReceptorNofitiListar().subscribe(
      receptornotifilistar => this.receptornotifilistar = receptornotifilistar
    )

    this.notificacionesService.getMotivoNofitiListar().subscribe(
      motivonotificacioneslistar => this.motivonotificacioneslistar = motivonotificacioneslistar
    )

    this.notificacionesService.getNotificadorListar().subscribe(
      notificadorlistar => this.notificadorlistar = notificadorlistar
    )
  }

  public crearModeloTeuFichero() {
    // Activar validaciones visuales
    this.mostrarValidacionesTEU = true;

    // Marcar el formulario como submitted para activar las validaciones visuales
    if (this.teuFormRef) {
      this.teuFormRef.submitted = true;
    }

    // Validar campos obligatorios
    if (!this.validarCamposObligatoriosTEU()) {
      // Mostrar mensaje de error y no continuar
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos obligatorios marcados con *'
      });
      return;
    }

    // LOG: Datos que se van a enviar al backend
    console.log('[TEU] Enviando datos completos del formulario TEU:', {
      modeloteucrear: this.modeloteucrear,
      idNotificacion: this.idNotificacion,
      TextoLegal: this.TextoLegal
    });

    this.IDModel = this.modeloteucrear.idModel;
    this.paraTextoLegar();

    this.notificacionesService.crearModeloTeuFichero(this.modeloteucrear, this.idNotificacion, this.TextoLegal)
      .subscribe({
        next: (response) => {
          // LOG: Respuesta exitosa del servicio TEU
          console.log('[TEU] Respuesta exitosa del servicio crearModeloTeuFichero:', response);
          // Procesar respuesta exitosa
          this.procesarRespuestaExitosaTEU();
        },
        error: (error: HttpErrorResponse) => {
          // LOG: Error del servicio TEU
          console.error('[TEU] Error del servicio crearModeloTeuFichero:', error);
          this.procesarErrorTEU(error);
        }
      });
  }

  private validarCamposObligatoriosTEU(): boolean {
    console.log('[TEU] Validando campos obligatorios...');
    console.log('[TEU] Valores actuales:', {
      fecSolic: this.modeloteucrear.fecSolic,
      fecGener: this.modeloteucrear.fecGener,
      fecFirma: this.modeloteucrear.fecFirma,
      idMater: this.modeloteucrear.idMater,
      idModel: this.modeloteucrear.idModel,
      procedimiento: this.modeloteucrear.procedimiento,
      forPubli: this.modeloteucrear.forPubli
    });

    const camposObligatorios = [
      {
        campo: this.modeloteucrear.fecSolic,
        nombre: 'Fecha de Solicitud',
        esFecha: true
      },
      {
        campo: this.modeloteucrear.fecGener,
        nombre: 'Fecha de Generación',
        esFecha: true
      },
      {
        campo: this.modeloteucrear.fecFirma,
        nombre: 'Fecha de Firma',
        esFecha: true
      },
      {
        campo: this.modeloteucrear.idMater,
        nombre: 'Materia',
        esFecha: false
      },
      {
        campo: this.modeloteucrear.idModel,
        nombre: 'Modelo',
        esFecha: false
      },
      {
        campo: this.modeloteucrear.procedimiento,
        nombre: 'Procedimiento',
        esFecha: false
      },
      {
        campo: this.modeloteucrear.forPubli,
        nombre: 'Forma de Publicación',
        esFecha: false
      }
    ];

    const camposFaltantes = camposObligatorios.filter(item => {
      if (item.esFecha) {
        // Para fechas, verificar si está vacío, null, undefined, es una cadena vacía o es una fecha inválida
        return !item.campo ||
          item.campo === '' ||
          item.campo === null ||
          item.campo === undefined ||
          (item.campo instanceof Date && isNaN(item.campo.getTime())); // Fecha inválida
      } else {
        // Para otros campos, verificar si está vacío
        return !item.campo;
      }
    });

    if (camposFaltantes.length > 0) {
      console.log('[TEU] Campos faltantes:', camposFaltantes.map(item => item.nombre));
      return false;
    }

    return true;
  }

  private procesarRespuestaExitosaTEU(): void {
    // Actualizar la notificación con la fecha de envío a TEU y todos los datos necesarios
    const fechaActual = new Date().toISOString().split('T')[0];

    // Crear un objeto con todos los datos necesarios para la actualización
    const datosActualizacion = {
      idNotif: this.idNotificacion,
      fecEnvio: new Date(fechaActual),
      usuContr: this.usuContrl || '',
      // Agregar datos adicionales del formulario TEU
      email: this.modeloteucrear.email,
      url: this.modeloteucrear.url,
      indMater: this.modeloteucrear.idMater,
      fecGener: this.modeloteucrear.fecGener,
      fecSolic: this.modeloteucrear.fecSolic,
      fecFirma: this.modeloteucrear.fecFirma,
      forPubli: this.modeloteucrear.forPubli,
      procedimiento: this.modeloteucrear.procedimiento,
      idModel: this.modeloteucrear.idModel,
      incLgt: this.modeloteucrear.incLgt,
      texPlura: this.modeloteucrear.texPlura,
      datPerso: this.modeloteucrear.datPerso,
      edicionManual: true
    };

    // LOG: Datos que se van a enviar al backend para actualizar notificación
    console.log('[TEU] Enviando actualización de notificación a backend:', {
      url: `${environment.apiUrl}notificacion/editar/${this.idNotificacion}`,
      body: datosActualizacion
    });

    this.notificacionesService.editarNotificacion(datosActualizacion as any, this.idNotificacion)
      .subscribe({
        next: (response) => {
          // LOG: Respuesta exitosa del backend
          console.log('[TEU] Respuesta exitosa del backend al editar notificación:', response);

          // Actualizar source y forzar recarga completa
          this.actualizarSourceNotificaciones();

          // Configurar variables de descarga
          this.descargoTEU = true;
          this.verxml = true;
          this.descargaXml();
          this.mostrarBotonDescargaTEU = true;
          this.mostrarBotonDescargaTEUPrincipal = true; // Habilitar el botón principal

          // Cerrar el modal automáticamente primero
          this.cerrarModalTEU();

          // Forzar recarga completa de la vista después de cerrar el modal
          setTimeout(() => {
            console.log('[TEU] Forzando recarga completa de la vista...');
            this.refresSourceListarNotifi();
            this.cdr.detectChanges();
          }, 300);

          // Mostrar mensaje de éxito después de cerrar el modal
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha generado el Modelo T.E.U. correctamente.'
            });
          }, 500);
        },
        error: (error) => {
          // LOG: Error recibido del backend
          console.error('[TEU] Error al actualizar notificación en backend:', error);
          // Continuar con el proceso aunque falle la actualización de fecha

          // Actualizar source y forzar recarga completa
          this.actualizarSourceNotificaciones();

          // Configurar variables de descarga
          this.descargoTEU = true;
          this.verxml = true;
          this.descargaXml();
          this.mostrarBotonDescargaTEU = true;
          this.mostrarBotonDescargaTEUPrincipal = true; // Habilitar el botón principal

          // Cerrar el modal automáticamente primero
          this.cerrarModalTEU();

          // Forzar recarga completa de la vista después de cerrar el modal
          setTimeout(() => {
            console.log('[TEU] Forzando recarga completa de la vista (error)...');
            this.refresSourceListarNotifi();
            this.cdr.detectChanges();
          }, 300);

          // Mostrar mensaje de éxito después de cerrar el modal
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha generado el Modelo T.E.U. correctamente.'
            });
          }, 500);
        }
      });
  }

  private procesarErrorTEU(error: HttpErrorResponse): void {
    // LOG: Error recibido del servicio TEU
    console.log('[TEU] Error recibido del servicio TEU:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error
    });

    // Si el status es 200, significa que fue exitoso pero Angular lo interpreta como error
    // porque probablemente el backend devuelve XML en lugar de JSON
    if (error.status === 200) {
      console.log('[TEU] Status 200 detectado - procesando como éxito');
      this.xmlTeu = error.error?.text || error.error;
      this.xmlDescargado = error.error?.text || error.error;
      this.procesarRespuestaExitosaTEU();
    } else {
      console.error('[TEU] Error real del servicio TEU:', error);
      this.verxml = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha generado el Modelo T.E.U.'
      });
    }
  }

  private actualizarSourceNotificaciones(): void {
    console.log('[TEU] Actualizando source de notificaciones...');

    // Crear nuevo dataAdapter
    this.sourceListarNotifi = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'desMotNotif', type: 'string' },
        { name: 'observacion', type: 'string' },
        { name: 'desSituacion', type: 'string' },
        { name: 'fecNotif', type: 'string' },
        { name: "fecRecNotif", type: 'string' },
        { name: "personaEntidad", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "ejeNotif", type: 'number' },
        { name: 'idNotif', type: 'number' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'numNotif', type: 'number' },
        { name: 'numDocum', type: 'any' },
        { name: 'desPerEntid', type: 'any' },
        { name: 'fecEnvio', type: 'string' },
        { name: 'numTarea', type: 'any' },
        { name: 'desTramite', type: 'any' },
        { name: 'bop', type: 'any' },
        { name: 'numBop', type: 'any' },
        { name: 'fecEmiBop', type: 'any' },
        { name: 'fecPubBop', type: 'any' },
        { name: 'numEnvioTeu', type: 'any' },
        { name: 'desReceptor', type: 'any' },
        { name: 'desNotificador', type: 'any' },
        { name: 'situacion', type: 'any' },
        { name: 'fecRegistSalid', type: 'any' },
        { name: 'acciones', type: 'any' },
      ],
      url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
      sortcolumn: 'numNotif',
      sortdirection: 'desc'
    });

    // Forzar la actualización del grid
    setTimeout(() => {
      if (this.gridNotificaciones) {
        console.log('[TEU] Forzando actualización del grid de notificaciones...');
        this.gridNotificaciones.updatebounddata();
        this.gridNotificaciones.refreshdata();

        // Después de actualizar el grid, verificar si hay una notificación seleccionada
        // y actualizar el estado del botón de descarga TEU
        if (this.idNotificacion) {
          setTimeout(() => {
            const rowData = this.gridNotificaciones.getrowdata(this.idNotificacion);
            if (rowData) {
              console.log('[TEU] Actualizando botones para notificación:', rowData);
              this.habilitarBotonesNotificacion(rowData);
            }
          }, 200);
        }
      }

      // Forzar detección de cambios
      this.cdr.detectChanges();
    }, 100);

    console.log('[TEU] Source de notificaciones actualizado');
  }

  private limpiarFormularioTEU(): void {
    console.log('[TEU] Limpiando formulario TEU...');

    this.modeloteucrear = new ModeloTeuCrear();
    this.mostrarBotonDescargaTEU = false;
    this.mostrarBotonDescargaTEUPrincipal = false;

    // Resetear validaciones visuales
    this.mostrarValidacionesTEU = false;

    // Limpiar errores visuales del formulario (ngForm)
    if (this.teuFormRef) {
      console.log('[TEU] Limpiando formulario ngForm...');
      this.teuFormRef.submitted = false;
      // Para ngForm, solo necesitamos resetear el submitted
      // Los campos se resetean automáticamente al crear un nuevo ModeloTeuCrear
    }

    // Limpiar clases de error de los campos
    const formElements = document.querySelectorAll('#EnvioTeu .form-control');
    formElements.forEach((element: Element) => {
      const input = element as HTMLElement;
      input.classList.remove('is-invalid');

      // Remover mensajes de error
      const errorMessage = input.parentElement?.querySelector('.invalid-feedback');
      if (errorMessage) {
        errorMessage.remove();
      }
    });

    console.log('[TEU] Formulario TEU limpiado exitosamente');
  }

  public cerrarModalTEU(): void {
    console.log('[TEU] Cerrando modal TEU...');

    try {
      // Primero limpiar el formulario
      this.limpiarFormularioTEU();
      this.mostrarBotonDescargaTEU = false;
      this.mostrarBotonDescargaTEUPrincipal = false;

      // Cerrar el modal usando Bootstrap de forma más robusta
      const modalElement = document.getElementById('EnvioTeu');
      if (modalElement) {
        console.log('[TEU] Elemento modal encontrado, intentando cerrar...');

        // Intentar obtener la instancia existente
        let modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
          console.log('[TEU] Instancia modal encontrada, ocultando...');
          modal.hide();
        } else {
          console.log('[TEU] No hay instancia modal, creando nueva y ocultando...');
          // Si no hay instancia, crear una nueva
          modal = new bootstrap.Modal(modalElement, {
            backdrop: true,
            keyboard: true,
            focus: true
          });
          modal.hide();
        }

        // Forzar la detección de cambios para asegurar que la UI se actualice
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('[TEU] Modal cerrado exitosamente');
        }, 100);

      } else {
        console.warn('[TEU] No se encontró el elemento modal con ID "EnvioTeu"');
      }
    } catch (error) {
      console.error('[TEU] Error al cerrar modal:', error);

      // Fallback: intentar cerrar el modal de forma manual
      try {
        const modalElement = document.getElementById('EnvioTeu');
        if (modalElement) {
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
          document.body.classList.remove('modal-open');

          // Remover el backdrop si existe
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }

          console.log('[TEU] Modal cerrado manualmente como fallback');
        }
      } catch (fallbackError) {
        console.error('[TEU] Error en fallback de cierre manual:', fallbackError);
      }
    }
  }

  public descargarFicheroTEU(): void {
    // Si ya tenemos el XML descargado, usarlo directamente
    if (this.xmlDescargado) {
      this.descargaXml();
      Swal.fire({
        icon: 'success',
        title: 'Descarga completada',
        text: 'El fichero TEU se ha descargado correctamente.'
      });
    } else {
      // Si no tenemos el XML, necesitamos regenerarlo
      Swal.fire({
        icon: 'info',
        title: 'Regenerando fichero TEU',
        text: 'Se está regenerando el fichero TEU, por favor espere...'
      });

      // Llamar al servicio para regenerar el modelo TEU
      this.regenerarModeloTEU();
    }
  }

  private regenerarModeloTEU(): void {
    // Crear un objeto con los datos mínimos necesarios para regenerar el TEU
    const datosTEU = {
      idNotif: this.idNotificacion,
      datoperso: true,
      incltex: true,
      leygene: true
    };

    this.http.post(`${environment.apiUrl}modeloteu/crear`, datosTEU, { headers: this.httpHeaders })
      .subscribe({
        next: (response: any) => {
          if (response && response.xml) {
            this.xmlDescargado = response.xml;
            this.descargaXml();
            Swal.fire({
              icon: 'success',
              title: 'Descarga completada',
              text: 'El fichero TEU se ha regenerado y descargado correctamente.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo regenerar el fichero TEU.'
            });
          }
        },
        error: (error) => {
          console.error('Error al regenerar modelo TEU:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo regenerar el fichero TEU. Inténtelo de nuevo.'
          });
        }
      });
  }

  public onCheckboxChange(checkboxName: string, value: boolean): void {
    // Mostrar feedback visual cuando se cambia un checkbox
    const checkboxElement = document.getElementById(checkboxName) as HTMLInputElement;
    if (checkboxElement) {
      const card = checkboxElement.closest('.custom-checkbox-card');
      if (card) {
        if (value) {
          card.classList.add('checkbox-active');
          // Mostrar mensaje de confirmación
          this.mostrarMensajeCheckbox(checkboxName, true);
        } else {
          card.classList.remove('checkbox-active');
          this.mostrarMensajeCheckbox(checkboxName, false);
        }
      }
    }
  }

  private mostrarMensajeCheckbox(checkboxName: string, activado: boolean): void {
    const mensajes = {
      'datoperso': activado ? 'Datos personales incluidos' : 'Datos personales excluidos',
      'incltex': activado ? 'Textos incluidos' : 'Textos excluidos',
      'leygene': activado ? 'Ley tributaria aplicada' : 'Ley tributaria desactivada'
    };

    const mensaje = mensajes[checkboxName as keyof typeof mensajes];
    if (mensaje) {
      // Mostrar un toast o notificación sutil
      const toast = document.createElement('div');
      toast.className = `checkbox-toast ${activado ? 'toast-success' : 'toast-info'}`;
      toast.textContent = mensaje;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${activado ? '#d4edda' : '#d1ecf1'};
        color: ${activado ? '#155724' : '#0c5460'};
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid ${activado ? '#c3e6cb' : '#bee5eb'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        font-size: 0.875rem;
        animation: slideInRight 0.3s ease;
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 2000);
    }
  }

  public inicializarFormularioTEU(): void {
    // Inicializar con valores por defecto
    this.modeloteucrear = new ModeloTeuCrear();
    this.modeloteucrear.datPerso = true;
    this.modeloteucrear.texPlura = true;
    this.modeloteucrear.incLgt = true;

    // Las fechas deben estar vacías para que el usuario las seleccione manualmente
    // y se validen correctamente como campos obligatorios
    // Usar fechas inválidas que la validación pueda detectar
    this.modeloteucrear.fecSolic = new Date(''); // Fecha inválida
    this.modeloteucrear.fecGener = new Date(''); // Fecha inválida
    this.modeloteucrear.fecFirma = new Date(''); // Fecha inválida

    // Resetear validaciones visuales al inicializar
    this.mostrarValidacionesTEU = false;
  }

  // Métodos para validación visual de fechas
  public isFechaSolicInvalid(): boolean {
    return this.mostrarValidacionesTEU &&
      (!this.modeloteucrear.fecSolic ||
        (this.modeloteucrear.fecSolic instanceof Date && isNaN(this.modeloteucrear.fecSolic.getTime())));
  }

  public isFechaGenerInvalid(): boolean {
    return this.mostrarValidacionesTEU &&
      (!this.modeloteucrear.fecGener ||
        (this.modeloteucrear.fecGener instanceof Date && isNaN(this.modeloteucrear.fecGener.getTime())));
  }

  public isFechaFirmaInvalid(): boolean {
    return this.mostrarValidacionesTEU &&
      (!this.modeloteucrear.fecFirma ||
        (this.modeloteucrear.fecFirma instanceof Date && isNaN(this.modeloteucrear.fecFirma.getTime())));
  }

  public getnotificacionListar() {
    this.refresSourceListarNotifiPRE();
    this.notificacionesService.getNotificacionListar(this.verExpediente.ejercicio, this.verExpediente.numero).subscribe(
      leernotificacion => this.leernotificacion = leernotificacion
    );
  }

  public borrarNotificacion(id: number) {
    Swal.fire({
      title: `¿Confirma eliminar la notificación ${this.ejerNotifi}/${this.numeroNotifi} ?  `,
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificacionesService.deleteNotificacion(id).subscribe(response => {
          this.refresSourceListarNotifi();
          this.respuestahttp = response;
        }, (error: HttpErrorResponse) => {
          if (error.status == 403) {

            Swal.fire({
              title: `La Notificiación no se encuentra en estado "GENERADA" `,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })

          }
        }
        );


        //setTimeout(this.recargarpagina, 1500);// para que le de tiempo a ejecutarl todo


        let resulta = JSON.stringify(this.respuesta.headers);

        //  console.log(`MAS DATOS :  ${resulta}`)
        let statusCode = this.respuesta.body;

        if (this.respuesta.status == 200) {

          Swal.fire('Notificación Eliminada!', '', 'success');
          this.quitabotonesNotifi();


        } else {
          Swal.fire('No se pudo eliminar la Notificación!', '', 'info')


        }
      }
    })

  }

  public publicarNotifi() {
    if (this.creanotificacion.fecPubBop && this.creanotificacion.numBop) {
      // Crear un objeto CrearNotificacion con solo los campos necesarios para la publicación
      // NO incluir fecEnvio para preservar la fecha de envío original
      const notificacionPublicacion = new CrearNotificacion();
      notificacionPublicacion.idNotif = this.idNotificacion;
      notificacionPublicacion.fecNotif = this.fecLimite;
      notificacionPublicacion.fecRecNotif = this.fecLimite;
      notificacionPublicacion.situacion = 3; // PUBLICADA
      notificacionPublicacion.bop = 2;
      notificacionPublicacion.fecPubBop = this.creanotificacion.fecPubBop;
      notificacionPublicacion.numBop = this.creanotificacion.numBop;
      notificacionPublicacion.usuContr = this.usuContrl || '';

      console.log('Datos para publicación:', notificacionPublicacion);

      this.notificacionesService.PublicarNotificacion(notificacionPublicacion, this.idNotificacion).subscribe({
        next: (response) => {
          console.log('[PUBLICAR] Respuesta backend:', response);

          // Actualizar la lista de notificaciones
          this.refresSourceListarNotifi();

          // Recargar los datos de la notificación en el modal para mostrar los cambios
          this.vernotifi(this.idNotificacion, this.modoVerNotificacion).then(() => {
            console.log('[PUBLICAR] Datos del modal actualizados después de publicar');

            // Actualizar los botones de la notificación seleccionada después de la actualización
            setTimeout(() => {
              // Buscar la notificación actualizada en el grid
              const rowData = this.sourceListarNotifi.records.find((record: any) => record.idNotif === this.idNotificacion);
              if (rowData) {
                console.log('[PUBLICAR] Actualizando botones para notificación publicada:', rowData);
                this.habilitarBotonesNotificacion(rowData);
              }
            }, 100); // Pequeño delay para asegurar que el source se haya actualizado
          }).catch(error => {
            console.error('[PUBLICAR] Error al recargar datos del modal:', error);
          });

          Swal.fire('Notificacion Publicada!', '', 'success');
          this.borrarDatosPublicacion();
          this.quitabotonesNotifi();
        },
        error: (err: HttpErrorResponse) => {
          console.error('[PUBLICAR] Error: ' + err.error.message);
          Swal.fire({
            icon: 'error',
            title: 'Error al publicar',
            text: 'No se pudo publicar la notificación. Por favor, inténtelo de nuevo.'
          });
        }
      });
      this.borrarDatosPublicacion()
    } else {
      Swal.fire(`Debe rellenar todos los campos obligatorios.`)
    }
  }

  public editaNotifi() {
    // Validar que tenemos los datos necesarios básicos
    if (!this.creanotificacion || !this.idNotificacion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede editar la notificación. Faltan datos necesarios.'
      });
      return;
    }

    // Preparar datos para envío - convertir campos vacíos a null
    const datosParaEnviar = this.prepararDatosNotificacionParaEnvio();

    // Mostrar indicador de carga
    Swal.fire({
      title: 'Guardando cambios...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.notificacionesService.editarNotificacion(datosParaEnviar, this.idNotificacion).subscribe({
      next: (response) => {
        // Cerrar el modal de manera segura
        this.cerrarModalNotificacion();

        // Actualizar la lista de notificaciones
        this.refresSourceListarNotifi();
        this.quitabotonesNotifi();



        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `La notificación ${this.ejerNotifi}/${this.numeroNotifi} ha sido actualizada correctamente.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error al editar notificación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo actualizar la notificación. Por favor, inténtelo de nuevo.'
        });
      }
    });
  }



  // Método para validar campos requeridos de la notificación
  /**
   * Prepara los datos de la notificación para envío, convirtiendo campos vacíos a null
   */
  private prepararDatosNotificacionParaEnvio(): any {
    const datos = { ...this.creanotificacion };

    // Convertir campos vacíos a null usando any para evitar problemas de tipo
    const camposParaConvertir = [
      'notificador', 'notificador2', 'receptor', 'motNotif',
      'fecRecNotif', 'fecEnvio', 'fecRegistSalid', 'fecPubBop',
      'fecEmiBop', 'fecCaduc', 'numEnvioTeu', 'numBop',
      'numRegisSalid', 'observacion', 'desMotNotif'
    ];

    // Campos específicos de fecha que deben convertirse a null si están vacíos
    const camposFecha = ['fecRecNotif', 'fecEnvio', 'fecRegistSalid', 'fecPubBop', 'fecEmiBop', 'fecCaduc'];

    camposParaConvertir.forEach(campo => {
      const valor = (datos as any)[campo];

      // Para campos de fecha, convertir a null si está vacío, es una cadena vacía, o es 'Invalid Date'
      if (camposFecha.includes(campo)) {
        if (!valor || valor === '' || valor === 'Invalid Date' || valor === 'null' || valor === 'undefined') {
          (datos as any)[campo] = null;
        }
      } else {
        // Para otros campos, mantener la lógica original
        if (!valor || valor === '' || valor === 0) {
          (datos as any)[campo] = null;
        }
      }
    });

    console.log('Datos preparados para envío:', datos);
    return datos;
  }

  private validarCamposNotificacion(): string[] {
    const errores: string[] = [];

    // Debug: Log del estado actual
    console.log('Estado de la notificación:', this.creanotificacion.situacion, 'Tipo:', typeof this.creanotificacion.situacion);

    // Validar situación
    if (!this.creanotificacion.situacion) {
      errores.push('• Estado de la notificación es requerido');
    }

    // Si el estado es GENERADA (situacion = 1), permitir campos vacíos para que los procesos automáticos los establezcan
    if (Number(this.creanotificacion.situacion) === 1) {
      console.log('Estado GENERADA detectado - omitiendo validación de campos opcionales');
      // En estado GENERADA, solo validar campos básicos que siempre son necesarios
      if (!this.creanotificacion.situacion) {
        errores.push('• Estado de la notificación es requerido');
      }

      // Los demás campos pueden quedar vacíos en estado GENERADA
      // para que los procesos automáticos los establezcan posteriormente
    } else {
      console.log('Estado NO GENERADA - validando todos los campos');
      // Para otros estados, validar todos los campos como antes
      if (!this.creanotificacion.notificador2) {
        errores.push('• Notificador es requerido');
      }

      if (!this.creanotificacion.receptor) {
        errores.push('• Receptor es requerido');
      }

      if (!this.creanotificacion.motNotif) {
        errores.push('• Motivo de notificación es requerido');
      }

      if (!this.creanotificacion.fecRecNotif) {
        errores.push('• Fecha de recepción/devolución es requerida');
      }
    }

    console.log('Errores de validación:', errores);
    return errores;
  }

  // Método para mostrar errores visuales en los campos
  private mostrarErroresEnCampos(errores: string[]) {
    // Limpiar errores anteriores
    this.limpiarErroresVisuales();

    // Aplicar clases de error a los campos correspondientes
    setTimeout(() => {
      if (errores.some(e => e.includes('Estado'))) {
        const situacionField = document.getElementById('situacion') as HTMLSelectElement;
        if (situacionField) {
          situacionField.classList.add('is-invalid');
          this.agregarMensajeError(situacionField, 'Estado de la notificación es requerido');
        }
      }

      if (errores.some(e => e.includes('Notificador'))) {
        const notificadorField = document.getElementById('notificador') as HTMLSelectElement;
        if (notificadorField) {
          notificadorField.classList.add('is-invalid');
          this.agregarMensajeError(notificadorField, 'Notificador es requerido');
        }
      }

      if (errores.some(e => e.includes('Receptor'))) {
        const receptorField = document.getElementById('receptor') as HTMLSelectElement;
        if (receptorField) {
          receptorField.classList.add('is-invalid');
          this.agregarMensajeError(receptorField, 'Receptor es requerido');
        }
      }

      if (errores.some(e => e.includes('Motivo'))) {
        const motNotifField = document.getElementById('desMotNotif') as HTMLSelectElement;
        if (motNotifField) {
          motNotifField.classList.add('is-invalid');
          this.agregarMensajeError(motNotifField, 'Motivo de notificación es requerido');
        }
      }

      if (errores.some(e => e.includes('Fecha de recepción'))) {
        const fecRecField = document.getElementById('start2') as HTMLInputElement;
        if (fecRecField) {
          fecRecField.classList.add('is-invalid');
          this.agregarMensajeError(fecRecField, 'Fecha de recepción/devolución es requerida');
        }
      }
    }, 100);
  }

  // Método para agregar mensaje de error debajo del campo
  private agregarMensajeError(field: HTMLElement, mensaje: string) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-1"></i>${mensaje}`;

    // Insertar después del campo
    const parent = field.parentElement;
    if (parent) {
      parent.appendChild(errorDiv);
    }
  }

  // Método para manejar el cambio de estado de la notificación
  public onCambioEstadoNotificacion(event: any) {
    const nuevoEstado = Number(event.target.value);
    console.log('Cambio de estado de notificación:', nuevoEstado);

    // Solo limpiar errores visuales, NO modificar los datos hasta que se guarden
    this.limpiarErroresVisuales();

    // Nota: Los cambios en los campos se aplicarán solo cuando se guarde la notificación
    // No modificamos this.creanotificacion aquí para evitar cambios visuales inmediatos
  }

  // Método para manejar cambios en la fecha de envío
  public onFechaEnvioChange(event: any) {
    const valor = event.target.value;

    // Si el campo está vacío, establecer explícitamente como null
    if (!valor || valor === '') {
      this.creanotificacion.fecEnvio = null;
    } else {
      this.creanotificacion.fecEnvio = valor;
    }

    console.log('Fecha de envío cambiada:', this.creanotificacion.fecEnvio);
  }

  // Método para manejar cambios en la fecha de recepción/devolución
  public onFechaRecNotifChange(event: any) {
    const valor = event.target.value;

    // Si el campo está vacío, establecer explícitamente como null
    if (!valor || valor === '') {
      this.creanotificacion.fecRecNotif = null;
    } else {
      this.creanotificacion.fecRecNotif = valor;
    }

    console.log('Fecha de recepción/devolución cambiada:', this.creanotificacion.fecRecNotif);
  }

  // Método para manejar cambios en la fecha de registro de salida
  public onFechaRegistSalidChange(event: any) {
    const valor = event.target.value;

    // Si el campo está vacío, establecer explícitamente como null
    if (!valor || valor === '') {
      this.creanotificacion.fecRegistSalid = null;
    } else {
      this.creanotificacion.fecRegistSalid = valor;
    }

    console.log('Fecha de registro de salida cambiada:', this.creanotificacion.fecRegistSalid);
  }

  // Método para manejar cambios en la fecha de publicación BOP
  public onFechaPubBopChange(event: any) {
    const valor = event.target.value;

    // Si el campo está vacío, establecer explícitamente como null
    if (!valor || valor === '') {
      this.creanotificacion.fecPubBop = null;
    } else {
      this.creanotificacion.fecPubBop = valor;
    }

    console.log('Fecha de publicación BOP cambiada:', this.creanotificacion.fecPubBop);
  }

  // Método para limpiar errores visuales
  public limpiarErroresVisuales() {
    // Remover clases de error
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
      field.classList.remove('is-invalid');
    });

    // Remover mensajes de error
    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(msg => {
      if (msg.classList.contains('d-block')) {
        msg.remove();
      }
    });
  }

  // Método para cerrar el modal de notificación de manera segura
  public cerrarModalNotificacion() {
    try {
      // Método 1: Usar Bootstrap Modal API
      const modalElement = document.getElementById('verNotifiModal');
      if (modalElement) {
        // Ocultar usando Bootstrap si existe instancia
        const modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
        if (modal) {
          modal.hide();
        } else if ((window as any).bootstrap?.Modal) {
          // Si no hay instancia, crear una nueva y ocultarla
          const newModal = new (window as any).bootstrap.Modal(modalElement);
          newModal.hide();
        }
        // Ocultar forzadamente el modal por si Bootstrap falla
        modalElement.style.display = 'none';
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
      }

      // Método 2: Limpiar clases y backdrop manualmente
      setTimeout(() => {
        // Eliminar cualquier backdrop
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        // Remover clases y estilos del body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        // Eliminar tabindex y aria-modal si existen
        if (modalElement) {
          modalElement.removeAttribute('aria-modal');
          modalElement.setAttribute('aria-hidden', 'true');
          modalElement.removeAttribute('tabindex');
        }
      }, 150);

      // Limpiar datos del formulario
      this.limpiarDatosEdicionNotificacion();

    } catch (error) {
      console.error('Error al cerrar modal:', error);
      // Método de respaldo: usar jQuery si está disponible
      if ((window as any).$) {
        (window as any).$('#verNotifiModal').modal('hide');
        (window as any).$('.modal-backdrop').remove();
        (window as any).$('body').removeClass('modal-open');
      }
    }
  }

  // Método para limpiar los datos de edición de notificación
  private limpiarDatosEdicionNotificacion() {
    // Resetear el formulario
    this.creanotificacion = new CrearNotificacion();

    // Limpiar datos de visualización
    this.ejerNotifi = '';
    this.numeroNotifi = '';
    this.fechNotifi = '';
    this.dniNotifi = '';
    this.desPerEntidNotifi = '';
    this.dniok = false;

    // Limpiar fechas formateadas
    this.fechaordenadafenvio = '';
    this.fechaordenadafrecep = '';
    this.fechaordenadafpubli = '';
    this.fechaenvioTEU = '';

    // Resetear el modo de visualización
    this.modoVerNotificacion = false;
  }

  private prepararDatosEnvio(datos: any): any {
    return {
      ...datos,
      notificador: datos.notificador ?? '',
      forNotif: datos.forNotif ?? '0',
      ejeNotif: Number(datos.ejeNotif),
      idHisPerso: Number(datos.idHisPerso),
      idPerso: Number(datos.idPerso),
      situacion: Number(datos.situacion),
      ejeExped: Number(datos.ejeExped),
      numExped: Number(datos.numExped),
    };
  }

  public abrirModalEnviarNotificacion() {
    console.log('=== ABRIR MODAL ENVIAR NOTIFICACIÓN ===');
    console.log('idNotificacion:', this.idNotificacion);

    // Cargar los datos de la notificación antes de abrir el modal
    this.vernotifi(this.idNotificacion, false).then(() => {
      // Una vez cargados los datos, abrir el modal
      const modalElement = document.getElementById('EnvioNotifi');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    });
  }

  public enviarANotificaPlataforma(): void {
    if (!this.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }

    Swal.fire({
      title: 'Enviando a Notifica...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.notificacionesService.enviarANotifica(this.idNotificacion).subscribe({
      next: (response) => {
        Swal.close();
        this.refresSourceListarNotifi();
        this.notificationService.success(response?.mensaje || 'Notificación enviada a Notifica.');
        this.listadodeNotificaciones();
      },
      error: (error) => {
        Swal.close();
        const msg = error?.error?.message || 'No se pudo enviar la notificación a Notifica.';
        this.notificationService.error(msg);
      }
    });
  }

  public sincronizarConNotificaPlataforma(): void {
    if (!this.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }

    Swal.fire({
      title: 'Sincronizando con Notifica...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.notificacionesService.sincronizarNotifica(this.idNotificacion).subscribe({
      next: (response) => {
        Swal.close();
        this.refresSourceListarNotifi();
        this.notificationService.success(response?.mensaje || 'Sincronización completada.');
        this.listadodeNotificaciones();
      },
      error: (error) => {
        Swal.close();
        const msg = error?.error?.message || 'No se pudo sincronizar con Notifica.';
        this.notificationService.error(msg);
      }
    });
  }

  public async enviarNotificacion() {
    // Si no tenemos los datos de la notificación, cargarlos primero
    if (!this.notificacionver?.fecNotif) {
      try {
        await this.vernotifi(this.idNotificacion, false);
      } catch (error) {
        console.error('Error al cargar datos de notificación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos de la notificación.'
        });
        return;
      }
    }

    // Validar que tenemos la fecha de notificación original
    if (!this.notificacionver?.fecNotif) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'La notificación debe tener una fecha de notificación válida.'
      });
      return;
    }

    // Validar que la notificación no esté ya enviada
    if (this.notificacionver?.situacion === 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Notificación ya enviada',
        text: 'Esta notificación ya ha sido enviada y no puede ser enviada nuevamente.'
      });
      return;
    }

    // Validar que la notificación esté en estado GENERADA
    if (this.notificacionver?.situacion !== 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Estado incorrecto',
        text: 'Solo se pueden enviar notificaciones en estado GENERADA.'
      });
      return;
    }

    // Mostrar indicador de carga
    Swal.fire({
      title: 'Enviando notificación...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Preparar solo los datos mínimos necesarios para el envío
    const datosParaEnviar = {
      idNotif: this.idNotificacion,
      situacion: 2, // Cambiar a ENVIADA
      fecEnvio: this.creanotificacion.fecEnvio || new Date().toISOString().split('T')[0], // Usar la fecha del modal o fecha actual
      usuContr: this.usuContrl
    };


    this.notificacionesService.enviarNotificacion(datosParaEnviar, this.idNotificacion)
      .subscribe({
        next: (response) => {
          // Cerrar el modal de carga
          Swal.close();

          // Actualizar la lista de notificaciones
          this.refresSourceListarNotifi();
          this.quitabotonesNotifi();

          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `La notificación ${this.ejerNotifi}/${this.numeroNotifi} ha sido enviada correctamente.`,
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            // Refrescar la pantalla de notificaciones después del mensaje
            this.listadodeNotificaciones();
          });
        },
        error: (error) => {
          console.error('Error al enviar notificación:', error);
          Swal.close();

          // Refrescar la pantalla de notificaciones incluso en caso de error
          this.refresSourceListarNotifi();
          this.quitabotonesNotifi();

          Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: error.error?.message || 'No se pudo enviar la notificación. Por favor, inténtelo de nuevo.'
          }).then(() => {
            // Refrescar la pantalla completa después del mensaje de error
            this.listadodeNotificaciones();
          });
        }
      });
  }

  public recepcionarNotificacion() {
    // Validar campos obligatorios para recepción
    if (!this.creanotificacion.fecRecNotif || !this.creanotificacion.receptor) {
      Swal.fire(`Debe rellenar todos los campos obligatorios.`)
      return;
    }
    // Preservar la fecha de envío si existe
    const fecEnvioOriginal = this.notificacionver?.fecEnvio || this.creanotificacion.fecEnvio || null;
    console.log('[RECEPCIONAR] fecEnvio original a preservar:', fecEnvioOriginal);

    const notificacionRecepcion = new CrearNotificacion();
    notificacionRecepcion.idNotif = this.idNotificacion;
    notificacionRecepcion.situacion = 3; // RECEPCIONADA
    notificacionRecepcion.fecRecNotif = this.creanotificacion.fecRecNotif;
    notificacionRecepcion.receptor = this.creanotificacion.receptor;
    notificacionRecepcion.observacion = this.creanotificacion.observacion || '';
    notificacionRecepcion.usuContr = this.usuContrl || '';
    if (fecEnvioOriginal) notificacionRecepcion.fecEnvio = fecEnvioOriginal;

    console.log('[RECEPCIONAR] Datos para recepción:', notificacionRecepcion);

    this.notificacionesService.recepcionarNotificacion(notificacionRecepcion, this.idNotificacion).subscribe({
      next: (response) => {
        console.log('[RECEPCIONAR] Respuesta backend:', response);

        // Actualizar la lista de notificaciones
        this.refresSourceListarNotifi();

        // Recargar los datos de la notificación en el modal para mostrar los cambios
        this.vernotifi(this.idNotificacion, this.modoVerNotificacion).then(() => {
          console.log('[RECEPCIONAR] Datos del modal actualizados después de recepcionar');

          // Actualizar los botones de la notificación seleccionada después de la actualización
          setTimeout(() => {
            // Buscar la notificación actualizada en el grid
            const rowData = this.sourceListarNotifi.records.find((record: any) => record.idNotif === this.idNotificacion);
            if (rowData) {
              console.log('[RECEPCIONAR] Actualizando botones para notificación recepcionada:', rowData);
              this.habilitarBotonesNotificacion(rowData);
            }
          }, 100); // Pequeño delay para asegurar que el source se haya actualizado
        }).catch(error => {
          console.error('[RECEPCIONAR] Error al recargar datos del modal:', error);
        });

        this.quitabotonesNotifi();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `La notificación ${this.ejerNotifi}/${this.numeroNotifi} ha sido recepcionada correctamente.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('[RECEPCIONAR] Error al recepcionar notificación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al recepcionar',
          text: 'No se pudo recepcionar la notificación. Por favor, inténtelo de nuevo.'
        });
      }
    });
  }

  public devolverNotificacion() {
    // Validar campos obligatorios para devolución
    if (!this.creanotificacion.fecRecNotif && !this.creanotificacion.motNotif && !this.creanotificacion.notificador) {
      Swal.fire(`Debe rellenar todos los campos obligatorios.`)
      return;
    }

    // Preservar la fecha de envío si existe
    const fecEnvioOriginal = this.notificacionver?.fecEnvio || this.creanotificacion.fecEnvio || null;
    console.log('[DEVOLVER] fecEnvio original a preservar:', fecEnvioOriginal);

    const notificacionDevolucion = new CrearNotificacion();
    notificacionDevolucion.idNotif = this.idNotificacion;
    notificacionDevolucion.situacion = 4; // DEVUELTA
    notificacionDevolucion.fecRecNotif = this.creanotificacion.fecRecNotif;
    notificacionDevolucion.motNotif = this.creanotificacion.motNotif;
    notificacionDevolucion.notificador = this.creanotificacion.notificador;
    notificacionDevolucion.notificador2 = this.creanotificacion.notificador;
    notificacionDevolucion.usuContr = this.usuContrl || '';
    if (fecEnvioOriginal) notificacionDevolucion.fecEnvio = fecEnvioOriginal;

    console.log('[DEVOLVER] Datos para devolución:', notificacionDevolucion);

    this.notificacionesService.editarNotificacion(notificacionDevolucion, this.idNotificacion).subscribe({
      next: (response) => {
        console.log('[DEVOLVER] Respuesta backend:', response);

        // Actualizar la lista de notificaciones
        this.refresSourceListarNotifi();

        // Recargar los datos de la notificación en el modal para mostrar los cambios
        this.vernotifi(this.idNotificacion, this.modoVerNotificacion).then(() => {
          console.log('[DEVOLVER] Datos del modal actualizados después de devolver');

          // Actualizar los botones de la notificación seleccionada después de la actualización
          setTimeout(() => {
            // Buscar la notificación actualizada en el grid
            const rowData = this.sourceListarNotifi.records.find((record: any) => record.idNotif === this.idNotificacion);
            if (rowData) {
              console.log('[DEVOLVER] Actualizando botones para notificación devuelta:', rowData);
              this.habilitarBotonesNotificacion(rowData);
            }
          }, 100); // Pequeño delay para asegurar que el source se haya actualizado
        }).catch(error => {
          console.error('[DEVOLVER] Error al recargar datos del modal:', error);
        });

        this.quitabotonesNotifi();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `La notificación ${this.ejerNotifi}/${this.numeroNotifi} ha sido devuelta correctamente.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('[DEVOLVER] Error al devolver notificación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al devolver',
          text: 'No se pudo devolver la notificación. Por favor, inténtelo de nuevo.'
        });
      }
    });
  }

  public anularNotificacion() {
    Swal.fire({
      title: `¿ Confirma Anular la notificación : ${this.ejerNotifi}/${this.numeroNotifi} ?`,
      text: "Este paso no tendra marcha atras!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Crear un objeto CrearNotificacion con solo los campos necesarios para la anulación
        // NO incluir fecEnvio para preservar la fecha de envío original
        const notificacionAnulacion = new CrearNotificacion();
        notificacionAnulacion.idNotif = this.idNotificacion;
        notificacionAnulacion.situacion = 6; // ANULADA
        notificacionAnulacion.usuContr = this.usuContrl || '';

        console.log('Datos para anulación:', notificacionAnulacion);

        this.notificacionesService.anularNotificacion(notificacionAnulacion, this.idNotificacion).subscribe({
          next: (response) => {
            console.log('[ANULAR] Respuesta backend:', response);

            // Actualizar la lista de notificaciones
            this.refresSourceListarNotifi();

            // Recargar los datos de la notificación en el modal para mostrar los cambios
            this.vernotifi(this.idNotificacion, this.modoVerNotificacion).then(() => {
              console.log('[ANULAR] Datos del modal actualizados después de anular');

              // Actualizar los botones de la notificación seleccionada después de la actualización
              setTimeout(() => {
                // Buscar la notificación actualizada en el grid
                const rowData = this.sourceListarNotifi.records.find((record: any) => record.idNotif === this.idNotificacion);
                if (rowData) {
                  console.log('[ANULAR] Actualizando botones para notificación anulada:', rowData);
                  this.habilitarBotonesNotificacion(rowData);
                }
              }, 100); // Pequeño delay para asegurar que el source se haya actualizado
            }).catch(error => {
              console.error('[ANULAR] Error al recargar datos del modal:', error);
            });

            this.quitabotonesNotifi();

            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Anulada!',
              text: 'Esta notificación fue anulada.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('[ANULAR] Error al anular notificación:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al anular',
              text: 'No se pudo anular la notificación. Por favor, inténtelo de nuevo.'
            });
          }
        });
      }
    });
  }

  public borraDatosCrearNotifi() {
    // Limpiar los datos del formulario
    this.creanotificacion = new CrearNotificacion();

    // También limpiar el estado del modal si es necesario
    this.limpiarEstadoModalError();
  }

  async vernotifi(id: number, modoVer: boolean = false): Promise<void> {
    console.log('[VERNOTIFI] Número de notificación:', id);
    this.modoVerNotificacion = modoVer;
    this.idNotificacion = id;
    return new Promise((resolve, reject) => {
      this.notificacionesService.getNotificacionVer(id).subscribe({
        next: (response: any) => {
          const notificacionver = Array.isArray(response) ? response[0] : response;
          if (!notificacionver) {
            console.error('[VERNOTIFI] Error: No se recibieron datos de notificación válidos');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los datos de la notificación.'
            });
            reject(new Error('No se recibieron datos de notificación válidos'));
            return;
          }
          this.notificacionver = notificacionver;
          // Log para depuración
          console.log('[VERNOTIFI] Datos cargados:', notificacionver);
          this.creanotificacion = {
            ...this.creanotificacion,
            ejeNotif: notificacionver?.ejeNotif,
            numNotif: notificacionver?.numNotif,
            forNotif: notificacionver?.forNotif,
            fecNotif: notificacionver?.fecNotif,
            situacion: notificacionver?.situacion,
            dni: notificacionver?.personaEntidad?.numDocum || '',
            notificador: notificacionver?.notificador,
            notificador2: notificacionver?.notificador,
            fecEnvio: notificacionver?.fecEnvio,
            fecRecNotif: notificacionver?.fecRecNotif,
            receptor: notificacionver?.receptor || '',
            motNotif: notificacionver?.motNotif || '',
            fecRegistSalid: notificacionver?.fecRegistSalid,
            numEnvioTeu: notificacionver?.numEnvioTeu,
            bop: notificacionver?.bop,
            fecPubBop: notificacionver?.fecPubBop,
            numBop: notificacionver?.numBop,
            observacion: notificacionver?.observacion
          };
          // Log para depuración
          console.log('[VERNOTIFI] creanotificacion cargada:', this.creanotificacion);
          this.ejerNotifi = notificacionver?.ejeNotif;
          this.numeroNotifi = notificacionver?.numNotif;
          this.fechNotifi = notificacionver?.fecNotif;
          this.dniNotifi = notificacionver?.personaEntidad?.numDocum || '';
          this.desPerEntidNotifi = notificacionver?.personaEntidad?.desPerEntid || '';
          this.fechasNotifi(
            notificacionver?.fecEnvio,
            notificacionver?.fecRecNotif,
            notificacionver?.fecPubBop,
            notificacionver?.fecRegistSalid
          );
          if (notificacionver?.personaEntidad?.numDocum) {
            this.solicitadni(notificacionver.personaEntidad.numDocum);
          }
          resolve();
        },
        error: (error) => {
          console.error('[VERNOTIFI] Error al cargar notificación:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la notificación. Por favor, inténtelo de nuevo.'
          });
          reject(error);
        }
      });
    });
  }

  // Limpia cualquier estado residual antes de abrir el modal de notificación
  private limpiarEstadoModalNotificacion() {
    // Eliminar cualquier backdrop
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    // Remover clases y estilos del body
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    // Asegurar que el modal está oculto y sin clases residuales
    const modalElement = document.getElementById('verNotifiModal');
    if (modalElement) {
      modalElement.style.display = '';
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('tabindex');
    }
  }

  public verNotificacion(id: number) {
    this.limpiarEstadoModalNotificacion(); // LIMPIEZA ANTES DE ABRIR
    this.idNotificacion = id;
    this.modoVerNotificacion = true; // Siempre modo ver al abrir
    this.vernotifi(id, true);

    // Abrir el modal actualizado
    const modal = document.getElementById('verNotifiModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal) || new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  public editarNotificacion(id: number) {
    this.limpiarEstadoModalNotificacion(); // LIMPIEZA ANTES DE ABRIR
    this.vernotifi(id, false); // Modo editar
    // Abrir el modal
    const modal = document.getElementById('verNotifiModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal) || new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // ----------------------------------
  //  Fin de la Seccion de Notificaciones
  //------------------------------------


  public fecLimite!: Date;

  public fechamas15() {
    // Verificar si fecPubBop tiene un valor válido
    if (!this.creanotificacion.fecPubBop) {
      console.log("Fecha de publicación no disponible");
      return;
    }

    const resultado: Date = new Date(this.creanotificacion.fecPubBop);
    resultado.setDate(resultado.getDate() + 15);
    this.fecLimite = resultado;

    console.log("Fecha publicacion :", this.creanotificacion.fecPubBop);
    console.log("Fecha mas 15 dias :", resultado);
  }

  public borrarDatosPublicacion() {
    this.creanotificacion = new CrearNotificacion();
  }

  public borraDatosenviarNotifi() {
    this.creanotificacion = new CrearNotificacion();

  }

  public borraDatosRecepcion() {
    this.creanotificacion = new CrearNotificacion()
  }


  public CierraPopup() {

    $("#CrearNotificacionModal").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
  }

  public formanotificacion: boolean = false

  // Método para inicializar la fecha de notificación
  public inicializarFechaNotificacion() {
    const hoy = new Date();
    this.creanotificacion.fecNotif = hoy;
  }

  // Propiedades privadas para cachear la validación
  private _formularioValido: boolean = false;
  private _ultimaValidacion: any = null;

  // Getter público que cachea el resultado de la validación
  public get formularioNotificacionValido(): boolean {
    // Crear un objeto con los valores actuales para comparar
    const valoresActuales = {
      fecha: this.creanotificacion?.fecNotif,
      dni: this.creanotificacion?.dni,
      observacion: this.creanotificacion?.observacion,
      idTarea: this.idTarea,
      interesadosLength: this.listarinteresadosdto?.length || 0
    };

    // Solo recalcular si los valores han cambiado
    if (JSON.stringify(valoresActuales) !== JSON.stringify(this._ultimaValidacion)) {
      this._ultimaValidacion = valoresActuales;
      this._formularioValido = this.validarFormularioNotificacion();
    }

    return this._formularioValido;
  }

  // Método público para validar si el formulario está completo (usado internamente)
  public validarFormularioNotificacion(): boolean {
    // Validar campos obligatorios
    const tieneFecha = !!this.creanotificacion?.fecNotif;
    const tieneDNI = !!this.creanotificacion?.dni && this.creanotificacion.dni.trim() !== '';
    // Las observaciones ya no son obligatorias
    const tieneObservacion = true; // Siempre válido ya que no es obligatorio

    // Validar que el interesado existe en la lista
    const interesadoExiste = this.listarinteresadosdto?.some(inter => inter.numDocumInter === this.creanotificacion?.dni);

    // Validar que la tarea esté seleccionada
    const tieneTarea = !!this.idTarea;

    // Validar que el notificador esté seleccionado
    const tieneNotificador = !!this.creanotificacion?.notificador && this.creanotificacion.notificador !== 0;

    // Solo mostrar el log cuando hay errores o en desarrollo
    const esValido = tieneFecha && tieneDNI && tieneObservacion && interesadoExiste && tieneTarea && tieneNotificador;

    // Validación completada

    return esValido;
  }

  // Método para limpiar el cache de validación cuando sea necesario
  public limpiarCacheValidacion(): void {
    this._ultimaValidacion = null;
    this._formularioValido = false;
  }



  // Método para cargar datos del interesado seleccionado
  public cargarDatosInteresado(dni: string) {
    if (!dni) {
      // Limpiar datos si no hay DNI seleccionado
      this.creanotificacion.forNotif = 0;
      this.textoFormaNotif = '';
      this.creanotificacion.idHisPerso = 0;
      this.creanotificacion.idPerso = 0;
      this.creanotificacion.dni = '';
      this.dniok = false;
      return;
    }

    // Buscar el interesado en la lista
    const interesado = this.listarinteresadosdto.find(inter => inter.numDocumInter === dni);

    if (interesado) {
      // Cargar la forma de notificación del interesado
      this.creanotificacion.forNotif = interesado.tipForNotif || 0;
      this.textoFormaNotif = interesado.tipForNotif === 0 ? 'Correo postal' : 'Telemática';

      // Asegurar que el DNI esté correctamente asignado
      this.creanotificacion.dni = dni;

      // Cargar datos del interesado desde perEntid
      if (interesado.perEntid) {
        const persona = Array.isArray(interesado.perEntid) ? interesado.perEntid[0] : interesado.perEntid;

        this.creanotificacion.idHisPerso = persona.idHisPerso || 0;
        this.creanotificacion.idPerso = persona.idPerso || 0;

        this.creanotificacion.localidad = persona.localidad || '';
        this.creanotificacion.domicilio = persona.dirPosta || '';
        this.creanotificacion.codPosta = persona.codPosta || 0;
        this.creanotificacion.codProvi = persona.codProvi || 0;
        this.creanotificacion.codMunic = persona.codMunic || 0;
      } else {
        this.creanotificacion.idHisPerso = interesado.idHisPerso || 0;
        this.creanotificacion.idPerso = interesado.idPerso || 0;
      }

      // Datos del interesado cargados correctamente
    } else {
      // Mantener valores por defecto si no se encuentra el interesado
      this.creanotificacion.forNotif = 0;
      this.textoFormaNotif = '';
      this.creanotificacion.idHisPerso = 0;
      this.creanotificacion.idPerso = 0;
      this.creanotificacion.dni = dni; // Mantener el DNI aunque no se encuentre el interesado
    }

    // También consultar DNI para obtener datos adicionales si es necesario
    this.solicitadni(dni);

    // Limpiar cache de validación ya que cambió el DNI
    this.limpiarCacheValidacion();
  }

  public crearnotificacion() {
    // Validar que la tarea esté seleccionada
    if (!this.idTarea) {
      Swal.fire('Error', 'Debe seleccionar una tarea antes de crear la notificación', 'warning');
      return;
    }

    // Validar campos obligatorios primero
    if (!this.validarFormularioNotificacion()) {
      const camposFaltantes: string[] = [];

      if (!this.creanotificacion.fecNotif) {
        camposFaltantes.push('Fecha de Notificación');
      }

      if (!this.creanotificacion.dni) {
        camposFaltantes.push('Interesado');
      }

      Swal.fire('Error', 'Debe rellenar todos los campos obligatorios: ' + camposFaltantes.join(', '), 'warning');
      return;
    }

    // Buscar el interesado seleccionado para obtener los datos correctos
    const interesado = this.listarinteresadosdto.find(inter => inter.numDocumInter === this.creanotificacion.dni);

    if (!interesado) {
      Swal.fire('Error', 'No se encontró el interesado seleccionado', 'error');
      return;
    }

    // Configurar datos completos de la notificación
    this.creanotificacion.situacion = 1;
    this.creanotificacion.usuContr = this.usuContrl!;

    // Obtener idHisPerso e idPerso desde perEntid
    if (interesado.perEntid) {
      const persona = Array.isArray(interesado.perEntid) ? interesado.perEntid[0] : interesado.perEntid;
      this.creanotificacion.idHisPerso = persona.idHisPerso || 0;
      this.creanotificacion.idPerso = persona.idPerso || 0;
    } else {
      this.creanotificacion.idHisPerso = interesado.idHisPerso || 0;
      this.creanotificacion.idPerso = interesado.idPerso || 0;
    }

    this.creanotificacion.ejeExped = this.verExpediente.ejercicio;
    this.creanotificacion.numExped = this.verExpediente.numero;
    this.creanotificacion.codArchi = this.identificadorFicheroSubido;

    // Asegurar que ejeNotif esté configurado correctamente
    this.creanotificacion.ejeNotif = this.creanotificacion.ejeNotif || this.fecha.getFullYear();

    // Normalizar campos que pueden venir vacíos
    this.creanotificacion.forNotif = this.creanotificacion.forNotif ?? 0;
    this.creanotificacion.notificador = this.creanotificacion.notificador ?? 0; // Puede ser 0 si no se selecciona
    this.creanotificacion.motNotif = this.creanotificacion.motNotif ?? '';
    this.creanotificacion.receptor = this.creanotificacion.receptor ?? 0;
    this.creanotificacion.observacion = this.creanotificacion.observacion ?? ''; // Puede estar vacío

    // Inicializar campos que pueden ser null/undefined
    this.creanotificacion.numNotif = this.creanotificacion.numNotif ?? 0;
    this.creanotificacion.numBop = this.creanotificacion.numBop ?? 0;
    this.creanotificacion.bop = this.creanotificacion.bop ?? 0;
    this.creanotificacion.numEnvioTeu = this.creanotificacion.numEnvioTeu ?? '';
    this.creanotificacion.codArchiAcuse = this.creanotificacion.codArchiAcuse ?? '';

    // Inicializar campos adicionales que pueden faltar
    this.creanotificacion.idNotif = this.creanotificacion.idNotif ?? 0;
    this.creanotificacion.personaEntidad = this.creanotificacion.personaEntidad ?? null;
    this.creanotificacion.desNotificador = this.creanotificacion.desNotificador ?? '';
    this.creanotificacion.desMotNotif = this.creanotificacion.desMotNotif ?? '';
    this.creanotificacion.desSituacion = this.creanotificacion.desSituacion ?? '';
    this.creanotificacion.fecRecNotif = this.creanotificacion.fecRecNotif ?? null;
    this.creanotificacion.notificador2 = this.creanotificacion.notificador2 ?? 0;
    this.creanotificacion.codProvi = this.creanotificacion.codProvi ?? 0;
    this.creanotificacion.codMunic = this.creanotificacion.codMunic ?? 0;
    this.creanotificacion.tipVial = this.creanotificacion.tipVial ?? '';
    this.creanotificacion.desVial = this.creanotificacion.desVial ?? '';
    this.creanotificacion.numInfer = this.creanotificacion.numInfer ?? 0;
    this.creanotificacion.letInfer = this.creanotificacion.letInfer ?? '';
    this.creanotificacion.numSuper = this.creanotificacion.numSuper ?? 0;
    this.creanotificacion.bloque = this.creanotificacion.bloque ?? '';
    this.creanotificacion.portal = this.creanotificacion.portal ?? '';
    this.creanotificacion.escalera = this.creanotificacion.escalera ?? '';
    this.creanotificacion.planta = this.creanotificacion.planta ?? '';
    this.creanotificacion.puerta = this.creanotificacion.puerta ?? '';
    this.creanotificacion.localidad = this.creanotificacion.localidad ?? '';
    this.creanotificacion.domicilio = this.creanotificacion.domicilio ?? '';
    this.creanotificacion.codPosta = this.creanotificacion.codPosta ?? 0;
    this.creanotificacion.fecArchi = this.creanotificacion.fecArchi ?? null;
    this.creanotificacion.fecRegistSalid = this.creanotificacion.fecRegistSalid ?? null;
    this.creanotificacion.numRegisSalid = this.creanotificacion.numRegisSalid ?? 0;
    this.creanotificacion.fecEnvio = this.creanotificacion.fecEnvio ?? null;
    this.creanotificacion.fecCaduc = this.creanotificacion.fecCaduc ?? null;
    this.creanotificacion.fecEmiBop = this.creanotificacion.fecEmiBop ?? null;
    this.creanotificacion.fecPubBop = this.creanotificacion.fecPubBop ?? null;

    // Log del objeto completo para debugging
    console.log('Objeto notificación completo a enviar:', JSON.stringify(this.creanotificacion, null, 2));

    // Mostrar confirmación antes de crear
    Swal.fire({
      title: 'Confirmar creación de notificación',
      text: `¿Está seguro de que desea crear la notificación para ${interesado.nomInter}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear Notificación',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearNotificacionConfirmada();
      }
    });
  }

  private crearNotificacionConfirmada() {
    this.notificacionesService.crearNotificacion(this.creanotificacion, this.idTarea)
      .subscribe({
        next: (response) => {
          // Refrescar lista de tareas, limpiar formularios, etc.
          this.sourceTareasTramite = {
            dataType: 'json',
            dataFields: [
              { name: 'numero', type: 'number' },
              { name: 'descripcion', type: 'string' },
              { name: 'fecInicio', type: 'string' },
              { name: "fecFin", type: 'string' },
              { name: "propuestaResolucion", type: 'string' },
              { name: "usuario", type: 'string' },
              { name: "firmado", type: 'string' },
              { name: "fecPlazo", type: 'string' },
              { name: "color", type: 'string' },
              { name: "archivo", type: 'string' },
              { name: 'tareaProcedimiento', type: 'any' },
              { name: 'id', type: 'any' },
              { name: 'tipAnexo', type: 'any' },
              { name: 'docAport', type: 'any' },
              { name: 'tipDocEni', type: 'any' },
              { name: 'documentacion', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'numRegis', type: 'any' },
              { name: 'idHisDocum', type: 'any' },
              { name: 'ejeNumNotif', type: 'any' },
              { name: 'nombreArchivo', type: 'any' },
              { name: 'idAnunc', type: 'any' },
            ],
            url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
            id: 'id',
          };
          this.resetvariables();
          this.limpiarFormularioNotificacion();

          // Buscar el interesado para mostrar en el mensaje de éxito
          const interesado = this.listarinteresadosdto.find(inter => inter.numDocumInter === this.creanotificacion.dni);

          Swal.fire('Crear Notificación', 'La notificación fue generada.', 'success').then(() => {
            // Cerrar el modal después de que el usuario confirme el mensaje de éxito
            this.cerrarModalCrearNotificacion();
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear notificación:', err);

          let mensajeError = 'Error al crear la notificación';

          if (err.error) {
            if (err.error.message) {
              mensajeError = err.error.message;
            } else if (err.error.error) {
              mensajeError = `Error del servidor: ${err.error.error}`;
            } else if (err.status === 500) {
              mensajeError = 'Error interno del servidor. Contacte al administrador.';
            } else if (err.status === 404) {
              mensajeError = 'Recurso no encontrado.';
            } else if (err.status === 400) {
              mensajeError = 'Datos incorrectos. Verifique la información.';
            }
          }

          // Mostrar el error y luego limpiar el estado del modal
          Swal.fire('Error', mensajeError, 'error').then(() => {
            // Limpiar el estado del modal después de mostrar el error
            this.limpiarEstadoModalError();
          });
        }
      });
  }

  // Método para limpiar el formulario de notificación
  public limpiarFormularioNotificacion() {
    this.creanotificacion = new CrearNotificacion();
    this.textoFormaNotif = '';
    this.inicializarFechaNotificacion();
  }

  // Método para cerrar el modal de crear notificación
  public cerrarModalCrearNotificacion() {
    try {
      // Cerrar el modal usando Bootstrap
      const modalElement = document.getElementById('CrearNotificacionModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        } else {
          // Fallback: usar jQuery si Bootstrap no está disponible
          $('#CrearNotificacionModal').modal('hide');
        }
      }

      // Limpiar cualquier backdrop residual después de un pequeño delay
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
          backdrop.remove();
        });

        // Remover clases del body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        // Limpiar el formulario
        this.limpiarFormularioNotificacion();

        // Forzar la detección de cambios
        this.cdr.detectChanges();
      }, 150);

    } catch (error) {
      console.error('Error al cerrar el modal:', error);

      // Fallback: limpiar de forma más agresiva
      try {
        // Remover todos los backdrops
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

        // Limpiar el body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        // Limpiar el formulario
        this.limpiarFormularioNotificacion();

        console.log('Cierre de emergencia del modal completado');
      } catch (fallbackError) {
        console.error('Error en el cierre de emergencia:', fallbackError);
      }
    }
  }

  // Método para manejar el cierre del modal (evento hidden.bs.modal)
  public onModalHidden() {
    // Limpiar el estado del modal cuando se cierra
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
        backdrop.remove();
      });

      // Remover clases del body
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      document.body.style.removeProperty('overflow');

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    }, 100);
  }

  // Método para limpiar el estado del modal cuando hay un error
  public limpiarEstadoModalError() {
    try {
      // 1. Cerrar el modal de crear notificación
      const modalElement = document.getElementById('CrearNotificacionModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        } else {
          // Fallback: usar jQuery si Bootstrap no está disponible
          $('#CrearNotificacionModal').modal('hide');
        }
      }

      // 2. Limpiar cualquier backdrop residual
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
          backdrop.remove();
        });

        // 3. Remover clases y estilos del body que pueden causar la pantalla negra
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        // 4. Limpiar el formulario
        this.limpiarFormularioNotificacion();

        // 5. Forzar la detección de cambios
        this.cdr.detectChanges();

        console.log('Estado del modal limpiado correctamente después del error');
      }, 100);

    } catch (error) {
      console.error('Error al limpiar el estado del modal:', error);

      // Fallback: intentar limpiar de forma más agresiva
      try {
        // Remover todos los backdrops
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

        // Limpiar el body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        // Limpiar el formulario
        this.limpiarFormularioNotificacion();

        console.log('Limpieza de emergencia del modal completada');
      } catch (fallbackError) {
        console.error('Error en la limpieza de emergencia:', fallbackError);
      }
    }
  }

  public spinnervisiblefirma: boolean = true;

  public abreArchivo() {
    this.spinnervisiblefirma = false


    if (!this.numeroArchivo) {
      console.log("Documento  Archgivo: " + this.descargafichero);
      Swal.fire('Esta tarea No tiene ningún documento asociado')
      this.spinnervisiblefirma = true;


    } else {
      window.open(this.descargafichero, "_blank");
      this.spinnervisiblefirma = true;


    }

  }

  public descargaArchiFirmado!: any;

  async abreArchiFirmado() {
    this.descargaArchiFirmado = `${environment.apiUrl}archivo/obtenerInformeFirma/${this.usuContrl}/${this.idTarea}`;
    //this.descargaArchiFirmado = this.expedientesService.descargaArchivoFirmado(this.idTarea);

    if (this.descargaArchiFirmado) {
      window.open(this.descargaArchiFirmado, "_blank")

    } else {
      Swal.fire(`No se pudo descargar el fichero firmado.`)

    }


    console.log(this.descargaArchiFirmado)

  }

  editExpediente() {

    console.log("FORNOTIF : " + this.editexpediente.forNotif);

    this.expedientesService.editarExpediente(this.editexpediente, this.idExpediente).subscribe(response => this.router.navigate([`/editaexpediente/${this.idExpediente}`]));
    setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo

  }

  public finalizartarea() {
    Swal.fire({
      title: `¿Confirma Finalizar la tarea ${this.numeroTareaTramite},   ${this.descripTareaTramite} ?`,

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.finalizarTarea(this.idTarea).subscribe(response => {
          Swal.fire(
            'Finalizada',
            `La tarea ${this.numeroTareaTramite} fue finalizada.`,

            'success'
          );
          this.sourceTareasTramite = new jqx.dataAdapter({
            dataType: 'json',
            dataFields: [
              { name: 'numero', type: 'number' },
              { name: 'descripcion', type: 'string' },
              { name: 'fecInicio', type: 'string' },
              { name: "fecFin", type: 'string' },
              { name: "propuestaResolucion", type: 'string' },
              { name: "usuario", type: 'string' },
              { name: "firmado", type: 'string' },
              { name: "fecPlazo", type: 'string' },
              { name: "color", type: 'string' },
              { name: "archivo", type: 'string' },
              { name: 'tareaProcedimiento', type: 'any' },
              { name: 'id', type: 'any' },
              { name: 'tipAnexo', type: 'any' },
              { name: 'docAport', type: 'any' },
              { name: 'tipDocEni', type: 'any' },
              { name: 'documentacion', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'visible', type: 'any' },
              { name: 'numRegis', type: 'any' },
              { name: 'idHisDocum', type: 'any' },
              { name: 'ejeNumNotif', type: 'any' },
              { name: 'nombreArchivo', type: 'any' },
              { name: 'idAnunc', type: 'any' },


            ],

            url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
            id: 'id',


          });


        },


          (err: HttpErrorResponse) => {
            console.log('Error: ' + err.error.message);
            Swal.fire(
              ' No Finalizada',
              err.error.message,
              'warning'
            );
            this.refrescoSourceTareasTramite(this.idTramite);

          },
        );
      }
    })
  }

  public prueba: string = " prueba";

  editTareaTramiteExpediente() {

    this.expedientesService.EditarTareaTramiteExpedientes(this.tareatramiteexpedienteeditar, this.idTarea).subscribe(response => {
      //this.router.navigate([`/editaexpediente/${this.idExpediente}` ])
      this.refrescoSourceTareasTramite(this.idTramite);

      console.log("FECHA : " + this.tareatramiteexpedienteeditar.fecInicio)
      this.verListadoTareasModal();
      if (this.fileInput) { // esto borra el nombre del archibo subido
        this.fileInput.nativeElement.value = '';
      }
    });
  }

  public faseEditTra: string;

  editarTramiteExpediente() {
    this.expedientesService.EditarTramiteExpedientes(this.editartramiteexp, this.idTramite).subscribe({
      next: (response) => {
        this.notificationService.saveSuccess('Trámite');
        
        // Cerrar el modal usando el servicio
        this.modalManagerService.closeModal('editarTramiteModal');
        
        this.refrescoSourceTramite();
        this.borrarDatosTramite();
      },
      error: (error) => {
        console.error('Error al editar trámite:', error);
        
        let errorMessage = 'Ha ocurrido un error al editar el trámite.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Los datos proporcionados no son válidos.';
        }

        this.notificationService.error(errorMessage);
        
        // Mantener el modal abierto en caso de error
        this.modalManagerService.keepModalOpen('editarTramiteModal');
      }
    });
  }



  public habilitaTramiteExp() {
    this.nuevotramite = true;
    this.verTareasdelTramite = false;

    // Establecer la fecha actual por defecto
    const today = new Date();
    this.creartramiteexp.fecTramite = today.toISOString().split('T')[0];
  }

  public validateAndCreateTramite(event: Event): void {
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
    this.creaTramExp();
  }

  public validateAndEditTramite(event: Event): void {
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
    this.editarTramiteExpediente();
  }

  public limpiarErroresTramite(): void {
    const form = document.getElementById('formNuevoTramite') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      form.reset();
    }
  }

  public limpiarErroresEditarTramite(): void {
    const form = document.getElementById('formEditarTramite') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
    }
  }

  recargarpagina() {
    window.location.reload();

  }


  // PARA NUEVOS FILTROS JQX





  public cellclick = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-family: Verdana;" title="Modificar Tarea">' + value + '</div>';
  }

  public columnrenderer = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }

  public columnrendererDescarga = function (value) {
    return '<div (click)="abreArchivo()" style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }

  public columnseleccion = function (value, row, column, rowIndex) {
    // Usar una función que pueda acceder al contexto del grid
    return `<div style="padding-top:5px; text-align: center;" title="Selecciona Trámite">
              <input type="radio" name="RadioTramite" data-row="${rowIndex}" style="cursor: pointer;">
            </div>`;
  }
  public columnseleccionTareaProcedi = function (value) {


    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Trámite"  ><input type="radio"  value="" name="RadioIda" id="RadioIda">   </div>';


  }

  public columnseleccionDEscargaHistorico = function (value) {


    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Descarga Historico"  ><img (click)="descargaficheroHistorico()" src="../assets/cloud-download.svg" width="20" height="20"/>   </div>';


  }

  // ============================================
  // RENDERERS DE RADIO BUTTONS - NUEVA LÓGICA
  // ============================================

  public columnseleccionTareaTramite = GridRadioSelector.createRadioRenderer('TareasTramite', 'Selecciona Tarea del Trámite', true);


  public columnseleccionListarNotifi = function (value, row, column, rowIndex) {
    // Usar una función que pueda acceder al contexto del grid
    return `<div style="padding-top:5px; text-align: center;" type="button" title="Selecciona Notificación">
              <input type="radio" name="RadioNotificacion" data-row="${rowIndex}" style="cursor: pointer;">
            </div>`;
  }
  public cellsrendererTramiteTarea = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }
  public cellsrenderer = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }
  // Renderer simple para notificaciones (sin modal automático)
  public cellsrendererListarNotifi = function (row, column, value) {
    return `<div style="text-align: center; margin-top: 5px;"  type="button">` + value + '</div>';
  }

  // Renderer simple para situación de notificaciones (sin modal automático)
  public cellsrendererListarNotifiSituacionSimple = function (row, column, value) {
    switch (value) {
      case 1:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "GENERADA" + '</div>';
      case 2:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "ENVIADA" + '</div>';
      case 3:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "RECEPCIONADA" + '</div>';
      case 4:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "DEVUELTA" + '</div>';
      case 5:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "COBRADA" + '</div>';
      case 6:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "ANULADA" + '</div>';
      case 7:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "GENERADA" + '</div>';
      case 8:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "NOTIFICA_ENVIADA" + '</div>';
      case 9:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "CADUCADA" + '</div>';
      default:
        return `<div style="text-align: center; margin-top: 5px;"  type="button">` + "Sin datos" + '</div>';
    }
  }

  // Renderer simple para BOP de notificaciones (sin modal automático)
  public cellsrendererListarNotifiBOPSimple = function (row, column, value) {
    let resultado;
    switch (value) {
      case 0:
        resultado = "N/A";
        break;
      case 1:
        resultado = "ENVIADO";
        break;
      case 2:
        resultado = "PUBLICADO";
        break;
      default:
        resultado = "";
        break;
    }
    return `<div style="text-align: center; margin-top: 5px;"  type="button">` + resultado + '</div>';
  }
  public cellsrendererListarNotifiSituacion = function (row, column, value) {


    switch (value) {
      case 1:
        return `<div style="text-align: center; margin-top: 5px;">` + "GENERADA" + '</div>';


        break;
      case 2:
        return `<div style="text-align: center; margin-top: 5px;">` + "ENVIADA" + '</div>';


        break;
      case 3:
        return `<div style="text-align: center; margin-top: 5px;">` + "RECEPCIONADA" + '</div>';


        break;
      case 4:
        return `<div style="text-align: center; margin-top: 5px;">` + "DEVUELTA" + '</div>';


        break;
      case 5:
        return `<div style="text-align: center; margin-top: 5px;">` + "COBRADA" + '</div>';


        break;
      case 6:
        return `<div style="text-align: center; margin-top: 5px;">` + "ANULADA" + '</div>';


        break;
      case 7:
        return `<div style="text-align: center; margin-top: 5px;">` + "GENERADA" + '</div>';


        break;
      case 8:
        return `<div style="text-align: center; margin-top: 5px;">` + "NOTIFICA_ENVIADA" + '</div>';


        break;
      case 9:
        return `<div style="text-align: center; margin-top: 5px;">` + "CADUCADA" + '</div>';


        break;

      default:
        return `<div style="text-align: center; margin-top: 5px;">` + "Sin datos" + '</div>';

        break;
    }


  }
  public cellsrendererListarNotifiBOP = function (row, column, value) {
    let resultado;

    switch (value) {
      case 0:
        resultado = "N/A"
        return `<div style="text-align: center; margin-top: 5px;">` + resultado + '</div>';


      case 1:
        resultado = "ENVIADO"
        return `<div style="text-align: center; margin-top: 5px;">` + resultado + '</div>';


      case 2:
        resultado = "PUBLICADO"
        return `<div style="text-align: center; margin-top: 5px;">` + resultado + '</div>';


      default:
        return `<div style="text-align: center; margin-top: 5px;">` + '</div>';

        break;


    }


  }
  public cellsrendererTRamitadores = function (row, column, value) {


    return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
  }
  public cellsrendererTRamitadoresPosesion = function (row, column, value) {
    if (value == 1) {
      return `<div style="color : green;text-align: center; margin-top: 5px;"  type="button"  >` + 'Si' + '</div>';

    } else {
      return `<div style=" color:red;text-align: center; margin-top: 5px;"  type="button"  >` + 'No' + '</div>';

    }


    return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
  }

  public cellsrendererPlazo = function (row, column, value) {

    console.log("Fecha inicio: " + this.FecIniTarea);
    console.log("Fecha Fin: " + this.FecIniTarea)

    var dato1: string = this.FecIniTarea;


    return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
  }


  public cellsrendererTramite = function (row, column, value) {


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }
  public NombreApe!: string;

  public cellsrendererNotiDNI = function (row, column, value) {
    this.nombreApe = value.desPerEntid;


    return `<div style="text-align: center; margin-top: 5px;">` + value.numDocum + '</div>';
  }

  public cellsrendererNotiNombre = function (row, column, value) {
    value = this.nombreApe;


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }


  public descripTarea!: string;

  public cellsrendererDEscripTareas = function (row, column, value) {
    this.descripTarea = value;


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }

  public cellsrendererPruebas = function (row, column, value) {
    value = this.idTarea;


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }

  public onRow = function (row, column, value) {


    return `<div  (click)="clicktareaNueva($event)" style="text-align: center; margin-top: 5px;"  type="button"  >` + value + '</div>';
  }


  public cellsrendererContieneArchivo = function (row, column, value) {

    if (value) {
      // value = "Pulsa para descargar"
      return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    } else {

      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }


  }

  public cellsrendererArchivo = function (row, column, value) {

    if (value == "1") {
      // value = "Pulsa para descargar"
      return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    } else {

      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';
    }


  }

  public cellsrendererColor = function (row, column, value) {

    if (value == "VERDE") {

      return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_verde.png" width="20" height="20"/>' + '</div>';

    }
    if (value == "AMARILLO") {

      return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_amarillo.png" width="20" height="20"/>' + '</div>';

    }
    if (value == "ROJO") {

      return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="../assets/boton_rojo.png" width="20" height="20"/>' + '</div>';

    }

    if (!value) {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;">` + 'SIN DATOS' + '</div>';


    } else {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;">` + '</div>';


    }


  }


  public cellsrendererFecha = function (row, column, value) {
    let recorteFecha: string = value.substr(0, 10);
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "/" + mes + "/" + anio;
    // let datos:any = sessionStorage.getItem('idOrgEleme');

    let recorteHora: string = value.substring(12, 14);
    let reverse: string = (recorteFecha)

    if (!value) {
      recorteFecha = ""
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + dia + "/" + mes + "/" + anio + '</div>';

    }


  }
  public cellsrendererFechaListarNotifi = function (row, column, value) {
    let recorteFecha: string = value.substr(0, 10);
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "/" + mes + "/" + anio;

    let recorteHora: string = value.substring(12, 14);
    let reverse: string = (recorteFecha)

    if (!value) {
      recorteFecha = ""
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + dia + "/" + mes + "/" + anio + '</div>';

    }


  }

  public cellsrendererAccionesNotificacion = function (row, column, value) {
    if (!row || !row.bounddata || !row.bounddata.idNotif) {
      return `<div style="text-align: center; margin-top: 5px;">
                <span style="color: #999;">N/A</span>
              </div>`;
    }

    let idNotif = row.bounddata.idNotif;
    return `<div style="text-align: center; margin-top: 5px;">
              <button class="btn btn-sm btn-outline-primary me-1" onclick="window.verNotificacion(${idNotif})" title="Ver Notificación">
                <i class="bi bi-eye"></i> Ver
              </button>
            </div>`;
  }
  public cellsrendererFechaHistorico = function (row, column, value) {
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
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + dia + "/" + mes + "/" + anio + '</div>';

    }


  }
  public cellsrendererFechaPlazo = function (row, column, value) {


    if (!value) {
      return `<div style="text-align: center;margin-top: 5px;">` + 'SIN FECHA' + '</div>';


    } else {
      return `<div style="text-align: center;margin-top: 5px;">` + value + '</div>';


    }


  }
  public cellsrendererFechaTRamitadores = function (row, column, value) {
    let recorteFecha: string = value.substr(0, 10);
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "-" + mes + "-" + anio;

    let recorteHora: string = value.substring(12, 14);
    let reverse: string = (recorteFecha)

    if (!value) {
      recorteFecha = ""
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;">` + dia + "-" + mes + "-" + anio + '</div>';

    }


  }


  public cellsrendererTTRamiteAcciones = function (row, column, value) {


    return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
  }


  columnsTramite = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: '', datafield: '', width: '5%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererDEscripTareas,
      renderer: this.columnrenderer
    },
    {
      text: 'Fase',
      width: '8%',
      datafield: 'fase',
      cellsrenderer: this.cellsrendererTramite,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Trámite',
      width: '12%',
      datafield: 'fecTramite',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Control',
      width: '8%',
      datafield: 'fecContr',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Usuario de control',
      width: '15%',
      datafield: 'usuContr',
      cellsrenderer: this.cellsrendererDEscripTareas,
      renderer: this.columnrenderer,
      hidden: true
    },


  ];
  public localizationObject: any = jqxGrid_ES;


  @ViewChild('gridRecibos') gridRecibos: ElementRef | undefined;


  sourceTramite = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'numero', type: 'number' },
      { name: 'descripcion', type: 'string' },
      { name: 'fase', type: 'string' },
      { name: "fecTramite", type: 'string' },
      { name: "fecContr", type: 'string' },
      { name: "usuContr", type: 'string' },

      { name: 'id', type: 'any' },


    ],
    //url:`  http://10.234.252.145:8090/api/gos/tareaTramiteExpediente/listar/57`
    url: `${environment.apiUrl}tramite/listar/${this.idExpediente}`,
    id: 'id',
    // sortcolumn: 'id',
    //  sortdirection: 'desc'

  });


  columnsTareasTramite = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
    { text: '', datafield: '', cellsrenderer: this.columnseleccionTareaTramite, renderer: this.columnrenderer },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: this.cellsrendererTramiteTarea,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      width: '45%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererTramiteTarea,
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
  sourceTareasTramite = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'numero', type: 'number' },
      { name: 'descripcion', type: 'string' },
      { name: 'fecInicio', type: 'string' },
      { name: "fecFin", type: 'string' },
      { name: "propuestaResolucion", type: 'string' },
      { name: "usuario", type: 'string' },
      { name: "firmado", type: 'string' },
      { name: "fecPlazo", type: 'string' },
      { name: "color", type: 'string' },
      { name: "archivo", type: 'string' },
      { name: 'tareaProcedimiento', type: 'any' },
      { name: 'id', type: 'any' },
      { name: 'tipAnexo', type: 'any' },
      { name: 'docAport', type: 'any' },
      { name: 'tipDocEni', type: 'any' },
      { name: 'documentacion', type: 'any' },
      { name: 'visible', type: 'any' },
      { name: 'visible', type: 'any' },
      { name: 'numRegis', type: 'any' },
      { name: 'idHisDocum', type: 'any' },
      { name: 'ejeNumNotif', type: 'any' },
      { name: 'nombreArchivo', type: 'any' },
      { name: 'idAnunc', type: 'any' },


    ],
    //url:` http://10.234.252.145:8090/api/gos/tareaTramiteExpediente/listar/57`
    url: `${environment.apiUrl}tareaTramiteExpediente/listar/${this.idTramite}`,
    id: 'id',
    // sortcolumn: 'id',
    // sortdirection: 'desc'

  });

  public refrescoSourceTramite() {


    this.sourceTramite = ({
      dataType: 'json',
      dataFields: [
        { name: 'numero', type: 'number' },
        { name: 'descripcion', type: 'string' },
        { name: 'fase', type: 'string' },
        { name: "fecTramite", type: 'string' },
        { name: "fecContr", type: 'string' },
        { name: "usuContr", type: 'string' },

        { name: 'id', type: 'any' },


      ],
      //url:`  http://10.234.252.145:8090/api/gos/tareaTramiteExpediente/listar/57`
      url: `${environment.apiUrl}tramite/listar/${this.idExpediente}`,
      id: 'id',
      // sortcolumn: 'id',
      //  sortdirection: 'desc'

    });

  }

  public refrescoSourceTareasTramite(id: any) {

    console.log("Este el es id que me llega : " + id);

    this.sourceTareasTramite = ({
      dataType: 'json',
      dataFields: [
        { name: 'numero', type: 'number' },
        { name: 'descripcion', type: 'string' },
        { name: 'fecInicio', type: 'string' },
        { name: "fecFin", type: 'string' },
        { name: "propuestaResolucion", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "firmado", type: 'string' },
        { name: "fecPlazo", type: 'string' },
        { name: "color", type: 'string' },
        { name: "archivo", type: 'string' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'id', type: 'any' },
        { name: 'tipAnexo', type: 'any' },
        { name: 'docAport', type: 'any' },
        { name: 'tipDocEni', type: 'any' },
        { name: 'documentacion', type: 'any' },
        { name: 'visible', type: 'any' },
        { name: 'visible', type: 'any' },
        { name: 'numRegis', type: 'any' },
        { name: 'idHisDocum', type: 'any' },
        { name: 'ejeNumNotif', type: 'any' },
        { name: 'nombreArchivo', type: 'any' },
        { name: 'idAnunc', type: 'any' },


      ],
      // url:` http://10.234.252.145:8090/api/gos/tramite/listar/${this.idExpediente}`
      url: `${environment.apiUrl}tareaTramiteExpediente/listar/${id}`,
      id: 'id',
      // sortcolumn: 'id',
      // sortdirection: 'desc'

    });
  }


  columnsListarNotifi = [
    { text: 'Id', datafield: 'idNotif', width: '1%', hidden: true },

    // { text: 'NumNotif', datafield: 'numNotif', width: '1%', hidden: true },
    //{text: 'tipoNotifi', datafield: 'desMotNotif', width: '1%', hidden: true },
    { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: this.columnseleccionListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejeNotif',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrendererDescarga
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numNotif',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Notificación',
      width: '10%',
      datafield: 'fecNotif',
      cellsrenderer: this.cellsrendererFechaListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Situación',
      width: '15%',
      datafield: 'situacion',
      cellsrenderer: this.cellsrendererListarNotifiSituacionSimple,
      renderer: this.columnrenderer
    },

    {
      text: 'Notificador',
      width: '18%',
      datafield: 'desNotificador',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Interesado',
      width: '25%',
      datafield: 'desPerEntid',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Documento',
      width: '10%',
      datafield: 'numDocum',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },

    {
      text: 'Fecha Envio',
      width: '18%',
      datafield: 'fecEnvio',
      cellsrenderer: this.cellsrendererFechaListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Recepción/Devolucion',
      width: '18%',
      datafield: 'fecRecNotif',
      cellsrenderer: this.cellsrendererFechaListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'receptor',
      datafield: 'desReceptor',
      cellsrenderer: this.cellsrendererNotiDNI,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Número Tarea',
      width: '10%',
      datafield: 'numTarea',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha Envio T.E.U.',
      datafield: "fecEmiBop",
      width: '30%',
      cellsrenderer: this.cellsrendererFechaListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Número T.E.U.',
      datafield: "numEnvioTeu",
      width: '30%',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Situación BOE',
      width: '15%',
      datafield: 'bop',
      cellsrenderer: this.cellsrendererListarNotifiBOPSimple,
      renderer: this.columnrenderer
    },

    {
      text: 'Fecha Publicación BOE ',
      width: '15%',
      datafield: 'fecPubBop',
      cellsrenderer: this.cellsrendererFechaListarNotifi,
      renderer: this.columnrenderer
    },

    {
      text: 'Número BOE',
      width: '10%',
      datafield: 'numBop',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },
    {
      text: 'Observaciones',
      width: '35%',
      datafield: 'observacion',
      cellsrenderer: this.cellsrendererListarNotifi,
      renderer: this.columnrenderer
    },

    {
      text: 'DNI',
      datafield: 'personaEntidad',
      cellsrenderer: this.cellsrendererNotiDNI,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Apellidos/Nombre',
      datafield: 'usuario',
      cellsrenderer: this.cellsrendererNotiNombre,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Acciones',
      width: '15%',
      datafield: 'acciones',
      cellsrenderer: this.cellsrendererAccionesNotificacion,
      renderer: this.columnrenderer
    },
  ];


  sourceListarNotifi = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'desMotNotif', type: 'string' },
      { name: 'observacion', type: 'string' },
      { name: 'desSituacion', type: 'string' },
      { name: 'fecNotif', type: 'string' },
      { name: "fecRecNotif", type: 'string' },
      { name: "personaEntidad", type: 'string' },
      { name: "usuario", type: 'string' },
      { name: "ejeNotif", type: 'number' },
      { name: 'idNotif', type: 'number' },
      { name: 'tareaProcedimiento', type: 'any' },
      { name: 'numNotif', type: 'number' },
      { name: 'numDocum', type: 'any' },
      { name: 'desPerEntid', type: 'any' },
      { name: 'fecEnvio', type: 'string' },
      { name: 'numTarea', type: 'any' },
      { name: 'desTramite', type: 'any' },
      { name: 'bop', type: 'any' },
      { name: 'numBop', type: 'any' },
      { name: 'fecEmiBop', type: 'any' },
      { name: 'fecPubBop', type: 'any' },
      { name: 'numEnvioTeu', type: 'any' },
      { name: 'desReceptor', type: 'any' },
      { name: 'desNotificador', type: 'any' },
      { name: 'situacion', type: 'any' },
      { name: 'fecRegistSalid', type: 'any' },
      { name: 'acciones', type: 'any' },


    ],
    // url:` http://10.234.252.145:8090/api/gos/notificacion/listar/2023/39`
    url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
    // id: 'id',
    sortcolumn: 'numNotif',
    sortdirection: 'desc'

  });

  public veonotificaciones: boolean = false;
  public modoVerNotificacion: boolean = false;

  columnsTramitadores = [
    { text: 'Id', datafield: 'idNotif', width: '1%', hidden: true },


    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: this.cellsrendererTRamitadores,
      hidden: true,
      renderer: this.columnrenderer
    },
    {
      text: 'Usuario',
      datafield: 'usuario',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'Fecha asignación',
      width: '35%',
      datafield: 'fecAsignacion',
      cellsrenderer: this.cellsrendererFechaTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'Estado',
      datafield: 'estadoTramitacion',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },

    {
      text: 'Posee Expediente',
      datafield: 'posesion',
      cellsrenderer: this.cellsrendererTRamitadoresPosesion,
      renderer: this.columnrenderer
    },


  ];
  sourceTramitadores = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'fecAsignacion', type: 'string' },
      { name: 'estadoTramitacion', type: 'string' },
      { name: 'usuario', type: 'string' },
      { name: 'posesion', type: 'string' },
    ],
    url: `${environment.apiUrl}tramitador/listar/${this.idExpediente}`,
    id: 'id',
  });

  columnsTareasProcedi = [
    { text: 'Id', datafield: 'id', width: '1%', hidden: true },


    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: this.columnseleccionTareaProcedi,
      renderer: this.columnrenderer
    },
    {
      text: 'procedimiento',
      datafield: 'procedimiento',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Fase Tarea',
      datafield: 'faseTarea',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    { text: 'Plazo', datafield: 'plazo', cellsrenderer: this.cellsrendererTRamitadores, renderer: this.columnrenderer },
    {
      text: 'Tipo Plazo',
      datafield: 'tipoPlazo',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'tareaAutomatica',
      datafield: 'tareaAutomatica',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'plantillaDefectoModulo',
      datafield: 'plantillaDefectoModulo',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Plantilla Defecto',
      datafield: 'plantillaDefecto',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'procesoFirmadoDefecto',
      datafield: 'procesoFirmadoDefecto',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Usuario Control',
      datafield: 'usuContr',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'fecContr',
      datafield: 'fecContr',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'acciones',
      datafield: 'accion',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },


  ];


  sourceTareasProcedi = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'descripcion', type: 'string' },
      { name: 'faseTarea', type: 'string' },
      { name: 'plazo', type: 'string' },
      { name: 'tipoPlazo', type: 'string' },
      { name: 'plantillaDefecto', type: 'string' },
      { name: 'usuContr', type: 'string' },
      { name: 'accion', type: 'string' },


    ],
    url: `${environment.apiUrl}tareaProcedimiento/ver/${this.idlistatareaProcedi}`,
    id: 'id',
  });


  public refresSourceListarNotifi() {
    this.sourceListarNotifi = ({
      dataType: 'json',
      dataFields: [
        { name: 'desMotNotif', type: 'string' },
        { name: 'observacion', type: 'string' },
        { name: 'desSituacion', type: 'string' },
        { name: 'fecNotif', type: 'string' },
        { name: "fecRecNotif", type: 'string' },
        { name: "personaEntidad", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "ejeNotif", type: 'number' },
        { name: 'idNotif', type: 'number' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'numNotif', type: 'number' },
        { name: 'numDocum', type: 'any' },
        { name: 'desPerEntid', type: 'any' },
        { name: 'fecEnvio', type: 'string' },
        { name: 'numTarea', type: 'any' },
        { name: 'desTramite', type: 'any' },
        { name: 'bop', type: 'any' },
        { name: 'numBop', type: 'any' },
        { name: 'fecEmiBop', type: 'any' },
        { name: 'fecPubBop', type: 'any' },
        { name: 'numEnvioTeu', type: 'any' },
        { name: 'desReceptor', type: 'any' },
        { name: 'desNotificador', type: 'any' },
        { name: 'situacion', type: 'any' },
        { name: 'fecRegistSalid', type: 'any' },


      ],
      url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
    });
  }

  public refresSourceListarNotifiPRE() {
    this.sourceListarNotifi = ({
      dataType: 'json',
      dataFields: [
        { name: 'desMotNotif', type: 'string' },
        { name: 'observacion', type: 'string' },
        { name: 'desSituacion', type: 'string' },
        { name: 'fecNotif', type: 'string' },
        { name: "fecRecNotif", type: 'string' },
        { name: "personaEntidad", type: 'string' },
        { name: "usuario", type: 'string' },
        { name: "ejeNotif", type: 'number' },
        { name: 'idNotif', type: 'number' },
        { name: 'tareaProcedimiento', type: 'any' },
        { name: 'numNotif', type: 'number' },
        { name: 'numDocum', type: 'any' },
        { name: 'desPerEntid', type: 'any' },
        { name: 'fecEnvio', type: 'string' },
        { name: 'numTarea', type: 'any' },
        { name: 'desTramite', type: 'any' },
        { name: 'bop', type: 'any' },
        { name: 'numBop', type: 'any' },
        { name: 'fecEmiBop', type: 'any' },
        { name: 'fecPubBop', type: 'any' },
        { name: 'numEnvioTeu', type: 'any' },
        { name: 'desReceptor', type: 'any' },
        { name: 'desNotificador', type: 'any' },
        { name: 'situacion', type: 'any' },
        { name: 'fecRegistSalid', type: 'any' },


      ],
      url: `${environment.apiUrl}notificacion/listar/${this.verExpediente.ejercicio}/${this.verExpediente.numero}`,
      id: 'id',
    });
  }


  public vacio() {
    console.log(`${environment.apiUrl}tramite/listar/${this.idExpediente}`);

  }


  columnsHistorico = [
    { text: 'Id', datafield: 'id', width: '1%', hidden: true },


    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: this.columnseleccionTareaProcedi,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'idTarea',
      datafield: 'idTarea',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Nº tarea',
      width: '5%',
      datafield: 'numTarea',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },

    {
      text: 'Fecha de Tarea',
      width: '8%',
      datafield: 'fecTarea',
      cellsrenderer: this.cellsrendererFechaHistorico,
      renderer: this.columnrenderer
    },
    {
      text: 'Archivo',
      width: '25%',
      datafield: 'desArchi',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'Descripción',
      datafield: 'desIndic',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },
    {
      text: 'Descrip. Tarea',
      datafield: 'desTarea',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },

    {
      text: 'usuContr',
      datafield: 'usuContr',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Usuario',
      width: '5%',
      datafield: 'usuario',
      cellsrenderer: this.cellsrendererTRamitadores,
      renderer: this.columnrenderer
    },

    {
      text: 'Descarga',
      width: '8%',
      datafield: 'descarga',
      cellsrenderer: this.columnseleccionDEscargaHistorico,
      renderer: this.columnrenderer
    },

  ];


  sourceHistorico = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'fecTarea', type: 'string' },
      { name: 'archivo', type: 'string' },
      { name: 'desArchi', type: 'string' },
      { name: 'idTarea', type: 'string' },
      { name: 'numTarea', type: 'string' },
      { name: 'usuario', type: 'string' },
      { name: 'desIndic', type: 'string' },
      { name: 'desTarea', type: 'string' },
      { name: 'id', type: 'string' },
      { name: 'usuContr', type: 'string' },
      { name: 'descarga', type: 'string' },
    ],
    url: `${environment.apiUrl}tareaHistoricoTramiteExpediente/listarPorTarea/${this.idTarea}`,
    id: 'id',
  });

  public descargaficheroHistorico(event: any) {
    console.log("PULSASTE LA DESCARGA DE FICHERO DE HISTÓRICO!!!");
    let nArchivo = event.args.row.bounddata.archivo;
    let sinespacios = this.usuContrl?.replaceAll(' ', '');

    this.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${nArchivo}/ ${sinespacios}`; // Reemplaza con la URL del archivo que deseas descargar

    console.log("URL: ---> " + this.descargafichero);
    this.abreArchivo();
  }

  public marcaHistorico(event: any) {
    console.log("PULSASTE DOBLE CLICK HISTÓRICO!!!");
  }

  public cargaHistorico(idTarea: any) {
    console.log("IDTAREA : ---> " + idTarea)

    this.sourceHistorico = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        { name: 'fecTarea', type: 'string' },
        { name: 'archivo', type: 'string' },
        { name: 'desArchi', type: 'string' },
        { name: 'idTarea', type: 'string' },
        { name: 'numTarea', type: 'string' },
        { name: 'usuario', type: 'string' },
        { name: 'desIndic', type: 'string' },
        { name: 'desTarea', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'usuContr', type: 'string' },
        { name: 'descarga', type: 'string' },
      ],
      url: `${environment.apiUrl}tareaHistoricoTramiteExpediente/listarPorTarea/${idTarea}`,
      id: 'id',
    });
  }

  public showGenerarEntrada: boolean = false;

  clickGenerarEntrada(): void {
    this.showGenerarEntrada = true;
    const modalElement = document.getElementById('GenerarEntradaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('El elemento del modal no se encontró');
    }
  }

  closeGenerarEntradaModal(): void {
    const modalElement = document.getElementById('GenerarEntradaModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        new bootstrap.Modal(modalElement).hide();
      }

      this.showGenerarEntrada = false;
      document.body.classList.remove('modal-open');
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
    } else {
      console.error('No se encontró el elemento del modal.');
    }
  }

  showObjetoTributarioModal(): void {
    const modalElement = document.getElementById('objetoTributarioModal');
    if (modalElement) {
      const objetoTributarioModal = new bootstrap.Modal(modalElement);
      objetoTributarioModal.show();
    } else {
      console.error('El elemento del modal no se encontró');
    }
  }

  /**
   * Método para validar formularios antes de enviar
   */
  public validateAndSubmit(event: Event, formId: string, submitFunction: () => void): void {
    event.preventDefault();
    
    const form = document.getElementById(formId) as HTMLFormElement;
    if (form && form.checkValidity()) {
      submitFunction();
    } else {
      this.notificationService.incompleteFields();
      form?.classList.add('was-validated');
    }
  }

  /**
   * Método para manejar errores de validación
   */
  public handleValidationError(fieldName: string): void {
    this.notificationService.validationError(fieldName);
  }

  /**
   * Método para confirmar eliminación usando NotificationService
   */
  public confirmDelete(itemName: string, deleteFunction: () => void): void {
    this.notificationService.confirmDelete(itemName).then((result) => {
      if (result.isConfirmed) {
        deleteFunction();
      }
    });
  }

  /**
   * Método para mostrar advertencias
   */
  public showWarning(message: string): void {
    this.notificationService.warning(message);
  }

  /**
   * Método para mostrar información
   */
  public showInfo(message: string): void {
    this.notificationService.info(message);
  }

  /**
   * Convierte una fecha en formato ISO o string a formato YYYY-MM-DD para inputs de fecha
   * @param fecha Fecha en cualquier formato válido
   * @returns Fecha en formato YYYY-MM-DD o string vacío si no hay fecha
   */
  public formatearFechaParaInput(fecha: any): string {
    if (!fecha) {
      return '';
    }
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return '';
      }
      return fechaObj.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error al formatear fecha:', error);
      return '';
    }
  }

  public validateAndCreateTarea(event: Event): void {
    // Validación usando Bootstrap nativo
    const form = event.target as HTMLFormElement;
    
    // Agregar la clase was-validated para mostrar los mensajes de error
    form.classList.add('was-validated');
    
    // Validación personalizada para el select de tarea procedimiento
    const tareaProcedimientoSelect = form.querySelector('#tprocedi2') as HTMLSelectElement;
    if (tareaProcedimientoSelect) {
      const selectedValue = tareaProcedimientoSelect.value;
      if (!selectedValue || selectedValue === '') {
        tareaProcedimientoSelect.classList.add('is-invalid');
        tareaProcedimientoSelect.classList.remove('is-valid');
      } else {
        tareaProcedimientoSelect.classList.remove('is-invalid');
        tareaProcedimientoSelect.classList.add('is-valid');
      }
    }

    // Validación personalizada para la descripción
    const descripcionInput = form.querySelector('#descriptara') as HTMLInputElement;
    if (descripcionInput) {
      const descripcionValue = descripcionInput.value.trim();
      if (!descripcionValue) {
        descripcionInput.classList.add('is-invalid');
        descripcionInput.classList.remove('is-valid');
      } else {
        descripcionInput.classList.remove('is-invalid');
        descripcionInput.classList.add('is-valid');
      }
    }

    // Validación personalizada para la fecha
    const fechaInput = form.querySelector('#start') as HTMLInputElement;
    if (fechaInput) {
      const fechaValue = fechaInput.value;
      if (!fechaValue) {
        fechaInput.classList.add('is-invalid');
        fechaInput.classList.remove('is-valid');
      } else {
        fechaInput.classList.remove('is-invalid');
        fechaInput.classList.add('is-valid');
      }
    }

    // Verificar si hay campos inválidos
    const invalidFields = form.querySelectorAll('.is-invalid');
    if (invalidFields.length > 0) {
      this.notificationService.incompleteFields();
      // Prevenir el submit y el cierre del modal
      event.preventDefault();
      return;
    }

    // Si la validación pasa, proceder con la creación
    this.nuevaTareaExp();
  }

  public limpiarErroresNuevaTarea(): void {
    const form = document.getElementById('formNuevaTarea') as HTMLFormElement;
    if (form) {
      form.classList.remove('was-validated');
      
      // Limpiar clases de validación de todos los campos
      const allFields = form.querySelectorAll('.form-control, .form-select');
      allFields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
      });
    }
  }

  public validarTareaProcedimiento(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    
    // Solo validar visualmente si el formulario ya ha sido validado (was-validated)
    const form = select.closest('form');
    if (form && form.classList.contains('was-validated')) {
      if (!selectedValue || selectedValue === '') {
        select.classList.add('is-invalid');
        select.classList.remove('is-valid');
      } else {
        select.classList.remove('is-invalid');
        select.classList.add('is-valid');
      }
    }
  }

  public validarCampo(event: Event, campoId: string): void {
    const campo = event.target as HTMLInputElement | HTMLSelectElement;
    const valor = campo.value.trim();
    
    // Solo validar visualmente si el formulario ya ha sido validado (was-validated)
    const form = campo.closest('form');
    if (form && form.classList.contains('was-validated')) {
      // Validaciones específicas por tipo de campo
      switch (campoId) {
        case 'descriptara':
          if (!valor) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
          } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
          }
          break;
          
        case 'start':
          if (!valor) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
          } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
          }
          break;
          
        default:
          // Validación genérica
          if (!valor) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
          } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
          }
          break;
      }
    }
  }

  /**
   * Navega de vuelta al listado de expedientes
   */
  public volverListadoExpedientes(): void {
    this.router.navigate(['/expedientes']);
  }
}
