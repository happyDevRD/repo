import { environment } from 'src/environments/environment';
import { GridRadioSelector } from '../../core/helper/grid-radio-selector';
import { SolicitudListar } from '../solicitudes';

export interface SolicitudesGridRenderContext {
  ejercicioSolicitud?: string;
  valorEstadoExpedi?: unknown;
}

export interface SolicitudesGridRenderers {
  columnrenderer: (value?: string) => string;
  columnrendererSoliciPendi: (value?: string) => string;
  cellsrenderer: (row: number, column: { datafield?: string }, value: string) => string;
  cellsrendererRepre: (row: number, column: string, value: string) => string;
  cellsrendererinteresado: (row: number, column: string, value: { desPerEntid?: string }) => string;
  cellsrendererSolicitudes: (row: number, column: string, value: string) => string;
  cellsrendererSolicitudesPendi: (row: number, column: string, value: string) => string;
  cellsrendererEjercicio: (row: number, column: string, value: string) => string;
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

const cellCenter = (value: string, extra = ''): string =>
  `<div style="text-align: center; margin-top: 5px;${extra}">${value ?? ''}</div>`;

const cellLeft = (value: string): string =>
  `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;">${value ?? ''}</div>`;

export const createSolicitudesGridRenderers = (
  context: SolicitudesGridRenderContext = {},
): SolicitudesGridRenderers => ({
  columnrenderer: (value?: string) => {
    if (value === 'Interesado') {
      return `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;"><img src="assets/asignar.svg" width="25" height="25"/>${value}</div>`;
    }
    return `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`;
  },
  columnrendererSoliciPendi: (value?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  cellsrenderer: (_row, column, value) => {
    let alignment = 'left';
    let padding = 'padding-left: 8px;';
    if (column?.datafield === 'estado' || column?.datafield === 'usuario' || column?.datafield === 'ejeNumRegis') {
      alignment = 'center';
      padding = '';
    }
    return `<div style="text-align: ${alignment}; margin-top: 5px; ${padding} line-height: 1.2;">${value ?? ''}</div>`;
  },
  cellsrendererRepre: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererinteresado: (_row, _column, value) => cellLeft(value?.desPerEntid ?? ''),
  cellsrendererSolicitudes: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererSolicitudesPendi: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererEjercicio: (_row, _column, value) => {
    context.ejercicioSolicitud = value;
    return cellCenter(String(value));
  },
  cellsrendererNumero: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererAnidado: (_row, _column, value) => {
    context.valorEstadoExpedi = (value as { id?: unknown })?.id ?? value;
    if (!value?.ejercicio || !value?.numero) {
      return cellCenter('');
    }
    return cellCenter(`${value.ejercicio}/${value.numero}`);
  },
  cellsrendererAnidadoEstado: (_row, _column, value) => cellCenter(value?.estado ?? ''),
  cellsrendererFechaSolici: (_row, _column, value) => {
    if (!value) {
      return `<div style="font-size: 10px;text-align: center; color:red;margin-top: 5px;">-</div>`;
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

const buildSolicitudTailColumns = (renderers: SolicitudesGridRenderers): any[] => [
  { text: 'Representante', datafield: 'nomRepre', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
  { text: 'idRepre', datafield: 'idRepre', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
  { text: 'idHisRepre', datafield: 'idHisRepre', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsSolici = (renderers: SolicitudesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'dirRepre', datafield: 'dirRepre', width: '1%', hidden: true, align: 'center' },
  { text: 'idExpediente', datafield: 'idExpediente', width: '1%', hidden: true, align: 'center' },
  { text: 'Interesado', datafield: 'numDocum', width: '10%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, hidden: true, align: 'center' },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Ejercicio', datafield: 'ejercicio', width: '6%', cellsrenderer: renderers.cellsrendererEjercicio, renderer: renderers.columnrenderer },
  { text: 'Numero', datafield: 'numero', width: '6%', cellsrenderer: renderers.cellsrendererNumero, renderer: renderers.columnrenderer },
  { text: 'Fecha Solicitud', datafield: 'fecInicio', width: '12%', cellsrenderer: renderers.cellsrendererFechaSolici, renderer: renderers.columnrenderer },
  { text: 'Asunto', datafield: 'asunto', width: '18%', cellsrenderer: renderers.cellsrendererSolicitudes, renderer: renderers.columnrenderer, align: 'left' },
  { text: 'Estado', datafield: 'estado', width: '9%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Asignado a', datafield: 'usuario', width: '10%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Interesado', datafield: 'personaEntidad', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer },
  { text: 'Número Registro', datafield: 'ejeNumRegis', width: '9%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Expediente', datafield: 'expediente', width: '8%', cellsrenderer: renderers.cellsrendererAnidado, renderer: renderers.columnrenderer },
  ...buildSolicitudTailColumns(renderers),
  { text: 'idHisDocum', datafield: 'idHisDocum', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
  { text: 'iddocum', datafield: 'idDocum', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsSoliciPendi = (renderers: SolicitudesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'dirRepre', datafield: 'dirRepre', width: '1%', hidden: true },
  { text: 'idExpediente', datafield: 'idExpediente', width: '1%', hidden: true },
  { text: 'Interesado', datafield: 'numDocum', width: '10%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Ejercicio', datafield: 'ejercicio', width: '6%', cellsrenderer: renderers.cellsrendererEjercicio, renderer: renderers.columnrenderer },
  { text: 'Numero', datafield: 'numero', width: '6%', cellsrenderer: renderers.cellsrendererNumero, renderer: renderers.columnrenderer },
  { text: 'Fecha Solicitud', datafield: 'fecInicio', width: '12%', cellsrenderer: renderers.cellsrendererFechaSolici, renderer: renderers.columnrenderer },
  { text: 'Asunto', datafield: 'asunto', width: '18%', cellsrenderer: renderers.cellsrendererSolicitudes, renderer: renderers.columnrenderer, align: 'left' },
  { text: 'Estado', datafield: 'estado', width: '9%', cellsrenderer: renderers.cellsrendererSolicitudesPendi, renderer: renderers.columnrendererSoliciPendi, align: 'center' },
  { text: 'Asignado a', datafield: 'usuario', width: '10%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Interesado', datafield: 'personaEntidad', width: '20%', cellsrenderer: renderers.cellsrendererinteresado, renderer: renderers.columnrenderer },
  { text: 'Número Registro', datafield: 'ejeNumRegis', width: '9%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer, align: 'center' },
  { text: 'Expediente', datafield: 'expediente', width: '8%', cellsrenderer: renderers.cellsrendererAnidado, renderer: renderers.columnrenderer },
  ...buildSolicitudTailColumns(renderers),
];

export const buildColumnsListDoc = (renderers: SolicitudesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'Archivo', datafield: 'archivo', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccionDoc, renderer: renderers.columnrenderer },
  { text: 'Descripción', datafield: 'descripcion', cellsrenderer: renderers.cellsrendererListDoc, renderer: renderers.columnrenderer },
  { text: 'Fecha Documento', datafield: 'fechaSubida', cellsrenderer: renderers.cellsrendererListDocFecha, renderer: renderers.columnrenderer },
  { text: 'Nombre Archivo', datafield: 'nombreArchivo', cellsrenderer: renderers.cellsrendererDescargaDoc, renderer: renderers.columnrenderer },
];

export const buildColumnsListExpe = (renderers: SolicitudesGridRenderers): any[] => [
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer, hidden: true },
  { text: 'Ejercicio', datafield: 'ejercicio', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Nùmero', width: '8%', datafield: 'id', cellsrenderer: renderers.cellsrendererEjercicio, renderer: renderers.columnrenderer },
  { text: 'Instructor ', datafield: 'instructor', cellsrenderer: renderers.cellsrendererNumero, renderer: renderers.columnrenderer },
  { text: 'Título', datafield: 'titulo', width: '30%', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Fecha Inicio', datafield: 'fecInicio', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
  { text: 'Estado', datafield: 'estado', cellsrenderer: renderers.cellsrenderer, renderer: renderers.columnrenderer },
];

export const buildColumnsListRepre = (renderers: SolicitudesGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true },
  { text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
  { text: 'Dirección', datafield: 'dirPosta', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
];

export const createSolicitudesListAdapter = (
  idOrgEleme: string | number,
  options?: { sortById?: boolean },
): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: SOLICITUDES_DATA_FIELDS,
    url: `${environment.apiUrl}solicitud/listar/${idOrgEleme}`,
    id: 'id',
    sortcolumn: options?.sortById ? 'id' : 'fecInicio',
    sortdirection: 'desc',
  });

export const createDocumentosAdapter = (idsolicitud: number | string): any =>
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

export const createExpedientesAdapter = (idexpedienteAsoc: number | string): any =>
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
): any => {
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

export const refreshJqxGrid = (
  grid: { updatebounddata?: () => void } | null | undefined,
): void => {
  grid?.updatebounddata?.();
};
