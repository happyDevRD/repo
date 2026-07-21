import { Injectable } from '@angular/core';
import { CrearTramiteExp } from '../../expedientes';
import { NotificationService } from '../../../core/service/notification.service';
import {
  aplicarFechaTramitePorDefecto,
  crearTramiteExpVacio,
} from './tramites-form-validation.helper';
import {
  limpiarErroresFormulario,
  validarFormularioBootstrap,
} from '../../../core/helper/bootstrap-form.helper';
import {
  aplicarVistaNotificaciones,
  aplicarVistaTramitadores,
  aplicarVistaTramite,
} from '../shared/edita-expediente-panel-navegacion.helper';

export interface EditaExpedienteTramitesUiHost {
  nuevotramite: boolean;
  verTareasdelTramite: boolean;
  creartramiteexp: CrearTramiteExp;
  FechaSistema(): void;
  verExpediente: { ejercicio: number; numero: number };
  sourceListarNotifi: unknown;
  recargarSourceTramitadores(): void;
}

@Injectable()
export class EditaExpedienteTramitesUiFacade {
  constructor(private readonly notificationService: NotificationService) {}

  cancelarnuevotramite(host: EditaExpedienteTramitesUiHost): void {
    host.nuevotramite = false;
    host.creartramiteexp = crearTramiteExpVacio();
    host.nuevotramite = false;
    host.FechaSistema();
  }

  limpiarFormularioTramite(host: EditaExpedienteTramitesUiHost): void {
    host.creartramiteexp = crearTramiteExpVacio();
    host.nuevotramite = false;
  }

  habilitaTramiteExp(host: EditaExpedienteTramitesUiHost): void {
    host.nuevotramite = true;
    host.verTareasdelTramite = false;
    aplicarFechaTramitePorDefecto(host.creartramiteexp);
  }

  validateAndCreateTramite(event: Event, crearTramExp: () => void): void {
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields();
      return;
    }
    crearTramExp();
  }

  validateAndEditTramite(event: Event, editarTramite: () => void): void {
    if (!validarFormularioBootstrap(event)) {
      this.notificationService.incompleteFields();
      return;
    }
    editarTramite();
  }

  limpiarErroresTramite(): void {
    limpiarErroresFormulario('formNuevoTramite', true);
  }

  limpiarErroresEditarTramite(): void {
    limpiarErroresFormulario('formEditarTramite');
  }

  veotramitadores(host: EditaExpedienteTramitesUiHost): void {
    aplicarVistaTramitadores(host as never);
  }

  verNotificaciones(host: EditaExpedienteTramitesUiHost, crearGrid: (ejercicio: number, numero: number) => unknown): void {
    aplicarVistaNotificaciones(host as never, crearGrid);
  }

  noverNotificaciones(host: EditaExpedienteTramitesUiHost): void {
    aplicarVistaTramite(host as never);
  }
}
