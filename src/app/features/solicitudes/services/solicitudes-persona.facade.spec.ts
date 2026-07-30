import { SolicitudesPersonaFacade } from './solicitudes-persona.facade'
import { PersonaEntidadApiService } from '../../../core/service/persona/persona-entidad-api.service'
import { NotificationService } from '../../../core/service/notification.service'

describe('SolicitudesPersonaFacade', () => {
  it('se puede instanciar con dependencias mock', () => {
    const facade = new SolicitudesPersonaFacade(
      {} as unknown as PersonaEntidadApiService,
      {} as unknown as NotificationService,
    )
    expect(facade).toBeTruthy()
  })
})
