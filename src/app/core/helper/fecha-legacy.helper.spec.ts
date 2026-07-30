import {
  ejercicioActual,
  extraerHoraDesdeISO,
  fechaHoyISO,
  formatearFechaDDMMYYYY,
  formatearFechaISODesdeLocale,
} from './fecha-legacy.helper'

describe('fecha-legacy.helper', () => {
  it('formatearFechaDDMMYYYY convierte ISO a DD/MM/AAAA', () => {
    // Arrange
    const iso = '2026-07-30T12:00:00'

    // Act
    const resultado = formatearFechaDDMMYYYY(iso)

    // Assert
    expect(resultado).toBe('30/07/2026')
  })

  it('formatearFechaDDMMYYYY devuelve vacío con null/undefined', () => {
    expect(formatearFechaDDMMYYYY(null)).toBe('')
    expect(formatearFechaDDMMYYYY(undefined)).toBe('')
  })

  it('formatearFechaISODesdeLocale convierte DD/MM/AAAA a ISO', () => {
    // Arrange / Act / Assert
    expect(formatearFechaISODesdeLocale('30/07/2026')).toBe('2026-07-30')
  })

  it('fechaHoyISO tiene formato YYYY-MM-DD del día actual', () => {
    // Arrange
    const hoy = new Date()
    const esperado = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0'),
    ].join('-')

    // Act
    const resultado = fechaHoyISO()

    // Assert
    expect(resultado).toBe(esperado)
    expect(resultado).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('extraerHoraDesdeISO toma HH:mm:ss', () => {
    expect(extraerHoraDesdeISO('2026-07-30T14:35:09.000Z')).toBe('14:35:09')
    expect(extraerHoraDesdeISO(null)).toBe('')
  })

  it('ejercicioActual es el año civil actual', () => {
    expect(ejercicioActual()).toBe(String(new Date().getFullYear()))
  })
})
