import { ACCIONES } from '../../../../core/helper/tarea-acciones'
import { TareaProcedimientoDTO } from '../../../../core/models/tarea-procedimiento.dto'
import { TipoObjetoTributarioDto } from '../../../../core/models/tipo-objeto-tributario.dto'
import { ChangeDetectorRef } from '@angular/core'
import { NotificationService } from '../../../../core/service/notification.service'
import { TareasAccionUiState } from './tareas-accion.models'

export type ResetActionStateUi = Pick<
  TareasAccionUiState,
  | 'isConsultaAccionRunning'
  | 'veoTipoObjetoTributario'
  | 'veoModifiDatosPerso'
  | 'descripcionAccion'
  | 'veoBajaHabitante'
  | 'veoConsultaObjetoTributario'
  | 'modifiObjetoTribu'
  | 'introValorConsulta'
  | 'introTObjTrubu'
>

/** @deprecated Prefer resetActionState(ui, cdr). Kept for hosts that still embed UI fields. */
export interface ResetActionStateHost extends ResetActionStateUi {
  cdr: ChangeDetectorRef
}

export function resetActionState(ui: ResetActionStateUi, cdr?: ChangeDetectorRef): void {
  ui.isConsultaAccionRunning = false
  ui.veoTipoObjetoTributario = false
  ui.veoModifiDatosPerso = false
  ui.descripcionAccion = ''
  ui.veoBajaHabitante = false
  ui.veoConsultaObjetoTributario = false
  ui.modifiObjetoTribu = false
  ui.introValorConsulta = ''
  ui.introTObjTrubu = {} as TipoObjetoTributarioDto
  cdr?.detectChanges()
}

export interface ConfigurarAccionTareaHost {
  resetActionState(): void
  tareasFacade: Pick<
    TareasAccionUiState,
    | 'descripcionAccion'
    | 'ediquetaValorConsulta'
    | 'veoTipoObjetoTributario'
    | 'veoDIVBorrarObjetoTRibu'
    | 'modifiObjetoTribu'
    | 'veoAcciones'
    | 'veoModifiDatosPerso'
    | 'veoBajaHabitante'
    | 'veoConsultaObjetoTributario'
  >
  abrirModalOperacion(): void
}

/** Configura la descripción y el label según el valor de data.accion. */
export function configurarAccionTarea(host: ConfigurarAccionTareaHost, data: TareaProcedimientoDTO): void {
  host.resetActionState()
  const ui = host.tareasFacade

  if (data.accion === null || data.accion === undefined) {
    return
  }

  const accionObj = ACCIONES.find((item) => item.valor === data.accion)
  if (accionObj) {
    ui.descripcionAccion = accionObj.descripcion
    ui.ediquetaValorConsulta = accionObj.etiqueta
    ui.veoTipoObjetoTributario = accionObj.veoTipoObjetoTributario || false
  } else {
    console.warn('Acción no reconocida:', data.accion)
    ui.descripcionAccion = ''
    ui.ediquetaValorConsulta = ''
  }

  if (data.accion === 5) {
    ui.veoDIVBorrarObjetoTRibu = false
    ui.modifiObjetoTribu = true
  }

  if (data.accion !== -1) {
    ui.veoAcciones = true
  }
  if (data.accion === 11) {
    host.abrirModalOperacion()
  }
  if (data.accion !== 3) {
    ui.veoModifiDatosPerso = false
  }
  if (data.accion !== 4) {
    ui.veoBajaHabitante = false
  }
  if (data.accion !== 2) {
    ui.veoConsultaObjetoTributario = false
  }
}

export function getAccionButtonText(tareatramiteprocedimiento?: TareaProcedimientoDTO): string {
  if (tareatramiteprocedimiento?.accion === -1) {
    return ''
  }
  const accionObj = ACCIONES.find((item) => item.valor === tareatramiteprocedimiento?.accion)
  return accionObj ? accionObj.etiquetaBoton : ''
}

export function isDNIAction(accion?: number | null): boolean {
  return accion === 6 || accion === 7 || accion === 8 || accion === 9 || accion === 10
}

export function validarConsultaAccionClick(
  host: {
    tareatramiteprocedimiento: TareaProcedimientoDTO
    introValorConsulta: string
    introTObjTrubu: TipoObjetoTributarioDto
  },
  notificationService: NotificationService,
): boolean {
  if (host.tareatramiteprocedimiento.accion !== 10) {
    if (!host.introValorConsulta || host.introValorConsulta.trim() === '') {
      notificationService.warning({
        title: 'Dato requerido',
        text: 'Por favor, ingrese el dato requerido para la consulta',
      })
      return false
    }
    return true
  }

  if (!host.introTObjTrubu || Object.keys(host.introTObjTrubu).length === 0) {
    notificationService.warning({
      title: 'Dato requerido',
      text: 'Por favor, seleccione el tipo de objeto tributario',
    })
    return false
  }
  return true
}
