import { Component, inject } from '@angular/core'
import { InteresadoComponent } from '../../interesado.component'

@Component({
  selector: 'app-interesado-list',
  templateUrl: './interesado-list.component.html',
})
export class InteresadoListComponent {
  readonly i = inject(InteresadoComponent)
}
