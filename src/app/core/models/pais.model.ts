export class Pais {
  codPais: string;
  desPais: string;
  sigLarga: string;
  sigCorta: string;
  uniEurop: number;
  usuContr: string;
  fecContr: string;

  constructor(data?: Partial<Pais>) {
    this.codPais   = data?.codPais ?? '';
    this.desPais   = data?.desPais ?? '';
    this.sigLarga  = data?.sigLarga ?? '';
    this.sigCorta  = data?.sigCorta ?? '';
    this.uniEurop  = data?.uniEurop ?? 0;
    this.usuContr  = data?.usuContr ?? '';
    this.fecContr  = data?.fecContr ?? '';
  }
}
