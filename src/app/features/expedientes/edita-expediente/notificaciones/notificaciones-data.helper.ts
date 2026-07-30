import { ConsultaDni, CrearNotificacion, LeerNotificacion } from '../../expedientes'
import { InteresadoListarDto } from '../../../../core/models/interesado.dto'
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper'

export function prepararDatosNotificacionParaEnvio(
  creanotificacion: CrearNotificacion,
): Record<string, unknown> {
  const datos: Record<string, unknown> = { ...creanotificacion }
  return datos
}

export function validarCamposNotificacionEdicion(creanotificacion: CrearNotificacion): string[] {
  const faltantes: string[] = []
  if (!creanotificacion.situacion) {
    faltantes.push('situacion')
  }
  if (Number(creanotificacion.situacion) === 1) {
    // GENERADA: sin campos extra
  }
  if (!creanotificacion.notificador2) {
    faltantes.push('notificador2')
  }
  if (!creanotificacion.receptor) {
    faltantes.push('receptor')
  }
  if (!creanotificacion.motNotif) {
    faltantes.push('motNotif')
  }
  if (!creanotificacion.fecRecNotif) {
    faltantes.push('fecRecNotif')
  }
  return faltantes
}

export function crearNotificacionVacia(params: {
  usuContrl: string
  ejercicioExpediente: number
  numeroExpediente: number
  identificadorFicheroSubido?: number
  fechaActual: Date
}): CrearNotificacion {
  const creanotificacion = new CrearNotificacion()
  creanotificacion.ejeNotif = params.fechaActual.getFullYear()
  creanotificacion.situacion = 1
  creanotificacion.usuContr = params.usuContrl
  creanotificacion.ejeExped = params.ejercicioExpediente
  creanotificacion.numExped = params.numeroExpediente
  creanotificacion.forNotif = 0
  creanotificacion.notificador = ''
  creanotificacion.motNotif = ''
  creanotificacion.receptor = ''
  creanotificacion.observacion = ''
  creanotificacion.dni = ''
  creanotificacion.numNotif = 0
  creanotificacion.numBop = 0
  creanotificacion.bop = 0
  creanotificacion.numEnvioTeu = ''
  creanotificacion.codArchiAcuse = ''
  creanotificacion.codArchi = params.identificadorFicheroSubido ?? null
  creanotificacion.desNotificador = ''
  creanotificacion.desMotNotif = ''
  creanotificacion.desSituacion = ''
  creanotificacion.tipVial = ''
  creanotificacion.desVial = ''
  creanotificacion.letInfer = ''
  creanotificacion.bloque = ''
  creanotificacion.portal = ''
  creanotificacion.escalera = ''
  creanotificacion.planta = ''
  creanotificacion.puerta = ''
  creanotificacion.localidad = ''
  creanotificacion.domicilio = ''
  creanotificacion.numInfer = 0
  creanotificacion.numSuper = 0
  creanotificacion.codPosta = 0
  creanotificacion.codProvi = 0
  creanotificacion.codMunic = 0
  creanotificacion.numRegisSalid = 0
  creanotificacion.fecNotif = fechaHoyISO()
  return creanotificacion
}

