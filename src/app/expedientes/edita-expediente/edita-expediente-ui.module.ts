import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ExpedientesWidgetsModule } from '../../shared/expedientes-widgets.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { EditaExpedienteHeaderComponent } from './components/edita-expediente-header/edita-expediente-header.component';
import { EditaExpedienteWorkspaceComponent } from './components/edita-expediente-workspace/edita-expediente-workspace.component';
import { EditaExpedienteWorkspaceTramitesComponent } from './components/edita-expediente-workspace-tramites/edita-expediente-workspace-tramites.component';
import { EditaExpedienteWorkspaceNotificacionesComponent } from './components/edita-expediente-workspace-notificaciones/edita-expediente-workspace-notificaciones.component';
import { EditaExpedienteWorkspaceTramitadoresComponent } from './components/edita-expediente-workspace-tramitadores/edita-expediente-workspace-tramitadores.component';
import { EditaExpedienteWorkspaceTareasComponent } from './components/edita-expediente-workspace-tareas/edita-expediente-workspace-tareas.component';
import { EditaExpedienteWorkspaceTabsComponent } from './components/edita-expediente-workspace-tabs/edita-expediente-workspace-tabs.component';
import { EditaExpedienteModalsComponent } from './components/edita-expediente-modals/edita-expediente-modals.component';
import { EditaExpedienteModalsNotificacionesComponent } from './components/edita-expediente-modals-notificaciones/edita-expediente-modals-notificaciones.component';
import { EditaExpedienteModalsInteresadosComponent } from './components/edita-expediente-modals-interesados/edita-expediente-modals-interesados.component';
import { EditaExpedienteModalsOperacionesComponent } from './components/edita-expediente-modals-operaciones/edita-expediente-modals-operaciones.component';
import { EditaExpedienteModalsTramitesComponent } from './components/edita-expediente-modals-tramites/edita-expediente-modals-tramites.component';

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
];

@NgModule({
  imports: [SharedModule, ExpedientesWidgetsModule, NotificacionesModule],
  declarations: PANELS,
  exports: PANELS,
})
export class EditaExpedienteUiModule {}
