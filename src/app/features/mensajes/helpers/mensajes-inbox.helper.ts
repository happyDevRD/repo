import { LeerMensajeEnviados, LeerMensajeRecibidos } from '../models'
import {
  MensajeDireccion,
  MensajeFiltroDireccion,
  MensajeFiltroEstado,
  MensajeInboxItem,
  MensajeRowData,
  isMensajeAccionable,
  MensajeSelectionState,
} from '../models/mensajes.models'
import { formatIsoDateToDisplay } from './mensajes-date.helper'

const toInboxItem = (
  row: LeerMensajeRecibidos | LeerMensajeEnviados,
  direccion: MensajeDireccion,
): MensajeInboxItem => ({
  id: row.id,
  idTarea: row.idTarea,
  fecEnvio: row.fecEnvio,
  fecLectura: row.fecLectura,
  fecTramitacion: row.fecTramitacion as unknown as string,
  fecRechazo: row.fecRechazo as unknown as string,
  descripcion: row.descripcion,
  descripcionRechazo: row.descripcionRechazo,
  estado: row.estado,
  nomRemit: row.nomRemit,
  nomDesti: row.nomDesti,
  idExped: (row as LeerMensajeRecibidos).idExped,
  informativo: row.informativo,
  direccion,
  key: `${direccion}-${row.id}`,
})

export const buildMensajeInbox = (
  recibidos: LeerMensajeRecibidos[] | null | undefined,
  enviados: LeerMensajeEnviados[] | null | undefined,
): MensajeInboxItem[] => {
  const items = [
    ...(recibidos ?? []).map((row) => toInboxItem(row, 'recibido')),
    ...(enviados ?? []).map((row) => toInboxItem(row, 'enviado')),
  ]
  return items.sort((a, b) => String(b.fecEnvio ?? '').localeCompare(String(a.fecEnvio ?? '')))
}

export const filterMensajeInbox = (
  items: MensajeInboxItem[],
  direccion: MensajeFiltroDireccion,
  estado: MensajeFiltroEstado,
  query: string,
): MensajeInboxItem[] => {
  const q = query.trim().toLowerCase()
  return items.filter((item) => {
    if (direccion !== 'todos' && item.direccion !== direccion) {
      return false
    }
    if (estado !== 'TODOS' && item.estado !== estado) {
      return false
    }
    if (!q) {
      return true
    }
    const haystack = [
      item.descripcion,
      item.nomRemit,
      item.nomDesti,
      item.estado,
      item.idExped,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

const mapBaseSelection = (
  row: MensajeRowData,
  direccion: MensajeDireccion,
): MensajeSelectionState => {
  const estado = row.estado ?? ''
  const actionable = direccion === 'recibido' && isMensajeAccionable(estado)
  let mensajeFechaRechazo = formatIsoDateToDisplay(row.fecRechazo, '')
  if (!row.fecRechazo && estado !== 'RECHAZADO') {
    mensajeFechaRechazo = ' '
  }

  return {
    idMensaje: row.id,
    idMensajeRecibido: row.id,
    idMensajeEnviado: row.id,
    idTarea: row.idTarea ?? 0,
    mensajeDescrip: row.descripcion ?? '',
    mensajeEstado: estado,
    mensajeFechaInicio: formatIsoDateToDisplay(row.fecEnvio),
    mensajeFechaLectura: formatIsoDateToDisplay(row.fecLectura),
    mensajeFechaRechazo,
    mensajeFechaTramitacion: formatIsoDateToDisplay(row.fecTramitacion),
    mensajeRemitente: row.nomRemit ?? '',
    mensajeDestinatario: row.nomDesti ?? '',
    mensajeDescripcionRechazo: row.descripcionRechazo ?? '',
    mensajeExpediente: row.idExped ?? '',
    mensajeDireccion: direccion,
    canRechazar: actionable,
    canTramitar: actionable,
    hasSeleccion: true,
  }
}

export const mapInboxItemToSelection = (item: MensajeInboxItem): MensajeSelectionState =>
  mapBaseSelection(item, item.direccion)

export const applyMensajeSelection = (
  host: MensajeSelectionState,
  selection: MensajeSelectionState,
): void => {
  Object.assign(host, selection)
}

export const emptyMensajeSelection = (): MensajeSelectionState => ({
  idMensaje: 0,
  idMensajeRecibido: 0,
  idMensajeEnviado: 0,
  idTarea: 0,
  mensajeDescrip: '',
  mensajeEstado: '',
  mensajeFechaInicio: '',
  mensajeFechaLectura: '',
  mensajeFechaRechazo: ' ',
  mensajeFechaTramitacion: '',
  mensajeRemitente: '',
  mensajeDestinatario: '',
  mensajeDescripcionRechazo: '',
  mensajeExpediente: '',
  mensajeDireccion: '',
  canRechazar: false,
  canTramitar: false,
  hasSeleccion: false,
})
