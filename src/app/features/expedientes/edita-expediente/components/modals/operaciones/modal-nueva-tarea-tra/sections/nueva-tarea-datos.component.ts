import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { EditaExpedienteComponent } from '../../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../../tareas/edita-expediente-tareas.facade'
import { EditaExpedienteRefs } from '../../../../../services/edita-expediente-refs.service'
import { trackById } from '../../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-nueva-tarea-datos',
  templateUrl: './nueva-tarea-datos.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class NuevaTareaDatosComponent implements AfterViewInit {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  private readonly refs = inject(EditaExpedienteRefs)
  readonly trackById = trackById

  @ViewChild('fileInput') fileInput: ElementRef | undefined

  ngAfterViewInit(): void {
    this.refs.fileInputOperaciones = this.fileInput
  }

  onTareaProcedimientoChange(): void {
    this.edita.idListaTareaProcedimiento(this.edita.tareatramiteexpedientecrear.tareaProcedimiento)
  }
}
