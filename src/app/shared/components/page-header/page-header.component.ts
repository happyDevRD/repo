import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

/**
 * Cabecera de pantalla con dos slots fijos: [start] (back-button + título) y
 * [actions] (barra de acciones vía app-modal-action-bar en modo toolbar).
 * Garantiza estructuralmente que el botón "Volver" quede siempre en la misma
 * posición en vez de depender de que cada feature copie su propio flexbox de
 * cabecera (ver plan de rediseño de navegación, Wave 0).
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input() eyebrow?: string
  @Input() title?: string
}
