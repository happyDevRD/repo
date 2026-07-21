import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ConsultaDni, CrearNotificacion } from '../../expedientes';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import {
  crearNotificacionVacia,
  cargarDatosInteresadoNotificacion,
  nuevaConsultaDni,
  resetEdicionNotificacion,
} from './notificaciones-data.helper';
import {
  asignarFechaCampoNotificacion,
  actualizarEjercicioDesdeFechaNotificacion,
  calcularFechaLimiteDesdePublicacion,
  CampoFechaNotificacion,
} from './notificaciones-form-campos.helper';
import {
  abrirModalEnviarNotificacion,
  abrirModalVerNotificacion,
  cerrarModalVerNotificacion,
  limpiarErroresVisualesNotificacion,
  limpiarEstadoModalNotificacion,
  cerrarModalCrearNotificacion as cerrarModalCrearNotificacionDom,
  limpiarEstadoModalCrearNotificacion,
  onModalHiddenBootstrap,
} from './notificaciones-modal.helper';

export interface EditaExpedienteNotificacionesUiHost {
  creanotificacion: CrearNotificacion;
  consultadni: ConsultaDni;
  textoFormaNotif: string;
  formanotificacion: boolean;
  dniok: boolean;
  idNotificacion: number;
  modoVerNotificacion: boolean;
  fecLimite: Date;
  fecha: Date;
  identificadorFicheroSubido?: number;
  verExpediente: { ejercicio: number; numero: number };
  usuContrl: string | null;
  listarinteresadosdto: InteresadoListarDto[];
  ejerNotifi: string;
  numeroNotifi: string;
  fechNotifi: string;
  dniNotifi: string;
  desPerEntidNotifi: string;
  fechaordenadafenvio: string;
  fechaordenadafrecep: string;
  fechaordenadafpubli: string;
  fechaenvioTEU: string;
  veoenviar: boolean;
  veoEnviarNotifica: boolean;
  veoSincronizarNotifica: boolean;
  veorecepcionar: boolean;
  veopublicar: boolean;
  veodevolver: boolean;
  veoanular: boolean;
  veoborrar: boolean;
  veoteu: boolean;
  veoReenviarTeu: boolean;
  mostrarBotonDescargaTEUPrincipal: boolean;
  verNuevaNotifi: boolean;
  verGenerarSalida: boolean;
  verTareasdelTramite: boolean;
  verformnuevatarea: boolean;
  verlistadotramitadores: boolean;
  nuevotramitador: boolean;
  verlistadotareas: boolean;
  verEditartareatramite: boolean;
  limpiarEstadoModalError(): void;
  limpiarFormularioNotificacion(): void;
  limpiarCacheValidacion(): void;
  vernotifi(id: number, modoVer: boolean): void | Promise<void>;
  solicitadni(dni: string): void;
  inicializarFormularioTEU(): void;
  abrirModal(modalId: string): void;
  cerrarModal(modalId: string): void;
}

