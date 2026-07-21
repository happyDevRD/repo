import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { ExpedientesService } from '../expedientes.service';
import { ProcedimientoService } from 'src/app/procedimientos/procedimiento.service';
import { ConsultaDni, CrearInteresado, RepresentanteExpLIstar, VerExpediente } from '../expedientes';
import { GridRadioSelector } from '../../core/helper/grid-radio-selector';
import { TablaClickHandler } from '../../core/helper/tabla-click-handler';
import { NotificationService } from '../../core/service/notification.service';
import { FormValidatorHelper } from '../../core/helper/form-validator.helper';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { UserSessionService } from '../../core/service/user-session.service';



@Component({
  selector: 'app-interesado',
  templateUrl: './interesado.component.html',
  styleUrls: ['./interesado.component.css']
})
export class InteresadoComponent {
  public title = 'Expedientes';
  public relleno:string = 'Datos de prueba';
  public verexpediente:any = new VerExpediente();
  public crearinteresado:CrearInteresado = new CrearInteresado();
  public representanteexplistar:RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public consultadni:ConsultaDni = new ConsultaDni();
  public idExpediente!:number;
  public selected= new Date();
  public formanotificacion:boolean = false  
  public dniok:boolean = false






public nombredni!:string
public apellido1dni!:any
public apellido2dni!:any
public direcciondni!:string
public cpdni!:any
public provinciadni!:any
public nommunicipiodni!:any
public idhispersodni!:any;
public idpersodni!:any;


  public solicitadni(dni:string){
  this.formanotificacion = true;
  this.expedientesService.getDni2(dni).subscribe(response =>{
    this.nombredni=response.desPerEntid ;
    this.apellido1dni=response.apellido1 ;
    this.apellido2dni=response.apellido2;
    this.direcciondni=response.dirPosta ;
    this.cpdni=response.codPosta;
    this.provinciadni=response.provincia ;
    this.idhispersodni=response.idHisPerso ;
    this.idpersodni=response.idPerso ;
    this.nommunicipiodni = response.municipio;
    

   // consultadni =>this.consultadni = consultadni
   if(response.nombre){
    console.log("RESPUESTA : " + response.nombre);
    this.getrepresentanteexpediente(response.idPerso,response.idHisPerso);

   }
   
  }
    
   

  );
  
  
    console.log(dni);
    this.dniok =true;

   
    //setTimeout(this.getrepresentanteexpediente,1500)
   // this.getrepresentanteexpediente ();
  

    
  
  }


  public veorepresentante:boolean = false;
  
   getrepresentanteexpediente(idperso:any,idhisperso:any){
    console.log("idperso DNI : "+ idperso);
    console.log("Argumento http : : "+ idperso);
    this.veorepresentante = true;
    
    this.expedientesService.getRepresentanteExpediente (idperso,idhisperso).subscribe(

    
       representanteexplistar => this.representanteexplistar = representanteexplistar,
       (err:HttpErrorResponse)=> { 
         this.representanteexplistar.desPerEntid = "Sin representante asociado"
        
         console.log('paso por error: ' + err.error.message);
         this.representanteexplistar = new RepresentanteExpLIstar();
         this.crearinteresado.idHisRepre =null;
        this.crearinteresado.idPersoRepre =null;

         

        // swal.fire(err.error.message,'','warning' )    // AQUI GESTIONAMOS EL ERROR
       }, 
       


     
     );
     




   }


  public limpiadatosinteresado(){
    this.dniok = false;
    this.veorepresentante = false;
    this.crearinteresado = new CrearInteresado();
    this.idhispersodni = "";
    this.idpersodni ="";
    this.nombredni ="";
    this.direcciondni ="";
    this.cpdni ="";
    this.provinciadni ="";
    this.nommunicipiodni ="";
    this.representanteexplistar = new  RepresentanteExpLIstar();
    
    // Limpiar errores visuales
    FormValidatorHelper.clearFieldErrors();
  }
  public seleccionoRepre!:any;

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

  public crearInteresado(){
    // Validar campos obligatorios
    const requiredFields = ['interesado', 'fnotifi'];
    const formData = {
      interesado: this.crearinteresado.usuario,
      fnotifi: this.crearinteresado.tipForNotif
    };

    if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
      return;
    }

