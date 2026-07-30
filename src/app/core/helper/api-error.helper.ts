import { HttpErrorResponse } from '@angular/common/http'
import { ApiErrorBody, ParsedApiError } from '../models/api-error.model'

const DEFAULT_MESSAGE = 'Ha ocurrido un error. Inténtelo de nuevo.'

function asApiErrorBody(value: unknown): ApiErrorBody | null {
  if (value == null) {
    return null
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? { message: trimmed } : null
  }
  if (typeof value !== 'object') {
    return null
  }
  return value as ApiErrorBody
}

/** Extrae código + mensaje consumibles por NotificationService. */
export function parseApiError(
  error: HttpErrorResponse,
  fallbackMessage = DEFAULT_MESSAGE,
): ParsedApiError {
  const body = asApiErrorBody(error.error)
  const fromBody = body?.message?.trim()
  const fromText = body?.text?.trim()
  const message = fromBody || fromText || fallbackMessage

  return {
    status: error.status,
    code: body?.code?.trim() || null,
    message,
    body,
  }
}

export function apiErrorMessage(
  error: HttpErrorResponse,
  fallbackMessage = DEFAULT_MESSAGE,
): string {
  return parseApiError(error, fallbackMessage).message
}

export function apiErrorCode(error: HttpErrorResponse): string | null {
  return parseApiError(error).code
}
