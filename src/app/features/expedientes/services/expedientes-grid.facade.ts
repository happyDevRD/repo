import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import {
  createIndiceEniAdapter,
  createRepresentantesAdapter,
} from '../config/expedientes-grid.config';
import { ExpedienteListar } from '../expedientes';
import { ExpedientesService } from '../expedientes.service';

export interface ExpedientesGridHost {
  expedientesListado: ExpedienteListar[];
  cargandoExpedientesListado: boolean;
  sourceListRepre: unknown;
  sourceIndiceENI: unknown;
  idExpediente: number | string;
  idexpediente?: number;
  idProcedimiento: number | string;
}

@Injectable()
export class ExpedientesGridFacade {
  private readonly expedientesService = inject(ExpedientesService);
  private readonly destroyRef = inject(DestroyRef);

  initGridSources(host: ExpedientesGridHost, user: string): void {
    this.cargarExpedientesListado(host);
    host.sourceListRepre = createRepresentantesAdapter(0, 0);
  }

  refreshExpedientesList(host: ExpedientesGridHost, user: string, sortById = false): void {
    this.cargarExpedientesListado(host, sortById);
  }

  refreshExpedientesListPlain(host: ExpedientesGridHost, user: string): void {
    this.cargarExpedientesListado(host);
  }

  setExpedientesListLocal(host: ExpedientesGridHost, data: ExpedienteListar[]): void {
    host.expedientesListado = data;
  }

  private cargarExpedientesListado(host: ExpedientesGridHost, sortById = false): void {
    host.cargandoExpedientesListado = true;
    this.expedientesService.getExpedientesListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (expedientes) => {
        host.expedientesListado = sortById
          ? [...expedientes].sort((a, b) => Number(b.id) - Number(a.id))
          : expedientes;
        host.cargandoExpedientesListado = false;
      },
      error: () => {
        host.expedientesListado = [];
        host.cargandoExpedientesListado = false;
      },
    });
  }

  refreshRepresentantes(host: ExpedientesGridHost, idPerso: number | string, idHisPerso: number | string): void {
    host.sourceListRepre = createRepresentantesAdapter(idPerso, idHisPerso);
  }

  lanzoIndiceENI(host: ExpedientesGridHost, idexpe: string): void {
    host.sourceIndiceENI = createIndiceEniAdapter(idexpe);
  }

  cargarIndiceENI(host: ExpedientesGridHost, idExpedienteString: string): void {
    host.sourceIndiceENI = createIndiceEniAdapter(idExpedienteString);
  }
}
