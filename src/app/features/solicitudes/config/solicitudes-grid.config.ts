import { environment } from 'src/environments/environment';
import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import {
  IflowGridColumns,
  IflowGridSource,
} from '../../../shared/components/iflow-grid/iflow-grid.types';
import { SolicitudListar } from '../models';

export interface SolicitudesGridRenderContext {
  ejercicioSolicitud?: string;
  valorEstadoExpedi?: unknown;
}

export interface SolicitudesGridRenderers {
  columnrenderer: (value?: string) => string;
  columnrendererSoliciPendi: (value?: string) => string;
  cellsrenderer: (row: number, column: string | { datafield?: string }, value: string) => string;
  cellsrendererRepre: (row: number, column: string, value: string) => string;
  cellsrendererinteresado: (row: number, column: string, value: { desPerEntid?: string }) => string;
  cellsrendererSolicitudes: (row: number, column: string, value: string) => string;
  cellsrendererSolicitudesPendi: (row: number, column: string, value: string) => string;
  cellsrendererEjercicio: (
    row: number,
    column: string,
    value: string,
    defaultHtml?: string,
    columnProperties?: unknown,
    rowdata?: { ejercicio?: string | number; numero?: string | number },
  ) => string;
  cellsrendererNumero: (row: number, column: string, value: string) => string;
  cellsrendererAnidado: (row: number, column: string, value: { ejercicio?: string; numero?: string }) => string;
  cellsrendererAnidadoEstado: (row: number, column: string, value: { estado?: string }) => string;
  cellsrendererFechaSolici: (row: number, column: string, value: string) => string;
  cellsrendererListDoc: (row: number, column: string, value: string) => string;
  cellsrendererDescargaDoc: (row: number, column: string, value: string) => string;
  cellsrendererListDocFecha: (row: number, column: string, value: string) => string;
  columnseleccion: (row: number, column: string, value: string) => string;
  columnseleccionDoc: (row: number, column: string, value: string) => string;
}

const cellCenter = (value: string): string =>
  `<div style="text-align:center; margin-top:8px; padding:0 4px;">${value ?? ''}</div>`;

const cellLeft = (value: string): string =>
  `<div style="text-align:left; margin-top:8px; padding-left:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(value ?? '')}">${value ?? ''}</div>`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const resolveDatafield = (column: string | { datafield?: string }): string =>
  typeof column === 'string' ? column : (column?.datafield ?? '');

const estadoBadgeClass = (estado: string): string => {
  const key = estado.trim().toUpperCase();
  if (key === 'PENDIENTE') return 'soli-badge soli-badge--pendiente';
  if (key === 'ACEPTADA') return 'soli-badge soli-badge--aceptada';
  if (key === 'RECHAZADA') return 'soli-badge soli-badge--rechazada';
  return 'soli-badge';
};

