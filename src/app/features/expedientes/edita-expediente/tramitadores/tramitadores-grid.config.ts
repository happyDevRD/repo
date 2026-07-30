import { environment } from 'src/environments/environment';
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types';

export const TRAMITADOR_GRID_DATA_FIELDS = [
  { name: 'fecAsignacion', type: 'string' },
  { name: 'estadoTramitacion', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'posesion', type: 'string' },
];

export function tramitadorListarUrl(idExpediente: number): string {
  return `${environment.apiUrl}tramitador/listar/${idExpediente}`;
}

export function buildTramitadorGridSource(idExpediente: number): Record<string, unknown> {
  return {
    dataType: 'json',
    dataFields: TRAMITADOR_GRID_DATA_FIELDS,
    url: tramitadorListarUrl(idExpediente),
    id: 'id',
  };
}

export function createTramitadorGridAdapter(idExpediente: number): IflowGridSource {
  return new jqx.dataAdapter(buildTramitadorGridSource(idExpediente));
}
