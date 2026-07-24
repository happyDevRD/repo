import { Injectable } from '@angular/core'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

export interface NotificationOptions {
  title?: string
  text?: string
  html?: string
  footer?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
  showConfirmButton?: boolean
  showCloseButton?: boolean
  focusConfirm?: boolean
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  allowOutsideClick?: boolean
  allowEscapeKey?: boolean
  timer?: number
  timerProgressBar?: boolean
  didOpen?: () => void
  showClass?: { popup?: string }
  hideClass?: { popup?: string }
  width?: string | number
}

/** Por encima de modales iFlow (base 1055 + stacks) */
const SWAL_Z_INDEX = '20000'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Muestra una notificación de éxito
   */
  success(options: NotificationOptions | string): Promise<SweetAlertResult> {
    if (typeof options === 'string') {
      return this.fire({
        title: '¡Éxito!',
        text: options,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      })
    }

    return this.fire({
      title: options.title || '¡Éxito!',
      text: options.text,
      html: options.html,
      icon: options.icon || 'success',
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
      position: options.position,
      showConfirmButton: options.showConfirmButton,
      didOpen: options.didOpen,
    })
  }

  /**
   * Muestra una notificación de error
   */
  error(options: NotificationOptions | string): Promise<SweetAlertResult> {
    if (typeof options === 'string') {
      return this.fire({
        title: 'Error',
        text: options,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      })
    }

    return this.fire({
      title: options.title || 'Error',
      text: options.text,
      html: options.html,
      footer: options.footer,
      icon: options.icon || 'error',
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      confirmButtonColor: '#d33',
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
      didOpen: options.didOpen,
    })
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(options: NotificationOptions | string): Promise<SweetAlertResult> {
    if (typeof options === 'string') {
      return this.fire({
        title: 'Advertencia',
        text: options,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f39c12',
      })
    }

    return this.fire({
      title: options.title || 'Advertencia',
      text: options.text,
      html: options.html,
      icon: options.icon || 'warning',
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      confirmButtonColor: '#f39c12',
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
      position: options.position,
      showConfirmButton: options.showConfirmButton,
      didOpen: options.didOpen,
    })
  }

  /**
   * Muestra una notificación de información
   */
  info(options: NotificationOptions | string): Promise<SweetAlertResult> {
    if (typeof options === 'string') {
      return this.fire({
        title: 'Información',
        text: options,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#17a2b8',
      })
    }

    return this.fire({
      title: options.title || 'Información',
      text: options.text,
      html: options.html,
      icon: options.icon || 'info',
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      confirmButtonColor: '#17a2b8',
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
      didOpen: options.didOpen,
    })
  }

  /**
   * Muestra una confirmación con botones Sí/No
   */
  confirm(options: NotificationOptions | string): Promise<SweetAlertResult> {
    if (typeof options === 'string') {
      return this.fire({
        title: 'Confirmar',
        text: options,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
      })
    }

    return this.fire({
      title: options.title || 'Confirmar',
      text: options.text,
      html: options.html,
      icon: options.icon || 'question',
      showCancelButton: options.showCancelButton !== false,
      confirmButtonText: options.confirmButtonText || 'Sí',
      cancelButtonText: options.cancelButtonText || 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      didOpen: options.didOpen,
    })
  }

  /**
   * Muestra una notificación totalmente personalizada, para casos no cubiertos
   * por los métodos anteriores (p.ej. modales de progreso sin icono, con html
   * propio o que controlan manualmente el cierre mediante `close()`).
   */
  custom(options: NotificationOptions): Promise<SweetAlertResult> {
    return this.fire({
      title: options.title,
      text: options.text,
      html: options.html,
      icon: options.icon,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      footer: options.footer,
      showCancelButton: options.showCancelButton,
      showConfirmButton: options.showConfirmButton,
      showCloseButton: options.showCloseButton,
      focusConfirm: options.focusConfirm,
      position: options.position,
      allowOutsideClick: options.allowOutsideClick,
      allowEscapeKey: options.allowEscapeKey,
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
      didOpen: options.didOpen,
      showClass: options.showClass,
      hideClass: options.hideClass,
      width: options.width,
    })
  }

  /**
   * Cierra cualquier notificación abierta (p.ej. un modal de progreso mostrado con `custom()`).
   */
  close(): void {
    Swal.close()
  }

  /**
   * Muestra el spinner de carga dentro de la notificación actualmente abierta
   * (uso típico: `didOpen: () => this.notificationService.showLoading()`).
   */
  showLoading(): void {
    Swal.showLoading()
  }

  /**
   * Muestra una notificación de campos incompletos (específica para formularios)
   */
  incompleteFields(message?: string): Promise<SweetAlertResult> {
    return this.fire({
      title: 'Campos incompletos',
      text: message || 'Por favor, complete todos los campos obligatorios.',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f39c12',
    })
  }

  /**
   * Muestra una notificación de campos incompletos con validación visual
   */
  incompleteFieldsWithValidation(message?: string): Promise<SweetAlertResult> {
    return this.fire({
      title: 'Campos incompletos',
      text: message || 'Por favor, complete todos los campos obligatorios.',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f39c12',
    })
  }

  /**
   * Muestra una notificación de validación de formulario
   */
  validationError(fieldName?: string): Promise<SweetAlertResult> {
    const message = fieldName
      ? `Por favor, verifique el campo: ${fieldName}`
      : 'Por favor, verifique los datos ingresados.'

    return this.fire({
      title: 'Error de validación',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33',
    })
  }

  /**
   * Muestra una notificación de guardado exitoso
   */
  saveSuccess(entityName?: string): Promise<SweetAlertResult> {
    const message = entityName
      ? `${entityName} guardado exitosamente.`
      : 'Datos guardados exitosamente.'

    return this.fire({
      title: '¡Guardado!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: 2000,
      timerProgressBar: true,
    })
  }

  /**
   * Muestra una notificación de eliminación exitosa
   */
  deleteSuccess(entityName?: string): Promise<SweetAlertResult> {
    const message = entityName
      ? `${entityName} eliminado exitosamente.`
      : 'Elemento eliminado exitosamente.'

    return this.fire({
      title: '¡Eliminado!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: 2000,
      timerProgressBar: true,
    })
  }

  /**
   * Muestra una confirmación de eliminación
   */
  confirmDelete(entityName?: string): Promise<SweetAlertResult> {
    const message = entityName
      ? `¿Está seguro de que desea eliminar este ${entityName}?`
      : '¿Está seguro de que desea eliminar este elemento?'

    return this.fire({
      title: 'Confirmar eliminación',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    })
  }

  private fire(options: SweetAlertOptions): Promise<SweetAlertResult> {
    const userDidOpen = options.didOpen
    return Swal.fire({
      ...options,
      didOpen: (popup) => {
        const container = document.querySelector('.swal2-container') as HTMLElement | null
        if (container) {
          container.style.zIndex = SWAL_Z_INDEX
        }
        userDidOpen?.(popup)
      },
    })
  }
}
