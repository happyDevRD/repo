/** Catálogo INE: provincia (código 2 dígitos). */
export interface ProvinciaIne {
  id: string
  nm: string
}

/** Catálogo INE: municipio (código 5 dígitos; prefijo = provincia). */
export interface MunicipioIne {
  id: string
  nm: string
}

/** Tipos de baja de habitante (catálogo estático). */
export interface TipoBajaCatalogo {
  codigo: string
  descripcion: string
}