export function normalizarCreacionNotificacion(
  creanotificacion: CrearNotificacion,
  interesado: InteresadoListarDto,
  params: {
    usuContrl: string
    ejercicioExpediente: number
    numeroExpediente: number
    identificadorFicheroSubido?: number
    fechaActual: Date
  },
): void {
  creanotificacion.situacion = 1
  creanotificacion.usuContr = params.usuContrl

  const persona = interesado.perEntid
    ? Array.isArray(interesado.perEntid)
      ? interesado.perEntid[0]
      : interesado.perEntid
    : null

  if (persona) {
    creanotificacion.idHisPerso = persona.idHisPerso || 0
    creanotificacion.idPerso = persona.idPerso || 0
  } else {
    creanotificacion.idHisPerso = interesado.idHisPerso || 0
    creanotificacion.idPerso = interesado.idPerso || 0
  }

  creanotificacion.ejeExped = params.ejercicioExpediente
  creanotificacion.numExped = params.numeroExpediente
  creanotificacion.codArchi = params.identificadorFicheroSubido ?? null
  creanotificacion.ejeNotif = creanotificacion.ejeNotif || params.fechaActual.getFullYear()
  creanotificacion.forNotif = creanotificacion.forNotif ?? 0
  creanotificacion.notificador = creanotificacion.notificador ?? 0
  creanotificacion.motNotif = creanotificacion.motNotif ?? ''
  creanotificacion.receptor = creanotificacion.receptor ?? 0
  creanotificacion.observacion = creanotificacion.observacion ?? ''
  creanotificacion.numNotif = creanotificacion.numNotif ?? 0
  creanotificacion.numBop = creanotificacion.numBop ?? 0
  creanotificacion.bop = creanotificacion.bop ?? 0
  creanotificacion.numEnvioTeu = creanotificacion.numEnvioTeu ?? ''
  creanotificacion.codArchiAcuse = creanotificacion.codArchiAcuse ?? ''
  creanotificacion.idNotif = creanotificacion.idNotif ?? 0
  creanotificacion.personaEntidad = creanotificacion.personaEntidad ?? null
  creanotificacion.desNotificador = creanotificacion.desNotificador ?? ''
  creanotificacion.desMotNotif = creanotificacion.desMotNotif ?? ''
  creanotificacion.desSituacion = creanotificacion.desSituacion ?? ''
  creanotificacion.fecRecNotif = creanotificacion.fecRecNotif ?? null
  creanotificacion.notificador2 = creanotificacion.notificador2 ?? 0
  creanotificacion.codProvi = creanotificacion.codProvi ?? 0
  creanotificacion.codMunic = creanotificacion.codMunic ?? 0
  creanotificacion.tipVial = creanotificacion.tipVial ?? ''
  creanotificacion.desVial = creanotificacion.desVial ?? ''
  creanotificacion.numInfer = creanotificacion.numInfer ?? 0
  creanotificacion.letInfer = creanotificacion.letInfer ?? ''
  creanotificacion.numSuper = creanotificacion.numSuper ?? 0
  creanotificacion.bloque = creanotificacion.bloque ?? ''
  creanotificacion.portal = creanotificacion.portal ?? ''
  creanotificacion.escalera = creanotificacion.escalera ?? ''
  creanotificacion.planta = creanotificacion.planta ?? ''
  creanotificacion.puerta = creanotificacion.puerta ?? ''
  creanotificacion.localidad = creanotificacion.localidad ?? ''
  creanotificacion.domicilio = creanotificacion.domicilio ?? ''
  creanotificacion.codPosta = creanotificacion.codPosta ?? 0
  creanotificacion.fecArchi = creanotificacion.fecArchi ?? null
  creanotificacion.fecRegistSalid = creanotificacion.fecRegistSalid ?? null
  creanotificacion.numRegisSalid = creanotificacion.numRegisSalid ?? 0
  creanotificacion.fecEnvio = creanotificacion.fecEnvio ?? null
  creanotificacion.fecCaduc = creanotificacion.fecCaduc ?? null
  creanotificacion.fecEmiBop = creanotificacion.fecEmiBop ?? null
  creanotificacion.fecPubBop = creanotificacion.fecPubBop ?? null
}

/** Estado de notificación poseído por NotificacionesUiFacade. */
export interface NotificacionDominioState {
  creanotificacion: CrearNotificacion
  notificacionver: LeerNotificacion | null
  modoVerNotificacion: boolean
  idNotificacion: number
  ejerNotifi: string
  numeroNotifi: string
  fechNotifi: string | Date | null
  dniNotifi: string
  desPerEntidNotifi: string
}

