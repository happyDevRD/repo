import { Component } from '@angular/core';

import { Procedimiento } from './procedimiento';
import { ProcedimientoService } from './procedimiento.service';
import {Router, ActivatedRoute} from '@angular/router'
import { UserSessionService } from '../../core/service/user-session.service';

@Component({
  selector: 'app-form-modif-procedi',
  templateUrl: './form-modif-procedi.component.html',
  styleUrls: ['./form-modif-procedi.component.css']
})
export class FormModifProcediComponent {
  
  public titulo:string = 'Nuevo Procedimiento';
  public nivAcces: string | null = null;

  public procedimiento: Procedimiento = new Procedimiento();



  constructor(public procedimientoService :ProcedimientoService, 
    public router:Router,
    public activatedRoute: ActivatedRoute,
    private session: UserSessionService
    ){
      this.nivAcces = this.session.nivAcces;
    }

    

  ngOnInit(){
    this.cargarProcedimiento()
    


  }

  
  cargarProcedimiento():void {
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if (id){
        this.procedimientoService.getProcedimiento(id).subscribe(
          (procedimiento) => this.procedimiento = procedimiento
        )
      }

    }
      )

  }

  public  create():void {
  /*
  
    this.procedimientoService.create(this.procedimiento)
    .subscribe(procedimiento =>{
       this.router.navigate(['/procedimientos'])
       swal.fire('Procedimiento  ',`Procedimiento ${procedimiento.descripcion} creado con éxito`, 'success')
      }
    );
  
  */
  
   }


}
