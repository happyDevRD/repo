import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio.component';
import { TarCursoComponent } from './tar-curso.component';
import { PenFirmaComponent } from './pen-firma.component';
import { MenuInicioComponent } from './menu-inicio.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'tarcurso', component: TarCursoComponent },
  { path: 'penfirma', component: PenFirmaComponent },
  { path: 'menuinicio', component: MenuInicioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule {}
