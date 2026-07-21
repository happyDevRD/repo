import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReciboCabeceraDto } from '../../../core/models/recibo-cabecera.dto';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { NotificationService } from '../../../core/service/notification.service';
import {
  ConsultaAccionHost,
  EditaExpedienteTareasConsultaFacade,
} from './edita-expediente-tareas-consulta.facade';
import {
  EditaExpedienteTareasFacade,
  TareaProcedimientoHost,
} from './edita-expediente-tareas.facade';
import {
  getAccionButtonText,
  isDNIAction,
  resetActionState,
  ResetActionStateHost,
  validarConsultaAccionClick,
} from './tareas-accion.helper';

export interface EditaExpedienteTareasAccionHost extends ConsultaAccionHost {
  tareatramiteexpedientecrear: { tareaProcedimiento: unknown };
}

@Injectable()
export class EditaExpedienteTareasAccionFacade {
  constructor(
    private readonly tareasConsultaFacade: EditaExpedienteTareasConsultaFacade,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly notificationService: NotificationService,
  ) {}

  resetActionState(host: EditaExpedienteTareasAccionHost): void {
    resetActionState(host as unknown as ResetActionStateHost);
  }

  getAccionButtonText(host: EditaExpedienteTareasAccionHost): string {
    return getAccionButtonText(host.tareatramiteprocedimiento);
  }

  isDNIAction(host: EditaExpedienteTareasAccionHost): boolean {
    return isDNIAction(host.tareatramiteprocedimiento?.accion);
  }

  onConsultaAccionClick(host: EditaExpedienteTareasAccionHost, tareaProcedimientoHost: TareaProcedimientoHost): void {
    this.tareasFacade.seleccionarTareaProcedimiento(
      tareaProcedimientoHost,
      host.tareatramiteexpedientecrear.tareaProcedimiento,
    );

    if (host.isConsultaAccionRunning) {
      return;
    }

    if (!validarConsultaAccionClick(host, this.notificationService)) {
      return;
    }

    host.isConsultaAccionRunning = true;
    this.tareasConsultaFacade.consultaAccion(host, host.introValorConsulta, host.introTObjTrubu);
  }

  consultaAccion(host: EditaExpedienteTareasAccionHost, valor: unknown, idtipobje: TipoObjetoTributarioDto): void {
    this.tareasConsultaFacade.consultaAccion(host, valor, idtipobje);
  }

  loadRecibos(host: EditaExpedienteTareasAccionHost): Observable<ReciboCabeceraDto[]> {
    return this.tareasConsultaFacade.loadRecibos(host);
  }
}
