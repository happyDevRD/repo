import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { ModalManagerService } from '../../../core/service/modal-manager.service'

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalShellComponent {
  @Input() modalId = ''
  @Input() title = ''
  @Input() titleId = ''
  @Input() dialogClass = ''
  @Input() bodyClass = ''
  @Input() headerClass = ''
  @Input() contentClass = ''
  /** Clases extra del root `.modal` (por defecto `iflow-modal`). */
  @Input() modalClass = 'iflow-modal'
  /**
   * Si true, el header usa solo el slot `[modalHeader]` (+ botón cerrar).
   * Útil para títulos compuestos (p. ej. dashboard con meta).
   */
  @Input() customHeader = false
  @Input() headingLevel: 'h4' | 'h5' = 'h4'
  @Input() staticBackdrop = false
  @Input() keyboard = true
  @Input() showFooter = true
  @Input() closeAriaLabel = 'Cerrar'
  /**
   * Si true, la X usa `data-bs-dismiss` (ModalManager la captura).
   * Si false, la X emite `closed` y cierra vía ModalManager (sin data-bs-dismiss).
   */
  @Input() dismissOnClose = true

  @Output() closed = new EventEmitter<void>()

  get resolvedTitleId(): string {
    return this.titleId || `${this.modalId}Label`
  }

  handleCloseClick(): void {
    this.closed.emit()
    // Con dismissOnClose=false no hay data-bs-dismiss: hay que cerrar aquí.
    if (!this.dismissOnClose && this.modalId) {
      ModalManagerService.getInstance()?.closeModal(this.modalId)
    }
  }
}
