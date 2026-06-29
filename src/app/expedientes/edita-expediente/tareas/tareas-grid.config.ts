import { environment } from 'src/environments/environment';

export const TAREA_GRID_DATA_FIELDS = [
  { name: 'numero', type: 'number' },
  { name: 'descripcion', type: 'string' },
  { name: 'fecInicio', type: 'string' },
  { name: 'fecFin', type: 'string' },
  { name: 'propuestaResolucion', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'firmado', type: 'string' },
  { name: 'fecPlazo', type: 'string' },
  { name: 'color', type: 'string' },
  { name: 'archivo', type: 'string' },
  { name: 'tareaProcedimiento', type: 'any' },
  { name: 'id', type: 'any' },
  { name: 'tipAnexo', type: 'any' },
  { name: 'docAport', type: 'any' },
  { name: 'tipDocEni', type: 'any' },
  { name: 'documentacion', type: 'any' },
  { name: 'visible', type: 'any' },
  { name: 'numRegis', type: 'any' },
  { name: 'idHisDocum', type: 'any' },
  { name: 'ejeNumNotif', type: 'any' },
  { name: 'nombreArchivo', type: 'any' },
  { name: 'idAnunc', type: 'any' },
];

export interface TareaGridSourceOptions {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export function tareaListarUrl(idTramite: number): string {
  return `${environment.apiUrl}tareaTramiteExpediente/listar/${idTramite}`;
}

export function buildTareaGridSourceFromLocal(
  localdata: unknown[],
  options: TareaGridSourceOptions = {},
): Record<string, unknown> {
  const source: Record<string, unknown> = {
    datatype: 'array',
    dataFields: TAREA_GRID_DATA_FIELDS,
    localdata,
    id: 'id',
  };

  if (options.sortColumn) {
    source['sortcolumn'] = options.sortColumn;
    source['sortdirection'] = options.sortDirection ?? 'desc';
  }

  return source;
}

export function buildTareaGridSource(
  idTramite: number,
  options: TareaGridSourceOptions = {},
): Record<string, unknown> {
  const source: Record<string, unknown> = {
    dataType: 'json',
    dataFields: TAREA_GRID_DATA_FIELDS,
    url: tareaListarUrl(idTramite),
    id: 'id',
  };

  if (options.sortColumn) {
    source['sortcolumn'] = options.sortColumn;
    source['sortdirection'] = options.sortDirection ?? 'desc';
  }

  return source;
}

export function createTareaGridAdapter(
  idTramite: number,
  options?: TareaGridSourceOptions,
): any {
  return new jqx.dataAdapter(buildTareaGridSource(idTramite, options));
}
