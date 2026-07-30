import { TestBed } from '@angular/core/testing'
import { HttpClient } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { ExpedientesExpedienteFacade, ExpedientesExpedienteHost } from './expedientes-expediente.facade'
import { ExpedientesService } from '../expedientes.service'
import { NotificationService } from '../../../core/service/notification.service'
import { ModalManagerService } from '../../../core/service/modal-manager.service'
import { UserSessionService } from '../../../core/service/user-session.service'
import { InsidePostCierreService } from '../../../core/service/inside/inside-post-cierre.service'
import { ExpedientesGridFacade } from './expedientes-grid.facade'
import { ExpedientesInsideFacade } from './expedientes-inside.facade'

describe('ExpedientesExpedienteFacade (R2 refresh local)', () => {
  let facade: ExpedientesExpedienteFacade
  let expedientesService: jasmine.SpyObj<ExpedientesService>
  let notificationService: jasmine.SpyObj<NotificationService>
  let gridFacade: jasmine.SpyObj<ExpedientesGridFacade>
  let insidePostCierreService: jasmine.SpyObj<InsidePostCierreService>
  let insideFacade: jasmine.SpyObj<ExpedientesInsideFacade>

  const createHost = (partial: Partial<ExpedientesExpedienteHost> = {}): ExpedientesExpedienteHost =>
    ({
      nuevoexpediente: { usuario: '12345678A' },
      editexpediente: {},
      consultadni: { idPerso: 1 },
      representanteexplistar: {},
      seleccionoRepre: '0',
      crearmensaje: {},
      idexpediente: 55,
      ejercicio: new Date('2026-07-30'),
      Fecha: new Date('2026-07-30'),
      usuarioPermiso: 'user',
      isCreandoExpediente: false,
      isAsignandoTramitador: false,
      mostrarValidacionesExpediente: false,
      editExpedientes: true,
      veoPermisoProcedi: false,
      fechacancelacionexpedi: '2026-07-30',
      fechacierreexpedi: '2026-07-30',
      serieDocumental: 'SERIE-1',
      limpiarDatosExpediente: jasmine.createSpy('limpiarDatosExpediente'),
      limpiarDatosAsignarTramitador: jasmine.createSpy('limpiarDatosAsignarTramitador'),
      limpiadatosnuevoexpediente: jasmine.createSpy('limpiadatosnuevoexpediente'),
      cerrarModal: jasmine.createSpy('cerrarModal'),
      ...partial,
    } as unknown as ExpedientesExpedienteHost)

  beforeEach(() => {
    expedientesService = jasmine.createSpyObj('ExpedientesService', [
      'crearExpediente',
      'cancelarExpediente',
      'cerrarExpediente',
      'editarExpediente',
    ])
    notificationService = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
      'confirm',
      'confirmDelete',
      'incompleteFields',
    ])
    gridFacade = jasmine.createSpyObj('ExpedientesGridFacade', [
      'refreshExpedientesList',
      'refreshExpedientesListPlain',
    ])
    insidePostCierreService = jasmine.createSpyObj('InsidePostCierreService', ['ofrecerEnvioTrasCierre'])
    insideFacade = jasmine.createSpyObj('ExpedientesInsideFacade', ['actualizarResumenPendientes'])

    TestBed.configureTestingModule({
      providers: [
        ExpedientesExpedienteFacade,
        { provide: ExpedientesService, useValue: expedientesService },
        { provide: NotificationService, useValue: notificationService },
        { provide: ModalManagerService, useValue: jasmine.createSpyObj('ModalManagerService', ['closeModal']) },
        { provide: ExpedientesGridFacade, useValue: gridFacade },
        { provide: UserSessionService, useValue: { user: 'gos' } },
        { provide: InsidePostCierreService, useValue: insidePostCierreService },
        { provide: ExpedientesInsideFacade, useValue: insideFacade },
        { provide: HttpClient, useValue: {} },
      ],
    })

    facade = TestBed.inject(ExpedientesExpedienteFacade)
  })

  it('ejecutarCrear llama refreshExpedientesList tras crear', () => {
    // Arrange
    const host = createHost()
    expedientesService.crearExpediente.and.returnValue(of({}) as never)

    // Act
    facade.ejecutarCrear(host)

    // Assert
    expect(expedientesService.crearExpediente).toHaveBeenCalled()
    expect(gridFacade.refreshExpedientesList).toHaveBeenCalledWith(host, 'gos', true)
    expect(host.limpiarDatosExpediente).toHaveBeenCalled()
    expect(notificationService.success).toHaveBeenCalled()
  })

  it('cancelar llama refreshExpedientesListPlain tras confirmar', async () => {
    // Arrange
    const host = createHost()
    notificationService.confirmDelete.and.returnValue(Promise.resolve({ isConfirmed: true } as never))
    expedientesService.cancelarExpediente.and.returnValue(of({}) as never)

    // Act
    facade.cancelar(host)
    await notificationService.confirmDelete.calls.mostRecent().returnValue

    // Assert
    expect(expedientesService.cancelarExpediente).toHaveBeenCalledWith(
      host.idexpediente,
      host.fechacancelacionexpedi,
    )
    expect(gridFacade.refreshExpedientesListPlain).toHaveBeenCalledWith(host, 'gos')
    expect(host.editExpedientes).toBeFalse()
    expect(host.cerrarModal).toHaveBeenCalledWith('cancelarExpModal')
  })

  it('cerrar llama refreshExpedientesList tras confirmar', async () => {
    // Arrange
    const host = createHost()
    notificationService.confirm.and.returnValue(Promise.resolve({ isConfirmed: true } as never))
    expedientesService.cerrarExpediente.and.returnValue(of({}) as never)

    // Act
    facade.cerrar(host)
    await notificationService.confirm.calls.mostRecent().returnValue

    // Assert
    expect(expedientesService.cerrarExpediente).toHaveBeenCalledWith(
      host.idexpediente,
      host.fechacierreexpedi,
      host.serieDocumental,
    )
    expect(gridFacade.refreshExpedientesList).toHaveBeenCalledWith(host, 'gos', true)
    expect(host.cerrarModal).toHaveBeenCalledWith('cerrarExpModal')
    expect(insidePostCierreService.ofrecerEnvioTrasCierre).toHaveBeenCalledWith(55)
    expect(insideFacade.actualizarResumenPendientes).toHaveBeenCalled()
  })

  it('ejecutarCrear no refresca si la API falla', () => {
    // Arrange
    const host = createHost()
    expedientesService.crearExpediente.and.returnValue(throwError(() => new Error('fail')) as never)

    // Act
    facade.ejecutarCrear(host)

    // Assert
    expect(gridFacade.refreshExpedientesList).not.toHaveBeenCalled()
    expect(notificationService.error).toHaveBeenCalled()
    expect(host.isCreandoExpediente).toBeFalse()
  })

  it('cancelar no llama API ni refresh si falta fecha', () => {
    // Arrange
    const host = createHost({ fechacancelacionexpedi: undefined as unknown as string })

    // Act
    facade.cancelar(host)

    // Assert
    expect(notificationService.warning).toHaveBeenCalled()
    expect(expedientesService.cancelarExpediente).not.toHaveBeenCalled()
    expect(gridFacade.refreshExpedientesListPlain).not.toHaveBeenCalled()
  })
})
