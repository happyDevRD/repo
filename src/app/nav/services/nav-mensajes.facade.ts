import { Injectable } from '@angular/core';
import { LeerMensajeRecibidos } from '../../features/mensajes/models';
import { UserSessionService } from '../../core/service/user-session.service';
import { countMensajesByEstado } from '../../features/mensajes/helpers/mensajes-count.helper';
import { MensajesService } from '../../features/mensajes/mensajes.service';

export interface NavMensajesHost {
  leermensajerecibido: LeerMensajeRecibidos[];
  nmensajespendientes: number;
  nmensajestramitados: number;
  nmensajesrechazados: number;
}

@Injectable()
export class NavMensajesFacade {
  private refreshInterval?: ReturnType<typeof setInterval>;

  constructor(
    private readonly mensajesService: MensajesService,
    private readonly session: UserSessionService,
  ) {}

  startPolling(host: NavMensajesHost, intervalMs = 30_000): void {
    this.loadRecibidos(host);
    this.refreshInterval = setInterval(() => this.applyCounts(host), intervalMs);
  }

  stopPolling(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
  }

  loadRecibidos(host: NavMensajesHost): void {
    if (!this.session.idOrgUsuar) {
      return;
    }
    this.mensajesService.listarRecibidos().subscribe({
      next: (data) => {
        host.leermensajerecibido = data ?? [];
        this.applyCounts(host);
      },
    });
  }

  applyCounts(host: NavMensajesHost): void {
    const counts = countMensajesByEstado(host.leermensajerecibido);
    host.nmensajespendientes = counts.pendientes;
    host.nmensajestramitados = counts.tramitados;
    host.nmensajesrechazados = counts.rechazados;
    this.session.setMensajesRecibidosCount(counts.pendientes.toString());
    this.session.setMensajesTramitadosCount(counts.tramitados.toString());
  }
}
