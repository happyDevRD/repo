import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LeerMensajeRecibidos } from '../expedientes/expedientes';
import { NavUiService } from './nav-ui.service';
import { UserSessionService } from '../core/service/user-session.service';
import { NavMensajesFacade } from './services/nav-mensajes.facade';

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
  styleUrls: ['./nav.component.css'],
  providers: [NavMensajesFacade],
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

  leermensajerecibido: LeerMensajeRecibidos[] = [];
  nmensajespendientes = 0;
  nmensajestramitados = 0;
  nmensajesrechazados = 0;

  mobileMenuOpen = false;

  constructor(
    public router: Router,
    private navUi: NavUiService,
    public session: UserSessionService,
    private navMensajesFacade: NavMensajesFacade,
  ) {}

  ngOnInit(): void {
    this.navUi.mobileOpen$.subscribe((open) => {
      this.mobileMenuOpen = open;
      document.body.classList.toggle('nav-mobile-open', open);
    });
    this.navMensajesFacade.startPolling(this);
  }

  ngOnDestroy(): void {
    this.navMensajesFacade.stopPolling();
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

  logout(): void {
    this.session.clear();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
