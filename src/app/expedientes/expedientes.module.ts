import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExpedientesWidgetsModule } from '../shared/expedientes-widgets.module';
import { ExpedientesRoutingModule } from './expedientes-routing.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { ExpedientesComponent } from './expedientes.component';
import { EditaExpedienteComponent } from './edita-expediente/edita-expediente.component';
import { EditaExpedienteUiModule } from './edita-expediente/edita-expediente-ui.module';
import { InteresadoComponent } from './interesado/interesado.component';
import { FilejercicioPipe } from './pipe/filejercicio.pipe';
import { FilexpedientePipe } from './pipe/filexpediente.pipe';
import { FiltituloPipe } from './pipe/filtitulo.pipe';
import { FilfaperturaPipe } from './pipe/filfapertura.pipe';
import { FilprocedimientoPipe } from './pipe/filprocedimiento.pipe';
import { FilinstructorokPipe } from './pipe/filinstructorok.pipe';

@NgModule({
  declarations: [
    ExpedientesComponent,
    EditaExpedienteComponent,
    InteresadoComponent,
    FilejercicioPipe,
    FilexpedientePipe,
    FiltituloPipe,
    FilfaperturaPipe,
    FilprocedimientoPipe,
    FilinstructorokPipe,
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
