import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.css'],
})
export class ModalShellComponent {
  @Input() modalId = ''
  @Input() title = ''
  @Input() titleId = ''
  @Input() dialogClass = ''
  @Input() bodyClass = ''
  @Input() headingLevel: 'h4' | 'h5' = 'h4'
  @Input() staticBackdrop = false
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
