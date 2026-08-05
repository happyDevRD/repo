import { NgModule } from '@angular/core'
import { SharedModule } from '../../../shared/shared.module'
import { ExpedientesWidgetsModule } from '../../../shared/expedientes-widgets.module'
import { NotificacionesModule } from '../notificaciones/notificaciones.module'
import { EditaExpedienteHeaderComponent } from './components/edita-expediente-header/edita-expediente-header.component'
import { EditaExpedienteWorkspaceComponent } from './components/edita-expediente-workspace/edita-expediente-workspace.component'
import { EditaExpedienteWorkspaceTramitesComponent } from './components/edita-expediente-workspace-tramites/edita-expediente-workspace-tramites.component'
import { EditaExpedienteWorkspaceNotificacionesComponent } from './components/edita-expediente-workspace-notificaciones/edita-expediente-workspace-notificaciones.component'
import { EditaExpedienteWorkspaceTramitadoresComponent } from './components/edita-expediente-workspace-tramitadores/edita-expediente-workspace-tramitadores.component'
import { EditaExpedienteWorkspaceTareasComponent } from './components/edita-expediente-workspace-tareas/edita-expediente-workspace-tareas.component'
import { EditaExpedienteWorkspaceTabsComponent } from './components/edita-expediente-workspace-tabs/edita-expediente-workspace-tabs.component'
import { EditaExpedienteModalsComponent } from './components/edita-expediente-modals/edita-expediente-modals.component'
import { EditaExpedienteModalsNotificacionesComponent } from './components/edita-expediente-modals-notificaciones/edita-expediente-modals-notificaciones.component'
import { EditaExpedienteModalsInteresadosComponent } from './components/edita-expediente-modals-interesados/edita-expediente-modals-interesados.component'
import { EditaExpedienteModalsOperacionesComponent } from './components/edita-expediente-modals-operaciones/edita-expediente-modals-operaciones.component'
import { EditaExpedienteModalsTramitesComponent } from './components/edita-expediente-modals-tramites/edita-expediente-modals-tramites.component'
import { EditaModalEnvioNotifiComponent } from './components/modals/operaciones/modal-envio-notifi/modal-envio-notifi.component'
import { EditaModalMetadatosModalComponent } from './components/modals/operaciones/modal-metadatos-modal/modal-metadatos-modal.component'
import { EditaModalRecepNotifiComponent } from './components/modals/operaciones/modal-recep-notifi/modal-recep-notifi.component'
import { EditaModalArchifirmaefComponent } from './components/modals/operaciones/modal-archifirmaef/modal-archifirmaef.component'
import { EditaModalLiquidacionModalComponent } from './components/modals/operaciones/modal-liquidacion-modal/modal-liquidacion-modal.component'
import { EditaModalGenerarEntradaModalComponent } from './components/modals/operaciones/modal-generar-entrada-modal/modal-generar-entrada-modal.component'
import { EditaModalOperacionFormComponent } from './components/modals/operaciones/modal-operacion-form/modal-operacion-form.component'
import { EditaModalDevolverNotifiComponent } from './components/modals/operaciones/modal-devolver-notifi/modal-devolver-notifi.component'
import { EditaModalVerNotifiModalComponent } from './components/modals/operaciones/modal-ver-notifi-modal/modal-ver-notifi-modal.component'
import { EditaModalPubliNotifModalComponent } from './components/modals/operaciones/modal-publi-notif-modal/modal-publi-notif-modal.component'
import { EditaModalGenerarSalidaModalComponent } from './components/modals/operaciones/modal-generar-salida-modal/modal-generar-salida-modal.component'
import { EditaModalCrearTablonAnunciosModalComponent } from './components/modals/operaciones/modal-crear-tablon-anuncios-modal/modal-crear-tablon-anuncios-modal.component'
import { EditaModalVerExpedienteEditaModalComponent } from './components/modals/operaciones/modal-ver-expediente-edita-modal/modal-ver-expediente-edita-modal.component'
import { EditaModalHistoricoModalComponent } from './components/modals/operaciones/modal-historico-modal/modal-historico-modal.component'
import { EditaModalNuevaTareaTraComponent } from './components/modals/operaciones/modal-nueva-tarea-tra/modal-nueva-tarea-tra.component'
import { NuevaTareaDatosComponent } from './components/modals/operaciones/modal-nueva-tarea-tra/sections/nueva-tarea-datos.component'
import { NuevaTareaAccionAsociadaComponent } from './components/modals/operaciones/modal-nueva-tarea-tra/sections/nueva-tarea-accion-asociada.component'
import { NuevaTareaDinamicosComponent } from './components/modals/operaciones/modal-nueva-tarea-tra/sections/nueva-tarea-dinamicos.component'
import { NuevaTareaDocumentacionComponent } from './components/modals/operaciones/modal-nueva-tarea-tra/sections/nueva-tarea-documentacion.component'
import { BajaObjetoTributarioFieldsComponent } from './components/modals/shared/baja-objeto-tributario-fields/baja-objeto-tributario-fields.component'
import { ConsultaObjetoTributarioFieldsComponent } from './components/modals/shared/consulta-objeto-tributario-fields/consulta-objeto-tributario-fields.component'
import { EditaModalInsideRemisionJusticiaModalComponent } from './components/modals/operaciones/modal-inside-remision-justicia-modal/modal-inside-remision-justicia-modal.component'
import { EditaModalRecibosPendientesModalComponent } from './components/modals/tramites/modal-recibos-pendientes-modal/modal-recibos-pendientes-modal.component'
import { EditaModalNuevoTramiteModalComponent } from './components/modals/tramites/modal-nuevo-tramite-modal/modal-nuevo-tramite-modal.component'
import { EditaModalEditarTramiteModalComponent } from './components/modals/tramites/modal-editar-tramite-modal/modal-editar-tramite-modal.component'
import { EditaModalEditarTareaTramiteModalComponent } from './components/modals/tramites/modal-editar-tarea-tramite-modal/modal-editar-tarea-tramite-modal.component'
import { EditaModalGenerarPropuestaResolucionModalComponent } from './components/modals/tramites/modal-generar-propuesta-resolucion-modal/modal-generar-propuesta-resolucion-modal.component'
import { EditaModalCrearNotificacionModalComponent } from './components/modals/tramites/modal-crear-notificacion-modal/modal-crear-notificacion-modal.component'
import { EditaModalBajaObjetoTributarioModalComponent } from './components/modals/tramites/modal-baja-objeto-tributario-modal/modal-baja-objeto-tributario-modal.component'
import { EditaModalListadoNotificacionesComponent } from './components/modals/tramites/modal-listado-notificaciones/modal-listado-notificaciones.component'
import { EditaModalListadoTramitadoresComponent } from './components/modals/tramites/modal-listado-tramitadores/modal-listado-tramitadores.component'

