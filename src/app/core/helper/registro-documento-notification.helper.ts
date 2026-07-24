import { NotificationService } from '../service/notification.service'
import { extraerHoraDesdeISO, formatearFechaDDMMYYYY } from './fecha-legacy.helper'

export interface RegistroDocumentoNotificacion {
  ejeRegis: unknown
  numRegis: unknown
  extracto: string
  fecRegis: unknown
}

export const mostrarRegistroDocumento = (
  registrodocumento: RegistroDocumentoNotificacion,
  notificationService: NotificationService,
): Promise<unknown> => {
  const ejercicio = registrodocumento.ejeRegis
  const numero = registrodocumento.numRegis
  const extracto = registrodocumento.extracto
  const fecha = registrodocumento.fecRegis
  const fechaordenada = formatearFechaDDMMYYYY(fecha)
  const hora = extraerHoraDesdeISO(fecha)

  return notificationService.custom({
    title: '<strong><u>Registro de Documentos</u></strong>',
    html: `
    <h4><strong> NÚMERO:</strong> ${ejercicio}/${numero} </h4>
    <h4> <strong> EXTRACTO:</strong> ${extracto} </h4>
    <h4> <strong> FECHA REGISTRO:</strong> ${fechaordenada}  ${hora}</h4>
    `,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
  })
}
