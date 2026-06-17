export interface NotificacionBotonesVisibles {
  veoenviar: boolean;
  veoEnviarNotifica: boolean;
  veoSincronizarNotifica: boolean;
  veoanular: boolean;
  veoborrar: boolean;
  veorecepcionar: boolean;
  veodevolver: boolean;
  veopublicar: boolean;
  veoteu: boolean;
  veoReenviarTeu: boolean;
  mostrarBotonDescargaTEUPrincipal: boolean;
}

export function obtenerEstadoPorCodigo(codigo: number | string): string {
  const n = typeof codigo === 'string' ? parseInt(codigo, 10) : codigo;
  switch (n) {
    case 1: return 'GENERADA';
    case 2: return 'ENVIADA';
    case 3: return 'RECEPCIONADA';
    case 4: return 'DEVUELTA';
    case 5: return 'COBRADA';
    case 6: return 'ANULADA';
    case 7: return 'NOTIFICA_GENERADA';
    case 8: return 'NOTIFICA_ENVIADA';
    case 9: return 'CADUCADA';
    case 10: return 'RECHAZADA';
    default: return 'DESCONOCIDO';
  }
}

export function resolverEstadoNotificacion(estado: number | string | undefined): string {
  if (estado === undefined || estado === null) {
    return 'DESCONOCIDO';
  }
  return typeof estado === 'number' ? obtenerEstadoPorCodigo(estado) : String(estado);
}

function tieneNumeroTeu(rowData: { numEnvioTeu?: string | number }): boolean {
  return !!(rowData.numEnvioTeu &&
    (typeof rowData.numEnvioTeu === 'string' ? rowData.numEnvioTeu.trim() !== '' : rowData.numEnvioTeu > 0));
}

export function botonesPorEstadoNotificacion(
  estadoString: string,
  rowData: { numEnvioTeu?: string | number }
): NotificacionBotonesVisibles {
  const base: NotificacionBotonesVisibles = {
    veoenviar: false,
    veoEnviarNotifica: false,
    veoSincronizarNotifica: false,
    veoanular: false,
    veoborrar: false,
    veorecepcionar: false,
    veodevolver: false,
    veopublicar: false,
    veoteu: false,
    veoReenviarTeu: false,
    mostrarBotonDescargaTEUPrincipal: false
  };

  switch (estadoString) {
    case 'GENERADA':
      return {
        ...base,
        veoenviar: true,
        veoEnviarNotifica: true,
        veoanular: true,
        mostrarBotonDescargaTEUPrincipal: tieneNumeroTeu(rowData)
      };
    case 'ENVIADA':
      return {
        ...base,
        veoanular: true,
        veorecepcionar: true,
        veodevolver: true,
        mostrarBotonDescargaTEUPrincipal: tieneNumeroTeu(rowData)
      };
    case 'RECEPCIONADA':
    case 'DEVUELTA':
    case 'COBRADA':
    case 'ANULADA':
    case 'CADUCADA':
    case 'RECHAZADA':
      return base;
    case 'NOTIFICA_GENERADA':
    case 'NOTIFICA_ENVIADA':
      return {
        ...base,
        veoSincronizarNotifica: true
      };
    default:
      return base;
  }
}
