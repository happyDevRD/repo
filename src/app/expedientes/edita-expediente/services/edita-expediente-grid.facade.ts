import { ChangeDetectorRef, Injectable } from '@angular/core';
import { LeerNotificacion } from '../../expedientes';
import {
  buildEditaExpedienteWorkspaceGrids,
  EditaExpedienteWorkspaceGridsBundle,
  EditaExpedienteWorkspaceGridsContext,
} from '../config/edita-expediente-workspace-grids.config';
import { EditaExpedienteNotificacionesFacade } from '../notificaciones/edita-expediente-notificaciones.facade';
import { buildNotificacionGridSourceFromLocal } from '../notificaciones/notificaciones-grid.config';
import { actualizarSourceNotificacionesGrid } from '../notificaciones/notificaciones-grid-refresh.helper';

export interface EditaExpedienteGridRefreshHost {
  sourceListarNotifi: any;
  verExpediente: { ejercicio: number; numero: number };
}

export interface EditaExpedienteNotificacionesGridHost extends EditaExpedienteGridRefreshHost {
  leernotificacion?: LeerNotificacion[];
  idNotificacion: number;
  gridNotificaciones?: {
    updatebounddata(): void;
    refreshdata(): void;
    getrowdata(id: number): unknown;
  };
  cdr: ChangeDetectorRef;
  habilitarBotonesNotificacion(rowData: unknown): void;
}

@Injectable()
export class EditaExpedienteGridFacade {
  constructor(private readonly notificacionesFacade: EditaExpedienteNotificacionesFacade) {}

  buildWorkspaceGrids(context: EditaExpedienteWorkspaceGridsContext): EditaExpedienteWorkspaceGridsBundle {
    return buildEditaExpedienteWorkspaceGrids(context);
  }

  refreshListarNotifi(host: EditaExpedienteGridRefreshHost, withId = false): void {
    host.sourceListarNotifi = this.notificacionesFacade.createGridSource(
      host.verExpediente.ejercicio,
      host.verExpediente.numero,
      { withSort: false, ...(withId ? { withId: true } : {}) },
    );
  }

  inicializarSourceListarNotifi(host: EditaExpedienteNotificacionesGridHost): void {
    host.sourceListarNotifi = buildNotificacionGridSourceFromLocal([], {
      withSort: false,
      withId: true,
    });
  }

  actualizarGridNotificaciones(host: EditaExpedienteNotificacionesGridHost, leerNotificacion: LeerNotificacion[]): void {
    host.leernotificacion = leerNotificacion;
    host.sourceListarNotifi = buildNotificacionGridSourceFromLocal(leerNotificacion, {
      withSort: false,
      withId: true,
    });
  }

  actualizarSourceNotificaciones(host: EditaExpedienteNotificacionesGridHost): void {
    actualizarSourceNotificacionesGrid(host, this.notificacionesFacade);
  }
}
