import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteOperacionesFacade } from '../../../../operaciones/edita-expediente-operaciones.facade'

import {
  trackByCodTema,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-generar-salida-modal',
  templateUrl: './modal-generar-salida-modal.component.html',
})
export class EditaModalGenerarSalidaModalComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly ops = inject(EditaExpedienteOperacionesFacade)
  readonly trackByCodTema = trackByCodTema
}
