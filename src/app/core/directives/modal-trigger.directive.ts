import { Directive, HostListener, Input } from '@angular/core'
import { ModalManagerService } from '../service/modal-manager.service'

@Directive({
  selector: '[iflowModalOpen]',
  standalone: true,
})
export class ModalTriggerDirective {

  @Input('iflowModalOpen') modalId = ''
  @Input() iflowModalStack = false

  constructor(private readonly modalManager: ModalManagerService) {}

  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    if (!this.modalId) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    this.modalManager.openModal(this.modalId, { stack: this.iflowModalStack })
  }
}
