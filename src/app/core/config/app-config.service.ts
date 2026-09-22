import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { AppConfig } from './app-config.model'
import { applyAppConfig } from './runtime-config'

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private readonly http = inject(HttpClient)

  load(): Promise<void> {
    const url = new URL('assets/config.json', document.baseURI).toString()
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    })

    return firstValueFrom(this.http.get<AppConfig>(url, { headers })).then(
      (config) => {
        this.validate(config)
        applyAppConfig(config)
      },
      (error) => {
        const detail = error?.status ? `HTTP ${error.status}` : String(error)
        throw new Error(
          `No se pudo cargar assets/config.json (${detail}). ` +
            'Edita ese fichero en el despliegue para indicar la URL del API.'
        )
      }
    )
  }

  private validate(config: AppConfig): void {
    if (!config?.apiUrl?.trim() || !config?.apiUrlhttps?.trim()) {
      throw new Error(
        'assets/config.json inválido: apiUrl y apiUrlhttps son obligatorios y no pueden estar vacíos.'
      )
    }
  }
}

export function initAppConfig(configService: AppConfigService): () => Promise<void> {
  return () => configService.load()
}
