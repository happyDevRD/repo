import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { NuevoExpediente, VerExpediente } from '../../expedientes/expedientes'
import { EditExpediente, VerSolicitud } from '../models'
import { ExpedienteApiService } from '../../../core/service/expediente/expediente-api.service'
import { SolicitudesService } from '../solicitudes.service'
import { NotificationService } from '../../../core/service/notification.service'
import { ModalManagerService } from '../../../core/service/modal-manager.service'
import { SolicitudesGridFacade, SolicitudesGridHost } from './solicitudes-grid.facade'

export interface SolicitudesExpedienteHost extends SolicitudesGridHost {
  nuevoexpediente: NuevoExpediente
  versolicitud: VerSolicitud
  verexpediente: VerExpediente
  editexpediente: EditExpediente
  asuntoexpedi: string
  asuntoSolicitud?: string
  idsolicitud: number
  iddocum: string
  idhisDocum: string
  idRepre: string
  idHisRepre: string
  idexpediente: number
  idexpedienteAsoc: number
  intructorExpediente: string
  fechanuevoExpedi: Date
  isIniciandoExpediente: boolean
  activainiciaExpedi: boolean
  expsolicitud: string
  veoIniciarExp: boolean
  recargarpagina(): void
  cerrarModal(modalId: string): void
}

@Injectable()
export class SolicitudesExpedienteFacade {
  private readonly destroyRef = inject(DestroyRef)

  public mostrarValidacionesIniciarExpediente = false

  constructor(
    private readonly expedienteApi: ExpedienteApiService,
    private readonly solicitudesService: SolicitudesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: SolicitudesGridFacade,
    private readonly router: Router,
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

    this.expedienteApi.crearExpediente(host.nuevoexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        host.isIniciandoExpediente = false;
        const refExpediente = response?.ejercicio != null && response?.numero != null
          ? `${response.ejercicio}/${response.numero}`
          : '';
        host.cerrarModal('iniciarExpedieModal');
        host.expsolicitud = refExpediente;
        host.veoIniciarExp = false;
        const idExp = (response as NuevoExpediente & { id?: number; idExpediente?: number }).id
          ?? (response as { idExpediente?: number }).idExpediente;
        if (idExp != null) {
          host.idexpedienteAsoc = Number(idExp);
        }
        this.gridFacade.refreshSolicitudesList(host, true);
        this.notificationService.success(
          refExpediente
            ? `Se ha creado el expediente: ${refExpediente}`
            : 'Se ha creado el expediente correctamente',
        );
      },
      error: () => {
        host.isIniciandoExpediente = false;
        this.notificationService.error('Ha ocurrido un error al crear el expediente. Inténtelo de nuevo.');
      },
    });
  }

  iniciarLegacy(host: SolicitudesExpedienteHost): void {
    this.prepararDatos(host)

    this.expedienteApi.crearExpediente(host.nuevoexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.notificationService.success(`Se ha creado el expediente: ${response.ejercicio}/${response.numero}`)
        this.gridFacade.refreshSolicitudesList(host, true)
      },
      error: () => {},
    })
  }

  getExpediente(host: SolicitudesExpedienteHost): void {
    this.expedienteApi.getExpediente2(host.idexpedienteAsoc).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((verexpediente) => {
      host.verexpediente = verexpediente
    })
    host.activainiciaExpedi = false
  }

  editExpediente(host: SolicitudesExpedienteHost): void {
    this.expedienteApi.editarInstructor(
      host.idexpediente,
      host.intructorExpediente,
    )
  }

  creaExpediente(host: SolicitudesExpedienteHost): void {
    this.solicitudesService.creaExpediente(host.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.router.navigate(['/solicitudes'])
    })
  }
}

