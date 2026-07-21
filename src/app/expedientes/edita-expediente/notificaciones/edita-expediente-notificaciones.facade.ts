import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvioNotificaInfo } from '../../notificaciones/notificaciones-notifica-panel.component';
import {
  LeerNotificacion,
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
import { calcularFechasNotificacion, FechasNotificacionOrdenadas } from './notificaciones-fechas.helper';

export interface NotificacionCatalogos {
  receptornotifilistar: ReceptorNotifiListar[];
  motivonotificacioneslistar: MotivoNotificacionesListar[];
  notificadorlistar: NotificadorListar[];
}

export interface NotificacionListadoHost {
  verExpediente: { ejercicio: number; numero: number };
  actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]): void;
}

@Injectable()
export class EditaExpedienteNotificacionesFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly notificacionesService: NotificacionesService) {}

  loadCatalogos(target: Partial<NotificacionCatalogos>): void {
    this.notificacionesService.getReceptorNofitiListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (data) => (target.receptornotifilistar = data),
    );
    this.notificacionesService.getMotivoNofitiListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (data) => (target.motivonotificacioneslistar = data),
    );
    this.notificacionesService.getNotificadorListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
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

    this.notificacionesService.consultarEnvioNotifica(idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
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

  listarNotificacionesDelExpediente(host: NotificacionListadoHost): void {
    const { ejercicio, numero } = host.verExpediente;
    if (!ejercicio || !numero) {
      return;
    }

    this.notificacionesService.getNotificacionListar(ejercicio, numero).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (leernotificacion) => host.actualizarGridNotificaciones(leernotificacion ?? []),
      error: () => host.actualizarGridNotificaciones([]),
    });
  }

  aplicarFechasNotificacion(
    host: FechasNotificacionOrdenadas,
    fenvio: unknown,
    frecep: unknown,
    fpubli: unknown,
    femision: unknown,
  ): void {
    Object.assign(host, calcularFechasNotificacion(fenvio, frecep, fpubli, femision));
  }
}
