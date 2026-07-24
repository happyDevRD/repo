import { Component, inject } from '@angular/core'
import { ModificarDatosPersonaComponent } from '../../modificar-datos-persona.component'

@Component({
  selector: 'app-modificar-datos-persona-contacto',
  templateUrl: './modificar-datos-persona-contacto.component.html',
})
export class ModificarDatosPersonaContactoComponent {
  readonly mdp = inject(ModificarDatosPersonaComponent)
}
