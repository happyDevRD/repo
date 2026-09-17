import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../edita-expediente.component'
import { ModalManagerService } from '../../../../../core/service/modal-manager.service'
import { fechaHoyISO } from '../../../../../core/helper/fecha-legacy.helper'
import { trackById } from '../../../../../core/helper/track-by.helper'
import { CrearInteresado } from '../../../expedientes'
import { InteresadoListarDto } from '../../../../../core/models/interesado.dto'

@Component({
  selector: 'app-edita-expediente-modals-expediente',
  templateUrl: './edita-expediente-modals-expediente.component.html',
})
export class EditaExpedienteModalsExpedienteComponent {
  readonly edita = inject(EditaExpedienteComponent)
  private readonly modalManager = inject(ModalManagerService)
  readonly trackById = trackById

  handleNuevoInteresado(): void {
    this.edita.crearinteresado = new CrearInteresado()
    this.edita.crearinteresado.fechaInicio = fechaHoyISO()
    this.edita.crearinteresado.tipForNotif = null as unknown as number
    this.edita.crearinteresado.email = ''
    this.edita.lifecycleFacade.dniok = false
    this.modalManager.openModal('ninteresadoModal')
  }

  handleClickInteresado(interesado: InteresadoListarDto): void {
    this.edita.seleccionaInteresado(interesado.id)
  }
}
