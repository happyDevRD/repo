import { environment } from 'src/environments/environment';
import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import { INICIO_GRID_RENDERERS as R } from '../../inicio/shared/inicio-grid-renderers';
import { Atributosleer, ExpedienteListar, TareaTramiteExpporExpedi } from '../expedientes';

export interface ExpedientesGridRenderContext {
  valorEstado?: string;
  setUsuarioTarea?: (id: unknown) => void;
}

export interface ExpedientesGridRenderers {
  columnrenderer: (value?: string) => string;
  columnrendererIndiceENI: (value?: string) => string;
  columnrendererAtributo: (value?: string) => string;
  columnrendererPermi: (value?: string) => string;
  columnrendererDescarga: (value?: string) => string;
  columnseleccion: (value?: unknown) => string;
  cellsrendererRepre: (row: number, column: string, value: string) => string;
  cellsrendererIndiceENI: (row: number, column: string, value: string) => string;
  cellsrenderer: (row: number, column: string, value: string) => string;
  cellsrendererTareaExpedi: (row: number, column: string, value: unknown) => string;
  cellsrendererEstado: (row: number, column: string, value: string) => string;
  cellsrendererInsideEstado: (row: number, column: string, value: string) => string;
  cellsrendererProcedimientoExpe: (row: number, column: string, value: { descripcion?: string }) => string;
  cellsrendererInteresado: (row: number, column: string, value: { desPerEntid?: string }) => string;
  cellsrendererFecha: (row: number, column: string, value: string) => string;
  cellsrendererTareaDescrip: (row: number, column: string, value: string) => string;
  cellsrendererTarea: (row: number, column: string, value: string) => string;
  cellsrendererPermi: (row: number, column: string, value: string) => string;
  cellsrendererAtributo: (row: number, column: string, value: unknown) => string;
  cellsrendererColor: (row: number, column: string, value: string) => string;
  cellsrendererContieneArchivo: (row: number, column: string, value: unknown) => string;
  cellsrendererTramiteTarea: (row: number, column: string, value: unknown) => string;
  cellsrendererPlazo: (row: number, column: string, value: unknown) => string;
  cellsrendererArchivo: (row: number, column: string, value: string) => string;
  cellsrendererFechaPlazo: (row: number, column: string, value: unknown) => string;
  columnseleccionExpedientes: (row: number, column: string, value: string) => string;
  columnseleccionTareaProcedi: (row: number, column: string, value: string) => string;
  columnseleccionPermisos: (row: number, column: string, value: string) => string;
  columnseleccionTareasExpediente: (row: number, column: string, value: string) => string;
  columnseleccionAtributos: (row: number, column: string, value: string) => string;
}

const cellCenter = (value: string, extra = ''): string =>
  `<div style="text-align: center; margin-top: 5px;${extra}">${value ?? ''}</div>`;

const cellLeft = (value: string, color = ''): string =>
  `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;${color}">${value ?? ''}</div>`;

