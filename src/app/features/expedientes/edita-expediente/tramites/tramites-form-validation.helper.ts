import { CrearTramiteExp } from '../../expedientes'
import { fechaTramitePorDefecto } from './tramites-validacion.helper'

export function crearTramiteExpVacio(): CrearTramiteExp {
  const tramite = new CrearTramiteExp()
  tramite.fase = ''
  tramite.descripcion = ''
  tramite.fecTramite = fechaTramitePorDefecto()
  return tramite
}

export function aplicarFechaTramitePorDefecto(tramite: CrearTramiteExp): void {
  tramite.fecTramite = fechaTramitePorDefecto()
}