export function aplicarNotificacionVer(
  ui: NotificacionDominioState,
  notificacionver: LeerNotificacion,
  modoVer: boolean,
  id: number,
): void {
  ui.modoVerNotificacion = modoVer
  ui.idNotificacion = id
  ui.notificacionver = notificacionver
  ui.creanotificacion = {
    ...ui.creanotificacion,
    ejeNotif: notificacionver?.ejeNotif,
    numNotif: notificacionver?.numNotif,
    forNotif: notificacionver?.forNotif,
    fecNotif: notificacionver?.fecNotif ?? null,
    situacion: notificacionver?.situacion,
    dni: notificacionver?.personaEntidad?.numDocum || '',
    notificador: notificacionver?.notificador as number,
    notificador2: notificacionver?.notificador as number,
    fecEnvio: notificacionver?.fecEnvio ?? null,
    fecRecNotif: notificacionver?.fecRecNotif ?? null,
    receptor: notificacionver?.receptor || 0,
    motNotif: String(notificacionver?.motNotif ?? ''),
    fecRegistSalid: notificacionver?.fecRegistSalid ?? null,
    numEnvioTeu: notificacionver?.numEnvioTeu as number,
    bop: notificacionver?.bop,
    fecPubBop: notificacionver?.fecPubBop ?? null,
    numBop: notificacionver?.numBop,
    observacion: notificacionver?.observacion,
  }
  ui.ejerNotifi = String(notificacionver?.ejeNotif ?? '')
  ui.numeroNotifi = String(notificacionver?.numNotif ?? '')
  ui.fechNotifi = notificacionver?.fecNotif ?? null
  ui.dniNotifi = notificacionver?.personaEntidad?.numDocum || ''
  ui.desPerEntidNotifi = notificacionver?.personaEntidad?.desPerEntid || ''
}

export function resetEdicionNotificacion(
  ui: NotificacionDominioState & {
    fechaordenadafenvio: string
    fechaordenadafrecep: string
    fechaordenadafpubli: string
    fechaenvioTEU: string | null
  },
  lifecycle: { dniok: boolean },
): void {
  ui.creanotificacion = new CrearNotificacion()
  ui.ejerNotifi = ''
  ui.numeroNotifi = ''
  ui.fechNotifi = ''
  ui.dniNotifi = ''
  ui.desPerEntidNotifi = ''
  lifecycle.dniok = false
  ui.fechaordenadafenvio = ''
  ui.fechaordenadafrecep = ''
  ui.fechaordenadafpubli = ''
  ui.fechaenvioTEU = ''
  ui.modoVerNotificacion = false
}

export function nuevaConsultaDni(): ConsultaDni {
  return new ConsultaDni()
}

export interface CargarInteresadoNotificacionHost {
  creanotificacion: CrearNotificacion
  textoFormaNotif: string
  lifecycleFacade: { dniok: boolean }
  listarinteresadosdto: InteresadoListarDto[]
}

export function cargarDatosInteresadoNotificacion(
  host: CargarInteresadoNotificacionHost,
  dni: string,
): void {
  if (!dni) {
    host.creanotificacion.forNotif = 0
    host.textoFormaNotif = ''
    host.creanotificacion.idHisPerso = 0
    host.creanotificacion.idPerso = 0
    host.creanotificacion.dni = ''
    host.lifecycleFacade.dniok = false
    return
  }

  const interesado = host.listarinteresadosdto.find((inter) => inter.numDocumInter === dni)

  if (interesado) {
    host.creanotificacion.forNotif = interesado.tipForNotif || 0
    host.textoFormaNotif = interesado.tipForNotif === 0 ? 'Correo postal' : 'Telemática'
    host.creanotificacion.dni = dni

    if (interesado.perEntid) {
      const persona = Array.isArray(interesado.perEntid)
        ? interesado.perEntid[0]
        : interesado.perEntid
      if (persona) {
        host.creanotificacion.idHisPerso = persona.idHisPerso || 0
        host.creanotificacion.idPerso = persona.idPerso || 0
      }
    } else {
      host.creanotificacion.idHisPerso = interesado.idHisPerso || 0
      host.creanotificacion.idPerso = interesado.idPerso || 0
    }
    host.lifecycleFacade.dniok = true
  } else {
    host.lifecycleFacade.dniok = false
  }
}
