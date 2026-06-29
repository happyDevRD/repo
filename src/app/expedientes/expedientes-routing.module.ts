import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedientesComponent } from './expedientes.component';
import { EditaExpedienteComponent } from './edita-expediente/edita-expediente.component';
import { InteresadoComponent } from './interesado/interesado.component';

const routes: Routes = [
  { path: 'expedientes', component: ExpedientesComponent },
  { path: 'editaexpediente/:id', component: EditaExpedienteComponent },
  { path: 'interesado/interesado/:id', component: InteresadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpedientesRoutingModule {}
