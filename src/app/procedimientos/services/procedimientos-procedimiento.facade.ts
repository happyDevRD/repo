import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CrearProcedi, EditarProcedi } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';

export interface ProcedimientosProcedimientoHost {
  crearprocedi: CrearProcedi;
  editarprocedi: EditarProcedi;
  idprocedi: number;
  isWorkspaceMode: boolean;
  loadWorkspace(id: number): void;
  refrescaProcedimientos(): void;
  volverAlListado(): void;
  limpiarErrores(): void;
}

@Injectable()
export class ProcedimientosProcedimientoFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly router: Router,
  ) {}

  crear(host: ProcedimientosProcedimientoHost): void {
    this.procedimientoService.create(host.crearprocedi).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        if (!response.id) {
          return;
        }
        this.notificationService.saveSuccess('Procedimiento');
        host.limpiarErrores();
        this.modalManagerService.closeModal('NprocediModal');
        this.router.navigate(['/procedimientos', response.id], { queryParams: { tab: 'datos' } });
      },
      error: (err) => {
        const serverMessage = typeof err.error === 'string' ? err.error : err.error?.message;
        if (err.status == 403) {
          this.notificationService.error(
            serverMessage ||
              'No se pudo crear: revise descripción, código SIA, siglas y materia (pueden estar duplicados)',
          );
        } else {
          this.notificationService.error(serverMessage || 'Error al crear el procedimiento');
        }
        this.modalManagerService.keepModalOpen('NprocediModal');
      },
    });
  }

  editar(host: ProcedimientosProcedimientoHost): void {
    this.procedimientoService.editaProcedi(host.editarprocedi, host.idprocedi).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.saveSuccess('Procedimiento');
        if (host.isWorkspaceMode) {
          host.loadWorkspace(host.idprocedi);
          return;
        }
        host.refrescaProcedimientos();
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message || 'No se pudo editar el procedimiento.');
        if (!host.isWorkspaceMode) {
          this.modalManagerService.keepModalOpen('editarProcedimientoModal');
        }
      },
    });
  }

  eliminar(host: ProcedimientosProcedimientoHost, id: number): void {
    this.notificationService.confirm({
      title: '¿Está seguro?',
      text: 'Eliminar Procedimiento',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deleteProcedimiento(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Procedimiento');
          if (host.isWorkspaceMode) {
            host.volverAlListado();
            return;
          }
          host.refrescaProcedimientos();
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message);
          if (!host.isWorkspaceMode) {
            host.refrescaProcedimientos();
          }
        },
      });
    });
  }
}