export const createExpedientesGridRenderers = (
  context: ExpedientesGridRenderContext = {},
): ExpedientesGridRenderers => ({
  columnrenderer: (value?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnrendererIndiceENI: (value?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnrendererAtributo: (value?: string) =>
    `<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">${value ?? ''}</div>`,
  columnrendererPermi: (value?: string) =>
    `<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">${value ?? ''}</div>`,
  columnrendererDescarga: (value?: string) =>
    `<div (click)="abreArchivo()" style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnseleccion: () =>
    ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Expediente" (click)="marcaExpedienteNuevo($event)" ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>',
  cellsrendererRepre: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererIndiceENI: (_row, _column, value) =>
    `<div style="text-align: center; margin-top: 5px;"  type="button"  >${value ?? ''}</div>`,
  cellsrenderer: (_row, _column, value) => {
    const color =
      context.valorEstado === 'CERRADO' || context.valorEstado === 'CANCELADO' ? ' color:red;' : '';
    return cellLeft(String(value), color);
  },
  cellsrendererTareaExpedi: (_row, _column, value) => {
    const display = value == null ? '' : String(value);
    if (context.valorEstado === 'CERRADO' || context.valorEstado === 'CANCELADO') {
      return `<div style="text-align: center;color:red; margin-top: 5px;">${display}</div>`;
    }
    return cellCenter(display);
  },
  cellsrendererEstado: (_row, _column, value) => {
    const estado = (value || '').toLowerCase();
    const label = value || '-';
    return `<div style="text-align:center;margin-top:5px;"><span class="estado-badge estado-badge--${estado}">${label}</span></div>`;
  },
  cellsrendererInsideEstado: (_row, _column, value) => {
    const estado = String(value ?? '').toUpperCase();
    if (!estado) {
      return cellCenter('-');
    }
    const badgeClass = estado === 'PENDIENTE'
      ? 'bg-warning text-dark'
      : estado === 'ENVIADO'
        ? 'bg-success'
        : estado === 'SIMULADO'
          ? 'bg-info text-dark'
          : estado === 'ERROR'
            ? 'bg-danger'
            : 'bg-secondary';
    return `<div style="text-align:center;margin-top:5px;"><span class="badge ${badgeClass}">${estado}</span></div>`;
  },
  cellsrendererProcedimientoExpe: (_row, _column, value) => {
    const text = value?.descripcion ?? '';
    return `<div style="text-align:left;margin-top:5px;padding-left:8px;line-height:1.3;white-space:normal;">${text}</div>`;
  },
  cellsrendererInteresado: (_row, _column, value) => {
    const text = value?.desPerEntid ?? '';
    return `<div style="text-align:left;margin-top:5px;padding-left:8px;line-height:1.3;white-space:normal;">${text}</div>`;
  },
  cellsrendererFecha: (_row, _column, value) => {
    if (!value) {
      return '<div style="font-size:10px;text-align:center;color:#94a3b8;margin-top:5px;">-</div>';
    }
    const dia = value.substring(8, 10);
    const mes = value.substring(5, 7);
    const anio = value.substring(0, 4);
    return cellCenter(`${dia}/${mes}/${anio}`);
  },
  cellsrendererTareaDescrip: (_row, _column, value) =>
    `<div  style="overflow-wrap: auto; text-align: center; margin-top: 5px;">${value ?? ''}</div>`,
  cellsrendererTarea: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererPermi: (_row, _column, value) => {
    const typed = value as unknown as { id?: unknown };
    if (typed?.id != null) {
      context.setUsuarioTarea?.(typed.id);
    }
    let display = value === 'ANOS' ? 'AÑOS' : String(value ?? '');
    return `<div style="text-align: center;font-family: Verdana; margin-top: 5px;"  >${display}</div>`;
  },
  cellsrendererAtributo: (_row, _column, value) => {
    let display = value == null || value === '' ? '' : String(value);
    if (display === 'ANOS') {
      display = 'AÑOS';
    }
    return `<div style="text-align: center; font-family: Verdana; margin-top: 5px;">${display}</div>`;
  },
  cellsrendererColor: (_row, _column, value) => {
    if (value === 'VERDE') {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  ><img  src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    if (value === 'AMARILLO') {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  ><img  src="assets/boton_amarillo.png" width="20" height="20"/></div>`;
    }
    if (value === 'ROJO') {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  ><img  src="assets/boton_rojo.png" width="20" height="20"/></div>`;
    }
    if (!value) {
      return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    >SIN DATOS</div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    ></div>`;
  },
  cellsrendererContieneArchivo: (_row, _column, value) => {
    if (value) {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  ><img  src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    ><img  src="assets/boton_rojo.png" width="20" height="20"/></div>`;
  },
  cellsrendererTramiteTarea: (_row, _column, value) => cellCenter(String(value ?? '')),
  cellsrendererPlazo: (_row, _column, value) => cellCenter(String(value ?? '')),
  cellsrendererArchivo: (_row, _column, value) => {
    if (value === '1') {
      return `<div style="text-align: center; margin-top: 5px;"  type="button"  ><img  src="assets/boton_verde.png" width="20" height="20"/></div>`;
    }
    return `<div style="color:red;font-size: 9px;text-align: center; margin-top: 5px;"    ><img  src="assets/boton_rojo.png" width="20" height="20"/></div>`;
  },
  cellsrendererFechaPlazo: (_row, _column, value) => {
    if (!value) {
      return `<div style="text-align: center;margin-top: 5px;"  type="button"  >SIN FECHA</div>`;
    }
    return `<div style="text-align: center;margin-top: 5px;"  type="button" >${value}</div>`;
  },
  columnseleccionExpedientes: GridRadioSelector.createRadioRenderer('Expedientes', 'Selecciona Expediente', true),
  columnseleccionTareaProcedi: GridRadioSelector.createRadioRenderer('TareaProcedi', 'Selecciona Tarea', true),
  columnseleccionPermisos: GridRadioSelector.createRadioRenderer('Permisos', 'Selecciona Permiso', true),
  columnseleccionTareasExpediente: GridRadioSelector.createRadioRenderer('TareasExpediente', 'Selecciona Tarea', true),
  columnseleccionAtributos: GridRadioSelector.createRadioRenderer('Atributos', 'Selecciona Atributo', true),
});

export const EXPEDIENTES_LIST_DATA_FIELDS = [
  { name: 'ejercicio', type: 'number' },
  { name: 'numero', type: 'number' },
  { name: 'titulo', type: 'string' },
  { name: 'formaApertura', type: 'string' },
  { name: 'estado', type: 'string' },
  { name: 'fecInicio', type: 'string' },
  { name: 'fecFin', type: 'string' },
  { name: 'fecCancelacion', type: 'string' },
  { name: 'procedimiento', type: 'string' },
  { name: 'instructor', type: 'string' },
  { name: 'personaEntidad', type: 'string' },
  { name: 'email', type: 'string' },
  { name: 'forNotif', type: 'string' },
  { name: 'id', type: 'any' },
  { name: 'forNotifTexto', type: 'any' },
  { name: 'idHisDocum', type: 'any' },
  { name: 'insideEstado', type: 'string' },
];

export const TAREAS_EXPEDIENTE_DATA_FIELDS = [
  { name: 'numero', type: 'number' },
  { name: 'descripcion', type: 'string' },
  { name: 'fecInicio', type: 'string' },
  { name: 'fecFin', type: 'string' },
  { name: 'propuestaResolucion', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'firmado', type: 'string' },
  { name: 'fecPlazo', type: 'string' },
  { name: 'color', type: 'string' },
  { name: 'archivo', type: 'string' },
  { name: 'tareaProcedimiento', type: 'any' },
  { name: 'id', type: 'any' },
  { name: 'tipAnexo', type: 'any' },
  { name: 'docAport', type: 'any' },
  { name: 'tipDocEni', type: 'any' },
  { name: 'documentacion', type: 'any' },
  { name: 'visible', type: 'any' },
  { name: 'numRegis', type: 'any' },
  { name: 'idHisDocum', type: 'any' },
  { name: 'ejeNumNotif', type: 'any' },
  { name: 'nombreArchivo', type: 'any' },
  { name: 'idAnunc', type: 'any' },
  { name: 'desTramite', type: 'any' },
];

const ATRIBUTOS_DATA_FIELDS = [
  { name: 'etiGruAtrib' },
  { name: 'desGruAtrib' },
  { name: 'valor' },
  { name: 'desProce' },
  { name: 'desTareaProce' },
  { name: 'idGrupo' },
  { name: 'idAtrib' },
  { name: 'usuContr' },
];

export const buildColumnsExpe = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccionExpedientes, renderer: R.columnrenderer },
  { text: 'Ejercicio', width: '5%', datafield: 'ejercicio', cellsrenderer: R.cellsrendererExpInstructor, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Número', width: '5%', sortby: 'desc', datafield: 'numero', cellsrenderer: R.cellsrendererExpInstructor, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Título', width: '16%', datafield: 'titulo', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer: R.columnrenderer, align: 'left', cellsalign: 'left' },
  { text: 'Forma apertura', width: '8%', datafield: 'formaApertura', cellsrenderer: R.cellsrendererExpInstructor, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Estado', width: '7%', datafield: 'estado', cellsrenderer: renderers.cellsrendererEstado, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'INSIDE', width: '7%', datafield: 'insideEstado', cellsrenderer: renderers.cellsrendererInsideEstado, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Fecha Expediente', width: '8%', datafield: 'fecInicio', cellsrenderer: renderers.cellsrendererFecha, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Fecha cierre', width: '8%', datafield: 'fecFin', cellsrenderer: renderers.cellsrendererFecha, renderer: R.columnrenderer, hidden: true },
  { text: 'Fecha cancela', width: '8%', datafield: 'fecCancelacion', cellsrenderer: renderers.cellsrendererFecha, renderer: R.columnrenderer, hidden: true },
  { text: 'Procedimiento', datafield: 'procedimiento', width: '22%', cellsrenderer: renderers.cellsrendererProcedimientoExpe, renderer: R.columnrenderer, align: 'left', cellsalign: 'left' },
  { text: 'Instructor', width: '8%', datafield: 'instructor', cellsrenderer: R.cellsrendererExpInstructor, renderer: R.columnrenderer, align: 'center', cellsalign: 'center' },
  { text: 'Interesado', width: '20%', datafield: 'personaEntidad', cellsrenderer: renderers.cellsrendererInteresado, renderer: R.columnrenderer, align: 'left', cellsalign: 'left' },
  { text: 'Email', datafield: 'email', hidden: true },
  { text: 'ForNotif', datafield: 'forNotif', hidden: true },
  { text: 'forNotifTexto', datafield: 'forNotifTexto', hidden: true },
  { text: 'idHisDocum', datafield: 'idHisDocum', hidden: true },
];

export const buildColumnsTareaProcedi = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'plantillaDefecto', datafield: 'plantillaDefecto', width: '1%', hidden: true },
  { text: '', datafield: '', width: '5%', cellsrenderer: renderers.columnseleccionTareaProcedi, renderer: renderers.columnrenderer },
  { text: 'Descripción', datafield: 'descripcion', cellsrenderer: renderers.cellsrendererTareaDescrip, renderer: renderers.columnrenderer },
  { text: 'Fase', datafield: 'faseTarea', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
  { text: 'Plazo', datafield: 'plazo', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
  { text: 'Tipo plazo', datafield: 'tipoPlazo', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
];

export const buildColumnsPermi = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: '', datafield: '', width: '5%', cellsrenderer: renderers.columnseleccionPermisos, renderer: renderers.columnrenderer },
  { text: 'Usuario', datafield: 'usuario', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrendererPermi },
  { text: 'Procedimiento', datafield: 'desProce', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer },
  { text: 'Tarea', datafield: 'desTareaProce', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer },
  { text: 'Descripción', datafield: 'descripcion', renderer: renderers.columnrenderer, hidden: true },
  { text: 'idOrgUsuar', datafield: 'idOrgUsuar', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsListRepre = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true },
  { text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
  { text: 'Dirección', datafield: 'dirPosta', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
];

export const buildColumnsIndiceENI = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'total', datafield: 'total', width: '1%', hidden: true },
  { text: 'Archivo', datafield: 'archivo', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
  { text: 'Nombre', datafield: 'nombre', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
  { text: 'Huella', datafield: 'huella', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
];

export const buildColumnsTareasExpediente = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
  { text: '', datafield: '', cellsrenderer: renderers.columnseleccionTareasExpediente, renderer: renderers.columnrenderer },
  { text: 'Número', width: '5%', datafield: 'numero', cellsrenderer: renderers.cellsrendererTareaExpedi, renderer: renderers.columnrenderer },
  { text: 'Descripción', width: '15%', datafield: 'descripcion', cellsrenderer: renderers.cellsrendererTareaExpedi, renderer: renderers.columnrenderer },
  { text: 'Trámite', width: '10%', datafield: 'desTramite', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer },
  { text: 'Fecha Inicio', width: '8%', datafield: 'fecInicio', cellsrenderer: renderers.cellsrendererFecha, renderer: renderers.columnrenderer },
  { text: 'Fecha Fin', width: '8%', datafield: 'fecFin', cellsrenderer: renderers.cellsrendererFecha, renderer: renderers.columnrenderer },
  { text: 'Fecha Plazo', width: '8%', datafield: 'fecPlazo', cellsrenderer: renderers.cellsrendererFechaPlazo, renderer: renderers.columnrenderer },
  { text: 'Color', width: '5%', datafield: 'color', cellsrenderer: renderers.cellsrendererColor, renderer: renderers.columnrendererDescarga },
  { text: 'Archivo', width: '5%', datafield: 'documentacion', cellsrenderer: renderers.cellsrendererContieneArchivo, renderer: renderers.columnrenderer },
  { text: 'Propuesta', width: '8%', datafield: 'propuestaResolucion', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer },
  { text: 'Firmado', width: '5%', datafield: 'firmado', cellsrenderer: renderers.cellsrendererArchivo, renderer: renderers.columnrendererDescarga },
  { text: 'Usuario', width: '8%', datafield: 'usuario', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer },
  { text: 'TipAnexo', width: '8%', datafield: 'tipAnexo', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer, hidden: true },
  { text: 'DocAport', width: '8%', datafield: 'docAport', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer, hidden: true },
  { text: 'TipDocEni', width: '8%', datafield: 'tipDocEni', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Visible', width: '8%', datafield: 'visible', cellsrenderer: renderers.cellsrendererTramiteTarea, renderer: renderers.columnrenderer, hidden: true },
  { text: 'NumRegis', width: '8%', datafield: 'numRegis', cellsrenderer: renderers.cellsrendererPlazo, renderer: renderers.columnrenderer, hidden: true },
  { text: 'idHisDocum', width: '8%', datafield: 'idHisDocum', cellsrenderer: renderers.cellsrendererPlazo, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsAtributo = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'idAtrib', datafield: 'idAtrib', width: '1%', hidden: true },
  { text: 'idGrupo', datafield: 'idGrupo', width: '1%', hidden: true },
  { text: 'usuContr', datafield: 'usuContr', width: '1%', hidden: true },
  { text: '', datafield: '', width: '5%', cellsrenderer: renderers.columnseleccionAtributos, renderer: renderers.columnrenderer },
  { text: 'Etiqueta', datafield: 'etiGruAtrib', width: '18%', cellsrenderer: renderers.cellsrendererAtributo, renderer: renderers.columnrendererAtributo },
  { text: 'Descripción', datafield: 'desGruAtrib', width: '42%', cellsrenderer: renderers.cellsrendererAtributo, renderer: renderers.columnrendererAtributo },
  { text: 'Valor', datafield: 'valor', width: '35%', cellsrenderer: renderers.cellsrendererAtributo, renderer: renderers.columnrendererAtributo },
];

export const createExpedientesListAdapter = (user: string, sortById = false): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: EXPEDIENTES_LIST_DATA_FIELDS,
    url: `${environment.apiUrl}expediente/listarExpediente/${user}`,
    ...(sortById ? { sortcolumn: 'id', sortdirection: 'desc' } : {}),
  });

export const createExpedientesListSourcePlain = (user: string): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: EXPEDIENTES_LIST_DATA_FIELDS,
  url: `${environment.apiUrl}expediente/listarExpediente/${user}`,
});

export const createExpedientesListLocalAdapter = (data: ExpedienteListar[]): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: EXPEDIENTES_LIST_DATA_FIELDS,
    localdata: data,
    id: 'id',
  });

export const createTareaProcediSourcePlain = (idProcedimiento: number | string): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: [
    { name: 'descripcion', type: 'string' },
    { name: 'faseTarea', type: 'string' },
    { name: 'plazo', type: 'string' },
    { name: 'tipoPlazo', type: 'string' },
    { name: 'id', type: 'any' },
    { name: 'plantillaDefecto', type: 'any' },
  ],
  url: `${environment.apiUrl}tareaProcedimiento/listar/${idProcedimiento}`,
  id: 'id',
});

export const createPermisosAdapter = (id: number | string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'usuario' },
      { name: 'desProce' },
      { name: 'desTareaProce' },
      { name: 'idOrgUsuar' },
      { name: 'id' },
    ],
    url: `${environment.apiUrl}permiso/listar/${id}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc',
  });

export const createRepresentantesAdapter = (idPerso: number | string, idHisPerso: number | string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'id', type: 'any' },
      { name: 'idPerso', type: 'any' },
      { name: 'idHisPerso', type: 'any' },
      { name: 'desPerEntid', type: 'any' },
      { name: 'dirPosta', type: 'any' },
    ],
    url: `${environment.apiUrl}personaRepresentante/listar/${idPerso}/${idHisPerso}`,
    id: 'id',
  });

