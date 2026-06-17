export interface ObjetoTributarioDto {
  tipoObjetoTributario      : string;
  desObjTribu               : string;
  fecAlta                   : string;
  numDocum                  : string;
  desPerEntid               : string;
  domFiscal                 : string;
  domObjTribu?              : string;
  domBanca?                 : string;
  codMovim                  : string;
  fecMovim                  : string;
  observaciones             : string | null;
  idHisObjTribu             : number | null;
  idObjTribu                : number | null;
  idHisTipObjTribu          : number;
  idTipObjTribu             : number;
  idHisPerso                : number;
  idPerso                   : number;
}
