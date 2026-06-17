// expediente.dto.ts

export interface PersonaEntidadDto {
  idPerso: number;
  idHisPerso: number;
  numDocum: string;
  tipPerso: string;
  nombre: string;
  particula1?: string | null;
  apellido1: string;
  particula2?: string | null;
  apellido2: string;
  razSocia?: string | null;
  razSocReduc?: string | null;
  desPerEntid: string;
  localidad: string;
  codPosta: number;
  dirPosta: string;
  municipio: string;
  provincia: string;
  codMunic?: number | null;
  codProvi?: number | null;
  email?: string | null;
  telFijo?: string | null;
  telMovil?: string | null;
  usuContr?: string | null;
}

export interface ExpedienteDto {
  id: number;
  idHisPerso?: number | null;
  idPerso?: number | null;
  perEntid: PersonaEntidadDto;
  idHisRepre?: number | null;
  idRepre?: number | null;
  expediente: number;
  ejeExped: number;
  numExped: number;
  principal: number;
  tipForNotif: number;
  forNotif: string;
  emailNotif: string;
  idHisDomNotif?: number | null;
  idDomNotif?: number | null;
  nomInter: string;
  nomRepre?: string | null;
  dirInter: string;
  dirRepre?: string | null;
  numDocumInter: string;
  numDocumRepre?: string | null;
  desProviInter: string;
  desMunicInter: string;
  desProviRepre?: string | null;
  desMunicRepre?: string | null;
}
