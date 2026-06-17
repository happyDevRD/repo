import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subscriber} from 'rxjs';
import {map} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {
  EditarMensaje,
  LeeMensaje,
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  RechazarMensaje
} from '../expedientes/expedientes';
import {ExpedientesService} from '../expedientes/expedientes.service';
import {NotificationService} from '../core/service/notification.service';
import {ModalManagerService} from '../core/service/modal-manager.service';
import {ProcediPermisos} from '../procedimientos/procedimiento';
import {ProcedimientoService} from '../procedimientos/procedimiento.service';
import {environment} from 'src/environments/environment';
import {jqxGrid_ES} from 'src/translations/jqxGrid_translate'
import { GridRadioSelector } from '../core/helper/grid-radio-selector';
import { TablaClickHandler } from '../core/helper/tabla-click-handler';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})


export class MensajesComponent {

  public localizationObject: any = jqxGrid_ES;

  public leermensajerecibido!: LeerMensajeRecibidos[];
  public leermensajeenviados!: LeerMensajeEnviados[];
  public rechazamensaje: RechazarMensaje = new RechazarMensaje()
  public editarmensaje: EditarMensaje = new EditarMensaje()
  public leemensaje: any = new LeeMensaje()
  public procedipermiso!: ProcediPermisos[];

  public title = 'Mensajes';
  public fecha = new Date();

  public formatofecha = `${this.fecha.getFullYear()}-${this.fecha.getMonth()}-${this.fecha.getDay()}`; // formateo de fecha


  public errorHTML!: any;
  public statusHTMLcode!: number;
  public BandejaEntrada = sessionStorage.getItem('MensRecibido');
  public user = sessionStorage.getItem('user');// lo usamos para filtrar contenidos sin login
  public idOrgEleme = sessionStorage.getItem('idOrgEleme');
  public idOrgUsuar = sessionStorage.getItem('idOrgUsuar');
  public page = 5;
  public cambiofecha!: string;
  public pageLabel: string
  public idMensajeRecibido!: number;
  public idMensajeEnviado!: number;
  public idMensaje!: number;
  public mensajeDescripcion!: string;
  public mensajeEstadoReci: number = 1;
  public estadoTramite: number = 1;
  public mensajeEstadoEnvi: boolean = true;
  public idTarea!: number;


  public mensajesRecibidosNumero!: number;

  public mensajesEnviadosNumero!: number;

  public recargarpagina() {
    window.location.reload();
  }

  public tramitarMensaje() {  // no usar Este
    if (this.mensajeEstado == "TRAMITANDO" || this.mensajeEstado == "RECHAZADO") {
      this.notificationService.warning('Lo sentimos. No es posible realizar este paso');
    } else {
      this.editarmensaje.estado = "TRAMITANDO";
      this.editarmensaje.idTarea = this.idTarea;
      this.editarmensaje.nomDesti = this.leemensaje.nomDesti;
      this.editarmensaje.fecTramitacion = this.fecha;
      //this.expedientesService.TramitaMensaje(this.editarmensaje,this.idMensaje).subscribe(response =>this.router.navigate([`/mensajes` ]) );
      this.expedientesService.TramitaMensaje(this.editarmensaje, this.idMensaje).subscribe(response => this.router.navigate([`/mensajes`]));

      // setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo
    }
  }

  public veoenviados: boolean = false;
  public veorecibidos: boolean = true;

  public verRecibidos() {
    this.veorecibidos = true;
    this.veoenviados = false;


  }

  public verEnviados() {
    this.veorecibidos = false;
    this.veoenviados = true;
    this.veoRecha = false;
    this.veorechaTRami = false;


  }


  public TramitarMensaje() {
    // este es el usado para la tramitación

    if (this.mensajeEstado == "LEIDO" || this.mensajeEstado == "PENDIENTE") {


      this.notificationService.confirm({
        title: '¿Está seguro?',
        text: "Esta acción no se podrá revertir",
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.expedientesService.TramitaMensaje(this.editarmensaje, this.idMensaje).subscribe(response => {
            //  this.router.navigate([`/mensajes` ]);


            this.actualizaSourceMensajesEnviados();
            this.actualizaSourceMensajesRecibidos();


          });


          this.notificationService.success('El Mensaje fue tramitado.')
        }
      })


    }
    if (this.mensajeEstado == "TRAMITANDO") {
      this.editarmensaje.estado = "TRAMITANDO";
      this.notificationService.warning('Este mensaje ya se encuentra en Tratamitación')
    }
    if (this.mensajeEstado == "RECHAZADO") {
      this.editarmensaje.estado = "RECHAZADO";
      this.notificationService.warning('Este mensaje se encuentra en estado RECHAZADO')
    }


