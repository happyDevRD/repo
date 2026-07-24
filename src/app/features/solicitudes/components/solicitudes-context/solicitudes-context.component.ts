import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-context',
  templateUrl: './solicitudes-context.component.html',
})
export class SolicitudesContextComponent {
  readonly s = inject(SolicitudesComponent)

  handleEditarSolicitud(): void {
    this.s.abrirEdicionSolicitudSeleccionada()
  }

  handleEliminarSolicitud(): void {
    this.s.deleteSolicitudes(this.s.idsolicitud)
  }

  handleAsignarInstructor(): void {
    this.s.abrirModal('asignarModal')
  }

  handleRechazarSolicitud(): void {
    this.s.abrirModal('rechazaSoliModal')
  }

  handleIniciarExpediente(): void {
    this.s.abrirModal('iniciarExpedieModal')
  }

  handleVerRegistroDocumento(): void {
    this.s.CargoRegistroDocu()
  }
}