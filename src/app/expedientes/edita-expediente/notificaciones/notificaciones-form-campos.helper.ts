import { CrearNotificacion } from '../../expedientes';
import { calcularSeleccionNotificacion } from './notificaciones-seleccion.helper';

export type CampoFechaNotificacion =
  | 'fecEnvio'
  | 'fecRecNotif'
  | 'fecRegistSalid'
  | 'fecPubBop';

export function asignarFechaCampoNotificacion(
  creanotificacion: CrearNotificacion,
  campo: CampoFechaNotificacion,
  valor: string,
): void {
  creanotificacion[campo] = !valor || valor === '' ? null : (valor as any);
}

export function actualizarEjercicioDesdeFechaNotificacion(
  creanotificacion: CrearNotificacion,
  fechaFallback: Date,
): void {
  if (creanotificacion.fecNotif) {
    const fechaString = creanotificacion.fecNotif.toString();
    if (fechaString.length >= 4) {
      creanotificacion.ejeNotif = parseInt(fechaString.substring(0, 4), 10);
    } else {
      creanotificacion.ejeNotif = fechaFallback.getFullYear();
    }
  } else {
    creanotificacion.ejeNotif = fechaFallback.getFullYear();
  }
}

export function calcularFechaLimiteDesdePublicacion(fecPubBop: Date | string | null): Date | null {
  if (!fecPubBop) {
    return null;
  }
  const resultado = new Date(fecPubBop);
  resultado.setDate(resultado.getDate() + 15);
  return resultado;
}

export interface ClickNotificacionNuevoHost {
  creanotificacion: CrearNotificacion;
  notificacionver?: {
    ejeNotif: unknown;
    numNotif: unknown;
    fecNotif: unknown;
  };
  fechasNotifi(fenvio: unknown, frecep: unknown, fpubli: unknown, femision: unknown): void;
}

export function aplicarClickNotificacionNuevo(host: ClickNotificacionNuevoHost, rowData: any): void {
  Object.assign(host, calcularSeleccionNotificacion(rowData));
  host.creanotificacion.id = rowData.id;
  host.creanotificacion.observacion = rowData.observacion;
  if (host.notificacionver) {
    host.notificacionver.ejeNotif = rowData.ejeNotif;
    host.notificacionver.numNotif = rowData.numNotif;
    host.notificacionver.fecNotif = rowData.fecNotif;
  }
  host.creanotificacion.fecRecNotif = rowData.fecRecNotif;
  host.creanotificacion.forNotif = 1;
  host.creanotificacion.notificador = rowData.personaEntidad?.numDocum;
  host.fechasNotifi(rowData.fecEnvio, rowData.fecRecNotif, rowData.fecPubBop, rowData.fecEmiBop);
}
