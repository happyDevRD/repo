import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { TarCursoComponent } from './tar-curso.component';
import { PenFirmaComponent } from './pen-firma.component';
import { MenuInicioComponent } from './menu-inicio.component';
import { DashboardModalsHostComponent } from './components/dashboard-modals-host/dashboard-modals-host.component';

@NgModule({
  declarations: [
    InicioComponent,
    TarCursoComponent,
    PenFirmaComponent,
    MenuInicioComponent,
    DashboardModalsHostComponent,
  ],
  imports: [
    SharedModule,
    InicioRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioModule {}
