import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { MensajesRoutingModule } from './mensajes-routing.module'
import { MensajesComponent } from './mensajes.component'
import { MensajesHeaderComponent } from './components/mensajes-header/mensajes-header.component'
import { MensajesWorkspaceComponent } from './components/mensajes-workspace/mensajes-workspace.component'
import { MensajesListComponent } from './components/mensajes-list/mensajes-list.component'
import { MensajesContextComponent } from './components/mensajes-context/mensajes-context.component'
import { MensajesModalRechazarComponent } from './components/modals/modal-rechazar/modal-rechazar.component'

@NgModule({
  declarations: [
    MensajesComponent,
    MensajesHeaderComponent,
    MensajesWorkspaceComponent,
    MensajesListComponent,
    MensajesContextComponent,
    MensajesModalRechazarComponent,
  ],
  imports: [
    SharedModule,
    MensajesRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MensajesModule {}
