import { Component, inject } from '@angular/core'
import { MensajesComponent } from '../../mensajes.component'
import { MensajeInboxItem } from '../../models/mensajes.models'
import { formatIsoDateToDisplay } from '../../helpers/mensajes-date.helper'

@Component({
  selector: 'app-mensajes-list',
  templateUrl: './mensajes-list.component.html',
})
export class MensajesListComponent {
  readonly m = inject(MensajesComponent)

  handleSelect(item: MensajeInboxItem): void {
    this.m.seleccionarMensaje(item)
  }

  trackByKey(_index: number, item: MensajeInboxItem): string {
    return item.key
  }

  fechaCorta(iso?: string): string {
    return formatIsoDateToDisplay(iso, '—')
  }

  estadoLabel(estado?: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente'
      case 'LEIDO':
        return 'Leído'
      case 'TRAMITANDO':
        return 'Tramitando'
      case 'TRAMITADO':
        return 'Tramitado'
      case 'RECHAZADO':
        return 'Rechazado'
      default:
        return estado || '—'
    }
  }

  estadoClass(estado?: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'msg-badge--pendiente'
      case 'LEIDO':
        return 'msg-badge--leido'
      case 'TRAMITANDO':
      case 'TRAMITADO':
        return 'msg-badge--tramitando'
      case 'RECHAZADO':
        return 'msg-badge--rechazado'
      default:
        return 'msg-badge--default'
    }
  }
}
