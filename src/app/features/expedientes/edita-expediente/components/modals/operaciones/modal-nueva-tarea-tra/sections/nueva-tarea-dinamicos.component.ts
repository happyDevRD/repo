import { Component, inject } from '@angular/core'
import { ControlContainer, NgForm } from '@angular/forms'
import { EditaExpedienteComponent } from '../../../../../edita-expediente.component'
import { EditaExpedienteTareasFacade } from '../../../../../tareas/edita-expediente-tareas.facade'

@Component({
  selector: 'app-nueva-tarea-dinamicos',
  templateUrl: './nueva-tarea-dinamicos.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class NuevaTareaDinamicosComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly tareas = inject(EditaExpedienteTareasFacade)

  get mostrarBajaObjeto(): boolean {
    return !!this.tareas.objetotributario && this.edita.tareatramiteprocedimiento?.accion === 5
  }

  get mostrarConsultaObjeto(): boolean {
    return this.tareas.veoConsultaObjetoTributario && !!this.tareas.objetotributario
  }

  onDarDeBaja(): void {
    this.tareas.darDeBajaObjeto(this.edita)
  }
}
