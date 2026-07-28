import { SolicitudesPersonaFacade } from './solicitudes-persona.facade'

describe('SolicitudesPersonaFacade', () => {
  it('se puede instanciar con dependencias mock', () => {
    const facade = new SolicitudesPersonaFacade(
      {} as any,
      {} as any,
    )
    expect(facade).toBeTruthy()
  })
})
