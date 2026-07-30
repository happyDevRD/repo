import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'

/**
 * Firma laxa de cellsrenderer/renderer de jqxGrid.
 * `any` a propósito: el SDK no tipa args y los renderers legacy usan firmas distintas.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IflowGridCellsRenderer = (...args: any[]) => string

/**
 * Columna jqxGrid tipada de forma mínima.
 * Método (no propiedad) para bivariancia de callbacks jqx.
 */
export interface IflowGridColumn {
  text?: string
  datafield?: string
  width?: string | number
  hidden?: boolean
  align?: string
  cellsalign?: string
  cellsformat?: string
  cellsrenderer?: IflowGridCellsRenderer
  renderer?: IflowGridCellsRenderer
  filtertype?: string
  columntype?: string
  editable?: boolean
  sortable?: boolean
}

export type IflowGridColumns = IflowGridColumn[]

/** Source / dataAdapter de jqx (runtime object; no tipamos el SDK). */
export type IflowGridSource = object | null

export type IflowGridLocalization = typeof jqxGrid_ES | Record<string, unknown> | null