export const createSolicitudesGridRenderers = (
  context: SolicitudesGridRenderContext = {},
): SolicitudesGridRenderers => ({
  // Renderer de cabecera compatible con jqx (sin flex/height:100% — desalinea columnas)
  columnrenderer: (value?: string) =>
    `<div style="text-align:center; margin-top:6px; font-size:11px; font-weight:600; letter-spacing:.03em; text-transform:uppercase;">${value ?? ''}</div>`,
  columnrendererSoliciPendi: (value?: string) =>
    `<div style="text-align:center; margin-top:6px; font-size:11px; font-weight:600; letter-spacing:.03em; text-transform:uppercase;">${value ?? ''}</div>`,
  cellsrenderer: (_row, column, value) => {
    const field = resolveDatafield(column as string | { datafield?: string });
    if (field === 'estado') {
      const texto = String(value ?? '');
      return `<div style="text-align:center; margin-top:6px;"><span class="${estadoBadgeClass(texto)}">${texto || '-'}</span></div>`;
    }
    if (field === 'usuario' || field === 'ejeNumRegis') {
      return cellCenter(String(value ?? ''));
    }
    return cellLeft(String(value ?? ''));
  },
  cellsrendererRepre: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererinteresado: (_row, _column, value) => cellLeft(value?.desPerEntid ?? ''),
  cellsrendererSolicitudes: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererSolicitudesPendi: (_row, _column, value) => {
    const texto = String(value ?? '');
    return `<div style="text-align:center; margin-top:6px;"><span class="${estadoBadgeClass(texto)}">${texto || '-'}</span></div>`;
  },
  cellsrendererEjercicio: (_row, _column, value, _def?, _col?, rowdata?: { ejercicio?: string | number; numero?: string | number }) => {
    context.ejercicioSolicitud = String(value ?? '');
    const ejercicio = rowdata?.ejercicio ?? value;
    const numero = rowdata?.numero;
    if (ejercicio == null || ejercicio === '') {
      return cellCenter('-');
    }
    if (numero == null || numero === '') {
      return cellCenter(String(ejercicio));
    }
    return cellCenter(`${ejercicio}/${numero}`);
  },
  cellsrendererNumero: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererAnidado: (_row, _column, value) => {
    context.valorEstadoExpedi = (value as { id?: unknown })?.id ?? value;
    if (!value?.ejercicio || !value?.numero) {
      return cellCenter('—');
    }
    return cellCenter(`${value.ejercicio}/${value.numero}`);
  },
  cellsrendererAnidadoEstado: (_row, _column, value) => cellCenter(value?.estado ?? ''),
  cellsrendererFechaSolici: (_row, _column, value) => {
    if (!value) {
      return cellCenter('—');
    }
    const anio = value.substring(0, 4);
    const mes = value.substring(5, 7);
    const dia = value.substring(8, 10);
    return cellCenter(`${dia}/${mes}/${anio}`);
  },
  cellsrendererListDoc: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererDescargaDoc: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererListDocFecha: (_row, _column, value) => {
    if (!value) {
      return cellCenter('');
    }
    const anio = value.substring(0, 4);
    const mes = value.substring(5, 7);
    const dia = value.substring(8, 10);
    return cellCenter(`${dia}/${mes}/${anio}`);
  },
  columnseleccion: GridRadioSelector.createRadioRenderer('Solicitudes', 'Selecciona Solicitud'),
  columnseleccionDoc: GridRadioSelector.createRadioRenderer('Documentos', 'Selecciona Documento'),
});

const SOLICITUDES_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'fecInicio', type: 'any' },
  { name: 'asunto', type: 'any' },
  { name: 'numDocum', type: 'any' },
  { name: 'estado', type: 'any' },
  { name: 'usuario', type: 'any' },
  { name: 'expediente', type: 'any' },
  { name: 'personaEntidad', type: 'any' },
  { name: 'ejeNumRegis', type: 'any' },
  { name: 'numero', type: 'any' },
  { name: 'ejercicio', type: 'any' },
  { name: 'idExpediente', type: 'any' },
  { name: 'nomRepre', type: 'any' },
  { name: 'idRepre', type: 'any' },
  { name: 'idHisRepre', type: 'any' },
  { name: 'dirRepre', type: 'any' },
  { name: 'idHisDocum', type: 'any' },
  { name: 'idDocum', type: 'any' },
];

const SOLICITUDES_PENDI_DATA_FIELDS = SOLICITUDES_DATA_FIELDS.filter(
  (field) => field.name !== 'idHisDocum' && field.name !== 'idDocum',
);

const DOCUMENTOS_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'archivo', type: 'any' },
  { name: 'descripcion', type: 'any' },
  { name: 'nombreArchivo', type: 'any' },
  { name: 'fechaSubida', type: 'any' },
];

const EXPEDIENTES_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'ejercicio', type: 'any' },
  { name: 'solicitud', type: 'any' },
  { name: 'instructor', type: 'any' },
  { name: 'titulo', type: 'any' },
  { name: 'fecInicio', type: 'any' },
  { name: 'estado', type: 'any' },
];

const REPRESENTANTES_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'idPerso', type: 'any' },
  { name: 'idHisPerso', type: 'any' },
  { name: 'desPerEntid', type: 'any' },
  { name: 'dirPosta', type: 'any' },
];

