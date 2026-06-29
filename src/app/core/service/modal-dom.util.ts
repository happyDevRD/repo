export const MODAL_Z_BASE = 1055
export const MODAL_Z_STEP = 20

let managedBackdrop: HTMLElement | null = null
let backdropClickHandler: (() => void) | null = null

export const setBackdropClickHandler = (handler: (() => void) | null): void => {
  backdropClickHandler = handler
}

export const removeAllBackdrops = (): void => {
  if (typeof document === 'undefined') {
    return
  }
  document.querySelectorAll('.modal-backdrop').forEach((element) => element.remove())
}

export const removeBootstrapBackdrops = (): void => {
  removeAllBackdrops()
}

export const getVisibleModals = (): HTMLElement[] => {
  if (typeof document === 'undefined') {
    return []
  }

  return Array.from(document.querySelectorAll('.modal.show')).filter((element) => {
    const modal = element as HTMLElement
    if (modal.style.display === 'none') {
      return false
    }
    const style = window.getComputedStyle(modal)
    return style.display !== 'none' && style.visibility !== 'hidden'
  }) as HTMLElement[]
}

export const clearBodyModalState = (): void => {
  if (typeof document === 'undefined') {
    return
  }
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')
  document.body.style.removeProperty('position')
}

export const syncManagedBackdrop = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  removeBootstrapBackdrops()

  const visibleModals = getVisibleModals()

  if (visibleModals.length === 0) {
    managedBackdrop?.remove()
    managedBackdrop = null
    clearBodyModalState()
    return
  }

  if (!managedBackdrop) {
    managedBackdrop = document.createElement('div')
    managedBackdrop.className = 'modal-backdrop fade show iflow-managed-backdrop'
    managedBackdrop.addEventListener('click', () => backdropClickHandler?.())
    document.body.appendChild(managedBackdrop)
  }

  if (!document.body.classList.contains('modal-open')) {
    document.body.classList.add('modal-open')
  }

  visibleModals.forEach((modal, index) => {
    const modalZ = MODAL_Z_BASE + index * MODAL_Z_STEP + 10
    modal.style.zIndex = String(modalZ)
  })

  const backdropZ = MODAL_Z_BASE + (visibleModals.length - 1) * MODAL_Z_STEP
  managedBackdrop.style.zIndex = String(backdropZ)
}

export const reconcileModalDomState = (): void => {
  syncManagedBackdrop()
}

export const forceHideModalElement = (modalElement: HTMLElement): void => {
  modalElement.classList.remove('show')
  modalElement.style.display = 'none'
  modalElement.setAttribute('aria-hidden', 'true')
  modalElement.removeAttribute('aria-modal')
  modalElement.removeAttribute('role')
}

export const forceCleanupModalDom = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.querySelectorAll('.modal.show').forEach((element) => {
    forceHideModalElement(element as HTMLElement)
  })
  managedBackdrop?.remove()
  managedBackdrop = null
  removeAllBackdrops()
  clearBodyModalState()
}
