import { ACCIONES } from '../../../core/helper/tarea-acciones';
import { TareaProcedimientoDTO } from '../../../core/models/tarea-procedimiento.dto';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../../core/service/notification.service';

export interface ResetActionStateHost {
  isConsultaAccionRunning: boolean;
  veoTipoObjetoTributario: boolean;
  veoModifiDatosPerso: boolean;
  descripcionAccion: string;
  veoBajaHabitante: boolean;
  veoConsultaObjetoTributario: boolean;
  modifiObjetoTribu: boolean;
  introValorConsulta: string;
  introTObjTrubu: TipoObjetoTributarioDto;
  cdr: ChangeDetectorRef;
}

export function resetActionState(host: ResetActionStateHost): void {
  host.isConsultaAccionRunning = false;
  host.veoTipoObjetoTributario = false;
  host.veoModifiDatosPerso = false;
  host.descripcionAccion = '';
  host.veoBajaHabitante = false;
  host.veoConsultaObjetoTributario = false;
  host.modifiObjetoTribu = false;
  host.introValorConsulta = '';
  host.introTObjTrubu = {} as TipoObjetoTributarioDto;
  host.cdr.detectChanges();
}

export interface ConfigurarAccionTareaHost {
  resetActionState(): void;
  descripcionAccion: string;
  ediquetaValorConsulta: string;
  veoTipoObjetoTributario: boolean;
  veoDIVBorrarObjetoTRibu: boolean;
  modifiObjetoTribu: boolean;
  veoAcciones: boolean;
  veoModifiDatosPerso: boolean;
  veoBajaHabitante: boolean;
  veoConsultaObjetoTributario: boolean;
  abrirModalOperacion(): void;
}

/** Configura la descripción y el label según el valor de data.accion. */
export function configurarAccionTarea(host: ConfigurarAccionTareaHost, data: TareaProcedimientoDTO): void {
  host.resetActionState();

  if (data.accion === null || data.accion === undefined) {
    return;
  }

  const accionObj = ACCIONES.find((item) => item.valor === data.accion);
  if (accionObj) {
    host.descripcionAccion = accionObj.descripcion;
    host.ediquetaValorConsulta = accionObj.etiqueta;
    host.veoTipoObjetoTributario = accionObj.veoTipoObjetoTributario || false;
  } else {
    console.warn('Acción no reconocida:', data.accion);
    host.descripcionAccion = '';
    host.ediquetaValorConsulta = '';
  }

  if (data.accion === 5) {
    host.veoDIVBorrarObjetoTRibu = false;
    host.modifiObjetoTribu = true;
  }

  if (data.accion !== -1) {
    host.veoAcciones = true;
  }
  if (data.accion === 11) {
    host.abrirModalOperacion();
  }
  if (data.accion !== 3) {
    host.veoModifiDatosPerso = false;
  }
  if (data.accion !== 4) {
    host.veoBajaHabitante = false;
  }
  if (data.accion !== 2) {
    host.veoConsultaObjetoTributario = false;
  }
}

export function getAccionButtonText(tareatramiteprocedimiento?: TareaProcedimientoDTO): string {
  if (tareatramiteprocedimiento?.accion === -1) {
    return '';
  }
  const accionObj = ACCIONES.find((item) => item.valor === tareatramiteprocedimiento?.accion);
  return accionObj ? accionObj.etiquetaBoton : '';
}

export function isDNIAction(accion?: number | null): boolean {
  return accion === 6 || accion === 7 || accion === 8 || accion === 9 || accion === 10;
}

export function validarConsultaAccionClick(
  host: {
    tareatramiteprocedimiento: TareaProcedimientoDTO;
    introValorConsulta: string;
    introTObjTrubu: TipoObjetoTributarioDto;
  },
  notificationService: NotificationService,
): boolean {
  if (host.tareatramiteprocedimiento.accion !== 10) {
    if (!host.introValorConsulta || host.introValorConsulta.trim() === '') {
      notificationService.warning({
        title: 'Dato requerido',
        text: 'Por favor, ingrese el dato requerido para la consulta',
      });
      return false;
    }
    return true;
  }

  if (!host.introTObjTrubu || Object.keys(host.introTObjTrubu).length === 0) {
    notificationService.warning({
      title: 'Dato requerido',
      text: 'Por favor, seleccione el tipo de objeto tributario',
    });
    return false;
  }
  return true;
}
