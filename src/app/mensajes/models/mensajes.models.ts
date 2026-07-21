export interface MensajeRowData {
  id: number;
  fecEnvio?: string;
  fecRechazo?: string;
  fecTramitacion?: string;
  fecLectura?: string;
  descripcionRechazo?: string;
  estado?: string;
  nomRemit?: string;
  nomDesti?: string;
  descripcion?: string;
  idTarea?: number;
}

export interface MensajeSelectionState {
  idMensaje: number;
  idMensajeRecibido: number;
  idMensajeEnviado: number;
  idTarea: number;
  mensajeDescrip: string;
  mensajeEstado: string;
  mensajeFechaInicio: string;
  mensajeFechaLectura: string;
  mensajeFechaRechazo: string;
  mensajeFechaTramitacion: string;
  mensajeRemitente: string;
  mensajeDestinatario: string;
  mensajeDescripcionRechazo: string;
  veoRecha: boolean;
  veorechaTRami: boolean;
}
