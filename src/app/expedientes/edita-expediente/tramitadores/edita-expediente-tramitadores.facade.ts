import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../core/service/notification.service';
import { ExpedientesService } from '../../expedientes.service';
import { buildTramitadorGridSource } from './tramitadores-grid.config';

export interface EditaExpedienteTramitadoresHost {
  idExpediente: number;
  idTramitador: number;
  sourceTramitadores: unknown;
  recargarpagina(): void;
}

@Injectable()
export class EditaExpedienteTramitadoresFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
  ) {}

  refrescarGrid(host: EditaExpedienteTramitadoresHost): void {
    host.sourceTramitadores = buildTramitadorGridSource(host.idExpediente);
  }

  seleccionarTramitador(host: EditaExpedienteTramitadoresHost, rowData: { id: number }): void {
    host.idTramitador = rowData.id;
  }

  borrarTramitador(host: EditaExpedienteTramitadoresHost): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Tramitador',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteTramitador(host.idTramitador).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Tramitador');
          this.refrescarGrid(host);
          setTimeout(host.recargarpagina, 1500);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
              title: error.error?.message,
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
          }
          this.notificationService.error('No se pudo eliminar el Tramitador');
        },
      });
    });
  }
}
