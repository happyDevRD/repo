import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'
import { ModalAction, ModalActionEvent } from '../../../../shared/modals/modal-action.model'

@Component({
  selector: 'app-expedientes-acciones',
  templateUrl: './expedientes-acciones.component.html',
})
export class ExpedientesAccionesComponent {
  readonly e = inject(ExpedientesComponent)

  get actionsTramitacion(): ModalAction[] {
    const e = this.e
    return [
      {
        id: 'tramitar', label: 'Tramitar', icon: 'bi bi-journal-check', tone: 'primary',
        disabled: !e.accionExpediente(e.cerrarexp), title: 'Tramitar expediente',
      },
      {
        id: 'interesados', label: 'Interesados', icon: 'bi bi-people', tone: 'secondary',
        disabled: !e.accionExpediente(e.cerrarexp && e.veoInteresado), title: 'Interesados',
      },
      {
        id: 'registro', label: 'Registro', icon: 'bi bi-file-earmark-text', tone: 'secondary',
        disabled: !e.accionExpediente(e.VeoRegDoc), title: 'Registro de entrada',
      },
      {
        id: 'tramitador', label: 'Tramitador', icon: 'bi bi-person-plus', tone: 'secondary',
        disabled: !e.accionExpediente(e.cerrarexp && e.veoAsignoTramitador), title: 'Asignar tramitador',
      },
      {
        id: 'tareas', label: 'Tareas', icon: 'bi bi-list-task', tone: 'secondary',
        disabled: !e.accionExpediente(e.cerrarexp && e.veoAsignoTramitador), title: 'Tareas del expediente',
      },
      {
        id: 'atributo', label: 'Atributo', icon: 'bi bi-node-plus', tone: 'secondary',
        disabled: !e.accionExpediente(e.veoAtributos), title: 'Atributos',
      },
      {
        id: 'devolver', label: 'Devolver', icon: 'bi bi-arrow-return-left', tone: 'secondary',
        disabled: !e.accionExpediente(e.cerrarexp && e.verDevolver), title: 'Devolver expediente',
      },
      {
        id: 'cerrar', label: 'Cerrar', icon: 'bi bi-lock', tone: 'secondary',
        disabled: !e.accionExpediente(e.cerrarexp && e.veoCerrar), title: 'Cerrar expediente',
      },
      {
        id: 'cancelar', label: 'Cancelar', icon: 'bi bi-x-circle', tone: 'danger',
        disabled: !e.accionExpediente(e.cancelarexp && e.veoCancelar), title: 'Cancelar expediente',
      },
      {
        id: 'abrir', label: 'Abrir', icon: 'bi bi-unlock', tone: 'secondary',
        disabled: !e.accionExpediente(e.verAbrirExpediente && e.veoAbrir), title: 'Abrir expediente',
      },
      {
        id: 'archivar', label: 'Archivar', icon: 'bi bi-archive', tone: 'secondary',
        disabled: !e.accionExpediente(e.verArchivar && e.veoArchiva), title: 'Archivar expediente',
      },
      {
        id: 'indiceEni', label: 'Índice ENI', icon: 'bi bi-folder-check', tone: 'secondary',
        disabled: !e.accionExpediente(e.verArchivar && e.veoArchiva), title: 'Índice ENI',
      },
    ]
  }

  get actionsInside(): ModalAction[] {
    return [
      {
        id: 'inside', label: 'INSIDE', icon: 'bi bi-cloud-upload', tone: 'primary',
        disabled: !this.e.editExpedientes, title: 'Acciones INSIDE',
      },
    ]
  }

  handleAccionTramitacion(event: ModalActionEvent): void {
    const e = this.e
    switch (event.id) {
      case 'tramitar': e.reenvioEditar(); break
      case 'interesados': e.abrirModalInteresadosDesdeListado(e.idexpediente); break
      case 'registro': e.CargoRegistroDocu(); break
      case 'tramitador': e.abrirModal('AsigfnarTramitadorModal'); break
      case 'tareas': e.abrirModalTareasExpediente(); break
      case 'atributo': e.abrirModalAtributos(); break
      case 'devolver': e.DevolverExpe(); break
      case 'cerrar': e.abrirModal('cerrarExpModal'); break
      case 'cancelar': e.abrirModal('cancelarExpModal'); break
      case 'abrir': e.AbrirExpediente(); break
      case 'archivar': e.ArchivaExp(); break
      case 'indiceEni': e.abrirModal('IndiceExpedienteModal'); break
    }
  }

  handleAccionInside(event: ModalActionEvent): void {
    if (event.id === 'inside') {
      this.e.abrirModalInsideDesdeListado(this.e.idexpediente)
    }
  }
}
