import { ModalAction } from '../../../../shared/modals/modal-action.model'
import {
  botonesPorEstadoNotificacion,
  NotificacionBotonesVisibles,
  resolverEstadoNotificacion,
} from '../../notificaciones/notificacion-estado.helper'
import { resolveNotificacionActions } from '../../notificaciones/notificacion-actions.helper'
import { PersonaEntidadDto } from '../../../../core/models/expediente.dto'

/** Fila del grid jqx de notificaciones (campos de NotificacionDto + descripciones). */
export interface NotificacionGridRow {
  id?: number
  idNotif: number
  ejeNotif: number
  numNotif: number
  fecNotif?: string | Date | null
  fecEnvio?: string | Date | null
  fecRecNotif?: string | Date | null
  fecPubBop?: string | Date | null
  fecEmiBop?: string | Date | null
  desSituacion?: string | null
  situacion?: number | string | null
  desSituacionNotif?: string | null
  desMotNotif?: string | null
  desReceptor?: string | null
  desNotificador?: string | null
  observacion?: string | null
  numEnvioTeu?: string | number | null
  notificador?: number | null
  personaEntidad?: Pick<PersonaEntidadDto, 'desPerEntid' | 'numDocum'> | null
}

export interface NotificacionFilaResumen {
  descargoTEU: boolean
  fechaenvioTEU?: string
  /** Fecha envío cruda del grid (ISO o Date). */
  fechaprueba: string | Date | null
  situacion: string | number | null
  /** Descripción de motivo (desMotNotif del DTO). */
  motNotif: string | null
  /** Descripción de receptor. */
  receptor: string | null
  /** Descripción de notificador. */
  notificador: string | null
  verInfoNotifi: boolean
  desMotNotif: string | null
  desPerEntidNotifi: string
  dniNotifi: string
  ejerNotifi: number | string | null
  numeroNotifi: number | string | null
  idNotificacion: number
  observacionNotifi: string | null
  desSituacion: string
  fechNotifi?: string
}

export type NotificacionSeleccionEstado = NotificacionFilaResumen & NotificacionBotonesVisibles & {
  actions: ModalAction[]
}

function tieneNumeroTeu(rowData: Pick<NotificacionGridRow, 'numEnvioTeu'>): boolean {
  return !!(
    rowData.numEnvioTeu &&
    (typeof rowData.numEnvioTeu === 'string'
      ? rowData.numEnvioTeu.trim() !== ''
      : rowData.numEnvioTeu > 0)
  )
}

function botonesDevuelta(rowData: Pick<NotificacionGridRow, 'numEnvioTeu'>): NotificacionBotonesVisibles {
  if (!tieneNumeroTeu(rowData)) {
    return {
      veoenviar: false,
      veoEnviarNotifica: false,
      veoSincronizarNotifica: false,
      veoanular: true,
      veoborrar: false,
      veorecepcionar: false,
      veodevolver: false,
      veopublicar: false,
      veoteu: true,
      veoReenviarTeu: false,
      mostrarBotonDescargaTEUPrincipal: false,
    }
  }
  return {
    veoenviar: false,
    veoEnviarNotifica: false,
    veoSincronizarNotifica: false,
    veoanular: true,
    veoborrar: false,
    veorecepcionar: false,
    veodevolver: false,
    veopublicar: true,
    veoteu: false,
    veoReenviarTeu: true,
    mostrarBotonDescargaTEUPrincipal: true,
  }
}

function formatearFechaNotif(fecNotif: string | Date | null | undefined): string | undefined {
  if (!fecNotif) {
    return undefined
  }
  const raw = typeof fecNotif === 'string' ? fecNotif : fecNotif.toISOString()
  const anio = raw.substring(0, 4)
  const mes = raw.substring(5, 7)
  const dia = raw.substring(8, 10)
  return `${dia}/${mes}/${anio}`
}

function fechaIsoCorta(valor: string | Date | null | undefined): string | undefined {
  if (!valor) {
    return undefined
  }
  const raw = typeof valor === 'string' ? valor : valor.toISOString()
  return raw.substring(0, 10)
}

/** Calcula el estado de UI al seleccionar una fila del grid de notificaciones. */
export function calcularSeleccionNotificacion(rowData: NotificacionGridRow): NotificacionSeleccionEstado {
  const estadoNotificacion =
    rowData.desSituacion || rowData.situacion || rowData.desSituacionNotif || null
  const estadoString = resolverEstadoNotificacion(estadoNotificacion)

  const botones =
    estadoString === 'DEVUELTA'
      ? botonesDevuelta(rowData)
      : botonesPorEstadoNotificacion(estadoString, rowData)

  return {
    descargoTEU: false,
    fechaenvioTEU: fechaIsoCorta(rowData.fecEmiBop),
    fechaprueba: rowData.fecEnvio ?? null,
    situacion: estadoNotificacion,
    motNotif: rowData.desMotNotif ?? null,
    receptor: rowData.desReceptor ?? null,
    notificador: rowData.desNotificador ?? null,
    verInfoNotifi: true,
    desMotNotif: rowData.desMotNotif ?? null,
    desPerEntidNotifi: rowData.personaEntidad?.desPerEntid || '',
    dniNotifi: rowData.personaEntidad?.numDocum || '',
    ejerNotifi: rowData.ejeNotif,
    numeroNotifi: rowData.numNotif,
    idNotificacion: rowData.idNotif,
    observacionNotifi: rowData.observacion ?? null,
    desSituacion: estadoString,
    fechNotifi: formatearFechaNotif(rowData.fecNotif),
    ...botones,
    actions: resolveNotificacionActions(botones),
  }
}
