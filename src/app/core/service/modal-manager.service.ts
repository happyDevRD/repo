import { Injectable } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import * as bootstrap from 'bootstrap'
import { filter } from 'rxjs/operators'
import {
  forceCleanupModalDom,
  forceHideModalElement,
  getVisibleModals,
  reconcileModalDomState,
  removeBootstrapBackdrops,
  setBackdropClickHandler,
  syncManagedBackdrop,
} from './modal-dom.util'

export interface OpenModalOptions {
  stack?: boolean
}

export interface CloseModalOptions {
  onHidden?: () => void
}

const MODAL_CONFIG: bootstrap.Modal.Options = {
  backdrop: false,
  keyboard: false,
  // Evita FocusTrap de Bootstrap sobre nodos aún no estables (p. ej. *ngIf en el body).
  // El foco se gestiona en shown.bs.modal vía focusModalTitle.
  focus: false,
}

const CLOSE_SAFETY_MS = 450

@Injectable({
  providedIn: 'root'
})
export class ModalManagerService {

  private static globalListenersAttached = false
  private static instance: ModalManagerService | null = null
  private activeModals = new Map<string, bootstrap.Modal>()
  /** Elemento que tenía el foco al abrir cada modal (restaurar al cerrar). */
  private modalOpeners = new Map<string, HTMLElement>()

  constructor(private readonly router: Router) {
    ModalManagerService.instance = this
    setBackdropClickHandler(() => this.closeTopModal())
    this.attachGlobalListeners()
    this.attachRouterCleanup()
  }

  static getInstance(): ModalManagerService | null {
    return ModalManagerService.instance
  }

  public openModal(modalId: string, options?: OpenModalOptions): void {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) {
      console.warn(`[ModalManager] Modal no encontrado: ${modalId}`)
      return
    }

    removeBootstrapBackdrops()

    if (!options?.stack) {
      this.hideOtherModals(modalId)
    }

    const active = document.activeElement
    if (active instanceof HTMLElement && !modalElement.contains(active)) {
      this.modalOpeners.set(modalId, active)
    }

    modalElement.style.display = ''
    const modal = this.getManagedInstance(modalElement)
    this.activeModals.set(modalId, modal)
    this.clearFormErrors(modalId)

    const onShown = () => {
      modalElement.removeEventListener('shown.bs.modal', onShown)
      removeBootstrapBackdrops()
      syncManagedBackdrop()
      this.focusModalTitle(modalElement)
    }
    modalElement.addEventListener('shown.bs.modal', onShown)

