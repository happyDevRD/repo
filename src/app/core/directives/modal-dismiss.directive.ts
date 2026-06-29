import { Directive, HostListener, Input } from '@angular/core'
import { ModalManagerService } from '../service/modal-manager.service'

@Directive({
  selector: '[iflowModalDismiss]',
  standalone: true,
})
export class ModalDismissDirective {

  @Input('iflowModalDismiss') modalId = ''

  constructor(private readonly modalManager: ModalManagerService) {}

  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    const target = event.target
    if (!(target instanceof Element)) {
      return
    }

    const modalElement = target.closest('.modal')
    const resolvedId = this.modalId || modalElement?.id
    if (!resolvedId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    this.modalManager.closeModal(resolvedId)
  }
}
