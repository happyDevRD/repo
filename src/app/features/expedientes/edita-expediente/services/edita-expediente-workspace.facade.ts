import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { JqxGridRowEvent } from '../../../../core/helper/jqx-grid-event.model';
import { ModalManagerService } from '../../../../core/service/modal-manager.service';
import { NotificationService } from '../../../../core/service/notification.service';
import { EnvioNotificaInfo } from '../../notificaciones/notificaciones-notifica-panel.component';
import { EditarTramiteExp } from '../../expedientes';
import { ListaTareaProcedi } from '../edita-expediente.models';
import { ExpedientesService } from '../../expedientes.service';
import { aplicarClickNotificacionNuevo, ClickNotificacionNuevoHost } from '../notificaciones/notificaciones-form-campos.helper';
import { formatearFechaNotificacionSeleccionada } from '../notificaciones/notificaciones-fechas.helper';
import { calcularSeleccionNotificacion, NotificacionGridRow } from '../notificaciones/notificaciones-seleccion.helper';
import { EditaExpedienteNotificacionesUiFacade } from '../notificaciones/edita-expediente-notificaciones-ui.facade';
import { aplicarEdicionTramiteDesdeFila, EdicionTramiteHost, TramiteGridRow } from '../tramites/tramites-edicion.helper';
import { calcularSeleccionTramite } from '../tramites/tramites-seleccion.helper';
import { ListarTramitador } from '../../expedientes';
import { abrirModalEditarTareaTramite, TareaTramiteGridRow } from '../tareas/tareas-modal.helper';
import {
  aplicarSeleccionTareaNueva,
  SeleccionTareaNuevaCallbacks,
  SeleccionTareaNuevaHost,
  TareaTramiteSeleccionRow,
} from '../tareas/tareas-seleccion.helper';
import { environment } from 'src/environments/environment';
import { TareaTramiteExpedienteVer } from '../../../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';

export type TramitadorGridRow = ListarTramitador

export interface TareaGridRow {
  id: number
  codArchivo: number | string | null
  tareaProcedi: number
}

export interface HistoricoGridRow {
  archivo: number | string
}

export interface EditaExpedienteTramitadoresHost {
  idExpediente: number;
  idTramitador: number;
  tramitadoresListado: ListarTramitador[];
  cargandoTramitadores: boolean;
}

export interface BootstrapModalesHost {
  modalAnteriorId: string | null;
  mostrarModalOperacion: boolean;
  showGenerarEntrada: boolean;
}

export interface EditaExpedienteTramiteGridHost {
  editartramiteexp: EditarTramiteExp;
  listatareaprocedi: ListaTareaProcedi[];
  formatearFechaParaInput(fecha: unknown): string;
  getListaTareas(): Observable<ListaTareaProcedi[]>;
  refrescoSourceTareasTramite(id: unknown): void;
  getnotificacionListar(): void;
}

export interface EditaExpedienteNotificacionGridHost {
  notifUiFacade: {
    fechNotifi: string | Date | null
    envioNotifica: EnvioNotificaInfo | null
    idNotificacion: number
    applySeleccionEstado(estado: ReturnType<typeof calcularSeleccionNotificacion>): void
  }
  idNotificacion: number
  descargoTEU: boolean
  desSituacion: string
  editarNotificacion(id: number): void
  vernotifi(id: number, modoVer: boolean): void | Promise<void>
}

export interface EditaExpedienteTareaClickHost {
  idTarea: number;
  numeroArchivo: number;
  tareaProcedi: number;
  ejerNumExpedi: string;
  verExpediente: { ejercicio: number; numero: number };
  tareatramiteexpedientever: TareaTramiteExpedienteVer;
  tareatramiteexpedientelistar: TareaTramiteSeleccionRow[];
  descargafichero: string;
  getUsuarioListar(id: number): void;
  getTemaDocumentoListar(): void;
}

