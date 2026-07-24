import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'
import { EditaExpedienteRefs } from '../../../../services/edita-expediente-refs.service'
import {
  trackById,
  trackByTipoObjeto,
} from '../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-edita-modal-nueva-tarea-tra',
  templateUrl: './modal-nueva-tarea-tra.component.html',
})
export class EditaModalNuevaTareaTraComponent implements AfterViewInit {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  private readonly refs = inject(EditaExpedienteRefs)
  readonly trackById = trackById
  readonly trackByTipoObjeto = trackByTipoObjeto
  @ViewChild('fileInput') fileInput: ElementRef | undefined

  ngAfterViewInit(): void {
    this.refs.fileInputOperaciones = this.fileInput
  }
}
