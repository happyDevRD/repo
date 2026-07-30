import { validarFormularioNuevaTarea } from './tareas-form-validation.helper'

describe('validarFormularioNuevaTarea', () => {
  const createFormEvent = (opts: {
    procedimiento?: string
    descripcion?: string
    fecha?: string
  }): Event => {
    const form = document.createElement('form')
    form.id = 'formNuevaTarea'

    const select = document.createElement('select')
    select.id = 'tprocedi2'
    const empty = document.createElement('option')
    empty.value = ''
    const placeholder = document.createElement('option')
    placeholder.value = '-1'
    const real = document.createElement('option')
    real.value = '5'
    select.appendChild(empty)
    select.appendChild(placeholder)
    select.appendChild(real)
    select.value = opts.procedimiento ?? ''

    const descripcion = document.createElement('input')
    descripcion.id = 'descriptara'
    descripcion.value = opts.descripcion ?? ''

    const fecha = document.createElement('input')
    fecha.id = 'fecInicioNuevaTarea'
    fecha.value = opts.fecha ?? ''

    form.appendChild(select)
    form.appendChild(descripcion)
    form.appendChild(fecha)

    return { target: form } as unknown as Event
  }

  it('es inválido si procedimiento es vacío o -1', () => {
    // Arrange
    const eventVacio = createFormEvent({
      procedimiento: '',
      descripcion: 'Tarea',
      fecha: '2026-07-30',
    })
    const eventPlaceholder = createFormEvent({
      procedimiento: '-1',
      descripcion: 'Tarea',
      fecha: '2026-07-30',
    })

    // Act / Assert
    expect(validarFormularioNuevaTarea(eventVacio)).toBeFalse()
    expect(validarFormularioNuevaTarea(eventPlaceholder)).toBeFalse()
  })

  it('es inválido si falta descripción o fecha', () => {
    expect(
      validarFormularioNuevaTarea(
        createFormEvent({ procedimiento: '5', descripcion: '  ', fecha: '2026-07-30' }),
      ),
    ).toBeFalse()
    expect(
      validarFormularioNuevaTarea(
        createFormEvent({ procedimiento: '5', descripcion: 'Tarea', fecha: '' }),
      ),
    ).toBeFalse()
  })

  it('es válido con procedimiento, descripción y fecha', () => {
    // Arrange
    const event = createFormEvent({
      procedimiento: '5',
      descripcion: 'Nueva tarea',
      fecha: '2026-07-30',
    })

    // Act
    const valido = validarFormularioNuevaTarea(event)

    // Assert
    expect(valido).toBeTrue()
  })
})
