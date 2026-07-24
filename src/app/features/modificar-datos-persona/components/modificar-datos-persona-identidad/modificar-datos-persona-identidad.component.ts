import { Component, inject } from '@angular/core'
import { ModificarDatosPersonaComponent } from '../../modificar-datos-persona.component'

@Component({
  selector: 'app-modificar-datos-persona-identidad',
  templateUrl: './modificar-datos-persona-identidad.component.html',
})
export class ModificarDatosPersonaIdentidadComponent {
  readonly mdp = inject(ModificarDatosPersonaComponent)
}