export const createTramiteAdapter = (idexpediente: number | string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'numero', type: 'number' },
      { name: 'descripcion', type: 'string' },
      { name: 'fase', type: 'string' },
      { name: 'fecTramite', type: 'string' },
      { name: 'fecContr', type: 'string' },
      { name: 'usuContr', type: 'string' },
      { name: 'id', type: 'any' },
    ],
    url: `${environment.apiUrl}tramite/listar/${idexpediente}`,
    id: 'id',
  });

export const createIndiceEniAdapter = (idexpe: string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'archivo', type: 'any' },
      { name: 'nombre', type: 'any' },
      { name: 'huella', type: 'any' },
    ],
    url: `${environment.apiUrl}archivo/verIndice/${idexpe}`,
  });

export const createTareasExpedienteAdapter = (idExp: string | number): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: TAREAS_EXPEDIENTE_DATA_FIELDS,
    url: `${environment.apiUrl}tareaTramiteExpediente/listarPorExpediente/${idExp}`,
    id: 'id',
  });

export const createTareasExpedienteLocalAdapter = (localData: TareaTramiteExpporExpedi[]): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: TAREAS_EXPEDIENTE_DATA_FIELDS,
    localdata: localData,
    id: 'id',
  });

export const createAtributosAdapter = (
  idExpediente: number | string,
  localData?: Atributosleer[],
): any => {
  const config: {
    dataType: string;
    dataFields: typeof ATRIBUTOS_DATA_FIELDS;
    id: string;
    localdata?: Atributosleer[];
    url?: string;
  } = {
    dataType: 'json',
    dataFields: ATRIBUTOS_DATA_FIELDS,
    id: 'idAtrib',
  };
  if (localData) {
    config.localdata = localData;
  } else {
    config.url = `${environment.apiUrl}atributoExpediente/listar/${idExpediente}`;
  }
  return new jqx.dataAdapter(config);
};

export const createAtributosEmptyAdapter = (): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: ATRIBUTOS_DATA_FIELDS,
    localdata: [],
    id: 'id',
  });

export const refreshJqxGrid = (
  grid: { source?: (s: unknown) => void; updatebounddata?: (mode?: string) => void; width?: (w: string) => void; refresh?: () => void } | null | undefined,
): void => {
  grid?.updatebounddata?.('cells');
  grid?.refresh?.();
};
