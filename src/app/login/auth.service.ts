import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec, HttpXhrBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http:HttpClient) { }

  // para gestion de certificado digital





login_certifi(usuario:Usuario):Observable<any> {


  let urlGet = `${environment.apiUrlhttps}certificado/usuarioC`;
  console.log("urlhttps :  ----> " + urlGet)
  const headers = new HttpHeaders({
    'Content-Type':  "application/x-www-form-urlencoded",
 //  'Content-Type':  'application/json',
 //  'Authorization': 'Bearer <token>',
  // 'Accept': 'application/json',
  // 'X-Requested-With': 'XMLHttpRequest',
  // 'Origin': 'https://localhost:4200/login',
  // 'Referer': 'https://10.234.253.77:8443'

  });




    return this.http.get(urlGet, { headers });


}

buscousuario(idHisPerso:any,idPerso:any): Observable<any>{
  let direccHTTPS = `${environment.apiUrl}usuarioC/${idHisPerso}/${idPerso}`;
  console.log("datos ---> "+ direccHTTPS);

  return this.http.get(direccHTTPS);



}

  login(usuario:Usuario): Observable<any> {
    const urlLogin = `${environment.apiUrl}usuario/login`;
    const body = { usuario: usuario.usuario, password: usuario.password };
    return this.http.post<any>(urlLogin, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  loginLegacy(usuario:Usuario): Observable<any> {

/*
  const url_params = new HttpParams()
  .set('rejectUnauthorized', 'false')
  .set('requestCert', 'false')
  .set('insecure', 'true')
*/

    let cespeciales = encodeURIComponent(usuario.password);
   // const urlEndPoint ='http://10.234.253.77:8090/api/gos/usuario';
    const urlEndPoint =`${environment.apiUrl}usuario/`;
    let urlGet = `${environment.apiUrl}usuario/${usuario.usuario}/${cespeciales}`;
   // console.log("Valor environment : " +urlGet);


    let respuesta = new Response();
    let result = JSON.stringify(respuesta.statusText );
   // console.log( `DATOS DE RESPONSE : ${result} `);


     let credenciales = `${usuario.usuario}/${usuario.password}`;


    const httpHeaders = new HttpHeaders({
     // 'Content-Type': 'application/json',
      'Content-Type' : 'application/x-www-form-urlencoded',


      // para conector tls
      /*
      mode: 'cors',
      clientAuth:"want",
      keystorePass:"changeit",
      scheme:"https",
      requestCert :'true',
      secure:"true",
      sslProtocol:"TLS",
      SSLEnabled:"true",
      acceptCount:"100",
      insecure: 'true',
      rejectUnauthorized:"false",
      certificateVerification:"optionalNoCA",
      credentials: 'include',
 */

     'Authorization': 'Basic ' + credenciales

  });
  let params = new URLSearchParams();
  params.set(
    'grant_type',
    'password' );
    params.set ('usuario', usuario.usuario);
    params.set ('password', usuario.password);


    //console.log(params.toString());






    return this.http.post<any>(urlGet,params.toString(), {headers: httpHeaders});
  // return httpClient.post<any>(urlGet,params.toString(), {headers: httpHeaders}); // para comprovacion decertificados digitales



  }
}
