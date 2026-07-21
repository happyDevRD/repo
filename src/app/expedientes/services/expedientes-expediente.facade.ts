import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MUNICIO } from '../../core/constants/datos';
import { CrearMensaje, NuevoExpediente, RepresentanteExpLIstar } from '../expedientes';
import { ExpedientesService } from '../expedientes.service';
import { NotificationService } from '../../core/service/notification.service';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { UserSessionService } from '../../core/service/user-session.service';
import { InsidePostCierreService } from '../../core/service/inside/inside-post-cierre.service';
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade';
import { ExpedientesInsideFacade, ExpedientesInsideHost } from './expedientes-inside.facade';
import { applyRepresentanteToNuevoExpediente } from '../helpers/expedientes-representante.helper';

export interface ExpedientesExpedienteHost extends ExpedientesGridHost {
  nuevoexpediente: NuevoExpediente;
  representanteexplistar: RepresentanteExpLIstar;
  seleccionoRepre: string | String;
  crearmensaje: CrearMensaje;
  idexpediente: number;
  ejercicio: Date;
  Fecha: Date;
  usuarioPermiso: string;
  isCreandoExpediente: boolean;
  isAsignandoTramitador: boolean;
  mostrarValidacionesExpediente: boolean;
  editExpedientes: boolean;
  veoPermisoProcedi: boolean;
  fechacancelacionexpedi: Date;
  fechacierreexpedi: unknown;
  serieDocumental: unknown;
  recargarpagina(): void;
  limpiarDatosExpediente(): void;
  limpiarDatosAsignarTramitador(): void;
  limpiadatosnuevoexpediente(): void;
  cerrarModal(modalId: string): void;
}

@Injectable()
export class ExpedientesExpedienteFacade {
  private readonly destroyRef = inject(DestroyRef);

  // Wizard de consulta de DNI / persona / representante para "Nuevo Expediente"
  // (antes solicitadni, selecTipPerso, gestimunicip, cambiamosRepre... en el componente).
  public nombredni: string;
  public apellido1dni: any;
  public apellido2dni: any;
  public direcciondni: string;
  public cpdni: any;
  public provinciadni: any;
  public nommunicipiodni: any;
  public idhispersodni: any;
  public idpersodni: any;

  public dniok = false;
  public existepersonaentidad = false;
  public controlpersonaentidadcrear = false;
  public vernumerorepre = false;
  public cambioRepresentante = true;
  public representanteok = true;
  public existeRepresentante = false;
  public documrepre = false;
  public cambioRepresentantePideDocu = false;

  public InteresadoSolicitud: string;
  public dirPosta: string;
  public codPosta: string;
  public provincia: string;
  public Municipio: string;

  public selectnombre = false;
  public selectape1 = false;
  public selectape2 = false;
  public selectRazonSocial = false;
  public selectCIF = false;
  public selectTRESIDENTE = false;

