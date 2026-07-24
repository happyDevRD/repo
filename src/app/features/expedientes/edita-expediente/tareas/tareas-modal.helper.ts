import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { reconcileModalDomState } from '../../../../core/service/modal-dom.util'

const MODAL_NUEVA_TAREA_ID = 'NuevaTareaTra'
const MODAL_NTAREA_TRAMITE_ID = 'ntareatramiteModal'
const MODAL_EDITAR_TAREA_TRAMITE_ID = 'EditarTareaTramiteModal'

const getModalManager = (): ModalManagerService | null => ModalManagerService.getInstance()

export interface TareaTramiteGridRow {
  descripcion: string
  numero: number | string
  fecInicio: string | Date | null
  fecFin: string | Date | null
}

export function abrirModalEditarTareaTramite(
  host: {
    tareatramiteexpedienteeditar: {
      descripcion: string
      numero: unknown
      fecInicio: unknown
      fecFin: unknown
    }
  },
  rowData: TareaTramiteGridRow,
): void {
  host.tareatramiteexpedienteeditar.descripcion = rowData.descripcion
  host.tareatramiteexpedienteeditar.numero = rowData.numero
  host.tareatramiteexpedienteeditar.fecInicio = rowData.fecInicio
  host.tareatramiteexpedienteeditar.fecFin = rowData.fecFin

  getModalManager()?.openModal(MODAL_EDITAR_TAREA_TRAMITE_ID)
}

export function cerrarModalesNuevaTarea(): void {
  const manager = getModalManager()
  if (!manager) {
    reconcileModalDomState()
    return
  }

  manager.closeModal(MODAL_NUEVA_TAREA_ID)
  manager.closeModal(MODAL_NTAREA_TRAMITE_ID)
  window.setTimeout(() => reconcileModalDomState(), 150)
}
