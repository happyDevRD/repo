import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalManagerService {

  private activeModals: Map<string, bootstrap.Modal> = new Map();

  /**
   * Abre un modal de manera segura
   */
  public openModal(modalId: string): void {
    // Cerrar cualquier modal activo antes de abrir uno nuevo
    this.closeAllModals();
    
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      
      this.activeModals.set(modalId, modal);
      modal.show();
      
      // Limpiar errores del formulario
      this.clearFormErrors(modalId);
    }
  }

  /**
   * Cierra un modal específico
   */
  public closeModal(modalId: string): void {
    const modal = this.activeModals.get(modalId);
    if (modal) {
      modal.hide();
      this.activeModals.delete(modalId);
    }
    
    // También intentar cerrar usando el elemento DOM
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
    
    // Limpiar clases de Bootstrap que puedan quedar
    this.cleanupModalClasses(modalId);
  }

  /**
   * Cierra todos los modales activos
   */
  public closeAllModals(): void {
    this.activeModals.forEach((modal, modalId) => {
      modal.hide();
      this.cleanupModalClasses(modalId);
    });
    this.activeModals.clear();
    
    // Limpiar todas las clases de modal que puedan quedar
    document.body.classList.remove('modal-open');
    const backdropElements = document.querySelectorAll('.modal-backdrop');
    backdropElements.forEach(element => element.remove());
  }

  /**
   * Mantiene un modal abierto (para casos de error)
   */
  public keepModalOpen(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Asegurar que el modal permanezca visible
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // Asegurar que el backdrop esté presente
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }

  /**
   * Limpia errores de validación de un formulario específico
   */
  private clearFormErrors(modalId: string): void {
    const formMap: { [key: string]: string } = {
      'NprocediModal': 'formNuevoProcedimiento',
      'editarProcedimientoModal': 'formEditarProcedimiento',
      'nuevoPermisoModal': 'formNuevoPermiso',
      'EditoAtributosModal': 'formEditarAtributos',
      'NAtributosModal': 'formNuevosAtributos',
      'modifitareasModalListado': 'formModificarTarea',
      'tareasModal': 'formNuevaTarea'
    };

    const formId = formMap[modalId];
    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.classList.remove('was-validated');
        form.reset();
      }
    }
  }

  /**
   * Limpia todas las clases de Bootstrap que puedan quedar
   */
  private cleanupModalClasses(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
    
    // Limpiar backdrop
    const backdropElements = document.querySelectorAll('.modal-backdrop');
    backdropElements.forEach(element => element.remove());
    
    // Limpiar clase del body
    document.body.classList.remove('modal-open');
  }

  /**
   * Verifica si un modal está abierto
   */
  public isModalOpen(modalId: string): boolean {
    return this.activeModals.has(modalId);
  }

  /**
   * Obtiene el número de modales activos
   */
  public getActiveModalCount(): number {
    return this.activeModals.size;
  }
} 