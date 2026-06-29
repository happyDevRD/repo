import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { EditaExpedientePanelComponent } from '../edita-expediente-panel.component';
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service';

@Component({
  selector: 'app-edita-expediente-workspace-notificaciones',
  templateUrl: './edita-expediente-workspace-notificaciones.component.html',
})
export class EditaExpedienteWorkspaceNotificacionesComponent
  extends EditaExpedientePanelComponent
  implements AfterViewInit
{
  private readonly refs = inject(EditaExpedienteRefs);

  @ViewChild('gridNotificaciones') gridNotificaciones: any;

  ngAfterViewInit(): void {
    this.refs.gridNotificaciones = this.gridNotificaciones;
  }
}
