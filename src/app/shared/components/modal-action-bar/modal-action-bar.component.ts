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
  /** Clase del contenedor. Si no se especifica, se calcula a partir de `layout`. */
  @Input() containerClass?: string
  @Input() buttonClass = 'btn-iflow'
  /** 'toolbar' = barra de acciones de panel/listado; 'footer' = footer de modal. */
  @Input() layout: 'toolbar' | 'footer' = 'toolbar'
  /** Tamaño de todos los botones de la barra (ver criterio en styles.css). */
  @Input() size: 'default' | 'sm' = 'default'

  @Output() action = new EventEmitter<ModalActionEvent>()

  get visible(): ModalAction[] {
    return visibleActions(this.actions)
  }

  trackById(_index: number, item: ModalAction): string {
    return item.id
  }

  get resolvedContainerClass(): string {
    if (this.containerClass) {
      return this.containerClass
    }
    return this.layout === 'footer' ? 'modal-footer' : 'acciones-botones-container'
  }

  handleClick(id: string): void {
    this.action.emit({ id })
  }

  toneClass(action: ModalAction): string {
    const tone = action.tone ?? 'primary'
    const sizeClass = this.size === 'sm' ? ` ${this.buttonClass}--sm` : ''
    return `${this.buttonClass} ${this.buttonClass}--${tone}${sizeClass}`
  }
}
