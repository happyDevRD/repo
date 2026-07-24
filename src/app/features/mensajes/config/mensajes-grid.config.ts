import { environment } from 'src/environments/environment'
import { formatIsoDateToGridCell } from '../helpers/mensajes-date.helper'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const mensajesColumnRenderer = (defaultText?: string): string =>
  `<div class="msg-grid-header">${escapeHtml(defaultText ?? '')}</div>`

const estadoBadgeClass = (estado?: string | null): string => {
  switch (estado) {
    case 'PENDIENTE':
      return 'msg-grid-badge msg-grid-badge--pendiente'
    case 'LEIDO':
      return 'msg-grid-badge msg-grid-badge--leido'
    case 'TRAMITANDO':
    case 'TRAMITADO':
      return 'msg-grid-badge msg-grid-badge--tramitando'
    case 'RECHAZADO':
      return 'msg-grid-badge msg-grid-badge--rechazado'
    default:
      return 'msg-grid-badge msg-grid-badge--default'
  }
}

export const mensajesCellsRenderer = (_row: number, column: string, value: string): string => {
  if (column === 'estado') {
    const label = value ? escapeHtml(value) : ''
    return `<div class="msg-grid-cell"><span class="${estadoBadgeClass(value)}">${label || '—'}</span></div>`
  }
  if (column === 'descripcion') {
    const text = value ? escapeHtml(String(value)) : ''
    return `<div class="msg-grid-cell msg-grid-cell--left">${text}</div>`
  }
  if (value == null || value === '') {
    return '<div class="msg-grid-cell msg-grid-cell--muted">—</div>'
  }
  return `<div class="msg-grid-cell">${escapeHtml(String(value))}</div>`
}

export const mensajesCellsRendererFecha = (_row: number, _column: string, value: string): string =>
  formatIsoDateToGridCell(value)

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
]

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
]

export const buildMensajesEnviadosColumns = () => [
  { text: 'id', datafield: 'id', hidden: true },
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
  { text: 'fecLectura', datafield: 'fecLectura', hidden: true },
  { text: 'fecTramitacion', datafield: 'fecTramitacion', hidden: true },
  { text: 'fecRechazo', datafield: 'fecRechazo', hidden: true },
  { text: 'descripcionRechazo', datafield: 'descripcionRechazo', hidden: true },
  { text: 'nomRemit', datafield: 'nomRemit', hidden: true },
]

export const buildMensajesRecibidosColumns = () => [
  { text: 'id', datafield: 'id', hidden: true },
  {
    text: 'Emisión',
    width: '14%',
    datafield: 'fecEnvio',
    cellsrenderer: mensajesCellsRendererFecha,
    renderer: mensajesColumnRenderer,
  },
  {
    text: 'Descripción',
    width: '42%',
    datafield: 'descripcion',
    cellsrenderer: mensajesCellsRenderer,
    renderer: mensajesColumnRenderer,
  },
  { text: 'Expediente', width: '14%', datafield: 'idExped', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Remitente', width: '16%', datafield: 'nomRemit', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'Estado', width: '14%', datafield: 'estado', cellsrenderer: mensajesCellsRenderer, renderer: mensajesColumnRenderer },
  { text: 'fecLectura', datafield: 'fecLectura', hidden: true },
  { text: 'fecTramitacion', datafield: 'fecTramitacion', hidden: true },
  { text: 'fecRechazo', datafield: 'fecRechazo', hidden: true },
  { text: 'descripcionRechazo', datafield: 'descripcionRechazo', hidden: true },
  { text: 'nomDesti', datafield: 'nomDesti', hidden: true },
  { text: 'IdTarea', datafield: 'idTarea', hidden: true },
]

export const createMensajesRecibidosAdapter = (idOrgUsuar: string | number): unknown =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: MENSAJES_RECIBIDOS_DATA_FIELDS,
    url: `${environment.apiUrl}mensaje/listarRecibidos/${idOrgUsuar}`,
    sortcolumn: 'fecEnvio',
    sortdirection: 'desc',
  })

export const createMensajesEnviadosAdapter = (idOrgUsuar: string | number): unknown =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: MENSAJES_ENVIADOS_DATA_FIELDS,
    url: `${environment.apiUrl}mensaje/listarEnviados/${idOrgUsuar}`,
  })
