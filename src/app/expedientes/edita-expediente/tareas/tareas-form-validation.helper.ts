import { clearFormValidation } from '../../../core/helper/bootstrap-form.helper'

export const limpiarErroresNuevaTareaForm = (): void => {
  clearFormValidation('formNuevaTarea')
}

export const validarTareaProcedimientoCampo = (event: Event): void => {
  const select = event.target as HTMLSelectElement
  const form = select.closest('form')
  if (!form?.classList.contains('was-validated')) {
    return
  }
  if (!select.value) {
    select.classList.add('is-invalid')
    select.classList.remove('is-valid')
  } else {
    select.classList.remove('is-invalid')
    select.classList.add('is-valid')
  }
}

export const validarCampoFormularioTarea = (event: Event, _campoId: string): void => {
  const campo = event.target as HTMLInputElement | HTMLSelectElement
  const valor = campo.value.trim()
  const form = campo.closest('form')
  if (!form?.classList.contains('was-validated')) {
    return
  }

  if (valor) {
    campo.classList.remove('is-invalid')
    campo.classList.add('is-valid')
  } else {
    campo.classList.add('is-invalid')
    campo.classList.remove('is-valid')
  }
}

export const validarFormularioNuevaTarea = (event: Event): boolean => {
  const form = event.target as HTMLFormElement
  form.classList.add('was-validated')

  const tareaProcedimientoSelect = form.querySelector('#tprocedi2') as HTMLSelectElement
  if (tareaProcedimientoSelect) {
    if (!tareaProcedimientoSelect.value) {
      tareaProcedimientoSelect.classList.add('is-invalid')
      tareaProcedimientoSelect.classList.remove('is-valid')
    } else {
      tareaProcedimientoSelect.classList.remove('is-invalid')
      tareaProcedimientoSelect.classList.add('is-valid')
    }
  }

  const descripcionInput = form.querySelector('#descriptara') as HTMLInputElement
  if (descripcionInput) {
    const descripcionValue = descripcionInput.value.trim()
    if (!descripcionValue) {
      descripcionInput.classList.add('is-invalid')
      descripcionInput.classList.remove('is-valid')
    } else {
      descripcionInput.classList.remove('is-invalid')
      descripcionInput.classList.add('is-valid')
    }
  }

  const fechaInput = form.querySelector('#start') as HTMLInputElement
  if (fechaInput) {
    if (!fechaInput.value) {
      fechaInput.classList.add('is-invalid')
      fechaInput.classList.remove('is-valid')
    } else {
      fechaInput.classList.remove('is-invalid')
      fechaInput.classList.add('is-valid')
    }
  }

  return form.querySelectorAll('.is-invalid').length === 0
}
