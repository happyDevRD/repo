import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { InicioDashboardService } from '../../services/inicio-dashboard.service';
import { ModalManagerService } from '../../../../core/service/modal-manager.service';
import { SolicitudListar } from '../../../solicitudes/models';
import { VerExpedientesInstructor, VerTareaTramiteExpporUsuario } from '../../../expedientes/expedientes';

@Component({
  selector: 'app-dashboard-modals-host',
  templateUrl: './dashboard-modals-host.component.html',
  styleUrls: ['./dashboard-modals-host.component.css'],
})
export class DashboardModalsHostComponent {
  private readonly modalManager = inject(ModalManagerService);

  constructor(private dashboardService: InicioDashboardService) {}

  solicitudesItems: SolicitudListar[] = [];
  expedientesItems: VerExpedientesInstructor[] = [];
  tareasItems: VerTareaTramiteExpporUsuario[] = [];
  firmasPendientesItems: any[] = [];
  firmasTercerosItems: any[] = [];
  notificacionesItems: any[] = [];

  readonly interesadoSolicitudValue = (row: SolicitudListar): string => row.personaEntidad?.desPerEntid ?? '';

  readonly expedienteSolicitudValue = (row: SolicitudListar): string => {
    const expediente = row.expediente as { ejercicio?: unknown; numero?: unknown } | null;
    if (!expediente?.ejercicio || !expediente?.numero) {
      return '';
    }
    return `${expediente.ejercicio}/${expediente.numero}`;
  };

  closeModal(modalId: string): void {
    this.modalManager.closeModal(modalId);
  }

  async openSolicitudes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadSolicitudes());
    this.solicitudesItems = data ?? [];
    this.modalManager.openModal('modalSolicitudesPendientes');
    return this.solicitudesItems.length;
  }

  async openExpedientes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadExpedientesInstructor());
    this.expedientesItems = data ?? [];
    this.modalManager.openModal('modalExpedientesInstructor');
    return this.expedientesItems.length;
  }

  async openTareas(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadTareasUsuario());
    this.tareasItems = data ?? [];
    this.modalManager.openModal('modalTareasPendientes');
    return this.tareasItems.length;
  }

  async openFirmasPendientes(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadFirmasPendientes());
    this.firmasPendientesItems = data ?? [];
    this.modalManager.openModal('modalFirmasPendientes');
    return this.firmasPendientesItems.length;
  }

  async openFirmasTerceros(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadFirmasTerceros());
    this.firmasTercerosItems = data ?? [];
    this.modalManager.openModal('modalFirmasTerceros');
    return this.firmasTercerosItems.length;
  }

  async openNotificaciones(): Promise<number> {
    const data = await firstValueFrom(this.dashboardService.loadNotificaciones());
    this.notificacionesItems = data ?? [];
    this.modalManager.openModal('modalNotificaciones');
    return this.notificacionesItems.length;
  }
}
