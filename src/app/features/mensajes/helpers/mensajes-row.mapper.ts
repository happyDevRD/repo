import { formatIsoDateToDisplay } from './mensajes-date.helper'
import { isMensajeAccionable, MensajeRowData, MensajeSelectionState } from '../models/mensajes.models'
import {
  applyMensajeSelection,
  emptyMensajeSelection,
  mapInboxItemToSelection,
} from './mensajes-inbox.helper'

/** @deprecated Preferir mensajes-inbox.helper */
export const mapRecibidosRowToSelection = (row: MensajeRowData): MensajeSelectionState => {
  const estado = row.estado ?? ''
  return {
    idMensaje: row.id,
    idMensajeRecibido: row.id,
    idMensajeEnviado: row.id,
    idTarea: row.idTarea ?? 0,
    mensajeDescrip: row.descripcion ?? '',
    mensajeEstado: estado,
    mensajeFechaInicio: formatIsoDateToDisplay(row.fecEnvio),
    mensajeFechaLectura: formatIsoDateToDisplay(row.fecLectura),
    mensajeFechaRechazo: formatIsoDateToDisplay(row.fecRechazo, ' '),
    mensajeFechaTramitacion: formatIsoDateToDisplay(row.fecTramitacion),
    mensajeRemitente: row.nomRemit ?? '',
    mensajeDestinatario: row.nomDesti ?? '',
    mensajeDescripcionRechazo: row.descripcionRechazo ?? '',
    mensajeExpediente: row.idExped ?? '',
    mensajeDireccion: 'recibido',
    canRechazar: isMensajeAccionable(estado),
    canTramitar: isMensajeAccionable(estado),
    hasSeleccion: true,
  }
}

/** @deprecated Preferir mensajes-inbox.helper */
export const mapEnviadosRowToSelection = (row: MensajeRowData): MensajeSelectionState => ({
  ...mapRecibidosRowToSelection(row),
  mensajeDireccion: 'enviado',
  canRechazar: false,
  canTramitar: false,
})

export {
  applyMensajeSelection,
  emptyMensajeSelection,
  mapInboxItemToSelection,
}
