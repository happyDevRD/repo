import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AtributosListar, ListaTareaProcedi, Procedimiento, ProcediPermisosListar } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';

export interface ProcedimientosGridHost {
  procedimientos: Procedimiento[];
  cargandoProcedimientos: boolean;
  tareas: ListaTareaProcedi[];
  cargandoTareas: boolean;
  permisos: ProcediPermisosListar[];
  cargandoPermisos: boolean;
  atributosList: AtributosListar[];
  cargandoAtributosList: boolean;
  idOrgElemen: string | null;
  idprocedi: number;
}

/**
 * Carga las 4 listas del módulo (procedimientos, tareas, permisos, atributos)
 * directamente vía HTTP. Sustituye a los `jqx.dataAdapter` que usaban las rejillas
 * jqxGrid — ya no hace falta refrescar/forzar repintado del grid tras cada cambio.
 */
@Injectable()
export class ProcedimientosGridFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly procedimientoService: ProcedimientoService) {}

  cargarProcedimientos(host: ProcedimientosGridHost): void {
    if (!host.idOrgElemen) {
      return;
    }
    host.cargandoProcedimientos = true;
    this.procedimientoService.getProcedimientos().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (procedimientos) => {
        host.procedimientos = procedimientos ?? [];
        host.cargandoProcedimientos = false;
      },
      error: () => {
        host.procedimientos = [];
        host.cargandoProcedimientos = false;
      },
    });
  }

  cargarTareas(host: ProcedimientosGridHost): void {
    if (!host.idprocedi) {
      return;
    }
    host.cargandoTareas = true;
    this.procedimientoService.getTareaProcedimiento(host.idprocedi).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareas) => {
        host.tareas = tareas ?? [];
        host.cargandoTareas = false;
      },
      error: () => {
        host.tareas = [];
        host.cargandoTareas = false;
      },
    });
  }

  cargarPermisos(host: ProcedimientosGridHost, idTarea: number | string): void {
    if (!idTarea) {
      return;
    }
    host.cargandoPermisos = true;
    this.procedimientoService.getPermisosListar(idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (permisos) => {
        host.permisos = permisos ?? [];
        host.cargandoPermisos = false;
      },
      error: () => {
        host.permisos = [];
        host.cargandoPermisos = false;
      },
    });
  }

  cargarAtributos(host: ProcedimientosGridHost, idprocedimiento: number): void {
    if (!idprocedimiento) {
      return;
    }
    host.cargandoAtributosList = true;
    this.procedimientoService.getAtributosListarPorProc(idprocedimiento).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (atributosList) => {
        host.atributosList = atributosList ?? [];
        host.cargandoAtributosList = false;
      },
      error: () => {
        host.atributosList = [];
        host.cargandoAtributosList = false;
      },
    });
  }
}
