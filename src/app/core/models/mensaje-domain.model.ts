export class CrearMensaje {
  fecEnvio!: Date
  idOrgUsuar!: number
  descripcion!: string
  fecLectura!: string
  fecTramitacion!: string
  fecRechazo!: string
  remitente!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
  posesion!: any
  idtarea!: any
  idExpediente!: any
}

export class EditarMensaje {
  id!: number
  idTarea!: number
  fecEnvio!: string
  descripcion!: string
  fecLectura!: Date
  fecTramitacion!: Date
  fecRechazo!: Date
  remitente!: string
  nomRemit!: string
  nomDesti!: string
  estado!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
}

export class RechazarMensaje {
  fecEnvio!: Date
  idOrgUsuar!: number
  descripcion!: string
  fecLectura!: Date
  fecTramitacion!: string
  fecRechazo!: Date
  remitente!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
  estado!: string
}

export class LeeMensaje {
  id!: number
  idTarea!: number
  fecEnvio!: string
  descripcion!: string
  fecLectura!: Date
  fecTramitacion!: Date
  fecRechazo!: Date
  remitente!: string
  nomRemit!: string
  nomDesti!: string
  estado!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
}

export class LeerMensajeRecibidos {
  id!: number
  idTarea!: number
  fecEnvio!: string
  descripcion!: string
  fecLectura!: string
  fecTramitacion!: Date
  fecRechazo!: Date
  remitente!: string
  nomRemit!: string
  nomDesti!: string
  estado!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
  idExped?: string
}

export class LeerMensajeEnviados {
  id!: number
  idTarea!: number
  fecEnvio!: string
  descripcion!: string
  fecLectura!: string
  fecTramitacion!: Date
  fecRechazo!: Date
  remitente!: string
  nomRemit!: string
  nomDesti!: string
  estado!: string
  destinatario!: string
  EstadoMensaje!: string
  informativo!: boolean
  descripcionRechazo!: string
}
