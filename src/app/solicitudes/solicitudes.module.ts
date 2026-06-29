import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { SolicitudesComponent } from './solicitudes.component';
import { FilasuntoPipe } from './pipe/filasunto.pipe';
import { FilinteresadoPipe } from './pipe/filinteresado.pipe';
import { FilrepresentantePipe } from './pipe/filrepresentante.pipe';
import { FildepartamentoPipe } from './pipe/fildepartamento.pipe';
import { FilasignadoPipe } from './pipe/filasignado.pipe';
import { FilestadoPipe } from './pipe/filestado.pipe';

@NgModule({
  declarations: [
    SolicitudesComponent,
    FilasuntoPipe,
    FilinteresadoPipe,
    FilrepresentantePipe,
    FildepartamentoPipe,
    FilasignadoPipe,
    FilestadoPipe,
  ],
  imports: [
    SharedModule,
    SolicitudesRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SolicitudesModule {}
