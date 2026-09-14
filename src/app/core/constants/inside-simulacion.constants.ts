import { environment } from '../../../environments/environment'

/**
 * Etiquetas INSIDE dry-run.
 * El modo simulación/producción se define solo por configuración (environment / Quarkus).
 * No se muestran textos de «simulación» al usuario (demo transparente).
 */
export const INSIDE_SIMULACION_BADGE = ''
export const INSIDE_SIMULACION_TITLE = ''
export const INSIDE_SIMULACION_HTML = ''

export const INSIDE_ESTADOS_ENVIO = ['PENDIENTE', 'ENVIADO', 'SIMULADO', 'PARCIAL', 'ERROR'] as const
export type InsideEstadoEnvio = (typeof INSIDE_ESTADOS_ENVIO)[number]

/** Etiqueta visible de estado de envío (SIMULADO → ENVIADO; resto tal cual). */
export function etiquetaEstadoEnvioInside(estado: string | null | undefined): string {
  const value = String(estado ?? '').toUpperCase()
  if (value === 'SIMULADO') {
    return 'ENVIADO'
  }
  if (!value) {
    return '—'
  }
  return value
}

/** Modificador de `estado-badge` según el estado de envío INSIDE. */
export function insideEstadoBadgeClass(estado: string | null | undefined): string {
  switch (String(estado ?? '').toUpperCase()) {
    case 'PENDIENTE':
      return 'estado-badge--pendiente'
    case 'PARCIAL':
      return 'estado-badge--parcial'
    case 'ENVIADO':
    case 'SIMULADO':
      return 'estado-badge--enviado'
    case 'ERROR':
      return 'estado-badge--error'
    default:
      return 'estado-badge--cerrado'
  }
}

/** Texto corto de badge en cabecera/listado. */
export function etiquetaCortaEstadoInside(estado: string | null | undefined): string {
  switch (String(estado ?? '').toUpperCase()) {
    case 'PENDIENTE':
      return 'pendiente'
    case 'PARCIAL':
      return 'parcial'
    case 'ENVIADO':
    case 'SIMULADO':
      return 'enviado'
    case 'ERROR':
      return 'error'
    default:
      return ''
  }
}

const OPS_REMISION = new Set([
  'remisionAJusticia',
  'consultaEstadoRemisionAJusticia',
])

const OPS_EXPEDIENTE = new Set([
  'convertirExpedienteAEniConMAdicionales',
  'altaExpedienteEniXml',
  'convertirExpedienteAEni',
])

function esExitoEnvioInside(estado: string | null | undefined): boolean {
  const value = String(estado ?? '').toUpperCase()
  return value === 'ENVIADO' || value === 'SIMULADO'
}

/**
 * Misma semántica que el backend: ENVIADO solo con ops de expediente;
 * documento → PARCIAL. Usar cuando el API no envía estadoResumen (backend antiguo).
 */
export function calcularEstadoResumenInside(
  envios: Array<{
    idTarea?: number | null
    operacion?: string | null
    estadoEnvio?: string | null
  }>,
): string {
  if (!envios?.length) {
    return ''
  }

  const relevantes = envios.filter((e) => !OPS_REMISION.has(String(e.operacion ?? '')))
  if (!relevantes.length) {
    return ''
  }

  const exitoExpediente = relevantes.find((e) =>
    e.idTarea == null
    && OPS_EXPEDIENTE.has(String(e.operacion ?? ''))
    && esExitoEnvioInside(e.estadoEnvio),
  )
  if (exitoExpediente) {
    return String(exitoExpediente.estadoEnvio ?? 'ENVIADO').toUpperCase()
  }

  const ultimo = relevantes[0]
  if (String(ultimo.estadoEnvio ?? '').toUpperCase() === 'ERROR') {
    return 'ERROR'
  }

  const hayDoc = relevantes.some((e) => e.idTarea != null && esExitoEnvioInside(e.estadoEnvio))
  if (hayDoc) {
    return 'PARCIAL'
  }

  if (relevantes.some((e) => String(e.estadoEnvio ?? '').toUpperCase() === 'PENDIENTE')) {
    return 'PENDIENTE'
  }

  // Último envío con tarea y éxito, aunque el listado venga sin orden claro
  if (ultimo.idTarea != null && esExitoEnvioInside(ultimo.estadoEnvio)) {
    return 'PARCIAL'
  }

  return ''
}

/** Mapa idTarea → último estado a partir del historial (fallback si /por-tarea 404). */
export function mapEstadosPorTareaInside(
  envios: Array<{ idTarea?: number | null, estadoEnvio?: string | null, operacion?: string | null }>,
): Record<number, string> {
  const result: Record<number, string> = {}
  for (const envio of envios ?? []) {
    if (envio.idTarea == null) {
      continue
    }
    if (OPS_REMISION.has(String(envio.operacion ?? ''))) {
      continue
    }
    if (result[envio.idTarea] != null) {
      continue
    }
    if (envio.estadoEnvio) {
      result[envio.idTarea] = envio.estadoEnvio
    }
  }
  return result
}

/** Matriz de validación demo (Fase 3) — marcar en presentación. */
export const INSIDE_DEMO_MATRIZ = [
  { id: 'validar', label: 'Validar expediente INSIDE', via: 'ficha / edita header' },
  { id: 'convertir-exp', label: 'Convertir expediente ENI', via: 'edita header' },
  { id: 'alta-xml-exp', label: 'Alta XML expediente', via: 'ficha INSIDE / listado' },
  { id: 'alta-xml-doc', label: 'Alta XML documento', via: 'edita toolbar tarea' },
  { id: 'remision', label: 'Remisión Justicia', via: 'edita modal' },
  { id: 'consulta-atea', label: 'Consulta estado ATEA', via: 'edita remisión' },
  { id: 'pendientes', label: 'Filtro pendientes INSIDE', via: 'listado' },
  { id: 'post-cierre', label: 'Oferta envío tras cierre', via: 'cerrar expediente' },
  { id: 'historial', label: 'Historial envíos', via: 'ficha INSIDE' },
  { id: 'archivar', label: 'Archivar', via: 'ficha ciclo de vida' },
] as const

/**
 * Cutover REDSARA (Fase 4) — cuando den red real:
 * 1. Front prod: environment.inside.dryRun = false
 * 2. Back: inside.soap.dry-run=false (quitar perfil dev o override)
 * 3. Activar mTLS / credenciales si aplica
 * 4. Sustituir Archivar simulado por integración SARA
 * 5. Smoke test: validar + alta XML + remisión reales
 * Rollback: volver dryRun=true en ambos lados
 */
export const INSIDE_CUTOVER_REDSARA_STEPS = [
  'Apagar dryRun en environment de producción',
  'Apagar inside.soap.dry-run en Quarkus',
  'Configurar endpoints/credenciales REDSARA',
  'Reemplazar Archivar mock por SARA real',
  'Smoke test en red real',
] as const

export function isInsideDryRun(): boolean {
  return environment.inside?.dryRun === true
}

/** Sin HTML visible: el dry-run no se anuncia en diálogos. */
export function etiquetaInsideDryRunHtml(_dryRun = isInsideDryRun()): string {
  return ''
}

/** Título sin sufijo de simulación (modo transparente al usuario). */
export function tituloInsideConSimulacion(titulo: string, _dryRun = isInsideDryRun()): string {
  return titulo
}
