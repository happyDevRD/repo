import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { ProcedimientosRoutingModule } from './procedimientos-routing.module'
import { ProcedimientosComponent } from './procedimientos.component'
import { FormnuevoprocediComponent } from './formnuevoprocedi.component'
import { FormModifProcediComponent } from './form-modif-procedi.component'
import { EditaProcedimientoComponent } from './edita-procedimiento.component'
import { VerProcedimientoComponent } from './ver-procedimiento.component'
import { PermisoprocedimientoComponent } from './permisoprocedimiento.component'
import { TareasProcedimientosComponent } from './tarea-procedimiento/tareas-procedimientos.component'
import { MenuprocedimientoComponent } from './menuprocedimiento.component'
import { ProcedimientosListComponent } from './components/procedimientos-list/procedimientos-list.component'
import { ProcedimientosModalsAltaComponent } from './components/procedimientos-modals-alta/procedimientos-modals-alta.component'
import { ProcedimientosWorkspaceComponent } from './components/procedimientos-workspace/procedimientos-workspace.component'
import { ProcedimientosModalsComponent } from './components/procedimientos-modals/procedimientos-modals.component'
import { EditaProcedimientoTareasComponent } from './components/edita-procedimiento-tareas/edita-procedimiento-tareas.component'
import { FormnuevoprocediTareasComponent } from './components/formnuevoprocedi-tareas/formnuevoprocedi-tareas.component'

@NgModule({
  declarations: [
    ProcedimientosComponent,
    FormnuevoprocediComponent,
    FormModifProcediComponent,
    EditaProcedimientoComponent,
    VerProcedimientoComponent,
    PermisoprocedimientoComponent,
    TareasProcedimientosComponent,
    MenuprocedimientoComponent,
    ProcedimientosListComponent,
    ProcedimientosModalsAltaComponent,
    ProcedimientosWorkspaceComponent,
    ProcedimientosModalsComponent,
    EditaProcedimientoTareasComponent,
    FormnuevoprocediTareasComponent,
  ],
  imports: [
    SharedModule,
    ProcedimientosRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcedimientosModule {}
