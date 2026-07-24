import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { CrearNotificacion, ModeloTeuCrear, ModeloTeuListar } from '../../expedientes'
import { NotificationService } from '../../../../core/service/notification.service'
import { NotificacionesService } from '../../services/notificaciones.service'
import { environment } from 'src/environments/environment'
import {
  ModeloTeuRegenerarRequest,
  ModeloTeuXmlResponse,
  NotificacionActualizacionTeu,
} from '../../../../core/models/modelo-teu.dto'
import { crearModeloTeuInicial, validarCamposObligatoriosTeu, isFechaTeuInvalida } from './notificaciones-form.validator'
import {
  cerrarModalTeu,
  downloadTeuXml,
  limpiarErroresFormularioTeu,
} from './notificaciones-modal.helper'

/** Template-driven form TEU (#teuForm); submitted se usa para mostrar validaciones. */
export interface TeuFormRefLike {
  submitted: boolean
  valid?: boolean
}

export interface EditaExpedienteTeuHost {
  TextoLegal: string
  IDModel: number
  teuFormRef: TeuFormRefLike | null
  usuContrl: string | null
  descargoTEU: boolean
  verxml: boolean
  xmlTeu: string | null
  xmlDescargado: string | null
  cdr: ChangeDetectorRef
  descargaXml(): void
  actualizarSourceNotificaciones(): void
  refresSourceListarNotifi(): void
}

function extractXmlContent(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  if (payload && typeof payload === 'object' && 'text' in payload) {
    const text = (payload as { text?: unknown }).text
    return typeof text === 'string' && text.trim() ? text : null
  }
  if (payload && typeof payload === 'object' && 'xml' in payload) {
    const xml = (payload as ModeloTeuXmlResponse).xml
    return typeof xml === 'string' && xml.trim() ? xml : null
  }
  return null
}

/** Estado y operaciones TEU (extraído de NotificacionesUiFacade). */
@Injectable()
export class EditaExpedienteNotificacionesTeuFacade {
  private readonly destroyRef = inject(DestroyRef)
  private readonly http = inject(HttpClient)
  private readonly notificationService = inject(NotificationService)
  private readonly notificacionesService = inject(NotificacionesService)
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  public mostrarBotonDescargaTEU = false
  public mostrarValidacionesTEU = false
  public modeloteucrear: ModeloTeuCrear = new ModeloTeuCrear()
  public modeloteulistar: ModeloTeuListar[] = []

  private getIdNotificacion: () => number = () => 0
  private setDescargaTeuPrincipal: (value: boolean) => void = () => undefined
  private resolveTeuHost: (host?: EditaExpedienteTeuHost) => EditaExpedienteTeuHost = () => {
    throw new Error('TEU host no enlazado')
  }

  bind(deps: {
    getIdNotificacion: () => number
    setDescargaTeuPrincipal: (value: boolean) => void
    resolveTeuHost: (host?: EditaExpedienteTeuHost) => EditaExpedienteTeuHost
  }): void {
    this.getIdNotificacion = deps.getIdNotificacion
    this.setDescargaTeuPrincipal = deps.setDescargaTeuPrincipal
    this.resolveTeuHost = deps.resolveTeuHost
  }

  inicializarFormulario(): ModeloTeuCrear {
    return crearModeloTeuInicial()
  }

  limpiarFormularioTeu(hostParam?: EditaExpedienteTeuHost): void {
    const host = this.resolveTeuHost(hostParam)
    this.modeloteucrear = crearModeloTeuInicial()
    this.mostrarBotonDescargaTEU = false
    this.setDescargaTeuPrincipal(false)
    this.mostrarValidacionesTEU = false

    if (host.teuFormRef) {
      host.teuFormRef.submitted = false
    }
    limpiarErroresFormularioTeu()
  }

  cerrarModal(hostParam?: EditaExpedienteTeuHost): void {
    const host = this.resolveTeuHost(hostParam)
    cerrarModalTeu(
      () => this.limpiarFormularioTeu(host),
      () => host.cdr.detectChanges(),
    )
  }

