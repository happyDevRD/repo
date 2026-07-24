import { Component, inject } from '@angular/core'
import { InteresadoComponent } from '../../interesado.component'

@Component({
  selector: 'app-interesado-modals',
  templateUrl: './interesado-modals.component.html',
})
export class InteresadoModalsComponent {
  readonly i = inject(InteresadoComponent)
}
