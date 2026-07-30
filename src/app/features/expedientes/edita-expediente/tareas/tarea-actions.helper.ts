import { ModalAction } from '../../../../shared/modals/modal-action.model'
import { fromVisibilityMap } from '../../../../shared/modals/modal-actions.util'

/** Contexto UI de la toolbar de tareas del trámite (flags legacy). */
export interface TareaToolbarContext {
  botonNuevaTareaTramite: boolean
  verAccionesdeTarea: boolean
  veoBorrar: boolean
  borrarconfirma: boolean
  verAbreArchivo: boolean
  verxml: boolean
  veoXml: boolean
  /** Legacy invertido: true = botón Convertir PDF deshabilitado. */
  veoconviertePDF: boolean
  /** Legacy invertido: false = spinner de conversión visible. */
  spinnervisible: boolean
  veoMetadatos: boolean
  insideEnviando: boolean
  tareayafirmada: boolean
  firmaDesatendida: boolean
  firmaAtendida: boolean
  /** Legacy invertido: true = ocultar botón Firma Atendida. */
  veoFirmaAtendida: boolean
  /** Legacy invertido: true = ocultar botón Firma Desatendida. */
  veoFirmaDEsatendida: boolean
  veoDocOriginal: boolean
  /** Legacy invertido: false = spinner de firma visible. */
  spinnervisiblefirma: boolean
  veoPropuestaResolucion: boolean
  veoNotificacion: boolean
  veoGenerarSalida: boolean
  veoFinalizar: boolean
}

export const TAREA_ACTION_IDS = [
  'nuevaTarea',
  'borrarTarea',
  'descargaXml',
  'conviertePDF',
  'metadatos',
  'enviarInside',
  'altaXmlDoc',
  'docFirmado',
  'descargarDocumento',
  'docOriginal',
  'firmaAtendida',
  'firmaDesatendida',
  'propuestaResolucion',
  'crearNotificacion',
  'generarSalida',
  'tablonAnuncios',
  'finalizarTarea',
] as const

export type TareaActionId = (typeof TAREA_ACTION_IDS)[number]

/** Acciones rápidas en la fila del objeto (como soli-doc__actions). */
export const TAREA_ROW_ACTION_IDS = [
  'docFirmado',
  'descargarDocumento',
  'docOriginal',
  'finalizarTarea',
  'borrarTarea',
] as const

export type TareaRowActionId = (typeof TAREA_ROW_ACTION_IDS)[number]

const TAREA_ROW_ACTION_ID_SET = new Set<string>(TAREA_ROW_ACTION_IDS)

const TAREA_ACTION_DEFS: ReadonlyArray<Omit<ModalAction, 'visible' | 'disabled' | 'busy'>> = [
  { id: 'nuevaTarea', label: 'Nueva tarea', icon: 'bi bi-plus-lg', tone: 'primary', order: 1, title: 'Nueva tarea' },
  { id: 'borrarTarea', label: 'Borrar tarea', icon: 'bi bi-trash', tone: 'danger', order: 2, title: 'Borrar tarea del trámite', iconOnly: true },
  { id: 'descargaXml', label: 'Modelo TEU', icon: 'bi bi-cloud-arrow-down', tone: 'primary', order: 10, title: 'Descargar Modelo TEU' },
  { id: 'conviertePDF', label: 'Convertir a PDF', icon: 'bi bi-file-earmark-pdf', tone: 'primary', order: 20, title: 'Convertir a PDF' },
  { id: 'metadatos', label: 'Datos ENI', icon: 'bi bi-chat-left-quote', tone: 'primary', order: 30, title: 'Datos ENI' },
  { id: 'enviarInside', label: 'Enviar INSIDE', icon: 'bi bi-cloud-upload', tone: 'primary', order: 40, title: 'Enviar documento a INSIDE' },
  { id: 'altaXmlDoc', label: 'Alta XML Doc.', icon: 'bi bi-file-earmark-code', tone: 'primary', order: 50, title: 'Alta documento ENI XML desde disco' },
  { id: 'docFirmado', label: 'Doc. Firmado', icon: 'bi bi-eye', tone: 'secondary', order: 60, title: 'Documento Firmado', iconOnly: true },
  { id: 'descargarDocumento', label: 'Descargar Documento', icon: 'bi bi-download', tone: 'secondary', order: 70, title: 'Descargar Documento Firmado', iconOnly: true },
  { id: 'docOriginal', label: 'Doc. Original', icon: 'bi bi-download', tone: 'secondary', order: 80, title: 'Descargar Documento Original', iconOnly: true },
  { id: 'firmaAtendida', label: 'Firma Atendida', icon: 'bi bi-pen', tone: 'primary', order: 90, title: 'Firmar Digitalmente' },
  { id: 'firmaDesatendida', label: 'Firma Desatendida', icon: 'bi bi-pen', tone: 'primary', order: 100, title: 'Firmar Digitalmente' },
  { id: 'propuestaResolucion', label: 'Prop. Resolución', icon: 'bi bi-award', tone: 'primary', order: 110, title: 'Generar Propuesta Resolución' },
  { id: 'crearNotificacion', label: 'Crear Notificación', icon: 'bi bi-bell', tone: 'primary', order: 120, title: 'Crear Notificación' },
  { id: 'generarSalida', label: 'Generar Salida', icon: 'bi bi-send', tone: 'primary', order: 130, title: 'Generar Salida' },
  { id: 'tablonAnuncios', label: 'Tablón de Anuncios', icon: 'bi bi-megaphone', tone: 'primary', order: 140, title: 'Tablón de Anuncios' },
  { id: 'finalizarTarea', label: 'Finalizar Tarea', icon: 'bi bi-check-circle', tone: 'primary', order: 150, title: 'Finalizar Tarea', iconOnly: true },
]

