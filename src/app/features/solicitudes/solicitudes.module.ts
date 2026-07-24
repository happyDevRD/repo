import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { SolicitudesRoutingModule } from './solicitudes-routing.module'
import { SolicitudesComponent } from './solicitudes.component'
import { SolicitudesHeaderComponent } from './components/solicitudes-header/solicitudes-header.component'
import { SolicitudesWorkspaceComponent } from './components/solicitudes-workspace/solicitudes-workspace.component'
import { SolicitudesContextComponent } from './components/solicitudes-context/solicitudes-context.component'
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component'
import { SolicitudesDocumentosComponent } from './components/solicitudes-documentos/solicitudes-documentos.component'
import { SolicitudesModalsAltaComponent } from './components/modals/solicitudes-modals-alta/solicitudes-modals-alta.component'
import { SolicitudesAltaDatosComponent } from './components/modals/solicitudes-modals-alta/sections/alta-datos/alta-datos.component'
import { SolicitudesAltaInteresadoComponent } from './components/modals/solicitudes-modals-alta/sections/alta-interesado/alta-interesado.component'
import { SolicitudesAltaRepresentanteComponent } from './components/modals/solicitudes-modals-alta/sections/alta-representante/alta-representante.component'
import { SolicitudesModalsEdicionComponent } from './components/modals/solicitudes-modals-edicion/solicitudes-modals-edicion.component'
import { SolicitudesModalsAccionesComponent } from './components/modals/solicitudes-modals-acciones/solicitudes-modals-acciones.component'
import { SolicitudesModalAsignarComponent } from './components/modals/solicitudes-modals-acciones/modal-asignar/modal-asignar.component'
import { SolicitudesModalAsignarInstructorComponent } from './components/modals/solicitudes-modals-acciones/modal-asignar-instructor/modal-asignar-instructor.component'
import { SolicitudesModalDocumentoComponent } from './components/modals/solicitudes-modals-acciones/modal-documento/modal-documento.component'
import { SolicitudesModalIniciarExpedienteComponent } from './components/modals/solicitudes-modals-acciones/modal-iniciar-expediente/modal-iniciar-expediente.component'
import { SolicitudesModalDevolverComponent } from './components/modals/solicitudes-modals-acciones/modal-devolver/modal-devolver.component'
import { SolicitudesModalVerPdfComponent } from './components/modals/solicitudes-modals-acciones/modal-ver-pdf/modal-ver-pdf.component'
import { SolicitudesModalRechazarComponent } from './components/modals/solicitudes-modals-acciones/modal-rechazar/modal-rechazar.component'
import { SolicitudesModalPendientesComponent } from './components/modals/solicitudes-modals-acciones/modal-pendientes/modal-pendientes.component'

@NgModule({
  declarations: [
    SolicitudesComponent,
    SolicitudesHeaderComponent,
    SolicitudesWorkspaceComponent,
    SolicitudesContextComponent,
    SolicitudesListComponent,
    SolicitudesDocumentosComponent,
    SolicitudesModalsAltaComponent,
    SolicitudesAltaDatosComponent,
    SolicitudesAltaInteresadoComponent,
    SolicitudesAltaRepresentanteComponent,
    SolicitudesModalsEdicionComponent,
    SolicitudesModalsAccionesComponent,
    SolicitudesModalAsignarComponent,
    SolicitudesModalAsignarInstructorComponent,
    SolicitudesModalDocumentoComponent,
    SolicitudesModalIniciarExpedienteComponent,
    SolicitudesModalDevolverComponent,
    SolicitudesModalVerPdfComponent,
    SolicitudesModalRechazarComponent,
    SolicitudesModalPendientesComponent,
  ],
  imports: [
    SharedModule,
    SolicitudesRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SolicitudesModule {}
