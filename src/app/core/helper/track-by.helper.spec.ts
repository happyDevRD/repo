import {
  trackByCodTema,
  trackById,
  trackByIdModel,
  trackByIndex,
  trackByMotNotif,
  trackByNotificador,
  trackByNumDocum,
  trackByPlantilla,
  trackByReceptor,
  trackByTipoObjeto,
  trackByUsuario,
  trackByValor,
} from './track-by.helper'

describe('track-by.helper', () => {
  it('trackById usa id o cae a index', () => {
    expect(trackById(0, { id: 12 })).toBe(12)
    expect(trackById(3, {} as { id?: number })).toBe(3)
  })

  it('trackByIndex devuelve el índice', () => {
    expect(trackByIndex(7)).toBe(7)
  })

  it('trackByUsuario usa usuario o cae a index', () => {
    expect(trackByUsuario(0, { usuario: 'ana' })).toBe('ana')
    expect(trackByUsuario(2, {})).toBe('2')
  })

  it('trackByPlantilla y trackByValor usan su clave', () => {
    expect(trackByPlantilla(0, { plantilla: 'P1' })).toBe('P1')
    expect(trackByValor(1, { valor: 'X' })).toBe('X')
  })

  it('trackBy de catálogos notificaciones usan su clave', () => {
    expect(trackByNotificador(0, { notificador: 5 })).toBe(5)
    expect(trackByReceptor(1, { receptor: 2 })).toBe(2)
    expect(trackByMotNotif(2, { motNotif: 9 })).toBe(9)
    expect(trackByCodTema(0, { codTema: 'T1' })).toBe('T1')
    expect(trackByIdModel(0, { idModel: 3 })).toBe(3)
    expect(trackByNumDocum(0, { numDocum: 'X1' })).toBe('X1')
    expect(trackByTipoObjeto(0, { idTipObjTribu: 7 })).toBe(7)
  })
})
