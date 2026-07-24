import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { SolicitudesComponent } from '../../../../solicitudes.component'

@Component({
  selector: 'app-solicitudes-modal-pendientes',
  templateUrl: './modal-pendientes.component.html',
})
export class SolicitudesModalPendientesComponent implements AfterViewInit {
  readonly s = inject(SolicitudesComponent)

  @ViewChild('content') content: ElementRef

  ngAfterViewInit(): void {
    this.s.content = this.content
  }
}
