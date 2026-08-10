import { environment } from 'src/environments/environment'
import { IflowGridCellsRenderer, IflowGridColumns, IflowGridSource } from './iflow-grid.types'

/** Campos del grid "Representantes" (id/idPerso/idHisPerso/desPerEntid/dirPosta), igual en todas las features que lo listan. */
const REPRESENTANTE_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'idPerso', type: 'any' },
  { name: 'idHisPerso', type: 'any' },
  { name: 'desPerEntid', type: 'any' },
  { name: 'dirPosta', type: 'any' },
]

export interface RepresentanteGridRenderers {
  columnseleccion: IflowGridCellsRenderer
  columnrenderer: IflowGridCellsRenderer
  cellsrendererRepre: IflowGridCellsRenderer
}

/**
 * Columnas del grid "Representantes" (selección + Nombre + Dirección),
 * reutilizadas por Solicitudes y Expedientes — antes duplicadas byte a byte
 * en `solicitudes-grid.config.ts` y `expedientes-grid.config.ts`.
 */
export const buildRepresentanteGridColumns = (renderers: RepresentanteGridRenderers): IflowGridColumns => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'idPerso', datafield: 'idPerso', width: '1%', hidden: true },
  { text: 'idHisPerso', datafield: 'idHisPerso', width: '1%', hidden: true },
  { text: '', datafield: '', width: '1%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'Nombre', datafield: 'desPerEntid', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
  { text: 'Dirección', datafield: 'dirPosta', cellsrenderer: renderers.cellsrendererRepre, renderer: renderers.columnrenderer },
]

export const createRepresentanteGridAdapter = (
  idPerso: number | string,
  idHisPerso: number | string,
  withSort = false,
): IflowGridSource => {
  const config = {
    dataType: 'json',
    dataFields: REPRESENTANTE_DATA_FIELDS,
    url: `${environment.apiUrl}personaRepresentante/listar/${idPerso}/${idHisPerso}`,
    id: 'id',
    ...(withSort ? { sortcolumn: 'id', sortdirection: 'desc' } : {}),
  }
  return new jqx.dataAdapter(config)
}

export const createRepresentanteGridSourcePlain = (
  idPerso: number | string,
  idHisPerso: number | string,
): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: REPRESENTANTE_DATA_FIELDS,
  url: `${environment.apiUrl}personaRepresentante/listar/${idPerso}/${idHisPerso}`,
  id: 'id',
})