@Injectable()
export class EditaExpedienteNotificacionesUiFacade {
  constructor(
    private readonly modalManagerService: ModalManagerService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  quitabotonesNotifi(host: EditaExpedienteNotificacionesUiHost): void {
    host.veoenviar = false;
    host.veoEnviarNotifica = false;
    host.veoSincronizarNotifica = false;
    host.veorecepcionar = false;
    host.veopublicar = false;
    host.veodevolver = false;
    host.veoanular = false;
    host.veoborrar = false;
    host.veoteu = false;
    host.veoReenviarTeu = false;
    host.mostrarBotonDescargaTEUPrincipal = false;
  }

  resetvariables(host: EditaExpedienteNotificacionesUiHost): void {
    host.dniok = false;
    host.verTareasdelTramite = true;
    host.verformnuevatarea = false;
    host.verlistadotramitadores = false;
    host.nuevotramitador = false;
    host.verlistadotareas = true;
    host.verEditartareatramite = false;
    host.verNuevaNotifi = false;
    host.verGenerarSalida = false;
    host.creanotificacion = new CrearNotificacion();
    host.limpiarEstadoModalError();
  }

  clickNuevaNotificacion(host: EditaExpedienteNotificacionesUiHost): void {
    host.creanotificacion = crearNotificacionVacia({
      usuContrl: host.usuContrl!,
      ejercicioExpediente: host.verExpediente.ejercicio,
      numeroExpediente: host.verExpediente.numero,
      identificadorFicheroSubido: host.identificadorFicheroSubido,
      fechaActual: host.fecha,
    });
    host.textoFormaNotif = '';
    host.dniok = false;
    host.consultadni = nuevaConsultaDni();
    host.limpiarCacheValidacion();
  }

  cambioYearEjercicio(host: EditaExpedienteNotificacionesUiHost): void {
    actualizarEjercicioDesdeFechaNotificacion(host.creanotificacion, host.fecha);
    host.limpiarCacheValidacion();
  }

  fechamas15(host: EditaExpedienteNotificacionesUiHost): void {
    const limite = calcularFechaLimiteDesdePublicacion(host.creanotificacion.fecPubBop);
    if (limite) {
      host.fecLimite = limite;
    }
  }

  cargarDatosInteresado(host: EditaExpedienteNotificacionesUiHost, dni: string): void {
    cargarDatosInteresadoNotificacion(host, dni);
    if (dni) {
      host.solicitadni(dni);
    }
    host.limpiarCacheValidacion();
  }

  onFechaCampoChange(host: EditaExpedienteNotificacionesUiHost, campo: CampoFechaNotificacion, valor: string): void {
    asignarFechaCampoNotificacion(host.creanotificacion, campo, valor);
  }

  limpiarErroresVisuales(): void {
    limpiarErroresVisualesNotificacion();
  }

  cerrarModalNotificacion(host: EditaExpedienteNotificacionesUiHost): void {
    try {
      cerrarModalVerNotificacion(() => resetEdicionNotificacion(host));
    } catch {
      this.modalManagerService.closeModal('verNotifiModal');
      resetEdicionNotificacion(host);
    }
  }

  verNotificacion(host: EditaExpedienteNotificacionesUiHost, id: number): void {
    limpiarEstadoModalNotificacion();
    host.idNotificacion = id;
    host.modoVerNotificacion = true;
    host.vernotifi(id, true);
    abrirModalVerNotificacion();
  }

  editarNotificacion(host: EditaExpedienteNotificacionesUiHost, id: number): void {
    limpiarEstadoModalNotificacion();
    host.vernotifi(id, false);
    abrirModalVerNotificacion();
  }

  abrirModalEnvioTeu(host: EditaExpedienteNotificacionesUiHost): void {
    host.inicializarFormularioTEU();
    host.abrirModal('EnvioTeu');
  }

  abrirModalEnviarNotificacion(host: EditaExpedienteNotificacionesUiHost): void {
    Promise.resolve(host.vernotifi(host.idNotificacion, false)).then(() => abrirModalEnviarNotificacion());
  }

  borraDatosCrearNotifi(host: EditaExpedienteNotificacionesUiHost): void {
    host.creanotificacion = new CrearNotificacion();
    host.limpiarEstadoModalError();
  }

  borrarDatosPublicacion(host: EditaExpedienteNotificacionesUiHost): void {
    host.creanotificacion = new CrearNotificacion();
  }

  borraDatosEnviarNotifi(host: EditaExpedienteNotificacionesUiHost): void {
    host.creanotificacion = new CrearNotificacion();
  }

  borraDatosRecepcion(host: EditaExpedienteNotificacionesUiHost): void {
    host.creanotificacion = new CrearNotificacion();
  }

  cerrarModalCrearNotificacion(host: EditaExpedienteNotificacionesUiHost): void {
    cerrarModalCrearNotificacionDom(
      () => host.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => host.cerrarModal(modalId),
    );
  }

  onModalHidden(): void {
    onModalHiddenBootstrap(() => this.cdr.detectChanges());
  }

  limpiarEstadoModalError(host: EditaExpedienteNotificacionesUiHost): void {
    limpiarEstadoModalCrearNotificacion(
      () => host.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => host.cerrarModal(modalId),
    );
  }
}
