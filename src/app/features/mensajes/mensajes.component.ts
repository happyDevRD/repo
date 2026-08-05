import { Component, OnInit } from '@angular/core'
import {
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  RechazarMensaje,
} from './models'
import {
  MENSAJE_ESTADO_FILTROS,
  MensajeFiltroDireccion,
  MensajeFiltroEstado,
  MensajeInboxItem,
} from './models/mensajes.models'
import { NotificationService } from '../../core/service/notification.service'
import { ModalManagerService } from '../../core/service/modal-manager.service'
import { UserSessionService } from '../../core/service/user-session.service'
import { MensajesAccionesFacade } from './services/mensajes-acciones.facade'
import { MensajesInitFacade } from './services/mensajes-init.facade'
import { MensajesSelectionFacade } from './services/mensajes-selection.facade'
import { countMensajesByEstado } from './helpers/mensajes-count.helper'
import {
  emptyMensajeSelection,
  filterMensajeInbox,
} from './helpers/mensajes-inbox.helper'

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css'],
  providers: [
    MensajesInitFacade,
    MensajesAccionesFacade,
    MensajesSelectionFacade,
  ],
})
export class MensajesComponent implements OnInit {
  readonly estadoFiltros = MENSAJE_ESTADO_FILTROS

  leermensajerecibido: LeerMensajeRecibidos[] = []
  leermensajeenviados: LeerMensajeEnviados[] = []
  inboxItems: MensajeInboxItem[] = []
  filteredInbox: MensajeInboxItem[] = []
  rechazamensaje: RechazarMensaje = new RechazarMensaje()

  readonly title = 'Mensajes'
  readonly fecha = new Date()

  idMensajeRecibido = 0
  idMensajeEnviado = 0
  idMensaje = 0
  idTarea = 0
  selectedKey = ''

  filtroDireccion: MensajeFiltroDireccion = 'recibido'
  filtroEstado: MensajeFiltroEstado = 'PENDIENTE'
  filtroTexto = ''

  canRechazar = false
  canTramitar = false
  hasSeleccion = false

  nmensajespendientes = 0

  mensajeDescrip = ''
  mensajeEstado = ''
  mensajeFechaInicio = ''
  mensajeFechaLectura = ''
  mensajeFechaRechazo = ' '
  mensajeFechaTramitacion = ''
  mensajeRemitente = ''
  mensajeDestinatario = ''
  mensajeDescripcionRechazo = ''
  mensajeExpediente = ''
  mensajeDireccion: '' | 'recibido' | 'enviado' = ''

  constructor(
    public session: UserSessionService,
    private readonly initFacade: MensajesInitFacade,
    private readonly accionesFacade: MensajesAccionesFacade,
    private readonly selectionFacade: MensajesSelectionFacade,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) {
    Object.assign(this, emptyMensajeSelection())
  }

  ngOnInit(): void {
    this.initFacade.initialize(this)
  }

  actualizarGrids(): void {
    this.initFacade.refreshAll(this)
  }

  rebuildInbox(): void {
    this.filteredInbox = filterMensajeInbox(
      this.inboxItems,
      this.filtroDireccion,
      this.filtroEstado,
      this.filtroTexto,
    )
    if (this.selectedKey && !this.filteredInbox.some((item) => item.key === this.selectedKey)) {
      this.clearSeleccion()
    }
  }

  clearSeleccion(): void {
    Object.assign(this, emptyMensajeSelection())
    this.selectedKey = ''
    this.rechazamensaje = new RechazarMensaje()
  }

  setFiltroDireccion(direccion: MensajeFiltroDireccion): void {
    this.filtroDireccion = direccion
    this.rebuildInbox()
  }

  setFiltroEstado(estado: MensajeFiltroEstado): void {
    this.filtroEstado = estado
    this.rebuildInbox()
  }

  onBusquedaChange(value: string): void {
    this.filtroTexto = value
    this.rebuildInbox()
  }

  seleccionarMensaje(item: MensajeInboxItem): void {
    this.selectionFacade.select(this, item)
  }

  contarPendientes(): void {
    const counts = countMensajesByEstado(this.leermensajerecibido)
    this.nmensajespendientes = counts.pendientes
    this.session.setMensajesRecibidosCount(counts.pendientes.toString())
  }

  TramitarMensaje(): void {
    this.accionesFacade.tramitar(this)
  }

  rechazaMensaje(): void {
    this.accionesFacade.rechazar(this)
  }

  limpiaRechazarMensaje(): void {
    this.accionesFacade.limpiarRechazo(this)
  }

  abrirModal(modalId: string): void {
    if (modalId === 'DevolverMensajeModal' && !this.canRechazar) {
      this.notificationService.warning('Seleccione un mensaje pendiente o leído para rechazar')
      return
    }
    this.modalManagerService.openModal(modalId)
  }

  cerrarModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId)
  }

  validateAndRechazarMensaje(event: Event): void {
    event.preventDefault()
    if (!this.rechazamensaje.descripcionRechazo) {
      this.notificationService.warning('Es necesario llenar todos los campos obligatorios')
      return
    }
    this.rechazaMensaje()
  }

  trackByMensajeKey(_index: number, item: MensajeInboxItem): string {
    return item.key
  }

  get veorecibidos(): boolean {
    return this.filtroDireccion === 'recibido' || this.mensajeDireccion === 'recibido'
  }

  get veoenviados(): boolean {
    return this.filtroDireccion === 'enviado' || this.mensajeDireccion === 'enviado'
  }

  get isFiltroTodos(): boolean {
    return this.filtroDireccion === 'todos'
  }

  get accionesEnDetalle(): boolean {
    return this.hasSeleccion && this.mensajeDireccion === 'recibido'
  }

  get estadoMensajeLabel(): string {
    switch (this.mensajeEstado) {
      case 'PENDIENTE':
        return 'Pendiente'
      case 'LEIDO':
        return 'Leído'
      case 'TRAMITANDO':
        return 'Tramitando'
      case 'TRAMITADO':
        return 'Tramitado'
      case 'RECHAZADO':
        return 'Rechazado'
      default:
        return this.mensajeEstado || 'Sin estado'
    }
  }

  get estadoBadgeClass(): string {
    switch (this.mensajeEstado) {
      case 'PENDIENTE':
        return 'msg-badge--pendiente'
      case 'LEIDO':
        return 'msg-badge--leido'
      case 'TRAMITANDO':
      case 'TRAMITADO':
        return 'msg-badge--tramitando'
      case 'RECHAZADO':
        return 'msg-badge--rechazado'
      default:
        return 'msg-badge--default'
    }
  }

  get direccionLabel(): string {
    if (this.mensajeDireccion === 'recibido') {
      return 'Recibido'
    }
    if (this.mensajeDireccion === 'enviado') {
      return 'Enviado'
    }
    return ''
  }

  get inboxCountLabel(): string {
    const n = this.filteredInbox.length
    return n === 1 ? '1 mensaje' : `${n} mensajes`
  }
}
