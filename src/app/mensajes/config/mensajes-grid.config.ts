import { environment } from 'src/environments/environment';
import { formatIsoDateToGridCell } from '../helpers/mensajes-date.helper';

export const mensajesColumnRenderer = (defaultText?: string): string =>
  `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${defaultText ?? ''}</div>`;

export const mensajesColumnSeleccion = (): string =>
  ' <div style="padding-top:5px; ;text-align: center;"  type="button"  ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';

export const mensajesCellsRenderer = (_row: number, _column: string, value: string): string => {
  switch (value) {
    case null:
      return '<div style="text-align: center; color:green; margin-top: 5px;"></div>';
    case 'PENDIENTE':
      return `<div style="text-align: center; color:green; margin-top: 5px;">${value}</div>`;
    case 'CERRADO':
    case 'CANCELADO':
      return `<div style="text-align: center; color:red; margin-top: 5px;">${value}</div>`;
    default:
      return `<div style="text-align: center; margin-top: 5px;">${value}</div>`;
  }
};

export const mensajesCellsRendererFecha = (_row: number, _column: string, value: string): string =>
  formatIsoDateToGridCell(value);

const MENSAJES_ENVIADOS_DATA_FIELDS = [
  { name: 'fecEnvio', type: 'string' },
  { name: 'fecLectura', type: 'string' },
  { name: 'descripcion', type: 'string' },
  { name: 'nomDesti', type: 'string' },
  { name: 'estado', type: 'string' },
  { name: 'id', type: 'number' },
  { name: 'fecTramitacion', type: 'string' },
  { name: 'fecRechazo', type: 'string' },
  { name: 'descripcionRechazo', type: 'string' },
  { name: 'nomRemit', type: 'string' },
];

const MENSAJES_RECIBIDOS_DATA_FIELDS = [
  { name: 'fecEnvio', type: 'string' },
  { name: 'fecLectura', type: 'string' },
  { name: 'descripcion', type: 'string' },
  { name: 'nomRemit', type: 'string' },
  { name: 'estado', type: 'string' },
  { name: 'id', type: 'number' },
  { name: 'fecTramitacion', type: 'string' },
  { name: 'fecRechazo', type: 'string' },
  { name: 'descripcionRechazo', type: 'string' },
  { name: 'nomDesti', type: 'string' },
  { name: 'idTarea', type: 'string' },
  { name: 'idExped', type: 'string' },
];

export const buildMensajesEnviadosColumns = () => [
  { text: 'id', datafield: 'id', hidden: true },
  {
    text: '',
    datafield: '',
    width: '1%',
    cellsrenderer: mensajesColumnSeleccion,
    renderer: mensajesColumnRenderer,
    hidden: true,
  },
  {
    text: 'Emisión',
    width: '15%',
    datafield: 'fecEnvio',
    cellsrenderer: mensajesCellsRendererFecha,
    renderer: mensajesColumnRenderer,
  },
  {
    text: 'Descripción',
    width: '50%',
    datafield: 'descripcion',
    cellsrenderer: mensajesCellsRenderer,
    renderer: mensajesColumnRenderer,
  },
  { text: 'Destinatario', datafield: 'nomDesti', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Estado', datafield: 'estado', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Acciones', datafield: 'Acciones', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecLectura', datafield: 'fecLectura', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecTramitacion', datafield: 'fecTramitacion', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecRechazo', datafield: 'fecRechazo', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'descripcionRechazo', datafield: 'descripcionRechazo', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'nomRemit', datafield: 'nomRemit', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
];

export const buildMensajesRecibidosColumns = () => [
  { text: 'id', datafield: 'id', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: mensajesColumnSeleccion, renderer: mensajesColumnRenderer },
  {
    text: 'Emisión',
    width: '15%',
    datafield: 'fecEnvio',
    cellsrenderer: mensajesCellsRendererFecha,
    renderer: mensajesColumnRenderer,
  },
  {
    text: 'Descripción',
    width: '50%',
    datafield: 'descripcion',
    cellsrenderer: mensajesCellsRenderer,
    renderer: mensajesColumnRenderer,
  },
  { text: 'Expediente número', datafield: 'idExped', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Remitente', datafield: 'nomRemit', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Estado', datafield: 'estado', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Acciones', datafield: 'Acciones', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecLectura', datafield: 'fecLectura', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecTramitacion', datafield: 'fecTramitacion', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'fecRechazo', datafield: 'fecRechazo', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'descripcionRechazo', datafield: 'descripcionRechazo', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'nomDesti', datafield: 'nomDesti', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
  { text: 'IdTarea', datafield: 'idTarea', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer, hidden: true },
];

export const createMensajesRecibidosAdapter = (idOrgUsuar: string | number): unknown =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: MENSAJES_RECIBIDOS_DATA_FIELDS,
    url: `${environment.apiUrl}mensaje/listarRecibidos/${idOrgUsuar}`,
    sortcolumn: 'fecha',
    sortdirection: 'desc',
  });

export const createMensajesEnviadosAdapter = (idOrgUsuar: string | number): unknown =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: MENSAJES_ENVIADOS_DATA_FIELDS,
    url: `${environment.apiUrl}mensaje/listarEnviados/${idOrgUsuar}`,
    postData: { estado: 'LEIDO' },
  });
