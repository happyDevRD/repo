import { Component,ElementRef } from '@angular/core';
import { CrearProcedi, Procedimiento, EditarProcedi , CreaTareaProcedi,PlantillaTarea, EditaTareaProcedi,ProcediPermisos,CreaPermisoProcedi, ListarPermiso } from './procedimiento';
import { ProcedimientoService } from './procedimiento.service';
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormnuevoprocediComponent } from './formnuevoprocedi.component';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';

@Component({
  selector: 'app-permisoprocedimiento',
  templateUrl: './permisoprocedimiento.component.html',
  styleUrls: ['./permisoprocedimiento.component.css']
})



export class PermisoprocedimientoComponent {
  public idpro :any = sessionStorage.getItem('idprocedimiento');
  public idpermis :any = sessionStorage.getItem('idpermiso');
  public userctrl:any = sessionStorage.getItem('user');
  public userorg:any = sessionStorage.getItem('idOrgEleme');
  public idPermisoProcedimiento!:number;
  
  public headers = new HttpResponse ;
  public respuesta = new Response;
  
  constructor(
    public location: Location,
    public http: HttpClient,
    
    public router:Router,
    public _location: Location,
    
    public activatedRoute: ActivatedRoute
   
    ){}

  

 

  


  



}
