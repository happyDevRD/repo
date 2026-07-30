/**
 * Cuerpo de error tipado del API iFlow (`BusinessException` / ControllerAdvisor).
 */
export interface ApiErrorBody {
  timestamp?: string
  message?: string
  code?: string
  status?: number
  errors?: string[]
  text?: string
}

export interface ParsedApiError {
  status: number
  code: string | null
  message: string
  body: ApiErrorBody | null
}
