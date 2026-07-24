import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteRefs } from '../../../../services/edita-expediente-refs.service'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'
import {
  trackById,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-editar-tarea-tramite-modal',
  templateUrl: './modal-editar-tarea-tramite-modal.component.html',
})
export class EditaModalEditarTareaTramiteModalComponent implements AfterViewInit {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  private readonly refs = inject(EditaExpedienteRefs)
  readonly trackById = trackById
  @ViewChild('fileInput') fileInput: ElementRef | undefined

  ngAfterViewInit(): void {
    this.refs.fileInputTramites = this.fileInput
  }
}

