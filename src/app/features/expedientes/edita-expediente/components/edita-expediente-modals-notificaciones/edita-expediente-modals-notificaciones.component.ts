import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import {
  ModeloTeuCrear,
  ModeloTeuListar,
} from '../../../expedientes'
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service'
import { TeuFormRefLike } from '../../notificaciones/edita-expediente-notificaciones-ui.facade'
import { trackByIdModel } from '../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-expediente-modals-notificaciones',
  templateUrl: './edita-expediente-modals-notificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteModalsNotificacionesComponent implements AfterViewInit {
  private readonly refs = inject(EditaExpedienteRefs)

  @Input() modeloteucrear: ModeloTeuCrear = new ModeloTeuCrear()
  @Input() modeloteulistar: ModeloTeuListar[] = []
  @Input() selected: Date | string | number = new Date()
  @Input() isFechaSolicInvalid = false
  @Input() isFechaGenerInvalid = false
  @Input() isFechaFirmaInvalid = false

  @Output() crearModeloTeuFichero = new EventEmitter<void>()

  readonly trackByIdModel = trackByIdModel

  @ViewChild('teuForm') teuFormRef: TeuFormRefLike | undefined

  ngAfterViewInit(): void {
    this.refs.teuFormRef = this.teuFormRef
  }

  handleCrearModeloTeuFichero(): void {
    this.crearModeloTeuFichero.emit()
  }
}
