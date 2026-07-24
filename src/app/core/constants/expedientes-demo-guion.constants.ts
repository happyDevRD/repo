/**
 * Guion presentación (tabla + pestañas Tramitación / INSIDE).
 * Front development dryRun=true · Back perfil dev dry-run=true.
 */
export const EXPEDIENTES_DEMO_GUION = [
  {
    paso: 1,
    accion: 'Abrir /expedientes y seleccionar fila',
    esperado: 'Barra con pestañas Tramitación | INSIDE; botones según estado',
  },
  {
    paso: 2,
    accion: 'Pestaña Tramitación → Tramitar',
    esperado: 'Workspace clásico del expediente',
  },
  {
    paso: 3,
    accion: 'Volver al listado → Cerrar (si aplica)',
    esperado: 'Oferta post-cierre INSIDE en simulación',
  },
  {
    paso: 4,
    accion: 'Pestaña INSIDE → Enviar alta XML o Panel INSIDE',
    esperado: 'Respuesta mock + historial SIMULADO',
  },
  {
    paso: 5,
    accion: 'Mencionar cutover REDSARA',
    esperado: 'Mismo flujo; dryRun=false cuando den red',
  },
] as const
