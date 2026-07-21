import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TareaProcedimientoDTO } from '../../../core/models/tarea-procedimiento.dto';
import { CrearTablonAnuncio, TareaTramiteExpedienteCrear, TareaTramiteExpedienteEditar } from '../../expedientes';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { ExpedientesService } from '../../expedientes.service';
import {
  normalizarPlantillaDefecto,
  prepararTareaParaCreacion,
  tieneArchivoPendienteSubida,
  validarTareaParaCreacion,
} from './tareas-creacion.helper';
import {
  buildTareaGridSource,
  buildTareaGridSourceFromLocal,
  createTareaGridAdapter,
  TareaGridSourceOptions,
} from './tareas-grid.config';
import {
  aplicarGridTareaProcedimiento,
  esSeleccionTareaProcedimientoVacia,
  limpiarSeleccionTareaProcedimiento,
  normalizarPlantillaDefectoSeleccion,
  TareaProcedimientoSeleccionHost,
} from './tareas-procedimiento.helper';
import { refrescarSourceHistorico } from './historico.helper';
import { configurarAccionTarea, ConfigurarAccionTareaHost } from './tareas-accion.helper';
import { ListaTareaProcedi } from '../edita-expediente.models';

export interface EditaExpedienteTareasGridHost {
  sourceTareasTramite: unknown;
  tareatramiteexpedientelistar?: unknown[];
  veoeditofasetramite?: boolean;
}

export interface EditaExpedienteTareasHost extends EditaExpedienteTareasGridHost {
  tareatramiteexpedienteeditar: TareaTramiteExpedienteEditar;
  idTarea: number;
  idTramite: number;
  numeroTareaTramite: unknown;
  descripTareaTramite: unknown;
  verAccionesdeTarea: boolean;
  creartablonanuncio: CrearTablonAnuncio;
  spinnervisible: boolean;
  onTareaEditada?(): void;
  verListadoTareasModal(): void;
}

export interface CrearTareaTramiteHost extends EditaExpedienteTareasHost {
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear;
  plantillaDefecto: string | null;
  identificadorFicheroSubido?: number;
  usuContrl: string | null;
  base64code?: string;
  name?: string;
  veoAcciones: boolean;
  disabledArchivoTareaTramite: boolean;
  borraDatosNuevaTarea(): void;
  onTareaCreada?(): void;
}

export interface ClickTareaProcedimientoHost {
  veoAcciones: boolean;
  disabledArchivoTareaTramite: boolean;
  plantillaDefecto: string | null;
}

export interface TareaProcedimientoHost extends TareaProcedimientoSeleccionHost, ConfigurarAccionTareaHost {
  tareatramiteprocedimiento: TareaProcedimientoDTO;
}

export interface HistoricoGridHost {
  sourceHistorico: unknown;
}

