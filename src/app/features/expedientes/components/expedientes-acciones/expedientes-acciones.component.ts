import { Component, inject } from '@angular/core'
import { ExpedientesComponent } from '../../expedientes.component'
import { ModalAction, ModalActionEvent } from '../../../../shared/modals/modal-action.model'
import { fromVisibilityMap } from '../../../../shared/modals/modal-actions.util'

@Component({
  selector: 'app-expedientes-acciones',
  templateUrl: './expedientes-acciones.component.html',
})
export class ExpedientesAccionesComponent {
  readonly e = inject(ExpedientesComponent)

  private readonly defsTramitacion: ReadonlyArray<Omit<ModalAction, 'visible'>> = [
    {
      id: 'tramitar', label: 'Tramitar', icon: 'bi bi-journal-check', tone: 'primary',
      order: 1, title: 'Tramitar expediente',
    },
    {
      id: 'devolver', label: 'Devolver', icon: 'bi bi-arrow-return-left', tone: 'secondary',
      order: 2, title: 'Devolver expediente',
    },
    {
      id: 'cerrar', label: 'Cerrar', icon: 'bi bi-lock', tone: 'secondary',
      order: 3, title: 'Cerrar expediente',
    },
    {
      id: 'cancelar', label: 'Cancelar', icon: 'bi bi-x-circle', tone: 'danger',
      order: 4, title: 'Cancelar expediente',
    },
    {
      id: 'abrir', label: 'Abrir', icon: 'bi bi-unlock', tone: 'secondary',
      order: 5, title: 'Abrir expediente',
    },
    {
      id: 'archivar', label: 'Archivar', icon: 'bi bi-archive', tone: 'secondary',
      order: 6, title: 'Archivar expediente',
    },
    {
      id: 'indiceEni', label: 'Índice ENI', icon: 'bi bi-folder-check', tone: 'secondary',
      order: 7, title: 'Índice ENI',
    },
  ]

  private readonly defsInside: ReadonlyArray<Omit<ModalAction, 'visible' | 'disabled'>> = [
    {
      id: 'historial', label: 'Historial', icon: 'bi bi-clock-history', tone: 'secondary',
      order: 1, title: 'Historial de envíos INSIDE',
    },
    {
      id: 'validar', label: 'Validar', icon: 'bi bi-shield-check', tone: 'secondary',
      order: 2, title: 'Validar expediente',
    },
    {
      id: 'insideExpediente', label: 'INSIDE Expediente', icon: 'bi bi-cloud-upload', tone: 'primary',
      order: 3, title: 'INSIDE Expediente',
    },
    {
      id: 'altaXml', label: 'Alta XML', icon: 'bi bi-file-earmark-code', tone: 'secondary',
      order: 4, title: 'Alta XML Expediente',
    },
    {
      id: 'documentos', label: 'Documentos', icon: 'bi bi-files', tone: 'secondary',
      order: 5, title: 'INSIDE Documentos',
    },
    {
      id: 'remisionJusticia', label: 'Remisión Justicia', icon: 'bi bi-bank', tone: 'secondary',
      order: 6, title: 'Remisión a Justicia',
    },
  ]

  get actionsTramitacion(): ModalAction[] {
    const e = this.e
    return fromVisibilityMap(this.defsTramitacion, {
      tramitar: e.accionExpediente(e.cerrarexp),
      devolver: e.accionExpediente(e.cerrarexp && e.verDevolver),
      cerrar: e.accionExpediente(e.cerrarexp && e.veoCerrar),
      cancelar: e.accionExpediente(e.cancelarexp && e.veoCancelar),
      abrir: e.accionExpediente(e.verAbrirExpediente && e.veoAbrir),
      archivar: e.accionExpediente(e.verArchivar && e.veoArchiva),
      indiceEni: e.accionExpediente(e.verArchivar && e.veoArchiva),
    })
  }

  get actionsInside(): ModalAction[] {
    const selected = !!this.e.editExpedientes
    const busy = this.e.insideAccionesEnviando
    return this.defsInside.map((def) => ({
      ...def,
      visible: selected,
      disabled: busy,
    }))
  }

  handleAccionTramitacion(event: ModalActionEvent): void {
    const e = this.e
    switch (event.id) {
      case 'tramitar': e.reenvioEditar(); break
      case 'devolver': e.DevolverExpe(); break
      case 'cerrar': e.abrirModal('cerrarExpModal'); break
      case 'cancelar': e.abrirModal('cancelarExpModal'); break
      case 'abrir': e.AbrirExpediente(); break
      case 'archivar': e.ArchivaExp(); break
      case 'indiceEni': e.abrirModal('IndiceExpedienteModal'); break
    }
  }

  handleAccionInside(event: ModalActionEvent): void {
    switch (event.id) {
      case 'historial': this.e.handleInsideHistorialDesdeListado(); break
      case 'validar': this.e.handleInsideValidarDesdeListado(); break
      case 'insideExpediente': this.e.handleInsideExpedienteDesdeListado(); break
      case 'altaXml': this.e.handleInsideAltaXmlDesdeListado(); break
      case 'documentos': this.e.handleInsideDocumentosDesdeListado(); break
      case 'remisionJusticia': this.e.handleInsideRemisionDesdeListado(); break
    }
  }
}
