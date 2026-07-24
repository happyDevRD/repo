import { Injectable } from '@angular/core';
import { CreaPermisoProcedi } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { PermisoProcediCreado } from '../models/procedimientos-internal.models';
import { createPermisosAdapter } from '../config/procedimientos-grid.config';
import { NotificationService } from '../../../core/service/notification.service';

export interface EditaProcedimientoPermisosHost {
  sourcePermi: unknown;
  idProcedimiento: number;
  idverTarea: number;
  userctrl: string | null;
  creapermisoprocedi: CreaPermisoProcedi;
  permisoprocedicreado: PermisoProcediCreado | CreaPermisoProcedi;
  activoFormNuevoPermiso: boolean;
  botonNuevoPermiso: boolean;
}

/**
 * Facade encargada de la carga del grid de permisos y de las operaciones
 * de alta/baja de permisos, tanto a nivel de procedimiento como de tarea.
 */
@Injectable()
export class EditaProcedimientoPermisosFacade {
  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
  ) {}

  lanzaSourcePermi(host: EditaProcedimientoPermisosHost, id: string | number): void {
    host.sourcePermi = createPermisosAdapter(id ?? '');
  }

  crear(host: EditaProcedimientoPermisosHost, idtrigger: string | number): void {
    host.activoFormNuevoPermiso = false;
    host.botonNuevoPermiso = true;

    const usuarioPermiso: string = host.creapermisoprocedi.usuario;

    this.procedimientoService
      .createPermisoProcedi(host.creapermisoprocedi, host.idProcedimiento, host.idverTarea, host.userctrl, usuarioPermiso)
      .subscribe({
        next: (response) => {
          host.permisoprocedicreado = response;
          this.lanzaSourcePermi(host, idtrigger);
        },
        error: (error) => console.error('Error al crear el permiso:', error),
      });
  }

  eliminar(host: EditaProcedimientoPermisosHost, id: number, usuario: string, idtrigger: string | number): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Permiso a : ' + usuario,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deletePermisoProcedimiento(id).subscribe({
        next: () => {
          this.lanzaSourcePermi(host, idtrigger);
          this.notificationService.success({ title: 'Permiso Eliminado!' });
        },
        error: () => {
          this.notificationService.info({ title: 'No se pudo eliminar el Permiso!' });
        },
      });
    });
  }
}
