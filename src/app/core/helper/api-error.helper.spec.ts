import { HttpErrorResponse } from '@angular/common/http'
import { apiErrorCode, apiErrorMessage, parseApiError } from './api-error.helper'

describe('api-error.helper', () => {
  it('parsea code y message del body tipado', () => {
    const error = new HttpErrorResponse({
      status: 403,
      error: {
        timestamp: '2026-07-30T12:00:00',
        message: 'El interesado ya existe.',
        code: 'INTERESADO_EXISTENTE',
      },
    })

    const parsed = parseApiError(error)
    expect(parsed.code).toBe('INTERESADO_EXISTENTE')
    expect(parsed.message).toBe('El interesado ya existe.')
    expect(apiErrorCode(error)).toBe('INTERESADO_EXISTENTE')
  })

  it('usa fallback si no hay message', () => {
    const error = new HttpErrorResponse({ status: 500, error: {} })
    expect(apiErrorMessage(error, 'Fallo genérico')).toBe('Fallo genérico')
  })
})
