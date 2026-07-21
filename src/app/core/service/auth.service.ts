import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login_certifi(_usuario: Usuario): Observable<any> {
    const urlGet = `${environment.apiUrlhttps}certificado/usuarioC`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.get(urlGet, { headers });
  }

  buscousuario(idHisPerso: any, idPerso: any): Observable<any> {
    const direccHTTPS = `${environment.apiUrl}usuarioC/${idHisPerso}/${idPerso}`;
    return this.http.get(direccHTTPS);
  }

  login(usuario: Usuario): Observable<any> {
    const urlLogin = `${environment.apiUrl}usuario/login`;
    const body = { usuario: usuario.usuario, password: usuario.password };
    return this.http.post<any>(urlLogin, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  loginLegacy(usuario: Usuario): Observable<any> {
    const cespeciales = encodeURIComponent(usuario.password);
    const urlGet = `${environment.apiUrl}usuario/${usuario.usuario}/${cespeciales}`;
    const credenciales = `${usuario.usuario}/${usuario.password}`;
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('usuario', usuario.usuario);
    params.set('password', usuario.password);
    return this.http.post<any>(urlGet, params.toString(), { headers: httpHeaders });
  }
}
