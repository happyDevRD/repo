import { environment } from 'src/environments/environment';

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
  { name: 'tareaProcedimiento', type: 'any' },
  { name: 'numNotif', type: 'number' },
  { name: 'numDocum', type: 'any' },
  { name: 'desPerEntid', type: 'any' },
  { name: 'fecEnvio', type: 'string' },
  { name: 'numTarea', type: 'any' },
  { name: 'desTramite', type: 'any' },
  { name: 'bop', type: 'any' },
  { name: 'numBop', type: 'any' },
  { name: 'fecEmiBop', type: 'any' },
  { name: 'fecPubBop', type: 'any' },
  { name: 'numEnvioTeu', type: 'any' },
  { name: 'desReceptor', type: 'any' },
  { name: 'desNotificador', type: 'any' },
  { name: 'situacion', type: 'any' },
  { name: 'fecRegistSalid', type: 'any' },
  { name: 'acciones', type: 'any' },
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
): any {
  return new jqx.dataAdapter(buildNotificacionGridSource(ejercicio, numero, options));
}
