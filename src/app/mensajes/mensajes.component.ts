import { Component, OnInit } from '@angular/core';
import {
  EditarMensaje,
  LeeMensaje,
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  RechazarMensaje,
} from '../expedientes/expedientes';
import { ProcediPermisos } from '../procedimientos/procedimiento';
import { NotificationService } from '../core/service/notification.service';
import { ModalManagerService } from '../core/service/modal-manager.service';
import { UserSessionService } from '../core/service/user-session.service';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import {
  buildMensajesEnviadosColumns,
  buildMensajesRecibidosColumns,
  createMensajesEnviadosAdapter,
  createMensajesRecibidosAdapter,
} from './config/mensajes-grid.config';
import { MensajesAccionesFacade } from './services/mensajes-acciones.facade';
import { MensajesGridFacade } from './services/mensajes-grid.facade';
import { MensajesInitFacade } from './services/mensajes-init.facade';
import { countMensajesByEstado } from './helpers/mensajes-count.helper';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css'],
  providers: [MensajesInitFacade, MensajesGridFacade, MensajesAccionesFacade],
})
export class MensajesComponent implements OnInit {
  readonly localizationObject = jqxGrid_ES;
  readonly columnsMensajeRecibidos: any[] = buildMensajesRecibidosColumns();
  readonly columnsMensajeEnviados: any[] = buildMensajesEnviadosColumns();

  leermensajerecibido: LeerMensajeRecibidos[] = [];
  leermensajeenviados: LeerMensajeEnviados[] = [];
  rechazamensaje: RechazarMensaje = new RechazarMensaje();
  editarmensaje: EditarMensaje = new EditarMensaje();
  leemensaje: LeeMensaje = new LeeMensaje();
  procedipermiso: ProcediPermisos[] = [];

  readonly title = 'Mensajes';
  readonly fecha = new Date();

  idMensajeRecibido = 0;
  idMensajeEnviado = 0;
  idMensaje = 0;
  idTarea = 0;
  mensajeDescripcion = '';

  veoenviados = false;
  veorecibidos = true;
  veorechaTRami = false;
  veoRecha = false;

  nmensajespendientes = 0;

  mensajeDescrip = '';
  mensajeEstado = '';
  mensajeFechaInicio = '';
  mensajeFechaLectura = '';
  mensajeFechaRechazo = ' ';
  mensajeFechaTramitacion = '';
  mensajeRemitente = '';
  mensajeDestinatario = '';
  mensajeDescripcionRechazo = '';

  sourceMensajeRecibidos: any;
  sourceMensajeEnviados: any;

  constructor(
    public session: UserSessionService,
    private readonly initFacade: MensajesInitFacade,
    private readonly gridFacade: MensajesGridFacade,
    private readonly accionesFacade: MensajesAccionesFacade,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) {
    this.sourceMensajeRecibidos = createMensajesRecibidosAdapter(this.session.idOrgUsuar ?? '');
    this.sourceMensajeEnviados = createMensajesEnviadosAdapter(this.session.idOrgUsuar ?? '');
  }

  ngOnInit(): void {
    this.initFacade.initialize(this);
  }

  actualizarGrids(): void {
    this.initFacade.refreshGridSources(this);
  }

  recargarpagina(): void {
    window.location.reload();
  }

  verRecibidos(): void {
    this.veorecibidos = true;
    this.veoenviados = false;
  }

  verEnviados(): void {
    this.veorecibidos = false;
    this.veoenviados = true;
    this.veoRecha = false;
    this.veorechaTRami = false;
  }

  contarPendientes(): void {
    const counts = countMensajesByEstado(this.leermensajerecibido);
    this.nmensajespendientes = counts.pendientes;
    this.session.setMensajesRecibidosCount(counts.pendientes.toString());
  }

  TramitarMensaje(): void {
    this.accionesFacade.tramitar(this);
  }

  editarMensaje(): void {
    this.accionesFacade.editar(this);
  }

  rechazaMensaje(): void {
    this.accionesFacade.rechazar(this);
  }

  marcarLeido(): void {
    this.accionesFacade.marcarLeido(this);
  }

  borrarMensaje(): void {
    this.accionesFacade.borrar(this);
  }

  limpiaRechazarMensaje(): void {
    this.accionesFacade.limpiarRechazo(this);
  }

  ClickMensajesRecibidos(event: any): void {
    this.gridFacade.onRecibidosRowClick(this, event);
  }

  ClickMensajesEnviados(event: any): void {
    this.gridFacade.onEnviadosRowClick(this, event);
  }

  abrirModalVerMensaje(event: any): void {
    this.gridFacade.abrirModalVerMensaje(this, event);
  }

  abrirModal(modalId: string): void {
    this.modalManagerService.openModal(modalId);
  }

  cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId);
  }

  validateAndEditMensaje(event: Event): void {
    event.preventDefault();
    if (
      !this.editarmensaje.descripcion ||
      !this.editarmensaje.destinatario ||
      this.editarmensaje.informativo === undefined
    ) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }
    this.editarMensaje();
    this.cerrarModal('EditarMensajeModal');
  }

  validateAndRechazarMensaje(event: Event): void {
    event.preventDefault();
    if (!this.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }
    this.rechazaMensaje();
    this.cerrarModal('DevolverMensajeModal');
  }

  validateAndTramitarMensaje(event: Event): void {
    event.preventDefault();
    if (
      !this.editarmensaje.descripcion ||
      !this.editarmensaje.destinatario ||
      this.editarmensaje.informativo === undefined
    ) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios');
      return;
    }
    this.TramitarMensaje();
    this.cerrarModal('TramitarMensajeModal');
  }
}
