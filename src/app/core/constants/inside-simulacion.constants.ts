import { environment } from '../../../environments/environment'

/** Etiqueta unificada INSIDE dry-run (UI + diálogos). */
export const INSIDE_SIMULACION_BADGE = 'INSIDE simulación'
export const INSIDE_SIMULACION_TITLE = 'Sin acceso REDSARA: respuestas simuladas'
export const INSIDE_SIMULACION_HTML =
  '<p class="text-info"><strong>Modo simulación:</strong> sin acceso a REDSARA; la respuesta es mock.</p>'

export const INSIDE_ESTADOS_ENVIO = ['PENDIENTE', 'ENVIADO', 'SIMULADO', 'ERROR'] as const
export type InsideEstadoEnvio = (typeof INSIDE_ESTADOS_ENVIO)[number]

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
  { id: 'historial', label: 'Historial envíos SIMULADO', via: 'ficha INSIDE' },
  { id: 'archivar', label: 'Archivar (simulación iFlow)', via: 'ficha ciclo de vida' },
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

export function etiquetaInsideDryRunHtml(dryRun = isInsideDryRun()): string {
  return dryRun ? INSIDE_SIMULACION_HTML : ''
}

export function tituloInsideConSimulacion(titulo: string, dryRun = isInsideDryRun()): string {
  return dryRun ? `${titulo} (simulación)` : titulo
}
