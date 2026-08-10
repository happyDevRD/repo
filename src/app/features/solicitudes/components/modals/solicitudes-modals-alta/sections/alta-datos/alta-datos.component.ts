import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../../solicitudes.component'
import { trackByUsuario } from 'src/app/core/helper/track-by.helper'

@Component({
  selector: 'app-solicitudes-alta-datos',
  templateUrl: './alta-datos.component.html',
})
export class SolicitudesAltaDatosComponent {
  readonly s = inject(SolicitudesComponent)
  readonly trackByUsuario = trackByUsuario

  get numeroSolicitudPreview(): string {
    const ejercicio = String(this.s.creasolicitud.ejercicio ?? '').trim()
    const numero = this.s.creasolicitud.numero
    if (ejercicio && numero != null && String(numero).trim() !== '') {
      return `${ejercicio}/${numero}`
    }
    if (ejercicio) {
      return `${ejercicio}/—`
    }
    const fecha = String(this.s.creasolicitud.fecInicio ?? '')
    if (fecha.length >= 4) {
      return `${fecha.substring(0, 4)}/—`
    }
    return 'Se asignará al guardar'
  }

  get expedientePreview(): string {
    return this.s.expsolicitud?.trim() || '—'
  }
}
