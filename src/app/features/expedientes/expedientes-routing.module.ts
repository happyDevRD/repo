import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ExpedientesComponent } from './expedientes.component'
import { EditaExpedienteComponent } from './edita-expediente/edita-expediente.component'
import { InteresadoComponent } from './interesado/interesado.component'
import { ExpedienteFichaComponent } from './expediente-ficha/expediente-ficha.component'

const routes: Routes = [
  { path: 'expedientes', component: ExpedientesComponent },
  { path: 'expedientes/:id/tramitar', component: EditaExpedienteComponent },
  { path: 'expedientes/:id/inside', component: ExpedienteFichaComponent },
  { path: 'expedientes/:id', component: ExpedienteFichaComponent },
  { path: 'editaexpediente/:id', redirectTo: 'expedientes/:id/tramitar', pathMatch: 'full' },
  { path: 'interesado/interesado/:id', component: InteresadoComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpedientesRoutingModule {}