    try {
      modal.show()
    } catch (err) {
      console.warn(`[ModalManager] Error al abrir ${modalId}`, err)
      this.focusModalTitle(modalElement)
    }
  }

  public closeModal(modalId: string, options?: CloseModalOptions): void {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) {
      this.activeModals.delete(modalId)
      this.modalOpeners.delete(modalId)
      reconcileModalDomState()
      options?.onHidden?.()
      return
    }

    let settled = false
    const finalizeClose = () => {
      if (settled) {
        return
      }
      settled = true
      this.activeModals.delete(modalId)
      forceHideModalElement(modalElement)
      removeBootstrapBackdrops()
      reconcileModalDomState()
      options?.onHidden?.()
      this.restoreOpenerFocus(modalId)
    }

    modalElement.addEventListener('hidden.bs.modal', finalizeClose, { once: true })
    window.setTimeout(finalizeClose, CLOSE_SAFETY_MS)

    const instance = bootstrap.Modal.getInstance(modalElement) ?? this.activeModals.get(modalId)
    if (instance) {
      instance.hide()
      return
    }

    finalizeClose()
  }

  public closeAllModals(): void {
    getVisibleModals().forEach((element) => {
      const instance = bootstrap.Modal.getInstance(element)
      if (instance) {
        instance.hide()
      } else {
        forceHideModalElement(element)
      }
    })
    this.activeModals.clear()
    window.setTimeout(() => this.forceCleanupAll(), CLOSE_SAFETY_MS)
  }

  public forceCleanupAll(): void {
    this.activeModals.forEach((instance) => {
      try {
        instance.dispose()
      } catch {
        /* instancia ya destruida */
      }
    })
    this.activeModals.clear()
    this.modalOpeners.clear()
    forceCleanupModalDom()
  }

  public keepModalOpen(modalId: string): void {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) {
      return
    }

    const modal = this.getManagedInstance(modalElement)

    if (!modalElement.classList.contains('show')) {
      modal.show()
    }

    this.activeModals.set(modalId, modal)
    syncManagedBackdrop()
  }

  public isModalOpen(modalId: string): boolean {
    const modalElement = document.getElementById(modalId)
    return !!modalElement?.classList.contains('show')
  }

  public getActiveModalCount(): number {
    return getVisibleModals().length
  }

  public reconcileModalDomState(): void {
    reconcileModalDomState()
  }

  private attachRouterCleanup(): void {
    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart),
    ).subscribe(() => {
      this.forceCleanupAll()
    })
  }

  private closeTopModal(): void {
    const visible = getVisibleModals()
    const top = visible[visible.length - 1]
    if (!top?.id) {
      return
    }

    if (top.getAttribute('data-bs-backdrop') === 'static') {
      return
    }

    this.closeModal(top.id)
  }

  private getManagedInstance(modalElement: HTMLElement): bootstrap.Modal {
    // Recrear siempre con MODAL_CONFIG: una instancia previa (p. ej. focus:true)
    // hace fallar el FocusTrap de Bootstrap con "Cannot read properties of null (reading 'focus')".
    const existing = bootstrap.Modal.getInstance(modalElement)
    if (existing) {
      try {
        existing.dispose()
      } catch {
        /* instancia ya destruida */
      }
    }
    return new bootstrap.Modal(modalElement, MODAL_CONFIG)
  }

  private attachGlobalListeners(): void {
    if (typeof document === 'undefined' || ModalManagerService.globalListenersAttached) {
      return
    }

    ModalManagerService.globalListenersAttached = true

    document.addEventListener('click', (event) => this.handleModalClick(event), true)

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return
      }
      if (getVisibleModals().length === 0) {
        return
      }
      event.preventDefault()
      this.closeTopModal()
    })

    document.addEventListener('hidden.bs.modal', (event) => {
      const target = event.target
      if (target instanceof HTMLElement && target.id) {
        this.activeModals.delete(target.id)
      }
      window.setTimeout(() => {
        removeBootstrapBackdrops()
        reconcileModalDomState()
      }, 0)
    })

    document.addEventListener('shown.bs.modal', () => {
      window.setTimeout(() => {
        removeBootstrapBackdrops()
        reconcileModalDomState()
      }, 0)
    })
  }

  private handleModalClick(event: Event): void {
    if (!(event.target instanceof Element)) {
      return
    }

    const dismissTrigger = event.target.closest('[data-bs-dismiss="modal"], [iflowModalDismiss]')
    if (dismissTrigger) {
      const modalElement = dismissTrigger.closest('.modal')
      const modalId = dismissTrigger.getAttribute('iflowModalDismiss')
        ?? dismissTrigger.getAttribute('data-modal-id')
        ?? modalElement?.id
      if (modalId) {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal(modalId)
        return
      }
    }

    const toggleTrigger = event.target.closest('[data-bs-toggle="modal"], [iflowModalOpen]')
    if (!toggleTrigger) {
      return
    }

    const explicitId = toggleTrigger.getAttribute('iflowModalOpen')
    const target = toggleTrigger.getAttribute('data-bs-target') ?? toggleTrigger.getAttribute('href')
    const modalId = explicitId ?? (target?.startsWith('#') ? target.slice(1) : target)
    if (!modalId) {
      return
    }

    const stack = toggleTrigger.getAttribute('iflowModalStack') === 'true'

    event.preventDefault()
    event.stopPropagation()
    this.openModal(modalId, { stack })
  }

  private hideOtherModals(exceptModalId: string): void {
    getVisibleModals().forEach((element) => {
      if (element.id === exceptModalId) {
        return
      }
      bootstrap.Modal.getInstance(element)?.hide()
    })
  }

  private clearFormErrors(modalId: string): void {
    const formMap: Record<string, string> = {
      'NprocediModal': 'formProcedimiento',
      'nuevoPermisoModal': 'formNuevoPermiso',
      'EditoAtributosModal': 'formEditarAtributos',
      'NAtributosModal': 'formNuevosAtributos',
      'modifitareasModalListado': 'formModificarTarea',
      'tareasModal': 'formNuevaTarea'
    }

    const formId = formMap[modalId]
    if (!formId) {
      return
    }

    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) {
      return
    }

    form.classList.remove('was-validated')
    // Los modales de edición se rellenan con datos del registro seleccionado
    // ANTES de abrirse; form.reset() los dejaría en blanco (dispara eventos
    // nativos que el ngModel de Angular vuelve a capturar como valor real).
    const prefilledModals = new Set([
      'NprocediModal', 'EditoAtributosModal', 'modifitareasModalListado', 'nuevoPermisoModal',
    ])
    if (!prefilledModals.has(modalId)) {
      form.reset()
    }
  }

  private focusModalTitle(modalElement: HTMLElement): void {
    const title = modalElement.querySelector<HTMLElement>('.modal-title')
    if (!title || typeof title.focus !== 'function') {
      return
    }
    if (!title.hasAttribute('tabindex')) {
      title.setAttribute('tabindex', '-1')
    }
    try {
      title.focus({ preventScroll: true })
    } catch {
      /* elemento no enfocable en este momento */
    }
  }

  private restoreOpenerFocus(modalId: string): void {
    const opener = this.modalOpeners.get(modalId)
    this.modalOpeners.delete(modalId)
    if (!opener || !opener.isConnected || typeof opener.focus !== 'function') {
      return
    }
    if (getVisibleModals().length > 0) {
      return
    }
    window.setTimeout(() => {
      if (opener.isConnected && getVisibleModals().length === 0) {
        try {
          opener.focus({ preventScroll: true })
        } catch {
          /* opener ya no enfocable */
        }
      }
    }, 0)
  }
}
