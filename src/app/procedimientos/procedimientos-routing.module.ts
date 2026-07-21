import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcedimientosComponent } from './procedimientos.component';
import { FormModifProcediComponent } from './form-modif-procedi.component';
import { EditaProcedimientoComponent } from './edita-procedimiento.component';
import { VerProcedimientoComponent } from './ver-procedimiento.component';
import { PermisoprocedimientoComponent } from './permisoprocedimiento.component';
import { TareasProcedimientosComponent } from './tarea-procedimiento/tareas-procedimientos.component';

const routes: Routes = [
  { path: 'procedimientos', component: ProcedimientosComponent },
  { path: 'procedimientos/:id', component: ProcedimientosComponent },
  { path: 'nprocedimiento', redirectTo: 'procedimientos', pathMatch: 'full' },
  { path: 'nprocedimiento/:id', redirectTo: 'procedimientos/:id', pathMatch: 'full' },
  { path: 'modifprocedimiento', component: FormModifProcediComponent },
  { path: 'editaprocedimiento/:id', redirectTo: 'procedimientos/:id', pathMatch: 'full' },
  { path: 'verprocedi/:id', component: VerProcedimientoComponent },
  { path: 'tareasprocedimientos', component: TareasProcedimientosComponent },
  { path: 'permisoprocedimiento', component: PermisoprocedimientoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcedimientosRoutingModule {}
