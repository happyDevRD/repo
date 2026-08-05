import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { EditaExpedienteComponent } from '../../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../../tareas/edita-expediente-tareas.facade'
import { esSeleccionTareaProcedimientoVacia } from '../../../../../tareas/tareas-procedimiento.helper'
import { trackByTipoObjeto } from '../../../../../../../../core/helper/track-by.helper'

@Component({
  selector: 'app-nueva-tarea-accion-asociada',
  templateUrl: './nueva-tarea-accion-asociada.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class NuevaTareaAccionAsociadaComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)
  readonly trackByTipoObjeto = trackByTipoObjeto

  /** Sección visible al elegir una tarea del procedimiento (aunque no tenga acción). */
  get visible(): boolean {
    return !esSeleccionTareaProcedimientoVacia(this.edita.idlistatareaProcedi)
      || !esSeleccionTareaProcedimientoVacia(this.edita.tareatramiteexpedientecrear?.tareaProcedimiento)
  }

  get tieneAccion(): boolean {
    const accion = this.edita.tareatramiteprocedimiento?.accion
    return this.tareas.veoAcciones && accion != null && accion !== -1
  }

  get necesitaValorConsulta(): boolean {
    const accion = this.edita.tareatramiteprocedimiento?.accion
    return accion !== 10 && accion !== 11
  }

  get botonTexto(): string {
    return this.tareas.getAccionButtonText(this.edita.tareatramiteprocedimiento)
  }

  onConsultar(): void {
    this.tareas.onConsultaAccionClick(this.edita)
  }
}
