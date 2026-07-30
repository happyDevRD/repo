import { environment } from 'src/environments/environment';
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types';

export const HISTORICO_GRID_DATA_FIELDS = [
  { name: 'fecTarea', type: 'string' },
  { name: 'archivo', type: 'string' },
  { name: 'desArchi', type: 'string' },
  { name: 'idTarea', type: 'string' },
  { name: 'numTarea', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'desIndic', type: 'string' },
  { name: 'desTarea', type: 'string' },
  { name: 'id', type: 'string' },
  { name: 'usuContr', type: 'string' },
  { name: 'descarga', type: 'string' },
];

export function historicoListarUrl(idTarea: number | string): string {
  return `${environment.apiUrl}tareaHistoricoTramiteExpediente/listarPorTarea/${idTarea}`;
}

export function buildHistoricoGridSource(idTarea: number | string): Record<string, unknown> {
  return {
    dataType: 'json',
    dataFields: HISTORICO_GRID_DATA_FIELDS,
    url: historicoListarUrl(idTarea),
    id: 'id',
  };
}

export function createHistoricoGridAdapter(idTarea?: number | string | null): IflowGridSource {
  if (idTarea == null || idTarea === '' || idTarea === 0) {
    return new jqx.dataAdapter({
      dataType: 'json',
      dataFields: HISTORICO_GRID_DATA_FIELDS,
      localdata: [],
      id: 'id',
    });
  }

  return new jqx.dataAdapter(buildHistoricoGridSource(idTarea));
}
