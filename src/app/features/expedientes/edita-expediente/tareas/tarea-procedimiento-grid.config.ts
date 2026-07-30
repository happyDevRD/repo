import { environment } from 'src/environments/environment';
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types';

export const TAREA_PROCEDIMIENTO_GRID_DATA_FIELDS = [
  { name: 'descripcion', type: 'string' },
  { name: 'faseTarea', type: 'string' },
  { name: 'plazo', type: 'string' },
  { name: 'tipoPlazo', type: 'string' },
  { name: 'plantillaDefecto', type: 'string' },
  { name: 'usuContr', type: 'string' },
  { name: 'accion', type: 'string' },
];

export function tareaProcedimientoVerUrl(idTareaProcedimiento: number | string): string {
  return `${environment.apiUrl}tareaProcedimiento/ver/${idTareaProcedimiento}`;
}

export function buildTareaProcedimientoGridSource(idTareaProcedimiento: number | string): Record<string, unknown> {
  return {
    dataType: 'json',
    dataFields: TAREA_PROCEDIMIENTO_GRID_DATA_FIELDS,
    url: tareaProcedimientoVerUrl(idTareaProcedimiento),
    id: 'id',
  };
}

export function createTareaProcedimientoGridAdapter(idTareaProcedimiento: number | string): IflowGridSource {
  return new jqx.dataAdapter(buildTareaProcedimientoGridSource(idTareaProcedimiento));
}
