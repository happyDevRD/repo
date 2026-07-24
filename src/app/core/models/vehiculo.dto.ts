/** Alineado con VehiculoDto (backend ve/dto). */
export interface VehiculoDto {
  desPerEntid: string | null
  numDocum: string | null
  domicilio: string | null
  cp: string | null
  provincia: string | null
  municipio: string | null
  matricula: string | null
  bastidor: string | null
  tipoVehiculo: string | null
  marca: string | null
  modelo: string | null
}

export function createEmptyVehiculo(): VehiculoDto {
  return {
    desPerEntid: null,
    numDocum: null,
    domicilio: null,
    cp: null,
    provincia: null,
    municipio: null,
    matricula: null,
    bastidor: null,
    tipoVehiculo: null,
    marca: null,
    modelo: null,
  }
}
