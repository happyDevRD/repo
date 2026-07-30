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
  ExpedienteListar,
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
import { formatearFechaDDMMYYYY, fechaHoyISO } from '../../../core/helper/fecha-legacy.helper';
import { JqxGridRowEvent } from '../../../core/helper/jqx-grid-event.model';
import { MunicipioIne } from '../../../core/models/ine-catalogo.model';

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
  fechacancelacionexpedi: string;
  fechacierreexpedi: unknown;
  serieDocumental: unknown;
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
  public apellido1dni: string;
  public apellido2dni: string;
  public direcciondni: string;
  public cpdni: string | number | null;
  public provinciadni: string;
  public nommunicipiodni: string;
  public idhispersodni: number | null;
  public idpersodni: number | null;

  public dniok = false;
  public existepersonaentidad = false;
  public controlpersonaentidadcrear = false;
  public vernumerorepre = false;
  public cambioRepresentante = true;
  public representanteok = true;
  public existeRepresentante = false;
  public documrepre = false;
  public cambioRepresentantePideDocu = false;
  public buscandoInteresado = false;

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

  public municiflitro: MunicipioIne[] = [];

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

  buscarInteresado(host: ExpedientesExpedienteHost): void {
    const documento = String(host.nuevoexpediente.usuario ?? '').trim()
    if (!documento) {
      this.notificationService.incompleteFields('El documento del interesado es obligatorio')
      return
    }

    this.dniok = false
    this.existepersonaentidad = false
    this.buscandoInteresado = true
    this.nombredni = ''
    this.direcciondni = ''
    this.cpdni = ''
    this.provinciadni = ''
    this.nommunicipiodni = ''
    this.InteresadoSolicitud = ''
    this.dirPosta = ''
    this.codPosta = ''
    this.provincia = ''
    this.Municipio = ''
    host.nuevoexpediente.idPerso = null
    host.nuevoexpediente.idHisPerso = null

    this.expedientesService.getDni2(documento).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.buscandoInteresado = false
        this.nombredni = response.desPerEntid
        this.apellido1dni = String(response.apellido1 ?? '')
        this.apellido2dni = String(response.apellido2 ?? '')
        this.direcciondni = response.dirPosta
        this.cpdni = response.codPosta
        this.provinciadni = response.provincia
        this.idhispersodni = response.idHisPerso
        this.nommunicipiodni = response.municipio
        this.idpersodni = response.idPerso
        host.nuevoexpediente.idPerso = response.idPerso
        host.nuevoexpediente.idHisPerso = response.idHisPerso

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
        })

        if (response.nombre) {
          this.dniok = true
          this.existepersonaentidad = false
          this.InteresadoSolicitud = response.desPerEntid
          this.dirPosta = response.dirPosta
          this.codPosta = response.codPosta?.toString?.() ?? String(response.codPosta ?? '')
          this.provincia = response.provincia
          this.Municipio = response.municipio
          this.controlpersonaentidadcrear = true
          return
        }

        this.dniok = false
        this.existepersonaentidad = true
        this.controlpersonaentidadcrear = false
      },
      error: (err: HttpErrorResponse) => {
        this.buscandoInteresado = false
        this.dniok = false
        if (err.status == 404) {
          this.existepersonaentidad = true
          return
        }
        this.existepersonaentidad = false
        this.notificationService.error({
          title: 'Búsqueda',
          text: 'No se pudo consultar el interesado. Inténtelo de nuevo.',
        })
      },
    })
  }

  /** @deprecated Preferir `buscarInteresado`. */
  solicitadni(host: ExpedientesExpedienteHost, dni: string): void {
    host.nuevoexpediente.usuario = dni
    this.buscarInteresado(host)
  }

  handleFormaNotificacionChange(host: ExpedientesExpedienteHost): void {
    if (host.nuevoexpediente.formaNotifi !== 1) {
      host.nuevoexpediente.email = ''
    }
  }

  /** Invalida el resultado de búsqueda al editar el documento. */
  onDocumentoInteresadoInput(host: ExpedientesExpedienteHost): void {
    if (!this.dniok && !this.existepersonaentidad && !this.buscandoInteresado) {
      return
    }
    this.dniok = false
    this.existepersonaentidad = false
    this.nombredni = ''
    this.direcciondni = ''
    this.cpdni = ''
    this.provinciadni = ''
    this.nommunicipiodni = ''
    this.InteresadoSolicitud = ''
    host.nuevoexpediente.idPerso = null
    host.nuevoexpediente.idHisPerso = null
  }

  selecTipPerso(valor: string | number): void {
    switch (String(valor)) {
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

  gestimunicip(id: string | number): void {
    this.municiflitro = [];
    const prefijo = String(id)

    for (let index = 0; index < MUNICIO.length; index++) {
      const element = MUNICIO[index];
      if (element.id.substring(0, 2) == prefijo) {
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

  selecrepresentante(host: ExpedientesExpedienteHost, event: JqxGridRowEvent<{ idHisPerso: number; idPerso: number }>): void {
    host.nuevoexpediente.idHisRepre = event.args.row.bounddata.idHisPerso;
    host.nuevoexpediente.idRepre = event.args.row.bounddata.idPerso;
  }

  /**
   * Restablece el wizard de consulta de DNI (antes usado por limpiadatosnuevoexpediente).
   */
  resetSolicitudDni(): void {
    this.existepersonaentidad = false
    this.dniok = false
    this.buscandoInteresado = false
    this.controlpersonaentidadcrear = false
    this.nombredni = ''
    this.apellido1dni = ''
    this.apellido2dni = ''
    this.direcciondni = ''
    this.cpdni = ''
    this.provinciadni = ''
    this.nommunicipiodni = ''
    this.idhispersodni = null
    this.idpersodni = null
    this.InteresadoSolicitud = ''
    this.dirPosta = ''
    this.codPosta = ''
    this.provincia = ''
    this.Municipio = ''
  }

  isInteresadoSinResolver(host: ExpedientesExpedienteHost): boolean {
    const documento = String(host.nuevoexpediente.usuario ?? '').trim()
    return host.mostrarValidacionesExpediente && !!documento && !this.dniok
  }

  isFechaExpedienteInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.fechaInicio;
  }

  isFormaAperturaInvalid(host: ExpedientesExpedienteHost): boolean {
    return host.mostrarValidacionesExpediente && !host.nuevoexpediente.forma_apertura;
  }

  isFormaNotificacionInvalid(host: ExpedientesExpedienteHost): boolean {
    const forma = host.nuevoexpediente.formaNotifi
    return host.mostrarValidacionesExpediente && forma !== 0 && forma !== 1
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

    const documentoVacio = !String(host.nuevoexpediente.usuario ?? '').trim()
    const interesadoSinResolver = !documentoVacio && !this.dniok

    if (
      this.isFechaExpedienteInvalid(host)
      || this.isFormaAperturaInvalid(host)
      || this.isFormaNotificacionInvalid(host)
      || this.isTituloExpedienteInvalid(host)
      || this.isInteresadoDNIInvalid(host)
      || this.isProcedimientoExpedienteInvalid(host)
      || this.isEmailExpedienteInvalid(host)
      || interesadoSinResolver
    ) {
      if (documentoVacio) {
        this.notificationService.incompleteFields('El documento del interesado es obligatorio')
      } else if (interesadoSinResolver) {
        this.notificationService.incompleteFields(
          'Busca el interesado (botón Buscar) antes de crear el expediente',
        )
      } else {
        this.notificationService.incompleteFields()
      }
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
    ).subscribe({
      next: () => {
        this.gridFacade.refreshExpedientesList(host, this.session.user ?? '', true);
        this.notificationService.success('Expediente actualizado correctamente');
      },
      error: () => {
        this.notificationService.error('No se pudo actualizar el expediente');
      },
    });
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
        host.limpiarDatosExpediente();
        this.gridFacade.refreshExpedientesList(host, this.session.user ?? '', true);
        this.notificationService.success('El expediente se ha creado exitosamente');
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.fromHttpError(
          err,
          'Ha ocurrido un error al crear el expediente',
        );
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
        host.fechacancelacionexpedi = fechaHoyISO();
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
  marcarExpedienteSeleccionado(host: ExpedientesSeleccionHost, rowData: ExpedienteListar): void {
    host.idExpediente = rowData.id;
    host.idExpedienteString = String(rowData.id);
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
      this.gridFacade.lanzoIndiceENI(host, String(rowData.id));
    }

    host.valorEstado = rowData.estado;
    host.syncGridRenderContext();

    if (rowData.email == '0' || rowData.email == 'SinDAtos') {
      host.verEmail = '';
    } else {
      host.verEmail = rowData.email ?? '';
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
    host.descripcionProcedimiento = rowData.procedimiento.descripcion ?? '';
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
