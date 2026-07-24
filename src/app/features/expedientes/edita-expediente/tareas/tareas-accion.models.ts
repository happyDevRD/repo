import { TipoObjetoTributarioDto } from '../../../../core/models/tipo-objeto-tributario.dto'
import { ObjetoTributarioDto } from '../../../../core/models/objeto-tributario.dto'
import { HabitanteDto, createEmptyHabitante } from '../../../../core/models/habitante.dto'
import { VehiculoDto, createEmptyVehiculo } from '../../../../core/models/vehiculo.dto'
import { PersonaEntidad } from '../../../../core/models/personaentidad.model'

export type { HabitanteDto as Habitantes } from '../../../../core/models/habitante.dto'
export type { VehiculoDto as Vehiculo } from '../../../../core/models/vehiculo.dto'
export { PersonaEntidad, createEmptyHabitante, createEmptyVehiculo }

/** Estado UI de acciones/consulta de tarea. */
export interface TareasAccionUiState {
  veoAcciones: boolean
  veoModifiDatosPerso: boolean
  modifiObjetoTribu: boolean
  veoBajaHabitante: boolean
  veoConsultaObjetoTributario: boolean
  cargando: boolean
  descripcionAccion: string
  ediquetaValorConsulta: string
  isConsultaAccionRunning: boolean
  veoTipoObjetoTributario: boolean
  veoGenerarEntrada: boolean
  introValorConsulta: string
  introTObjTrubu: TipoObjetoTributarioDto
  habitantes: HabitanteDto
  vehiculo: VehiculoDto
  personaentidad: PersonaEntidad
  objetotributario: ObjetoTributarioDto
  veoDIVBorrarObjetoTRibu: boolean
  sourceRecibos: any
  dataAdapter: any
  columnsRecibos: any[]
  tipoObjetoSeleccionado: TipoObjetoTributarioDto
}
