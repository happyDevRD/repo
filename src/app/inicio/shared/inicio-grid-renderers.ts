/** Renderers jqxGrid compartidos del módulo inicio (dashboard y vistas relacionadas). */
export const INICIO_GRID_RENDERERS = {
  columnseleccionTareaTramite(_value: unknown): string {
    return ' <div style="padding-top:5px; text-align: center;" type="button" title="Selecciona Tarea del Expediente"><input type="radio" value="" name="RadioIdb" id="RadioIdb"></div>';
  },

  columnseleccionExpInstructor(_value: unknown): string {
    return ' <div style="padding-top:5px; text-align: center;" type="button" data-bs-target="#modalExpe2" data-bs-toggle="modal"><input type="radio" value="" name="RadioIdb" id="RadioIdb"></div>';
  },

  columnrenderer(value: unknown): string {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  },

  cellsrendererTareaExpedi(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;" type="button">${value}</div>`;
  },

  cellsrenderer(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;">${value}</div>`;
  },

  cellsrendererExpInstructor(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;">${value}</div>`;
  },

  cellsrendererNotificacion(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;" type="button">${value}</div>`;
  },

  cellsrendererFecha(_row: unknown, _column: unknown, value: string): string {
    if (!value) {
      return '<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;"></div>';
    }
    const dia = value.substring(8, 10);
    const mes = value.substring(5, 7);
    const anio = value.substring(0, 4);
    return `<div style="text-align: center; margin-top: 5px;">${dia}/${mes}/${anio}</div>`;
  },

  cellsrendererFechaPlazo(_row: unknown, _column: unknown, value: unknown): string {
    if (!value) {
      return `<div style="text-align: center;margin-top: 5px;" type="button">SIN FECHA</div>`;
    }
    return `<div style="text-align: center;margin-top: 5px;" type="button">${value}</div>`;
  },

  cellsrendererColor(_row: unknown, _column: unknown, value: string): string {
    if (value === 'VERDE') {
      return `<div style="text-align: center; margin-top: 5px;" type="button"><img src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    if (value === 'AMARILLO') {
      return `<div style="text-align: center; margin-top: 5px;" type="button"><img src="assets/boton_amarillo.png" width="20" height="20"/></div>`;
    }
    if (value === 'ROJO') {
      return `<div style="text-align: center; margin-top: 5px;" type="button"><img src="assets/boton_rojo.png" width="20" height="20"/></div>`;
    }
    if (!value) {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;">SIN DATOS</div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"></div>`;
  },

  columnrendererDescarga(value: unknown): string {
    return '<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">' + value + '</div>';
  },

  cellsrendererContieneArchivo(_row: unknown, _column: unknown, value: unknown): string {
    if (value) {
      return `<div style="text-align: center; margin-top: 5px;" type="button"><img src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"><img src="assets/boton_rojo.png" width="20" height="20"/></div>`;
  },

  cellsrendererTramiteTarea(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;">${value}</div>`;
  },

  cellsrendererArchivo(_row: unknown, _column: unknown, value: string): string {
    if (value === '1') {
      return `<div style="text-align: center; margin-top: 5px;" type="button"><img src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"><img src="assets/boton_rojo.png" width="20" height="20"/></div>`;
  },

  cellsrendererPlazo(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: center; margin-top: 5px;" type="button" data-bs-toggle="modal" data-bs-target="#editarTramiteModal" data-bs-whatever="@mdo">${value}</div>`;
  },

  cellsrendererSolicitudAsunto(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">${value ?? ''}</div>`;
  },

  cellsrendererSolicitudInteresado(_row: unknown, _column: unknown, value: { desPerEntid?: string } | null): string {
    const text = value?.desPerEntid ?? '';
    return `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">${text}</div>`;
  },

  cellsrendererSolicitudExpediente(_row: unknown, _column: unknown, value: { ejercicio?: unknown; numero?: unknown } | null): string {
    if (!value?.ejercicio || !value?.numero) {
      return '<div style="text-align: center; margin-top: 5px;"></div>';
    }
    return `<div style="text-align: center; margin-top: 5px;">${value.ejercicio}/${value.numero}</div>`;
  },

  cellsrendererSolicitudFecha(_row: unknown, _column: unknown, value: string): string {
    if (!value) {
      return '<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">-</div>';
    }
    const dia = value.substring(8, 10);
    const mes = value.substring(5, 7);
    const anio = value.substring(0, 4);
    return `<div style="text-align: center; margin-top: 5px;">${dia}/${mes}/${anio}</div>`;
  },

  cellsrendererDashboardTextLeft(_row: unknown, _column: unknown, value: unknown): string {
    return `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.3; white-space: normal;">${value ?? ''}</div>`;
  },
};
