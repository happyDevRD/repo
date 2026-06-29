import {ChangeDetectorRef, Component} from '@angular/core';
import {
  CreaPermisoProcedi,
  CrearProcedi,
  CreaTareaProcedi,
  EditarProcedi,
  EditaTareaProcedi,
  ListarPermiso,
  PlantillaTarea,
  Procedimiento,
  ProcediPermisos,
  UsuariosListar
} from './procedimiento';
import {ProcedimientoService} from './procedimiento.service';
import {ActivatedRoute, Router} from '@angular/router'
import Swal from 'sweetalert2';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {FormnuevoprocediComponent} from './formnuevoprocedi.component';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Location} from '@angular/common';
import {jqxGrid_ES} from 'src/translations/jqxGrid_translate';
import {UserSessionService} from '../core/service/user-session.service';
declare var bootstrap: any;


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
  plantilla!: string
}

class ProcedimientoCreado {
  // clase creada para usar los datos del json que nos devuelve la creacion de nuevo procedimiento
  id!: number;
  descripcion!: string;
  departamento: any = [
    {
      idOrgEleme: '',
      idOrgan: '',
      cadEleme: '',
      desEleme: '',
      accesible: '',
      organo: '',
      usuContr: '',
      idOrgElePadre: '',
      fecContr: ''
    }];

  codigoSia!: string;
  usuContr!: String;

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

class PermisoProcediCreado {
  // clase creada para usar los datos que retorna la creacion de tareas desde createpermisoprocedi
  idproceso!: number;
  idtarea!: number;
  usuario!: string;
  usuctrl!: string;


}

class RespuestasHttp {

  error!: any;
  headers!: any;
  status!: number;
  statusText!: string;
  url!: string;


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

@Component({
  selector: 'app-edita-procedimiento',
  templateUrl: './edita-procedimiento.component.html',
  styleUrls: ['./edita-procedimiento.component.css']
})
export class EditaProcedimientoComponent {

  public edicion: boolean = false;
  public edicionPermisos: boolean = false;
  public vermenu: boolean = false; // para ver el menu tiene que cambiar a true
  public idProcedimiento!: number;
  // datos tarea
  public idverTarea!: number;
  public descripcionT!: string;
  public descripTarea!: any;
  public faseT!: string;
  public plazot!: number;
  public tipoPlazoT!: string;
  public plantillaT!: string;
  public firmaT!: string;
  // fin datos tarea
  public idpro: string | null = null;
  public idpermis: string | null = null;
  public userctrl: string | null = null;
  public userorg: string | null = null;
  public usuariopermiso!: string;
  public refrescavista: boolean = true;
  public respuesta = new Response;
  public respuestahttp: any = new RespuestasHttp;
  public headers = new HttpResponse;
  navPosition: string = 'relative';
  public idOrgElemen: string | null = null;
  public usuarioTarea!: any;


  // Datos para la paginación
  public page!: number;
  public npagina: number = 5;

  public statuspermiso!: number;


  public titulo = 'Editar Procedimiento';
  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );
  public crearprocedi: CrearProcedi = new CrearProcedi();
  public editarprocedi: EditarProcedi = new EditarProcedi();
  public editatareaprocedi: any = new EditaTareaProcedi();
  public nivAcces: string | null = null;
  public depart: string | null = null;
  public datoslistapermiso: boolean = false;

  listatareaprocedi!: ListaTareaProcedi[];
  public tipplazo: string = "AÑOS";
  public procedimiento: Procedimiento = new Procedimiento();
  public activamenu!: FormnuevoprocediComponent;
  public procedimientocreado: any = new ProcedimientoCreado;
  public tareaprocedicreada: any = new TareaProcediCreada;
  public permisoprocedicreado: any = new PermisoProcediCreado;
  public creatareaprocedi: CreaTareaProcedi = new CreaTareaProcedi();
  public creapermisoprocedi: CreaPermisoProcedi = new CreaPermisoProcedi();
  public procedipermisos: any = new ProcediPermisos();
  public procediparametroid!: string;
  public urltareas!: string;

