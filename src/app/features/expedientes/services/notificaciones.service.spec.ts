import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { NotificacionesService } from './notificaciones.service'
import { environment } from 'src/environments/environment'
import { applyAppConfig } from 'src/app/core/config/runtime-config'

describe('NotificacionesService', () => {
  let service: NotificacionesService
  let httpMock: HttpTestingController

  beforeEach(() => {
    applyAppConfig({
      apiUrl: 'http://localhost:8090/api/gos/',
      apiUrlhttps: 'http://localhost:8090/api/gos/',
    })
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificacionesService]
    })
    service = TestBed.inject(NotificacionesService)
    httpMock = TestBed.inject(HttpTestingController)
    sessionStorage.setItem('user', 'gos')
  })

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('enviarANotifica usa usuContr dinámico', () => {
    service.enviarANotifica(42).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}notificacion/enviarNotifica/42`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.usuContr).toBe('gos');
    req.flush({ mensaje: 'ok' });
  });

  it('consultarEnvioNotifica llama al endpoint correcto', () => {
    service.consultarEnvioNotifica(7).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}notificacion/envioNotifica/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ idEnvioExterno: 'MOCK-1' });
  });
});
