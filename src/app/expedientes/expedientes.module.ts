import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExpedientesWidgetsModule } from '../shared/expedientes-widgets.module';
import { ExpedientesRoutingModule } from './expedientes-routing.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { ExpedientesComponent } from './expedientes.component';
import { EditaExpedienteComponent } from './edita-expediente/edita-expediente.component';
import { EditaExpedienteUiModule } from './edita-expediente/edita-expediente-ui.module';
import { InteresadoComponent } from './interesado/interesado.component';

@NgModule({
  declarations: [
    ExpedientesComponent,
    EditaExpedienteComponent,
    InteresadoComponent,
  ],
  imports: [
    SharedModule,
    ExpedientesWidgetsModule,
    NotificacionesModule,
    EditaExpedienteUiModule,
    ExpedientesRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExpedientesModule {}
