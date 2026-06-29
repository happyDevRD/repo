const TITULO_TRAMITE_PANEL_ID = 'tramite';

export function setTituloPanelTramite(texto: string): void {
  const elemento = document.getElementById(TITULO_TRAMITE_PANEL_ID);
  if (elemento) {
    elemento.innerHTML = texto;
  }
}

export interface PanelTramitadoresHost {
  botonVerNotifi: boolean;
  vertramite: boolean;
  nuevotramite: boolean;
  verTareasdelTramite: boolean;
  verAccionesdeTarea: boolean;
  veonotificaciones: boolean;
  veoTramitadores: boolean;
  recargarSourceTramitadores(): void;
}

export function aplicarVistaTramitadores(host: PanelTramitadoresHost): void {
  setTituloPanelTramite('Tramitadores');
  host.botonVerNotifi = false;
  host.vertramite = false;
  host.nuevotramite = false;
  host.verTareasdelTramite = false;
  host.verAccionesdeTarea = false;
  host.veonotificaciones = false;
  host.veoTramitadores = true;
  host.recargarSourceTramitadores();
}

export interface PanelNotificacionesHost {
  botonVerNotifi: boolean;
  vertramite: boolean;
  nuevotramite: boolean;
  verTareasdelTramite: boolean;
  verAccionesdeTarea: boolean;
  veonotificaciones: boolean;
  verInfoNotifi: boolean;
  idNotificacion: number;
  verExpediente: { ejercicio: number; numero: number };
  sourceListarNotifi: unknown;
}

export function aplicarVistaNotificaciones(
  host: PanelNotificacionesHost,
  crearGrid: (ejercicio: number, numero: number) => unknown,
): void {
  setTituloPanelTramite('Notificaciones');
  host.botonVerNotifi = false;
  host.vertramite = false;
  host.nuevotramite = false;
  host.verTareasdelTramite = false;
  host.verAccionesdeTarea = false;
  host.veonotificaciones = true;
  host.verInfoNotifi = false;
  host.idNotificacion = 0;

  setTimeout(() => {
    host.sourceListarNotifi = crearGrid(host.verExpediente.ejercicio, host.verExpediente.numero);
  }, 500);
}

export interface PanelTramiteHost {
  veoTramitadores: boolean;
  botonVerNotifi: boolean;
  vertramite: boolean;
  nuevotramite: boolean;
  verInfoNotifi: boolean;
  verTareasdelTramite: boolean;
  verAccionesdeTarea: boolean;
  veonotificaciones: boolean;
}

export function aplicarVistaTramite(host: PanelTramiteHost): void {
  setTituloPanelTramite('Trámite');
  host.veoTramitadores = false;
  host.botonVerNotifi = true;
  host.vertramite = true;
  host.nuevotramite = false;
  host.verInfoNotifi = false;
  host.verTareasdelTramite = false;
  host.verAccionesdeTarea = true;
  host.veonotificaciones = false;
}
