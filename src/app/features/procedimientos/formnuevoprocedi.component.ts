import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearProcedi, Procedimiento, CreaTareaProcedi, PlantillaTarea, EditaTareaProcedi } from './procedimiento';
import { ProcedimientoService } from './procedimiento.service';
import {Router, ActivatedRoute} from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { __await } from 'tslib';
import { environment } from 'src/environments/environment';
import { UserSessionService } from '../../core/service/user-session.service';
import { Location } from '@angular/common';
import { NotificationService } from '../../core/service/notification.service';
import { ProcedimientoUiService } from './procedimiento-ui.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { FormValidatorHelper } from '../../core/helper/form-validator.helper';



class  FirmaListar{
 // clase creada para usar los datos del json que nos devuelve listado de firma
  idProFirma!: number;
  tipFirma!: number;
  modulo!:number;
  conDesat!: boolean;
  activo!: boolean;
  descripcionCircuito!: string;
  usuContr!: any;
  fecContr!: any;
  codEntid!: number;
  plantilla!: string

}

class ListaTareaProcedi{


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


class ProcedimientoCreado{
// clase creada para usar los datos del json que nos devuelve la creacion de nuevo procedimiento
  id!:number;
    descripcion!:string;
    departamento:any =[
        { idOrgEleme:'',
        idOrgan:'',
        cadEleme:'',
        desEleme: '',
        accesible: '',
        organo: '',
        usuContr: '',
        idOrgElePadre: '',
        fecContr: ''
        }];

    codigoSia!:string;
    usuContr!:String;

}

class TareaProcediCreada{
  // clase creada para usar los datos que retorna la creacion de tareas desde createTareaProcedi
  id!: number;
  procedimiento!:number;
  descripcion!: string;
  faseTarea!: string;
  plazo!:number;
  tipoPlazo!: string;
  tareaAutomatica!: string;
  plantillaDefectoModulo!:number;
  plantillaDefecto!: string;
  procesoFirmadoDefecto!: string;
  usuContr!: string

}

@Component({
  selector: 'app-formnuevoprocedi',
  templateUrl: './formnuevoprocedi.component.html',
  styleUrls: ['./formnuevoprocedi.component.css']
})
export class FormnuevoprocediComponent {
  private readonly destroyRef = inject(DestroyRef)
  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );
  public procedimientocreado:any = new ProcedimientoCreado;
  public tareaprocedicreada:any =new TareaProcediCreada;
  listatareaprocedi!:ListaTareaProcedi[];
  // datos tarea
  public idverTarea!:number;
  public descripcionT!:string;
  public faseT!:string;
  public plazot!:number;
  public tipoPlazoT!:string;
  public plantillaT!:string;
  public firmaT!:string;

  public edicion:boolean = false;
  public edicionPermisos:boolean = false;

  public respuestacrear!:any;
  public vermenu:boolean = false; // para ver el menu tiene que cambiar a true
  public vermenudesdemodifi = true;
  public crearprocedi: CrearProcedi = new CrearProcedi();
  public creatareaprocedi:CreaTareaProcedi = new CreaTareaProcedi();
  public editatareaprocedi: EditaTareaProcedi = new EditaTareaProcedi();
  public idProcedimiento!:number;
  public titulo:string = 'Nuevo procedimiento';
  public nivAcces: string | null = null;
  public depart: string | null = null;
  procedimientos!: Procedimiento[];
  plantillatarea!:PlantillaTarea[];
  firmalistar!:FirmaListar[];
  firmaDom!:any;

  //procesofirmadolistar!:ProcesoFirmadoListar[];
  //public datos = { "departamento": this.crearprocedi.departamento };


  //crearprocedi!:CrearProcedi[];
  public vistamenu:boolean = false;
  public procedimiento: Procedimiento = new Procedimiento();

  public urlCrear :string =`${environment.apiUrl}procedimiento/crear`;



  constructor(public procedimientoService :ProcedimientoService,
    public location: Location,
    public http: HttpClient,
    public router:Router,
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private procedimientoUi: ProcedimientoUiService,
    private session: UserSessionService
    ){
      this.nivAcces = this.session.nivAcces;
      this.depart = this.session.department;
    }


    envioid(id:number,descrip:string,fase:string,plazo:number,tipoplaz:string,planti:string){
      this.descripcionT = descrip;
      this.faseT = fase;
      this.plazot = plazo;
      this.tipoPlazoT = tipoplaz;
      this.idverTarea = id;
      this.plantillaT = planti;

      this.editatareaprocedi.descripcion = descrip || '';
      this.editatareaprocedi.faseTarea = fase || '';
      this.editatareaprocedi.plazo = plazo ?? 0;
      this.editatareaprocedi.tipoPlazo = tipoplaz || '';
      this.editatareaprocedi.plantillaDefecto = planti || '';
      this.editatareaprocedi.firmaPorDefecto = null;
      this.editatareaprocedi.acciones = '';

      if (planti) {
        this.peparadatosfirma(planti);
      }

      this.edicion = this.idverTarea != null;
    }


    vacio():void{





     } // borrar cuando no sea necesario


