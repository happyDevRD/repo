import { ModalManagerService } from '../../../core/service/modal-manager.service'
import { reconcileModalDomState } from '../../../core/service/modal-dom.util'

const MODAL_VER_NOTIFI_ID = 'verNotifiModal'
const MODAL_TEU_ID = 'EnvioTeu'
const MODAL_CREAR_NOTIFI_ID = 'CrearNotificacionModal'

const getModalManager = (): ModalManagerService | null => ModalManagerService.getInstance()

export function limpiarEstadoModalNotificacion(): void {
  getModalManager()?.closeModal(MODAL_VER_NOTIFI_ID)
  reconcileModalDomState()
}

export function abrirModalVerNotificacion(): void {
  getModalManager()?.openModal(MODAL_VER_NOTIFI_ID)
}

export function cerrarModalTeu(onClean: () => void, onDetectChanges: () => void): void {
  onClean()

  const manager = getModalManager()
  if (manager) {
    manager.closeModal(MODAL_TEU_ID, {
      onHidden: () => onDetectChanges()
    })
    return
  }

  reconcileModalDomState()
  onDetectChanges()
}

export function limpiarErroresFormularioTeu(): void {
  document.querySelectorAll('#EnvioTeu .form-control').forEach((element) => {
    const input = element as HTMLElement
    input.classList.remove('is-invalid')
    input.parentElement?.querySelector('.invalid-feedback')?.remove()
  })
}

export function downloadTeuXml(xmlContent: string): void {
  const enlaceDescarga = document.createElement('a')
  enlaceDescarga.href = URL.createObjectURL(new Blob([xmlContent], { type: 'text/xml' }))
  enlaceDescarga.download = 'TEU.xml'
  enlaceDescarga.click()
}

export function limpiarErroresVisualesNotificacion(): void {
  document.querySelectorAll('.is-invalid').forEach((field) => {
    field.classList.remove('is-invalid')
  })
  document.querySelectorAll('.invalid-feedback.d-block').forEach((msg) => msg.remove())
}

function agregarMensajeError(field: HTMLElement, mensaje: string): void {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'invalid-feedback d-block'
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-1"></i>${mensaje}`
  field.parentElement?.appendChild(errorDiv)
}

export function mostrarErroresEnCamposNotificacion(errores: string[]): void {
  limpiarErroresVisualesNotificacion()
  window.setTimeout(() => {
    if (errores.some((e) => e.includes('Estado'))) {
      const field = document.getElementById('situacion') as HTMLSelectElement
      if (field) {
        field.classList.add('is-invalid')
        agregarMensajeError(field, 'Estado de la notificación es requerido')
      }
    }
    if (errores.some((e) => e.includes('Notificador'))) {
      const field = document.getElementById('notificador') as HTMLSelectElement
      if (field) {
        field.classList.add('is-invalid')
        agregarMensajeError(field, 'Notificador es requerido')
      }
    }
    if (errores.some((e) => e.includes('Receptor'))) {
      const field = document.getElementById('receptor') as HTMLSelectElement
      if (field) {
        field.classList.add('is-invalid')
        agregarMensajeError(field, 'Receptor es requerido')
      }
    }
    if (errores.some((e) => e.includes('Motivo'))) {
      const field = document.getElementById('desMotNotif') as HTMLSelectElement
      if (field) {
        field.classList.add('is-invalid')
        agregarMensajeError(field, 'Motivo de notificación es requerido')
      }
    }
    if (errores.some((e) => e.includes('Fecha de recepción'))) {
      const field = document.getElementById('start2') as HTMLInputElement
      if (field) {
        field.classList.add('is-invalid')
        agregarMensajeError(field, 'Fecha de recepción/devolución es requerida')
      }
    }
  }, 100)
}

export function cerrarModalVerNotificacion(onAfterClose?: () => void): void {
  const manager = getModalManager()
  if (manager) {
    manager.closeModal(MODAL_VER_NOTIFI_ID, { onHidden: () => onAfterClose?.() })
    return
  }

  reconcileModalDomState()
  onAfterClose?.()
}

export function abrirModalEnviarNotificacion(): void {
  getModalManager()?.openModal('EnvioNotifi')
}

export function limpiarBackdropModal(): void {
  reconcileModalDomState()
}

export function cerrarModalCrearNotificacion(
  onLimpiarFormulario: () => void,
  onDetectChanges?: () => void,
  onCerrarModalFallback?: (modalId: string) => void,
): void {
  try {
    const manager = getModalManager()
    if (manager) {
      manager.closeModal(MODAL_CREAR_NOTIFI_ID, {
        onHidden: () => {
          onLimpiarFormulario()
          onDetectChanges?.()
        }
      })
      return
    }

    onCerrarModalFallback?.(MODAL_CREAR_NOTIFI_ID)
    reconcileModalDomState()
    onLimpiarFormulario()
    onDetectChanges?.()
  } catch (error) {
    console.error('Error al cerrar el modal:', error)
    reconcileModalDomState()
    onLimpiarFormulario()
  }
}

export function onModalHiddenBootstrap(onDetectChanges?: () => void): void {
  window.setTimeout(() => {
    reconcileModalDomState()
    onDetectChanges?.()
  }, 100)
}

export function limpiarEstadoModalCrearNotificacion(
  onLimpiarFormulario: () => void,
  onDetectChanges?: () => void,
  onCerrarModalFallback?: (modalId: string) => void,
): void {
  cerrarModalCrearNotificacion(onLimpiarFormulario, onDetectChanges, onCerrarModalFallback)
}
