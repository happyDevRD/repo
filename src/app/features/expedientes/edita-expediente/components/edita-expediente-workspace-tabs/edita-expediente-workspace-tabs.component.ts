import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InteresadoListarDto } from '../../../../../core/models/interesado.dto';
import { trackById } from '../../../../../core/helper/track-by.helper';

@Component({
  selector: 'app-edita-expediente-workspace-tabs',
  templateUrl: './edita-expediente-workspace-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditaExpedienteWorkspaceTabsComponent {
  readonly trackById = trackById;

  @Input() expedienteEjercicio: number | string | null = null;
  @Input() expedienteNumero: number | string | null = null;
  @Input() idExpediente: number | null = null;
  @Input() verojointeresado = false;
  @Input() verborrarinteresado = false;
  @Input() listarinteresadosdto: InteresadoListarDto[] = [];
  @Input() verxml = false;
  @Input() verEditartareatramite = false;
  @Input() tareaDescripcion = '';
  @Input() verNuevaNotifi = false;
  @Input() verformnuevatarea = false;
  @Input() cargando = false;

  @Output() nuevoInteresado = new EventEmitter<void>();
  @Output() borrarInteresados = new EventEmitter<void>();
  @Output() seleccionaInteresado = new EventEmitter<number>();
  @Output() verHistoricoExpediente = new EventEmitter<void>();

  handleNuevoInteresado(): void {
    this.nuevoInteresado.emit();
  }

  handleBorrarInteresados(): void {
    this.borrarInteresados.emit();
  }

  handleSeleccionaInteresado(id: number): void {
    this.seleccionaInteresado.emit(id);
  }

  handleVerHistoricoExpediente(): void {
    this.verHistoricoExpediente.emit();
  }
}
