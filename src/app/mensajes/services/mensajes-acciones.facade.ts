import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  EditarMensaje,
  LeeMensaje,
  RechazarMensaje,
} from '../../expedientes/expedientes';
import { NotificationService } from '../../core/service/notification.service';
import { MensajesService } from './mensajes.service';

export interface MensajesAccionesHost {
  editarmensaje: EditarMensaje;
  rechazamensaje: RechazarMensaje;
  leemensaje: LeeMensaje;
  fecha: Date;
  idMensaje: number;
  idMensajeRecibido: number;
  mensajeEstado: string;
  mensajeRemitente: string;
  mensajeDescripcion: string;
  actualizarGrids(): void;
  recargarpagina(): void;
}

@Injectable()
export class MensajesAccionesFacade {
  constructor(
    private readonly mensajesService: MensajesService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  tramitar(host: MensajesAccionesHost): void {
    if (host.mensajeEstado === 'LEIDO' || host.mensajeEstado === 'PENDIENTE') {
      this.notificationService.confirm({
        title: '¿Está seguro?',
        text: 'Esta acción no se podrá revertir',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (!result.isConfirmed) {
          return;
        }
        this.mensajesService.tramitar(host.editarmensaje, host.idMensaje).subscribe(() => {
          host.actualizarGrids();
          this.notificationService.success('El Mensaje fue tramitado.');
        });
      });
      return;
    }
    if (host.mensajeEstado === 'TRAMITANDO') {
      this.notificationService.warning('Este mensaje ya se encuentra en Tratamitación');
      return;
    }
    if (host.mensajeEstado === 'RECHAZADO') {
      this.notificationService.warning('Este mensaje se encuentra en estado RECHAZADO');
    }
  }

  editar(host: MensajesAccionesHost): void {
    if (host.leemensaje.fecLectura == null) {
      host.editarmensaje.fecLectura = host.fecha;
      host.editarmensaje.estado = 'LEIDO';
    }
    if (host.leemensaje.estado === 'LEIDO' || host.leemensaje.estado === 'PENDIENTE') {
      host.editarmensaje.estado = 'LEIDO';
    }
    if (host.leemensaje.estado === 'TRAMITADO') {
      host.editarmensaje.estado = 'TRAMITADO';
    }
    this.mensajesService.editar(host.editarmensaje, host.idMensaje).subscribe(() => {
      this.router.navigate(['/mensajes']);
      setTimeout(() => host.recargarpagina(), 1000);
    });
  }

  rechazar(host: MensajesAccionesHost): void {
    if (!host.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }
    if (host.mensajeEstado !== 'PENDIENTE' && host.mensajeEstado !== 'LEIDO') {
      this.notificationService.warning(
        `Este Mensaje No se puede Rechazar,por encontrarse con el  estado: ${host.mensajeEstado}`,
      );
      return;
    }
    host.rechazamensaje.fecRechazo = host.fecha;
    host.rechazamensaje.estado = 'RECHAZADO';
    host.rechazamensaje.destinatario = host.mensajeRemitente;
    this.mensajesService.rechazar(host.rechazamensaje, host.idMensajeRecibido).subscribe(() => {
      this.router.navigate(['/mensajes']);
      host.actualizarGrids();
      setTimeout(() => host.recargarpagina(), 1000);
    });
  }

  marcarLeido(host: MensajesAccionesHost): void {
    if (host.mensajeEstado !== 'PENDIENTE') {
      return;
    }
    host.rechazamensaje.fecLectura = host.fecha;
    host.rechazamensaje.estado = 'LEIDO';
    this.mensajesService.marcarLeido(host.rechazamensaje, host.idMensajeRecibido).subscribe(() => {
      setTimeout(() => host.recargarpagina(), 1000);
    });
  }

  borrar(host: MensajesAccionesHost): void {
    this.notificationService.confirm({
      title: 'Está seguro?',
      text: `El mensaje : " ${host.mensajeDescripcion} ". Una vez borrado no podrá recuperarlo`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.mensajesService.borrar(host.idMensajeRecibido).subscribe(() => {
        this.router.navigate(['/mensajes']);
        setTimeout(() => host.recargarpagina(), 1000);
        this.notificationService.success('El mensaje fue Borrado.');
      });
    });
  }

  limpiarRechazo(host: MensajesAccionesHost): void {
    host.rechazamensaje = new RechazarMensaje();
  }
}
