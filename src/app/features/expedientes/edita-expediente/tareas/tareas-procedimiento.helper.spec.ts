import { esSeleccionTareaProcedimientoVacia } from './tareas-procedimiento.helper'

describe('esSeleccionTareaProcedimientoVacia', () => {
  it('es vacía con null, undefined, string vacío o -1', () => {
    // Arrange / Act / Assert
    expect(esSeleccionTareaProcedimientoVacia(null)).toBeTrue()
    expect(esSeleccionTareaProcedimientoVacia(undefined)).toBeTrue()
    expect(esSeleccionTareaProcedimientoVacia('')).toBeTrue()
    expect(esSeleccionTareaProcedimientoVacia(-1)).toBeTrue()
  })

  it('no es vacía con un id de tarea válido', () => {
    expect(esSeleccionTareaProcedimientoVacia(12)).toBeFalse()
    expect(esSeleccionTareaProcedimientoVacia('12')).toBeFalse()
  })
})
