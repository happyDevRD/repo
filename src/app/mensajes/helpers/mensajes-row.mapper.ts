import { formatIsoDateToDisplay } from './mensajes-date.helper';
import { MensajeRowData, MensajeSelectionState } from '../models/mensajes.models';

export const mapRecibidosRowToSelection = (row: MensajeRowData): MensajeSelectionState => {
  const estado = row.estado ?? '';
  const veorechaTRami = estado !== 'TRAMITANDO';
  const veoRecha = estado !== 'RECHAZADO';

  let mensajeFechaRechazo = formatIsoDateToDisplay(row.fecRechazo, '');
  if (!row.fecRechazo && estado !== 'RECHAZADO') {
    mensajeFechaRechazo = ' ';
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
    veoRecha,
    veorechaTRami,
  };
};

export const mapEnviadosRowToSelection = (row: MensajeRowData): MensajeSelectionState => ({
  idMensaje: row.id,
  idMensajeRecibido: row.id,
  idMensajeEnviado: row.id,
  idTarea: row.idTarea ?? 0,
  mensajeDescrip: row.descripcion ?? '',
  mensajeEstado: row.estado ?? '',
  mensajeFechaInicio: formatIsoDateToDisplay(row.fecEnvio),
  mensajeFechaLectura: formatIsoDateToDisplay(row.fecLectura),
  mensajeFechaRechazo: formatIsoDateToDisplay(row.fecRechazo),
  mensajeFechaTramitacion: formatIsoDateToDisplay(row.fecTramitacion),
  mensajeRemitente: row.nomRemit ?? '',
  mensajeDestinatario: row.nomDesti ?? '',
  mensajeDescripcionRechazo: row.descripcionRechazo ?? '',
  veoRecha: false,
  veorechaTRami: false,
});

export const mapVerModalRowToSelection = (row: MensajeRowData): MensajeSelectionState => ({
  ...mapRecibidosRowToSelection(row),
  veoRecha: true,
  veorechaTRami: true,
});

export const applyMensajeSelection = (
  host: MensajeSelectionState,
  selection: MensajeSelectionState,
): void => {
  Object.assign(host, selection);
};
