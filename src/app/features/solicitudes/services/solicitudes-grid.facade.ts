import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  createDocumentosAdapter,
  createDocumentosSourcePlain,
  createExpedientesAdapter,
  createExpedientesSourcePlain,
  createRepresentantesAdapter,
  createRepresentantesSourcePlain,
} from '../config/solicitudes-grid.config';
import { SolicitudListar } from '../models';
import { SolicitudesService } from '../solicitudes.service';

export interface SolicitudesGridHost {
  solicitudesListado: SolicitudListar[];
  cargandoSolicitudesListado: boolean;
  sourceListDoc: unknown;
  sourceListExpe: unknown;
  sourceListRepre: unknown;
  idOrgEleme: string | null;
  idsolicitud: number;
  idexpedienteAsoc: number;
  creasolicitud: { idPerso: unknown; idHisPerso: unknown };
}

@Injectable()
export class SolicitudesGridFacade {
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly destroyRef = inject(DestroyRef);

  initGridSources(host: SolicitudesGridHost): void {
    this.cargarSolicitudesListado(host);
    host.sourceListDoc = createDocumentosAdapter(host.idsolicitud ?? 0);
    host.sourceListExpe = createExpedientesAdapter(host.idexpedienteAsoc ?? 0);
    host.sourceListRepre = createRepresentantesAdapter(
      host.creasolicitud.idPerso as string | number,
      host.creasolicitud.idHisPerso as string | number,
    );
  }

  refreshSolicitudesList(host: SolicitudesGridHost, sortById = false): void {
    this.cargarSolicitudesListado(host, sortById);
  }

  private cargarSolicitudesListado(host: SolicitudesGridHost, sortById = false): void {
    host.cargandoSolicitudesListado = true;
    this.solicitudesService.getSolicitudes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) => sortById
          ? Number(b.id) - Number(a.id)
          : String(b.fecInicio ?? '').localeCompare(String(a.fecInicio ?? '')));
        host.solicitudesListado = sorted;
        host.cargandoSolicitudesListado = false;
      },
      error: () => {
        host.solicitudesListado = [];
        host.cargandoSolicitudesListado = false;
      },
    });
  }

  assignDocumentosSource(host: SolicitudesGridHost, idsolicitud?: number): void {
    const id = idsolicitud ?? host.idsolicitud;
    host.sourceListDoc = createDocumentosSourcePlain(id);
  }

  refreshDocumentosAdapter(host: SolicitudesGridHost, idsolicitud?: number): void {
    const id = idsolicitud ?? host.idsolicitud;
    host.sourceListDoc = createDocumentosAdapter(id);
  }

  assignDocumentosSourcePlain(host: SolicitudesGridHost, idsolicitud?: number): void {
    this.assignDocumentosSource(host, idsolicitud);
  }

  assignExpedientesSource(host: SolicitudesGridHost, idexpedienteAsoc?: number): void {
    const id = idexpedienteAsoc ?? host.idexpedienteAsoc;
    host.sourceListExpe = createExpedientesSourcePlain(id ?? 0);
  }

  refreshExpedientesAdapter(host: SolicitudesGridHost, idexpedienteAsoc?: number): void {
    const id = idexpedienteAsoc ?? host.idexpedienteAsoc;
    host.sourceListExpe = createExpedientesAdapter(id ?? 0);
  }

  refreshRepresentantesList(
    host: SolicitudesGridHost,
    idPerso: number | string,
    idHisPerso: number | string,
    withSort = false,
  ): void {
    host.sourceListRepre = createRepresentantesAdapter(idPerso, idHisPerso, withSort);
  }

  assignRepresentantesSourcePlain(
    host: SolicitudesGridHost,
    idPerso: number | string,
    idHisPerso: number | string,
  ): void {
    host.sourceListRepre = createRepresentantesSourcePlain(idPerso, idHisPerso);
  }
}
