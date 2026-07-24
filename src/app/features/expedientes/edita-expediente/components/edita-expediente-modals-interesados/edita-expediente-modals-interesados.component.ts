import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultaDni, CrearInteresado } from '../../../expedientes';

@Component({
  selector: 'app-edita-expediente-modals-interesados',
  templateUrl: './edita-expediente-modals-interesados.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteModalsInteresadosComponent {
  @Input() crearinteresado: CrearInteresado = new CrearInteresado();
  @Input() consultadni: ConsultaDni = new ConsultaDni();
  @Input() dniok = false;
  @Input() selected: Date | string | number = new Date();

  @Output() crear = new EventEmitter<void>();
  @Output() solicitarDni = new EventEmitter<string>();

  handleCrear(): void {
    this.crear.emit();
  }

  handleSolicitarDni(usuario: string): void {
    this.solicitarDni.emit(usuario);
  }
}
