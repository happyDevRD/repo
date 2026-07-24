export interface FechasNotificacionOrdenadas {
  fechaordenadafenvio: string
  fechaordenadafrecep: string
  fechaordenadafpubli: string
  fechaordenadafemision: string
}

export type FechaNotificacionRaw = string | Date | null | undefined

function aTextoFecha(valor: FechaNotificacionRaw): string | null {
  if (valor == null || valor === '') {
    return null
  }
  return typeof valor === 'string' ? valor : valor.toISOString()
}

export function calcularFechasNotificacion(
  fenvio: FechaNotificacionRaw,
  frecep: FechaNotificacionRaw,
  fpubli: FechaNotificacionRaw,
  femision: FechaNotificacionRaw,
): FechasNotificacionOrdenadas {
  const resultado: FechasNotificacionOrdenadas = {
    fechaordenadafenvio: '',
    fechaordenadafrecep: '',
    fechaordenadafpubli: '',
    fechaordenadafemision: '',
  }

  const envio = aTextoFecha(fenvio)
  const recep = aTextoFecha(frecep)
  const publi = aTextoFecha(fpubli)
  const emision = aTextoFecha(femision)

  if (!envio && !recep && !publi && !emision) {
    return resultado
  }

  if (envio) {
    resultado.fechaordenadafenvio = `${envio.substring(0, 4)}-${envio.substring(5, 7)}-${envio.substring(8, 10)}`
  }

  if (recep) {
    resultado.fechaordenadafrecep = `${recep.substring(8, 10)}-${recep.substring(5, 7)}-${recep.substring(0, 4)}`
  }

  if (publi) {
    resultado.fechaordenadafpubli = `${publi.substring(8, 10)}-${publi.substring(5, 7)}-${publi.substring(0, 4)}`
  }

  if (emision) {
    resultado.fechaordenadafemision = `${emision.substring(8, 10)}-${emision.substring(5, 7)}-${emision.substring(0, 4)}`
  }

  return resultado
}

export function formatearFechaNotificacionSeleccionada(fecNotif: FechaNotificacionRaw): string | undefined {
  const raw = aTextoFecha(fecNotif)
  if (!raw) {
    return undefined
  }
  return `${raw.substring(8, 10)}/${raw.substring(5, 7)}/${raw.substring(0, 4)}`
}
