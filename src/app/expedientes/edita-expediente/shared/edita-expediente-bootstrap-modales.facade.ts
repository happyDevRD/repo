import { Injectable } from '@angular/core'
import { ModalManagerService } from '../../../core/service/modal-manager.service'

export interface BootstrapModalesHost {
  modalAnteriorId: string | null
  mostrarModalOperacion: boolean
  showGenerarEntrada: boolean
}

@Injectable()
export class EditaExpedienteBootstrapModalesFacade {

  constructor(private modalManager: ModalManagerService) {}

  abrirModalLiquidacion(host: BootstrapModalesHost): void {
    const modalAnteriorElement = document.querySelector('.modal.show') as HTMLElement | null
    if (modalAnteriorElement && modalAnteriorElement.id !== 'liquidacionModal') {
      host.modalAnteriorId = modalAnteriorElement.id
    }

    this.modalManager.openModal('liquidacionModal', { stack: !!host.modalAnteriorId })
  }

  cerrarModalLiquidacion(host: BootstrapModalesHost): void {
    const stackedParentId = host.modalAnteriorId
    host.modalAnteriorId = null

    this.modalManager.closeModal('liquidacionModal', {
      onHidden: () => {
        if (stackedParentId && !this.modalManager.isModalOpen(stackedParentId)) {
          window.setTimeout(() => this.modalManager.openModal(stackedParentId), 50)
        }
      }
    })
  }

  abrirModalOperacion(host: BootstrapModalesHost): void {
    host.mostrarModalOperacion = true

    window.setTimeout(() => {
      const modalElement = document.getElementById('operacionModal')
      if (!modalElement) {
        console.warn('[ModalManager] operacionModal aún no renderizado')
        return
      }
      this.modalManager.openModal('operacionModal', { stack: true })
    }, 50)
  }

  cerrarModalOperacion(host: BootstrapModalesHost): void {
    this.modalManager.closeModal('operacionModal', {
      onHidden: () => {
        host.mostrarModalOperacion = false
        this.modalManager.reconcileModalDomState()
      }
    })
  }

  abrirModalGenerarEntrada(onShow?: () => void): void {
    onShow?.()
    this.modalManager.openModal('GenerarEntradaModal')
  }

  cerrarModalGenerarEntrada(onHidden?: () => void): void {
    this.modalManager.closeModal('GenerarEntradaModal', {
      onHidden: () => onHidden?.()
    })
  }

  abrirModalObjetoTributario(): void {
    this.modalManager.openModal('bajaObjetoTributarioModal')
  }

  clickGenerarEntrada(host: BootstrapModalesHost): void {
    this.abrirModalGenerarEntrada(() => {
      host.showGenerarEntrada = true
    })
  }

  closeGenerarEntradaModal(host: BootstrapModalesHost): void {
    this.cerrarModalGenerarEntrada(() => {
      host.showGenerarEntrada = false
    })
  }
}
