import { Injectable, inject } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { InsideExpedienteOrchestrator } from './inside-expediente.orchestrator'
import { InsideEnvioRegistroService } from './inside-envio-registro.service'
import { NotificationService } from '../notification.service'

@Injectable({
  providedIn: 'root',
})
export class InsidePostCierreService {
  private readonly orchestrator = inject(InsideExpedienteOrchestrator)
  private readonly envioRegistroService = inject(InsideEnvioRegistroService)
  private readonly notificationService = inject(NotificationService)

  ofrecerEnvioTrasCierre(expedienteId: number): void {
    if (environment.inside.ofrecerEnvioTrasCierre === false) {
      return
    }

    if (environment.inside.autoEnvioOnClose === true) {
      this.ejecutarEnvio(expedienteId)
      return
    }

    const dryRun = environment.inside.dryRun === true
    const etiquetaDryRun = dryRun
      ? '<p class="text-info"><strong>Modo simulación:</strong> sin acceso a REDSARA.</p>'
      : ''

    this.notificationService.confirm({
      title: 'Expediente cerrado',
      html: `${etiquetaDryRun}<p>Se ha generado el XML ENI del expediente. ¿Desea enviarlo a INSIDE?</p>`,
      confirmButtonText: 'Enviar a INSIDE',
      cancelButtonText: 'Más tarde',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      this.ejecutarEnvio(expedienteId)
    })
  }

  private ejecutarEnvio(expedienteId: number): void {
    const dryRun = environment.inside.dryRun === true
    const etiquetaDryRun = dryRun
      ? '<p class="text-info"><strong>Modo simulación:</strong> sin acceso a REDSARA.</p>'
      : ''

    this.orchestrator.altaExpedienteEniXmlDesdeExpediente(expedienteId).subscribe({
      next: (respuesta) => {
        this.envioRegistroService.registrarDesdeRespuesta(
          expedienteId,
          'altaExpedienteEniXml',
          respuesta,
          { dryRun },
        )
        this.notificationService.success({
          title: `Envío INSIDE${dryRun ? ' (simulación)' : ''}`,
          html: `
            ${etiquetaDryRun}
            <p><strong>Código:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
            <p><strong>Identificador:</strong> ${respuesta.identificador ?? '-'}</p>
            ${respuesta.csv ? `<p><strong>CSV:</strong> ${respuesta.csv}</p>` : ''}
          `,
        })
      },
      error: (error: Error) => {
        this.envioRegistroService.registrar({
          expedienteId,
          operacion: 'altaExpedienteEniXml',
          estadoEnvio: 'ERROR',
          fecha: new Date().toISOString(),
          dryRun,
          mensajeError: error?.message,
        })
        this.notificationService.error({
          title: 'Error INSIDE',
          text: error?.message ?? 'No se pudo enviar el expediente a INSIDE.',
        })
      },
    })
  }
}
