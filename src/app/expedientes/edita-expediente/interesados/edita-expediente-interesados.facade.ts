import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CrearInteresado, ConsultaDni } from '../../expedientes';
import { NotificationService } from '../../../core/service/notification.service';
import { ExpedientesService } from '../../expedientes.service';

export interface EditaExpedienteInteresadosHost {
  idExpediente: number;
  idInteresado: number;
  crearinteresado: CrearInteresado;
  consultadni: ConsultaDni;
  recargarpagina(): void;
}

@Injectable()
export class EditaExpedienteInteresadosFacade {
  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  crearInteresado(host: EditaExpedienteInteresadosHost): void {
    host.crearinteresado.idHisPerso = host.consultadni.idHisPerso;
    host.crearinteresado.idPerso = host.consultadni.idPerso;
    host.crearinteresado.idexpediente = host.idExpediente;

    this.expedientesService.crearInteresado(host.crearinteresado).subscribe({
      next: () => this.router.navigate([`/editaexpediente/${host.idExpediente}`]),
      error: (error: HttpErrorResponse) => {
        if (error.status !== 500) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se a creado el interesado con exito!!!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'No se pudo crear el nuevo interesado',
            showConfirmButton: false,
            timer: 2500,
          });
        }
      },
    });

    setTimeout(host.recargarpagina, 1000);
  }

  borrarInteresado(host: EditaExpedienteInteresadosHost): void {
    Swal.fire({
      title: '¿ Esta seguro ?',
      text: 'Eliminar interesado',
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

      this.expedientesService.deleteInteresado(host.idInteresado).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Interesado');
          setTimeout(host.recargarpagina, 1500);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            Swal.fire({
              title: 'No se ha podido borrar el elemento. Existen elementos dependientes asociados ',
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
          }
          this.notificationService.error('No se pudo eliminar el Interesado');
        },
      });
    });
  }
}
