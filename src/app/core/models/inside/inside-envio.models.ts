export interface InsideEnvioRegistro {
  idEnvio?: number
  expedienteId: number
  idTarea?: number
  operacion: string
  estadoEnvio?: string
  fecha: string
  codigoRespuesta?: string
  descripcionRespuesta?: string
  identificador?: string
  csv?: string
  codigoEnvioATEA?: string
  dryRun: boolean
  mensajeError?: string
}

export interface InsideRegistrarEnvioRequest {
  idExpediente: number
  idTarea?: number
  operacion: string
  estadoEnvio?: string
  codigoRespuesta?: string
  descripcionRespuesta?: string
  identificadorEni?: string
  csv?: string
  codigoEnvioAtea?: string
  modoDryRun?: boolean
  mensajeError?: string
}
