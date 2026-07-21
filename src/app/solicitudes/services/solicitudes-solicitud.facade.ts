import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreaSolicitudNuevo, EditarSolicitud } from '../solicitudes';
import { RepresentanteExpLIstar } from '../../expedientes/expedientes';
import { SolicitudesService } from '../solicitudes.service';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { SolicitudesGridFacade, SolicitudesGridHost } from './solicitudes-grid.facade';
import { applyRepresentanteToCreate, applyRepresentanteToEdit } from '../helpers/solicitudes-representante.helper';

export interface SolicitudesSolicitudHost extends SolicitudesGridHost {
  creasolicitud: CreaSolicitudNuevo;
  editasolicitud: EditarSolicitud;
  representanteexplistar: RepresentanteExpLIstar;
  seleccionoRepre: string | String;
  idsolicitud: number;
  ejerNumeroSolicitud: string;
  isAsignando: boolean;
  isRechazando: boolean;
  isModificandoSolicitud: boolean;
  recargapagina(): void;
  recargarpagina(): void;
  limpiarErroresSolicitud(): void;
  limpiarDatosModificar(): void;
  limpiaDatosEditarSolicitudes(): void;
  cerrarModal(modalId: string): void;
}

@Injectable()
export class SolicitudesSolicitudFacade {
  private readonly destroyRef = inject(DestroyRef);

  public mostrarValidacionesAsignar = false;
  public mostrarValidacionesRechazar = false;
  public mostrarValidacionesModificarSolicitud = false;

  constructor(
    private readonly solicitudesService: SolicitudesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: SolicitudesGridFacade,
    private readonly router: Router,
  ) {}

  isUsuarioAsignadoInvalid(host: SolicitudesSolicitudHost): boolean {
    return this.mostrarValidacionesAsignar && (!host.editasolicitud.usuario || host.editasolicitud.usuario === '');
  }

  isMotivoRechazoInvalid(host: SolicitudesSolicitudHost): boolean {
    return this.mostrarValidacionesRechazar && (!host.editasolicitud.motivoRechazo || host.editasolicitud.motivoRechazo.trim() === '');
  }

