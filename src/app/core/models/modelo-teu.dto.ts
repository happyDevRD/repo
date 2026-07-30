/** Respuesta parcial al regenerar/crear TEU cuando el body trae XML en JSON. */
export interface ModeloTeuXmlResponse {
  xml?: string
}

/** Payload de actualización de notificación tras generar TEU (campos usados en editar). */
export interface NotificacionActualizacionTeu {
  idNotif: number
  /** ISO `YYYY-MM-DD` (input type=date / payload API). */
  fecEnvio: string
  usuContr: string
  email: string
  url: string
  indMater: string
  fecGener: Date | string
  fecSolic: Date | string
  fecFirma: Date | string
  forPubli: number
  procedimiento: string
  idModel: number
  incLgt: boolean
  texPlura: boolean
  datPerso: boolean
  edicionManual: boolean
}

/** Payload mínimo para regenerar TEU vía POST modeloteu/crear. */
export interface ModeloTeuRegenerarRequest {
  idNotif: number
  datoperso: boolean
  incltex: boolean
  leygene: boolean
}
