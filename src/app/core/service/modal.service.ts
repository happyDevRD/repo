import { Injectable } from '@angular/core'
import { ModalManagerService } from './modal-manager.service'

/**
 * @deprecated Usar ModalManagerService directamente.
 * Este servicio delega en ModalManagerService para compatibilidad con código legacy.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private readonly modalManager: ModalManagerService) {}

  closeOtherModals(currentModalId: string): void {
    document.querySelectorAll('.modal.show').forEach((modalEl) => {
      if (modalEl.id !== currentModalId && modalEl.id) {
        this.modalManager.closeModal(modalEl.id)
      }
    })
  }

  openModal(modalId: string): void {
    this.modalManager.openModal(modalId)
  }

  closeModal(modalId: string): void {
    this.modalManager.closeModal(modalId)
  }
}
