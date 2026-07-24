import { LeerMensajeRecibidos } from '../models'

export interface MensajesEstadoCounts {
  pendientes: number
  tramitados: number
  rechazados: number
}

export const countMensajesByEstado = (mensajes: LeerMensajeRecibidos[] | null | undefined): MensajesEstadoCounts => {
  const counts: MensajesEstadoCounts = { pendientes: 0, tramitados: 0, rechazados: 0 }
  if (!mensajes?.length) {
    return counts
  }
  mensajes.forEach((mensaje) => {
    if (mensaje.estado === 'PENDIENTE') {
      counts.pendientes++
    } else if (mensaje.estado === 'TRAMITANDO') {
      counts.tramitados++
    } else if (mensaje.estado === 'RECHAZADO') {
      counts.rechazados++
    }
  })
  return counts
}
