export class Pais {
  codPais: any;
  desPais: string;
  sigLarga: string;
  sigCorta: string;
  uniEurop: any;
  usuContr: string;
  fecContr: string;
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
  error!: any;
  headers!: any;
  status!: number;
  statusText!: string;
  url!: string;
}
