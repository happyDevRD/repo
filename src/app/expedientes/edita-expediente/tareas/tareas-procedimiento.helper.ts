import { TareaTramiteExpedienteCrear } from '../../expedientes';
import { createTareaProcedimientoGridAdapter } from './tarea-procedimiento-grid.config';

export interface TareaProcedimientoSeleccionHost {
  disabledArchivoTareaTramite: boolean;
  idlistatareaProcedi: unknown;
  sourceTareasProcedi: unknown;
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear;
  veoAcciones: boolean;
  veoModifiDatosPerso: boolean;
  veoConsultaObjetoTributario: boolean;
  veoBajaHabitante: boolean;
  descripcionAccion: string;
  ediquetaValorConsulta: string;
}

export function esSeleccionTareaProcedimientoVacia(selectedValue: unknown): boolean {
  return !selectedValue || selectedValue === '' || selectedValue === -1;
}

export function limpiarSeleccionTareaProcedimiento(host: TareaProcedimientoSeleccionHost): void {
  host.disabledArchivoTareaTramite = false;
  host.idlistatareaProcedi = null;
  host.sourceTareasProcedi = null;
  host.tareatramiteexpedientecrear.tareaProcedimiento = -1;
  host.veoAcciones = false;
  host.veoModifiDatosPerso = false;
  host.veoConsultaObjetoTributario = false;
  host.veoBajaHabitante = false;
  host.descripcionAccion = '';
  host.ediquetaValorConsulta = '';
}

export function aplicarGridTareaProcedimiento(
  host: TareaProcedimientoSeleccionHost,
  selectedValue: number | string,
): void {
  host.disabledArchivoTareaTramite = false;
  host.idlistatareaProcedi = selectedValue;
  host.sourceTareasProcedi = createTareaProcedimientoGridAdapter(selectedValue);
}

export function normalizarPlantillaDefectoSeleccion(plantilla: unknown): string | null {
  if (!plantilla || plantilla === 'null' || plantilla === 'undefined') {
    return null;
  }
  return String(plantilla);
}
