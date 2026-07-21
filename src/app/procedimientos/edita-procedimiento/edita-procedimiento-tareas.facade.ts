import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CreaTareaProcedi, EditaTareaProcedi, PlantillaTarea, ProcesoFirmadoListar } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { NotificationService } from '../../core/service/notification.service';
import { TareaProcediCreada } from '../models/procedimientos-internal.models';
import { createTareasAdapter } from '../config/procedimientos-grid.config';

export interface EditaProcedimientoTareasHost {
  idpro: string | null;
  source: unknown;
  creatareaprocedi: CreaTareaProcedi;
  editatareaprocedi: EditaTareaProcedi;
  tareaprocedicreada: TareaProcediCreada | CreaTareaProcedi;
  idverTarea: number;
  firmalistar: ProcesoFirmadoListar[];
  plantillatarea: PlantillaTarea[];
}

/**
 * Facade encargada de la carga del grid de tareas y de las operaciones
 * de alta/edición/baja de tareas del procedimiento.
 */
@Injectable()
export class EditaProcedimientoTareasFacade {
  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly modalManagerService: ModalManagerService,
    private readonly notificationService: NotificationService,
  ) {}

  initSource(host: EditaProcedimientoTareasHost): void {
    host.source = createTareasAdapter(host.idpro ?? '');
  }

  refrescarGrid(host: EditaProcedimientoTareasHost): void {
    host.source = createTareasAdapter(host.idpro ?? '');
  }

  prepararDatosFirma(host: EditaProcedimientoTareasHost, plantilla: string): void {
    if (!plantilla) {
      host.firmalistar = [];
      host.editatareaprocedi.firmaPorDefecto = null;
      return;
    }

    this.procedimientoService.getFirma(plantilla).subscribe({
      next: (firmalistar) => {
        host.firmalistar = firmalistar;
        if (firmalistar?.length > 0) {
          host.editatareaprocedi.firmaPorDefecto = firmalistar[0].idProFirma;
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de firma:', error);
        host.firmalistar = [];
        host.editatareaprocedi.firmaPorDefecto = null;
      },
    });
  }

  crear(host: EditaProcedimientoTareasHost, procedimientoId: number): void {
    if (host.creatareaprocedi.plazo == null) {
      host.creatareaprocedi.plazo = 0;
    }

    this.procedimientoService.createTareaProcedi(host.creatareaprocedi, procedimientoId).subscribe({
      next: (response) => {
        host.tareaprocedicreada = response;
        this.refrescarGrid(host);
        this.notificationService.success({ title: 'Nueva Tarea', text: 'Creada con éxito' });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.notificationService.warning({ title: 'La nueva Tarea', text: 'No pudo ser creada. Revise los campos vacíos.' });
        } else {
          this.notificationService.error({ title: 'Error', text: 'Ocurrió un error inesperado al crear la tarea.' });
        }
      },
    });
  }

  editar(host: EditaProcedimientoTareasHost): void {
    if (host.editatareaprocedi.plazo == null || (host.editatareaprocedi.plazo as unknown) === '') {
      host.editatareaprocedi.plazo = 0;
      host.editatareaprocedi.tipoPlazo = 'SINPLAZO';
    }

    if (!host.idverTarea) {
      this.notificationService.error({ title: 'Error', text: 'No se puede identificar la tarea a editar' });
      return;
    }

    this.procedimientoService.editaTareaProcedimiento(host.editatareaprocedi, host.idverTarea).subscribe({
      next: () => {
        this.notificationService.success({ title: 'Éxito', text: 'Tarea modificada correctamente' });
        this.refrescarGrid(host);
        this.modalManagerService.closeModal('modifitareasModal');
      },
      error: (error) => {
        console.error('Error al modificar tarea:', error);
        this.notificationService.error({ title: 'Error', text: 'No se pudo modificar la tarea. Revise los datos e intente nuevamente.' });
      },
    });
  }

  eliminar(host: EditaProcedimientoTareasHost, idTarea: number): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Tarea',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deleteTareaProcedimiento(idTarea).subscribe({
        next: () => {
          this.refrescarGrid(host);
          this.notificationService.success({ title: 'Tarea Eliminada!' });
        },
        error: () => {
          this.notificationService.info({ title: 'No se pudo eliminar la Tarea!' });
        },
      });
    });
  }
}
