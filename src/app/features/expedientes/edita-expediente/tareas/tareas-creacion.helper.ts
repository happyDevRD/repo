import { TareaTramiteExpedienteCrear } from '../../expedientes';
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper';

export interface PrepararTareaCreacionParams {
  idTramite: number;
  usuContrl: string;
  identificadorFicheroSubido?: number;
}

export function prepararTareaParaCreacion(
  tarea: TareaTramiteExpedienteCrear,
  params: PrepararTareaCreacionParams,
): void {
  tarea.tramite = params.idTramite;
  tarea.visible = true;
  tarea.fecContr = fechaHoyISO();
  tarea.usuario = params.usuContrl;

  if (params.identificadorFicheroSubido) {
    tarea.archivo = params.identificadorFicheroSubido;
  }

  if (typeof tarea.tareaProcedimiento === 'string') {
    tarea.tareaProcedimiento = parseInt(tarea.tareaProcedimiento, 10);
  }
}

export function validarTareaParaCreacion(tarea: TareaTramiteExpedienteCrear): boolean {
  return !!(tarea.descripcion && tarea.fecInicio && tarea.tareaProcedimiento);
}

export function normalizarPlantillaDefecto(plantilla: string | null): string | null {
  if (!plantilla || plantilla === 'null' || plantilla === 'undefined') {
    return null;
  }
  return plantilla;
}

export function tieneArchivoPendienteSubida(
  base64code?: string,
  name?: string,
  identificadorFicheroSubido?: number,
): boolean {
  return !!(base64code && name && !identificadorFicheroSubido);
}
