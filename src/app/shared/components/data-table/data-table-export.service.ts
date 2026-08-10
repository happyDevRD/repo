import { Injectable } from '@angular/core'
import { TableColumnComponent } from './table-column.component'
import { getFieldValue } from './data-table.utils'

export type ExportFormat = 'excel' | 'csv' | 'pdf'

export interface DataTableExportParams<T> {
  columns: TableColumnComponent<T>[]
  rows: T[]
  fileName: string
}

/**
 * Exportación de <app-data-table> a Excel/CSV/PDF. Separado del componente
 * para no mezclar la lógica de tabla (orden/filtro/paginado) con la
 * generación de archivos.
 */
@Injectable({ providedIn: 'root' })
export class DataTableExportService {
  export<T>(format: ExportFormat, params: DataTableExportParams<T>): void {
    if (format === 'excel') {
      this.toExcel(params)
    } else if (format === 'csv') {
      this.toCsv(params)
    } else {
      this.toPdf(params)
    }
  }

  /**
   * Genera un archivo abrible directamente en Excel: una tabla HTML servida
   * con el tipo MIME de Excel — no requiere ninguna librería nueva.
   */
  private toExcel<T>(params: DataTableExportParams<T>): void {
    const { headerCells, bodyRows } = this.toTableHtml(params.columns, params.rows)
    const html =
      '<html><head><meta charset="UTF-8"></head><body><table border="1">' +
      `<thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody>` +
      '</table></body></html>'

    // BOM (﻿) para que Excel detecte UTF-8 y no rompa los acentos.
    this.downloadBlob(['﻿' + html], 'application/vnd.ms-excel', `${params.fileName}.xls`)
  }

  /** Exporta a CSV plano (separado por `;`, más cómodo que `,` para Excel en configuración regional española). */
  private toCsv<T>({ columns, rows, fileName }: DataTableExportParams<T>): void {
    const escapeCsv = (value: string): string => {
      const needsQuotes = /[";\n]/.test(value)
      const escaped = value.replace(/"/g, '""')
      return needsQuotes ? `"${escaped}"` : escaped
    }

    const headerRow = columns.map((col) => escapeCsv(col.header)).join(';')
    const bodyRows = rows.map((row) => columns.map((col) => escapeCsv(this.valueFor(row, col))).join(';')).join('\r\n')

    const csv = `${headerRow}\r\n${bodyRows}`
    // BOM para que Excel detecte UTF-8 y no rompa los acentos al abrir el CSV.
    this.downloadBlob(['﻿' + csv], 'text/csv;charset=utf-8', `${fileName}.csv`)
  }

  /**
   * Exporta a PDF vía el diálogo de impresión del navegador (destino "Guardar
   * como PDF") — evita sumar una librería de generación de PDF solo para
   * esto. Abre una ventana con una tabla formateada para impresión y dispara
   * el diálogo automáticamente.
   */
  private toPdf<T>(params: DataTableExportParams<T>): void {
    const { headerCells, bodyRows } = this.toTableHtml(params.columns, params.rows)
    const title = this.escapeHtml(params.fileName)

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      return
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title}</title>
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
<h1>${title} — ${params.rows.length} registro(s)</h1>
<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
</body>
</html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => printWindow.print()
    // Fallback por si el navegador no dispara onload en una ventana ya escrita a mano.
    setTimeout(() => printWindow.print(), 300)
  }

  /** Filas y cabecera en HTML, compartido por Excel y PDF (ambos vuelcan la misma tabla). */
  private toTableHtml<T>(columns: TableColumnComponent<T>[], rows: T[]): { headerCells: string; bodyRows: string } {
    const headerCells = columns.map((col) => `<th>${this.escapeHtml(col.header)}</th>`).join('')
    const bodyRows = rows
      .map((row) => `<tr>${columns.map((col) => `<td>${this.escapeHtml(this.valueFor(row, col))}</td>`).join('')}</tr>`)
      .join('')
    return { headerCells, bodyRows }
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

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  private valueFor<T>(row: T, column: TableColumnComponent<T>): string {
    if (column.exportValue) {
      const value = column.exportValue(row)
      return value == null ? '' : String(value)
    }
    if (!column.template) {
      const value = getFieldValue(row, column.field)
      return value == null || value === '' ? '' : String(value)
    }
    // Columna con plantilla propia (badges, etc.): mejor aproximación en texto plano.
    const value = column.searchValue ? column.searchValue(row) : getFieldValue(row, column.field)
    return value == null ? '' : String(value)
  }
}
