import { TareaTramiteExpedienteCrear } from '../../expedientes'
import { createTareaProcedimientoGridAdapter } from './tarea-procedimiento-grid.config'
import { TareasAccionUiState } from './tareas-accion.models'

export interface TareaProcedimientoSeleccionHost {
  disabledArchivoTareaTramite: boolean
  idlistatareaProcedi: number | string | null
  sourceTareasProcedi: unknown
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear
  tareasFacade: Pick<
    TareasAccionUiState,
    | 'veoAcciones'
    | 'veoModifiDatosPerso'
    | 'veoConsultaObjetoTributario'
    | 'veoBajaHabitante'
    | 'descripcionAccion'
    | 'ediquetaValorConsulta'
    | 'modifiObjetoTribu'
    | 'veoTipoObjetoTributario'
    | 'veoDIVBorrarObjetoTRibu'
    | 'isConsultaAccionRunning'
    | 'introValorConsulta'
    | 'introTObjTrubu'
  >
}

export function esSeleccionTareaProcedimientoVacia(selectedValue: unknown): boolean {
  return !selectedValue || selectedValue === '' || selectedValue === -1
}

export function limpiarSeleccionTareaProcedimiento(host: TareaProcedimientoSeleccionHost): void {
  const ui = host.tareasFacade
  host.disabledArchivoTareaTramite = false
  host.idlistatareaProcedi = null
  host.sourceTareasProcedi = null
  host.tareatramiteexpedientecrear.tareaProcedimiento = -1
  ui.veoAcciones = false
  ui.veoModifiDatosPerso = false
  ui.veoConsultaObjetoTributario = false
  ui.veoBajaHabitante = false
  ui.descripcionAccion = ''
  ui.ediquetaValorConsulta = ''
}

export function aplicarGridTareaProcedimiento(
  host: TareaProcedimientoSeleccionHost,
  selectedValue: number | string,
): void {
  host.disabledArchivoTareaTramite = false
  host.idlistatareaProcedi = selectedValue
  host.sourceTareasProcedi = createTareaProcedimientoGridAdapter(selectedValue)
}

export function normalizarPlantillaDefectoSeleccion(plantilla: unknown): string | null {
  if (!plantilla || plantilla === 'null' || plantilla === 'undefined') {
    return null
  }
  return String(plantilla)
}
