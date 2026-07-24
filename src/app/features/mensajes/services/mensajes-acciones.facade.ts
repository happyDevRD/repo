import { Injectable } from '@angular/core'
import { RechazarMensaje } from '../models'
import { NotificationService } from '../../../core/service/notification.service'
import { MensajesService } from '../mensajes.service'

export interface MensajesAccionesHost {
  rechazamensaje: RechazarMensaje
  fecha: Date
  idMensaje: number
  idMensajeRecibido: number
  mensajeEstado: string
  mensajeRemitente: string
  mensajeDescrip: string
  canTramitar: boolean
  canRechazar: boolean
  hasSeleccion: boolean
  actualizarGrids(): void
  clearSeleccion(): void
  contarPendientes(): void
}

@Injectable()
export class MensajesAccionesFacade {
  constructor(
    private readonly mensajesService: MensajesService,
    private readonly notificationService: NotificationService,
  ) {}

  tramitar(host: MensajesAccionesHost): void {
    if (!host.hasSeleccion || !host.canTramitar) {
      this.notificationService.warning('Seleccione un mensaje pendiente o leído para tramitar')
      return
    }
    this.notificationService.confirm({
      title: '¿Tramitar mensaje?',
      text: 'Esta acción no se podrá revertir',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }
      this.mensajesService.tramitar(host.idMensaje).subscribe({
        next: () => {
          host.clearSeleccion()
          host.actualizarGrids()
          this.notificationService.success('El mensaje fue tramitado.')
        },
        error: () => {
          this.notificationService.error('No se pudo tramitar el mensaje')
        },
      })
    })
  }

  rechazar(host: MensajesAccionesHost): void {
    if (!host.hasSeleccion || !host.canRechazar) {
      this.notificationService.warning('Seleccione un mensaje pendiente o leído para rechazar')
      return
    }
    if (!host.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.')
      return
    }
    host.rechazamensaje.fecRechazo = host.fecha
    host.rechazamensaje.estado = 'RECHAZADO'
    host.rechazamensaje.destinatario = host.mensajeRemitente
    this.mensajesService.rechazar(host.rechazamensaje, host.idMensajeRecibido).subscribe({
      next: () => {
        host.clearSeleccion()
        host.actualizarGrids()
        this.notificationService.success('El mensaje fue rechazado.')
      },
      error: () => {
        this.notificationService.error('No se pudo rechazar el mensaje')
      },
    })
  }

  limpiarRechazo(host: MensajesAccionesHost): void {
    host.rechazamensaje = new RechazarMensaje()
  }
}
