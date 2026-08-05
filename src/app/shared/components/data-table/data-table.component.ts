import {
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core'
import { TableColumnComponent } from './table-column.component'

type SortDirection = 'asc' | 'desc' | null
export type ExportFormat = 'excel' | 'csv' | 'pdf'

interface RangeFilterValue {
  from?: string
  to?: string
}

type FilterValue = string | RangeFilterValue

const EXPORT_FORMAT_META: Record<ExportFormat, { label: string; icon: string }> = {
  excel: { label: 'Excel', icon: 'bi-file-earmark-excel' },
  csv: { label: 'CSV', icon: 'bi-filetype-csv' },
  pdf: { label: 'PDF', icon: 'bi-file-earmark-pdf' },
}

/**
 * Tabla genérica con búsqueda, filtros por columna (varios tipos), orden,
 * paginado en cliente y exportación — el reemplazo estándar de
 * <app-iflow-grid> (jqxGrid) para listados que cargan su dataset completo
 * por HTTP. Las columnas se declaran por composición con <app-table-column>
 * (ver ese componente).
 *
 * Primer uso: Procedimientos (listado + pestañas del workspace). La idea es
 * ir migrando el resto de listados jqx a este mismo componente.
 */
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<T = any> implements OnChanges {
  @Input() items: T[] = []
  @Input() loading = false
  @Input() emptyMessage = 'No hay resultados.'
  /** @deprecated Sustituido por el filtro por icono en cada columna; ya no dibuja nada, se mantiene para no romper bindings existentes. */
  @Input() searchPlaceholder = 'Buscar…'
  /** @deprecated Ver `searchPlaceholder`. */
  @Input() showSearch = true
  @Input() showPagination = true
  @Input() pageSize = 10
  @Input() pageSizeOptions = [10, 25, 50]
  @Input() rowClass: (row: T) => Record<string, boolean> = () => ({})
  @Input() trackByField = 'id'
  @Input() exportFileName = 'tabla'

  /**
   * Formatos de exportación visibles en el botón "Exportar". Los tres están
   * implementados y funcionando; los que no se listen aquí simplemente no se
   * muestran — para habilitar CSV o PDF más adelante no hace falta programar
   * nada nuevo, solo ampliar este array (p.ej. `['excel', 'csv', 'pdf']`).
   */
  @Input() exportFormats: ExportFormat[] = ['excel']

  @Output() rowClick = new EventEmitter<T>()
  @Output() rowDblClick = new EventEmitter<T>()

  @ContentChildren(TableColumnComponent, { descendants: true }) columnsQuery!: QueryList<TableColumnComponent<T>>

  currentPage = 1
  sortColumn: TableColumnComponent<T> | null = null
  sortDirection: SortDirection = null
  exportMenuOpen = false
  /** Columna cuyo popover de filtro está abierto (estilo Excel: un icono por columna, un filtro a la vez). */
  openFilterColumn: TableColumnComponent<T> | null = null
  readonly activeFilters = new Map<TableColumnComponent<T>, FilterValue>()

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (this.exportMenuOpen && !target.closest('.data-table__export')) {
      this.exportMenuOpen = false
    }
    if (this.openFilterColumn && !target.closest('.data-table__filter-cell')) {
      this.openFilterColumn = null
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.currentPage = 1
      // Los filtros de tipo "select"/"boolean" pueden haber perdido su valor
      // seleccionado si ya no existe en el nuevo dataset (p.ej. tras recargar).
      for (const [column, value] of this.activeFilters) {
        if (typeof value === 'string' && !this.filterOptionsFor(column).includes(value)) {
          this.activeFilters.delete(column)
        }
      }
    }
  }

  get columns(): TableColumnComponent<T>[] {
    return this.columnsQuery?.toArray() ?? []
  }

  get filterableColumns(): TableColumnComponent<T>[] {
    return this.columns.filter((col) => col.filterable)
  }

  get availableExportFormats(): ExportFormat[] {
    return this.exportFormats
  }

  exportFormatMeta(format: ExportFormat): { label: string; icon: string } {
    return EXPORT_FORMAT_META[format]
  }

  get hasActiveFilters(): boolean {
    for (const value of this.activeFilters.values()) {
      if (this.isFilterValueSet(value)) {
        return true
      }
    }
    return false
  }

  get filteredItems(): T[] {
    let result = this.items ?? []

    for (const [column, value] of this.activeFilters) {
      if (this.isFilterValueSet(value)) {
        result = result.filter((row) => this.matchesFilter(row, column, value))
      }
    }

    if (this.sortColumn && this.sortDirection) {
      const column = this.sortColumn
      const direction = this.sortDirection === 'asc' ? 1 : -1
      result = [...result].sort((a, b) => this.compare(this.sortValueFor(a, column), this.sortValueFor(b, column)) * direction)
    }

    return result
  }

  filterOptionsFor(column: TableColumnComponent<T>): string[] {
    if (column.filterType === 'boolean') {
      return [column.filterTrueLabel, column.filterFalseLabel]
    }
    const values = new Set<string>()
    for (const row of this.items ?? []) {
      const value = this.searchTextFor(row, column)
      if (value) {
        values.add(value)
      }
    }
    return [...values].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true }))
  }

  /** Valor del filtro simple (select/text/boolean) para el `<select>`/`<input>` de la barra. */
  getSimpleFilterValue(column: TableColumnComponent<T>): string {
    const value = this.activeFilters.get(column)
    return typeof value === 'string' ? value : ''
  }

  setSimpleFilter(column: TableColumnComponent<T>, value: string): void {
    if (value) {
      this.activeFilters.set(column, value)
    } else {
      this.activeFilters.delete(column)
    }
    this.currentPage = 1
  }

  /** Valor del filtro de rango (fecha/número) para los dos `<input>` desde/hasta. */
  getRangeFilter(column: TableColumnComponent<T>): RangeFilterValue {
    const value = this.activeFilters.get(column)
    return typeof value === 'object' && value ? value : {}
  }

  setRangeFilter(column: TableColumnComponent<T>, part: keyof RangeFilterValue, value: string): void {
    const current = this.getRangeFilter(column)
    const next: RangeFilterValue = { ...current, [part]: value || undefined }
    if (!next.from && !next.to) {
      this.activeFilters.delete(column)
    } else {
      this.activeFilters.set(column, next)
    }
    this.currentPage = 1
  }

  clearFilter(column: TableColumnComponent<T>): void {
    this.activeFilters.delete(column)
    this.currentPage = 1
  }

  clearAllFilters(): void {
    this.activeFilters.clear()
    this.currentPage = 1
  }

  /** Icono de filtro "activo" (estilo Excel) cuando la columna tiene un filtro aplicado. */
  isFilterActive(column: TableColumnComponent<T>): boolean {
    const value = this.activeFilters.get(column)
    return value !== undefined && this.isFilterValueSet(value)
  }

  toggleColumnFilter(column: TableColumnComponent<T>): void {
    this.openFilterColumn = this.openFilterColumn === column ? null : column
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize))
  }

  get pagedItems(): T[] {
    const page = Math.min(this.currentPage, this.totalPages)
    const start = (page - 1) * this.pageSize
    return this.filteredItems.slice(start, start + this.pageSize)
  }

  toggleSort(column: TableColumnComponent<T>): void {
    if (!column.sortable) {
      return
    }
    if (this.sortColumn !== column) {
      this.sortColumn = column
      this.sortDirection = 'asc'
      return
    }
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc'
      return
    }
    this.sortColumn = null
    this.sortDirection = null
  }

  sortIcon(column: TableColumnComponent<T>): string {
    if (this.sortColumn !== column || !this.sortDirection) {
      return 'bi-arrow-down-up'
    }
    return this.sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'
  }

  setPageSize(size: string | number): void {
    this.pageSize = Number(size)
    this.currentPage = 1
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages)
  }

  get isRowActivatable(): boolean {
    return this.rowClick.observed
  }

  onRowKeydown(event: KeyboardEvent, row: T): void {
    if (!this.isRowActivatable) {
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.rowClick.emit(row)
    }
  }

  getFieldValue(row: T, field?: string): unknown {
    if (!field) {
      return undefined
    }
    return field.split('.').reduce<unknown>((acc, key) => {
      if (acc == null) {
        return acc
      }
      return (acc as Record<string, unknown>)[key]
    }, row)
  }

  trackByRow = (index: number, row: T): unknown => {
    return this.getFieldValue(row, this.trackByField) ?? index
  }

  displayValue(row: T, field?: string): string {
    const value = this.getFieldValue(row, field)
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen
  }

  closeExportMenu(): void {
    this.exportMenuOpen = false
  }

  runExport(format: ExportFormat): void {
    this.closeExportMenu()
    if (format === 'excel') {
      this.exportToExcel()
    } else if (format === 'csv') {
      this.exportToCsv()
    } else {
      this.exportToPdf()
    }
  }

  /**
   * Exporta las filas visibles (con la búsqueda/filtros/orden actuales
   * aplicados, sin paginar) a un archivo abrible directamente en Excel.
   * Se genera como una tabla HTML servida con el tipo MIME de Excel — no
   * requiere ninguna librería nueva y Excel la abre nativamente.
   */
  exportToExcel(): void {
    const columns = this.exportableColumns
    const headerCells = columns.map((col) => `<th>${this.escapeHtml(col.header)}</th>`).join('')
    const bodyRows = this.filteredItems
      .map((row) => {
        const cells = columns.map((col) => `<td>${this.escapeHtml(this.exportValueFor(row, col))}</td>`).join('')
        return `<tr>${cells}</tr>`
      })
      .join('')

    const html =
      '<html><head><meta charset="UTF-8"></head><body><table border="1">' +
      `<thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody>` +
      '</table></body></html>'

    // BOM (﻿) para que Excel detecte UTF-8 y no rompa los acentos.
    this.downloadBlob(['﻿' + html], 'application/vnd.ms-excel', `${this.exportFileName}.xls`)
  }

  /** Exporta a CSV plano (separado por `;`, más cómodo que `,` para Excel en configuración regional española). */
  exportToCsv(): void {
    const columns = this.exportableColumns
    const escapeCsv = (value: string): string => {
      const needsQuotes = /[";\n]/.test(value)
      const escaped = value.replace(/"/g, '""')
      return needsQuotes ? `"${escaped}"` : escaped
    }

    const headerRow = columns.map((col) => escapeCsv(col.header)).join(';')
    const bodyRows = this.filteredItems
      .map((row) => columns.map((col) => escapeCsv(this.exportValueFor(row, col))).join(';'))
      .join('\r\n')

    const csv = `${headerRow}\r\n${bodyRows}`
    // BOM para que Excel detecte UTF-8 y no rompa los acentos al abrir el CSV.
    this.downloadBlob(['﻿' + csv], 'text/csv;charset=utf-8', `${this.exportFileName}.csv`)
  }

  /**
   * Exporta a PDF vía el diálogo de impresión del navegador (destino "Guardar
   * como PDF") — evita sumar una librería de generación de PDF solo para
   * esto. Abre una ventana con una tabla formateada para impresión y dispara
   * el diálogo automáticamente.
   */
  exportToPdf(): void {
    const columns = this.exportableColumns
    const headerCells = columns.map((col) => `<th>${this.escapeHtml(col.header)}</th>`).join('')
    const bodyRows = this.filteredItems
      .map((row) => {
        const cells = columns.map((col) => `<td>${this.escapeHtml(this.exportValueFor(row, col))}</td>`).join('')
        return `<tr>${cells}</tr>`
      })
      .join('')

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      return
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${this.escapeHtml(this.exportFileName)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #2c3e50; margin: 24px; }
  h1 { font-size: 16px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  th { background: #f1f2fb; text-transform: uppercase; letter-spacing: 0.03em; }
  tr:nth-child(even) td { background: #fafafa; }
</style>
</head>
<body>
<h1>${this.escapeHtml(this.exportFileName)} — ${this.filteredItems.length} registro(s)</h1>
<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
</body>
</html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => printWindow.print()
    // Fallback por si el navegador no dispara onload en una ventana ya escrita a mano.
    setTimeout(() => printWindow.print(), 300)
  }

  private downloadBlob(parts: BlobPart[], type: string, fileName: string): void {
    const blob = new Blob(parts, { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  private get exportableColumns(): TableColumnComponent<T>[] {
    return this.columns.filter((col) => col.exportable)
  }

  private exportValueFor(row: T, column: TableColumnComponent<T>): string {
    if (column.exportValue) {
      const value = column.exportValue(row)
      return value == null ? '' : String(value)
    }
    if (!column.template) {
      const value = this.getFieldValue(row, column.field)
      return value == null || value === '' ? '' : String(value)
    }
    // Columna con plantilla propia (badges, etc.): mejor aproximación en texto plano.
    return this.searchTextFor(row, column)
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  private searchTextFor(row: T, column: TableColumnComponent<T>): string {
    const value = column.searchValue ? column.searchValue(row) : this.getFieldValue(row, column.field)
    return value == null ? '' : String(value)
  }

  private sortValueFor(row: T, column: TableColumnComponent<T>): string | number | null | undefined {
    return column.sortValue ? column.sortValue(row) : (this.getFieldValue(row, column.field) as string | number | null | undefined)
  }

  /** Valor "crudo" de la fila para comparar en filtros de rango; usa `sortValue` si existe (suele ser el más cercano a un tipo comparable), si no `field`. */
  private rangeValueFor(row: T, column: TableColumnComponent<T>): unknown {
    return column.sortValue ? column.sortValue(row) : this.getFieldValue(row, column.field)
  }

  private matchesFilter(row: T, column: TableColumnComponent<T>, value: FilterValue): boolean {
    switch (column.filterType) {
      case 'text': {
        const term = this.normalize(String(value).trim())
        return !term || this.normalize(this.searchTextFor(row, column)).includes(term)
      }
      case 'dateRange': {
        const range = value as RangeFilterValue
        const raw = this.rangeValueFor(row, column)
        const date = raw != null ? new Date(raw as string | number | Date) : null
        if (!date || isNaN(date.getTime())) {
          return false
        }
        if (range.from && date < new Date(range.from)) {
          return false
        }
        if (range.to && date > new Date(`${range.to}T23:59:59`)) {
          return false
        }
        return true
      }
      case 'numberRange': {
        const range = value as RangeFilterValue
        const raw = this.rangeValueFor(row, column)
        const num = raw != null ? Number(raw) : NaN
        if (isNaN(num)) {
          return false
        }
        if (range.from && num < Number(range.from)) {
          return false
        }
        if (range.to && num > Number(range.to)) {
          return false
        }
        return true
      }
      default:
        // select / boolean
        return this.searchTextFor(row, column) === value
    }
  }

  private isFilterValueSet(value: FilterValue): boolean {
    if (typeof value === 'string') {
      return value !== ''
    }
    return Boolean(value?.from || value?.to)
  }

  private compare(a: string | number | null | undefined, b: string | number | null | undefined): number {
    if (a == null && b == null) {
      return 0
    }
    if (a == null) {
      return -1
    }
    if (b == null) {
      return 1
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b
    }
    return String(a).localeCompare(String(b), 'es', { sensitivity: 'base', numeric: true })
  }

  /** Búsqueda "acento-insensible": á/é/í/ó/ú/ñ deben encontrarse buscando a/e/i/o/u/n. */
  private normalize(value: string): string {
    let result = ''
    for (const char of value.normalize('NFD')) {
      const code = char.codePointAt(0) ?? 0
      const isCombiningMark = code >= 0x300 && code <= 0x36f
      if (!isCombiningMark) {
        result += char
      }
    }
    return result.toLowerCase()
  }
}
