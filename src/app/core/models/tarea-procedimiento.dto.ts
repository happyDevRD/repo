// models/tarea-procedimiento.dto.ts
export interface TareaProcedimientoDTO {
  id                        : number;
  procedimiento             : number;
  descripcion               : string;
  faseTarea                 : string;
  plazo                     : number;
  tipoPlazo                 : string;
  tareaAutomatica           : boolean;
  plantillaDefectoModulo?   : string | null;
  plantillaDefecto          : string;
  procesoFirmadoDefecto     : number;
  accion                    : number | null;
  usuContr                  : string;
  fecContr                  : string;
}
