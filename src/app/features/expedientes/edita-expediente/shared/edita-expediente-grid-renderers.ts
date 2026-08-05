function centeredCell(content: string, extraStyle = '', withButton = false): string {
  const buttonAttr = withButton ? ' type="button"' : '';
  return `<div style="text-align: center; margin-top: 5px;${extraStyle}"${buttonAttr}>${content}</div>`;
}

function formatFechaDdMmYyyy(value: string, separator = '/'): string {
  const dia = value.substring(8, 10);
  const mes = value.substring(5, 7);
  const anio = value.substring(0, 4);
  return `${dia}${separator}${mes}${separator}${anio}`;
}

/** Renderers jqxGrid compartidos entre trámites, tareas y tramitadores. */
export const editaExpedienteGridRenderers = {
  cellclick(value: unknown) {
    return `<div style="text-align: center; margin-top: 5px; font-family: Verdana;" title="Modificar Tarea">${value}</div>`;
  },

  columnrenderer(value: unknown) {
    return `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value}</div>`;
  },

  columnrendererDescarga(value: unknown) {
    return `<div (click)="abreArchivo()" style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value}</div>`;
  },

  columnseleccionTramite(_value: unknown, _row: unknown, _column: unknown, rowIndex: number) {
    return `<div style="padding-top:5px; text-align: center;" title="Selecciona Trámite">
              <input type="radio" name="RadioTramite" data-row="${rowIndex}" style="cursor: pointer;">
            </div>`;
  },

  columnseleccionTareaProcedi() {
    return `<div style="padding-top:5px; text-align: center;" type="button" title="Selecciona Trámite">
              <input type="radio" value="" name="RadioIda" id="RadioIda">
            </div>`;
  },

  columnseleccionDescargaHistorico() {
    return `<div style="padding-top:5px; text-align: center;" type="button" title="Descarga Historico">
              <img (click)="descargaficheroHistorico()" src="assets/cloud-download.svg" width="20" height="20"/>
            </div>`;
  },

  cellsrendererCentrado(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''));
  },

  cellsrendererTramiteTarea(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''));
  },

  cellsrendererTramitadores(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''), '', true);
  },

  cellsrendererTramite(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''));
  },

  cellsrendererContieneArchivo(_row: unknown, _column: unknown, value: unknown) {
    const img = value
      ? '<img src="assets/boton_verde.png" width="20" height="20"/>'
      : '<img src="assets/boton_rojo.png" width="20" height="20"/>';
    const style = value ? '' : 'color:red;font-size: 9px;';
    return centeredCell(img, style);
  },

  cellsrendererArchivo(_row: unknown, _column: unknown, value: unknown) {
    const ok = value == '1';
    const img = ok
      ? '<img src="assets/boton_verde.png" width="20" height="20"/>'
      : '<img src="assets/boton_rojo.png" width="20" height="20"/>';
    const style = ok ? '' : 'color:red;font-size: 9px;';
    return centeredCell(img, style);
  },

  cellsrendererColor(_row: unknown, _column: unknown, value: string) {
    if (value === 'VERDE') {
      return centeredCell('<img src="assets/boton_verde.png" width="20" height="20"/>');
    }
    if (value === 'AMARILLO') {
      return centeredCell('<img src="assets/boton_amarillo.png" width="20" height="20"/>');
    }
    if (value === 'ROJO') {
      return centeredCell('<img src="assets/boton_rojo.png" width="20" height="20"/>');
    }
    if (!value) {
      return centeredCell('SIN DATOS', 'color:red;font-size: 9px;');
    }
    return centeredCell('', 'color:red;font-size: 9px;');
  },

  cellsrendererFecha(_row: unknown, _column: unknown, value: string) {
    if (!value) {
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;"></div>`;
    }
    return centeredCell(formatFechaDdMmYyyy(value));
  },

  cellsrendererFechaHistorico(_row: unknown, _column: unknown, value: string) {
    if (!value) {
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;" type="button"></div>`;
    }
    return centeredCell(formatFechaDdMmYyyy(value), '', true);
  },

  cellsrendererFechaPlazo(_row: unknown, _column: unknown, value: unknown) {
    if (!value) {
      return centeredCell('SIN FECHA');
    }
    return centeredCell(String(value));
  },

  cellsrendererTareaTramiteAcciones(_row: unknown, _column: unknown, value: unknown) {
    return centeredCell(String(value ?? ''));
  },
};

export function createDescripcionTareasRenderer(onDescripcion: (value: unknown) => void) {
  return function cellsrendererDEscripTareas(_row: unknown, _column: unknown, value: unknown) {
    onDescripcion(value);
    return centeredCell(String(value ?? ''));
  };
}

export function createNotiDniRenderer(onNombre: (nombre: string) => void) {
  return function cellsrendererNotiDNI(_row: unknown, _column: unknown, value: { desPerEntid?: string; numDocum?: string }) {
    onNombre(value?.desPerEntid || '');
    return centeredCell(String(value?.numDocum ?? ''));
  };
}

export function createNotiNombreRenderer(getNombre: () => string) {
  return function cellsrendererNotiNombre(_row: unknown, _column: unknown, _value: unknown) {
    return centeredCell(getNombre());
  };
}

export function createPlazoRenderer(getValorExtra: () => string) {
  return function cellsrendererPlazo(_row: unknown, _column: unknown, value: unknown) {
    void getValorExtra();
    return centeredCell(String(value ?? ''), '', true);
  };
}
