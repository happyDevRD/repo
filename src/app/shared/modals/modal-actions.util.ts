import { ModalAction } from './modal-action.model'

export function visibleActions(actions: ModalAction[] | null | undefined): ModalAction[] {
  if (!actions?.length) {
    return []
  }
  return actions
    .filter((action) => action.visible !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function hasAction(actions: ModalAction[] | null | undefined, id: string): boolean {
  return !!actions?.some((action) => action.id === id && action.visible !== false)
}

export function setActionVisible(
  actions: ModalAction[],
  id: string,
  visible: boolean,
): ModalAction[] {
  return actions.map((action) =>
    action.id === id ? { ...action, visible } : action,
  )
}

export function hideAllActions(actions: ModalAction[]): ModalAction[] {
  return actions.map((action) => ({ ...action, visible: false }))
}

/**
 * Construye ModalAction[] a partir de defs + mapa id→visible.
 * Útil para migrar flags legacy (veo*) sin reescribir resolvers de golpe.
 */
export function fromVisibilityMap(
  defs: ReadonlyArray<Omit<ModalAction, 'visible'>>,
  visibility: Record<string, boolean>,
): ModalAction[] {
  return defs.map((def) => ({
    ...def,
    visible: !!visibility[def.id],
  }))
}

export function toVisibilityMap(
  actions: ModalAction[],
  ids: readonly string[],
): Record<string, boolean> {
  const map: Record<string, boolean> = {}
  for (const id of ids) {
    map[id] = hasAction(actions, id)
  }
  return map
}
