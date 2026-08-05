import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { EditarProcedi, MateriaProcedimiento, Procedimiento } from '../procedimiento';
import { NotificationService } from '../../../core/service/notification.service';
import { UserSessionService } from '../../../core/service/user-session.service';
import { ProcedimientoService } from '../procedimiento.service';
import {
  MATERIA_LABELS,
  MODALIDAD_LABELS,
  ProcedimientoWorkspaceTab,
  PROCEDIMIENTO_WORKSPACE_TABS,
} from '../models/procedimientos-internal.models';

export interface ProcedimientosWorkspaceHost {
  isWorkspaceMode: boolean;
  activeWorkspaceTab: ProcedimientoWorkspaceTab;
  idprocedi: number;
  idverTarea: unknown;
  descripProcedimiento: string;
  siaProcedimiento: string;
  siglas: unknown;
  modalidad: unknown;
  materia: unknown;
  departProcedimiento: string;
  editarprocedi: EditarProcedi;
  materiaprocedimiento: MateriaProcedimiento[];
  departamento: string | null;
  cargarTareas(): void;
  cargarAtributos(id: number): void;
}

@Injectable()
export class ProcedimientosWorkspaceFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
    private readonly session: UserSessionService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  resetWorkspaceFlags(host: ProcedimientosWorkspaceHost): void {
    host.idverTarea = undefined;
  }

  loadWorkspace(host: ProcedimientosWorkspaceHost, id: number): void {
    if (!id) {
      return;
    }

    host.idprocedi = id;
    this.session.setIdProcedimiento(id);

    this.procedimientoService.getProcedimiento(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (procedimiento) => {
        const proc = procedimiento as Procedimiento & {
          modalidad?: number;
          idMatProce?: number;
          siglas?: string;
        };
        host.descripProcedimiento = proc.descripcion;
        host.siaProcedimiento = proc.codigoSia;
        host.siglas = proc.siglas;
        host.departProcedimiento = this.resolveDepartamentoLabel(proc.departamento, host);
        host.materia = proc.idMatProce;
        host.modalidad = proc.modalidad;
        host.editarprocedi.id = id;
        host.editarprocedi.descripcion = proc.descripcion;
        host.editarprocedi.codigoSia = proc.codigoSia;
        host.editarprocedi.modalidad = proc.modalidad as EditarProcedi['modalidad'];
        host.editarprocedi.materia = proc.idMatProce as EditarProcedi['materia'];
      },
      error: () => {
        this.notificationService.error('No se pudo cargar el procedimiento');
        this.volverAlListado();
      },
    });

    host.cargarTareas();
    host.cargarAtributos(id);
  }

  setWorkspaceTab(host: ProcedimientosWorkspaceHost, tab: ProcedimientoWorkspaceTab): void {
    host.activeWorkspaceTab = tab;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  volverAlListado(): void {
    this.router.navigate(['/procedimientos']);
  }

  getModalidadLabel(modalidad: unknown): string {
    return MODALIDAD_LABELS[Number(modalidad)] ?? '—';
  }

  getMateriaLabel(materia: unknown, editarprocedi: EditarProcedi, materiaprocedimiento: MateriaProcedimiento[]): string {
    const id = Number(materia ?? editarprocedi.materia);
    const found = materiaprocedimiento?.find((item) => Number(item.idMatProce) === id);
    return found?.descripcion ?? MATERIA_LABELS[id] ?? '—';
  }

  isValidTab(tab: string | undefined): tab is ProcedimientoWorkspaceTab {
    return !!tab && PROCEDIMIENTO_WORKSPACE_TABS.includes(tab as ProcedimientoWorkspaceTab);
  }

  private resolveDepartamentoLabel(departamento: unknown, host: ProcedimientosWorkspaceHost): string {
    if (Array.isArray(departamento) && departamento.length) {
      return (departamento[0] as { desEleme?: string })?.desEleme ?? host.departamento ?? '';
    }
    if (departamento && typeof departamento === 'object') {
      return (departamento as { desEleme?: string }).desEleme ?? host.departamento ?? '';
    }
    return host.departamento ?? '';
  }
}
