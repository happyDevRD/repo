import { ElementRef, Injectable } from '@angular/core';
import { EditaExpedienteNuevaTareaFacade, EditaExpedienteNuevaTareaHost } from './edita-expediente-nueva-tarea.facade';

export interface EditaExpedientePanelHost {
  veoModifiDatosPerso: boolean;
  veoAcciones: boolean;
  verformnuevatarea: boolean;
  verTareasdelTramite: boolean;
  verlistadotramitadores: boolean;
  nuevotramitador: boolean;
  verlistadotareas: boolean;
  verEditartareatramite: boolean;
  introValorConsulta: string;
  veoTipoObjetoTributario: boolean;
  veoBajaHabitante: boolean;
  vertareas: boolean;
  disabledArchivoTareaTramite: boolean;
}

@Injectable()
export class EditaExpedientePanelFacade {
  constructor(private readonly nuevaTareaFacade: EditaExpedienteNuevaTareaFacade) {}

  verListadoTareasModal(host: EditaExpedientePanelHost & EditaExpedienteNuevaTareaHost): void {
    host.veoModifiDatosPerso = false;
    host.veoAcciones = false;
    host.verformnuevatarea = true;
    host.verTareasdelTramite = true;
    host.verformnuevatarea = false;
    host.verlistadotramitadores = false;
    host.nuevotramitador = false;
    host.verlistadotareas = true;
    host.verEditartareatramite = false;
    this.nuevaTareaFacade.borraDatosNuevaTarea(host);
    host.introValorConsulta = '';
  }

  onTareaCreada(host: EditaExpedientePanelHost, fileInput?: ElementRef): void {
    host.veoModifiDatosPerso = false;
    host.introValorConsulta = '';
    host.disabledArchivoTareaTramite = false;
    host.veoTipoObjetoTributario = false;
    host.verformnuevatarea = false;
    host.veoBajaHabitante = false;
    host.vertareas = true;
    host.veoAcciones = false;

    if (fileInput?.nativeElement) {
      fileInput.nativeElement.value = '';
    }
  }
}
