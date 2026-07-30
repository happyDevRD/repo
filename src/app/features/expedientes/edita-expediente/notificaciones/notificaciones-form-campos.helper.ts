import { CrearNotificacion } from '../../expedientes'
import {
  calcularSeleccionNotificacion,
  NotificacionGridRow,
  NotificacionSeleccionEstado,
} from './notificaciones-seleccion.helper'

export type CampoFechaNotificacion =
  | 'fecEnvio'
  | 'fecRecNotif'
  | 'fecRegistSalid'
  | 'fecPubBop'

export function asignarFechaCampoNotificacion(
  creanotificacion: CrearNotificacion,
  campo: CampoFechaNotificacion,
  valor: string,
): void {
  creanotificacion[campo] = !valor || valor === '' ? null : valor
}

export function actualizarEjercicioDesdeFechaNotificacion(
  creanotificacion: CrearNotificacion,
  fechaFallback: Date,
): void {
  if (creanotificacion.fecNotif) {
    const fechaString = creanotificacion.fecNotif.toString()
    if (fechaString.length >= 4) {
      creanotificacion.ejeNotif = parseInt(fechaString.substring(0, 4), 10)
    } else {
      creanotificacion.ejeNotif = fechaFallback.getFullYear()
    }
  } else {
    creanotificacion.ejeNotif = fechaFallback.getFullYear()
  }
}

export function calcularFechaLimiteDesdePublicacion(fecPubBop: Date | string | null): Date | null {
  if (!fecPubBop) {
    return null
  }
  const resultado = new Date(fecPubBop)
  resultado.setDate(resultado.getDate() + 15)
  return resultado
}

export type FechaNotificacionInput = string | Date | null | undefined

export interface ClickNotificacionNuevoHost {
  creanotificacion: CrearNotificacion
  notificacionver?: {
    ejeNotif: number | string | null
    numNotif: number | string | null
    fecNotif: string | Date | null
  }
  notifUiFacade: {
    applySeleccionEstado(estado: NotificacionSeleccionEstado): void
  }
  idNotificacion: number
  descargoTEU: boolean
  desSituacion: string
  fechasNotifi(
    fenvio: FechaNotificacionInput,
    frecep: FechaNotificacionInput,
    fpubli: FechaNotificacionInput,
    femision: FechaNotificacionInput,
  ): void
}

export function aplicarClickNotificacionNuevo(
  host: ClickNotificacionNuevoHost,
  rowData: NotificacionGridRow,
): void {
  const estado = calcularSeleccionNotificacion(rowData)
  host.notifUiFacade.applySeleccionEstado(estado)
  host.idNotificacion = estado.idNotificacion
  host.descargoTEU = estado.descargoTEU
  host.desSituacion = estado.desSituacion
  host.creanotificacion.id = rowData.id ?? rowData.idNotif
  host.creanotificacion.observacion = rowData.observacion ?? ''
  if (host.notificacionver) {
    host.notificacionver.ejeNotif = rowData.ejeNotif
    host.notificacionver.numNotif = rowData.numNotif
    host.notificacionver.fecNotif = rowData.fecNotif ?? null
  }
  host.creanotificacion.fecRecNotif = rowData.fecRecNotif ?? null
  host.creanotificacion.forNotif = 1
  // Histórico: el form usa notificador con el DNI del interesado en algunos flujos
  host.creanotificacion.notificador = rowData.personaEntidad?.numDocum ?? 0
  host.fechasNotifi(rowData.fecEnvio, rowData.fecRecNotif, rowData.fecPubBop, rowData.fecEmiBop)
}
