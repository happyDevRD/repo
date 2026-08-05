import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { CreaPermisoProcedi } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { ProcedimientosGridFacade, ProcedimientosGridHost } from './procedimientos-grid.facade';
import { clearFormValidation } from '../../../core/helper/bootstrap-form.helper';

export interface ProcedimientosPermisosHost extends ProcedimientosGridHost {
  creapermisoprocedi: CreaPermisoProcedi;
  idprocedi: number;
  idverTarea: unknown;
  userctrl: string | null;
  idPermisoProcedimiento: unknown;
  usuarioTarea: unknown;
  veoBorrarTarea: boolean;
}

@Injectable()
export class ProcedimientosPermisosFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: ProcedimientosGridFacade,
  ) {}

  resetFormularioNuevo(host: ProcedimientosPermisosHost): void {
    host.creapermisoprocedi = new CreaPermisoProcedi();
    clearFormValidation('formNuevoPermiso');
  }

  crear(host: ProcedimientosPermisosHost): void {
    const usuarioPermiso = host.creapermisoprocedi.usuario;

    this.procedimientoService
      .createPermisoProcedi(
        host.creapermisoprocedi,
        host.idprocedi,
        host.idverTarea as number,
        host.userctrl,
        usuarioPermiso,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.saveSuccess('Permiso');
          this.modalManagerService.closeModal('nuevoPermisoModal');
          this.gridFacade.cargarPermisos(host, Number(host.idverTarea));
          this.resetFormularioNuevo(host);
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error(err.error.message);
          this.modalManagerService.keepModalOpen('nuevoPermisoModal');
        },
      });
  }

  eliminar(host: ProcedimientosPermisosHost): void {
    this.notificationService.confirm({
      title: '¿Está seguro?',
      text: 'Eliminar Permiso a : ' + host.usuarioTarea,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deletePermisoProcedimiento(host.idPermisoProcedimiento).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.veoBorrarTarea = false;
          this.gridFacade.cargarPermisos(host, host.idverTarea as number | string);
          this.notificationService.success({ title: 'Permiso Eliminado!' });
        },
        error: () => {
          this.notificationService.info({ title: 'No se pudo eliminar el Permiso!' });
        },
      });
    });
  }
}
