import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { ProcedimientosRoutingModule } from './procedimientos-routing.module'
import { ProcedimientosComponent } from './procedimientos.component'
import { ProcedimientosListComponent } from './components/procedimientos-list/procedimientos-list.component'
import { ProcedimientosModalsAltaComponent } from './components/procedimientos-modals-alta/procedimientos-modals-alta.component'
import { ProcedimientosWorkspaceComponent } from './components/procedimientos-workspace/procedimientos-workspace.component'
import { ProcedimientosModalsComponent } from './components/procedimientos-modals/procedimientos-modals.component'

@NgModule({
  declarations: [
    ProcedimientosComponent,
    ProcedimientosListComponent,
    ProcedimientosModalsAltaComponent,
    ProcedimientosWorkspaceComponent,
    ProcedimientosModalsComponent,
  ],
  imports: [
    SharedModule,
    ProcedimientosRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcedimientosModule {}