  firmalistar!: FirmaListar[];
  plantillatarea!: PlantillaTarea[];
  procedipermiso!: ProcediPermisos[];
  procedimientos!: Procedimiento[];
  listapermiso!: ListarPermiso[];
  usuarioslistar!: UsuariosListar[];
  lispermis: ListarPermiso = new ListarPermiso();

  public idPermisoProcedimiento!: number;
  public veoBorrarTarea: boolean = false
  public activoFormNuevoPermiso: boolean = false;
  public botonNuevoPermiso: boolean = true;
  public prueba = document.getElementById("prueba");
  public texto: string = 'Saludos';
  public idtrigger: any;
  public localizationObject: any = jqxGrid_ES;
  source = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'descripcion', type: 'string'},
      {name: 'faseTarea', type: 'string'},
      {name: "plazo", type: 'string'},
      {name: "tipoPlazo", type: 'string'},
      {name: 'id', type: 'any'},
      {name: 'plantillaDefecto', type: 'any'},


    ],

    url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idpro,

    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc'


  });
  refresco: any = this._location.getState();
  sourcePermi = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      {name: 'usuario', type: 'string'},
      {name: 'desProce', type: 'string'},
      {name: "desTareaProce", type: 'string'},
      {name: 'descripcion', type: 'any'},
      {name: 'id', type: 'any'},
    ],
    url: `${environment.apiUrl}permiso/listar/${this.idpermis}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc'


  });
  public usuarioTareaDescrip!: any;

  constructor(
    public procedimientoService: ProcedimientoService,
    public location: Location,
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    public router: Router,
    public _location: Location,
    public activatedRoute: ActivatedRoute,
    public session: UserSessionService
  ) {
    this.idpro = this.session.idProcedimiento;
    this.idpermis = this.session.idPermiso;
    this.userctrl = this.session.user;
    this.userorg = this.session.idOrgEleme;
    this.idOrgElemen = this.session.idOrgEleme;
    this.nivAcces = this.session.nivAcces;
    this.depart = this.session.department;
  }

  refreshView() {
    // Realiza cambios en los datos del componente aquí.
    // Luego, fuerza la actualización de la vista.
    // this.changeDetectorRef.detectChanges();
    this.refrescavista = false;

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.procediparametroid = id;
      this.idProcedimiento = id;
    });

    console.log("PROCEDIPARAMID: " + this.procediparametroid);

    // Cargar datos necesarios
    this.cargarProcedimiento();
    this.getUsuarios();
    
    // Cargar plantillas de tareas
    this.procedimientoService.getPlantillaTareas().subscribe({
      next: (plantillatarea) => {
        this.plantillatarea = plantillatarea;
        console.log('Plantillas cargadas:', plantillatarea);
      },
      error: (error) => {
        console.error('Error al cargar plantillas:', error);
      }
    });

    this.listaprocedi();

    // Cargar permisos de procedimiento
    this.procedimientoService.getPermisoProcedi().subscribe({
      next: (procedipermisos) => {
        this.procedipermiso = procedipermisos;
        console.log('Permisos cargados:', procedipermisos);
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
      }
    });

    console.log("RESULTADO DE PARAMETROS: " + this.urltareas);
  }

  getUsuarios() {
    this.procedimientoService.getUsuarios().subscribe(
      usuarioslistar => this.usuarioslistar = usuarioslistar
    )
  }

  listaprocedi() {
    this.getListaTareas().subscribe(
      listatareaprocedi => this.listatareaprocedi = listatareaprocedi
    );
  }

  getFirma(plantilla: string): Observable<FirmaListar[]> {
    let urlgetfirmado: string = `${environment.apiUrl}procesoFirmado/listar/${plantilla}`;
    return this.http.get(urlgetfirmado).pipe(map(response => response as FirmaListar[]));
  }

  public tempoVerBorrarTarea(): void {
    this.veoBorrarTarea = false;
    console.log("no se tiene que ver ya!!!! :" + this.veoBorrarTarea);

  }

  public idpermisosPermi(event: any) {
    this.veoBorrarTarea = true;


    this.usuarioTarea = event.args.row.bounddata.usuario;
    this.idPermisoProcedimiento = event.args.row.bounddata.id;

    console.log(`usuario de tarea: ${this.usuarioTarea}`);
    this.filtraUsuarios();

    this.nuevojqx(this.idPermisoProcedimiento);

    setTimeout(this.tempoVerBorrarTarea, 3500);

  }

  public activaFormNuevoPermiso() {
    this.botonNuevoPermiso = false;
    this.activoFormNuevoPermiso = true;
    this.veoBorrarTarea = false;

    console.log("nuevo permiso pulsado");
  }

  public deleteTareaProcedimiento() {


    Swal.fire({
      title: '¿ Esta seguro ?',
      text: "Eliminar Tarea",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedimientoService.deleteTareaProcedimiento(this.idPermisoProcedimiento).subscribe(response => {

            this.respuestahttp = response;// guardamos la respuesta http en la clase procedimientocreado
            console.log(`RESPUESTA body : ${this.headers} `);
            this.source = ({
              dataType: 'json',
              dataFields: [
                {name: 'descripcion', type: 'string'},
                {name: 'faseTarea', type: 'string'},
                {name: "plazo", type: 'string'},
                {name: "tipoPlazo", type: 'string'},
                {name: 'id', type: 'any'},
                {name: 'plantillaDefecto', type: 'any'},


              ],

              url: `${environment.apiUrl}tareaProcedimiento/listar/` + this.idpro,
              //url: `${environment.apiUrl}tareaProcedimiento/listar/${this.idProcedimiento}`,
              // url: this.urltareas,
              id: 'id',
              sortcolumn: 'id',
              sortdirection: 'desc'


            });
          }
        );
        //this.router.navigate(['/procedimientos']);
        // window.location.reload();
        //setTimeout(this.recargarpagina, 1500);


        let resulta = JSON.stringify(this.respuesta.headers);

        console.log(`MAS DATOS :  ${resulta}`)
        let statusCode = this.respuesta.body;


        // if (this.respuesta.status == 200 ){
        if (this.respuesta.status == 200) {

          Swal.fire('Tarea Eliminada!', '', 'success')

        } else {
          Swal.fire('No se pudo eliminar la Tarea!', '', 'info')


        }
      }
    })


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
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedimientoService.deletePermisoProcedimiento(this.idPermisoProcedimiento).subscribe(response => {

            this.respuestahttp = response;//
            this.veoBorrarTarea = false;
            console.log(`RESPUESTA body : ${this.headers} `);
            this.sourcePermi = ({
              dataType: 'json',
              dataFields: [
                {name: 'usuario', type: 'string'},
                {name: 'desProce', type: 'string'},
                {name: "desTareaProce", type: 'string'},

                {name: 'id', type: 'any'},


              ],

              url: `${environment.apiUrl}permiso/listar/${this.idtrigger}`,

              id: 'id',
              sortcolumn: 'id',
              sortdirection: 'desc'

            });
          }
        );
        //this.router.navigate(['/procedimientos']);
        //window.location.reload();
        // setTimeout(this.recargarpagina, 1500);


        let resulta = JSON.stringify(this.respuesta.headers);

        console.log(`MAS DATOS :  ${resulta}`)
        let statusCode = this.respuesta.body;


        // if (this.respuesta.status == 200 ){
        if (this.respuesta.status == 200) {

          Swal.fire('Permiso Eliminado!', '', 'success')

        } else {
          Swal.fire('No se pudo eliminar el Permiso!', '', 'info')


        }
      }
    })


  }

  vacio(): void {

    console.log("PULSADO!!!");
    console.log(`ID TAREA PULSADA : ${this.idverTarea}`);


  } // borrar cuando no sea necesario

  public cambiamosDOM() {
    this.vermenu = false;
    this.usuarioTarea = "";
  }

  lanzaSourcePermi(id: any) {
    console.log("valor del triggeri!!!!" + id);


    this.sourcePermi = ({
      dataType: 'json',
      dataFields: [
        {name: 'usuario', type: 'string'},
        {name: 'desProce', type: 'string'},
        {name: "desTareaProce", type: 'string'},

        {name: 'id', type: 'any'},


      ],

      url: `${environment.apiUrl}permiso/listar/${id}`,

      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'

    })

    console.log("LANZANDO lanzaSourcePermi!!!!");
    console.log(`${environment.apiUrl}permiso/listar/${id}`);
  }

  envioid(event: any) {
    this.usuarioTarea = "";
    this.filtraUsuarios();
    this.vermenu = true;
    this.sourcePermi = "";
    this.veoBorrarTarea = false;
    this.idPermisoProcedimiento = event.args.row.bounddata.id;
    this.idverTarea = event.args.row.bounddata.id;
    this.idtrigger = event.args.row.bounddata.id;
    this.descripcionT = event.args.row.bounddata.descripcion;
    this.faseT = event.args.row.bounddata.faseTarea;
    this.plazot = event.args.row.bounddata.plazo;
    this.tipoPlazoT = event.args.row.bounddata.tipoPlazo;
    this.plantillaT = event.args.row.bounddata.plantillaDefecto;
    
    // Inicializar correctamente el objeto de edición
    this.editatareaprocedi = {
      descripcion: event.args.row.bounddata.descripcion || '',
      faseTarea: event.args.row.bounddata.faseTarea || '',
      plazo: event.args.row.bounddata.plazo || null,
      tipoPlazo: event.args.row.bounddata.tipoPlazo || '',
      plantillaDefecto: event.args.row.bounddata.plantillaDefecto || '',
      firmaPorDefecto: event.args.row.bounddata.firmaPorDefecto || null,
      plantillaDefectoModulo: event.args.row.bounddata.plantillaDefectoModulo || null,
      acciones: event.args.row.bounddata.acciones || ''
    };
    
    // Cargar datos de firma si hay plantilla seleccionada
    if (event.args.row.bounddata.plantillaDefecto) {
      this.peparadatosfirma(event.args.row.bounddata.plantillaDefecto);
    }
    
    let idpermi = event.args.row.bounddata.id;
    this.session.setIdPermiso(idpermi);

    console.log('ID PERMISO : ' + idpermi);

    this.sourcePermi = ({
      dataType: 'json',
      dataFields: [
        {name: 'usuario', type: 'string'},
        {name: 'desProce', type: 'string'},
        {name: "desTareaProce", type: 'string'},
        {name: 'id', type: 'any'},
      ],
      url: `${environment.apiUrl}permiso/listar/${event.args.row.bounddata.id}`,
      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'
    })

    console.log(`URL con idpermi : ${environment.apiUrl}permiso/listar/${idpermi}`);
    console.log(`URL con event : ${environment.apiUrl}permiso/listar/${event.args.row.bounddata.id}`);
    console.log(`DATOS DEL ID DE TAREAS : ${this.idverTarea}`)

    try {
      this.listarPermisoProcedimiento(event.args.row.bounddata.id);
    } catch (error) {

    }

    if (this.idverTarea != null) {
      this.edicion = true;
      this.vermenu = true;
      this.listarPermisoProcedimiento(event.args.row.bounddata.id);
    } else {
      this.edicion = false;
      this.vermenu = false;
    }
    this.lanzaSourcePermi(event.args.row.bounddata.id);
  }

  peparadatosfirma(plantilla: string) {
    console.log(`Cargando datos de firma para plantilla: ${plantilla}`);

    // Si no hay plantilla seleccionada, limpiar la lista de firmas
    if (!plantilla || plantilla === '') {
      this.firmalistar = [];
      this.editatareaprocedi.firmaPorDefecto = null;
      return;
    }

    try {
      this.getFirma(plantilla).subscribe({
        next: (firmalistar) => {
          this.firmalistar = firmalistar;
          console.log('Datos de firma cargados:', firmalistar);
          
          // Si hay firmas disponibles, seleccionar la primera por defecto
          if (firmalistar && firmalistar.length > 0) {
            this.editatareaprocedi.firmaPorDefecto = firmalistar[0].idProFirma;
          }
        },
        error: (error) => {
          console.error('Error al cargar datos de firma:', error);
          this.firmalistar = [];
          this.editatareaprocedi.firmaPorDefecto = null;
        }
      });
    } catch (error) {
      console.error('Error en peparadatosfirma:', error);
      this.firmalistar = [];
      this.editatareaprocedi.firmaPorDefecto = null;
    }
  }

  cargarProcedimiento(): void {


    this.activatedRoute.params.subscribe(params => {
        let id = params['id'];
        this.idProcedimiento = id;
        this.procediparametroid = id;

        console.log(`DATOS ID Bueno : ${this.idProcedimiento}`)
        if (id) {
          this.procedimientoService.getProcedimiento(id).subscribe(
            (procedimiento) => this.procedimiento = procedimiento
          )
        }

      }
    )

  }

  getListaTareas(): Observable<ListaTareaProcedi[]> {

    let idProce: number = this.idProcedimiento;
    let urlListatareas: string = `${environment.apiUrl}tareaProcedimiento/listar/${idProce}`;
    this.urltareas = urlListatareas;

    console.log(`url : ${urlListatareas}`);
    console.log(`varialble TAREa procedimiento id  : ${idProce} ` + this.idProcedimiento);


    return this.http.get(urlListatareas).pipe(
      map(response => response as ListaTareaProcedi[])
    );

  }

  public listarPermisoProcedimiento(id: number) {

    //console.log(`datoslistapermiso: ${this.datoslistapermiso}`)


    //console.log(`datos basura = : ${this.lispermis[0]?.usuario}`)

    try {
      if (this.statuspermiso == 404) {

        this.datoslistapermiso = false;
        console.log(`NO HAY DATOS DE LISTA DE PERMISOS : `);

      }


    } catch (error) {
      // console.error(error);

    }


  }

  public createTareaProcedi(procedureId: number): void {
    try {
      // Registro del ID del procedimiento
      console.log(`ID PROCEDIMIENTO: ${procedureId}`);

      // Si el plazo es nulo, se establece en 0 por defecto
      if (this.creatareaprocedi.plazo == null) {
        this.creatareaprocedi.plazo = 0;
      }

      // Se invoca el servicio para crear la tarea del procedimiento
      this.procedimientoService.createTareaProcedi(this.creatareaprocedi, procedureId)
        .subscribe(
          (response) => {
            // Se almacena la respuesta recibida
            this.tareaprocedicreada = response;

            // Se configura la fuente de datos para actualizar la lista de tareas
            this.source = {
              dataType: 'json',
              dataFields: [
                {name: 'descripcion', type: 'string'},
                {name: 'faseTarea', type: 'string'},
                {name: 'plazo', type: 'string'},
                {name: 'tipoPlazo', type: 'string'},
                {name: 'id', type: 'any'},
                {name: 'plantillaDefecto', type: 'any'}
              ],
              url: `${environment.apiUrl}tareaProcedimiento/listar/${this.idpro}`,
              id: 'id',
              sortcolumn: 'id',
              sortdirection: 'desc'
            };

            // Se muestra un mensaje de éxito al usuario
            Swal.fire('Nueva Tarea', 'Creada con éxito', 'success');
          },
          (error: HttpErrorResponse) => {
            console.error(`STATUS ERROR: ${error.status}`);

            // Se muestra un mensaje de error dependiendo del código recibido
            if (error.status === 500) {
              Swal.fire('La nueva Tarea', 'No pudo ser creada. Revise los campos vacíos.', 'warning');
            } else {
              Swal.fire('Error', 'Ocurrió un error inesperado al crear la tarea.', 'error');
            }
          }
        );
    } catch (error) {
      console.error(`Error en createTareaProcedi: ${error}`);
    }
  }

  cambiarPosicion() {
    this.navPosition = 'absolute'; // Cambia la posición del nav a 'absolute'
  }

  public atrasCrearPermisoProcedi() {
    this.activoFormNuevoPermiso = false;
    this.botonNuevoPermiso = true;

  }

  public createPermisoProcedi(): void {
    this.refrescavista = true;
    this.activoFormNuevoPermiso = false;
    this.botonNuevoPermiso = true;


    let usuarioPermiso: string = this.creapermisoprocedi.usuario;

    console.log(`CREANDO PERMISO TAREA PROCEDIMIENTO... }`);
    console.log(`USUARIO PERMISO...-. ${usuarioPermiso}`);


    this.procedimientoService.createPermisoProcedi(this.creapermisoprocedi, this.idProcedimiento, this.idverTarea, this.userctrl, usuarioPermiso)
      .subscribe(response => {
        this.permisoprocedicreado = response,
          this.sourcePermi = ({
            dataType: 'json',
            dataFields: [
              {name: 'usuario', type: 'string'},
              {name: 'desProce', type: 'string'},
              {name: "desTareaProce", type: 'string'},
              {name: 'id', type: 'any'},
            ],
            url: `${environment.apiUrl}permiso/listar/${this.idtrigger}`,
            id: 'id',
            sortcolumn: 'id',
            sortdirection: 'desc'
          });
      });
    this.refreshView();
    this.cambiarPosicion();
  }

  public editaProcedi(id: number): void {
    this.procedimientoService.editaProcedi(this.editarprocedi, id)
      .subscribe(response => this.router.navigate(['/procedimientos']));   // llama a la funcion create de procedimientosSer
  }

  public editaTareaProcedim(): void {
    // Validaciones
    if (this.editatareaprocedi.plazo == null || this.editatareaprocedi.plazo == "") {
      this.editatareaprocedi.plazo = 0;
      this.editatareaprocedi.tipoPlazo = "SINPLAZO";
    }

    // Validar que tenemos un ID válido
    if (!this.idverTarea) {
      console.error("No hay ID de tarea válido para editar");
      Swal.fire('Error', 'No se puede identificar la tarea a editar', 'error');
      return;
    }

    console.log("editatareaprocedi:", this.editatareaprocedi);
    console.log("idvertarea:", this.idverTarea);

    this.procedimientoService.editaTareaProcedimiento(this.editatareaprocedi, this.idverTarea)
      .subscribe({
        next: (response) => {
          console.log("Modificación exitosa:", response);
          
          // Mostrar mensaje de éxito
          Swal.fire('Éxito', 'Tarea modificada correctamente', 'success');
          
          // Actualizar la fuente de datos del grid
          this.actualizarGridTareas();
          
          // Cerrar el modal (si está abierto)
          const modal = document.getElementById('modifitareasModal');
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        },
        error: (error) => {
          console.error("Error al modificar tarea:", error);
          Swal.fire('Error', 'No se pudo modificar la tarea. Revise los datos e intente nuevamente.', 'error');
        }
      });
  }

  // Método auxiliar para actualizar el grid
  private actualizarGridTareas(): void {
    this.source = new jqx.dataAdapter({
      dataType: 'json',
      dataFields: [
        {name: 'descripcion', type: 'string'},
        {name: 'faseTarea', type: 'string'},
        {name: "plazo", type: 'string'},
        {name: "tipoPlazo", type: 'string'},
        {name: 'id', type: 'any'},
        {name: 'plantillaDefecto', type: 'any'},
      ],
      url: `${environment.apiUrl}tareaProcedimiento/listar/${this.idpro}`,
      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'
    });
  }

  public columnrenderer = function (value) {
    return '<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">' + value + '</div>';
  }


  // PARA NUEVOS FILTROS JQX

  public columnrendererSelecTarea = function (value) {
    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea"  ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';
  }

  public cellsrenderer = (row, column, value) => {

    // console.log("DATOS DE VALUE : "+value);
    if (value == 'Tarea inicial automática') {
      console.log("DATOS DE row : " + row);
      console.log("DATOS DE column : " + column);
      console.log("DATOS DE value : " + value);
      return '<div  style="  text-align: center; font-family: Verdana; margin-top: 5px;"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';
    }


    const descripTarea2 = value;
    this.session.setDescripTarea(String(descripTarea2));
    if (value == 'ANOS') {
      value = 'AÑOS';
      console.log("DATOS DE row : " + row);
      console.log("DATOS DE column : " + column);

    }
    if (value <= 0 || value == "SINPLAZO") {
      value = "SIN PLAZO"
      return '<div style="color:red;  text-align: center; font-family: Verdana; margin-top: 5px;"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';

    } else {
      return '<div style="  text-align: center;font-family: Verdana; margin-top: 5px;"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';
    }
  }

  columns = [
    {text: 'id',                datafield: 'id',                width: '1%',  hidden: true},
    {text: 'plantillaDefecto',  datafield: 'plantillaDefecto',  width: '1%',  hidden: true},
    {text: '',                  datafield: '',                  width: '5%',  cellsrenderer: this.columnrendererSelecTarea, renderer: this.columnrenderer},
    {text: 'Descripción',       datafield: 'descripcion',                     cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Fase',              datafield: 'faseTarea',                       cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Plazo',             datafield: 'plazo',                           cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    {text: 'Tipo plazo',        datafield: 'tipoPlazo',                       cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
  ];

  trigger() {
    this.filtraUsuarios();
    this.idpermis = this.idtrigger;
    console.log("id permis tiene valor: " + this.idpermis);

    if (!this.idpermis) {

      console.log("idpermis no tiene valor")

      this.session.setIdPermiso(this.idtrigger);

      this.sourcePermi = ({
        dataType: 'json',
        dataFields: [
          {name: 'usuario', type: 'string'},
          {name: 'desProce', type: 'string'},
          {name: "desTareaProce", type: 'string'},

          {name: 'id', type: 'any'},


        ],

        url: `${environment.apiUrl}permiso/listar/${this.idtrigger}`,

        id: 'id',
        sortcolumn: 'id',
        sortdirection: 'desc'

      });


    }


    console.log("PULSANDO id trigger: " + this.idtrigger);

    //

    //sessionStorage.setItem('idpermiso',this.idtrigger);


    this.sourcePermi = ({
      dataType: 'json',
      dataFields: [
        {name: 'usuario', type: 'string'},
        {name: 'desProce', type: 'string'},
        {name: "desTareaProce", type: 'string'},

        {name: 'id', type: 'any'},


      ],

      url: `${environment.apiUrl}permiso/listar/${this.idtrigger}`,

      id: 'id',
      sortcolumn: 'id',
      sortdirection: 'desc'

    });


    //console.log ("nombres ... :"+this.sourcePermi[0]  );


    return this.sourcePermi;


  }

  public columnrendererPermi = function (value) {

    return '<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">' + value + '</div>';
  }

  public cellsrendererPermi = (row, column, value) => {

    const resultado: any = value.id;
    this.session.setUsuarioTarea(String(resultado));

    if (value == 'ANOS') {
      value = 'AÑOS';
    }
    return '<div style="text-align: center;font-family: Verdana; margin-top: 5px;"  >' + value + '</div>';
  }

  columnsPermi = [
    {text: 'id', datafield: 'id', width: '1%', hidden: true},

    {text: 'Usuario', datafield: 'usuario', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrendererPermi},
    {
      text: 'Procedimiento',
      datafield: 'desProce',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrenderer,
      hidden: true
    },
    {text: 'Descripción', datafield: "descripcion", renderer: this.columnrenderer, hidden: true},
    {text: 'Tarea', datafield: 'desTareaProce', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrenderer},

  ];

  filtraUsuarios() {


    for (let index = 0; index < this.usuarioslistar.length; index++) {


      if (this.usuarioTarea == null) {
        this.usuarioTarea = "Pulsa sobre el usuario para obtener datos";

      }
      if (this.usuarioTarea == this.usuarioslistar[index].usuario || this.usuarioTarea == this.userctrl) {
        console.log(`NOMBRE DE USUARIO : ${this.usuarioslistar[index].usuario}`)
        console.log(`DESCRIPCIÓN DE USUARIO : ${this.usuarioslistar[index].desUsuario}`)
        this.usuarioTareaDescrip = this.usuarioslistar[index].desUsuario;
      }
    }
  }

  nuevojqx(idpermis: any) {
    const columnsPermi = [
      {text: 'id', datafield: 'id', width: '1%', hidden: true},
      {text: 'Usuario', datafield: 'usuario', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
      {text: 'Procedimiento', datafield: 'desProce', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
      {text: 'Tarea', datafield: 'desTareaProce', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer},
    ];
  }
}
