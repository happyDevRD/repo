import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core'
import { BackActionContext, NavigationService } from '../../../core/service/navigation.service'

/**
 * Botón único de navegación "volver" para toda la app. Icono, tono y tamaño
 * son fijos deliberadamente (bi-arrow-left, --secondary, tamaño default) —
 * es la única pieza del sistema de botones donde no se permite variación
 * entre features, porque la inconsistencia de posición/comportamiento del
 * "volver" era justo la queja a resolver (ver plan de rediseño, Wave 0).
 *
 * Uso: se coloca siempre en el slot [start] de app-page-header. Si el host es
 * un componente dual-mode (routed page / modal vía modal-shell), pasar
 * [modal]="esModal" y [modalId] para que cierre el modal en vez de navegar.
 */
@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  private readonly navigationService = inject(NavigationService)

  @Input() label = 'Volver'
  @Input() modal = false
  @Input() modalId?: string
  @Input() fallbackRoute: string | unknown[] = '/'

  handleClick(): void {
    const context: BackActionContext = {
      modal: this.modal,
      modalId: this.modalId,
      fallbackRoute: this.fallbackRoute,
    }
    this.navigationService.resolveBackAction(context).execute()
  }
}
