import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { ExpedientesWidgetsModule } from '../../shared/expedientes-widgets.module'
import { ExpedientesRoutingModule } from './expedientes-routing.module'
import { NotificacionesModule } from './notificaciones/notificaciones.module'
import { ExpedientesComponent } from './expedientes.component'
import { EditaExpedienteComponent } from './edita-expediente/edita-expediente.component'
import { EditaExpedienteUiModule } from './edita-expediente/edita-expediente-ui.module'
import { InteresadoComponent } from './interesado/interesado.component'
import { InteresadoListComponent } from './interesado/components/interesado-list/interesado-list.component'
import { InteresadoModalsComponent } from './interesado/components/interesado-modals/interesado-modals.component'
import { ExpedientesHeaderComponent } from './components/expedientes-header/expedientes-header.component'
import { ExpedientesAccionesComponent } from './components/expedientes-acciones/expedientes-acciones.component'
import { ExpedientesListComponent } from './components/expedientes-list/expedientes-list.component'
import { ExpedientesModalsComponent } from './components/expedientes-modals/expedientes-modals.component'
import { ExpedienteFichaComponent } from './expediente-ficha/expediente-ficha.component'
import { ModalInsideAccionesComponent } from './components/modals/modal-inside-acciones/modal-inside-acciones.component'

@NgModule({
  declarations: [
    ExpedientesComponent,
    EditaExpedienteComponent,
    ExpedienteFichaComponent,
    InteresadoComponent,
    InteresadoListComponent,
    InteresadoModalsComponent,
    ExpedientesHeaderComponent,
    ExpedientesAccionesComponent,
    ExpedientesListComponent,
    ExpedientesModalsComponent,
    ModalInsideAccionesComponent,
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
