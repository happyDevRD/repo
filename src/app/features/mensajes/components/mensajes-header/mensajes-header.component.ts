import { Component, inject } from '@angular/core'
import { MensajesComponent } from '../../mensajes.component'
import { MensajeFiltroDireccion, MensajeFiltroEstado } from '../../models/mensajes.models'

@Component({
  selector: 'app-mensajes-header',
  templateUrl: './mensajes-header.component.html',
})
export class MensajesHeaderComponent {
  readonly m = inject(MensajesComponent)

  handleDireccion(direccion: MensajeFiltroDireccion): void {
    this.m.setFiltroDireccion(direccion)
  }

  handleEstado(estado: MensajeFiltroEstado): void {
    this.m.setFiltroEstado(estado)
  }

  handleBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.m.onBusquedaChange(value)
  }
}
