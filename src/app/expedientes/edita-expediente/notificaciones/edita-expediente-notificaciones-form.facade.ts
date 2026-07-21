import { Injectable } from '@angular/core';
import { CrearNotificacion } from '../../expedientes';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import { validarFormularioCreacionNotificacion } from './notificaciones-form.validator';

export interface EditaExpedienteNotificacionesFormHost {
  creanotificacion: CrearNotificacion;
  idTarea: number;
  listarinteresadosdto: InteresadoListarDto[];
  textoFormaNotif: string;
}

@Injectable()
export class EditaExpedienteNotificacionesFormFacade {
  private formularioValido = false;
  private ultimaValidacion: unknown = null;

  getFormularioValido(host: EditaExpedienteNotificacionesFormHost): boolean {
    const valoresActuales = {
      fecha: host.creanotificacion?.fecNotif,
      dni: host.creanotificacion?.dni,
      observacion: host.creanotificacion?.observacion,
      idTarea: host.idTarea,
      interesadosLength: host.listarinteresadosdto?.length || 0,
    };

    if (JSON.stringify(valoresActuales) !== JSON.stringify(this.ultimaValidacion)) {
      this.ultimaValidacion = valoresActuales;
      this.formularioValido = this.validarFormulario(host);
    }

    return this.formularioValido;
  }

  validarFormulario(host: EditaExpedienteNotificacionesFormHost): boolean {
    return validarFormularioCreacionNotificacion({
      creanotificacion: host.creanotificacion,
      idTarea: host.idTarea,
      interesados: host.listarinteresadosdto,
    });
  }

  limpiarCacheValidacion(): void {
    this.ultimaValidacion = null;
    this.formularioValido = false;
  }

  inicializarFechaNotificacion(host: EditaExpedienteNotificacionesFormHost): void {
    host.creanotificacion.fecNotif = new Date();
  }

  limpiarFormularioNotificacion(host: EditaExpedienteNotificacionesFormHost): void {
    host.creanotificacion = new CrearNotificacion();
    host.textoFormaNotif = '';
    this.inicializarFechaNotificacion(host);
  }
}
