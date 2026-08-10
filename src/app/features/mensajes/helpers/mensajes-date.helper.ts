import { formatIsoDateDdMmYyyy } from '../../../shared/components/iflow-grid/iflow-grid-cell.util'

export const formatIsoDateToDisplay = (iso?: string | null, fallback = ''): string =>
  formatIsoDateDdMmYyyy(iso, fallback)

export const formatIsoDateToGridCell = (value?: string | null): string => {
  if (!value) {
    return '<div class="msg-grid-cell msg-grid-cell--muted">Sin fecha</div>'
  }
  return `<div class="msg-grid-cell">${formatIsoDateDdMmYyyy(value).replace(/\//g, '-')}</div>`
}
