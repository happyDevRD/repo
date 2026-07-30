import { DestroyRef, ElementRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { FileUploadService } from '../../../core/service/file-upload.service'
import { UserSessionService } from '../../../core/service/user-session.service'
import { NotificationService } from '../../../core/service/notification.service'
import { fechaHoyISO } from '../../../core/helper/fecha-legacy.helper'
import { DocumentosListar } from '../models'
import { SolicitudesService } from '../solicitudes.service'
import { SolicitudesGridHost } from './solicitudes-grid.facade'

export interface SolicitudesDocumentosListaHost {
  idsolicitud: number
  documentosSolicitud: DocumentosListar[]
  documentosCargando: boolean
  iddocumento: number | null
  listadocmenu: boolean
  nombreArchivoSubido: string | null
  descargafichero: unknown
}

export interface SolicitudesDocumentosHost extends SolicitudesGridHost, SolicitudesDocumentosListaHost {
  selectedFile: File | null
  base64code: string | null
  descripcionArchivo: string
  subidaArchivo: boolean
  documentoslistar: unknown
  fileInput?: ElementRef
  name: string
  id: number
  myimage: unknown
  progreso: number
  clearUploadForm(): void
  updateProgressBar(): void
  cerrarModal(modalId: string): void
  abrirModal(modalId: string): void
}

@Injectable()
export class SolicitudesDocumentosFacade {
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly http: HttpClient,
    private readonly solicitudesService: SolicitudesService,
    private readonly fileUploadService: FileUploadService,
    private readonly session: UserSessionService,
    private readonly notificationService: NotificationService,
  ) {}

  cargarLista(host: SolicitudesDocumentosListaHost, idSolicitud?: number | string): void {
    const id = idSolicitud ?? host.idsolicitud
    host.documentosCargando = true
    host.iddocumento = null
    host.listadocmenu = false
    host.nombreArchivoSubido = null
    host.descargafichero = null

    if (!id) {
      host.documentosSolicitud = []
      host.documentosCargando = false
      return
    }

    this.solicitudesService.getDocumentosPorSolicitud(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (docs) => {
        host.documentosSolicitud = docs ?? []
        host.documentosCargando = false
      },
      error: () => {
        host.documentosSolicitud = []
        host.documentosCargando = false
        this.notificationService.warning({
          title: 'Documentos',
          text: 'No se pudieron cargar los documentos de la solicitud.',
        })
      },
    })
  }

  guardar(host: SolicitudesDocumentosHost): void {
    if (!host.selectedFile || !host.base64code) {
      this.notificationService.warning({
        title: 'No hay archivo seleccionado',
        text: 'Por favor, selecciona un archivo antes de guardar.',
      })
      return
    }

    if (!host.descripcionArchivo || host.descripcionArchivo.trim() === '') {
      this.notificationService.warning({
        title: 'Descripción obligatoria',
        text: 'Por favor, introduce una descripción antes de guardar.',
      })
      return
    }

    host.subidaArchivo = true

    const uploadData = {
      descripcion: host.descripcionArchivo,
      fechaSubida: fechaHoyISO(),
      usuContr: this.session.user,
      idSolicitud: host.idsolicitud,
      nombreArchivo: host.selectedFile.name,
      ficBas64: host.base64code,
    }

    this.http.post(`${environment.apiUrl}documentoSolicitud/crear`, JSON.stringify(uploadData), {
      headers: this.httpHeaders,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.subidaArchivo = false
        this.fileUploadService.showUploadSuccess(host.selectedFile!.name)
        host.clearUploadForm()

        const modal = document.getElementById('documentoModal')
        if (modal) {
          const modalInstance = (window as {
            bootstrap?: { Modal?: { getInstance: (el: Element) => { hide: () => void } | null } }
          }).bootstrap?.Modal?.getInstance(modal)
          if (modalInstance) {
            modalInstance.hide()
          } else {
            host.cerrarModal('documentoModal')
          }
        }

        this.cargarLista(host)
      },
      error: (error) => {
        host.subidaArchivo = false
        const backendMessage = typeof error?.error === 'string'
          ? error.error
          : error?.error?.message
        this.fileUploadService.showUploadError(backendMessage || 'Error al subir el archivo')
      },
    })
  }

  eliminar(host: SolicitudesDocumentosHost, id: number | null): void {
    this.notificationService.confirm({
      title: '¿Confirma eliminar el documento?',
      text: host.nombreArchivoSubido ?? '',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed || id === null) {
        return
      }

      this.solicitudesService.deleteDocumento(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({
            title: 'Eliminado',
            text: 'Documento eliminado satisfactoriamente.',
          })
          this.cargarLista(host)
        },
      })
    })
  }

  seleccionarArchivo(host: SolicitudesDocumentosHost, event: Event, id: number): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) {
      return
    }

    if (!host.descripcionArchivo || host.descripcionArchivo.trim() === '') {
      this.notificationService.warning({
        title: 'Descripción obligatoria',
        text: 'Por favor, introduce una descripción antes de seleccionar el archivo.',
      })
      if (host.fileInput) {
        this.fileUploadService.clearFileInput(host.fileInput.nativeElement)
      }
      return
    }

    const validation = this.fileUploadService.validateFile(file, {
      maxFileSize: 50,
      allowedTypes: ['.pdf', '.docx', '.odt', '.jpg', '.jpeg', '.png'],
      timeout: 300000,
      retryAttempts: 3,
      showProgress: true,
    })
    if (!validation.valid) {
      this.notificationService.error({
        title: 'Archivo no válido',
        text: validation.error,
      })
      if (host.fileInput) {
        this.fileUploadService.clearFileInput(host.fileInput.nativeElement)
      }
      return
    }

    host.selectedFile = file
    host.name = file.name
    host.id = id
    this.readFileAsBase64(file).then((base64) => {
      host.base64code = base64
      host.myimage = base64
    })

    this.notificationService.success({
      title: 'Archivo seleccionado',
      text: `Archivo "${file.name}" seleccionado correctamente. Presiona "Guardar" para subirlo.`,
      timer: 2000,
      timerProgressBar: true,
    })
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = String(reader.result ?? '')
        const parts = result.split(',')
        resolve(parts[1] ?? '')
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  clearForm(host: SolicitudesDocumentosHost): void {
    host.descripcionArchivo = null as unknown as string
    host.base64code = ''
    host.id = 0
    host.name = ''
    host.selectedFile = null
    if (host.fileInput) {
      this.fileUploadService.clearFileInput(host.fileInput.nativeElement)
    }
  }

  private buildDescargaUrl(archivo: string | number | null | undefined): string {
    if (archivo == null || String(archivo).trim() === '') {
      return ''
    }
    return `${environment.apiUrl}archivo/descargaSolicitud/${archivo}`
  }

  private esPdf(nombreArchivo: string | null | undefined): boolean {
    return String(nombreArchivo ?? '').trim().toLowerCase().endsWith('.pdf')
  }

  private esImagen(nombreArchivo: string | null | undefined): boolean {
    const nombre = String(nombreArchivo ?? '').trim().toLowerCase()
    return nombre.endsWith('.jpg') || nombre.endsWith('.jpeg') || nombre.endsWith('.png')
  }

  private mimeDesdeNombre(nombreArchivo: string | null | undefined): string {
    const nombre = String(nombreArchivo ?? '').trim().toLowerCase()
    if (nombre.endsWith('.pdf')) {
      return 'application/pdf'
    }
    if (nombre.endsWith('.png')) {
      return 'image/png'
    }
    if (nombre.endsWith('.jpg') || nombre.endsWith('.jpeg')) {
      return 'image/jpeg'
    }
    if (nombre.endsWith('.docx')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    if (nombre.endsWith('.odt')) {
      return 'application/vnd.oasis.opendocument.text'
    }
    return 'application/octet-stream'
  }

  private tiparBlob(blob: Blob, nombreArchivo: string | null | undefined): Blob {
    const mime = this.mimeDesdeNombre(nombreArchivo)
    const tipo = String(blob.type || '').toLowerCase()
    if (!tipo || tipo.includes('octet-stream') || tipo.includes('force-download') || tipo.includes('application/json')) {
      return new Blob([blob], { type: mime })
    }
    return blob
  }

  private triggerDownload(objectUrl: string, nombreArchivo: string): void {
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = nombreArchivo || 'documento'
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  private fetchDocumentoBlob(
    url: string,
    nombreArchivo: string | null | undefined,
  ): void {
    const nombre = String(nombreArchivo ?? '').trim() || 'documento'
    const puedeVer = this.esPdf(nombre) || this.esImagen(nombre)
    const popup = puedeVer ? window.open('about:blank', '_blank') : null

    this.http.get(url, { responseType: 'blob' }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (blob) => {
        const fileBlob = this.tiparBlob(blob, nombre)
        const objectUrl = URL.createObjectURL(fileBlob)

        if (puedeVer && popup && !popup.closed) {
          popup.location.href = objectUrl
          setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
          return
        }

        if (popup && !popup.closed) {
          popup.close()
        }

        this.triggerDownload(objectUrl, nombre)
        if (puedeVer) {
          this.notificationService.info({
            title: 'Documento',
            text: 'El navegador bloqueó la vista previa. Se ha iniciado la descarga.',
          })
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000)
      },
      error: () => {
        if (popup && !popup.closed) {
          popup.close()
        }
        this.notificationService.error({
          title: 'Documento',
          text: 'No se pudo abrir el documento. Inténtelo de nuevo o descárguelo.',
        })
      },
    })
  }

  private downloadDocumentoBlob(
    url: string,
    nombreArchivo: string | null | undefined,
  ): void {
    this.http.get(url, { responseType: 'blob' }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (blob) => {
        const fileBlob = this.tiparBlob(blob, nombreArchivo)
        const objectUrl = URL.createObjectURL(fileBlob)
        const nombre = String(nombreArchivo ?? '').trim() || 'documento'
        this.triggerDownload(objectUrl, nombre)
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000)
      },
      error: () => {
        this.notificationService.error({
          title: 'Descarga',
          text: 'No se pudo descargar el documento.',
        })
      },
    })
  }

  seleccionarDocumento(host: SolicitudesDocumentosHost, doc: DocumentosListar): string {
    const url = this.buildDescargaUrl(doc.archivo)
    host.iddocumento = doc.id ?? null
    host.listadocmenu = true
    host.nombreArchivoSubido = doc.nombreArchivo ?? null
    host.descargafichero = url || null
    return url
  }

  abrirDocumento(host: SolicitudesDocumentosHost, doc: DocumentosListar): void {
    const url = this.seleccionarDocumento(host, doc)
    this.abrirDocumentoSeleccionado(host, url, doc.nombreArchivo)
  }

  descargarDocumento(host: SolicitudesDocumentosHost, doc: DocumentosListar): void {
    const url = this.seleccionarDocumento(host, doc)
    if (!url) {
      this.notificationService.warning({
        title: 'Sin archivo',
        text: 'No hay ruta de descarga para este documento.',
      })
      return
    }
    this.downloadDocumentoBlob(url, doc.nombreArchivo)
  }

  abrirDocumentoSeleccionado(
    host: SolicitudesDocumentosHost,
    url?: string | null,
    nombreArchivo?: string | null,
  ): void {
    const href = String(url ?? host.descargafichero ?? '').trim()
    const nombre = nombreArchivo ?? host.nombreArchivoSubido

    if (!href) {
      this.notificationService.warning({
        title: 'Sin archivo',
        text: 'No hay ruta de descarga para este documento.',
      })
      return
    }

    this.fetchDocumentoBlob(href, nombre)
  }

  iconoDocumento(nombreArchivo: string | null | undefined): string {
    const nombre = String(nombreArchivo ?? '').trim().toLowerCase()
    if (nombre.endsWith('.pdf')) {
      return 'bi-file-earmark-pdf'
    }
    if (nombre.endsWith('.jpg') || nombre.endsWith('.jpeg') || nombre.endsWith('.png')) {
      return 'bi-file-earmark-image'
    }
    if (nombre.endsWith('.docx') || nombre.endsWith('.odt') || nombre.endsWith('.doc')) {
      return 'bi-file-earmark-word'
    }
    return 'bi-file-earmark'
  }

  formatearFecha(fecha: string | null | undefined): string {
    const value = String(fecha ?? '').trim()
    if (value.length < 10) {
      return '—'
    }
    return `${value.substring(8, 10)}/${value.substring(5, 7)}/${value.substring(0, 4)}`
  }

  /** Compatibilidad con handlers legacy del grid. */
  seleccionarDocumentoNuevo(host: SolicitudesDocumentosHost, event: { args: { row: { bounddata: DocumentosListar } } }): void {
    this.seleccionarDocumento(host, event.args.row.bounddata)
  }

  abrirVerDocumento(host: SolicitudesDocumentosHost, event: { args: { row: { bounddata: DocumentosListar } } }): void {
    this.abrirDocumento(host, event.args.row.bounddata)
  }

  refreshLista(host: SolicitudesDocumentosHost): void {
    this.cargarLista(host)
  }
}
