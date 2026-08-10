import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-workspace',
  templateUrl: './solicitudes-workspace.component.html',
})
export class SolicitudesWorkspaceComponent {
  readonly s = inject(SolicitudesComponent)

  handleEliminarSolicitud(): void {
    this.s.deleteSolicitudes(this.s.idsolicitud)
  }

  handleAsignarInstructor(): void {
    this.s.abrirModal('asignarModal')
  }

  handleRechazarSolicitud(): void {
    this.s.limpiarDatosRechazar()
    this.s.abrirModal('rechazaSoliModal')
  }

  handleVerRegistroDocumento(): void {
    this.s.CargoRegistroDocu()
  }
}
