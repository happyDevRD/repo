import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { ModalAction, ModalActionEvent } from '../../modals/modal-action.model'
import { visibleActions } from '../../modals/modal-actions.util'

@Component({
  selector: 'app-modal-action-bar',
  templateUrl: './modal-action-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActionBarComponent {
  @Input() actions: ModalAction[] = []
  /** Clase del contenedor (toolbar de panel o footer de modal). */
  @Input() containerClass = 'acciones-botones-container'
  @Input() buttonClass = 'btn-iflow'

  @Output() action = new EventEmitter<ModalActionEvent>()

  get visible(): ModalAction[] {
    return visibleActions(this.actions)
  }

  handleClick(id: string): void {
    this.action.emit({ id })
  }

  toneClass(action: ModalAction): string {
    const tone = action.tone ?? 'primary'
    return `${this.buttonClass} ${this.buttonClass}--${tone}`
  }
}
