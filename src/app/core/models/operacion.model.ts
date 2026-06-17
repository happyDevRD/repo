export interface Operacion {
  idConta: number;
  fecOpera: string | null;
  idCodOpera: string | number;
  txtOpera: string;
  impTotal: number;
  impDto: number;
  impIva: number;
  impLiqui: number;
  observaciones: string;
  usuario: string | null;
  indTipDocum?: string;
  numJusExter?: string;
  fecJusExter?: string;
  txtJusGasto?: string;
  indIvaDeduc?: string;
  indArea?: string;
  ejeRegis?: string;
  numRegis?: string;
  usuContr?: string;
  indAgrup?: string;
  claOpera?: string;
  signo?: string;
  tipoIva?: string;
}
