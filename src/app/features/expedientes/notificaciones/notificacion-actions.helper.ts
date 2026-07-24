import { ModalAction } from '../../../shared/modals/modal-action.model'
import { fromVisibilityMap, hideAllActions } from '../../../shared/modals/modal-actions.util'
import { NotificacionBotonesVisibles } from './notificacion-estado.helper'

/** IDs estables de acciones de notificación (toolbar / modales). */
export const NOTIFICACION_ACTION_IDS = [
  'teu',
  'reenviarTeu',
  'enviarNotifica',
  'sincronizar',
  'enviar',
  'recepcionar',
  'devolver',
  'publicar',
  'anular',
  'ver',
  'borrar',
  'descargaTeu',
] as const

export type NotificacionActionId = (typeof NOTIFICACION_ACTION_IDS)[number]

export const NOTIFICACION_ACTION_DEFS: ReadonlyArray<Omit<ModalAction, 'visible'>> = [
  { id: 'teu', label: 'Enviar T.E.U.', icon: 'bi bi-envelope-arrow-up', tone: 'primary', order: 10, title: 'Enviar T.E.U.' },
  { id: 'reenviarTeu', label: 'Reenviar T.E.U.', icon: 'bi bi-envelope-arrow-up', tone: 'primary', order: 11, title: 'Reenviar T.E.U.' },
  { id: 'enviarNotifica', label: 'Enviar a Notifica', icon: 'bi bi-envelope-arrow-up', tone: 'primary', order: 20, title: 'Enviar a Notifica' },
  { id: 'sincronizar', label: 'Sincronizar Notifica', icon: 'bi bi-arrow-repeat', tone: 'primary', order: 21, title: 'Sincronizar con Notifica' },
  { id: 'enviar', label: 'Enviar', icon: 'bi bi-send', tone: 'primary', order: 30, title: 'Enviar Notificación' },
  { id: 'recepcionar', label: 'Recepcionar', icon: 'bi bi-inbox-arrow-down', tone: 'primary', order: 40, title: 'Recepcionar Notificación' },
  { id: 'devolver', label: 'Devolver', icon: 'bi bi-arrow-return-left', tone: 'primary', order: 50, title: 'Devolver Notificación' },
  { id: 'publicar', label: 'Publicar', icon: 'bi bi-newspaper', tone: 'primary', order: 60, title: 'Publicar Notificación' },
  { id: 'anular', label: 'Anular', icon: 'bi bi-ban', tone: 'primary', order: 70, title: 'Anular Notificación' },
  { id: 'ver', label: 'Ver', icon: 'bi bi-eye', tone: 'primary', order: 80, title: 'Ver Notificación' },
  { id: 'borrar', label: 'Borrar', icon: 'bi bi-trash', tone: 'primary', order: 90, title: 'Borrar Notificación' },
  { id: 'descargaTeu', label: 'Descargar TEU', icon: 'bi bi-cloud-arrow-down', tone: 'primary', order: 100, title: 'Descargar Fichero TEU' },
]

const FLAG_TO_ACTION_ID: Record<keyof NotificacionBotonesVisibles, NotificacionActionId> = {
  veoteu: 'teu',
  veoReenviarTeu: 'reenviarTeu',
  veoEnviarNotifica: 'enviarNotifica',
  veoSincronizarNotifica: 'sincronizar',
  veoenviar: 'enviar',
  veorecepcionar: 'recepcionar',
  veodevolver: 'devolver',
  veopublicar: 'publicar',
  veoanular: 'anular',
  veoborrar: 'borrar',
  mostrarBotonDescargaTEUPrincipal: 'descargaTeu',
}

export function visibilityMapFromBotones(
  botones: NotificacionBotonesVisibles,
  options?: { includeVer?: boolean },
): Record<string, boolean> {
  const map: Record<string, boolean> = {}
  for (const [flag, actionId] of Object.entries(FLAG_TO_ACTION_ID) as Array<
    [keyof NotificacionBotonesVisibles, NotificacionActionId]
  >) {
    map[actionId] = !!botones[flag]
  }
  // "Ver" siempre disponible cuando hay selección (toolbar lo controla con idNotificacion).
  map['ver'] = options?.includeVer !== false
  return map
}

export function resolveNotificacionActions(
  botones: NotificacionBotonesVisibles,
  options?: { includeVer?: boolean },
): ModalAction[] {
  return fromVisibilityMap(
    NOTIFICACION_ACTION_DEFS,
    visibilityMapFromBotones(botones, options),
  )
}

export function emptyNotificacionActions(): ModalAction[] {
  return hideAllActions(
    NOTIFICACION_ACTION_DEFS.map((def) => ({ ...def, visible: false })),
  )
}

export function pickBotonesVisibles(
  estado: Partial<NotificacionBotonesVisibles>,
): NotificacionBotonesVisibles {
  return {
    veoenviar: !!estado.veoenviar,
    veoEnviarNotifica: !!estado.veoEnviarNotifica,
    veoSincronizarNotifica: !!estado.veoSincronizarNotifica,
    veoanular: !!estado.veoanular,
    veoborrar: !!estado.veoborrar,
    veorecepcionar: !!estado.veorecepcionar,
    veodevolver: !!estado.veodevolver,
    veopublicar: !!estado.veopublicar,
    veoteu: !!estado.veoteu,
    veoReenviarTeu: !!estado.veoReenviarTeu,
    mostrarBotonDescargaTEUPrincipal: !!estado.mostrarBotonDescargaTEUPrincipal,
  }
}
