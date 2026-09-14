import { ModalAction } from '../../../../shared/modals/modal-action.model'
import { fromVisibilityMap } from '../../../../shared/modals/modal-actions.util'

/** Contexto UI de la toolbar de trámites (flags legacy). */
export interface TramiteToolbarContext {
  botonVerNotifi: boolean
  vertramite: boolean
  verasignatramite: boolean
}

export const TRAMITE_ACTION_IDS = ['nuevoTramite', 'borrarTramite'] as const

export type TramiteActionId = (typeof TRAMITE_ACTION_IDS)[number]

const TRAMITE_ACTION_DEFS: ReadonlyArray<Omit<ModalAction, 'visible'>> = [
  {
    id: 'nuevoTramite',
    label: 'Nuevo trámite',
    icon: 'bi bi-plus-lg',
    tone: 'primary',
    order: 1,
    title: 'Nuevo Trámite',
  },
  {
    id: 'borrarTramite',
    label: 'Borrar trámite',
    icon: 'bi bi-trash',
    tone: 'danger',
    order: 2,
    title: 'Borrar Trámite',
  },
]

export function resolveTramiteToolbarActions(ctx: TramiteToolbarContext): ModalAction[] {
  const enListado = !!(ctx.botonVerNotifi && ctx.vertramite)
  return fromVisibilityMap(TRAMITE_ACTION_DEFS, {
    nuevoTramite: enListado,
    borrarTramite: !!(enListado && ctx.verasignatramite),
  })
}
