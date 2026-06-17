export interface ContabilidadDTO {
  idConta           : number;
  codEntid          : number;
  ejeConta          : number;
  indEstad          : number;
  indEstAprobacion  : number;
  indAcces          : number;
  rotConta          : string;
  logotipo          : string | null;
  idConOrige        : number;
  aplOrige          : number;
  indGesDesce       : number;
  indConOriCerr     : number;
  codConExter       : string | null;
  idConMatri        : number;
  idGruClaOrgan     : number;
  idGruClaFunci     : number;
  idGruClaEcono     : number;
  idGruCtaPgcp      : number;
  idGruCodOpera     : number;
  indModel          : number;
  indRegio          : number;
  usuContr          : string;
  fecContr          : string;
}
