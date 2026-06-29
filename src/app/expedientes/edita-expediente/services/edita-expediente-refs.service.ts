import { ElementRef, Injectable } from '@angular/core';

/**
 * Referencias DOM compartidas entre el componente raíz y los paneles hijos.
 * Evita cadenas de ViewChild a través de shells intermedios.
 */
@Injectable()
export class EditaExpedienteRefs {
  teuFormRef?: any;
  fileInputOperaciones?: ElementRef;
  fileInputTramites?: ElementRef;
  gridNotificaciones?: any;
  gridRecibos?: ElementRef;

  get fileInput(): ElementRef | undefined {
    return this.fileInputOperaciones ?? this.fileInputTramites;
  }
}
