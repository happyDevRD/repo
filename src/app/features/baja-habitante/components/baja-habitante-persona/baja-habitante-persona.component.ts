import { Component, inject } from '@angular/core'
import { BajaHabitanteComponent } from '../../baja-habitante.component'

@Component({
  selector: 'app-baja-habitante-persona',
  templateUrl: './baja-habitante-persona.component.html',
})
export class BajaHabitantePersonaComponent {
  readonly bh = inject(BajaHabitanteComponent)
}
