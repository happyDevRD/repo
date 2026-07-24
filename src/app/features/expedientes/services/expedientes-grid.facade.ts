import { Injectable } from '@angular/core';
import {
  createAtributosAdapter,
  createAtributosEmptyAdapter,
  createExpedientesListAdapter,
  createExpedientesListLocalAdapter,
  createExpedientesListSourcePlain,
  createIndiceEniAdapter,
  createPermisosAdapter,
  createRepresentantesAdapter,
  createTareaProcediSourcePlain,
  createTareasExpedienteAdapter,
  createTareasExpedienteLocalAdapter,
  createTramiteAdapter,
  refreshJqxGrid,
} from '../config/expedientes-grid.config';
import { Atributosleer, ExpedienteListar, TareaTramiteExpporExpedi } from '../expedientes';

export interface ExpedientesGridHost {
  sourceExp: unknown;
  sourceTareaProcedi: unknown;
  sourcePermi: unknown;
  sourceListRepre: unknown;
  sourceTramite: unknown;
  sourceIndiceENI: unknown;
  sourceTareasExpediente: unknown;
  sourceAtributo: unknown;
  idExpediente: number | string;
  idexpediente?: number;
  idProcedimiento: number | string;
  gridAtributosExp?: unknown;
  gridTareasExpediente?: unknown;
  onTareasExpedienteBindingComplete?: () => void;
}

@Injectable()
export class ExpedientesGridFacade {
  initGridSources(host: ExpedientesGridHost, user: string): void {
    host.sourceExp = createExpedientesListAdapter(user);
    host.sourceTareaProcedi = createTareaProcediSourcePlain(host.idProcedimiento ?? 0);
    host.sourcePermi = createPermisosAdapter(0);
    host.sourceListRepre = createRepresentantesAdapter(0, 0);
    host.sourceTramite = createTramiteAdapter(host.idExpediente ?? 0);
    host.sourceTareasExpediente = createTareasExpedienteAdapter(1);
    host.sourceAtributo = createAtributosEmptyAdapter();
  }

  refreshExpedientesList(host: ExpedientesGridHost, user: string, sortById = false): void {
    host.sourceExp = createExpedientesListAdapter(user, sortById);
  }

  refreshExpedientesListPlain(host: ExpedientesGridHost, user: string): void {
    host.sourceExp = createExpedientesListSourcePlain(user);
  }

  setExpedientesListLocal(host: ExpedientesGridHost, data: ExpedienteListar[]): void {
    host.sourceExp = createExpedientesListLocalAdapter(data);
  }

  lanzaTareaProcedi(host: ExpedientesGridHost, idProcedimiento: number | string): void {
    host.sourceTareaProcedi = createTareaProcediSourcePlain(idProcedimiento);
  }

  lanzaSourcePermi(host: ExpedientesGridHost, id: number | string): void {
    host.sourcePermi = createPermisosAdapter(id);
  }

  actualizaSourceTramite(host: ExpedientesGridHost, idexpediente?: number): void {
    const id = idexpediente ?? host.idexpediente ?? host.idExpediente;
    host.sourceTramite = createTramiteAdapter(id);
  }

  refreshRepresentantes(host: ExpedientesGridHost, idPerso: number | string, idHisPerso: number | string): void {
    host.sourceListRepre = createRepresentantesAdapter(idPerso, idHisPerso);
  }

  refrescarSourceAtributo(host: ExpedientesGridHost, localData?: Atributosleer[]): void {
    const id = host.idExpediente ?? (host as { idexpediente?: number }).idexpediente;
    if (!id) {
      return;
    }
    host.sourceAtributo = createAtributosAdapter(id, localData);
  }

  refreshGridAtributosExp(host: ExpedientesGridHost): void {
    const grid = host.gridAtributosExp as {
      setSource?: (s: unknown) => void; source?: (s: unknown) => void;
      updatebounddata?: () => void;
      refresh?: () => void;
    } | undefined;
    if (!grid || !host.sourceAtributo) {
      return;
    }
    ;(grid.setSource ?? grid.source)?.(host.sourceAtributo);
    refreshJqxGrid(grid);
  }

  refrescarSourceTareasExpedientePorUrl(host: ExpedientesGridHost, idExp: string): void {
    host.sourceTareasExpediente = createTareasExpedienteAdapter(idExp);
  }

  refrescarSourceTareasExpediente(host: ExpedientesGridHost, localData: TareaTramiteExpporExpedi[]): void {
    host.sourceTareasExpediente = createTareasExpedienteLocalAdapter(localData);
  }

  refreshGridTareasExpediente(host: ExpedientesGridHost): void {
    const grid = host.gridTareasExpediente as {
      setSource?: (s: unknown) => void; source?: (s: unknown) => void;
      updatebounddata?: (mode?: string) => void;
      setWidth?: (w: string) => void; width?: (w: string) => void;
      refresh?: () => void;
    } | undefined;
    if (!grid || !host.sourceTareasExpediente) {
      return;
    }
    ;(grid.setSource ?? grid.source)?.(host.sourceTareasExpediente);
    grid.updatebounddata?.('cells');
    ;(grid.setWidth ?? grid.width)?.('100%');
    grid.refresh?.();
    window.setTimeout(() => host.onTareasExpedienteBindingComplete?.(), 150);
  }

  lanzoIndiceENI(host: ExpedientesGridHost, idexpe: string): void {
    host.sourceIndiceENI = createIndiceEniAdapter(idexpe);
  }

  cargarIndiceENI(host: ExpedientesGridHost, idExpedienteString: string): void {
    host.sourceIndiceENI = createIndiceEniAdapter(idExpedienteString);
  }
}
