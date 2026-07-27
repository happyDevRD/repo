import { Component,ElementRef } from '@angular/core';
import { CrearProcedi, Procedimiento, EditarProcedi , CreaTareaProcedi,PlantillaTarea, EditaTareaProcedi,ProcediPermisos,CreaPermisoProcedi, ListarPermiso } from './procedimiento';
import { ProcedimientoService } from './procedimiento.service';
import {Router, ActivatedRoute} from '@angular/router'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import { UserSessionService } from '../../core/service/user-session.service';

@Component({
  selector: 'app-permisoprocedimiento',
  templateUrl: './permisoprocedimiento.component.html',
  styleUrls: ['./permisoprocedimiento.component.css']
})

export class PermisoprocedimientoComponent {
  public idpro: string | null = null;
  public idpermis: string | null = null;
  public userctrl: string | null = null;
  public userorg: string | null = null;
  public idPermisoProcedimiento!:number;
  
  public headers = new HttpResponse ;
  public respuesta = new Response;
  
  constructor(
    public location: Location,
    public http: HttpClient,
    public router:Router,
    public _location: Location,
    public activatedRoute: ActivatedRoute,
    private session: UserSessionService
  ) {
    this.idpro = this.session.idProcedimiento;
    this.idpermis = this.session.idPermiso;
    this.userctrl = this.session.user;
    this.userorg = this.session.idOrgEleme;
  }
}
