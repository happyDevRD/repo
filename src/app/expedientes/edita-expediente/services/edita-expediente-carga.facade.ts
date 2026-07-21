import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TramiteExpedienteDto } from '../../../core/models/tramite-expediente.dto';
import { LeerNotificacion, VerExpediente } from '../../expedientes';
import { ExpedientesService } from '../../expedientes.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { TramitesService } from '../../tramites.service';

export interface EditaExpedienteCargaHost {
  idExpediente: number;
  atrasruta: string;
  verExpediente: VerExpediente;
  tramiteExpedienteListar: TramiteExpedienteDto[];
  inicializarSourceListarNotifi(): void;
  actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]): void;
  getListarInteresado(idexp: number): void;
  getListarTramites(id: number): void;
  cargarEstadoInside?(idExpediente: number): void;
}

@Injectable()
export class EditaExpedienteCargaFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly tramitesService: TramitesService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  cargarDesdeRuta(host: EditaExpedienteCargaHost, activatedRoute: ActivatedRoute): void {
    activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((params) => {
      const id = Number(params['id']);
      if (!id) {
        return;
      }

      host.idExpediente = id;
      host.atrasruta = `editaexpediente/${id}`;
      host.getListarTramites(id);
      host.cargarEstadoInside?.(id);

      this.expedientesService.getExpediente(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (verExpediente: VerExpediente) => {
          host.verExpediente = verExpediente;
          host.inicializarSourceListarNotifi();
          host.getListarInteresado(host.idExpediente);
          this.cargarLeerNotificaciones(host);
        },
        error: (error) => {
          if (error.status === 0) {
            console.error('NO HAY CONEXION CON LA BASE DE DATOS!!!!!');
          }
        },
      });

      this.tramitesService.getTramiteExpediente(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (tramiteExpedientelista: TramiteExpedienteDto[]) => {
          host.tramiteExpedienteListar = tramiteExpedientelista;
        },
        error: (error) => {
          if (error.status === 0) {
            console.error('NO HAY CONEXION CON LA BASE DE DATOS!!!!!');
          }
        },
      });
    });
  }

  private cargarLeerNotificaciones(host: EditaExpedienteCargaHost): void {
    const { ejercicio, numero } = host.verExpediente;
    if (!ejercicio || !numero) {
      return;
    }

    this.notificacionesService.getNotificacionListar(ejercicio, numero).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (leerNotificacion) => host.actualizarGridNotificaciones(leerNotificacion ?? []),
      error: () => host.actualizarGridNotificaciones([]),
    });
  }
}
