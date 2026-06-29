import {
  botonesPorEstadoNotificacion,
  NotificacionBotonesVisibles,
  resolverEstadoNotificacion,
} from '../../notificaciones/notificacion-estado.helper';

export interface NotificacionFilaResumen {
  descargoTEU: boolean;
  fechaenvioTEU?: string;
  fechaprueba: unknown;
  situacion: unknown;
  motNotif: unknown;
  receptor: unknown;
  notificador: unknown;
  verInfoNotifi: boolean;
  desMotNotif: unknown;
  desPerEntidNotifi: string;
  dniNotifi: string;
  ejerNotifi: unknown;
  numeroNotifi: unknown;
  idNotificacion: number;
  observacionNotifi: unknown;
  desSituacion: string;
  fechNotifi?: string;
}

export type NotificacionSeleccionEstado = NotificacionFilaResumen & NotificacionBotonesVisibles;

function tieneNumeroTeu(rowData: { numEnvioTeu?: string | number }): boolean {
  return !!(
    rowData.numEnvioTeu &&
    (typeof rowData.numEnvioTeu === 'string'
      ? rowData.numEnvioTeu.trim() !== ''
      : rowData.numEnvioTeu > 0)
  );
}

function botonesDevuelta(rowData: { numEnvioTeu?: string | number }): NotificacionBotonesVisibles {
  if (!tieneNumeroTeu(rowData)) {
    return {
      veoenviar: false,
      veoEnviarNotifica: false,
      veoSincronizarNotifica: false,
      veoanular: true,
      veoborrar: false,
      veorecepcionar: false,
      veodevolver: false,
      veopublicar: false,
      veoteu: true,
      veoReenviarTeu: false,
      mostrarBotonDescargaTEUPrincipal: false,
    };
  }
  return {
    veoenviar: false,
    veoEnviarNotifica: false,
    veoSincronizarNotifica: false,
    veoanular: true,
    veoborrar: false,
    veorecepcionar: false,
    veodevolver: false,
    veopublicar: true,
    veoteu: false,
    veoReenviarTeu: true,
    mostrarBotonDescargaTEUPrincipal: true,
  };
}

function formatearFechaNotif(fecNotif: unknown): string | undefined {
  if (!fecNotif) {
    return undefined;
  }
  const raw = fecNotif.toString();
  const anio = raw.substring(0, 4);
  const mes = raw.substring(5, 7);
  const dia = raw.substring(8, 10);
  return `${dia}/${mes}/${anio}`;
}

/** Calcula el estado de UI al seleccionar una fila del grid de notificaciones. */
export function calcularSeleccionNotificacion(rowData: any): NotificacionSeleccionEstado {
  const estadoNotificacion =
    rowData.desSituacion || rowData.situacion || rowData.desSituacionNotif;
  const estadoString = resolverEstadoNotificacion(estadoNotificacion);

  const botones =
    estadoString === 'DEVUELTA'
      ? botonesDevuelta(rowData)
      : botonesPorEstadoNotificacion(estadoString, rowData);

  return {
    descargoTEU: false,
    fechaenvioTEU: rowData.fecEmiBop ? rowData.fecEmiBop.substring(0, 10) : undefined,
    fechaprueba: rowData.fecEnvio,
    situacion: estadoNotificacion,
    motNotif: rowData.desMotNotif,
    receptor: rowData.desReceptor,
    notificador: rowData.desNotificador,
    verInfoNotifi: true,
    desMotNotif: rowData.desMotNotif,
    desPerEntidNotifi: rowData.personaEntidad?.desPerEntid || '',
    dniNotifi: rowData.personaEntidad?.numDocum || '',
    ejerNotifi: rowData.ejeNotif,
    numeroNotifi: rowData.numNotif,
    idNotificacion: rowData.idNotif,
    observacionNotifi: rowData.observacion,
    desSituacion: estadoString,
    fechNotifi: formatearFechaNotif(rowData.fecNotif),
    ...botones,
  };
}