    // Validar email si es notificación telemática
    if (this.crearinteresado.tipForNotif == 1 && this.crearinteresado.email) {
      if (!FormValidatorHelper.validateEmail(this.crearinteresado.email, this.notificationService)) {
        return;
      }
    }

    // Validar que se haya consultado el DNI
    if (!this.dniok) {
      this.notificationService.warning('Debe consultar el DNI del interesado antes de guardar.');
      return;
    }

    this.crearinteresado.idHisPerso = this.idhispersodni;
    this.crearinteresado.idPerso = this.idpersodni;
    this.crearinteresado.idexpediente = this.idExpediente;
    
    if (this.seleccionoRepre == "1"){
      this.crearinteresado.idHisRepre = this.representanteexplistar.idHisPerso;
      this.crearinteresado.idPersoRepre = this.representanteexplistar.idPerso;
    }
              this.expedientesService.crearInteresado(this.crearinteresado).subscribe(response =>{
          // Actualizar el grid
          this.sourceInteresado = ({
            dataType: 'json',
            dataFields: [
              { name: 'nomInter', type: 'string' },
              { name: 'numDocumInter', type: 'string' },
              { name: 'principal', type: 'any' },
              { name: "nomRepre", type: 'string' },
              { name: "numDocumRepre", type: 'string' },     
              { name : 'id',type :'any'},
              { name: 'forNotif', type: 'any' },
              { name: 'dirInter', type: 'any' },
              { name: 'dirRepre', type: 'any' },
              { name: 'desProviInter', type: 'any' },
              { name: 'desProviRepre', type: 'any' },
              { name: 'desMunicInter', type: 'any' },
              { name: 'desMunicRepre', type: 'any' },
              { name: 'emailNotif', type: 'any' },
            ],
            url: `${environment.apiUrl}interesado/listar/${this.idExpediente}`,
            id: 'id'
          });
          
          this.limpiadatosinteresado();
          this.notificationService.saveSuccess('Interesado');
        },
        (error: HttpErrorResponse) => {
          if(error.status == 403){
            this.notificationService.error(error.error.message);
            this.limpiadatosinteresado();
          } else {
            this.notificationService.saveSuccess('Interesado');
            this.limpiadatosinteresado();
          }
        }
      );
  }

  public borrarinteresados(){    
    this.notificationService.confirmDelete(`interesado: ${this.nombreinteresado}`).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteInteresado(this.idInteresado).subscribe(response =>{
          this.notificationService.deleteSuccess('Interesado');
          this.sourceInteresado = ({
              dataType: 'json',
              dataFields: [
                { name: 'nomInter', type: 'string' },
                { name: 'numDocumInter', type: 'string' },
                { name: 'principal', type: 'any' },
                { name: "nomRepre", type: 'string' },
                { name: "numDocumRepre", type: 'string' },     
                { name : 'id',type :'any'},
                { name: 'forNotif', type: 'any' },
                { name: 'dirInter', type: 'any' },
                { name: 'dirRepre', type: 'any' },
                { name: 'desProviInter', type: 'any' },
                { name: 'desProviRepre', type: 'any' },
                { name: 'desMunicInter', type: 'any' },
                { name: 'desMunicRepre', type: 'any' },
                { name: 'emailNotif', type: 'any' },
                
      
                
              ],
             
             //url: `${environment.apiUrl}interesado/listar/104}`,
             url: `${environment.apiUrl}interesado/listar/${this.idExpediente}`,
             id: 'id',
            // sortcolumn: 'id',
              //  sortdirection: 'desc'
          
             });
        
         },(error: HttpErrorResponse) => {
          if(error.status == 403){
            this.notificationService.error('No se ha podido borrar el elemento. Existen elementos dependientes asociados.');
          } else {
            this.notificationService.error('Error al eliminar el interesado.');
          }
         }
    
          );
        
      }
    })

  }



  // *************** gestión del GRID de INTERESADOS    ****************
  public veoBorraInteresado: boolean = false;
  public idInteresado!:any;
  public nombreinteresado:string;
  public numDocumInter:string;
  public principal:string;
  public nomRepre:string;
  public numDocumRepre:string;
  public forNotif:string;
  public dirInter:string;
  public dirRepre:string;
  public desProviInter:string;
  public desProviRepre:string;
  public desMunicInter:string;
  public desMunicRepre:string;
  public emailNotif:string;
  public veoprincipal:boolean = false;
  public veoemail:boolean = false;
  


  // Método de selección de interesados usando GridRadioSelector
  public clickInteresado = GridRadioSelector.createClickHandler('Interesados', (rowData: any) => {
    this.veoBorraInteresado = true;
    this.emailNotif = rowData.emailNotif;
    this.numDocumInter = rowData.numDocumInter;
    this.principal = rowData.principal;
    this.nomRepre = rowData.nomRepre;
    this.numDocumRepre = rowData.numDocumRepre;
    this.forNotif = rowData.forNotif;
    this.dirInter = rowData.dirInter;
    this.dirRepre = rowData.dirRepre;
    this.desProviInter = rowData.desProviInter;
    this.desProviRepre = rowData.desProviRepre;
    this.desMunicInter = rowData.desMunicInter;
    this.desMunicRepre = rowData.desMunicRepre;  
    this.nombreinteresado = rowData.nomInter;
    this.idInteresado = rowData.id;

    if(rowData.principal == 1){
      this.veoprincipal = true;
    } else {
      this.veoprincipal = false;
    }
    
    if(rowData.forNotif == "TELEMÁTICO"){
      this.veoemail = true;
    } else {
      this.veoemail = false;
    }
  });

  // Método para abrir modal de visualización con doble click
  public abrirModalVerInteresado(event: any) {
    const rowData = event.args.row.bounddata;
    
    // Cargar datos del interesado para visualización
    this.veoBorraInteresado = true;
    this.emailNotif = rowData.emailNotif;
    this.numDocumInter = rowData.numDocumInter;
    this.principal = rowData.principal;
    this.nomRepre = rowData.nomRepre;
    this.numDocumRepre = rowData.numDocumRepre;
    this.forNotif = rowData.forNotif;
    this.dirInter = rowData.dirInter;
    this.dirRepre = rowData.dirRepre;
    this.desProviInter = rowData.desProviInter;
    this.desProviRepre = rowData.desProviRepre;
    this.desMunicInter = rowData.desMunicInter;
    this.desMunicRepre = rowData.desMunicRepre;  
    this.nombreinteresado = rowData.nomInter;
    this.idInteresado = rowData.id;

    if(rowData.principal == 1){
      this.veoprincipal = true;
    } else {
      this.veoprincipal = false;
    }
    
    if(rowData.forNotif == "TELEMÁTICO"){
      this.veoemail = true;
    } else {
      this.veoemail = false;
    }
    
    // Abrir el modal de visualización
    this.abrirModal('verInteresadoModal');
  }

  // Renderer de radio button para selección de interesados usando GridRadioSelector
  public columnseleccion = GridRadioSelector.createRadioRenderer('Interesados', 'Selecciona Interesado');
   
