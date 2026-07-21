import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TablaClickHandler } from '../../../core/helper/tabla-click-handler';
import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { NotificationService } from '../../../core/service/notification.service';
import { EnvioNotificaInfo } from '../../notificaciones/notificaciones-notifica-panel.component';
import { EditarTramiteExp } from '../../expedientes';
import { ListaTareaProcedi } from '../edita-expediente.models';
import { ExpedientesService } from '../../expedientes.service';
import { aplicarClickNotificacionNuevo, ClickNotificacionNuevoHost } from '../notificaciones/notificaciones-form-campos.helper';
import { formatearFechaNotificacionSeleccionada } from '../notificaciones/notificaciones-fechas.helper';
import { actualizarCheckboxNotificaciones } from '../notificaciones/notificaciones-grid-radio.helper';
import { calcularSeleccionNotificacion } from '../notificaciones/notificaciones-seleccion.helper';
import { EditaExpedienteNotificacionesFacade } from '../notificaciones/edita-expediente-notificaciones.facade';
import { aplicarEdicionTramiteDesdeFila } from '../tramites/tramites-edicion.helper';
import { calcularSeleccionTramite } from '../tramites/tramites-seleccion.helper';
import { EditaExpedienteTramitadoresFacade, EditaExpedienteTramitadoresHost } from '../tramitadores/edita-expediente-tramitadores.facade';
import { marcarRadioButtonGrid } from '../shared/grid-radio-marker.helper';
import { abrirModalEditarTareaTramite } from '../tareas/tareas-modal.helper';
import {
  aplicarSeleccionTareaNueva,
  SeleccionTareaNuevaCallbacks,
  SeleccionTareaNuevaHost,
} from '../tareas/tareas-seleccion.helper';
import { environment } from 'src/environments/environment';

export interface EditaExpedienteTramiteGridHost {
  editartramiteexp: EditarTramiteExp;
  listatareaprocedi: ListaTareaProcedi[];
  formatearFechaParaInput(fecha: unknown): string;
  getListaTareas(): Observable<ListaTareaProcedi[]>;
  refrescoSourceTareasTramite(id: unknown): void;
  getnotificacionListar(): void;
}

export interface EditaExpedienteNotificacionGridHost {
  fechNotifi: unknown;
  idNotificacion: number;
  envioNotifica: EnvioNotificaInfo | null;
  editarNotificacion(id: number): void;
  vernotifi(id: number, modoVer: boolean): void | Promise<void>;
}

export interface EditaExpedienteTareaClickHost {
  idTarea: number;
  numeroArchivo: unknown;
  tareaProcedi: number;
  ejerNumExpedi: string;
  verExpediente: { ejercicio: number; numero: number };
  tareatramiteexpedientever: unknown;
  tareatramiteexpedientelistar: unknown[];
  descargafichero: string;
  getUsuarioListar(id: number): void;
  getTemaDocumentoListar(): void;
}

