export const formatIsoDateToDisplay = (iso?: string | null, fallback = ''): string => {
  if (!iso) {
    return fallback
  }
  const dia = iso.substring(8, 10)
  const mes = iso.substring(5, 7)
  const anio = iso.substring(0, 4)
  return `${dia}/${mes}/${anio}`
}

export const formatIsoDateToGridCell = (value?: string | null): string => {
  if (!value) {
    return '<div class="msg-grid-cell msg-grid-cell--muted">Sin fecha</div>'
  }
  const dia = value.substring(8, 10)
  const mes = value.substring(5, 7)
  const anio = value.substring(0, 4)
  return `<div class="msg-grid-cell">${dia}-${mes}-${anio}</div>`
}
