import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ObjetoTributarioDto } from '../../../../../../../core/models/objeto-tributario.dto'

@Component({
  selector: 'app-baja-objeto-tributario-fields',
  templateUrl: './baja-objeto-tributario-fields.component.html',
})
export class BajaObjetoTributarioFieldsComponent {
  @Input({ required: true }) objetoTributario!: ObjetoTributarioDto
  /** Prefijo para ids únicos cuando el bloque se usa en más de un modal. */
  @Input() idPrefix = 'bajaObj'
  /** Si true, muestra el botón «Dar de baja» inline (Nueva Tarea). El modal independiente lo pone en el footer. */
  @Input() showInlineAction = false
  @Output() darDeBaja = new EventEmitter<void>()

  get yaDadoDeBaja(): boolean {
    return this.objetoTributario?.codMovim === 'BAJA'
  }
}
