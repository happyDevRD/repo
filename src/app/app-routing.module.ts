import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./expedientes/expedientes.module').then(m => m.ExpedientesModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./procedimientos/procedimientos.module').then(m => m.ProcedimientosModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mensajes/mensajes.module').then(m => m.MensajesModule),
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