function buildTareaVisibility(ctx: TareaToolbarContext): Record<string, boolean> {
  const archivo = !!ctx.verAbreArchivo
  const acciones = !!ctx.verAccionesdeTarea

  return {
    nuevaTarea: !!ctx.botonNuevaTareaTramite,
    borrarTarea: !!(acciones && ctx.veoBorrar && ctx.borrarconfirma),
    descargaXml: !!(acciones && archivo && ctx.verxml && ctx.veoXml),
    conviertePDF: !!(acciones && archivo),
    metadatos: !!(acciones && archivo && ctx.veoMetadatos),
    enviarInside: !!(acciones && archivo),
    altaXmlDoc: !!(acciones && archivo),
    docFirmado: !!(acciones && archivo && !ctx.tareayafirmada && !ctx.firmaDesatendida),
    descargarDocumento: !!(acciones && archivo && ctx.firmaDesatendida),
    docOriginal: !!(acciones && archivo && !ctx.firmaDesatendida && ctx.veoDocOriginal),
    firmaAtendida: !!(acciones && ctx.tareayafirmada && ctx.firmaAtendida && !ctx.veoFirmaAtendida),
    firmaDesatendida: !!(acciones && ctx.tareayafirmada && ctx.firmaDesatendida && !ctx.veoFirmaDEsatendida),
    propuestaResolucion: !!(acciones && ctx.veoPropuestaResolucion),
    crearNotificacion: !!(acciones && ctx.veoNotificacion),
    generarSalida: !!(acciones && ctx.veoGenerarSalida),
    tablonAnuncios: !!(acciones && ctx.veoGenerarSalida),
    finalizarTarea: !!(acciones && ctx.veoFinalizar),
  }
}

function applyTareaActionState(actions: ModalAction[], ctx: TareaToolbarContext): ModalAction[] {
  return actions.map((action) => {
    if (action.id === 'conviertePDF') {
      return {
        ...action,
        disabled: !!ctx.veoconviertePDF,
        busy: !ctx.spinnervisible,
      }
    }
    if (action.id === 'enviarInside' || action.id === 'altaXmlDoc') {
      return { ...action, disabled: !!ctx.insideEnviando }
    }
    if (action.id === 'firmaAtendida') {
      return { ...action, busy: !ctx.spinnervisiblefirma }
    }
    return action
  })
}

export function resolveTareaHeaderActions(ctx: TareaToolbarContext): ModalAction[] {
  const visibility = buildTareaVisibility(ctx)
  return fromVisibilityMap(
    TAREA_ACTION_DEFS.filter((def) => def.id === 'nuevaTarea'),
    visibility,
  )
}

/** Acciones rápidas de la fila seleccionada (documento / finalizar / borrar). */
export function resolveTareaRowActions(ctx: TareaToolbarContext): ModalAction[] {
  const visibility = buildTareaVisibility(ctx)
  return applyTareaActionState(
    fromVisibilityMap(
      TAREA_ACTION_DEFS.filter((def) => TAREA_ROW_ACTION_ID_SET.has(def.id)),
      visibility,
    ),
    ctx,
  )
}

export function resolveTareaToolbarActions(ctx: TareaToolbarContext): ModalAction[] {
  const visibility = buildTareaVisibility(ctx)
  return applyTareaActionState(
    fromVisibilityMap(
      TAREA_ACTION_DEFS.filter(
        (def) => def.id !== 'nuevaTarea' && !TAREA_ROW_ACTION_ID_SET.has(def.id),
      ),
      visibility,
    ),
    ctx,
  )
}
