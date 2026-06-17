export interface FacturaDTO {
  idConta     : number | null;
  fecJusExter : string;
  numJusExter : string;
  indTipDocum : number | null;
  txtJusGasto : string;
  indArea     : number | null;
  indIvaDeduc : number;
  impTotal    : number;
  impDto      : number;
  impIva      : number;
  impLiqui    : number;
}
