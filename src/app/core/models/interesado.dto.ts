import { PersonaEntidadDto } from './expediente.dto';

export interface InteresadoListarDto {
  id: number;
  idHisPerso: number | null;
  idPerso: number | null;
  perEntid: PersonaEntidadDto;
  idHisRepre: number | null;
  idRepre: number | null;
  expediente: number;
  ejeExped: number;
  numExped: number;
  principal: number;
  tipForNotif: number;
  forNotif: string;
  emailNotif: string;
  idHisDomNotif: number | null;
  idDomNotif: number | null;
  nomInter: string;
  nomRepre: string | null;
  dirInter: string;
  dirRepre: string | null;
  numDocumInter: string;
  numDocumRepre: string | null;
  desProviInter: string;
  desMunicInter: string;
  desProviRepre: string | null;
  desMunicRepre: string | null;
}

export default InteresadoListarDto;
