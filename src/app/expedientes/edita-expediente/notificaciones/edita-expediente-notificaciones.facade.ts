import { Injectable } from '@angular/core';
import { EnvioNotificaInfo } from '../../notificaciones/notificaciones-notifica-panel.component';
import {
  MotivoNotificacionesListar,
  NotificadorListar,
  ReceptorNotifiListar,
} from '../../expedientes';
import { NotificacionesService } from '../../services/notificaciones.service';
import {
  buildNotificacionGridSource,
  createNotificacionGridAdapter,
  NotificacionGridSourceOptions,
} from './notificaciones-grid.config';

export interface NotificacionCatalogos {
  receptornotifilistar: ReceptorNotifiListar[];
  motivonotificacioneslistar: MotivoNotificacionesListar[];
  notificadorlistar: NotificadorListar[];
}

@Injectable()
export class EditaExpedienteNotificacionesFacade {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  loadCatalogos(target: Partial<NotificacionCatalogos>): void {
    this.notificacionesService.getReceptorNofitiListar().subscribe(
      (data) => (target.receptornotifilistar = data),
    );
    this.notificacionesService.getMotivoNofitiListar().subscribe(
      (data) => (target.motivonotificacioneslistar = data),
    );
    this.notificacionesService.getNotificadorListar().subscribe(
      (data) => (target.notificadorlistar = data),
    );
  }

  createGridAdapter(
    ejercicio: number,
    numero: number,
    options?: NotificacionGridSourceOptions,
  ): any {
    return createNotificacionGridAdapter(ejercicio, numero, options);
  }

  createGridSource(
    ejercicio: number,
    numero: number,
    options?: NotificacionGridSourceOptions,
  ): Record<string, unknown> {
    return buildNotificacionGridSource(ejercicio, numero, options);
  }

  registerGridWindowCallbacks(handlers: {
    verNotificacion: (id: number) => void;
    editarNotificacion: (id: number) => void;
  }): void {
    (window as any).verNotificacion = handlers.verNotificacion;
    (window as any).editarNotificacion = handlers.editarNotificacion;
  }

  cargarEnvioNotificaActivo(
    idNotificacion: number,
    onResult: (envio: EnvioNotificaInfo | null) => void,
  ): void {
    if (!idNotificacion) {
      onResult(null);
      return;
    }

    this.notificacionesService.consultarEnvioNotifica(idNotificacion).subscribe({
      next: (envio) => {
        onResult(
          envio
            ? {
                idEnvioExterno: envio.idEnvioExterno,
                estadoNotifica: envio.estadoNotifica,
                fecEnvio: envio.fecEnvio,
                idAcuseExterno: envio.idAcuseExterno,
              }
            : null,
        );
      },
      error: () => onResult(null),
    });
  }
}
