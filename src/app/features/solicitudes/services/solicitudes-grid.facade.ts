import { Injectable } from '@angular/core';
import {
  createDocumentosAdapter,
  createDocumentosSourcePlain,
  createExpedientesAdapter,
  createExpedientesSourcePlain,
  createRepresentantesAdapter,
  createRepresentantesSourcePlain,
  createSolicitudesListAdapter,
  refreshJqxGrid,
} from '../config/solicitudes-grid.config';

export interface SolicitudesGridHost {
  sourceSolici: unknown;
  sourceListDoc: unknown;
  sourceListExpe: unknown;
  sourceListRepre: unknown;
  idOrgEleme: string | null;
  idsolicitud: number;
  idexpedienteAsoc: number;
  creasolicitud: { idPerso: unknown; idHisPerso: unknown };
  myGrid?: { updatebounddata?: () => void };
}

@Injectable()
export class SolicitudesGridFacade {
  initGridSources(host: SolicitudesGridHost): void {
    host.sourceSolici = createSolicitudesListAdapter(host.idOrgEleme ?? '');
    host.sourceListDoc = createDocumentosAdapter(host.idsolicitud ?? 0);
    host.sourceListExpe = createExpedientesAdapter(host.idexpedienteAsoc ?? 0);
    host.sourceListRepre = createRepresentantesAdapter(
      host.creasolicitud.idPerso as string | number,
      host.creasolicitud.idHisPerso as string | number,
    );
  }

  refreshSolicitudesList(host: SolicitudesGridHost, sortById = false): void {
    host.sourceSolici = createSolicitudesListAdapter(host.idOrgEleme ?? '', { sortById });
    const grid = host.myGrid as { setSource?: (value: unknown) => void; updatebounddata?: () => void } | undefined
    grid?.setSource?.(host.sourceSolici)
    refreshJqxGrid(host.myGrid)
  }

  assignDocumentosSource(host: SolicitudesGridHost, idsolicitud?: number): void {
    const id = idsolicitud ?? host.idsolicitud;
    host.sourceListDoc = createDocumentosSourcePlain(id);
  }

  refreshDocumentosAdapter(host: SolicitudesGridHost, idsolicitud?: number): void {
    const id = idsolicitud ?? host.idsolicitud;
    host.sourceListDoc = createDocumentosAdapter(id);
    refreshJqxGrid(host.myGrid);
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
