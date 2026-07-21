import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ObjetoTributarioDto } from '../../../core/models/objeto-tributario.dto';
import { ExpedientesService } from '../../expedientes.service';
import { NotificationService } from '../../../core/service/notification.service';

export interface ObjetoTributarioBajaHost {
  objetotributario: ObjetoTributarioDto;
  cdr: ChangeDetectorRef;
}

@Injectable()
export class EditaExpedienteObjetoTributarioFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
  ) {}

  darDeBajaObjeto(host: ObjetoTributarioBajaHost): void {
    if (!host.objetotributario) {
      this.notificationService.error({ title: 'Error', text: 'No hay objeto tributario seleccionado' });
      return;
    }

    this.notificationService.confirm({
      title: 'Confirmar Baja',
      text: '¿Estás seguro de dar de baja este objeto tributario?',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const dto: Partial<ObjetoTributarioDto> = {
        idHisObjTribu: host.objetotributario.idHisObjTribu,
        idObjTribu: host.objetotributario.idObjTribu,
        numDocum: host.objetotributario.numDocum,
        codMovim: 'BAJA',
        fecMovim: new Date().toISOString().slice(0, 10),
        observaciones: host.objetotributario.observaciones?.trim() || null,
      };

      this.expedientesService
        .putBajaObjetoTributario(dto)
        .pipe(
          switchMap(() => this.recargarObjetoTributario(host)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (updated) => {
            host.objetotributario = updated;
            host.cdr.detectChanges();
            this.notificationService.success({ title: 'Éxito', text: 'Objeto dado de baja y recargado' });
          },
          error: (err) => {
            this.notificationService.error({ title: 'Error', text: err.error?.message || 'Error al procesar baja' });
            console.error(err);
          },
        });
    });
  }

  private recargarObjetoTributario(host: ObjetoTributarioBajaHost): Observable<ObjetoTributarioDto> {
    const hisTip = host.objetotributario.idHisTipObjTribu;
    const tip = host.objetotributario.idTipObjTribu;
    const num = host.objetotributario.numDocum;
    return this.expedientesService.getObjetoTributario(`${hisTip}/${tip}`, num);
  }
}
