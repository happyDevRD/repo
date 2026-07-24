/** Alineado con PersonaEntidadDto (backend pe/dto). */
export class PersonaEntidad {
  usuContr: string | null
  idPerso: number | null
  idHisPerso: number | null
  numDocum: string | null
  tipPerso: string | null
  nombre: string
  particula1: string | null
  apellido1: string
  particula2: string | null
  apellido2: string
  razSocia: string
  razSocReduc: string
  desPerEntid: string
  localidad: string
  codPosta: number | null
  dirPosta: string
  municipio: string
  provincia: string
  /** Backend String (p. ej. código INE). */
  codMunic: string | null
  codProvi: string | null
  email: string
  telFijo: string
  telMovil: string

  constructor(data?: Partial<PersonaEntidad>) {
    this.usuContr = data?.usuContr ?? null
    this.idPerso = data?.idPerso ?? null
    this.idHisPerso = data?.idHisPerso ?? null
    this.numDocum = data?.numDocum ?? null
    this.tipPerso = data?.tipPerso ?? null
    this.nombre = data?.nombre ?? ''
    this.particula1 = data?.particula1 ?? null
    this.apellido1 = data?.apellido1 ?? ''
    this.particula2 = data?.particula2 ?? null
    this.apellido2 = data?.apellido2 ?? ''
    this.razSocia = data?.razSocia ?? ''
    this.razSocReduc = data?.razSocReduc ?? ''
    this.desPerEntid = data?.desPerEntid ?? ''
    this.localidad = data?.localidad ?? ''
    this.codPosta = data?.codPosta ?? null
    this.dirPosta = data?.dirPosta ?? ''
    this.municipio = data?.municipio ?? ''
    this.provincia = data?.provincia ?? ''
    this.codMunic = data?.codMunic != null ? String(data.codMunic) : null
    this.codProvi = data?.codProvi != null ? String(data.codProvi) : null
    this.email = data?.email ?? ''
    this.telFijo = data?.telFijo ?? ''
    this.telMovil = data?.telMovil ?? ''
  }
}
