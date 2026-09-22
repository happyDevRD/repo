import { Component } from '@angular/core'
import { Usuario } from '../core/models/usuario.model'
import { AuthService } from '../core/service/auth.service'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { UserSessionService } from '../core/service/user-session.service'
import { NotificationService } from '../core/service/notification.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public titulo = 'Login'
  public aplicacion = 'Gestor de Expedientes iFlow'

  public usuario!: Usuario
  public fecha: Date = new Date()
  public anio: any = this.fecha.getFullYear()

  constructor(
    public authService: AuthService,
    public router: Router,
    private session: UserSessionService,
    private notificationService: NotificationService
  ) {
    this.usuario = new Usuario()
  }

  logout() {
    window.addEventListener('beforeunload', () => sessionStorage.removeItem('MensRecibido'))
  }

  ngOnInit(): void {
    this.logout()
  }

  login_certifi() {
    this.authService.login_certifi(this.usuario).subscribe(
      response => {
        const idperso = response.idPerso
        const idHisPerso = response.idHisPerso

        this.authService.buscousuario(idHisPerso, idperso).subscribe(response => {
          const user = response.usuario
          const depart = response.departamento
          const token = response.token
          const nivAcces = response.nivAcces
          const solUsuar = response.solUsuar
          const traUsuar = response.traUsuar
          const idOrgUsuar = response.idOrgUsuar
          const idOrgElemen = response.idOrgEleme
          const idOrgan = response.idOrgan

          localStorage.setItem('user', user)
          localStorage.setItem('nivAcces', nivAcces)
          localStorage.setItem('token', token)
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
          })

          this.router.navigate(['/inicio'])
        })
      },
      (err: HttpErrorResponse) => {
        if (err.status == 500) {
          this.notificationService.error({
            title: 'Oops...',
            text: err.error.message,
            footer: 'El usuario al que corresponde el certificado no esta Registrado '
          })
        } else {
          this.notificationService.error({
            title: 'Oops...',
            text: err.error.message,
            footer: 'No se pudo realizar la conexión '
          })
        }
      }
    )
  }

  revisaCodigo(codigoreci: string) {
    localStorage.setItem('codigo-introducido', this.codigo)

    if (this.codigoLogin == codigoreci) {
      this.router.navigate(['/inicio'])
    } else {
      this.router.navigate(['/login'])
      this.notificationService.error({ text: `El código introducido no es correcto` })
    }
  }

  public veoFormuCodigo: boolean = false
  public spinner: boolean = false
  public codigo: string
  public codigoLogin: string

  login(): void {
    this.spinner = true

    if (this.usuario.usuario == '' || this.usuario.password == '') {
      this.spinner = false
      this.notificationService.error({ title: 'Error Login', text: 'Hay campos vacios!!!' })
      return
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        this.spinner = false
        this.veoFormuCodigo = true

        this.codigoLogin = response.codigo
        const user = response.usuario
        const depart = response.departamento
        const token = response.token
        const nivAcces = response.nivAcces
        const solUsuar = response.solUsuar
        const traUsuar = response.traUsuar
        const idOrgUsuar = response.idOrgUsuar
        const idOrgElemen = response.idOrgEleme
        const idOrgan = response.idOrgan

        localStorage.setItem('codEntid', response.codEntid)
        localStorage.setItem('codigo-login', response.codigo)
        localStorage.setItem('user', user)
        localStorage.setItem('nivAcces', nivAcces)
        localStorage.setItem('token', token)
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
        })

        if (response.codigo == 0) {
          this.veoFormuCodigo = false
          this.router.navigate(['/inicio'])
        }
      },
      err => {
        this.spinner = false
        this.notificationService.error({ title: 'Error Login', text: err.error.message })
        if (err.status == 404) {
          this.notificationService.error({ title: 'Error Login', text: 'Usuario o Clave incorrectas!!' })
        }
      }
    )
  }
}