@Injectable()
export class EditaExpedienteTareasFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly http: HttpClient,
  ) {}

  getListaTareas(idprocedi: string | null, fasetramite: string): Observable<ListaTareaProcedi[]> {
    const url = `${environment.apiUrl}tareaProcedimiento/listar/${idprocedi}/${fasetramite}`;
    return this.http.get(url).pipe(map((response) => response as ListaTareaProcedi[]));
  }

  buildGridSource(idTramite: number, options?: TareaGridSourceOptions): Record<string, unknown> {
    return buildTareaGridSource(idTramite, options);
  }

  createGridAdapter(idTramite: number, options?: TareaGridSourceOptions): any {
    return createTareaGridAdapter(idTramite, options);
  }

  refrescarGrid(host: EditaExpedienteTareasGridHost, idTramite: number): void {
    if (!idTramite) {
      host.sourceTareasTramite = buildTareaGridSourceFromLocal([]);
      if (host.tareatramiteexpedientelistar) {
        host.tareatramiteexpedientelistar = [];
      }
      return;
    }

    this.expedientesService.getTareaTramiteExpedienteListar(idTramite).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (list) => {
        const rows = list ?? [];
        if (host.tareatramiteexpedientelistar) {
          host.tareatramiteexpedientelistar = rows;
        }
        host.sourceTareasTramite = buildTareaGridSourceFromLocal(rows);
      },
      error: () => {
        if (host.veoeditofasetramite !== undefined) {
          host.veoeditofasetramite = false;
        }
        if (host.tareatramiteexpedientelistar) {
          host.tareatramiteexpedientelistar = [];
        }
        host.sourceTareasTramite = buildTareaGridSourceFromLocal([]);
      },
    });
  }

  refrescarGridAdapter(host: EditaExpedienteTareasGridHost, options?: TareaGridSourceOptions): void {
    host.sourceTareasTramite = createTareaGridAdapter(
      (host as EditaExpedienteTareasHost).idTramite,
      options,
    );
  }

  seleccionarTareaProcedimiento(host: TareaProcedimientoHost, selectedValue: unknown): void {
    if (esSeleccionTareaProcedimientoVacia(selectedValue)) {
      limpiarSeleccionTareaProcedimiento(host);
      return;
    }

    aplicarGridTareaProcedimiento(host, selectedValue as number | string);

    this.expedientesService.getTramiteTarea(selectedValue as number).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data: TareaProcedimientoDTO) => {
        host.tareatramiteprocedimiento = data;
        host.veoAcciones = true;
        configurarAccionTarea(host, data);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener tarea procedimiento:', error);
      },
    });
  }

  refrescarHistorico(host: HistoricoGridHost, idTarea: number | string): void {
    refrescarSourceHistorico(host, idTarea);
  }

  borrarTarea(host: EditaExpedienteTareasHost): void {
    if (!host.idTarea) {
      this.notificationService.error({
        title: 'Error de Selección',
        text: 'No se ha seleccionado ninguna tarea para borrar. Por favor, haz clic en una tarea de la lista primero.',
      });
      return;
    }

    this.notificationService.confirm({
      title: `¿Confirma eliminar la tarea ${host.numeroTareaTramite}?`,
      text: 'Esta acción no se puede deshacer.',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteTareaTramiteExpediente(host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Tarea');
          this.refrescarGrid(host, host.idTramite);
          host.verAccionesdeTarea = false;
        },
        error: (error: HttpErrorResponse) => {
          const mensaje = error.error?.message || 'Ocurrió un error inesperado.';
          this.notificationService.error(`Error al eliminar: ${mensaje}`);
        },
      });
    });
  }

  finalizarTarea(host: EditaExpedienteTareasHost): void {
    this.notificationService.confirm({
      title: `¿Confirma Finalizar la tarea ${host.numeroTareaTramite},   ${host.descripTareaTramite} ?`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.finalizarTarea(host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({
            title: 'Finalizada',
            text: `La tarea ${host.numeroTareaTramite} fue finalizada.`,
          });
          this.refrescarGridAdapter(host);
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.warning({ title: 'No Finalizada', text: err.error?.message || '' });
          this.refrescarGrid(host, host.idTramite);
        },
      });
    });
  }

  editarTarea(host: EditaExpedienteTareasHost): void {
    this.expedientesService
      .EditarTareaTramiteExpedientes(host.tareatramiteexpedienteeditar, host.idTarea)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refrescarGrid(host, host.idTramite);
          host.verListadoTareasModal();
          host.onTareaEditada?.();
        },
      });
  }

  crearTarea(host: CrearTareaTramiteHost): void {
    if (tieneArchivoPendienteSubida(host.base64code, host.name, host.identificadorFicheroSubido)) {
      this.notificationService.error(
        'El archivo seleccionado no se ha subido correctamente. Por favor, intenta subir el archivo nuevamente.',
      );
      return;
    }

    prepararTareaParaCreacion(host.tareatramiteexpedientecrear, {
      idTramite: host.idTramite,
      usuContrl: host.usuContrl || '',
      identificadorFicheroSubido: host.identificadorFicheroSubido,
    });

    const plantillaDefecto = normalizarPlantillaDefecto(host.plantillaDefecto);

    if (!validarTareaParaCreacion(host.tareatramiteexpedientecrear)) {
      this.notificationService.incompleteFields();
      return;
    }

    this.expedientesService
      .crearTareaTramiteExpedientes(host.tareatramiteexpedientecrear, plantillaDefecto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.saveSuccess('Tarea');
          this.modalManagerService.closeModal('NuevaTareaTra');
          host.onTareaCreada?.();
          this.refrescarGrid(host, host.idTramite);
          host.borraDatosNuevaTarea();
        },
        error: (err: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error inesperado al guardar la tarea.';
          if (err.status === 400) {
            errorMessage = 'Datos inválidos. Por favor, revisa la información ingresada.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          this.notificationService.error(errorMessage);
          this.modalManagerService.keepModalOpen('NuevaTareaTra');
        },
      });
  }

  crearTablonAnuncio(host: EditaExpedienteTareasHost): void {
    const form = host.creartablonanuncio;
    if (!form.tipAnunc || !form.desAnunc || !form.fecDesde || !form.fecHasta) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    this.expedientesService.creaTablonAnuncio(form, host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.sourceTareasTramite = createTareaGridAdapter(host.idTramite);
        this.notificationService.success({ title: 'Enviado Tablón de anuncio' });
        host.creartablonanuncio = new CrearTablonAnuncio();
      },
      error: () => {
        this.notificationService.warning({ title: 'No se pudo crear el Tablón de anuncios' });
      },
    });
  }

  conviertePDF(host: EditaExpedienteTareasHost): void {
    host.spinnervisible = false;
    this.expedientesService.conviertopdf(host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        if (data != null) {
          this.notificationService.success({ title: 'Se ha realizado la conversión' });
        } else {
          this.notificationService.warning({ title: 'la conversión a pdf no fue posible' });
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error?.text === 'OK') {
          host.spinnervisible = true;
          this.notificationService.success({ title: 'Conversión realizada' });
          this.refrescarGridAdapter(host);
        } else {
          this.notificationService.warning({ title: error.error?.message });
        }
      },
    });
  }

  clickTareaProcedimiento(
    host: ClickTareaProcedimientoHost,
    event: { args: { row: { bounddata: { plantillaDefecto: unknown } } } },
  ): void {
    host.veoAcciones = true;
    host.disabledArchivoTareaTramite = true;
    host.plantillaDefecto = normalizarPlantillaDefectoSeleccion(event.args.row.bounddata.plantillaDefecto);
  }
}