@Injectable()
export class EditaExpedienteWorkspaceFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificacionesFacade: EditaExpedienteNotificacionesFacade,
    private readonly tramitadoresFacade: EditaExpedienteTramitadoresFacade,
    private readonly modalManagerService: ModalManagerService,
    private readonly notificationService: NotificationService,
    private readonly expedientesService: ExpedientesService,
  ) {}

  clickTramiteNuevo(host: EditaExpedienteTramiteGridHost, event: { args: { rowindex: number; row: { bounddata: unknown } } }): void {
    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata as {
      id: number;
      fecTramite: string;
      fase: string;
      descripcion: string;
      numero: number;
    };

    setTimeout(() => marcarRadioButtonGrid('RadioTramite', rowIndex), 10);

    const estado = calcularSeleccionTramite(rowData, (fecha) => host.formatearFechaParaInput(fecha));
    Object.assign(host, estado);
    host.editartramiteexp.fecTramite = estado.fecTramiteEdicion;

    host.getListaTareas().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (listaTareaProcedimiento) => (host.listatareaprocedi = listaTareaProcedimiento),
      error: (err: HttpErrorResponse) => {
        console.log('Error Listar Tarea Procedimientos: ' + err.error?.text);
      },
    });

    host.refrescoSourceTareasTramite(rowData.id);
    host.getnotificacionListar();
  }

  clicktareaNueva(
    host: SeleccionTareaNuevaHost,
    event: { args: { rowindex: number; row: { bounddata: unknown } } },
    callbacks: SeleccionTareaNuevaCallbacks,
  ): void {
    marcarRadioButtonGrid('TareasTramite', event.args.rowindex);

    GridRadioSelector.handleRowClick(event, 'TareasTramite', (rowData) => {
      aplicarSeleccionTareaNueva(host, rowData, this.expedientesService, callbacks);
    });
  }

  clicktarea(host: EditaExpedienteTareaClickHost, id: number, codArchivo: unknown, tareaProcedi: number): void {
    host.idTarea = id;
    host.numeroArchivo = codArchivo;
    host.tareaProcedi = tareaProcedi;
    host.getUsuarioListar(tareaProcedi);
    host.ejerNumExpedi = `${host.verExpediente.ejercicio}/${host.verExpediente.numero}`;
    host.getTemaDocumentoListar();
    this.expedientesService.getTareaTramiteExpVer(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareatramiteexpedientever) => (host.tareatramiteexpedientever = tareatramiteexpedientever),
    });
    host.descargafichero = `${environment.apiUrl}archivo/descarga/${host.numeroArchivo}`;
  }

  clickTramitadores(
    host: EditaExpedienteTramitadoresHost,
    event: { args: { rowindex: number; row: { bounddata: unknown } } },
  ): void {
    setTimeout(() => marcarRadioButtonGrid('RadioTramitador', event.args.rowindex), 10);
    this.tramitadoresFacade.seleccionarTramitador(host, event.args.row.bounddata as { id: number });
  }

  clicknotificacionNuevo(
    host: ClickNotificacionNuevoHost & EditaExpedienteNotificacionGridHost,
    event: { args: { row: { bounddata: { idNotif: number } } } },
  ): void {
    aplicarClickNotificacionNuevo(host, event.args.row.bounddata);
    host.vernotifi(event.args.row.bounddata.idNotif, false);
  }

  onNotificacionClick(host: EditaExpedienteNotificacionGridHost, event: { args: { rowindex: number; row: { bounddata: { fecNotif: unknown } } } }): void {
    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata;

    if (!rowData) {
      return;
    }

    actualizarCheckboxNotificaciones(rowIndex);
    this.habilitarBotonesNotificacion(host, rowData);
    host.fechNotifi = formatearFechaNotificacionSeleccionada(rowData.fecNotif);
  }

  onNotificacionDoubleClick(host: EditaExpedienteNotificacionGridHost, event: unknown): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData: { idNotif: number }) => {
      host.editarNotificacion(rowData.idNotif);
    });
  }

  habilitarBotonesNotificacion(host: any, rowData: unknown): void {
    Object.assign(host, calcularSeleccionNotificacion(rowData));
    this.notificacionesFacade.cargarEnvioNotificaActivo(host.idNotificacion, (envio) => {
      host.envioNotifica = envio;
    });
  }

  onTramiteClick(event: unknown): void {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTramite"]', () => undefined);
  }

  onTramiteDoubleClick(host: any, event: unknown): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      aplicarEdicionTramiteDesdeFila(host as never, rowData);
      this.modalManagerService.openModal('editarTramiteModal');
    });
  }

  onTramitadorDoubleClick(host: { idTramitador: number }, event: unknown): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData: { id: number; nombre?: string }) => {
      host.idTramitador = rowData.id;
      this.notificationService.info(`Tramitador seleccionado: ${rowData.nombre || 'Sin nombre'}`);
      console.log('Datos del tramitador seleccionado:', rowData);
    });
  }

  onTareaClick(event: unknown): void {
    TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTareasTramite"]', (rowData) => {
      console.log('Tarea seleccionada:', rowData);
    });
  }

  onTareaDoubleClick(host: EditaExpedienteTareaClickHost, event: unknown): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData: { id: number; codArchivo: unknown; tareaProcedi: number }) => {
      this.clicktarea(host, rowData.id, rowData.codArchivo, rowData.tareaProcedi);
    });
  }

  onTareaTramiteDoubleClick(host: any, event: unknown): void {
    TablaClickHandler.onRowDoubleClick(event, (rowData) => {
      abrirModalEditarTareaTramite(host as never, rowData);
    });
  }
}
