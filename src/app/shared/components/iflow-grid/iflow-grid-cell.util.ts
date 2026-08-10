/** Escapa HTML al volcar texto dentro de un cellsrenderer/columnrenderer de jqxGrid. */
export const escapeGridHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Recorta una fecha ISO (`yyyy-MM-dd...`) a `dd/mm/aaaa` sin pasar por `Date`
 * (evita desfases de huso horario). Usado por los cellsrenderer de fecha de
 * varios grids jqx; si no hay valor, devuelve `fallback`.
 */
export const formatIsoDateDdMmYyyy = (value?: string | null, fallback = ''): string => {
  if (!value) {
    return fallback
  }
  const dia = value.substring(8, 10)
  const mes = value.substring(5, 7)
  const anio = value.substring(0, 4)
  return `${dia}/${mes}/${anio}`
}
