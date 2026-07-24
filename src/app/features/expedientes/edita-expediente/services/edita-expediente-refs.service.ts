import { ElementRef, Injectable } from '@angular/core'
import { IflowGridComponent } from '../../../../shared/components/iflow-grid/iflow-grid.component'
import { TeuFormRefLike } from '../notificaciones/edita-expediente-notificaciones-ui.facade'

/**
 * Referencias DOM compartidas entre el componente raíz y los paneles hijos.
 * Evita cadenas de ViewChild a través de shells intermedios.
 */
@Injectable()
export class EditaExpedienteRefs {
  teuFormRef?: TeuFormRefLike
  fileInputOperaciones?: ElementRef
  fileInputTramites?: ElementRef
  gridNotificaciones?: IflowGridComponent
  gridRecibos?: IflowGridComponent

  get fileInput(): ElementRef | undefined {
    return this.fileInputOperaciones ?? this.fileInputTramites
  }
}
