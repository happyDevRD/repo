import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { SolicitudesSolicitudFacade, SolicitudesSolicitudHost } from './solicitudes-solicitud.facade'
import { SolicitudesService } from '../solicitudes.service'
import { SolicitudApiService } from '../../../core/service/solicitud/solicitud-api.service'
import { RdDocumentoApiService } from '../../../core/service/documento/rd-documento-api.service'
import { NotificationService } from '../../../core/service/notification.service'
import { ModalManagerService } from '../../../core/service/modal-manager.service'
import { SolicitudesGridFacade } from './solicitudes-grid.facade'
import { SolicitudesDocumentosFacade } from './solicitudes-documentos.facade'

describe('SolicitudesSolicitudFacade (R2 refresh local)', () => {
  let facade: SolicitudesSolicitudFacade
  let solicitudApi: jasmine.SpyObj<SolicitudApiService>
  let solicitudesService: jasmine.SpyObj<SolicitudesService>
  let notificationService: jasmine.SpyObj<NotificationService>
  let gridFacade: jasmine.SpyObj<SolicitudesGridFacade>

  const createHost = (partial: Partial<SolicitudesSolicitudHost> = {}): SolicitudesSolicitudHost =>
    ({
      editasolicitud: {
        usuario: 'tramitador1',
        motivoRechazo: 'Motivo de prueba',
        estado: 'PENDIENTE',
      },
      idsolicitud: 42,
      isAsignando: false,
      isRechazando: false,
      veoRechazaSolici: true,
      modificoSolicitud: true,
      vermenu: true,
      ejerNumeroSolicitud: '2026/10',
      usuarioSolicitud: '',
      asuntoSolicitud: 'Asunto',
      expsolicitud: '',
      documentosSolicitud: [],
      documentosCargando: false,
      iddocumento: 1,
      cerrarModal: jasmine.createSpy('cerrarModal'),
      ...partial,
    } as unknown as SolicitudesSolicitudHost)

  beforeEach(() => {
    solicitudApi = jasmine.createSpyObj('SolicitudApiService', ['asignar', 'editar', 'crear', 'ver'])
    solicitudesService = jasmine.createSpyObj('SolicitudesService', ['deleteSolicitud'])
    notificationService = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
      'confirm',
      'incompleteFields',
    ])
    gridFacade = jasmine.createSpyObj('SolicitudesGridFacade', ['refreshSolicitudesList'])

    TestBed.configureTestingModule({
      providers: [
        SolicitudesSolicitudFacade,
        { provide: SolicitudesService, useValue: solicitudesService },
        { provide: SolicitudApiService, useValue: solicitudApi },
        { provide: RdDocumentoApiService, useValue: {} },
        { provide: NotificationService, useValue: notificationService },
        { provide: ModalManagerService, useValue: jasmine.createSpyObj('ModalManagerService', ['closeModal', 'keepModalOpen']) },
        { provide: SolicitudesGridFacade, useValue: gridFacade },
        { provide: SolicitudesDocumentosFacade, useValue: {} },
      ],
    })

    facade = TestBed.inject(SolicitudesSolicitudFacade)
  })

  it('ejecutarAsignacion refresca el grid tras asignar', () => {
    // Arrange
    const host = createHost()
    solicitudApi.asignar.and.returnValue(of({}) as never)

    // Act
    facade.ejecutarAsignacion(host)

    // Assert
    expect(solicitudApi.asignar).toHaveBeenCalledWith(host.editasolicitud, host.idsolicitud)
    expect(gridFacade.refreshSolicitudesList).toHaveBeenCalledWith(host, true)
    expect(notificationService.success).toHaveBeenCalled()
    expect(host.isAsignando).toBeFalse()
  })

  it('ejecutarRechazo refresca el grid tras rechazar', () => {
    // Arrange
    const host = createHost()
    solicitudApi.editar.and.returnValue(of({}) as never)

    // Act
    facade.ejecutarRechazo(host)

    // Assert
    expect(host.editasolicitud.estado).toBe('RECHAZADA')
    expect(solicitudApi.editar).toHaveBeenCalledWith(host.editasolicitud, host.idsolicitud)
    expect(gridFacade.refreshSolicitudesList).toHaveBeenCalledWith(host, true)
    expect(notificationService.success).toHaveBeenCalled()
    expect(host.isRechazando).toBeFalse()
  })

  it('eliminar refresca el grid tras confirmar borrado', async () => {
    // Arrange
    const host = createHost()
    notificationService.confirm.and.returnValue(Promise.resolve({ isConfirmed: true } as never))
    solicitudesService.deleteSolicitud.and.returnValue(of({}) as never)

    // Act
    facade.eliminar(host, host.idsolicitud)
    await notificationService.confirm.calls.mostRecent().returnValue

    // Assert
    expect(solicitudesService.deleteSolicitud).toHaveBeenCalledWith(42)
    expect(gridFacade.refreshSolicitudesList).toHaveBeenCalledWith(host, true)
    expect(host.vermenu).toBeFalse()
    expect(host.idsolicitud).toBe(0)
  })

  it('asignar (legacy) refresca el grid en éxito', () => {
    // Arrange
    const host = createHost()
    solicitudApi.asignar.and.returnValue(of({}) as never)

    // Act
    facade.asignar(host, 99)

    // Assert
    expect(solicitudApi.asignar).toHaveBeenCalledWith(host.editasolicitud, 99)
    expect(gridFacade.refreshSolicitudesList).toHaveBeenCalledWith(host, true)
  })

  it('ejecutarAsignacion no refresca si la API falla', () => {
    // Arrange
    const host = createHost()
    solicitudApi.asignar.and.returnValue(throwError(() => new Error('fail')) as never)

    // Act
    facade.ejecutarAsignacion(host)

    // Assert
    expect(gridFacade.refreshSolicitudesList).not.toHaveBeenCalled()
    expect(notificationService.error).toHaveBeenCalled()
    expect(host.isAsignando).toBeFalse()
  })
})
