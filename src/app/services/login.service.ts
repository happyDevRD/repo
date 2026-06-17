import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

   private loginUrl: string ='http://localhost:8080/api/';

  getPrueba(){
    return "Parece que funciona"; 
  }


  constructor(private http: HttpClient) { }

 

  getLogin(usuario: string , passw: string ){
    return this.http.get(this.loginUrl + '/'+ usuario + passw);


  }
}
