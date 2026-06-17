export interface LiquidacionDto {
  tipLiqui      : number;       // 1: Liquidación, 2: Autoliquidación
  idExped       : number;
  porBonif      : number;
  cuoLiqui      : number;
  impBonLiqui   : number;
  impSanci      : number;
  desSanci      : string;
  impVario      : number;
  desVario      : string;
  intDemor      : number;
  desIntDemor   : string;
  totLiqui      : number;
  observaciones : string;
  usuContr      : string;
  idLqui?: number; // ID asignado luego de la creación
}
