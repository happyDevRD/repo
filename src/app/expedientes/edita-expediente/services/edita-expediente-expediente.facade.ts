import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EditExpediente } from '../../expedientes';
import { ExpedientesService } from '../../expedientes.service';

export interface EditaExpedienteExpedienteHost {
  editexpediente: EditExpediente;
  idExpediente: number;
  recargarpagina(): void;
}

@Injectable()
export class EditaExpedienteExpedienteFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly router: Router,
  ) {}

  editExpediente(host: EditaExpedienteExpedienteHost): void {
    this.expedientesService.editarExpediente(host.editexpediente, host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.router.navigate([`/editaexpediente/${host.idExpediente}`]),
    });
    setTimeout(host.recargarpagina, 1000);
  }

  volverListadoExpedientes(): void {
    this.router.navigate(['/expedientes']);
  }
}
