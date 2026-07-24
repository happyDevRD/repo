export class BajaHabitantes {
  tipBaja: string
  fecMovim: string
  fecReal: string
  paiProDesti: string
  proProDesti: string | null
  munProDesti: string | null

  constructor(data?: Partial<BajaHabitantes>) {
    this.tipBaja = data?.tipBaja ?? ''
    this.fecMovim = data?.fecMovim ?? ''
    this.fecReal = data?.fecReal ?? ''
    this.paiProDesti = data?.paiProDesti ?? ''
    this.proProDesti = data?.proProDesti ?? null
    this.munProDesti = data?.munProDesti ?? null
  }
}