  isAsuntoModificarInvalid(host: SolicitudesSolicitudHost): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!host.editasolicitud.asunto || host.editasolicitud.asunto.trim() === '');
  }

  isFechaModificarInvalid(host: SolicitudesSolicitudHost): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!host.editasolicitud.fecInicio);
  }

  isDniModificarInvalid(host: SolicitudesSolicitudHost): boolean {
    return this.mostrarValidacionesModificarSolicitud && (!host.editasolicitud.dni || host.editasolicitud.dni.trim() === '');
  }

  /**
   * Maneja el envío del formulario de asignación con validaciones y feedback mejorado
   */
  onAsignarSubmit(host: SolicitudesSolicitudHost): void {
    this.mostrarValidacionesAsignar = true;

    if (!host.editasolicitud.usuario) {
      this.notificationService.incompleteFields('Debe seleccionar un usuario para asignar la solicitud');
      return;
    }

    this.notificationService.confirm({
      title: '¿Confirmar asignación?',
      text: `¿Está seguro de asignar esta solicitud a ${host.editasolicitud.usuario}?`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignacion(host);
      }
    });
  }

  /**
   * Maneja el envío del formulario de rechazo con validaciones y feedback mejorado
   */
  onRechazarSubmit(host: SolicitudesSolicitudHost): void {
    this.mostrarValidacionesRechazar = true;

    if (!host.editasolicitud.motivoRechazo || host.editasolicitud.motivoRechazo.trim() === '') {
      this.notificationService.incompleteFields('Debe indicar un motivo para rechazar la solicitud');
      return;
    }

    this.notificationService.confirmDelete('solicitud').then((result) => {
      if (result.isConfirmed) {
        this.ejecutarRechazo(host);
      }
    });
  }

  /**
   * Maneja el envío del formulario de modificar solicitud con validaciones y feedback mejorado
   */
  onModificarSolicitudSubmit(host: SolicitudesSolicitudHost): void {
    this.mostrarValidacionesModificarSolicitud = true;

    let hasErrors = false;

    if (!host.editasolicitud.asunto || host.editasolicitud.asunto.trim() === '') {
      this.notificationService.incompleteFields('El asunto es obligatorio');
      hasErrors = true;
    }

    if (!host.editasolicitud.fecInicio) {
      this.notificationService.incompleteFields('La fecha de solicitud es obligatoria');
      hasErrors = true;
    }

    if (!host.editasolicitud.dni || host.editasolicitud.dni.trim() === '') {
      this.notificationService.incompleteFields('El DNI del interesado es obligatorio');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    this.notificationService.confirm({
      title: '¿Confirmar modificación?',
      text: `¿Está seguro de modificar esta solicitud?`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarModificar(host);
      }
    });
  }

  crear(host: SolicitudesSolicitudHost): void {
    host.creasolicitud.ejercicio = host.creasolicitud.fecInicio.toString().substring(0, 4);
    applyRepresentanteToCreate(host.creasolicitud, host.representanteexplistar, host.seleccionoRepre);

    this.solicitudesService.creaSolicitud(host.creasolicitud).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        if (data.asunto) {
          this.notificationService.saveSuccess('Solicitud');
          host.limpiarErroresSolicitud();
          this.modalManagerService.closeModal('nsolicitudModal');
          setTimeout(host.recargapagina, 1000);
          return;
        }

        this.notificationService.error('No se pudo crear la solicitud');
        this.modalManagerService.keepModalOpen('nsolicitudModal');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.notificationService.error('No se pudo crear la solicitud');
        } else {
          this.notificationService.error('Error al crear la solicitud');
        }
        this.modalManagerService.keepModalOpen('nsolicitudModal');
      },
    });
  }

  asignar(host: SolicitudesSolicitudHost, id: number): void {
    this.solicitudesService.AsignarA(host.editasolicitud, id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.router.navigate(['/solicitudes']);
      setTimeout(host.recargarpagina, 1000);
    });
  }

  ejecutarAsignacion(host: SolicitudesSolicitudHost): void {
    host.isAsignando = true;

    this.solicitudesService.AsignarA(host.editasolicitud, host.idsolicitud).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.isAsignando = false;
        host.cerrarModal('asignarModal');
        this.notificationService
          .success(`Solicitud asignada correctamente a ${host.editasolicitud.usuario}`)
          .then(() => {
            this.router.navigate(['/solicitudes']);
            setTimeout(host.recargarpagina, 1000);
          });
      },
      error: () => {
        host.isAsignando = false;
        this.notificationService.error('Ha ocurrido un error al asignar la solicitud. Inténtelo de nuevo.');
      },
    });
  }

  ejecutarRechazo(host: SolicitudesSolicitudHost): void {
    host.isRechazando = true;
    host.editasolicitud.estado = 'RECHAZADA';

    this.solicitudesService.editaSolicitud(host.editasolicitud, host.idsolicitud).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.isRechazando = false;
        host.cerrarModal('rechazaSoliModal');
        this.notificationService
          .success(`Solicitud rechazada correctamente.\nMotivo: ${host.editasolicitud.motivoRechazo}`)
          .then(() => {
            this.router.navigate(['/solicitudes']);
            setTimeout(host.recargarpagina, 1000);
          });
      },
      error: () => {
        host.isRechazando = false;
        this.notificationService.error('Ha ocurrido un error al rechazar la solicitud. Inténtelo de nuevo.');
      },
    });
  }

  rechazarLegacy(host: SolicitudesSolicitudHost, id: number): void {
    if (!host.editasolicitud.motivoRechazo) {
      this.notificationService.incompleteFields('Por favor, complete el motivo de rechazo.');
      return;
    }

    this.notificationService.confirmDelete('solicitud').then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.editasolicitud.estado = 'RECHAZADA';
      this.solicitudesService.editaSolicitud(host.editasolicitud, id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => {
        this.router.navigate(['/solicitudes']);
        setTimeout(host.recargarpagina, 1000);
      });
    });
  }

  editar(host: SolicitudesSolicitudHost, id: number): void {
    applyRepresentanteToEdit(host.editasolicitud, host.representanteexplistar, host.seleccionoRepre);

    this.solicitudesService.editaSolicitud(host.editasolicitud, id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.gridFacade.refreshSolicitudesList(host, true);
      host.representanteexplistar.desPerEntid = '';
      host.limpiaDatosEditarSolicitudes();
    });
  }

  ejecutarModificar(host: SolicitudesSolicitudHost): void {
    host.isModificandoSolicitud = true;
    applyRepresentanteToEdit(host.editasolicitud, host.representanteexplistar, host.seleccionoRepre);

    this.solicitudesService.editaSolicitud(host.editasolicitud, host.idsolicitud).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.isModificandoSolicitud = false;
        host.cerrarModal('edicionSolicitudModal');
        this.notificationService.success('Solicitud modificada correctamente').then(() => {
          host.recargarpagina();
          host.limpiarDatosModificar();
        });
      },
      error: () => {
        host.isModificandoSolicitud = false;
        this.notificationService.error('Ha ocurrido un error al modificar la solicitud. Inténtelo de nuevo.');
      },
    });
  }

  eliminar(host: SolicitudesSolicitudHost, id: number): void {
    this.notificationService.confirm({
      title: `¿ Confirma eliminar la solicitud : ${host.ejerNumeroSolicitud} ?`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.solicitudesService.deleteSolicitud(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({ title: 'Eliminada!', text: `Solicitud  ${host.ejerNumeroSolicitud} eliminada!` });
          setTimeout(host.recargapagina, 1000);
        },
        error: () => {
          this.notificationService.warning('No se pudo borrar la solicitud. Tiene documentos asociados.');
        },
      });
    });
  }
}
