import { Directive, inject } from '@angular/core';
import { EditaExpedienteComponent } from '../edita-expediente.component';

/**
 * Base para paneles de plantilla que delegan lógica al componente raíz.
 * Busca EditaExpedienteComponent en el árbol de inyectores (no solo en el host
 * inmediato, para soportar shells intermedios como workspace/modals).
 */
@Directive()
export abstract class EditaExpedientePanelComponent {
  readonly edita = inject(EditaExpedienteComponent);
}
