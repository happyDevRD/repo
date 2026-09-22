import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AppConfigService } from './app-config.service'
import { runtimeConfig } from './runtime-config'

describe('AppConfigService', () => {
  let service: AppConfigService
  let httpMock: HttpTestingController

  beforeEach(() => {
    runtimeConfig.apiUrl = ''
    runtimeConfig.apiUrlhttps = ''
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppConfigService],
    })
    service = TestBed.inject(AppConfigService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('load aplica apiUrl con barra final', async () => {
    const promise = service.load()
    const req = httpMock.expectOne((r) => r.url.includes('assets/config.json'))
    expect(req.request.headers.get('Cache-Control')).toContain('no-store')
    req.flush({
      apiUrl: 'http://example.test:8090/api/gos',
      apiUrlhttps: 'https://example.test:8443/api/gos',
    })
    await promise
    expect(runtimeConfig.apiUrl).toBe('http://example.test:8090/api/gos/')
    expect(runtimeConfig.apiUrlhttps).toBe('https://example.test:8443/api/gos/')
  })

  it('load falla si falta apiUrl', async () => {
    const promise = service.load()
    const req = httpMock.expectOne((r) => r.url.includes('assets/config.json'))
    req.flush({ apiUrl: '', apiUrlhttps: 'http://x/' })
    await expectAsync(promise).toBeRejected()
  })
})
