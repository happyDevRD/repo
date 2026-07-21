import { NotificationService } from '../service/notification.service'

/**
 * Valida un formulario HTML5/Bootstrap (checkValidity + was-validated).
 * Si se pasa NotificationService, muestra aviso de campos incompletos.
 */
export const validateBootstrapForm = (
  event: Event,
  notificationService?: NotificationService,
): boolean => {
  const form = event.target as HTMLFormElement
  if (!form) {
    return true
  }
  if (!form.checkValidity()) {
    form.classList.add('was-validated')
    notificationService?.incompleteFields()
    event.preventDefault()
    return false
  }
  return true
}

/** Alias usado en facades de trámites */
export const validarFormularioBootstrap = validateBootstrapForm

export const clearFormValidation = (formId: string): void => {
  const form = document.getElementById(formId) as HTMLFormElement
  if (!form) {
    return
  }
  form.classList.remove('was-validated')
  form.querySelectorAll('.form-control, .form-select').forEach((field) => {
    field.classList.remove('is-invalid', 'is-valid')
  })
}

export const resetForm = (formId: string): void => {
  const form = document.getElementById(formId) as HTMLFormElement
  if (!form) {
    return
  }
  form.classList.remove('was-validated')
  form.querySelectorAll('.form-control, .form-select').forEach((field) => {
    field.classList.remove('is-invalid', 'is-valid')
  })
  form.reset()
}

export const limpiarErroresFormulario = (formId: string, reset = false): void => {
  if (reset) {
    resetForm(formId)
    return
  }
  clearFormValidation(formId)
}
