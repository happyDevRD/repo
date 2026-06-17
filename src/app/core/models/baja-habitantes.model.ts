export class BajaHabitantes {
  tipBaja: string;
  fecMovim: string;
  fecReal: string;
  paiProDesti: string;
  proProDesti: any;
  munProDesti: any;

  constructor(data?: Partial<BajaHabitantes>) {
    this.tipBaja = data?.tipBaja ?? '';
    this.fecMovim = data?.fecMovim ?? '';
    this.fecReal = data?.fecReal ?? '';
    this.paiProDesti = data?.paiProDesti ?? '';
    this.proProDesti = data?.proProDesti ?? null;
    this.munProDesti = data?.munProDesti ?? null;
  }
}
