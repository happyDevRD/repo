export class Pais {
  codPais!: string | number;
  desPais!: string;
  sigLarga!: string;
  sigCorta!: string;
  uniEurop!: boolean | string | number | null;
  usuContr!: string;
  fecContr!: string;
}

export class ListaTareaProcedi {
  id!: number;
  procedimiento!: number;
  descripcion!: string;
  faseTarea!: string;
  plazo!: number;
  tipoPlazo!: string;
  tareaAutomatica!: boolean;
  plantillaDefectoModulo!: number;
  plantillaDefecto!: string;
  procesoFirmadoDefecto!: number;
  usuContr!: string;
}

export class RespuestasHttp {
  error!: unknown;
  headers!: Record<string, unknown> | unknown;
  status!: number;
  statusText!: string;
  url!: string;
}
