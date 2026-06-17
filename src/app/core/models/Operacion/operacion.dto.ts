export interface OperacionDTO {
  idCodOpera      : number | null;
  idConta         : number | null;
  indArea         : number | null;
  indAgrup        : number | null;
  claOpera        : string;
  signo           : number | null;
  fecOpera        : string;
  txtOpera        : string;
  tipoIVA         : number;
  impTotal        : number;
  impDto          : number;
  impIva          : number;
  impLiqui        : number;
  observaciones   : string;
  usuario         : string;
}
