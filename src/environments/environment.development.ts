export const environment = {
  production: false,
  apiUrl: 'http://localhost:8091/api/gos/',
  apiUrlhttps: 'http://localhost:8091/api/gos/',



  entidad: `Greenaall`,

  // iconos
  inicio: 'inicio.svg',
  editar: 'editar3.svg',
  asignar: 'asignar.svg',
  rechazar: 'rechazar.svg',
  iniciar: 'iniciar2.svg',
  papelera: 'papelera2.svg',

  //iconos NAV
  escudo: 'escudo.png',
  titulo: 'Gestor de Expedientes iFlow',
  mensajes: 'mensaje.svg',
  // mensajes: 'mensajeBis.svg',
  solicitudes: 'solicitudes.svg',
  expedientes: 'expedientes.svg',
  procedimientos: 'procedimientos.svg',
  salir: 'Salida.svg',

  /**
   * INSIDE — demo / sin REDSARA: dryRun=true (mock SOAP vía proxy backend).
   * Cutover REDSARA: dryRun=false + application.properties inside.soap.dry-run=false
   * + credenciales mTLS. Ver INSIDE_CUTOVER_REDSARA_STEPS en inside-simulacion.constants.ts
   */
  inside: {
    insideWsUrl: 'https://se-e-inside.redsara.es/inside/services/InsideWSService',
    gInsideWsUrl: 'https://se-e-inside.redsara.es/inside/services/GInsideWSService',
    puntoRemisionWsUrl: 'https://se-e-inside.redsara.es/inside/services/PuntoRemisionWebService',
    useBackendProxy: true,
    dryRun: true,
    ofrecerEnvioTrasCierre: true,
    autoEnvioOnClose: false,
  },
};
