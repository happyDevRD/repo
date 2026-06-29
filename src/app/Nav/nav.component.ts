import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExpedientesService } from '../expedientes/expedientes.service';
import { LeerMensajeRecibidos } from '../expedientes/expedientes';
import { NavUiService } from './nav-ui.service';
import { UserSessionService } from '../core/service/user-session.service';

export interface NavLink {
  path: string;
  icon: string;
  label: string;
  exact?: boolean;
  badgeKey?: 'mensajes';
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  readonly escudo = `assets/${environment.escudo}`;

  readonly navLinks: NavLink[] = [
    { path: '/inicio', icon: 'bi-house', label: 'Inicio', exact: true },
    { path: '/mensajes', icon: 'bi-envelope', label: 'Mensajes', exact: true, badgeKey: 'mensajes' },
    { path: '/solicitudes', icon: 'bi-people', label: 'Solicitudes', exact: true },
    { path: '/expedientes', icon: 'bi-folder', label: 'Expedientes', exact: true },
    { path: '/procedimientos', icon: 'bi-file-earmark-text', label: 'Procedimientos', exact: true },
    { path: '/administracion', icon: 'bi-gear', label: 'Administración', exact: true },
  ];

  public leermensajerecibido: LeerMensajeRecibidos[] = [];
  public nmensajespendientes = 0;
  public nmensajestramitados = 0;
  public nmensajesrechazados = 0;

  public errorMessage: string | null = null;
  public errorStatus?: number;

  mobileMenuOpen = false;
  private mensajesInterval?: ReturnType<typeof setInterval>;

  constructor(
    public router: Router,
    public expedientesService: ExpedientesService,
    public http: HttpClient,
    private navUi: NavUiService,
    private session: UserSessionService
  ) { }

  ngOnInit(): void {
    this.navUi.mobileOpen$.subscribe(open => {
      this.mobileMenuOpen = open;
      document.body.classList.toggle('nav-mobile-open', open);
    });

    this.verMensajesRecibido();
    this.mensajesInterval = setInterval(() => {
      this.numeroMensajespendientes();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.mensajesInterval) {
      clearInterval(this.mensajesInterval);
    }
    document.body.classList.remove('nav-mobile-open');
  }

  closeMobileMenu(): void {
    this.navUi.closeMobileMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  getBadgeCount(link: NavLink): number {
    if (link.badgeKey === 'mensajes') {
      return this.nmensajespendientes;
    }
    return 0;
  }

  get userName(): string {
    return this.session.user || 'Usuario';
  }

  get departmentName(): string {
    return this.session.department || 'Departamento';
  }

  public numeroMensajespendientes(): void {
    this.nmensajespendientes = 0;
    this.nmensajestramitados = 0;
    this.nmensajesrechazados = 0;
    if (!this.leermensajerecibido) { return; }
    this.leermensajerecibido.forEach(m => {
      if (m.estado === 'PENDIENTE') {
        this.nmensajespendientes++;
      } else if (m.estado === 'TRAMITANDO') {
        this.nmensajestramitados++;
      } else if (m.estado === 'RECHAZADO') {
        this.nmensajesrechazados++;
      }
    });
    this.session.setMensajesRecibidosCount(this.nmensajespendientes.toString());
    this.session.setMensajesTramitadosCount(this.nmensajestramitados.toString());
  }

  public verMensajesRecibido(): void {
    const idOrgUsuar = this.session.idOrgUsuar;
    if (!idOrgUsuar) { return; }

    this.expedientesService.getMensajeListarRecibidos().subscribe({
      next: (data: LeerMensajeRecibidos[]) => {
        this.leermensajerecibido = data || [];
        this.numeroMensajespendientes();
      },
      error: (err: unknown) => {
        console.error('Error al cargar mensajes:', err);
      }
    });

    this.http.get(`${environment.apiUrl}mensaje/listarRecibidos/${idOrgUsuar}`).subscribe({
      next: () => { },
      error: (error: HttpErrorResponse) => {
        this.errorStatus = error.status;
        this.errorMessage = error.status === 404
          ? 'No hay Mensajes disponibles'
          : `Error HTTP: ${error.status}`;
        console.warn(`Mensaje de error: ${this.errorMessage}`);
      }
    });
  }

  public logout(): void {
    this.session.clear();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
