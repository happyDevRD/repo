import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { CreaTareaProcedi, EditaTareaProcedi, PlantillaTarea } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { NotificationService } from '../../../core/service/notification.service';
import { FirmaListar, TareaProcediCreada } from '../models/procedimientos-internal.models';
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
  tareaprocedicreada: TareaProcediCreada | CreaTareaProcedi;
  lanzaSourceTarea(): void;
  abrirOffcanvas(id: string): void;
  cerrarOffcanvas(id: string): void;
}

@Injectable()
export class ProcedimientosTareasFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
    private readonly http: HttpClient,
  ) {}

  getFirma(plantilla: string): Observable<FirmaListar[]> {
    const url = `${environment.apiUrl}procesoFirmado/listar/${plantilla}`;
    return this.http.get(url).pipe(map((response) => response as FirmaListar[]));
  }

  prepararDatosFirma(host: ProcedimientosTareasHost, plantilla: string): void {
    let plantillaResuelta = plantilla;
    if (plantilla === 'SINPLANTILLA') {
      plantillaResuelta = host.plantillatarea[0]?.plantilla ?? plantilla;
      host.tpsinfirma = false;
    } else {
      host.tpsinfirma = true;
    }

    this.getFirma(plantillaResuelta).pipe(
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
      next: (response) => {
        host.tareaprocedicreada = response;
        this.notificationService.saveSuccess('Tarea');
        host.cerrarOffcanvas('tareasOffcanvas');
        host.lanzaSourceTarea();
        this.borrarValoresNuevaTarea(host);
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message || 'No se pudo crear la tarea.');
        host.abrirOffcanvas('tareasOffcanvas');
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
        host.cerrarOffcanvas('modificarTareaOffcanvas');
        host.lanzaSourceTarea();
        host.editatareaprocedi = new EditaTareaProcedi();
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message || 'No se pudo editar la tarea.');
        host.abrirOffcanvas('modificarTareaOffcanvas');
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
          host.lanzaSourceTarea();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error eliminando tarea:', err);
          this.notificationService.error(err.error.message || 'No se pudo eliminar la tarea.');
        },
      });
    });
  }
}
