import { CrearNotificacion, ModeloTeuCrear } from '../../expedientes'
import { InteresadoListarDto } from '../../../../core/models/interesado.dto'
import {
  crearModeloTeuInicial,
  validarFormularioCreacionNotificacion,
} from './notificaciones-form.validator'
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper'

describe('notificaciones-form.validator', () => {
  const interesado = (numDocumInter: string): InteresadoListarDto =>
    ({ numDocumInter } as InteresadoListarDto)

  const crearNotificacionValida = (): CrearNotificacion => {
    const n = new CrearNotificacion()
    n.fecNotif = '2026-07-30'
    n.dni = '12345678A'
    n.notificador = 3
    return n
  }

  describe('validarFormularioCreacionNotificacion', () => {
    it('es inválido si notificador es placeholder vacío (0)', () => {
      // Arrange
      const creanotificacion = crearNotificacionValida()
      creanotificacion.notificador = 0

      // Act
      const valido = validarFormularioCreacionNotificacion({
        creanotificacion,
        idTarea: 10,
        interesados: [interesado('12345678A')],
      })

      // Assert
      expect(valido).toBeFalse()
    })

    it('es inválido si notificador falta', () => {
      const creanotificacion = crearNotificacionValida()
      creanotificacion.notificador = undefined as unknown as number

      expect(
        validarFormularioCreacionNotificacion({
          creanotificacion,
          idTarea: 10,
          interesados: [interesado('12345678A')],
        }),
      ).toBeFalse()
    })

    it('es inválido si el DNI no está en interesados', () => {
      expect(
        validarFormularioCreacionNotificacion({
          creanotificacion: crearNotificacionValida(),
          idTarea: 10,
          interesados: [interesado('99999999Z')],
        }),
      ).toBeFalse()
    })

    it('es válido con fecha, dni interesado, tarea y notificador', () => {
      // Arrange / Act
      const valido = validarFormularioCreacionNotificacion({
        creanotificacion: crearNotificacionValida(),
        idTarea: 10,
        interesados: [interesado('12345678A')],
      })

      // Assert
      expect(valido).toBeTrue()
    })
  })

  describe('crearModeloTeuInicial', () => {
    it('inicializa flags y fechas de hoy, dejando materia/modelo/publicación vacíos', () => {
      // Arrange
      const hoy = fechaHoyISO()

      // Act
      const modelo: ModeloTeuCrear = crearModeloTeuInicial()

      // Assert
      expect(modelo.datPerso).toBeTrue()
      expect(modelo.texPlura).toBeTrue()
      expect(modelo.incLgt).toBeTrue()
      expect(modelo.fecSolic as unknown as string).toBe(hoy)
      expect(modelo.fecGener as unknown as string).toBe(hoy)
      expect(modelo.fecFirma as unknown as string).toBe(hoy)
      expect(modelo.idMater).toBe('')
      expect(modelo.idModel).toBeNull()
      expect(modelo.forPubli).toBeNull()
    })
  })
})
