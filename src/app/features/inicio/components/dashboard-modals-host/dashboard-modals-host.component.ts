import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardGridModalComponent } from '../dashboard-grid-modal/dashboard-grid-modal.component';
import { InicioDashboardService } from '../../services/inicio-dashboard.service';
import {
  DASHBOARD_EXPEDIENTES_COLUMNS,
  DASHBOARD_EXPEDIENTES_DATA_FIELDS,
  DASHBOARD_FIRMAS_COLUMNS,
  DASHBOARD_FIRMAS_DATA_FIELDS,
  DASHBOARD_NOTIFICACIONES_COLUMNS,
  DASHBOARD_NOTIFICACIONES_DATA_FIELDS,
  DASHBOARD_SOLICITUDES_COLUMNS,
  DASHBOARD_SOLICITUDES_DATA_FIELDS,
  DASHBOARD_TAREAS_COLUMNS,
  DASHBOARD_TAREAS_DATA_FIELDS,
} from '../../shared/inicio-dashboard-grids.config';

@Component({
  selector: 'app-dashboard-modals-host',
  templateUrl: './dashboard-modals-host.component.html',
})
export class DashboardModalsHostComponent implements AfterViewInit {

  @ViewChild('solicitudesModal') solicitudesModal!: DashboardGridModalComponent;
  @ViewChild('expedientesModal') expedientesModal!: DashboardGridModalComponent;
  @ViewChild('tareasModal') tareasModal!: DashboardGridModalComponent;
  @ViewChild('firmasPendientesModal') firmasPendientesModal!: DashboardGridModalComponent;
  @ViewChild('firmasTercerosModal') firmasTercerosModal!: DashboardGridModalComponent;
  @ViewChild('notificacionesModal') notificacionesModal!: DashboardGridModalComponent;

  readonly solicitudesColumns = DASHBOARD_SOLICITUDES_COLUMNS;
  readonly expedientesColumns = DASHBOARD_EXPEDIENTES_COLUMNS;
  readonly tareasColumns = DASHBOARD_TAREAS_COLUMNS;
  readonly firmasColumns = DASHBOARD_FIRMAS_COLUMNS;
  readonly notificacionesColumns = DASHBOARD_NOTIFICACIONES_COLUMNS;

  constructor(private dashboardService: InicioDashboardService) {}

  ngAfterViewInit(): void {
    // Diferir la asignación de sources para evitar NG0100 (ExpressionChangedAfterItHasBeenChecked).
    queueMicrotask(() => {
      this.solicitudesModal.initSource(DASHBOARD_SOLICITUDES_DATA_FIELDS);
      this.expedientesModal.initSource(DASHBOARD_EXPEDIENTES_DATA_FIELDS);
      this.tareasModal.initSource(DASHBOARD_TAREAS_DATA_FIELDS);
      this.firmasPendientesModal.initSource(DASHBOARD_FIRMAS_DATA_FIELDS);
      this.firmasTercerosModal.initSource(DASHBOARD_FIRMAS_DATA_FIELDS);
      this.notificacionesModal.initSource(DASHBOARD_NOTIFICACIONES_DATA_FIELDS);
    });
  }

  async openSolicitudes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadSolicitudes());
    return this.solicitudesModal.openWithData(data);
  }

  async openExpedientes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadExpedientesInstructor());
    return this.expedientesModal.openWithData(data);
  }

  async openTareas(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadTareasUsuario());
    return this.tareasModal.openWithData(data);
  }

  async openFirmasPendientes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadFirmasPendientes());
    return this.firmasPendientesModal.openWithData(data);
  }

  async openFirmasTerceros(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadFirmasTerceros());
    return this.firmasTercerosModal.openWithData(data);
  }

  async openNotificaciones(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadNotificaciones());
    return this.notificacionesModal.openWithData(data);
  }
}
