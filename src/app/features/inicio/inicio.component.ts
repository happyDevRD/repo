import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DashboardCountKey,
  DashboardCounts,
} from './services/inicio-dashboard.service';
import { DashboardModalsHostComponent } from './components/dashboard-modals-host/dashboard-modals-host.component';
import { InicioDashboardFacade } from './services/inicio-dashboard.facade';
import { InicioGridFacade } from './services/inicio-grid.facade';
import { SolicitudListar } from '../solicitudes/models';
import { VerExpedientesInstructor, VerTareaTramiteExpporUsuario } from '../expedientes/expedientes';

export interface DashboardCardConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: 'blue' | 'violet' | 'teal' | 'amber' | 'rose' | 'indigo';
  countKey: DashboardCountKey;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [InicioDashboardFacade, InicioGridFacade],
})
export class InicioComponent implements OnInit {

  @ViewChild(DashboardModalsHostComponent) modalsHost!: DashboardModalsHostComponent;

  public isLoadingSolicitudes: boolean = false;
  public isLoadingExpedientes: boolean = false;
  public isLoadingTareas: boolean = false;
  public isLoadingFirmasPendientes: boolean = false;
  public isLoadingFirmasTerceros: boolean = false;
  public isLoadingNotificaciones: boolean = false;
  public isLoadingSummary = true;

  public solicitudlistar: SolicitudListar[] = [];
  public verexpedientesinstructor: VerExpedientesInstructor[] = [];
  public vertareatramiteexpporusuario: VerTareaTramiteExpporUsuario[] = [];

  readonly dashboardCards: DashboardCardConfig[] = [
    {
      id: 'solicitudes',
      title: 'Solicitudes',
      description: 'Consulta de las solicitudes pendientes o rechazadas del departamento.',
      icon: 'assets/new/ico_solicitudes.png',
      accent: 'blue',
      countKey: 'solicitudes',
    },
    {
      id: 'expedientes',
      title: 'Expedientes',
      description: 'Consulta de tareas de expedientes de los que soy Instructor.',
      icon: 'assets/new/ico_user.png',
      accent: 'violet',
      countKey: 'expedientes',
    },
    {
      id: 'tareas',
      title: 'Tareas',
      description: 'Listado de tareas pendientes de las que soy tramitador.',
      icon: 'assets/new/ico_tareas.png',
      accent: 'teal',
      countKey: 'tareas',
    },
    {
      id: 'firmasPendientes',
      title: 'Firmas pendientes',
      description: 'Listado de firmas pendientes.',
      icon: 'assets/new/ico_firmas_pen.png',
      accent: 'amber',
      countKey: 'firmasPendientes',
    },
    {
      id: 'firmasTerceros',
      title: 'Firmas solicitadas',
      description: 'Listado de firmas pendientes solicitadas a terceros.',
      icon: 'assets/new/ico_firmas_sol.png',
      accent: 'rose',
      countKey: 'firmasTerceros',
    },
    {
      id: 'notificaciones',
      title: 'Notificaciones',
      description: 'Listado de notificaciones pendientes de recepcionar.',
      icon: 'assets/new/ico_circulo_exc.png',
      accent: 'indigo',
      countKey: 'notificaciones',
    },
  ];

  dashboardCounts: DashboardCounts = {
    solicitudes: null,
    expedientes: null,
    tareas: null,
    firmasPendientes: null,
    firmasTerceros: null,
    notificaciones: null,
  };

  constructor(
    private readonly dashboardFacade: InicioDashboardFacade,
    private readonly gridFacade: InicioGridFacade,
  ) {}

  ngOnInit(): void {
    this.dashboardFacade.loadSummary(this);
  }

  get totalPendientes(): number {
    return this.dashboardFacade.totalPendientes(this.dashboardCounts);
  }

  get sectionsWithPending(): number {
    return this.dashboardFacade.sectionsWithPending(this.dashboardCounts);
  }

  getCardCount(key: DashboardCountKey): number | null {
    return this.dashboardCounts[key];
  }

  isCardLoading(cardId: string): boolean {
    return this.gridFacade.isCardLoading(this, cardId);
  }

  runCardAction(cardId: string): void {
    void this.gridFacade.openCardGrid(this, this.modalsHost, cardId);
  }
}
