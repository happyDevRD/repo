import { Component, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-ver-pdf',
  templateUrl: './modal-ver-pdf.component.html',
})
export class SolicitudesModalVerPdfComponent {
  readonly s = inject(SolicitudesComponent)
}
