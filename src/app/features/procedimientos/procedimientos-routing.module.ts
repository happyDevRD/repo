import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcedimientosComponent } from './procedimientos.component';

const routes: Routes = [
  { path: 'procedimientos', component: ProcedimientosComponent },
  { path: 'procedimientos/:id', component: ProcedimientosComponent },
  { path: 'nprocedimiento', redirectTo: 'procedimientos', pathMatch: 'full' },
  { path: 'nprocedimiento/:id', redirectTo: 'procedimientos/:id', pathMatch: 'full' },
  { path: 'editaprocedimiento/:id', redirectTo: 'procedimientos/:id', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcedimientosRoutingModule {}