@Injectable()
export class EditaExpedienteWorkspaceFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notifUiFacadeService: EditaExpedienteNotificacionesUiFacade,
    private readonly modalManagerService: ModalManagerService,
    private readonly notificationService: NotificationService,
    private readonly expedientesService: ExpedientesService,
  ) { }

  clickTramiteNuevo(host: EditaExpedienteTramiteGridHost, rowData: TramiteGridRow): void {
    const estado = calcularSeleccionTramite(rowData, (fecha) => host.formatearFechaParaInput(fecha));
    Object.assign(host, estado);
    host.editartramiteexp.fecTramite = estado.fecTramiteEdicion;

    host.getListaTareas().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (listaTareaProcedimiento) => {
        host.listatareaprocedi = listaTareaProcedimiento ?? []
      },
      error: (_err: HttpErrorResponse) => {
        host.listatareaprocedi = []
      },
    });

    host.refrescoSourceTareasTramite(rowData.id);
    host.getnotificacionListar();
  }

  clicktareaNueva(
    host: SeleccionTareaNuevaHost,
    rowData: TareaTramiteSeleccionRow,
    callbacks: SeleccionTareaNuevaCallbacks,
  ): void {
    if (!rowData?.id) {
      return
    }
    aplicarSeleccionTareaNueva(host, rowData, this.expedientesService, callbacks)
  }

  clicktarea(host: EditaExpedienteTareaClickHost, id: number, codArchivo: number | string | null, tareaProcedi: number): void {
    host.idTarea = id;
    host.numeroArchivo = Number(codArchivo ?? 0);
    host.tareaProcedi = tareaProcedi;
    if (Number.isFinite(tareaProcedi) && tareaProcedi > 0) {
      host.getUsuarioListar(tareaProcedi);
    }
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
    rowData: TramitadorGridRow,
  ): void {
    this.seleccionarTramitador(host, rowData);
  }

  clicknotificacionNuevo(
    host: ClickNotificacionNuevoHost & EditaExpedienteNotificacionGridHost,
    rowData: NotificacionGridRow,
  ): void {
    aplicarClickNotificacionNuevo(host, rowData);
    void this.notifUiFacadeService.vernotifi(undefined, rowData.idNotif, false);
  }

  onNotificacionClick(host: EditaExpedienteNotificacionGridHost, rowData: NotificacionGridRow): void {
    if (!rowData) {
      return;
    }

    this.habilitarBotonesNotificacion(host, rowData);
    host.notifUiFacade.fechNotifi = formatearFechaNotificacionSeleccionada(rowData.fecNotif) ?? null;
  }

  onNotificacionDoubleClick(host: EditaExpedienteNotificacionGridHost, rowData: Pick<NotificacionGridRow, 'idNotif'>): void {
    if (rowData?.idNotif != null) {
      this.notifUiFacadeService.editarNotificacion(undefined, rowData.idNotif)
    }
  }

  habilitarBotonesNotificacion(host: EditaExpedienteNotificacionGridHost, rowData: NotificacionGridRow): void {
    const estado = calcularSeleccionNotificacion(rowData)
    host.notifUiFacade.applySeleccionEstado(estado)
    host.notifUiFacade.idNotificacion = estado.idNotificacion
    host.descargoTEU = estado.descargoTEU
    host.desSituacion = estado.desSituacion
    this.notifUiFacadeService.cargarEnvioNotificaActivo(host.notifUiFacade.idNotificacion, (envio) => {
      host.notifUiFacade.envioNotifica = envio
    })
  }

  onTramiteDoubleClick(host: EdicionTramiteHost, rowData: TramiteGridRow): void {
    aplicarEdicionTramiteDesdeFila(host, rowData)
    this.modalManagerService.openModal('editarTramiteModal')
  }

  onTramitadorDoubleClick(host: { idTramitador: number }, rowData: TramitadorGridRow): void {
    host.idTramitador = rowData.id
    this.notificationService.info(`Tramitador seleccionado: ${rowData.usuario ?? 'Sin nombre'}`)
  }

  onTareaDoubleClick(host: EditaExpedienteTareaClickHost, rowData: TareaTramiteSeleccionRow): void {
    if (!rowData?.id) {
      return
    }
    this.clicktarea(host, rowData.id, rowData.archivo ?? null, rowData.tareaProcedimiento)
  }

  onTareaTramiteDoubleClick(
    host: { tareatramiteexpedienteeditar: { descripcion: string; numero: unknown; fecInicio: unknown; fecFin: unknown } },
    event: JqxGridRowEvent<TareaTramiteGridRow>,
  ): void {
    abrirModalEditarTareaTramite(host, event.args.row.bounddata)
  }

  // --- Tramitadores ---

  seleccionarTramitador(host: EditaExpedienteTramitadoresHost, rowData: { id: number }): void {
    host.idTramitador = rowData.id;
  }

  refrescarGrid(host: EditaExpedienteTramitadoresHost): void {
    host.cargandoTramitadores = true;
    this.expedientesService.getTramitadorListar(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (list) => {
        host.tramitadoresListado = list ?? [];
        host.cargandoTramitadores = false;
      },
      error: () => {
        host.tramitadoresListado = [];
        host.cargandoTramitadores = false;
      },
    });
  }

  borrarTramitador(host: EditaExpedienteTramitadoresHost): void {
    this.notificationService.confirm({
      title: '¿ Esta seguro ?',
      text: 'Eliminar Tramitador',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteTramitador(host.idTramitador).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.deleteSuccess('Tramitador');
          this.refrescarGrid(host);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
              title: error.error?.message,
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
          }
          this.notificationService.error('No se pudo eliminar el Tramitador');
        },
      });
    });
  }

  // --- Bootstrap modales ---

  abrirModalLiquidacion(host: BootstrapModalesHost): void {
    const modalAnteriorElement = document.querySelector('.modal.show') as HTMLElement | null;
    if (modalAnteriorElement && modalAnteriorElement.id !== 'liquidacionModal') {
      host.modalAnteriorId = modalAnteriorElement.id;
    }
    this.modalManagerService.openModal('liquidacionModal', { stack: !!host.modalAnteriorId });
  }

  cerrarModalLiquidacion(host: BootstrapModalesHost): void {
    const stackedParentId = host.modalAnteriorId;
    host.modalAnteriorId = null;
    this.modalManagerService.closeModal('liquidacionModal', {
      onHidden: () => {
        if (stackedParentId && !this.modalManagerService.isModalOpen(stackedParentId)) {
          window.setTimeout(() => this.modalManagerService.openModal(stackedParentId), 50);
        }
      },
    });
  }

  abrirModalOperacion(host: BootstrapModalesHost): void {
    host.mostrarModalOperacion = true;
    window.setTimeout(() => {
      const modalElement = document.getElementById('operacionModal');
      if (!modalElement) {
        console.warn('[ModalManager] operacionModal aún no renderizado');
        return;
      }
      this.modalManagerService.openModal('operacionModal', { stack: true });
    }, 50);
  }

  cerrarModalOperacion(host: BootstrapModalesHost): void {
    this.modalManagerService.closeModal('operacionModal', {
      onHidden: () => {
        host.mostrarModalOperacion = false;
        this.modalManagerService.reconcileModalDomState();
      },
    });
  }

  abrirModalGenerarEntrada(onShow?: () => void): void {
    onShow?.();
    this.modalManagerService.openModal('GenerarEntradaModal');
  }

  cerrarModalGenerarEntrada(onHidden?: () => void): void {
    this.modalManagerService.closeModal('GenerarEntradaModal', {
      onHidden: () => onHidden?.(),
    });
  }

  abrirModalObjetoTributario(): void {
    this.modalManagerService.openModal('bajaObjetoTributarioModal');
  }

  clickGenerarEntrada(host: BootstrapModalesHost): void {
    this.abrirModalGenerarEntrada(() => {
      host.showGenerarEntrada = true;
    });
  }

  closeGenerarEntradaModal(host: BootstrapModalesHost): void {
    this.cerrarModalGenerarEntrada(() => {
      host.showGenerarEntrada = false;
    });
  }
}
