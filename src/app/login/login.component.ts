import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService]
})
export class LoginComponent {
 public  titulo = 'Login';
 public aplicacion  = 'Gestor de Expedientes iFlow';

 public usuario!:Usuario;
 public fecha:Date = new Date();
 public anio:any = this.fecha.getFullYear();




 constructor(public authService: AuthService,  private http: HttpClient, public router: Router){
  this.usuario = new Usuario();

 }


 rutaTxt :string | null =sessionStorage.getItem('ruta');


 // lectura de txt para poder configurar la conexion  a la API-REST desde un fichero txt
 conectorApi?: string ;
 conectorSensores?: string ;



 readTextFile(file: string): void {
   this.http.get(file, { responseType: 'text' })
     .subscribe(data => {



       //this.textContent = data.slice(10);
       const lines = data.split('\n'); // separamos lineas del txt

       this.conectorApi = lines[0].slice(9); // quitamos la descripcion inicial de cada linea
       this.conectorSensores= lines[1].slice(12);
       console.log("ruta txt 1: " + this.conectorApi!);
       //console.log("ruta txt 2: " + this.conectorSensores!);
       sessionStorage.setItem('ruta',data.slice(9)); // enviamos valor al sesionStorage
       localStorage.setItem('api',data.slice(9)); // enviamos valor al localStorage

      console.log("ruta txt del sessionStorage : " + this.rutaTxt!)



     },
     (error: HttpErrorResponse) => {
      console.error(error.status);
      if (error.status== 404){
        Swal.fire('Problemas con la configuración ','El fichero configurador no existe', 'error');

      }else{
        Swal.fire('Problemas con la configuración ','El fichero configurador no esta adecuadamente relleno', 'error');

      }

    }
     );
 }


 logout(){

  window.addEventListener("beforeunload", () => sessionStorage.removeItem('MensRecibido'));

 }

 ngOnInit(): void {

  this.logout();
  this.readTextFile('assets/configurador.txt');



}
public direccHTTPS:string;

login_certifi(){
  console.log(" click en certificados")
  this.authService.login_certifi(this.usuario).subscribe(response=>{

    console.log("CONECTADO con certificados" + response.idPerso);
    let idperso =response.idPerso
    let idHisPerso =response.idHisPerso

    this.authService.buscousuario(idHisPerso,idperso).subscribe(response =>{
      let objeto = JSON.stringify(response);

     // console.log("datos--> " + objeto)

      let user = response.usuario;
      let depart = response.departamento;
      let token = response.token;
      let nivAcces = response.nivAcces;
      let solUsuar = response.solUsuar;
      let traUsuar = response.traUsuar;
      let idOrgUsuar = response.idOrgUsuar;
      let idOrgElemen =response.idOrgEleme;
      let idOrgan = response.idOrgan;

// Gestion del LocalStorage

localStorage.setItem('user',user);
localStorage.setItem('nivAcces',nivAcces);
localStorage.setItem('token',token);
sessionStorage.setItem('idOrgan',idOrgan);
sessionStorage.setItem('idOrgEleme',idOrgElemen);
sessionStorage.setItem('departamento',depart);
sessionStorage.setItem('token',token);
sessionStorage.setItem('user',user);
sessionStorage.setItem('nivAcces',nivAcces);
sessionStorage.setItem('solUsuar',solUsuar);
sessionStorage.setItem('traUsuar',traUsuar);
sessionStorage.setItem('idOrgUsuar',idOrgUsuar);


    this.router.navigate(['/inicio']);


     },
     )


  },
    (err:HttpErrorResponse) => {



     if(err.status == 500){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  err.error.message,
          footer: 'El usuario al que corresponde el certificado no esta Registrado '
        })

     }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:  err.error.message,
        footer: 'No se pudo realizar la conexión '
      })

     }

    }

  );




}

revisaCodigo(codigoreci:string){

  //console.log ("ESTE ES EL CODIGO QUE ME LLEGA : --> " + codigoreci)
  //console.log ("ESTE ES EL CODIGO QUE TENGO : --> " + this.codigoLogin)
  localStorage.setItem('codigo-introducido',this.codigo);

if(this.codigoLogin == codigoreci){

 this.router.navigate(['/inicio']);


  }else{
    this.router.navigate(['/login']);
   Swal.fire('',`El código introducido no es correcto`,'error'); // este swall es el original

  }



}
public veoFormuCodigo:boolean = false;
public spinner:boolean = false;
public codigo:string;
public codigoLogin:string;

login(): void{
  this.spinner = true;
 // console.log(`environment: ${environment.apiUrl}`)
 // console.log(this.usuario);

  if (this.usuario.usuario == '' || this.usuario.password == ''){
    Swal.fire('Error Login','Hay campos vacios!!!', 'error');
    return;
  }


  this.authService.login(this.usuario).subscribe(response =>{
    console.table(response);
    this.spinner = false;
    this.veoFormuCodigo = true;
    console.log(response);

// Gestion del LocalStorage
this.codigoLogin = response.codigo
let user = response.usuario;
let depart = response.departamento;
let token = response.token;
let nivAcces = response.nivAcces;
let solUsuar = response.solUsuar;
let traUsuar = response.traUsuar;
let idOrgUsuar = response.idOrgUsuar;
let idOrgElemen =response.idOrgEleme;
let idOrgan = response.idOrgan;





localStorage.setItem('codEntid',response.codEntid);

localStorage.setItem('codigo-login',response.codigo);
localStorage.setItem('user',user);
localStorage.setItem('nivAcces',nivAcces);
localStorage.setItem('token',token);
sessionStorage.setItem('idOrgan',idOrgan);
sessionStorage.setItem('idOrgEleme',idOrgElemen);
sessionStorage.setItem('departamento',depart);
sessionStorage.setItem('token',token);
sessionStorage.setItem('user',user);
sessionStorage.setItem('nivAcces',nivAcces);
sessionStorage.setItem('solUsuar',solUsuar);
sessionStorage.setItem('traUsuar',traUsuar);
sessionStorage.setItem('idOrgUsuar',idOrgUsuar);

if (response.codigo == 0 ){
  this.veoFormuCodigo = false;
  this.router.navigate(['/inicio']);

}

//console.log(performance.navigation.type);
//console.log(`datos del login : ${performance.navigation.type} `);


//this.router.navigate(['/inicio']); activar cuando se actualice  inicio


  },err => {
    this.spinner = false;

    Swal.fire('Error Login',err.error.message, 'error');
   if (err.status ==404){Swal.fire('Error Login','Usuario o Clave incorrectas!!', 'error');    }
  }
  );


}




}


