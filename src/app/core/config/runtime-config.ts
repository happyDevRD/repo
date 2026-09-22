import { AppConfig } from './app-config.model'

/**
 * Store mutable rellenado por APP_INITIALIZER antes del bootstrap.
 * Los getters de environment leen de aquí para no romper usos existentes
 * de environment.apiUrl / apiUrlhttps.
 */
export const runtimeConfig: AppConfig = {
  apiUrl: '',
  apiUrlhttps: '',
}

export function normalizeApiUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) {
    return trimmed
  }
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

export function applyAppConfig(config: AppConfig): void {
  runtimeConfig.apiUrl = normalizeApiUrl(config.apiUrl)
  runtimeConfig.apiUrlhttps = normalizeApiUrl(config.apiUrlhttps)
}
