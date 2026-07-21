import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProcedimientosRoutingModule } from './procedimientos-routing.module';
import { ProcedimientosComponent } from './procedimientos.component';
import { FormnuevoprocediComponent } from './formnuevoprocedi.component';
import { FormModifProcediComponent } from './form-modif-procedi.component';
import { EditaProcedimientoComponent } from './edita-procedimiento.component';
import { VerProcedimientoComponent } from './ver-procedimiento.component';
import { PermisoprocedimientoComponent } from './permisoprocedimiento.component';
import { TareasProcedimientosComponent } from './tarea-procedimiento/tareas-procedimientos.component';
import { MenuprocedimientoComponent } from './menuprocedimiento.component';

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
  ],
  imports: [
    SharedModule,
    ProcedimientosRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcedimientosModule {}
