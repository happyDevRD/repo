import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import {
  ConsultaDni,
  CrearNotificacion,
  LeerNotificacion,
  ModeloTeuCrear,
  ModeloTeuListar,
  MotivoNotificacionesListar,
  NotificadorListar,
  ReceptorNotifiListar,
} from '../../../expedientes'
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service'
import { TeuFormRefLike } from '../../notificaciones/edita-expediente-notificaciones-ui.facade'
import {
  trackByIdModel,
  trackByMotNotif,
  trackByNotificador,
  trackByReceptor,
} from '../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-expediente-modals-notificaciones',
  templateUrl: './edita-expediente-modals-notificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteModalsNotificacionesComponent implements AfterViewInit {
  private readonly refs = inject(EditaExpedienteRefs)

  @Input() modeloteucrear: ModeloTeuCrear = new ModeloTeuCrear()
  @Input() modeloteulistar: ModeloTeuListar[] = []
  @Input() creanotificacion: CrearNotificacion = new CrearNotificacion()
  @Input() notificacionver: LeerNotificacion = {} as LeerNotificacion
  @Input() motivonotificacioneslistar: MotivoNotificacionesListar[] = []
  @Input() notificadorlistar: NotificadorListar[] = []
  @Input() receptornotifilistar: ReceptorNotifiListar[] = []
  @Input() consultadni: ConsultaDni = new ConsultaDni()
  @Input() dniok = false
  @Input() modoVerNotificacion = false
  @Input() fechNotifi: string | Date | null = null
  @Input() selected: Date | string | number = new Date()
  @Input() isFechaSolicInvalid = false
  @Input() isFechaGenerInvalid = false
  @Input() isFechaFirmaInvalid = false

  @Output() crearModeloTeuFichero = new EventEmitter<void>()
  @Output() devolverNotificacion = new EventEmitter<void>()
  @Output() editaNotifi = new EventEmitter<void>()
  @Output() solicitarDni = new EventEmitter<string>()
  @Output() habilitarEdicionNotificacion = new EventEmitter<void>()

  readonly trackByIdModel = trackByIdModel
  readonly trackByMotNotif = trackByMotNotif
  readonly trackByNotificador = trackByNotificador
  readonly trackByReceptor = trackByReceptor

  @ViewChild('teuForm') teuFormRef: TeuFormRefLike | undefined

  ngAfterViewInit(): void {
    this.refs.teuFormRef = this.teuFormRef
  }

  handleCrearModeloTeuFichero(): void {
    this.crearModeloTeuFichero.emit()
  }

  handleDevolverNotificacion(): void {
    this.devolverNotificacion.emit()
  }

  handleEditaNotifi(): void {
    this.editaNotifi.emit()
  }

  handleSolicitarDni(dni: string): void {
    this.solicitarDni.emit(dni)
  }

  handleHabilitarEdicionNotificacion(): void {
    this.habilitarEdicionNotificacion.emit()
  }
}
