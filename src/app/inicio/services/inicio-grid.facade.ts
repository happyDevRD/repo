import { Injectable } from '@angular/core';
import { DashboardCounts } from './inicio-dashboard.service';
import { DashboardModalsHostComponent } from '../components/dashboard-modals-host/dashboard-modals-host.component';
import { NotificationService } from '../../core/service/notification.service';

export type DashboardLoadingKey =
  | 'isLoadingSolicitudes'
  | 'isLoadingExpedientes'
  | 'isLoadingTareas'
  | 'isLoadingFirmasPendientes'
  | 'isLoadingFirmasTerceros'
  | 'isLoadingNotificaciones';

export interface InicioGridHost {
  dashboardCounts: DashboardCounts;
  isLoadingSolicitudes: boolean;
  isLoadingExpedientes: boolean;
  isLoadingTareas: boolean;
  isLoadingFirmasPendientes: boolean;
  isLoadingFirmasTerceros: boolean;
  isLoadingNotificaciones: boolean;
}

const LOADING_KEY_BY_CARD: Record<string, DashboardLoadingKey> = {
  solicitudes: 'isLoadingSolicitudes',
  expedientes: 'isLoadingExpedientes',
  tareas: 'isLoadingTareas',
  firmasPendientes: 'isLoadingFirmasPendientes',
  firmasTerceros: 'isLoadingFirmasTerceros',
  notificaciones: 'isLoadingNotificaciones',
};

/**
 * Facade encargada de las acciones sobre los grids de las consultas del dashboard:
 * decide qué grid-modal abrir para cada tile y gestiona su estado de carga.
 */
@Injectable()
export class InicioGridFacade {
  constructor(private readonly notificationService: NotificationService) {}

  isCardLoading(host: InicioGridHost, cardId: string): boolean {
    const key = LOADING_KEY_BY_CARD[cardId];
    return key ? host[key] : false;
  }

  async openCardGrid(
    host: InicioGridHost,
    modalsHost: DashboardModalsHostComponent | undefined,
    cardId: string,
  ): Promise<void> {
    const loadingKey = LOADING_KEY_BY_CARD[cardId];
    if (!loadingKey || !modalsHost) {
      return;
    }

    host[loadingKey] = true;
    try {
      switch (cardId) {
        case 'solicitudes':
          host.dashboardCounts.solicitudes = await modalsHost.openSolicitudes();
          break;
        case 'expedientes':
          host.dashboardCounts.expedientes = await modalsHost.openExpedientes();
          break;
        case 'tareas':
          host.dashboardCounts.tareas = await modalsHost.openTareas();
          break;
        case 'firmasPendientes':
          host.dashboardCounts.firmasPendientes = await modalsHost.openFirmasPendientes();
          break;
        case 'firmasTerceros':
          host.dashboardCounts.firmasTerceros = await modalsHost.openFirmasTerceros();
          break;
        case 'notificaciones':
          host.dashboardCounts.notificaciones = await modalsHost.openNotificaciones();
          break;
      }
    } catch (error) {
      this.notificationService.error('No se pudo cargar la consulta seleccionada');
      console.error('Error al abrir consulta del panel:', error);
    } finally {
      host[loadingKey] = false;
    }
  }
}
