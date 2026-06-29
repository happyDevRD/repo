import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { EditaExpedientePanelComponent } from '../edita-expediente-panel.component';
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service';

@Component({
  selector: 'app-edita-expediente-modals-tramites',
  templateUrl: './edita-expediente-modals-tramites.component.html',
})
export class EditaExpedienteModalsTramitesComponent
  extends EditaExpedientePanelComponent
  implements AfterViewInit
{
  private readonly refs = inject(EditaExpedienteRefs);

  @ViewChild('gridRecibos') gridRecibos: ElementRef | undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.refs.gridRecibos = this.gridRecibos;
    this.refs.fileInputTramites = this.fileInput;
  }
}
