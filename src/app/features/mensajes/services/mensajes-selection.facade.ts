import { Injectable } from '@angular/core'
import { MensajeInboxItem, MensajeSelectionState } from '../models/mensajes.models'
import { applyMensajeSelection, mapInboxItemToSelection } from '../helpers/mensajes-inbox.helper'

export interface MensajesSelectionHost extends MensajeSelectionState {
  selectedKey: string
}

@Injectable()
export class MensajesSelectionFacade {
  select(host: MensajesSelectionHost, item: MensajeInboxItem): void {
    applyMensajeSelection(host, mapInboxItemToSelection(item))
    host.selectedKey = item.key
  }
}
