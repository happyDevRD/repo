/**
 * Helpers de fechas legacy (formato locale DD/MM/AAAA ↔ ISO YYYY-MM-DD).
 * Conservan el comportamiento histórico de solicitudes/expedientes.
 */

/** Convierte Date o string ISO `YYYY-MM-DD...` a `DD/MM/AAAA`. */
export const formatearFechaDDMMYYYY = (valor: unknown): string => {
  if (valor == null) {
    return ''
  }
  const texto = String(valor)
  const anio = texto.substring(0, 4)
  const mes = texto.substring(5, 7)
  const dia = texto.substring(8, 10)
  return `${dia}/${mes}/${anio}`
}

/**
 * Convierte `toLocaleDateString()` típico `DD/MM/AAAA` a ISO `YYYY-MM-DD`.
 * Si no se pasa locale, usa la fecha de hoy.
 */
export const formatearFechaISODesdeLocale = (localeDate?: string): string => {
  const fsistema = localeDate ?? new Date().toLocaleDateString()
  const anio = fsistema.substring(6, 10)
  const mes = fsistema.substring(3, 5)
  const dia = fsistema.substring(0, 2)
  return `${anio}-${mes}-${dia}`
}

/** Extrae hora `HH:mm:ss` de un ISO datetime (posiciones 11–19). */
export const extraerHoraDesdeISO = (fecha: unknown): string => {
  if (fecha == null) {
    return ''
  }
  return String(fecha).substring(11, 19)
}

/** Fecha de hoy en ISO `YYYY-MM-DD` vía Date (más fiable que locale). */
export const fechaHoyISO = (): string => {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

/** Año civil actual como string (ejercicio). */
export const ejercicioActual = (): string => String(new Date().getFullYear())
