import { AtributosCrear } from '../procedimiento';

export interface AtributoRowData {
  idAtrib?: unknown;
  idGrupo?: unknown;
  etiGruAtrib?: string;
  desGruAtrib?: string;
  requerido?: unknown;
  valInici?: unknown;
  valMinim?: unknown;
  valMaxim?: unknown;
  longitud?: unknown;
}

export interface AtributoRowHost {
  veoborraratributo: boolean;
  EtiquetaatributosActual: unknown;
  Requerido: unknown;
  idAtrib: unknown;
  idGrupo: unknown;
  etiGruAtrib: unknown;
  atributoscrear: AtributosCrear;
}

export const populateAtributoFromRow = (host: AtributoRowHost, rowData: AtributoRowData): void => {
  host.veoborraratributo = true;
  host.EtiquetaatributosActual = rowData.etiGruAtrib;
  host.Requerido = rowData.requerido;
  host.idAtrib = rowData.idAtrib;
  host.idGrupo = rowData.idGrupo;
  host.atributoscrear.idAtrib = rowData.idAtrib as number;
  host.etiGruAtrib = rowData.etiGruAtrib;
  host.atributoscrear.desGruAtrib = rowData.desGruAtrib ?? '';
  host.atributoscrear.valInici = rowData.valInici as string;
  host.atributoscrear.valMinim = rowData.valMinim as string;
  host.atributoscrear.valMaxim = rowData.valMaxim as string;
  host.atributoscrear.longitud = rowData.longitud as number;
};