const buildSolicitudTailColumns = (renderers: SolicitudesGridRenderers): IflowGridColumns => [
  { text: 'Representante', datafield: 'nomRepre', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
  { text: 'idRepre', datafield: 'idRepre', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
  { text: 'idHisRepre', datafield: 'idHisRepre', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsSoliciPendi = (renderers: SolicitudesGridRenderers): IflowGridColumns => [
  { text: 'id', datafield: 'id', hidden: true },
  { text: 'dirRepre', datafield: 'dirRepre', hidden: true },
  { text: 'idExpediente', datafield: 'idExpediente', hidden: true },
  { text: 'Interesado', datafield: 'numDocum', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Nº', datafield: 'ejercicio', width: '8%', cellsrenderer: renderers.cellsrendererEjercicio, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Numero', datafield: 'numero', cellsrenderer: renderers.cellsrendererNumero, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Fecha', datafield: 'fecInicio', width: '11%', cellsrenderer: renderers.cellsrendererFechaSolici, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Asunto', datafield: 'asunto', width: '30%', cellsrenderer: renderers.cellsrendererSolicitudes, renderer: renderers.columnrenderer, align: 'left' },
  { text: 'Estado', datafield: 'estado', width: '12%', cellsrenderer: renderers.cellsrendererSolicitudesPendi, renderer: renderers.columnrendererSoliciPendi, align: 'center' },
  { text: 'Asignado', datafield: 'usuario', width: '12%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Interesado', datafield: 'personaEntidad', width: '17%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, align: 'left' },
  { text: 'Número Registro', datafield: 'ejeNumRegis', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Expediente', datafield: 'expediente', width: '10%', cellsrenderer: renderers.cellsrendererAnidado, renderer: renderers.columnrenderer, align: 'center' },
  ...buildSolicitudTailColumns(renderers),
];

export const buildColumnsListDoc = (renderers: SolicitudesGridRenderers): IflowGridColumns => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'Archivo', datafield: 'archivo', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccionDoc, renderer: renderers.columnrenderer },
  { text: 'Descripción', datafield: 'descripcion', cellsrenderer: renderers.cellsrendererListDoc, renderer: renderers.columnrenderer },
  { text: 'Fecha Documento', datafield: 'fechaSubida', cellsrenderer: renderers.cellsrendererListDocFecha, renderer: renderers.columnrenderer },
  { text: 'Nombre Archivo', datafield: 'nombreArchivo', cellsrenderer: renderers.cellsrendererDescargaDoc, renderer: renderers.columnrenderer },
];

export const buildColumnsListExpe = (renderers: SolicitudesGridRenderers): IflowGridColumns => [
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Ejercicio', datafield: 'ejercicio', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Nùmero', width: '8%', datafield: 'id', cellsrenderer: renderers.cellsrendererEjercicio, renderer: renderers.columnrenderer },
  { text: 'Instructor ', datafield: 'instructor', cellsrenderer: renderers.cellsrendererNumero, renderer: renderers.columnrenderer },
  { text: 'Título', datafield: 'titulo', width: '30%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Fecha Inicio', datafield: 'fecInicio', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Estado', datafield: 'estado', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
];

export const buildColumnsListRepre = (renderers: SolicitudesGridRenderers): IflowGridColumns => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true },
  { text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
  { text: 'Dirección', datafield: 'dirPosta', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
];

export const createDocumentosAdapter = (idsolicitud: number | string): IflowGridSource =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: DOCUMENTOS_DATA_FIELDS,
    url: `${environment.apiUrl}documentoSolicitud/verDocProc/${idsolicitud}`,
    id: 'id',
  });

export const createDocumentosSourcePlain = (idsolicitud: number | string): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: DOCUMENTOS_DATA_FIELDS,
  url: `${environment.apiUrl}documentoSolicitud/verDocProc/${idsolicitud}`,
  id: 'id',
});

export const createExpedientesAdapter = (idexpedienteAsoc: number | string): IflowGridSource =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: EXPEDIENTES_DATA_FIELDS,
    url: `${environment.apiUrl}expediente/ver/${idexpedienteAsoc}`,
    id: 'id',
  });

export const createExpedientesSourcePlain = (idexpedienteAsoc: number | string): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: EXPEDIENTES_DATA_FIELDS,
  url: `${environment.apiUrl}expediente/ver/${idexpedienteAsoc}`,
  id: 'id',
});

export const createRepresentantesAdapter = (
  idPerso: number | string,
  idHisPerso: number | string,
  withSort = false,
): IflowGridSource => {
  const config = {
    dataType: 'json',
    dataFields: REPRESENTANTES_DATA_FIELDS,
    url: `${environment.apiUrl}personaRepresentante/listar/${idPerso}/${idHisPerso}`,
    id: 'id',
    ...(withSort ? { sortcolumn: 'id', sortdirection: 'desc' } : {}),
  };
  return new jqx.dataAdapter(config);
};

export const createRepresentantesSourcePlain = (
  idPerso: number | string,
  idHisPerso: number | string,
): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: REPRESENTANTES_DATA_FIELDS,
  url: `${environment.apiUrl}personaRepresentante/listar/${idPerso}/${idHisPerso}`,
  id: 'id',
});

export const createSolicitudesPendientesLocalSource = (data: SolicitudListar[]): Record<string, unknown> => ({
  localdata: data,
  dataType: 'json',
  dataFields: SOLICITUDES_PENDI_DATA_FIELDS,
  id: 'id',
});
