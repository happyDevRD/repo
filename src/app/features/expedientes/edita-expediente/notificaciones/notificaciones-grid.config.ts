import { environment } from 'src/environments/environment';
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types';

export interface NotificacionGridDataField {
  name: string;
  type: string;
}

/** Campos compartidos del jqxGrid de notificaciones (antes duplicados 5 veces). */
export const NOTIFICACION_GRID_DATA_FIELDS: NotificacionGridDataField[] = [
  { name: 'desMotNotif', type: 'string' },
  { name: 'observacion', type: 'string' },
  { name: 'desSituacion', type: 'string' },
  { name: 'fecNotif', type: 'string' },
  { name: 'fecRecNotif', type: 'string' },
  { name: 'personaEntidad', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'ejeNotif', type: 'number' },
  { name: 'idNotif', type: 'number' },
  { name: 'tareaProcedimiento', type: 'string' },
  { name: 'numNotif', type: 'number' },
  { name: 'numDocum', type: 'string' },
  { name: 'desPerEntid', type: 'string' },
  { name: 'fecEnvio', type: 'string' },
  { name: 'numTarea', type: 'string' },
  { name: 'desTramite', type: 'string' },
  { name: 'bop', type: 'number' },
  { name: 'numBop', type: 'number' },
  { name: 'fecEmiBop', type: 'string' },
  { name: 'fecPubBop', type: 'string' },
  { name: 'numEnvioTeu', type: 'string' },
  { name: 'desReceptor', type: 'string' },
  { name: 'desNotificador', type: 'string' },
  { name: 'situacion', type: 'string' },
  { name: 'fecRegistSalid', type: 'string' },
  { name: 'acciones', type: 'string' },
];

export interface NotificacionGridSourceOptions {
  withSort?: boolean;
  withId?: boolean;
}

export function notificacionListarUrl(ejercicio: number, numero: number): string {
  return `${environment.apiUrl}notificacion/listar/${ejercicio}/${numero}`;
}

export function buildNotificacionGridSourceFromLocal(
  localdata: unknown[],
  options: NotificacionGridSourceOptions = {},
): Record<string, unknown> {
  const source: Record<string, unknown> = {
    datatype: 'array',
    dataFields: NOTIFICACION_GRID_DATA_FIELDS,
    localdata,
  };

  if (options.withSort !== false) {
    source['sortcolumn'] = 'numNotif';
    source['sortdirection'] = 'desc';
  }

  if (options.withId) {
    source['id'] = 'id';
  }

  return source;
}

export function buildNotificacionGridSource(
  ejercicio: number,
  numero: number,
  options: NotificacionGridSourceOptions = {},
): Record<string, unknown> {
  const source: Record<string, unknown> = {
    dataType: 'json',
    dataFields: NOTIFICACION_GRID_DATA_FIELDS,
    url: notificacionListarUrl(ejercicio, numero),
  };

  if (options.withSort !== false) {
    source['sortcolumn'] = 'numNotif';
    source['sortdirection'] = 'desc';
  }

  if (options.withId) {
    source['id'] = 'id';
  }

  return source;
}

export function createNotificacionGridAdapter(
  ejercicio: number,
  numero: number,
  options?: NotificacionGridSourceOptions,
): IflowGridSource {
  return new jqx.dataAdapter(buildNotificacionGridSource(ejercicio, numero, options));
}
