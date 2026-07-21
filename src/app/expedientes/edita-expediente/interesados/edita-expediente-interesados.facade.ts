import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CrearInteresado, ConsultaDni } from '../../expedientes';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import { NotificationService } from '../../../core/service/notification.service';
import { ExpedientesService } from '../../expedientes.service';

export interface EditaExpedienteInteresadosHost {
  idExpediente: number;
  idInteresado: number;
  verborrarinteresado: boolean;
  crearinteresado: CrearInteresado;
  consultadni: ConsultaDni;
  listarinteresadosdto: InteresadoListarDto[];
  recargarpagina(): void;
}

@Injectable()
export class EditaExpedienteInteresadosFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  crearInteresado(host: EditaExpedienteInteresadosHost): void {
    host.crearinteresado.idHisPerso = host.consultadni.idHisPerso;
    host.crearinteresado.idPerso = host.consultadni.idPerso;
    host.crearinteresado.idexpediente = host.idExpediente;

    this.expedientesService.crearInteresado(host.crearinteresado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.router.navigate([`/editaexpediente/${host.idExpediente}`]),
      error: (error: HttpErrorResponse) => {
        if (error.status !== 500) {
          this.notificationService.success({
            position: 'center',
            title: 'Se a creado el interesado con exito!!!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          this.notificationService.warning({
            position: 'center',
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
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar interesado',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteInteresado(host.idInteresado).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Interesado');
          setTimeout(host.recargarpagina, 1500);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
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

  listarInteresados(host: EditaExpedienteInteresadosHost, idexp: number): void {
    this.expedientesService.getInteresadoListarDto(idexp).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (listarInteresados) => {
        host.listarinteresadosdto = listarInteresados;
      },
      error: (error) => {
        console.error('Error al obtener interesados:', error);
        host.listarinteresadosdto = [];
      },
    });
  }

  seleccionarInteresado(host: EditaExpedienteInteresadosHost, idInteresado: number): void {
    host.verborrarinteresado = true;
    host.idInteresado = idInteresado;
  }
}
