export class PersonaEntidad {
  public usuContr   : any;
  public idPerso    : any;
  public idHisPerso : any;
  public numDocum   : any;
  public tipPerso   : any;
  public nombre     : string;
  public particula1 : any;
  public apellido1  : string;
  public particula2 : any;
  public apellido2  : string;
  public razSocia   : string;
  public razSocReduc: string;
  public desPerEntid: string;
  public localidad  : string;
  public codPosta   : any;
  public dirPosta   : string;
  public municipio  : string;
  public provincia  : string;
  public codMunic   : any;
  public codProvi   : any;
  public email      : string;
  public telFijo    : string;
  public telMovil   : string;

  constructor(data?: Partial<PersonaEntidad>) {
    this.usuContr = data?.usuContr ?? null;
    this.idPerso = data?.idPerso ?? null;
    this.idHisPerso = data?.idHisPerso ?? null;
    this.numDocum = data?.numDocum ?? null;
    this.tipPerso = data?.tipPerso ?? null;
    this.nombre = data?.nombre ?? '';
    this.particula1 = data?.particula1 ?? null;
    this.apellido1 = data?.apellido1 ?? '';
    this.particula2 = data?.particula2 ?? null;
    this.apellido2 = data?.apellido2 ?? '';
    this.razSocia = data?.razSocia ?? '';
    this.razSocReduc = data?.razSocReduc ?? '';
    this.desPerEntid = data?.desPerEntid ?? '';
    this.localidad = data?.localidad ?? '';
    this.codPosta = data?.codPosta ?? null;
    this.dirPosta = data?.dirPosta ?? '';
    this.municipio = data?.municipio ?? '';
    this.provincia = data?.provincia ?? '';
    this.codMunic = data?.codMunic ?? null;
    this.codProvi = data?.codProvi ?? null;
    this.email = data?.email ?? '';
    this.telFijo = data?.telFijo ?? '';
    this.telMovil = data?.telMovil ?? '';
  }
}
