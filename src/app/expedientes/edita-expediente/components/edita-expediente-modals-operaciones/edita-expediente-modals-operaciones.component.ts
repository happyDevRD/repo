import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { EditaExpedientePanelComponent } from '../edita-expediente-panel.component';
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service';

@Component({
  selector: 'app-edita-expediente-modals-operaciones',
  templateUrl: './edita-expediente-modals-operaciones.component.html',
})
export class EditaExpedienteModalsOperacionesComponent
  extends EditaExpedientePanelComponent
  implements AfterViewInit
{
  private readonly refs = inject(EditaExpedienteRefs);

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.refs.fileInputOperaciones = this.fileInput;
  }
}
