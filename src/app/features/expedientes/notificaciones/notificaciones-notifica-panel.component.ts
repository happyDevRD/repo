import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface EnvioNotificaInfo {
  idEnvioExterno?: string;
  estadoNotifica?: string;
  fecEnvio?: string;
  idAcuseExterno?: string;
}

@Component({
  selector: 'app-notificaciones-notifica-panel',
  templateUrl: './notificaciones-notifica-panel.component.html'
})
export class NotificacionesNotificaPanelComponent {
  @Input() veoEnviarNotifica = false;
  @Input() veoSincronizarNotifica = false;
  @Input() envioNotifica: EnvioNotificaInfo | null = null;

  @Output() enviar = new EventEmitter<void>();
  @Output() sincronizar = new EventEmitter<void>();
}
