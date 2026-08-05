import { Component, Input } from '@angular/core'
import { ObjetoTributarioDto } from '../../../../../../../core/models/objeto-tributario.dto'

@Component({
  selector: 'app-consulta-objeto-tributario-fields',
  templateUrl: './consulta-objeto-tributario-fields.component.html',
})
export class ConsultaObjetoTributarioFieldsComponent {
  @Input({ required: true }) objetoTributario!: ObjetoTributarioDto
  @Input() idPrefix = 'consultaObj'
}