const PANELS = [
  EditaExpedienteHeaderComponent,
  EditaExpedienteWorkspaceComponent,
  EditaExpedienteWorkspaceTramitesComponent,
  EditaExpedienteWorkspaceNotificacionesComponent,
  EditaExpedienteWorkspaceTramitadoresComponent,
  EditaExpedienteWorkspaceTareasComponent,
  EditaExpedienteWorkspaceTabsComponent,
  EditaExpedienteModalsComponent,
  EditaExpedienteModalsNotificacionesComponent,
  EditaExpedienteModalsInteresadosComponent,
  EditaExpedienteModalsOperacionesComponent,
  EditaExpedienteModalsTramitesComponent,
  EditaModalEnvioNotifiComponent,
  EditaModalMetadatosModalComponent,
  EditaModalRecepNotifiComponent,
  EditaModalArchifirmaefComponent,
  EditaModalLiquidacionModalComponent,
  EditaModalGenerarEntradaModalComponent,
  EditaModalOperacionFormComponent,
  EditaModalDevolverNotifiComponent,
  EditaModalVerNotifiModalComponent,
  EditaModalPubliNotifModalComponent,
  EditaModalGenerarSalidaModalComponent,
  EditaModalCrearTablonAnunciosModalComponent,
  EditaModalVerExpedienteEditaModalComponent,
  EditaModalHistoricoModalComponent,
  EditaModalNuevaTareaTraComponent,
  NuevaTareaDatosComponent,
  NuevaTareaAccionAsociadaComponent,
  NuevaTareaDinamicosComponent,
  NuevaTareaDocumentacionComponent,
  BajaObjetoTributarioFieldsComponent,
  ConsultaObjetoTributarioFieldsComponent,
  EditaModalInsideRemisionJusticiaModalComponent,
  EditaModalRecibosPendientesModalComponent,
  EditaModalNuevoTramiteModalComponent,
  EditaModalEditarTramiteModalComponent,
  EditaModalEditarTareaTramiteModalComponent,
  EditaModalGenerarPropuestaResolucionModalComponent,
  EditaModalCrearNotificacionModalComponent,
  EditaModalBajaObjetoTributarioModalComponent,
  EditaModalListadoNotificacionesComponent,
  EditaModalListadoTramitadoresComponent,
]

@NgModule({
  imports: [SharedModule, ExpedientesWidgetsModule, NotificacionesModule],
  declarations: PANELS,
  exports: PANELS,
})
export class EditaExpedienteUiModule {}
