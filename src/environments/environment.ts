import { runtimeConfig } from '../app/core/config/runtime-config'

/**
 * Entorno de producción / build por defecto.
 * apiUrl / apiUrlhttps se cargan en runtime desde assets/config.json (APP_INITIALIZER).
 * Editar dist/.../assets/config.json tras el despliegue; no hace falta recompilar.
 */
export const environment = {
  production: true,

  get apiUrl(): string {
    return runtimeConfig.apiUrl
  },

  get apiUrlhttps(): string {
    return runtimeConfig.apiUrlhttps
  },

  entidad: `Greenaall`,

  // iconos
  inicio: 'inicio.svg',
  editar: 'editar3.svg',
  asignar: 'asignar.svg',
  rechazar: 'rechazar.svg',
  iniciar: 'iniciar2.svg',
  papelera: 'papelera2.svg',

  // iconos NAV
  escudo: 'escudo.png',
  titulo: 'Gestor de Expedientes iFlow',
  mensajes: 'mensaje.svg',
  solicitudes: 'solicitudes.svg',
  expedientes: 'expedientes.svg',
  procedimientos: 'procedimientos.svg',
  salir: 'Salida.svg',

  /**
   * INSIDE producción: dryRun=false cuando haya REDSARA.
   * Mantener dryRun=true en builds de presentación sin red SARA.
   * Checklist cutover: INSIDE_CUTOVER_REDSARA_STEPS (inside-simulacion.constants.ts)
   */
  inside: {
    insideWsUrl: 'https://se-e-inside.redsara.es/inside/services/InsideWSService',
    gInsideWsUrl: 'https://se-e-inside.redsara.es/inside/services/GInsideWSService',
    puntoRemisionWsUrl: 'https://se-e-inside.redsara.es/inside/services/PuntoRemisionWebService',
    useBackendProxy: true,
    dryRun: false,
    ofrecerEnvioTrasCierre: true,
    autoEnvioOnClose: false,
  },
}
