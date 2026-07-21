import { Injectable } from '@angular/core';
import { NotificationService } from '../../../core/service/notification.service';

@Injectable()
export class EditaExpedienteUiFacade {
  constructor(private readonly notificationService: NotificationService) {}

  validateAndSubmit(event: Event, formId: string, submitFunction: () => void): void {
    event.preventDefault();

    const form = document.getElementById(formId) as HTMLFormElement;
    if (form?.checkValidity()) {
      submitFunction();
      return;
    }

    this.notificationService.incompleteFields();
    form?.classList.add('was-validated');
  }

  handleValidationError(fieldName: string): void {
    this.notificationService.validationError(fieldName);
  }

  confirmDelete(itemName: string, deleteFunction: () => void): void {
    this.notificationService.confirmDelete(itemName).then((result) => {
      if (result.isConfirmed) {
        deleteFunction();
      }
    });
  }

  showWarning(message: string): void {
    this.notificationService.warning(message);
  }

  showInfo(message: string): void {
    this.notificationService.info(message);
  }

  formatearFechaParaInput(fecha: unknown): string {
    if (!fecha) {
      return '';
    }

    try {
      const fechaObj = new Date(fecha as string | number | Date);
      if (isNaN(fechaObj.getTime())) {
        return '';
      }
      return fechaObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  limpiarTodosLosFormularios(): void {
    const formIds = [
      'formNuevaTarea',
      'formNuevoTramite',
      'formNuevaNotificacion',
      'formEditarTarea',
      'formEditarTramite',
      'formEditarNotificacion',
      'formGenerarSalida',
      'formInsertarBolsa',
      'formTEU',
    ];

    formIds.forEach((formId) => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (!form) {
        return;
      }
      form.classList.remove('was-validated');
      form.reset();
    });
  }

  limpiarErroresValidacion(): void {
    document.querySelectorAll('.error-message').forEach((element) => element.remove());
    document.querySelectorAll('.form-control.is-invalid').forEach((element) => {
      element.classList.remove('is-invalid');
    });
  }
}