public columnrenderer = function (value) {
  return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
}
public columnrendererInteresado = function (value) {
  return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">'+'<img  src="assets/interesado.svg" width="20" height="20"/>' + value + '</div>';
}
public columnrendererRepresentante = function (value) {
  return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">'+'<img  src="assets/representante.svg" width="20" height="20"/>' + value + '</div>';
}
public cellsrenderer = function (row, column, value) {
  return `<div style="text-align: center; margin-top: 5px;">` + value + '</div>';
}
public cellsrendererPrincipal = function (row, column, value) {
  if(value == 1){
    return `<div style="text-align: center; margin-top: 5px;" title="Interesado Principal">` +'<img  src="assets/boton_verde.png" width="20" height="20"/>'+ '</div>';
  } else {
    return `<div style="text-align: center; margin-top: 5px;">` + '<img  src="assets/boton_rojo.png" width="20" height="20"/>'+ '</div>';
  }
}


  columnsInteresado = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },    
    { text: '', datafield: '',  cellsrenderer: this.columnseleccion, renderer: this.columnrenderer},
    {text: 'Interesado', width:'30%',datafield: 'nomInter',cellsrenderer: this.cellsrenderer,renderer: this.columnrendererInteresado},
    {text: 'Doc. Interesado', datafield: 'numDocumInter',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer},
    {text: 'Principal', datafield: 'principal',cellsrenderer: this.cellsrendererPrincipal,renderer: this.columnrenderer},
    {text: 'Representante', width:'30%', datafield: 'nomRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrendererRepresentante},
    {text: 'Doc. Representante', datafield: 'numDocumRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer},
    
    {text: 'idHisRepre',  datafield: 'idHisRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'idRepre' , datafield: 'idRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'ejeExped' , datafield: 'ejeExped',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'numExped' , datafield: 'numExped',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'idexpediente' , datafield: 'expediente',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'forNotif' , datafield: 'forNotif',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'dirInter' , datafield: 'dirInter',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'dirRepre' , datafield: 'dirRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'desProviInter' , datafield: 'desProviInter',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'desProviRepre' , datafield: 'desProviRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'desMunicInter' , datafield: 'desMunicInter',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'desMunicRepre' , datafield: 'desMunicRepre',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},
    {text: 'emailNotif' , datafield: 'emailNotif',cellsrenderer: this.cellsrenderer,renderer: this.columnrenderer, hidden: true},

    
    


    

  ];
  public localizationObject: any = jqxGrid_ES;


  

  sourceInteresado = new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'nomInter', type: 'string' },
      { name: 'numDocumInter', type: 'string' },
      { name: 'principal', type: 'any' },
      { name: "nomRepre", type: 'string' },
      { name: "numDocumRepre", type: 'string' },     
      { name : 'id',type :'any'},
      { name: 'forNotif', type: 'any' },
      { name: 'dirInter', type: 'any' },
      { name: 'dirRepre', type: 'any' },
      { name: 'desProviInter', type: 'any' },
      { name: 'desProviRepre', type: 'any' },
      { name: 'desMunicInter', type: 'any' },
      { name: 'desMunicRepre', type: 'any' },
      { name: 'emailNotif', type: 'any' },
      
      
    ],
   
   //url: `${environment.apiUrl}interesado/listar/104}`,
   url: `${environment.apiUrl}interesado/listar/${this.idExpediente}`,
   id: 'id',
  // sortcolumn: 'id',
    //  sortdirection: 'desc'

   });
   


  async cargarexpediente(){
   
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']; 
      this.idExpediente = id;
      //this.procediExp =this.verexpediente.procedimiento.descripcion;

      console.log(` ID EXPEDIENTE desde Expedientes : ${this.idExpediente}`);
     // console.log( `${environment.apiUrl}interesado/listar/${this.idExpediente}`)
     this.sourceInteresado = ({
      dataType: 'json',
      dataFields: [
        { name: 'nomInter', type: 'string' },
      { name: 'numDocumInter', type: 'string' },
      { name: 'principal', type: 'any' },
      { name: "nomRepre", type: 'string' },
      { name: "numDocumRepre", type: 'string' },     
      { name : 'id',type :'any'},
      { name: 'forNotif', type: 'any' },
      { name: 'dirInter', type: 'any' },
      { name: 'dirRepre', type: 'any' },
      { name: 'desProviInter', type: 'any' },
      { name: 'desProviRepre', type: 'any' },
      { name: 'desMunicInter', type: 'any' },
      { name: 'desMunicRepre', type: 'any' },
      { name: 'emailNotif', type: 'any' },
        
      
        
      ],
     
     //url: `${environment.apiUrl}interesado/listar/104}`,
     url: `${environment.apiUrl}interesado/listar/${this.idExpediente}`,
     id: 'id',
    // sortcolumn: 'id',
      //  sortdirection: 'desc'
  
     });
      

     
     
     
      if (id){
        this.expedientesService.getExpediente(id).subscribe(        
          
          (verexpediente) => this.verexpediente = verexpediente

          );


       
      }

    }
      )
    }





  
    
 // Función para volver al listado de expedientes
  public volverListadoExpedientes(): void {
    this.router.navigate(['/expedientes']);
  }

 constructor(
  public expedientesService:ExpedientesService,
  public procedimientoService :ProcedimientoService,     
  public router:Router,
  public activatedRoute: ActivatedRoute,
  public http: HttpClient,
  private notificationService: NotificationService,
  private modalManagerService: ModalManagerService,
  public session: UserSessionService
  ){};

  // Gestión de modales
  public abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    // Resetear datos específicos según el modal
    if (modalId === 'ninteresadoModal') {
      this.limpiadatosinteresado();
    }
    
    this.modalManagerService.closeModal(modalId);
  }

  ngOnInit(){

   this.cargarexpediente();
  }



}
