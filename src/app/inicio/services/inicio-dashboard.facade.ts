import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardCounts, InicioDashboardService } from './inicio-dashboard.service';
import { SolicitudListar } from '../../solicitudes/solicitudes';
import { VerExpedientesInstructor, VerTareaTramiteExpporUsuario } from '../../expedientes/expedientes';

export interface InicioDashboardHost {
  isLoadingSummary: boolean;
  dashboardCounts: DashboardCounts;
  solicitudlistar: SolicitudListar[];
  verexpedientesinstructor: VerExpedientesInstructor[];
  vertareatramiteexpporusuario: VerTareaTramiteExpporUsuario[];
}

/**
 * Facade encargada de la carga de los datos del dashboard (tiles) de la pantalla de inicio.
 */
@Injectable()
export class InicioDashboardFacade {
  constructor(private readonly dashboardService: InicioDashboardService) {}

  loadSummary(host: InicioDashboardHost): void {
    host.isLoadingSummary = true;
    this.dashboardService.loadSummary()
      .pipe(finalize(() => { host.isLoadingSummary = false; }))
      .subscribe({
        next: (summary) => {
          host.solicitudlistar = summary.solicitudes;
          host.verexpedientesinstructor = summary.expedientes;
          host.vertareatramiteexpporusuario = summary.tareas;
          host.dashboardCounts = { ...summary.counts };
        },
        error: (error) => console.error('Error al cargar resumen del panel:', error),
      });
  }

  totalPendientes(counts: DashboardCounts): number {
    return Object.values(counts)
      .filter((value): value is number => value !== null)
      .reduce((sum, value) => sum + value, 0);
  }

  sectionsWithPending(counts: DashboardCounts): number {
    return Object.values(counts)
      .filter((value): value is number => value !== null && value > 0).length;
  }
}
