import { Component, inject } from '@angular/core'
import { BajaHabitanteComponent } from '../../baja-habitante.component'

@Component({
  selector: 'app-baja-habitante-form',
  templateUrl: './baja-habitante-form.component.html',
})
export class BajaHabitanteFormComponent {
  readonly bh = inject(BajaHabitanteComponent)
}
