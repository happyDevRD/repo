import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserSessionService } from '../core/service/user-session.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public titulo = 'Login';
  public aplicacion = 'Gestor de Expedientes iFlow';

  public usuario!: Usuario;
  public fecha: Date = new Date();
  public anio: any = this.fecha.getFullYear();

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    public router: Router,
    private session: UserSessionService
  ) {
    this.usuario = new Usuario();
    this.rutaTxt = this.session.ruta;
  }

  rutaTxt: string | null = null;

  conectorApi?: string;
  conectorSensores?: string;

  readTextFile(file: string): void {
    this.http.get(file, { responseType: 'text' })
      .subscribe(
        data => {
          const lines = data.split('\n');
          this.conectorApi = lines[0].slice(9);
          this.conectorSensores = lines[1].slice(12);
          this.session.setRuta(data.slice(9));
          localStorage.setItem('api', data.slice(9));
        },
        (error: HttpErrorResponse) => {
          console.error(error.status);
          if (error.status == 404) {
            Swal.fire('Problemas con la configuración ', 'El fichero configurador no existe', 'error');
          } else {
            Swal.fire('Problemas con la configuración ', 'El fichero configurador no esta adecuadamente relleno', 'error');
          }
        }
      );
  }

  logout() {
    window.addEventListener('beforeunload', () => sessionStorage.removeItem('MensRecibido'));
  }

  ngOnInit(): void {
    this.logout();
    this.readTextFile('assets/configurador.txt');
  }

  public direccHTTPS: string;

  login_certifi() {
    this.authService.login_certifi(this.usuario).subscribe(
      response => {
        const idperso = response.idPerso;
        const idHisPerso = response.idHisPerso;

        this.authService.buscousuario(idHisPerso, idperso).subscribe(response => {
          const user = response.usuario;
          const depart = response.departamento;
          const token = response.token;
          const nivAcces = response.nivAcces;
          const solUsuar = response.solUsuar;
          const traUsuar = response.traUsuar;
          const idOrgUsuar = response.idOrgUsuar;
          const idOrgElemen = response.idOrgEleme;
          const idOrgan = response.idOrgan;

          localStorage.setItem('user', user);
          localStorage.setItem('nivAcces', nivAcces);
          localStorage.setItem('token', token);
          this.session.persistLogin({
            idOrgan,
            idOrgEleme: idOrgElemen,
            departamento: depart,
            token,
            user,
            nivAcces,
            solUsuar,
            traUsuar,
            idOrgUsuar,
          });

          this.router.navigate(['/inicio']);
        });
      },
      (err: HttpErrorResponse) => {
        if (err.status == 500) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
            footer: 'El usuario al que corresponde el certificado no esta Registrado '
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
            footer: 'No se pudo realizar la conexión '
          });
        }
      }
    );
  }

  revisaCodigo(codigoreci: string) {
    localStorage.setItem('codigo-introducido', this.codigo);

    if (this.codigoLogin == codigoreci) {
      this.router.navigate(['/inicio']);
    } else {
      this.router.navigate(['/login']);
      Swal.fire('', `El código introducido no es correcto`, 'error');
    }
  }

  public veoFormuCodigo: boolean = false;
  public spinner: boolean = false;
  public codigo: string;
  public codigoLogin: string;

  login(): void {
    this.spinner = true;

    if (this.usuario.usuario == '' || this.usuario.password == '') {
      this.spinner = false;
      Swal.fire('Error Login', 'Hay campos vacios!!!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        this.spinner = false;
        this.veoFormuCodigo = true;

        this.codigoLogin = response.codigo;
        const user = response.usuario;
        const depart = response.departamento;
        const token = response.token;
        const nivAcces = response.nivAcces;
        const solUsuar = response.solUsuar;
        const traUsuar = response.traUsuar;
        const idOrgUsuar = response.idOrgUsuar;
        const idOrgElemen = response.idOrgEleme;
        const idOrgan = response.idOrgan;

        localStorage.setItem('codEntid', response.codEntid);
        localStorage.setItem('codigo-login', response.codigo);
        localStorage.setItem('user', user);
        localStorage.setItem('nivAcces', nivAcces);
        localStorage.setItem('token', token);
        this.session.persistLogin({
          idOrgan,
          idOrgEleme: idOrgElemen,
          departamento: depart,
          token,
          user,
          nivAcces,
          solUsuar,
          traUsuar,
          idOrgUsuar,
        });

        if (response.codigo == 0) {
          this.veoFormuCodigo = false;
          this.router.navigate(['/inicio']);
        }
      },
      err => {
        this.spinner = false;
        Swal.fire('Error Login', err.error.message, 'error');
        if (err.status == 404) {
          Swal.fire('Error Login', 'Usuario o Clave incorrectas!!', 'error');
        }
      }
    );
  }
}
