import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../tareas/edita-expediente-tareas.facade'
import { IflowGridComponent } from '../../../../../../../shared/components/iflow-grid/iflow-grid.component'
import { EditaExpedienteRefs } from '../../../../services/edita-expediente-refs.service'

@Component({
  selector: 'app-edita-modal-recibos-pendientes-modal',
  templateUrl: './modal-recibos-pendientes-modal.component.html',
})
export class EditaModalRecibosPendientesModalComponent implements AfterViewInit {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  private readonly refs = inject(EditaExpedienteRefs)
  @ViewChild('gridRecibos') gridRecibos: IflowGridComponent | undefined

  ngAfterViewInit(): void {
    this.refs.gridRecibos = this.gridRecibos
  }
}
