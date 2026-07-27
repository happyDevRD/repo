import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MUNICIO } from '../../../core/constants/datos';
import { etiquetaInsideDryRunHtml } from '../../../core/constants/inside-simulacion.constants';
import {
  ConsultaDni,
  CrearMensaje,
  EditExpediente,
  NuevoExpediente,
  RegistroDocumento,
  RepresentanteExpLIstar,
  VerExpediente,
} from '../expedientes';
import { ExpedientesService } from '../expedientes.service';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { UserSessionService } from '../../../core/service/user-session.service';
import { InsidePostCierreService } from '../../../core/service/inside/inside-post-cierre.service';
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade';
import { ExpedientesInsideFacade, ExpedientesInsideHost } from './expedientes-inside.facade';
import { applyRepresentanteToNuevoExpediente } from '../helpers/expedientes-representante.helper';
import { formatearFechaDDMMYYYY } from '../../../core/helper/fecha-legacy.helper';

export interface ExpedientesExpedienteHost extends ExpedientesGridHost {
  nuevoexpediente: NuevoExpediente;
  editexpediente: EditExpediente;
  consultadni: ConsultaDni;
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

/**
 * Host adicional requerido por `marcarExpedienteSeleccionado` (antes `marcaExpedienteNuevo`
 * en el componente): datos e indicadores que se pintan al seleccionar una fila del listado
 * de expedientes.
 */
export interface ExpedientesSeleccionHost extends ExpedientesExpedienteHost {
  idExpedienteString: string;
  registrodocumento: RegistroDocumento;
  VeoRegDoc: boolean;
  verexpediente: VerExpediente;
  veoAtributos: boolean;
  tituloExp: string;
  veoAbrir: boolean;
  puedoEditarExpe: boolean;
  valorEstado: string;
  verEmail: string;
  verArchivar: boolean;
  verAbrirExpediente: boolean;
  cancelarexp: boolean;
  cerrarexp: boolean;
  expedienteSelecVisible: boolean;
  descripcionProcedimiento: string;
  expeSelecDescrip: string;
  ejerexpe: unknown;
  numExp: unknown;
  verExpedientes: boolean;
  fechaExpediente: string;
  fechaCierre: string;
  fechaCancelacion: string;
  listarAtributos(): void;
  lanzaTareaProcedi(): void;
  getExpediente(): void;
  syncGridRenderContext(): void;
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
    private readonly http: HttpClient,
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

  isFechaExpedienteInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.fechaInicio;
  }

  isFormaAperturaInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.forma_apertura;
  }

  isFormaNotificacionInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.formaNotifi;
  }

  isEmailExpedienteInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente
      && host.nuevoexpediente.formaNotifi == 1
      && !host.nuevoexpediente.email;
  }

  isTituloExpedienteInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.titulo;
  }

  isInteresadoDNIInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.usuario;
  }

  isProcedimientoExpedienteInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.procedimiento;
  }

  onCrearExpedienteSubmit(host: ExpedientesExpedienteHost): void {
    host.mostrarValidacionesExpediente = true;

    if (
      this.isFechaExpedienteInvalid(host)
      || this.isFormaAperturaInvalid(host)
      || this.isFormaNotificacionInvalid(host)
      || this.isTituloExpedienteInvalid(host)
      || this.isInteresadoDNIInvalid(host)
      || this.isProcedimientoExpedienteInvalid(host)
      || this.isEmailExpedienteInvalid(host)
    ) {
      this.notificationService.incompleteFields();
      return;
    }

    this.notificationService.confirm(
      '¿Está seguro de que desea crear el expediente?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarCrear(host);
      }
    });
  }

  editExpediente(host: ExpedientesExpedienteHost): void {
    host.editexpediente.idPerso = host.consultadni.idPerso;
    this.expedientesService.editarExpediente(host.editexpediente, host.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();

    setTimeout(() => host.recargarpagina(), 1000);
  }

  abrirExpediente(host: ExpedientesExpedienteHost): void {
    host.editexpediente.estado = 'ABIERTO';

    this.expedientesService.editarExpediente(host.editexpediente, host.idexpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.notificationService.confirm({
        title: 'Esta seguro?',
        text: 'Abrir Expediente',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (!result.isConfirmed) {
          return;
        }

        this.notificationService.success({ title: 'Expediente Abierto' });
        this.gridFacade.refreshExpedientesList(host, this.session.user ?? '', true);
      });
    });
  }

  /**
   * Archivar sin REDSARA: PUT estado ARCHIVADO en iFlow (simulación demo).
   * TODO SARA real: cutover Fase 4 — integración red SARA.
   */
  archivarSimulado(host: ExpedientesExpedienteHost): void {
    if (!host.idexpediente) {
      this.notificationService.warning('Seleccione un expediente');
      return;
    }

    this.notificationService.confirm({
      title: 'Archivar expediente (simulación)',
      html: `${etiquetaInsideDryRunHtml()}
        <p>Sin red SARA: se marcará el expediente como <strong>ARCHIVADO</strong> en iFlow.</p>`,
      confirmButtonText: 'Archivar (simulación)',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const body = JSON.stringify({
        idExpediente: host.idexpediente,
        estado: 'ARCHIVADO',
        fecArchivo: new Date(),
      });
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.put(
        `${environment.apiUrl}expediente/editar/${host.idexpediente}`,
        body,
        { headers },
      ).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success({
            title: 'Archivado (simulación)',
            text: 'Expediente archivado en iFlow. Pendiente integración REDSARA.',
          });
          this.gridFacade.refreshExpedientesList(host, this.session.user ?? '', true);
          host.editExpedientes = false;
        },
        error: () => {
          this.notificationService.success({
            title: 'Archivado (simulación local)',
            text: 'No se pudo persistir en API; marcado para demo. Revisar al cutover SARA.',
          });
        },
      });
    });
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

  /**
   * Selección de fila en el listado de expedientes (antes `marcaExpedienteNuevo`
   * en el componente): carga el registro de documento asociado, los atributos,
   * el índice ENI (si está cerrado) y las fechas formateadas del expediente.
   */
  marcarExpedienteSeleccionado(host: ExpedientesSeleccionHost, rowData: any): void {
    host.idExpediente = rowData.id;
    host.idExpedienteString = rowData.id;
    host.idexpediente = rowData.id;
    this.gridFacade.refrescarSourceAtributo(host);

    if (rowData.idHisDocum) {
      this.expedientesService.getRegistroDocVer(rowData.idHisDocum).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        (registrodocumento) => (host.registrodocumento = registrodocumento),
      );
      host.VeoRegDoc = true;
    } else {
      host.VeoRegDoc = false;
    }

    if (rowData.email == '0') {
      host.verexpediente.email = '';
    }

    host.listarAtributos();
    host.veoAtributos = true;
    host.tituloExp = rowData.titulo!;

    host.veoAbrir = true;
    host.puedoEditarExpe = true;

    if (rowData.estado == 'CERRADO') {
      this.gridFacade.lanzoIndiceENI(host, rowData.id);
    }

    host.valorEstado = rowData.estado;
    host.syncGridRenderContext();

    if (rowData.email == '0' || rowData.email == 'SinDAtos') {
      host.verEmail = '';
    } else {
      host.verEmail = rowData.email;
    }

    if (rowData.estado == 'CERRADO') {
      host.verArchivar = true;
    } else {
      host.verArchivar = false;
    }

    if (rowData.estado == 'CERRADO' || rowData.estado == 'CANCELADO') {
      host.verAbrirExpediente = true;
      host.cancelarexp = false;
      host.cerrarexp = false;
    } else {
      host.verAbrirExpediente = false;
      host.cancelarexp = true;
      host.cerrarexp = true;
    }
    host.valorEstado = rowData.estado;
    host.syncGridRenderContext();

    host.expedienteSelecVisible = true;
    host.idProcedimiento = rowData.procedimiento.id;
    this.session.setIdProcedimiento(rowData.procedimiento.id);
    host.lanzaTareaProcedi();
    host.descripcionProcedimiento = rowData.procedimiento.descripcion;
    host.expeSelecDescrip = rowData.titulo;
    host.idexpediente = rowData.id;
    host.ejerexpe = rowData.ejercicio;
    host.numExp = rowData.numero;
    host.editExpedientes = true;
    host.verExpedientes = true;

    host.getExpediente();
    this.gridFacade.actualizaSourceTramite(host);

    // Fechas formateadas DD/MM/AAAA (antes cierre/cancelación usaban por error
    // los componentes de fecInicio en vez de su propia fecha).
    host.fechaExpediente = formatearFechaDDMMYYYY(rowData.fecInicio);
    host.fechaCierre = formatearFechaDDMMYYYY(rowData.fecFin);
    host.fechaCancelacion = formatearFechaDDMMYYYY(rowData.fecCancelacion);
  }
}
