// tramite-expediente.dto.ts

export interface TramiteExpedienteDto {
  id                : number;
  fecAsignacion     : string;
  expediente        : number;
  usuario           : string;
  estadoTramitacion : string;
  posesion          : number;
  usuContr          : string;
  fecContr          : string;
}
