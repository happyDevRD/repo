export interface MensajeRowData {
  id: number
  fecEnvio?: string
  fecRechazo?: string
  fecTramitacion?: string
  fecLectura?: string
  descripcionRechazo?: string
  estado?: string
  nomRemit?: string
  nomDesti?: string
  descripcion?: string
  idTarea?: number
  idExped?: string
  informativo?: boolean
}

export type MensajeDireccion = 'recibido' | 'enviado'
export type MensajeFiltroDireccion = 'todos' | MensajeDireccion
export type MensajeFiltroEstado = 'TODOS' | 'PENDIENTE' | 'LEIDO' | 'TRAMITANDO' | 'RECHAZADO'

export interface MensajeInboxItem extends MensajeRowData {
  direccion: MensajeDireccion
  key: string
}

export interface MensajeSelectionState {
  idMensaje: number
  idMensajeRecibido: number
  idMensajeEnviado: number
  idTarea: number
  mensajeDescrip: string
  mensajeEstado: string
  mensajeFechaInicio: string
  mensajeFechaLectura: string
  mensajeFechaRechazo: string
  mensajeFechaTramitacion: string
  mensajeRemitente: string
  mensajeDestinatario: string
  mensajeDescripcionRechazo: string
  mensajeExpediente: string
  mensajeDireccion: MensajeDireccion | ''
  canRechazar: boolean
  canTramitar: boolean
  hasSeleccion: boolean
}

export const ACCIONABLE_ESTADOS = ['PENDIENTE', 'LEIDO'] as const

export const isMensajeAccionable = (estado?: string): boolean =>
  ACCIONABLE_ESTADOS.includes((estado ?? '') as (typeof ACCIONABLE_ESTADOS)[number])

export const MENSAJE_ESTADO_FILTROS: { value: MensajeFiltroEstado; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'LEIDO', label: 'Leídos' },
  { value: 'TRAMITANDO', label: 'Tramitando' },
  { value: 'RECHAZADO', label: 'Rechazados' },
]
