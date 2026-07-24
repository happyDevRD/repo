import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { environment } from 'src/environments/environment'
import { ArchivoFirmadoEF } from '../../expedientes'
import { NotificationService } from '../../../../core/service/notification.service'
import { ExpedientesService } from '../../expedientes.service'

export interface FirmaTareaHost {
  idTarea: number
  idTramite: number
  sourceTareasTramite: unknown
  archivofirmadoef: ArchivoFirmadoEF
  usuContrl: string | null
  numeroArchivo: unknown
  descargaficheroFirmado: string
  spinnervisiblefirma: boolean
  firmaAtendida: boolean
  firmaDesatendida: boolean
  refrescoSourceTareasTramite(id: number): void
}

@Injectable()
export class EditaExpedienteTareasFirmaFacade {
  private readonly destroyRef = inject(DestroyRef)
  private readonly http = inject(HttpClient)
  private readonly expedientesService = inject(ExpedientesService)
  private readonly notificationService = inject(NotificationService)

  private refrescarGridAdapter: (host: FirmaTareaHost) => void = () => undefined

  bind(deps: { refrescarGridAdapter: (host: FirmaTareaHost) => void }): void {
    this.refrescarGridAdapter = deps.refrescarGridAdapter
  }

  limpiarArchivoFirmaEF(host: FirmaTareaHost): void {
    host.archivofirmadoef = new ArchivoFirmadoEF()
  }

  cargarTipoFirma(host: FirmaTareaHost): void {
    this.expedientesService.getTipoFirma(host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        switch (error.error?.text) {
          case 'ATENDIDA':
            host.firmaAtendida = true
            host.firmaDesatendida = false
            break
          case 'DESATENDIDA':
            host.firmaAtendida = false
            host.firmaDesatendida = true
            break
          default:
            host.firmaAtendida = false
            host.firmaDesatendida = false
            break
        }
      },
    })
  }

  enviarFirmaAtendida(host: FirmaTareaHost): void {
    host.spinnervisiblefirma = false

    const form = host.archivofirmadoef
    if (!form.asunto || !form.prioridad || !form.texto) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.')
      return
    }

    this.expedientesService.getTipoFirma(host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        if (error.error?.text === 'ATENDIDA') {
          this.expedientesService
            .postArchivoFirmadoEF(form, host.usuContrl, host.idTarea)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.success({ title: 'Envio de firma ATENDIDA realizado con exito!' })
                this.limpiarArchivoFirmaEF(host)
                this.refrescarGridAdapter(host)
                host.spinnervisiblefirma = true
              },
              error: (err: HttpErrorResponse) => {
                this.notificationService.warning({ title: err.error?.message })
                host.spinnervisiblefirma = true
              },
            })
        }

        if (error.error?.text === undefined) {
          this.notificationService.warning('La Tarea de Procedimiento no tiene Proceso firmado')
        }
      },
    })
  }

  enviarFirmaDesatendida(host: FirmaTareaHost): void {
    this.expedientesService.postArchivoFirmadoEFDesatendida(host.usuContrl, host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success({ title: 'Envio de firma realizado con exito!' })
        this.limpiarArchivoFirmaEF(host)
        this.refrescarGridAdapter(host)
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.warning({ title: err.error?.message })
      },
    })
  }

  descargarArchivoFirmado(host: FirmaTareaHost): void {
    host.descargaficheroFirmado = `${environment.apiUrl}archivo/firma/${host.numeroArchivo}/${host.usuContrl}/${host.idTarea}`

    if (!host.numeroArchivo) {
      this.notificationService.warning('Esta tarea No tiene ningún documento asociado')
      return
    }

    this.http.get(host.descargaficheroFirmado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {},
      error: (err: HttpErrorResponse) => {
        if (err.status === 200) {
          this.notificationService.success({
            position: 'center',
            title: 'Firma realizado con exito',
            showConfirmButton: false,
            timer: 2500,
          })
          host.refrescoSourceTareasTramite(host.idTramite)
        } else {
          this.notificationService.warning({ title: err.error?.message })
        }

        this.refrescarGridAdapter(host)
        host.refrescoSourceTareasTramite(host.idTramite)
      },
    })
  }
}
