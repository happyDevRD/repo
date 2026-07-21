import { Injectable } from '@angular/core';
import { ModalManagerService } from '../../core/service/modal-manager.service';
import { MensajeRowData, MensajeSelectionState } from '../models/mensajes.models';
import {
  applyMensajeSelection,
  mapEnviadosRowToSelection,
  mapRecibidosRowToSelection,
  mapVerModalRowToSelection,
} from '../helpers/mensajes-row.mapper';

export interface MensajesGridHost extends MensajeSelectionState {
  contarPendientes(): void;
}

@Injectable()
export class MensajesGridFacade {
  constructor(private readonly modalManagerService: ModalManagerService) {}

  onRecibidosRowClick(host: MensajesGridHost, event: any): void {
    host.contarPendientes();
    const row = event?.args?.row?.bounddata as MensajeRowData | undefined;
    if (!row) {
      return;
    }
    applyMensajeSelection(host, mapRecibidosRowToSelection(row));
  }

  onEnviadosRowClick(host: MensajesGridHost, event: any): void {
    const row = event?.args?.row?.bounddata as MensajeRowData | undefined;
    if (!row) {
      return;
    }
    applyMensajeSelection(host, mapEnviadosRowToSelection(row));
  }

  abrirModalVerMensaje(host: MensajesGridHost, event: any): void {
    host.contarPendientes();
    const row = event?.args?.row?.bounddata as MensajeRowData | undefined;
    if (!row) {
      return;
    }
    applyMensajeSelection(host, mapVerModalRowToSelection(row));
    this.modalManagerService.openModal('VerMensajeModal');
  }
}
