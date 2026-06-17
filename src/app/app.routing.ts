import { ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { TareasProcedimientosComponent } from './procedimientos/tarea-procedimiento/tareas-procedimientos.component';


// Componentes importados

import { LoginComponent } from './login/login.component';
import { AdministracionComponent } from "./administracion/administracion.component";
import { ExpedientesComponent } from "./expedientes/expedientes.component";
import { MensajesComponent } from "./mensajes/mensajes.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";
import { Error404Component } from './error404/error404.component';
import { ProcedimientosComponent } from './procedimientos/procedimientos.component';
import { PermisoprocedimientoComponent } from './procedimientos/permisoprocedimiento.component';
import { VerProcedimientoComponent } from './procedimientos/ver-procedimiento.component';
import { InicioComponent } from './inicio/inicio.component';
import { FormnuevoprocediComponent } from './procedimientos/formnuevoprocedi.component';
import { TarCursoComponent } from './inicio/tar-curso.component';
import { PenFirmaComponent } from './inicio/pen-firma.component';
import { MenuInicioComponent } from './inicio/menu-inicio.component';
import { FormModifProcediComponent } from './procedimientos/form-modif-procedi.component';
import { EditaProcedimientoComponent } from './procedimientos/edita-procedimiento.component';
import { EditaExpedienteComponent } from './expedientes/edita-expediente.component';
import { InteresadoComponent } from './expedientes/interesado/interesado.component';





const appRoutes : Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
{ path: 'login', component: LoginComponent},
{ path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},
{ path: 'nprocedimiento', component: FormnuevoprocediComponent, canActivate: [AuthGuard]},
{ path: 'nprocedimiento/:id', component: FormnuevoprocediComponent, canActivate: [AuthGuard]},
{ path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard]},
{ path: 'expedientes', component: ExpedientesComponent, canActivate: [AuthGuard]},
{ path: 'mensajes', component: MensajesComponent, canActivate: [AuthGuard]},
{ path: 'verprocedi/:id', component: VerProcedimientoComponent, canActivate: [AuthGuard]},
{ path: 'solicitudes', component: SolicitudesComponent, canActivate: [AuthGuard]},
{ path: 'procedimientos', component: ProcedimientosComponent, canActivate: [AuthGuard]},
{ path: 'tareasprocedimientos', component: TareasProcedimientosComponent, canActivate: [AuthGuard]},
{ path: 'tarcurso', component: TarCursoComponent, canActivate: [AuthGuard]},
{ path: 'penfirma', component: PenFirmaComponent, canActivate: [AuthGuard]},
{ path: 'menuinicio', component: MenuInicioComponent, canActivate: [AuthGuard]},
{ path: 'modifprocedimiento', component: FormModifProcediComponent, canActivate: [AuthGuard]},
{ path: 'editaprocedimiento/:id', component: EditaProcedimientoComponent, canActivate: [AuthGuard]},
{ path: 'editaexpediente/:id', component: EditaExpedienteComponent, canActivate: [AuthGuard]},
{ path: 'interesado/interesado/:id', component: InteresadoComponent, canActivate: [AuthGuard]},

{ path: 'permisoprocedimiento', component: PermisoprocedimientoComponent, canActivate: [AuthGuard]},


{ path: '**', component: Error404Component}



];

export const appRoutingProviders : any []=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);


