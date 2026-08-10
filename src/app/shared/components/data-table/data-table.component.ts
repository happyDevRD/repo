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
  inject,
} from '@angular/core'
import { TableColumnComponent } from './table-column.component'
import { DataTableExportService, ExportFormat } from './data-table-export.service'
import { getFieldValue } from './data-table.utils'

export type { ExportFormat }

type SortDirection = 'asc' | 'desc' | null

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
  private readonly exportService = inject(DataTableExportService)

  @Input() items: T[] = []
  @Input() loading = false
  @Input() emptyMessage = 'No hay resultados.'
  @Input() showPagination = true
  @Input() pageSize = 20
  @Input() pageSizeOptions = [10, 20, 50, 100]
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
  filtersVisible = true
  readonly activeFilters = new Map<TableColumnComponent<T>, FilterValue>()

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (this.exportMenuOpen && !target.closest('.data-table__export')) {
      this.exportMenuOpen = false
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

  clearAllFilters(): void {
    this.activeFilters.clear()
    this.currentPage = 1
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize))
  }

  get pageRangeLabel(): string {
    const total = this.filteredItems.length
    if (total === 0) {
      return '0 registros'
    }
    const page = Math.min(this.currentPage, this.totalPages)
    const start = (page - 1) * this.pageSize + 1
    const end = Math.min(page * this.pageSize, total)
    return `${start}–${end} de ${total}`
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

  trackByRow = (index: number, row: T): unknown => {
    return getFieldValue(row, this.trackByField) ?? index
  }

  displayValue(row: T, field?: string): string {
    const value = getFieldValue(row, field)
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen
  }

  toggleFiltersVisible(): void {
    this.filtersVisible = !this.filtersVisible
  }

  closeExportMenu(): void {
    this.exportMenuOpen = false
  }

  runExport(format: ExportFormat): void {
    this.closeExportMenu()
    this.exportService.export(format, {
      columns: this.exportableColumns,
      rows: this.filteredItems,
      fileName: this.exportFileName,
    })
  }

  private get exportableColumns(): TableColumnComponent<T>[] {
    return this.columns.filter((col) => col.exportable)
  }

  private searchTextFor(row: T, column: TableColumnComponent<T>): string {
    const value = column.searchValue ? column.searchValue(row) : getFieldValue(row, column.field)
    return value == null ? '' : String(value)
  }

  private sortValueFor(row: T, column: TableColumnComponent<T>): string | number | null | undefined {
    return column.sortValue ? column.sortValue(row) : (getFieldValue(row, column.field) as string | number | null | undefined)
  }

  /** Valor "crudo" de la fila para comparar en filtros de rango; usa `sortValue` si existe (suele ser el más cercano a un tipo comparable), si no `field`. */
  private rangeValueFor(row: T, column: TableColumnComponent<T>): unknown {
    return column.sortValue ? column.sortValue(row) : getFieldValue(row, column.field)
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
