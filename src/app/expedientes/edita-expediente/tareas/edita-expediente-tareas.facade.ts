import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
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
  TareaProcedimientoSeleccionHost,
} from './tareas-procedimiento.helper';
import { refrescarSourceHistorico } from './historico.helper';
import { configurarAccionTarea, ConfigurarAccionTareaHost } from './tareas-accion.helper';

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
  borraDatosNuevaTarea(): void;
  onTareaCreada?(): void;
}

export interface TareaProcedimientoHost extends TareaProcedimientoSeleccionHost, ConfigurarAccionTareaHost {
  tareatramiteprocedimiento: TareaProcedimientoDTO;
}

export interface HistoricoGridHost {
  sourceHistorico: unknown;
}

@Injectable()
export class EditaExpedienteTareasFacade {
  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) {}

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

    this.expedientesService.getTareaTramiteExpedienteListar(idTramite).subscribe({
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

    this.expedientesService.getTramiteTarea(selectedValue as number).subscribe({
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
      Swal.fire({
        icon: 'error',
        title: 'Error de Selección',
        text: 'No se ha seleccionado ninguna tarea para borrar. Por favor, haz clic en una tarea de la lista primero.',
      });
      return;
    }

    Swal.fire({
      title: `¿Confirma eliminar la tarea ${host.numeroTareaTramite}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteTareaTramiteExpediente(host.idTarea).subscribe({
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
    Swal.fire({
      title: `¿Confirma Finalizar la tarea ${host.numeroTareaTramite},   ${host.descripTareaTramite} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.finalizarTarea(host.idTarea).subscribe({
        next: () => {
          Swal.fire(
            'Finalizada',
            `La tarea ${host.numeroTareaTramite} fue finalizada.`,
            'success',
          );
          this.refrescarGridAdapter(host);
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('No Finalizada', err.error?.message || '', 'warning');
          this.refrescarGrid(host, host.idTramite);
        },
      });
    });
  }

  editarTarea(host: EditaExpedienteTareasHost): void {
    this.expedientesService
      .EditarTareaTramiteExpedientes(host.tareatramiteexpedienteeditar, host.idTarea)
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
      Swal.fire('Debe rellenar todos los campos obligatorios.');
      return;
    }

    this.expedientesService.creaTablonAnuncio(form, host.idTarea).subscribe({
      next: () => {
        host.sourceTareasTramite = createTareaGridAdapter(host.idTramite);
        Swal.fire('Enviado Tablón de anuncio', '', 'success');
        host.creartablonanuncio = new CrearTablonAnuncio();
      },
      error: () => {
        Swal.fire('No se pudo crear el Tablón de anuncios', '', 'warning');
      },
    });
  }

  conviertePDF(host: EditaExpedienteTareasHost): void {
    host.spinnervisible = false;
    this.expedientesService.conviertopdf(host.idTarea).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire('Se ha realizado la conversión', '', 'success');
        } else {
          Swal.fire('la conversión a pdf no fue posible', '', 'warning');
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error?.text === 'OK') {
          host.spinnervisible = true;
          Swal.fire('Conversión realizada', '', 'success');
          this.refrescarGridAdapter(host);
        } else {
          Swal.fire(error.error?.message, '', 'warning');
        }
      },
    });
  }
}