    //this.expedientesService.EditarMensaje(this.editarmensaje,this.idMensajeRecibido).subscribe(response =>this.router.navigate([`/mensajes` ]) );

    //setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo
  }

  public editarMensaje() {
    if (this.leemensaje.fecLectura == null) {
      this.editarmensaje.fecLectura = this.fecha;
      this.editarmensaje.estado = "LEIDO";
      // console.log("REALIZO cambios en  fecha de lectura");
    } else {

      //console.log( `no realizo Cambios en fecha de lectura ` );


    }

    if (this.leemensaje.estado == "LEIDO" || this.leemensaje.estado == "PENDIENTE") {
      this.editarmensaje.estado = "LEIDO";
    }
    if (this.leemensaje.estado == "TRAMITADO") {
      this.editarmensaje.estado = "TRAMITADO";
    }


    this.expedientesService.EditarMensaje(this.editarmensaje, this.idMensaje).subscribe(response => this.router.navigate([`/mensajes`]));

    setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo
  }

  public limpiaRechazarMensaje() {
    this.rechazamensaje = new RechazarMensaje()
  }

  public rechazaMensaje() {

    if (!this.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.')

    } else {
      if (this.mensajeEstado == "PENDIENTE" || this.mensajeEstado == "LEIDO") {

        this.rechazamensaje.fecRechazo = this.fecha;
        this.rechazamensaje.estado = "RECHAZADO";
        this.rechazamensaje.destinatario = this.mensajeRemitente;

        this.expedientesService.RechazarMensaje(this.rechazamensaje, this.idMensajeRecibido).subscribe(response => this.router.navigate([`/mensajes`]));

        this.actualizaSourceMensajesEnviados();
        this.actualizaSourceMensajesRecibidos();
        setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo


      } else {
        this.notificationService.warning('Este Mensaje No se puede Rechazar,por encontrarse con el  estado: ' + this.mensajeEstado)

      }


    }


  }


  public borrarMensaje() {

    this.notificationService.confirm({
      title: 'Está seguro?',
      text: `El mensaje : " ${this.mensajeDescripcion} ". Una vez borrado no podrá recuperarlo`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.expedientesService.deleteMensaje(this.idMensajeRecibido).subscribe(response => this.router.navigate(['/mensajes']));
        setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo


        this.notificationService.success('El mensaje fue Borrado.')
      }
    })
  }

  public nmensajespendientes: number = 0;

  public numeroMensajespendientes() {
    this.nmensajespendientes = 0;

    try {
      for (let index = 0; index < this.leermensajerecibido.length; index++) {
        console.log("DATOS QUE RECIBO : " + this.leermensajerecibido[index].estado);


        if (this.leermensajerecibido[index].estado == "PENDIENTE") {
          this.nmensajespendientes++;
          console.log("Número de Mensajes Sin leer : " + this.nmensajespendientes);
          sessionStorage.setItem('MensajesRecibidos', this.nmensajespendientes.toString());

        }


        // const element = this.leermensajerecibido[index];

      }

    } catch (error) {
      console.log("Este es el error que tenemos con el length : " + error)

    }


  }

  public vermensajesrecibido() {

    try {


      this.expedientesService.getMensajeListarRecibidos().subscribe(
        leermensajerecibido => this.leermensajerecibido = leermensajerecibido
      );


    } catch (msg) {

      //  console.log(`Error encontrado : ${msg}` );
    }


    try {


      // consulta para ver el mensaje de error
      this.http.get(`${environment.apiUrl}mensaje/listarRecibidos/${this.idOrgUsuar}`).subscribe(
        data => console.log(),
        (error: HttpErrorResponse) => {


          this.errorHTML = error.status;
          this.statusHTMLcode = error.status;
          if (this.errorHTML == 404) {
            this.errorHTML = "No hay Mensajes disponibles"
          } else {
            this.errorHTML = error.status;


          }
          //console.error( `respuesta de la consulta : ${error.status}` );
          //console.log(`Mensaje de error: ${this.statusHTMLcode}`);
        }
      );


    } catch (error) {

    }


  }


  public leoMensaje() {

    // console.log("LEO MENSAJE");
    let url = `${environment.apiUrl}mensaje/ver/`;

    this.http.get(`${url}${this.idMensaje}`).subscribe(
      leemensaje => this.leemensaje = leemensaje
    );
    /*
      if (this.leemensaje.estado =="TRAMITADO"){
        this.estadoTramite = 0;
        console.log(`ESTADO TRAMITE : ${this.estadoTramite}`)
      }else{
        this.estadoTramite = 1;
      }

    */
  }

  public vermensajesEnviados() {


    try {

      this.expedientesService.getMensajeListarEnviados().subscribe(
        leermensajeenviados => this.leermensajeenviados = leermensajeenviados
      );

    } catch (msg) {

      // console.log(`Error encontrado : ${msg}` );
    }


    try {

      // consulta para ver el mensaje de error
      this.http.get(`${environment.apiUrl}mensaje/listarEnviados/${this.idOrgUsuar}`).subscribe(
        data => console.log(),
        (error: HttpErrorResponse) => {
          this.errorHTML = error.status;
          this.statusHTMLcode = error.status;
          if (this.errorHTML == 404) {
            this.errorHTML = "No hay Mensajes disponibles"
          } else {

            this.errorHTML = error.status;

          }
          //console.error( `respuesta de la consulta : ${error.status}` );
          //console.log(`Mensaje de error: ${this.statusHTMLcode}`);
        }
      );


    } catch (error) {

    }

  }

  public marcamensaje(id: number, descrip: string, idtarea: number) {
    this.idMensajeRecibido = id;
    this.idMensajeEnviado = id;
    this.idMensaje = id;
    this.mensajeDescripcion = descrip;
    this.idTarea = idtarea;
    //console.log(`ID MENSAJE : ${this.idMensajeRecibido}`);

    this.formateafechamensaje();
    //this.formatofechalectura()

    this.leoMensaje();

  }


  public formatofechalectura() {


    try {
      for (let index = 0; index < this.leermensajeenviados.length; index++) { // fecha Envio

        this.mensajesEnviadosNumero = this.leermensajeenviados.length;

        if (this.leermensajeenviados[index].fecLectura != null) {
          const element: string = this.leermensajeenviados[index].fecLectura.substring(0, 10);

          this.leermensajeenviados[index].fecLectura = element;

        }


        //this.cambiofecha=element;
      }

      for (let index = 0; index < this.leermensajerecibido.length; index++) { // fecha Recibido

        this.mensajesRecibidosNumero = this.leermensajerecibido.length;
        let MensRecibi = this.leermensajerecibido.length.toString();
        sessionStorage.setItem('MensRecibido', MensRecibi);


        if (this.leermensajerecibido[index].fecLectura != null) {
          const element: string = this.leermensajerecibido[index].fecLectura.substring(0, 10);

          this.leermensajerecibido[index].fecLectura = element;

        }


        //this.cambiofecha=element;
      }


    } catch (err) {
      // console.log(err);

    }


  }

  public formateafechamensaje() {


    try {

      // bandeja de Recibidos

      for (let index = 0; index < this.leermensajerecibido.length; index++) { // fecha Envio

        const element: string = this.leermensajerecibido[index].fecEnvio.substring(0, 10);

        this.leermensajerecibido[index].fecEnvio = element;


        this.cambiofecha = element;
      }


      for (let index = 0; index < this.leermensajerecibido.length; index++) { // estado

        if (
          this.leermensajerecibido[index].estado == "RECHAZADO" && this.leermensajerecibido[index].id == this.idMensajeRecibido) {
          this.mensajeEstadoReci = 0
        } else {
          this.mensajeEstadoReci = 1;

        }


      }


      // bandeja de Enviados

      for (let index = 0; index < this.leermensajeenviados.length; index++) {
        const element: string = this.leermensajeenviados[index].fecEnvio.substring(0, 10);
        this.leermensajeenviados[index].fecEnvio = element;

        this.cambiofecha = element;

      }

      // console.log(`VALOR DE ESTADO MENSAJE RECIBIDO : ${this.mensajeEstadoReci} `)


    } catch (err) {

      //console.log(err);

    }

  }

  constructor(
    public http: HttpClient,
    public router: Router,
    public sanitizer: DomSanitizer,
    public expedientesService: ExpedientesService,
    public procedimientoService: ProcedimientoService,
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService
  ) {

  }

  ngOnInit() {
    this.actualizaSourceMensajesRecibidos();
    console.log("idOrgUsuar: " + this.idOrgUsuar);

    this.actualizaSourceMensajesEnviados();
    //console.log(` URL MENSAJES ENVIADOS : ${environment.apiUrl}expediente/mensaje/listarEnviados/${this.idOrgUsuar}`)

    this.vermensajesrecibido();
    this.vermensajesEnviados();
    this.procedimientoService.getPermisoProcedi().subscribe(
      procedipermisos => this.procedipermiso = procedipermisos
    )
  }

  //Gestión de nuevas tablas
  public actualizaSourceMensajesRecibidos() {


    this.sourceMensajeRecibidos = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'fecEnvio', type: 'string'},
        {name: 'fecLectura', type: 'string'},
        {name: "descripcion", type: 'string'},
        {name: "nomRemit", type: 'string'},
        {name: "estado", type: 'string'},
        {name: 'id', type: 'number'},
        {name: "fecLectura", type: 'string'},
        {name: "fecTramitacion", type: 'string'},
        {name: "fecRechazo", type: 'string'},
        {name: "descripcionRechazo", type: 'string'},
        {name: "nomDesti", type: 'string'},
        {name: "idTarea", type: 'string'},
        {name: "idExped", type: 'string'},
      ],
      url: `${environment.apiUrl}mensaje/listarRecibidos/${this.idOrgUsuar}`,
      // postData:{estado:'estado'    },

      // id: 'id',
      sortcolumn: 'fecha',
      sortdirection: 'desc'
    });

  }

  public actualizaSourceMensajesEnviados() {


    this.sourceMensajeEnviados = ({
      dataType: 'json',
      dataFields: [
        {name: 'fecEnvio', type: 'string'},
        {name: 'fecLectura', type: 'string'},
        {name: "descripcion", type: 'string'},
        {name: "nomDesti", type: 'string'},
        {name: "estado", type: 'string'},

        {name: 'id', type: 'number'},

        {name: "fecLectura", type: 'string'},
        {name: "fecTramitacion", type: 'string'},
        {name: "fecRechazo", type: 'string'},
        {name: "descripcionRechazo", type: 'string'},
        {name: "nomRemit", type: 'string'},
      ],
      url: `${environment.apiUrl}mensaje/listarEnviados/${this.idOrgUsuar}`,

      id: 'id',
      // sortname: 'id',
      //  sortcolumn: 'id',
      //sortdirection: 'desc'
      postData: {
        estado: "LEIDO"
      }


    });

  }

  public mensajeDescrip!: string;
  public mensajeEstado!: string;
  public mensajeFechaInicio!: string;
  public mensajeFechaLectura!: string;
  public mensajeFechaRechazo: any = " ";
  public mensajeFechaTramitacion!: string;
  public mensajeRemitente!: string;
  public mensajeDestinatario!: string;
  public mensajeDescripcionRechazo!: string;


  public marcarLeido() {

    if (this.mensajeEstado == "PENDIENTE") {
      this.rechazamensaje.fecLectura = this.fecha;
      this.rechazamensaje.estado = "LEIDO";

      this.expedientesService.LeerMensaje(this.rechazamensaje, this.idMensajeRecibido).subscribe(response => {
        // this.router.navigate([`/mensajes` ])
        console.log("Mensaje Leido");
        //this.actualizaSourceMensajesEnviados();
        //this.actualizaSourceMensajesRecibidos();

      });

      // this.actualizaSourceMensajesEnviados();
      // this.actualizaSourceMensajesRecibidos();
      setTimeout(this.recargarpagina, 1000);// para que le de tiempo a ejecutarl todo


    }

  }

  // Método para abrir modal de visualización con doble click
  public abrirModalVerMensaje(event: any) {
    const rowData = event.args.row.bounddata;
    
    // Cargar datos del mensaje para visualización
    this.numeroMensajespendientes();
    this.veorechaTRami = true;
    this.veoRecha = true;

    let fechaordenadaEnvio!: string;
    let fechaordenadaRechazo!: string;
    let fechaordenadaTramitacion!: string;
    let fechaordenadafecLectura!: string;

    if (rowData.fecEnvio) {
      let anioEnvio: string = rowData.fecEnvio.substring(0, 4);
      let mesEnvio: string = rowData.fecEnvio.substring(5, 7);
      let diaEnvio: string = rowData.fecEnvio.substring(8, 10);
      fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;
      this.mensajeFechaInicio = fechaordenadaEnvio;
    } else {
      this.mensajeFechaInicio = "";
    }

    if (rowData.fecRechazo) {
      let anioRechazo: string = rowData.fecRechazo.substring(0, 4);
      let mesRechazo: string = rowData.fecRechazo.substring(5, 7);
      let diaRechazo: string = rowData.fecRechazo.substring(8, 10);
      fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
      this.mensajeFechaRechazo = fechaordenadaRechazo;
    } else {
      this.mensajeFechaRechazo = " ";
    }

    if (rowData.fecRechazo == undefined) {
      this.mensajeFechaRechazo = " ";
    }

    if (rowData.fecTramitacion) {
      let anioTramitacion: string = rowData.fecTramitacion.substring(0, 4);
      let mesTramitacion: string = rowData.fecTramitacion.substring(5, 7);
      let diaTramitacion: string = rowData.fecTramitacion.substring(8, 10);
      fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;
    } else {
      this.mensajeFechaTramitacion = "";
    }

    if (rowData.fecLectura) {
      let aniofecLectura: string = rowData.fecLectura.substring(0, 4);
      let mesfecLectura: string = rowData.fecLectura.substring(5, 7);
      let diafecLectura: string = rowData.fecLectura.substring(8, 10);
      fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
      this.mensajeFechaLectura = fechaordenadafecLectura;
    } else {
      this.mensajeFechaLectura = "";
    }

    this.idTarea = rowData.idTarea;
    this.mensajeDescripcionRechazo = rowData.descripcionRechazo;
    this.mensajeEstado = rowData.estado;
    this.mensajeFechaInicio = fechaordenadaEnvio;
    this.mensajeFechaRechazo = fechaordenadaRechazo;
    this.mensajeFechaTramitacion = fechaordenadaTramitacion;
    this.mensajeRemitente = rowData.nomRemit;
    this.mensajeDestinatario = rowData.nomDesti;
    this.mensajeDescrip = rowData.descripcion;
    this.idMensajeRecibido = rowData.id;
    this.idMensaje = rowData.id;

    // Abrir el modal de visualización
    const modal = document.getElementById('VerMensajeModal');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  public veorechaTRami: boolean = false;
  public veoRecha: boolean = false;

  public ClickMensajesRecibidos(event) {
    this.numeroMensajespendientes();

    this.veorechaTRami = true;
    this.veoRecha = true;


    let fechaordenadaEnvio!: string;
    let fechaordenadaRechazo!: string;
    let fechaordenadaTramitacion!: string
    let fechaordenadafecLectura!: string

    if (event.args.row.bounddata.fecEnvio) {
      let anioEnvio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
      let mesEnvio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
      let diaEnvio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
      fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;

      this.mensajeFechaInicio = fechaordenadaEnvio;


    } else {
      this.mensajeFechaInicio = ""

    }

    if (event.args.row.bounddata.fecRechazo) {
      let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
      let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
      let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
      fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
      this.mensajeFechaRechazo = fechaordenadaRechazo
      console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

    } else {
      this.mensajeFechaRechazo = " "

    }
    if (event.args.row.bounddata.fecRechazo == undefined) {
      console.log("fecha rechazo : " + this.mensajeFechaRechazo)
      this.mensajeFechaRechazo = " "

    }

    if (event.args.row.bounddata.fecTramitacion) {

      let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
      let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
      let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
      fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;

    } else {
      this.mensajeFechaTramitacion = ""

    }


    if (event.args.row.bounddata.fecLectura) {
      let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
      let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
      let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
      fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
      this.mensajeFechaLectura = fechaordenadafecLectura;

    } else {
      this.mensajeFechaLectura = ""

    }


    this.idTarea = event.args.row.bounddata.idTarea;
    this.mensajeDescripcionRechazo = event.args.row.bounddata.descripcionRechazo;
    this.mensajeEstado = event.args.row.bounddata.estado;
    this.mensajeFechaInicio = fechaordenadaEnvio;
//this. mensajeFechaLectura=event.args.row.bounddata.fecLectura;

    this.mensajeFechaRechazo = fechaordenadaRechazo;
//this. mensajeFechaRechazo=event.args.row.bounddata.fecRechazo;
//this. mensajeFechaTramitacion=event.args.row.bounddata.fecTramitacion;
    this.mensajeFechaTramitacion = fechaordenadaTramitacion;
    this.mensajeRemitente = event.args.row.bounddata.nomRemit;
    this.mensajeDestinatario = event.args.row.bounddata.nomDesti;
    this.mensajeDescrip = event.args.row.bounddata.descripcion;
    this.idMensajeRecibido = event.args.row.bounddata.id;
    this.idMensaje = event.args.row.bounddata.id;

    if (this.mensajeEstado == "LEIDO") {
      if (event.args.row.bounddata.fecEnvio) {
        let anioEnvio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
        let mesEnvio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
        let diaEnvio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
        fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;

        this.mensajeFechaInicio = fechaordenadaEnvio;


      } else {
        this.mensajeFechaInicio = ""

      }

      if (event.args.row.bounddata.fecRechazo) {
        let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
        let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
        let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
        fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
        this.mensajeFechaRechazo = fechaordenadaRechazo
        console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

      } else {
        this.mensajeFechaRechazo = ""

      }

      if (event.args.row.bounddata.fecTramitacion) {

        let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
        let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
        let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
        fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;

      } else {
        this.mensajeFechaTramitacion = ""

      }


      if (event.args.row.bounddata.fecLectura) {
        let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
        let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
        let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
        fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
        this.mensajeFechaLectura = fechaordenadafecLectura;

      } else {
        this.mensajeFechaLectura = ""

      }


    }
    if (this.mensajeEstado == "PENDIENTE") {
      if (event.args.row.bounddata.fecEnvio) {
        let anioEnvio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
        let mesEnvio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
        let diaEnvio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
        fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;

        this.mensajeFechaInicio = fechaordenadaEnvio;


      } else {
        this.mensajeFechaInicio = ""

      }

      if (event.args.row.bounddata.fecRechazo) {
        let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
        let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
        let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
        fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
        this.mensajeFechaRechazo = fechaordenadaRechazo
        console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

      } else {
        this.mensajeFechaRechazo = ""

      }

      if (event.args.row.bounddata.fecTramitacion) {

        let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
        let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
        let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
        fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;

      } else {
        this.mensajeFechaTramitacion = ""

      }


      if (event.args.row.bounddata.fecLectura) {
        let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
        let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
        let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
        fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
        this.mensajeFechaLectura = fechaordenadafecLectura;

      } else {
        this.mensajeFechaLectura = ""

      }


    }


    if (this.mensajeEstado == "TRAMITANDO") {
      this.veorechaTRami = false;

      if (event.args.row.bounddata.fecEnvio) {
        let anioEnvio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
        let mesEnvio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
        let diaEnvio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
        fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;

        this.mensajeFechaInicio = fechaordenadaEnvio;


      } else {
        this.mensajeFechaInicio = ""

      }

      if (event.args.row.bounddata.fecRechazo) {
        let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
        let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
        let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
        fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
        this.mensajeFechaRechazo = fechaordenadaRechazo
        console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

      } else {
        this.mensajeFechaRechazo = ""

      }

      if (event.args.row.bounddata.fecTramitacion) {

        let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
        let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
        let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
        fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;

      } else {
        this.mensajeFechaTramitacion = ""

      }


      if (event.args.row.bounddata.fecLectura) {
        let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
        let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
        let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
        fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
        this.mensajeFechaLectura = fechaordenadafecLectura;

      } else {
        this.mensajeFechaLectura = ""

      }


    } else {
      this.veorechaTRami = true;

    }

    if (this.mensajeEstado == "RECHAZADO") {
      this.veoRecha = false;

      if (event.args.row.bounddata.fecEnvio) {
        let anioEnvio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
        let mesEnvio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
        let diaEnvio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
        fechaordenadaEnvio = diaEnvio + "/" + mesEnvio + "/" + anioEnvio;

        this.mensajeFechaInicio = fechaordenadaEnvio;


      } else {
        this.mensajeFechaInicio = ""

      }

      if (event.args.row.bounddata.fecRechazo) {
        let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
        let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
        let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
        fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
        this.mensajeFechaRechazo = fechaordenadaRechazo
        console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

      } else {
        this.mensajeFechaRechazo = ""

      }

      if (event.args.row.bounddata.fecTramitacion) {

        let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
        let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
        let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
        fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;

      } else {
        this.mensajeFechaTramitacion = ""

      }


      if (event.args.row.bounddata.fecLectura) {
        let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
        let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
        let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
        fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
        this.mensajeFechaLectura = fechaordenadafecLectura;

      } else {
        this.mensajeFechaLectura = ""

      }


    } else {
      this.veoRecha = true;
      this.mensajeFechaRechazo = ""

    }
    console.log("mensajes: :" + this.idMensajeRecibido)


  }

  public ClickMensajesEnviados(event) {
    console.log("URL : " + `${environment.apiUrl}mensaje/listarEnviados/${this.idOrgUsuar}`)

    let fechaordenadaEnvio!: string;
    let fechaordenadaRechazo!: string;
    let fechaordenadaTramitacion!: string
    let fechaordenadafecLectura!: string
    this.veorechaTRami = false;
    this.mensajeDescripcionRechazo = event.args.row.bounddata.descripcionRechazo;
    this.mensajeEstado = event.args.row.bounddata.estado;

    this.mensajeRemitente = event.args.row.bounddata.nomRemit;
    this.mensajeDestinatario = event.args.row.bounddata.nomDesti;
    this.mensajeDescrip = event.args.row.bounddata.descripcion;
    this.idMensajeRecibido = event.args.row.bounddata.id;
    this.idMensaje = event.args.row.bounddata.id;


    if (event.args.row.bounddata.fecRechazo) {
      let anioRechazo: string = event.args.row.bounddata.fecRechazo.substring(0, 4);
      let mesRechazo: string = event.args.row.bounddata.fecRechazo.substring(5, 7);
      let diaRechazo: string = event.args.row.bounddata.fecRechazo.substring(8, 10);
      fechaordenadaRechazo = diaRechazo + "/" + mesRechazo + "/" + anioRechazo;
      this.mensajeFechaRechazo = fechaordenadaRechazo;
      console.log("mensajeFechaRechazo " + this.mensajeFechaRechazo)

    } else {
      this.mensajeFechaRechazo = "";

    }

    if (event.args.row.bounddata.fecEnvio) {
      let anioinicio: string = event.args.row.bounddata.fecEnvio.substring(0, 4);
      let mesinicio: string = event.args.row.bounddata.fecEnvio.substring(5, 7);
      let diainicio: string = event.args.row.bounddata.fecEnvio.substring(8, 10);
      fechaordenadaEnvio = diainicio + "/" + mesinicio + "/" + anioinicio;
      this.mensajeFechaInicio = fechaordenadaEnvio;
      console.log("mensajeFechaInicio " + this.mensajeFechaInicio)

    } else {
      this.mensajeFechaInicio = "";

    }
    if (event.args.row.bounddata.fecTramitacion) {

      let anioTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(0, 4);
      let mesTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(5, 7);
      let diaTramitacion: string = event.args.row.bounddata.fecTramitacion.substring(8, 10);
      fechaordenadaTramitacion = diaTramitacion + "/" + mesTramitacion + "/" + anioTramitacion;
      this.mensajeFechaTramitacion = fechaordenadaTramitacion;
      console.log("mensajeFechaTramitacion " + this.mensajeFechaTramitacion)

    } else {
      this.mensajeFechaTramitacion = "";

    }


    if (event.args.row.bounddata.fecLectura) {
      let aniofecLectura: string = event.args.row.bounddata.fecLectura.substring(0, 4);
      let mesfecLectura: string = event.args.row.bounddata.fecLectura.substring(5, 7);
      let diafecLectura: string = event.args.row.bounddata.fecLectura.substring(8, 10);
      fechaordenadafecLectura = diafecLectura + "/" + mesfecLectura + "/" + aniofecLectura;
      this.mensajeFechaLectura = fechaordenadafecLectura;
      console.log("mensajeFechaLectura " + this.mensajeFechaLectura)

    } else {
      this.mensajeFechaLectura = "";

    }


  }

  public cellclick = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-family: Verdana;">' + value + '</div>';
  }

  public columnrenderer = function (value) {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  }

  public columnseleccion = function (value) {


    return ' <div style="padding-top:5px; ;text-align: center;"  type="button"  ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';


  }


  public cellsrenderer = function (row, column, value) {
    switch (value) {
      case null:
        return `<div style="text-align: center; color:green; margin-top: 5px;"></div>`;
      case "PENDIENTE":
        return `<div style="text-align: center; color:green; margin-top: 5px;">` + value + '</div>';
      case "CERRADO":
        return `<div style="text-align: center; color:red; margin-top: 5px;">` + value + '</div>';
      case "CANCELADO":
        return `<div style="text-align: center; color:red; margin-top: 5px;">` + value + '</div>';
      default:
        return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
    }
  }


  public cellsrendererFecha = function (row, column, value) {
    let recorteFecha: string = value.substr(0, 10);
    let anio: string = value.substring(0, 4);
    let mes: string = value.substring(5, 7);
    let dia: string = value.substring(8, 10);
    let fechaordenada: string = dia + "-" + mes + "-" + anio;

    let recorteHora: string = value.substring(12, 14);
    let reverse: string = (recorteFecha)

    if (!value) {
      recorteFecha = "Sin fecha registrada"
      return `<div style="text-align: center; color:red;margin-top: 5px;"  type="button"  >` + recorteFecha + '</div>';
    } else {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  >` + dia + "-" + mes + "-" + anio + '</div>';

    }


  }


  columnsMensajeEnviados = [
    {text: 'id', datafield: 'id', hidden: true},
    //{text: 'Id', datafield: 'id'},
    {
      text: '',
      datafield: '',
      width: '1%',
      cellsrenderer: this.columnseleccion,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'Emisión',
      width: '15%',
      datafield: 'fecEnvio',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    // {text: 'Fecha Lectura' , width: '14%',datafield:'fecLectura', cellsrenderer: this.cellsrendererFecha,renderer: this.columnrenderer, hidden: true},
    {
      text: 'Descripción',
      width: '50%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {text: 'Destinatario', datafield: 'nomDesti', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Estado', datafield: 'estado', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {
      text: 'Acciones',
      datafield: 'Acciones',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },

    {
      text: 'fecLectura',
      datafield: 'fecLectura',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'fecTramitacion',
      datafield: 'fecTramitacion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'fecRechazo',
      datafield: 'fecRechazo',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'descripcionRechazo',
      datafield: 'descripcionRechazo',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'nomRemit',
      datafield: 'nomRemit',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },

  ];


  sourceMensajeEnviados = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'fecEnvio', type: 'string'},
      {name: 'fecLectura', type: 'string'},
      {name: "descripcion", type: 'string'},
      {name: "nomDesti", type: 'string'},
      {name: "estado", type: 'string'},

      {name: 'id', type: 'number'},

      {name: "fecLectura", type: 'string'},
      {name: "fecTramitacion", type: 'string'},
      {name: "fecRechazo", type: 'string'},
      {name: "descripcionRechazo", type: 'string'},
      {name: "nomRemit", type: 'string'},
    ],
    url: `${environment.apiUrl}mensaje/listarEnviados/${this.idOrgUsuar}`,
    postData: {
      estado: "LEIDO"
    }

    // id: 'OrderID',
    // sortname: 'id',
    //  sortcolumn: 'id',
    // sortdirection: 'desc'

  });


  columnsMensajeRecibidos = [
    {text: 'id', datafield: 'id', hidden: true},
    //{text: 'Id', datafield: 'id'},
    {text: '', datafield: '', width: '1%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer},
    {
      text: 'Emisión',
      width: '15%',
      datafield: 'fecEnvio',
      cellsrenderer: this.cellsrendererFecha,
      renderer: this.columnrenderer
    },
    //{text: 'Fecha Lectura' , width: '14%',datafield:'fecLectura', cellsrenderer: this.cellsrendererFecha,renderer: this.columnrenderer, hidden: true},
    {
      text: 'Descripción',
      width: '50%',
      datafield: 'descripcion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer
    },
    {text: 'Expediente número', datafield: 'idExped', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Remitente', datafield: 'nomRemit', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Estado', datafield: 'estado', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {
      text: 'Acciones',
      datafield: 'Acciones',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },

    {
      text: 'fecLectura',
      datafield: 'fecLectura',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'fecTramitacion',
      datafield: 'fecTramitacion',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'fecRechazo',
      datafield: 'fecRechazo',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'descripcionRechazo',
      datafield: 'descripcionRechazo',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'nomDesti',
      datafield: 'nomDesti',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },
    {
      text: 'IdTarea',
      datafield: 'idTarea',
      cellsrenderer: this.cellsrenderer,
      renderer: this.columnrenderer,
      hidden: true
    },


  ];


  sourceMensajeRecibidos = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'fecEnvio', type: 'string'},
      {name: 'fecLectura', type: 'string'},
      {name: "descripcion", type: 'string'},
      {name: "nomRemit", type: 'string'},
      {name: "estado", type: 'string'},
      {name: 'id', type: 'number'},
      {name: "fecLectura", type: 'string'},
      {name: "fecTramitacion", type: 'string'},
      {name: "fecRechazo", type: 'string'},
      {name: "descripcionRechazo", type: 'string'},
      {name: "nomDesti", type: 'string'},
      {name: "idTarea", type: 'string'},
      {name: "idExped", type: 'string'},
    ],
    url: `${environment.apiUrl}expediente/mensaje/listarRecibidos/${this.idOrgUsuar}`,
    // postData:{estado:'estado'    },

    // id: 'id',
    sortcolumn: 'fecha',
    sortdirection: 'desc'


  });

  // ===== MÉTODOS PARA MODALES =====
  
  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  public validateAndEditMensaje(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.editarmensaje.descripcion || !this.editarmensaje.destinatario || this.editarmensaje.informativo === undefined) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }

    this.editarMensaje();
    this.cerrarModal('EditarMensajeModal');
  }

  public validateAndRechazarMensaje(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }

    this.rechazaMensaje();
    this.cerrarModal('DevolverMensajeModal');
  }

  public validateAndTramitarMensaje(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.editarmensaje.descripcion || !this.editarmensaje.destinatario || this.editarmensaje.informativo === undefined) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }

    this.TramitarMensaje();
    this.cerrarModal('TramitarMensajeModal');
  }
}


