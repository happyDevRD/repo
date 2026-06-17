import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  /**
   * Cierra todos los modales que estén abiertos, excepto el que tenga el id pasado.
   */
  closeOtherModals(currentModalId: string): void {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modalEl => {
      if (modalEl.id !== currentModalId) {
        // Obtenemos la instancia del modal o la creamos si no existe
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }
    });
  }

  /**
   * Abre el modal con el id indicado, cerrando los demás.
   */
  openModal(modalId: string): void {
    this.closeOtherModals(modalId);
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Eliminamos cualquier estilo inline que pueda forzar el display
      modalElement.removeAttribute('style');
      // Creamos la instancia del modal con backdrop estático para evitar cierres accidentales
      const modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modalInstance.show();
    } else {
      console.error(`No se encontró el modal con ID '${modalId}'`);
    }
  }

  /**
   * Cierra el modal con el id indicado de manera segura.
   */
  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Método simple y directo: simular clic en botón de cerrar
      const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
        return;
      }
      
      // Si no hay botón de cerrar, usar Bootstrap API
      try {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          const newModal = new bootstrap.Modal(modalElement);
          newModal.hide();
        }
      } catch (error) {
        console.error('Error cerrando modal:', error);
        // Fallback: limpieza manual
        modalElement.style.display = 'none';
        modalElement.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }
  }
}
