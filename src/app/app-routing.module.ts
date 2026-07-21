import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { Error404Component } from './error404/error404.component';
import { AUTHENTICATED_LAZY_ROUTES } from './routing/authenticated.routes';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  {
    path: '',
    canActivate: [AuthGuard],
    children: AUTHENTICATED_LAZY_ROUTES,
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
