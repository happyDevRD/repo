import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { EditaExpedientePanelComponent } from '../edita-expediente-panel.component';
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service';

@Component({
  selector: 'app-edita-expediente-modals-notificaciones',
  templateUrl: './edita-expediente-modals-notificaciones.component.html',
})
export class EditaExpedienteModalsNotificacionesComponent
  extends EditaExpedientePanelComponent
  implements AfterViewInit
{
  private readonly refs = inject(EditaExpedienteRefs);

  @ViewChild('teuForm') teuFormRef: any;

  ngAfterViewInit(): void {
    this.refs.teuFormRef = this.teuFormRef;
  }
}
