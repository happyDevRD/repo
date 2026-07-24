import { NgModule } from '@angular/core'
import { UiLibsModule } from './ui-libs.module'
import { SharedModule } from './shared.module'
import { LiquidacionFormComponent } from '../features/liquidacion/components/liquidacion-form/liquidacion-form.component'
import { LiquidacionFormDatosComponent } from '../features/liquidacion/components/liquidacion-form-datos/liquidacion-form-datos.component'
import { LiquidacionFormCargosComponent } from '../features/liquidacion/components/liquidacion-form-cargos/liquidacion-form-cargos.component'
import { LiquidacionListComponent } from '../features/liquidacion/components/liquidacion-list/liquidacion-list.component'
import { GenerarEntradaComponent } from '../features/generar-entrada/generar-entrada.component'
import { GenerarEntradaDatosComponent } from '../features/generar-entrada/components/generar-entrada-datos/generar-entrada-datos.component'
import { GenerarEntradaFacturaComponent } from '../features/generar-entrada/components/generar-entrada-factura/generar-entrada-factura.component'
import { OperacionFormComponent } from '../features/operacion-form/operacion-form.component'
import { OperacionFormCodigoComponent } from '../features/operacion-form/components/operacion-form-codigo/operacion-form-codigo.component'
import { OperacionFormDetalleComponent } from '../features/operacion-form/components/operacion-form-detalle/operacion-form-detalle.component'
import { ModificarDatosPersonaComponent } from '../features/modificar-datos-persona/modificar-datos-persona.component'
import { ModificarDatosPersonaIdentidadComponent } from '../features/modificar-datos-persona/components/modificar-datos-persona-identidad/modificar-datos-persona-identidad.component'
import { ModificarDatosPersonaContactoComponent } from '../features/modificar-datos-persona/components/modificar-datos-persona-contacto/modificar-datos-persona-contacto.component'
import { BajaHabitanteComponent } from '../features/baja-habitante/baja-habitante.component'
import { BajaHabitantePersonaComponent } from '../features/baja-habitante/components/baja-habitante-persona/baja-habitante-persona.component'
import { BajaHabitanteFormComponent } from '../features/baja-habitante/components/baja-habitante-form/baja-habitante-form.component'

const WIDGET_DECLARATIONS = [
  LiquidacionFormComponent,
  LiquidacionFormDatosComponent,
  LiquidacionFormCargosComponent,
  LiquidacionListComponent,
  GenerarEntradaComponent,
  GenerarEntradaDatosComponent,
  GenerarEntradaFacturaComponent,
  OperacionFormComponent,
  OperacionFormCodigoComponent,
  OperacionFormDetalleComponent,
  ModificarDatosPersonaComponent,
  ModificarDatosPersonaIdentidadComponent,
  ModificarDatosPersonaContactoComponent,
  BajaHabitanteComponent,
  BajaHabitantePersonaComponent,
  BajaHabitanteFormComponent,
]

@NgModule({
  declarations: WIDGET_DECLARATIONS,
  imports: [UiLibsModule, SharedModule],
  exports: [UiLibsModule, ...WIDGET_DECLARATIONS],
})
export class ExpedientesWidgetsModule {}
