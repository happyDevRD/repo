import { Injectable } from '@angular/core';
import {
  createAtributosAdapter,
  createPermisosAdapter,
  createPermisosSourcePlain,
  createProcedimientosListAdapter,
  createTareasAdapter,
  createTareasAdapterSimple,
  refreshJqxGrid,
} from '../config/procedimientos-grid.config';

export interface ProcedimientosGridHost {
  sourcePro: unknown;
  sourceTarea: unknown;
  sourcePermi: unknown;
  sourceAtributos: unknown;
  idOrgElemen: string | null;
  idpermis: string | null;
  idprocedi: number;
  gridProcedimientos?: { refresh: () => void; updatebounddata: () => void };
  gridAtributos?: { refresh: () => void; updatebounddata: () => void };
}

@Injectable()
export class ProcedimientosGridFacade {
  refreshProcedimientosList(host: ProcedimientosGridHost): void {
    if (!host.idOrgElemen) {
      return;
    }
    host.sourcePro = createProcedimientosListAdapter(host.idOrgElemen, true);
    refreshJqxGrid(host.gridProcedimientos, 200);
    refreshJqxGrid(host.gridProcedimientos, 500);
  }

  lanzaSourceTarea(host: ProcedimientosGridHost): void {
    if (!host.idprocedi) {
      return;
    }
    host.sourceTarea = createTareasAdapterSimple(host.idprocedi);
  }

  lanzaSourcePermi(host: ProcedimientosGridHost, id: number): void {
    if (!id) {
      return;
    }
    host.sourcePermi = createPermisosAdapter(id);
  }

  actualizaSourceAtributo(host: ProcedimientosGridHost, idprocedimiento: number): void {
    if (!idprocedimiento) {
      return;
    }
    host.sourceAtributos = createAtributosAdapter(idprocedimiento, true);
    refreshJqxGrid(host.gridAtributos, 200);
  }

  assignPermisosSourcePlain(host: ProcedimientosGridHost, id: number | string): void {
    host.sourcePermi = createPermisosSourcePlain(id);
  }

  initGridSources(host: ProcedimientosGridHost): void {
    host.sourcePro = createProcedimientosListAdapter(host.idOrgElemen ?? '');
    host.sourceTarea = createTareasAdapter(host.idprocedi ?? 0);
    host.sourcePermi = createPermisosAdapter(host.idpermis ?? 0);
    host.sourceAtributos = createAtributosAdapter(host.idprocedi ?? 0);
  }

  assignPermisosSourceAfterCreate(host: ProcedimientosGridHost, idverTarea: number): void {
    host.sourcePermi = createPermisosSourcePlain(idverTarea, true);
  }
}