  public municiflitro: any[] = [];

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: ExpedientesGridFacade,
    private readonly session: UserSessionService,
    private readonly insidePostCierreService: InsidePostCierreService,
    private readonly insideFacade: ExpedientesInsideFacade,
  ) {}

  solicitadni(host: ExpedientesExpedienteHost, dni: string): void {
    this.expedientesService.getDni2(dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.nombredni = response.desPerEntid;
        this.apellido1dni = response.apellido1;
        this.apellido2dni = response.apellido2;
        this.direcciondni = response.dirPosta;
        this.cpdni = response.codPosta;
        this.provinciadni = response.provincia;
        this.idhispersodni = response.idHisPerso;
        this.nommunicipiodni = response.municipio;
        this.idpersodni = response.idPerso;
        host.nuevoexpediente.idPerso = response.idPerso;
        host.nuevoexpediente.idHisPerso = response.idHisPerso;

        host.sourceListRepre = new jqx.dataAdapter({
          dataType: 'json',
          dataFields: [
            { name: 'id', type: 'any' },
            { name: 'idPerso', type: 'any' },
            { name: 'idHisPerso', type: 'any' },
            { name: 'desPerEntid', type: 'any' },
            { name: 'dirPosta', type: 'any' },
          ],
          url: `${environment.apiUrl}personaRepresentante/listar/${host.nuevoexpediente.idPerso}/${host.nuevoexpediente.idHisPerso}`,
          id: 'id',
          sortcolumn: 'id',
          sortdirection: 'desc',
        });

        if (response.nombre) {
          this.dniok = true;
          this.InteresadoSolicitud = response.desPerEntid;
          this.dirPosta = response.dirPosta;
          this.codPosta = response.codPosta.toString();
          this.provincia = response.provincia;
          this.Municipio = response.municipio;
          this.controlpersonaentidadcrear = true;
        } else {
          this.dniok = false;
          this.existepersonaentidad = true;
          this.controlpersonaentidadcrear = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.notificationService.error({ title: 'El interesado no está registrado', text: 'Por favor introduzca los datos para el alta' });
          this.existepersonaentidad = true;
          this.dniok = false;
        } else {
          this.existepersonaentidad = false;
        }
      },
    });

    this.dniok = true;
  }

  selecTipPerso(valor: any): void {
    switch (valor) {
      case '1':
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = true;
        this.selectRazonSocial = false;
        break;
      case '2':
        this.selectnombre = false;
        this.selectape1 = false;
        this.selectape2 = false;
        this.selectRazonSocial = true;
        break;
      case '3':
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = false;
        this.selectRazonSocial = false;
        break;
    }
  }

  gestimunicip(id: any): void {
    this.municiflitro = [];

    for (let index = 0; index < MUNICIO.length; index++) {
      const element = MUNICIO[index];
      if (element.id.substring(0, 2) == id) {
        this.municiflitro.push(element);
      }
    }
  }

  cambiamosRepre(): void {
    this.cambioRepresentante = false;
    this.representanteok = false;
    this.existeRepresentante = false;
    this.documrepre = true;
    this.dniok = false;
    this.cambioRepresentantePideDocu = true;
  }

  getrepresentanteexpediente(host: ExpedientesExpedienteHost, idPerso: number, idHisPerso: number): void {
    this.expedientesService.getRepresentanteExpediente(idPerso, idHisPerso).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (representanteexplistar) => {
        host.representanteexplistar = representanteexplistar;
      },
      error: (err: HttpErrorResponse) => {
        host.representanteexplistar.desPerEntid = 'Sin representante asociado';
        console.log('paso por error: ' + err.error.message);
        host.nuevoexpediente.idHisRepre = null;
        host.nuevoexpediente.idRepre = null;
        host.representanteexplistar.idHisPerso = null;
        host.representanteexplistar.idPerso = null;
      },
    });
  }

  selecrepresentante(host: ExpedientesExpedienteHost, event: any): void {
    host.nuevoexpediente.idHisRepre = event.args.row.bounddata.idHisPerso;
    host.nuevoexpediente.idRepre = event.args.row.bounddata.idPerso;
  }

  /**
   * Restablece el wizard de consulta de DNI (antes usado por limpiadatosnuevoexpediente).
   */
  resetSolicitudDni(): void {
    this.existepersonaentidad = false;
    this.dniok = false;
  }

  ejecutarCrear(host: ExpedientesExpedienteHost): void {
    host.isCreandoExpediente = true;
    host.nuevoexpediente.ejercicio = host.ejercicio.getFullYear();
    applyRepresentanteToNuevoExpediente(host.nuevoexpediente, host.representanteexplistar, host.seleccionoRepre);

    this.expedientesService.crearExpediente(host.nuevoexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success('El expediente se ha creado exitosamente');
        host.limpiarDatosExpediente();
        setTimeout(host.recargarpagina, 1000);
      },
      error: () => {
        this.notificationService.error('Ha ocurrido un error al crear el expediente');
        host.isCreandoExpediente = false;
      },
    });
  }

  devolver(host: ExpedientesExpedienteHost, ejerexpe: unknown, numExp: unknown): void {
    this.notificationService.confirm({
      title: `¿Confirma devolver el expediente ${ejerexpe}/${numExp} ?`,
      text: 'Este paso no se podrá revertir',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.DevolverExpediente(host.idexpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => {
        this.gridFacade.refreshExpedientesListPlain(host, this.session.user ?? '');
      });
    });
  }

  cancelar(host: ExpedientesExpedienteHost): void {
    if (host.fechacancelacionexpedi == undefined) {
      this.notificationService.warning('Por favor rellene la fecha de cancelación');
      return;
    }

    this.notificationService.confirmDelete('Al confirmar cancelará el Expediente Seleccionado!').then((result) => {
      if (!result.isConfirmed) {
        host.fechacancelacionexpedi = new Date();
        return;
      }

      this.expedientesService.cancelarExpediente(host.idexpediente, host.fechacancelacionexpedi).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.editExpedientes = false;
          this.gridFacade.refreshExpedientesListPlain(host, this.session.user ?? '');
          this.notificationService.success('El Expediente ha sido cancelado');
          host.cerrarModal('cancelarExpModal');
        },
        error: () => {
          this.notificationService.error('Error al cancelar el expediente');
        },
      });
    });
  }

  cerrar(host: ExpedientesExpedienteHost): void {
    if (host.fechacierreexpedi == undefined || host.serieDocumental == undefined) {
      this.notificationService.incompleteFields();
      return;
    }

    this.notificationService.confirm('Al confirmar cerrará el Expediente Seleccionado!').then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService
        .cerrarExpediente(host.idexpediente, host.fechacierreexpedi, host.serieDocumental)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notificationService.success('El Expediente ha sido cerrado');
            this.gridFacade.refreshExpedientesList(host, this.session.user ?? '', true);
            host.cerrarModal('cerrarExpModal');
            this.insidePostCierreService.ofrecerEnvioTrasCierre(host.idexpediente);
            this.insideFacade.actualizarResumenPendientes(host as unknown as ExpedientesInsideHost);
          },
          error: (err: HttpErrorResponse) => {
            this.notificationService.warning(err.error.message);
          },
        });
    });
  }

  ejecutarAsignarTramitador(host: ExpedientesExpedienteHost): void {
    host.isAsignandoTramitador = true;
    host.crearmensaje.idExpediente = host.idexpediente;
    host.crearmensaje.destinatario = host.usuarioPermiso;
    host.crearmensaje.fecEnvio = host.Fecha;

    this.expedientesService.crearMensaje(host.crearmensaje).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success('El tramitador fue asignado');
        host.veoPermisoProcedi = false;
        host.limpiarDatosAsignarTramitador();
        host.cerrarModal('AsigfnarTramitadorModal');
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error.message);
        host.isAsignandoTramitador = false;
      },
    });
  }
}
