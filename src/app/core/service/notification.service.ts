import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import { apiErrorMessage, parseApiError } from '../helper/api-error.helper'

export interface NotificationOptions {
  title?: string
  text?: string
  html?: string
  footer?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
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
        reverseButtons: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ffffff',
      })
    }

    return this.fire({
      title: options.title || 'Confirmar',
      text: options.text,
      html: options.html,
      icon: options.icon || 'question',
      showCancelButton: options.showCancelButton !== false,
      reverseButtons: true,
      confirmButtonText: options.confirmButtonText || 'Sí',
      cancelButtonText: options.cancelButtonText || 'No',
      confirmButtonColor: options.confirmButtonColor || '#3085d6',
      cancelButtonColor: '#ffffff',
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
   * Muestra un error tipado del API ({@code code} + {@code message}).
   * Preferir frente a mensajes genéricos cuando el backend envía BusinessException.
   */
  fromHttpError(
    error: HttpErrorResponse,
    fallbackMessage = 'Ha ocurrido un error. Inténtelo de nuevo.',
  ): Promise<SweetAlertResult> {
    const parsed = parseApiError(error, fallbackMessage)
    return this.error({
      title: 'Error',
      text: parsed.message,
      footer: parsed.code ? `Código: ${parsed.code}` : undefined,
    })
  }

  /**
   * Atajo: solo el mensaje del API (sin footer de código).
   */
  apiError(
    error: HttpErrorResponse,
    fallbackMessage = 'Ha ocurrido un error. Inténtelo de nuevo.',
  ): Promise<SweetAlertResult> {
    return this.error(apiErrorMessage(error, fallbackMessage))
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
      reverseButtons: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#ffffff',
    })
  }

  private fire(options: SweetAlertOptions): Promise<SweetAlertResult> {
    const userDidOpen = options.didOpen

    // Varios métodos de este servicio (success/warning/custom) siempre incluyen la
    // clave `position` en el objeto que arman, aunque el llamador no la especifique
    // (queda como `position: undefined`). SweetAlert2 combina esos parámetros con
    // sus valores por defecto igual que Object.assign: una clave presente con valor
    // `undefined` PISA el default `position: 'center'` dejándolo en `undefined`, y
    // el popup pierde la clase `swal2-center` — termina renderizado en la esquina
    // superior izquierda en vez de centrado. Se filtran las claves `undefined` para
    // que SweetAlert2 aplique sus propios valores por defecto en esos casos.
    const cleanedOptions = Object.fromEntries(
      Object.entries(options).filter(([, value]) => value !== undefined),
    ) as SweetAlertOptions

    return Swal.fire({
      ...cleanedOptions,
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
