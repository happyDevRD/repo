import { Component, ContentChild, Input, TemplateRef } from '@angular/core'

export type TableColumnAlign = 'start' | 'center' | 'end'

/**
 * Tipo de filtro que genera la barra de filtros para esta columna:
 * - `select`: desplegable con los valores únicos presentes en los datos (por defecto).
 * - `text`: caja de texto, filtra por "contiene" (acento-insensible).
 * - `dateRange`: dos campos fecha (desde/hasta).
 * - `numberRange`: dos campos numéricos (mínimo/máximo).
 * - `boolean`: desplegable fijo Sí/No, sin escanear los datos.
 */
export type TableColumnFilterType = 'select' | 'text' | 'dateRange' | 'numberRange' | 'boolean'

export interface TableColumnTemplateContext<T> {
  $implicit: T
  row: T
}

/**
 * Declara una columna de <app-data-table> por composición (uso análogo a
 * ng-container/ng-template en mat-table o p-table de PrimeNG). Sin contenido
 * proyectado, la celda muestra `row[field]` en crudo; con un <ng-template>
 * dentro se renderiza esa plantilla (badges, labels calculados, etc.).
 */
@Component({
  selector: 'app-table-column',
  template: '',
})
export class TableColumnComponent<T = any> {
  @Input() header = ''
  @Input() field?: string
  @Input() sortable = false
  @Input() align: TableColumnAlign = 'start'
  @Input() width?: string

  /** Valor a comparar al ordenar; por defecto usa `row[field]`. Útil cuando la celda muestra una etiqueta calculada (p.ej. modalidad/materia). También es la fuente de valor para los filtros de rango (fecha/número). */
  @Input() sortValue?: (row: T) => string | number | null | undefined

  /** Texto a comparar al buscar; por defecto usa `row[field]`. */
  @Input() searchValue?: (row: T) => string | null | undefined

  /** Añade un filtro a la barra de filtros. El tipo de widget lo decide `filterType`. Usa `field`/`searchValue`/`sortValue` como fuente del valor según el tipo. */
  @Input() filterable = false

  /** Tipo de filtro a renderizar cuando `filterable` es `true`. Por defecto `'select'` (desplegable de valores discretos). */
  @Input() filterType: TableColumnFilterType = 'select'

  /** Etiquetas del filtro `boolean` (por defecto Sí/No). El valor real de la fila se compara contra estas etiquetas vía `searchValue`/`field`. */
  @Input() filterTrueLabel = 'Sí'
  @Input() filterFalseLabel = 'No'

  /** Si es `false`, la columna se omite al exportar (Excel/CSV/PDF), p.ej. una columna de solo botones de acción. */
  @Input() exportable = true

  /** Valor de texto a volcar en la celda al exportar; por defecto usa `searchValue`/`field` (igual que la búsqueda). Útil cuando la celda muestra una plantilla (badges, etc.) y el texto plano no coincide con lo que se busca. */
  @Input() exportValue?: (row: T) => string | number | null | undefined

  @ContentChild(TemplateRef) template?: TemplateRef<TableColumnTemplateContext<T>>
}
