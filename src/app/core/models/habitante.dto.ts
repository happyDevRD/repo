/** Alineado con HabitanteDto (backend pa/dto). */
export interface HabitanteDto {
  nombre: string | null
  particula1: string | null
  apellido1: string | null
  particula2: string | null
  apellido2: string | null
  tipDocum: string | null
  numDocum: string | null
  domicilio: string | null
  distrito: number | null
  seccion: string | null
  numHojPadro: string | null
  numFamil: number | null
  numOrden: number | null
  fecPadro: string | null
  fecNacim: string | null
  proNacim: string | null
  munNacim: string | null
  situacion: string | null
  fecSituacion: string | null
  telefono: string | null
  email: string | null
  observaciones: string | null
}

export function createEmptyHabitante(): HabitanteDto {
  return {
    nombre: null,
    particula1: null,
    apellido1: null,
    particula2: null,
    apellido2: null,
    tipDocum: null,
    numDocum: null,
    domicilio: null,
    distrito: null,
    seccion: null,
    numHojPadro: null,
    numFamil: null,
    numOrden: null,
    fecPadro: null,
    fecNacim: null,
    proNacim: null,
    munNacim: null,
    situacion: null,
    fecSituacion: null,
    telefono: null,
    email: null,
    observaciones: null,
  }
}
