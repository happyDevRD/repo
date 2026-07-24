import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

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
  @Input() dismissOnClose = true

  @Output() closed = new EventEmitter<void>()

  get resolvedTitleId(): string {
    return this.titleId || `${this.modalId}Label`
  }

  handleCloseClick(): void {
    this.closed.emit()
  }
}
