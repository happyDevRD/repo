import { ChangeDetectorRef } from '@angular/core';
import { EditaExpedienteNotificacionesFacade } from './edita-expediente-notificaciones.facade';

export interface ActualizarGridNotificacionesHost {
  verExpediente: { ejercicio: number; numero: number };
  sourceListarNotifi: unknown;
  idNotificacion: number;
  gridNotificaciones?: {
    updatebounddata(): void;
    refreshdata(): void;
    getrowdata(id: number): unknown;
  };
  cdr: ChangeDetectorRef;
  habilitarBotonesNotificacion(rowData: unknown): void;
}

export function actualizarSourceNotificacionesGrid(
  host: ActualizarGridNotificacionesHost,
  notificacionesFacade: EditaExpedienteNotificacionesFacade,
): void {
  host.sourceListarNotifi = notificacionesFacade.createGridAdapter(
    host.verExpediente.ejercicio,
    host.verExpediente.numero,
  );

  setTimeout(() => {
    const grid = host.gridNotificaciones;
    if (grid) {
      grid.updatebounddata();
      grid.refreshdata();

      if (host.idNotificacion) {
        setTimeout(() => {
          const rowData = grid.getrowdata(host.idNotificacion);
          if (rowData) {
            host.habilitarBotonesNotificacion(rowData);
          }
        }, 200);
      }
    }
    host.cdr.detectChanges();
  }, 100);
}
