import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { CreaTareaProcedi, EditaTareaProcedi, PlantillaTarea } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { NotificationService } from '../../../core/service/notification.service';
import { FirmaListar } from '../models/procedimientos-internal.models';
import { resetForm } from '../../../core/helper/bootstrap-form.helper';

export interface ProcedimientosTareasHost {
  creatareaprocedi: CreaTareaProcedi;
  editatareaprocedi: EditaTareaProcedi;
  idprocedi: number;
  idverTarea: unknown;
  idPermisoProcedimiento: unknown;
  acciondefecto: number;
  firmalistar: FirmaListar[];
  plantillatarea: PlantillaTarea[];
  tpsinfirma: boolean;
  cargarTareas(): void;
  abrirModal(id: string): void;
  cerrarModal(id: string): void;
}

@Injectable()
export class ProcedimientosTareasFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
  ) {}

  prepararDatosFirma(host: ProcedimientosTareasHost, plantilla: string): void {
    let plantillaResuelta = plantilla;
    if (plantilla === 'SINPLANTILLA') {
      plantillaResuelta = host.plantillatarea[0]?.plantilla ?? plantilla;
      host.tpsinfirma = false;
    } else {
      host.tpsinfirma = true;
    }

    this.procedimientoService.getFirma(plantillaResuelta).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (firmalistar) => {
        host.firmalistar = firmalistar;
        if (host.firmalistar?.length > 0) {
          host.creatareaprocedi.firmapordefecto = host.firmalistar[0].procesoFirmadoDefecto;
        }
      },
      error: (error) => console.error('Error obteniendo firmas:', error),
    });
  }

  borrarValoresNuevaTarea(host: ProcedimientosTareasHost): void {
    host.creatareaprocedi = new CreaTareaProcedi();
    host.firmalistar = [];
    host.tpsinfirma = true;
    resetForm('formNuevaTarea');
  }

  crear(host: ProcedimientosTareasHost, procedimientoId: number): void {
    host.creatareaprocedi.acciones = host.creatareaprocedi.acciones || host.acciondefecto;
    host.creatareaprocedi.plazo =
      host.creatareaprocedi.tipoplazo === 'SINPLAZO' ? 0 : host.creatareaprocedi.plazo;

    this.procedimientoService.createTareaProcedi(host.creatareaprocedi, procedimientoId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.saveSuccess('Tarea');
        host.cerrarModal('tareasModal');
        host.cargarTareas();
        this.borrarValoresNuevaTarea(host);
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message || 'No se pudo crear la tarea.');
        host.abrirModal('tareasModal');
      },
    });
  }

  editar(host: ProcedimientosTareasHost): void {
    this.procedimientoService
      .editaTareaProcedimiento(host.editatareaprocedi, host.idverTarea as number)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.notificationService.saveSuccess('Tarea');
        host.cerrarModal('modifitareasModalListado');
        host.cargarTareas();
        host.editatareaprocedi = new EditaTareaProcedi();
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message || 'No se pudo editar la tarea.');
        host.abrirModal('modifitareasModalListado');
      },
    });
  }

  eliminar(host: ProcedimientosTareasHost): void {
    if (!host.idPermisoProcedimiento) {
      this.notificationService.error({ title: 'Error', text: 'No se puede eliminar una tarea sin ID válido.' });
      return;
    }

    this.notificationService.confirm({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la tarea permanentemente.',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deleteTareaProcedimiento(host.idPermisoProcedimiento).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Tarea');
          host.cargarTareas();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error eliminando tarea:', err);
          this.notificationService.error(err.error.message || 'No se pudo eliminar la tarea.');
        },
      });
    });
  }
}