  getListaTareas(): Observable < ListaTareaProcedi[]> {

    let idProce:number = this.idProcedimiento;
    let urlListatareas:string = `${environment.apiUrl}tareaProcedimiento/listar/${idProce}`;




     return this.http.get(urlListatareas).pipe(
      map(response => response as ListaTareaProcedi[])
     );

  }




  ngOnInit(){
    this.procedimientoService.getPlantillaTareas().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      plantillatarea => this.plantillatarea = plantillatarea
    );

    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.idProcedimiento = +id;
        this.procedimientocreado.id = this.idProcedimiento;
        this.vermenu = true;
        this.cargarProcedimiento();
        this.refreshListaTareas();
        return;
      }

      this.procedimientoUi.requestOpenNuevoProcedimiento();
      this.router.navigate(['/procedimientos'], { replaceUrl: true });
    });
  }

  refreshListaTareas(): void {
    if (!this.idProcedimiento) {
      return;
    }
    this.getListaTareas().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      listatareaprocedi => this.listatareaprocedi = listatareaprocedi
    );
  }


  getFirma (plantilla:string):Observable <FirmaListar[]>{
    let urlgetfirmado:string =`${environment.apiUrl}procesoFirmado/listar/${plantilla}`;

    return this.http.get(urlgetfirmado).pipe(map (response =>response as FirmaListar[]));


     }


  cargarProcedimiento():void {


    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params =>{
      let id = params['id']
      if (id){
        this.procedimientoService.getProcedimiento(id).pipe(
          takeUntilDestroyed(this.destroyRef),
        ).subscribe(
          (procedimiento) => this.procedimiento = procedimiento
        )
      }

    }
      )

  }


 public  create(descrip:string,sia:string,depart:string):void {

  // Validar campos obligatorios
  const requiredFields = ['descripcion', 'codigoSIA'];
  const formData = {
    descripcion: this.crearprocedi.descripcion,
    codigoSIA: this.crearprocedi.codigoSia
  };

  if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
    return;
  }

  this.procedimientoService.create(this.crearprocedi).pipe(
    takeUntilDestroyed(this.destroyRef),
  ).subscribe({
    next: (response) => {

      if(response.id){
        this.notificationService.saveSuccess('Procedimiento');
        this.router.navigate(['/procedimientos']);
      }
    },
    error: (err) => {
      console.error('Error: ' + err.status);
      if (err.status == 403){
        this.notificationService.error('La descripción está duplicada o hay campos vacíos');
      } else {
        this.notificationService.error('Error al crear el procedimiento');
      }
    }
  });



 }
   public mandaaprocedimientos(){
  this.router.navigate(['/procedimientos'])
 }

 /**
  * Limpia los errores visuales del formulario
  */
 public limpiarErrores(): void {
   FormValidatorHelper.clearFieldErrors();
 }

 /**
  * Valida un campo individual cuando el usuario lo completa
  */
 public validateField(fieldName: string, value: any): void {
   if (value && value.toString().trim() !== '') {
     FormValidatorHelper.markFieldAsValid(fieldName);
   } else {
     FormValidatorHelper.markFieldAsError(fieldName);
   }
 }



 public createTareaProcedi(id?: number): void {
  const procedimientoId = id ?? this.idProcedimiento ?? this.procedimientocreado?.id;
  if (!procedimientoId) {
    this.notificationService.error('No se ha identificado el procedimiento');
    return;
  }

  this.procedimientoService.createTareaProcedi(this.creatareaprocedi, procedimientoId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.notificationService.saveSuccess('Tarea');
        this.creatareaprocedi = new CreaTareaProcedi();
        this.refreshListaTareas();
        const modal = document.getElementById('tareasModal');
        if (modal) {
          ModalManagerService.getInstance()?.closeModal('tareasModal');
        }
      },
      error: () => this.notificationService.error('Error al crear la tarea')
    });
  }

  public editaTareaProcedim(): void {
    if (!this.idverTarea) {
      this.notificationService.error('Seleccione una tarea para editar');
      return;
    }

    if (this.editatareaprocedi.plazo == null || (this.editatareaprocedi.plazo as unknown) === '') {
      this.editatareaprocedi.plazo = 0;
      this.editatareaprocedi.tipoPlazo = 'SINPLAZO';
    }

    this.procedimientoService.editaTareaProcedimiento(this.editatareaprocedi, this.idverTarea)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.saveSuccess('Tarea');
          this.refreshListaTareas();
          const modal = document.getElementById('modifitareasModal');
          if (modal) {
            ModalManagerService.getInstance()?.closeModal('modifitareasModal');
          }
        },
        error: () => this.notificationService.error('Error al modificar la tarea')
      });
  }



  recargarpagina(){
    this.location.back();
    //window.location.reload();
  }



   peparadatosfirma(plantilla:string){

    //console.log(`EJECUTANDO!!! : ${plantilla}`);

    this.getFirma(plantilla).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      firmalistar =>this.firmalistar = firmalistar

    );



  }

  // no se esta usando
  public preparaplantilla(Id:number):void{
   // let firma:number = this.procesofirmadolistar[0]?.idProFirma;
   this.procedimientoService.createTareaProcedi(this.creatareaprocedi,Id).pipe(
     takeUntilDestroyed(this.destroyRef),
   ).subscribe(response =>
   {
     this.tareaprocedicreada = response;
   } );
  }
}
