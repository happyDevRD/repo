const SITUACION_LABELS: Record<number, string> = {
  1: 'GENERADA',
  2: 'ENVIADA',
  3: 'RECEPCIONADA',
  4: 'DEVUELTA',
  5: 'COBRADA',
  6: 'ANULADA',
  7: 'GENERADA',
  8: 'NOTIFICA_ENVIADA',
  9: 'CADUCADA',
};

const BOP_LABELS: Record<number, string> = {
  0: 'N/A',
  1: 'ENVIADO',
  2: 'PUBLICADO',
};

function situacionLabel(value: number): string {
  return SITUACION_LABELS[value] ?? 'Sin datos';
}

function bopLabel(value: number): string {
  return BOP_LABELS[value] ?? '';
}

function centeredCell(content: string, extraStyle = ''): string {
  return `<div style="text-align: center; margin-top: 5px;${extraStyle}" type="button">${content}</div>`;
}

/** Renderers del grid de notificaciones, extraídos del componente raíz. */
export const notificacionesGridRenderers = {
  columnseleccionListarNotifi(_value: unknown, _row: unknown, _column: unknown, rowIndex: number) {
    return `<div style="padding-top:5px; text-align: center;" type="button" title="Selecciona Notificación">
              <input type="radio" name="RadioNotificacion" data-row="${rowIndex}" style="cursor: pointer;">
            </div>`;
  },

  cellsrendererListarNotifi(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''));
  },

  cellsrendererListarNotifiSituacionSimple(_row: unknown, _column: unknown, value: number) {
    return centeredCell(situacionLabel(value));
  },

  cellsrendererListarNotifiBOPSimple(_row: unknown, _column: unknown, value: number) {
    return centeredCell(bopLabel(value));
  },

  cellsrendererListarNotifiSituacion(_row: unknown, _column: unknown, value: number) {
    return centeredCell(situacionLabel(value));
  },

  cellsrendererListarNotifiBOP(_row: unknown, _column: unknown, value: number) {
    const resultado = bopLabel(value);
    return centeredCell(resultado);
  },

  cellsrendererFechaListarNotifi(_row: unknown, _column: unknown, value: string) {
    if (!value) {
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;"></div>`;
    }
    const dia = value.substring(8, 10);
    const mes = value.substring(5, 7);
    const anio = value.substring(0, 4);
    return centeredCell(`${dia}/${mes}/${anio}`);
  },

  cellsrendererAccionesNotificacion(row: { bounddata?: { idNotif?: number } }) {
    if (!row?.bounddata?.idNotif) {
      return `<div style="text-align: center; margin-top: 5px;">
                <span style="color: #999;">N/A</span>
              </div>`;
    }
    const idNotif = row.bounddata.idNotif;
    return `<div style="text-align: center; margin-top: 5px;">
              <button class="btn btn-sm btn-outline-primary me-1" onclick="window.verNotificacion(${idNotif})" title="Ver Notificación">
                <i class="bi bi-eye"></i> Ver
              </button>
            </div>`;
  },
};

export type NotificacionesGridRenderers = typeof notificacionesGridRenderers;
