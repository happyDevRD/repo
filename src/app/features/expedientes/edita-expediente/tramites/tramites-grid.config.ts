import { environment } from 'src/environments/environment';

export const TRAMITE_GRID_DATA_FIELDS = [
  { name: 'numero', type: 'number' },
  { name: 'descripcion', type: 'string' },
  { name: 'fase', type: 'string' },
  { name: 'fecTramite', type: 'string' },
  { name: 'fecContr', type: 'string' },
  { name: 'usuContr', type: 'string' },
  { name: 'id', type: 'any' },
];

export function tramiteListarUrl(idExpediente: number): string {
  return `${environment.apiUrl}tramite/listar/${idExpediente}`;
}

export function buildTramiteGridSource(idExpediente: number): Record<string, unknown> {
  return {
    dataType: 'json',
    dataFields: TRAMITE_GRID_DATA_FIELDS,
    url: tramiteListarUrl(idExpediente),
    id: 'id',
  };
}

export function createTramiteGridAdapter(idExpediente: number): any {
  return new jqx.dataAdapter(buildTramiteGridSource(idExpediente));
}
