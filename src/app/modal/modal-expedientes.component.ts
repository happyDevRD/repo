import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { ExpedientesService } from '../expedientes/expedientes.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EditExpediente,VerExpediente } from '../expedientes/expedientes';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-modal-expedientes',
  templateUrl: './modal-expedientes.component.html',
  styleUrls: ['./modal-expedientes.component.css']
})
export class ModalExpedientesComponent {
  public variable!:any;
  public editexpediente:EditExpediente = new EditExpediente();
  public verexpediente: VerExpediente =new VerExpediente();
  selected= new Date();
  public modal1!:string;

  idexpediente:any = sessionStorage.getItem("idexpediente");




 constructor(
  public expedientesService:ExpedientesService,
  public router:Router,
  public http: HttpClient){};


  ngOnInit(){
    this.getExpediente()

  }



  public editExpediente(){

    this.expedientesService.editarExpediente(this.editexpediente,this.idexpediente)
      .subscribe(response =>this.router.navigate(['/expedientes']) );

  }

  public getExpediente(): Observable < VerExpediente[]>{

    console.log("SE A ENVIADO LA CONSULTA");
    console.log(`ID DEL EXPEDIENTE DESDE MODAL: ${this.idexpediente}`);

    let consulta:string =`http://10.234.252.145:8090/api/gos/expediente/ver/${this.idexpediente}`;
    return this.http.get(consulta).pipe(
      map(response => response as VerExpediente[])
     );
  }

public prueba(){




  if (this.modal1 ==null || this.modal1 == ""){
    sessionStorage.setItem("asuntoModal","SIN DATOS");
    console.log(`NO HAY DATOS : ${this.modal1}`);
    Swal.fire('Error Entrada de datos','el campo no puede estar vacio!!!', 'error');

  }else{

  sessionStorage.setItem("asuntoModal",this.modal1);
  console.log(`datos modal asunto : ${this.modal1}`);


}
}

}
