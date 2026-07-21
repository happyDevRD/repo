import { NgModule } from '@angular/core';
import { UiLibsModule } from './ui-libs.module';
import { LiquidacionFormComponent } from '../features/liquidacion/components/liquidacion-form/liquidacion-form.component';
import { LiquidacionListComponent } from '../features/liquidacion/components/liquidacion-list/liquidacion-list.component';
import { GenerarEntradaComponent } from '../features/generar-entrada/generar-entrada.component';
import { OperacionFormComponent } from '../features/operacion-form/operacion-form.component';
import { ModificarDatosPersonaComponent } from '../features/modificar-datos-persona/modificar-datos-persona.component';
import { BajaHabitanteComponent } from '../features/baja-habitante/baja-habitante.component';

const WIDGET_DECLARATIONS = [
  LiquidacionFormComponent,
  LiquidacionListComponent,
  GenerarEntradaComponent,
  OperacionFormComponent,
  ModificarDatosPersonaComponent,
  BajaHabitanteComponent,
];

@NgModule({
  declarations: WIDGET_DECLARATIONS,
  imports: [UiLibsModule],
  exports: [UiLibsModule, ...WIDGET_DECLARATIONS],
})
export class ExpedientesWidgetsModule {}