  crearModeloTeuFichero(hostParam?: EditaExpedienteTeuHost): void {
    const host = this.resolveTeuHost(hostParam)
    this.mostrarValidacionesTEU = true
    if (host.teuFormRef) {
      host.teuFormRef.submitted = true
    }

    if (!validarCamposObligatoriosTeu(this.modeloteucrear)) {
      this.notificationService.error({
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos obligatorios marcados con *',
      })
      return
    }

    host.IDModel = this.modeloteucrear.idModel
    this.paraTextoLegar(host)

    this.notificacionesService
      .crearModeloTeuFichero(this.modeloteucrear, this.getIdNotificacion(), host.TextoLegal)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.procesarRespuestaExitosa(host),
        error: (error: HttpErrorResponse) => this.procesarErrorTeu(host, error),
      })
  }

  descargarFichero(hostParam?: EditaExpedienteTeuHost): void {
    const host = this.resolveTeuHost(hostParam)
    if (host.xmlDescargado) {
      downloadTeuXml(host.xmlDescargado)
      this.notificationService.success({
        title: 'Descarga completada',
        text: 'El fichero TEU se ha descargado correctamente.',
      })
      return
    }

    this.notificationService.info({
      title: 'Regenerando fichero TEU',
      text: 'Se está regenerando el fichero TEU, por favor espere...',
    })

    this.regenerarModelo(host)
  }

  private regenerarModelo(host: EditaExpedienteTeuHost): void {
    const datosTEU: ModeloTeuRegenerarRequest = {
      idNotif: this.getIdNotificacion(),
      datoperso: true,
      incltex: true,
      leygene: true,
    }

    this.http.post<ModeloTeuXmlResponse>(`${environment.apiUrl}modeloteu/crear`, datosTEU, { headers: this.httpHeaders }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        const xml = extractXmlContent(response)
        if (xml) {
          host.xmlDescargado = xml
          downloadTeuXml(xml)
          this.notificationService.success({
            title: 'Descarga completada',
            text: 'El fichero TEU se ha regenerado y descargado correctamente.',
          })
        } else {
          this.notificationService.error({
            text: 'No se pudo regenerar el fichero TEU.',
          })
        }
      },
      error: () => {
        this.notificationService.error({
          text: 'No se pudo regenerar el fichero TEU. Inténtelo de nuevo.',
        })
      },
    })
  }

  private buildDatosActualizacion(host: EditaExpedienteTeuHost): NotificacionActualizacionTeu {
    const fechaActual = new Date().toISOString().split('T')[0]
    return {
      idNotif: this.getIdNotificacion(),
      fecEnvio: new Date(fechaActual),
      usuContr: host.usuContrl || '',
      email: this.modeloteucrear.email,
      url: this.modeloteucrear.url,
      indMater: this.modeloteucrear.idMater,
      fecGener: this.modeloteucrear.fecGener,
      fecSolic: this.modeloteucrear.fecSolic,
      fecFirma: this.modeloteucrear.fecFirma,
      forPubli: this.modeloteucrear.forPubli,
      procedimiento: this.modeloteucrear.procedimiento,
      idModel: this.modeloteucrear.idModel,
      incLgt: this.modeloteucrear.incLgt,
      texPlura: this.modeloteucrear.texPlura,
      datPerso: this.modeloteucrear.datPerso,
      edicionManual: true,
    }
  }

  private aplicarExitoGeneracion(host: EditaExpedienteTeuHost): void {
    host.descargoTEU = true
    host.verxml = true
    host.descargaXml()
    this.mostrarBotonDescargaTEU = true
    this.setDescargaTeuPrincipal(true)
    this.cerrarModal(host)

    setTimeout(() => {
      host.refresSourceListarNotifi()
      host.cdr.detectChanges()
    }, 300)

    setTimeout(() => {
      this.notificationService.success({
        title: 'Éxito',
        text: 'Se ha generado el Modelo T.E.U. correctamente.',
      })
    }, 500)
  }

  private procesarRespuestaExitosa(host: EditaExpedienteTeuHost): void {
    const datosActualizacion = this.buildDatosActualizacion(host)

    this.notificacionesService
      .editarNotificacion(datosActualizacion as unknown as CrearNotificacion, this.getIdNotificacion())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          host.actualizarSourceNotificaciones()
          this.aplicarExitoGeneracion(host)
        },
        error: () => {
          host.actualizarSourceNotificaciones()
          this.aplicarExitoGeneracion(host)
        },
      })
  }

  private procesarErrorTeu(host: EditaExpedienteTeuHost, error: HttpErrorResponse): void {
    if (error.status === 200) {
      const xml = extractXmlContent(error.error)
      host.xmlTeu = xml
      host.xmlDescargado = xml
      this.procesarRespuestaExitosa(host)
      return
    }

    host.verxml = false
    this.notificationService.error({
      text: 'No se ha generado el Modelo T.E.U.',
    })
  }

  paraTextoLegar(hostParam?: EditaExpedienteTeuHost): void {
    const host = this.resolveTeuHost(hostParam)
    if (!this.modeloteulistar?.length) {
      return
    }

    for (let index = 0; index < this.modeloteulistar.length; index++) {
      const modelo = this.modeloteulistar[index]
      if (modelo.idModel == host.IDModel || modelo.idModel == this.modeloteucrear.idModel) {
        this.modeloteucrear.texlegal = modelo.texLegal
        host.TextoLegal = modelo.texLegal
      }
    }
  }

  isFechaSolicInvalid(_host?: EditaExpedienteTeuHost): boolean {
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecSolic)
  }

  isFechaGenerInvalid(_host?: EditaExpedienteTeuHost): boolean {
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecGener)
  }

  isFechaFirmaInvalid(_host?: EditaExpedienteTeuHost): boolean {
    return isFechaTeuInvalida(this.mostrarValidacionesTEU, this.modeloteucrear.fecFirma)
  }
}
