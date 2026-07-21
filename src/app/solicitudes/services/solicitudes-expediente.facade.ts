import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NuevoExpediente } from '../../expedientes/expedientes';
import { VerSolicitud } from '../solicitudes';
import { ExpedientesService } from '../../expedientes/expedientes.service';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { SolicitudesGridFacade, SolicitudesGridHost } from './solicitudes-grid.facade';

export interface SolicitudesExpedienteHost extends SolicitudesGridHost {
  nuevoexpediente: NuevoExpediente;
  versolicitud: VerSolicitud;
  asuntoexpedi: string;
  idsolicitud: number;
  iddocum: string;
  idhisDocum: string;
  idRepre: string;
  idHisRepre: string;
  fechanuevoExpedi: Date;
  isIniciandoExpediente: boolean;
  recargarpagina(): void;
  cerrarModal(modalId: string): void;
}

@Injectable()
export class SolicitudesExpedienteFacade {
  private readonly destroyRef = inject(DestroyRef);

  public mostrarValidacionesIniciarExpediente = false;

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: SolicitudesGridFacade,
  ) {}

  isTituloExpedienteInvalid(host: SolicitudesExpedienteHost): boolean {
    return this.mostrarValidacionesIniciarExpediente && (!host.nuevoexpediente.titulo || host.nuevoexpediente.titulo.trim() === '');
  }

  isProcedimientoInvalid(host: SolicitudesExpedienteHost): boolean {
    return this.mostrarValidacionesIniciarExpediente && (!host.nuevoexpediente.procedimiento || host.nuevoexpediente.procedimiento === '');
  }

  /**
   * Maneja el envío del formulario de iniciar expediente con validaciones y feedback mejorado
   */
  onIniciarExpedienteSubmit(host: SolicitudesExpedienteHost): void {
    this.mostrarValidacionesIniciarExpediente = true;

    if (!host.nuevoexpediente.titulo || host.nuevoexpediente.titulo.trim() === '') {
      this.notificationService.incompleteFields('Debe indicar un título para el expediente');
      return;
    }

    if (!host.nuevoexpediente.procedimiento || host.nuevoexpediente.procedimiento === '') {
      this.notificationService.incompleteFields('Debe seleccionar un procedimiento');
      return;
    }

    this.notificationService.confirm({
      title: '¿Confirmar creación de expediente?',
      text: `¿Está seguro de crear el expediente con el título: "${host.nuevoexpediente.titulo}"?`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarCrear(host);
      }
    });
  }

  prepararDatos(host: SolicitudesExpedienteHost): void {
    if (!host.nuevoexpediente.titulo) {
      host.nuevoexpediente.titulo = host.versolicitud.asunto;
    }

    host.nuevoexpediente.idDocum = host.iddocum;
    host.nuevoexpediente.idHisDocum = host.idhisDocum;
    host.nuevoexpediente.idRepre = host.idRepre;
    host.nuevoexpediente.idHisRepre = host.idHisRepre;
    host.nuevoexpediente.idHisPerso = host.versolicitud.idHisPerso;
    host.nuevoexpediente.idPerso = host.versolicitud.idPerso;
    host.nuevoexpediente.ejercicio = host.versolicitud.ejercicio;
    host.nuevoexpediente.fechaInicio = host.fechanuevoExpedi;
    host.nuevoexpediente.forma_apertura = 'INSTANCIA';
    host.nuevoexpediente.idsolicitud = host.idsolicitud;
  }

  ejecutarCrear(host: SolicitudesExpedienteHost): void {
    host.isIniciandoExpediente = true;
    this.prepararDatos(host);

    this.expedientesService.crearExpediente(host.nuevoexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        host.isIniciandoExpediente = false;
        host.cerrarModal('iniciarExpedieModal');
        this.notificationService
          .success(`Se ha creado el expediente: ${response.ejercicio}/${response.numero}`)
          .then(() => {
            host.recargarpagina();
          });
      },
      error: () => {
        host.isIniciandoExpediente = false;
        this.notificationService.error('Ha ocurrido un error al crear el expediente. Inténtelo de nuevo.');
      },
    });
  }

  iniciarLegacy(host: SolicitudesExpedienteHost): void {
    this.prepararDatos(host);

    this.expedientesService.crearExpediente(host.nuevoexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.notificationService.success(`Se ha creado el expediente: ${response.ejercicio}/${response.numero}`);
        this.gridFacade.refreshSolicitudesList(host, true);
      },
      error: () => {},
    });
  }
}
