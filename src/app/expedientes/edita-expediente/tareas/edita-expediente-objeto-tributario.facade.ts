import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ObjetoTributarioDto } from '../../../core/models/objeto-tributario.dto';
import { ExpedientesService } from '../../expedientes.service';

export interface ObjetoTributarioBajaHost {
  objetotributario: ObjetoTributarioDto;
  cdr: ChangeDetectorRef;
}

@Injectable()
export class EditaExpedienteObjetoTributarioFacade {
  constructor(private readonly expedientesService: ExpedientesService) {}

  darDeBajaObjeto(host: ObjetoTributarioBajaHost): void {
    if (!host.objetotributario) {
      Swal.fire('Error', 'No hay objeto tributario seleccionado', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmar Baja',
      text: '¿Estás seguro de dar de baja este objeto tributario?',
      icon: 'warning',
      showCancelButton: true,
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
        .pipe(switchMap(() => this.recargarObjetoTributario(host)))
        .subscribe({
          next: (updated) => {
            host.objetotributario = updated;
            host.cdr.detectChanges();
            Swal.fire('Éxito', 'Objeto dado de baja y recargado', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Error al procesar baja', 'error');
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
