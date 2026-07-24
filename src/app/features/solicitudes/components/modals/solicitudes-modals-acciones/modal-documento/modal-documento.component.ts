import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-documento',
  templateUrl: './modal-documento.component.html',
})
export class SolicitudesModalDocumentoComponent implements AfterViewInit {
  readonly s = inject(SolicitudesComponent)

  @ViewChild('fileInput') fileInput: ElementRef

  ngAfterViewInit(): void {
    this.s.fileInput = this.fileInput
  }
}
