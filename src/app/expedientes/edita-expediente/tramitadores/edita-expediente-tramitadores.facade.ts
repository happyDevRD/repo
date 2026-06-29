import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
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
    Swal.fire({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Tramitador',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteTramitador(host.idTramitador).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Tramitador');
          this.refrescarGrid(host);
          setTimeout(host.recargarpagina, 1500);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            Swal.fire({
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
