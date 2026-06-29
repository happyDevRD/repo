import { INICIO_GRID_RENDERERS as R } from './inicio-grid-renderers';

const renderer = R.columnrenderer;
const center = { align: 'center' as const, cellsalign: 'center' as const };
const left = { align: 'left' as const, cellsalign: 'left' as const };

export const DASHBOARD_SOLICITUDES_COLUMNS = [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'idExpediente', datafield: 'idExpediente', width: '1%', hidden: true },
  { text: 'Ejercicio', datafield: 'ejercicio', width: '7%', cellsrenderer: R.cellsrenderer, renderer, ...center },
  { text: 'Número', datafield: 'numero', width: '7%', cellsrenderer: R.cellsrenderer, renderer, ...center },
  { text: 'Fecha Solicitud', datafield: 'fecInicio', width: '11%', cellsrenderer: R.cellsrendererSolicitudFecha, renderer, ...center },
  { text: 'Asunto', datafield: 'asunto', width: '20%', cellsrenderer: R.cellsrendererSolicitudAsunto, renderer, ...left },
  { text: 'Estado', datafield: 'estado', width: '9%', cellsrenderer: R.cellsrenderer, renderer, ...center },
  { text: 'Asignado a', datafield: 'usuario', width: '10%', cellsrenderer: R.cellsrenderer, renderer, ...center },
  { text: 'Interesado', datafield: 'personaEntidad', width: '18%', cellsrenderer: R.cellsrendererSolicitudInteresado, renderer, ...left },
  { text: 'N. Registro', datafield: 'ejeNumRegis', width: '9%', cellsrenderer: R.cellsrenderer, renderer, ...center },
  { text: 'Expediente', datafield: 'expediente', width: '9%', cellsrenderer: R.cellsrendererSolicitudExpediente, renderer, ...center },
];

export const DASHBOARD_SOLICITUDES_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'fecInicio', type: 'any' },
  { name: 'asunto', type: 'any' },
  { name: 'numDocum', type: 'any' },
  { name: 'estado', type: 'any' },
  { name: 'usuario', type: 'any' },
  { name: 'expediente', type: 'any' },
  { name: 'personaEntidad', type: 'any' },
  { name: 'ejeNumRegis', type: 'any' },
  { name: 'numero', type: 'any' },
  { name: 'ejercicio', type: 'any' },
  { name: 'idExpediente', type: 'any' },
  { name: 'nomRepre', type: 'any' },
  { name: 'idRepre', type: 'any' },
  { name: 'idHisRepre', type: 'any' },
  { name: 'dirRepre', type: 'any' },
];

export const DASHBOARD_EXPEDIENTES_COLUMNS = [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'Ejercicio', width: '10%', datafield: 'ejercicio', cellsrenderer: R.cellsrendererExpInstructor, renderer, ...center },
  { text: 'Número', width: '10%', datafield: 'numero', cellsrenderer: R.cellsrendererExpInstructor, renderer, ...center },
  { text: 'Título', width: '50%', datafield: 'titulo', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Estado', width: '15%', datafield: 'estado', cellsrenderer: R.cellsrendererExpInstructor, renderer, ...center },
  { text: 'Fecha inicio', width: '12%', datafield: 'fecInicio', cellsrenderer: R.cellsrendererSolicitudFecha, renderer, ...center },
];

export const DASHBOARD_EXPEDIENTES_DATA_FIELDS = [
  { name: 'numero', type: 'number' },
  { name: 'ejercicio', type: 'number' },
  { name: 'titulo', type: 'string' },
  { name: 'id', type: 'any' },
  { name: 'estado', type: 'string' },
  { name: 'fecInicio', type: 'string' },
];

export const DASHBOARD_TAREAS_COLUMNS = [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
  { text: 'Ejerc. Exp.', width: '7%', datafield: 'ejeExped', cellsrenderer: R.cellsrendererTareaExpedi, renderer, ...center },
  { text: 'Núm. Exp.', width: '7%', datafield: 'numExped', cellsrenderer: R.cellsrendererTareaExpedi, renderer, ...center },
  { text: 'Nº Tarea', width: '7%', datafield: 'numero', cellsrenderer: R.cellsrendererTareaExpedi, renderer, ...center },
  { text: 'Descripción Tarea', width: '14%', datafield: 'descripcion', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Descripción Trámite', width: '14%', datafield: 'desTramite', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Fecha Tarea', width: '8%', datafield: 'fecInicio', cellsrenderer: R.cellsrendererFecha, renderer, ...center },
  { text: 'F. Finalización', width: '9%', datafield: 'fecFin', cellsrenderer: R.cellsrendererFecha, renderer, ...center },
  { text: 'F. Plazo', width: '7%', datafield: 'fecPlazo', cellsrenderer: R.cellsrendererFechaPlazo, renderer, ...center },
  { text: 'Estado', width: '5%', datafield: 'color', cellsrenderer: R.cellsrendererColor, renderer: R.columnrendererDescarga, ...center },
  { text: 'Archivo', width: '5%', datafield: 'archivo', cellsrenderer: R.cellsrendererContieneArchivo, renderer, ...center },
  { text: 'Nom. archivo', width: '10%', datafield: 'nombreArchivo', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
  { text: 'Firmado', width: '5%', datafield: 'firmado', cellsrenderer: R.cellsrendererArchivo, renderer: R.columnrendererDescarga, ...center },
  { text: 'Propuesta', width: '5%', datafield: 'propuestaResolucion', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
  { text: 'Salida', width: '6%', datafield: 'numRegis', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
  { text: 'Notif.', width: '6%', datafield: 'ejeNumNotif', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
  { text: 'Tablón', width: '5%', datafield: 'idAnunc', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
  { text: 'Usuario', width: '5%', datafield: 'usuario', cellsrenderer: R.cellsrendererTramiteTarea, renderer, ...center },
];

export const DASHBOARD_TAREAS_DATA_FIELDS = [
  { name: 'numero', type: 'number' },
  { name: 'descripcion', type: 'string' },
  { name: 'fecInicio', type: 'string' },
  { name: 'fecFin', type: 'string' },
  { name: 'propuestaResolucion', type: 'string' },
  { name: 'usuario', type: 'string' },
  { name: 'firmado', type: 'string' },
  { name: 'fecPlazo', type: 'string' },
  { name: 'color', type: 'string' },
  { name: 'archivo', type: 'string' },
  { name: 'ejeExped', type: 'string' },
  { name: 'numExped', type: 'string' },
  { name: 'titulo', type: 'string' },
  { name: 'tareaProcedimiento', type: 'any' },
  { name: 'id', type: 'any' },
  { name: 'tipAnexo', type: 'any' },
  { name: 'docAport', type: 'any' },
  { name: 'tipDocEni', type: 'any' },
  { name: 'documentacion', type: 'any' },
  { name: 'visible', type: 'any' },
  { name: 'numRegis', type: 'any' },
  { name: 'idHisDocum', type: 'any' },
  { name: 'ejeNumNotif', type: 'any' },
  { name: 'nombreArchivo', type: 'any' },
  { name: 'idAnunc', type: 'any' },
  { name: 'desTramite', type: 'any' },
];

export const DASHBOARD_FIRMAS_COLUMNS = [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'Ejercicio', width: '8%', datafield: 'ejeExped', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Número', width: '8%', datafield: 'numExped', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Nº Tarea', width: '8%', datafield: 'numero', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Título expediente', width: '22%', datafield: 'titulo', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Descripción', width: '22%', datafield: 'descripcion', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Archivo', width: '18%', datafield: 'nombreArchivo', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Firmante', width: '12%', datafield: 'firmante', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
];

export const DASHBOARD_FIRMAS_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'numero', type: 'any' },
  { name: 'descripcion', type: 'string' },
  { name: 'nombreArchivo', type: 'string' },
  { name: 'firmante', type: 'string' },
  { name: 'ejeExped', type: 'any' },
  { name: 'numExped', type: 'any' },
  { name: 'titulo', type: 'string' },
];

export const DASHBOARD_NOTIFICACIONES_COLUMNS = [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'notificacion', datafield: 'notificacion', width: '1%', hidden: true },
  { text: 'Ejercicio', width: '9%', datafield: 'ejeExped', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Número', width: '9%', datafield: 'numExped', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Nº Tarea', width: '9%', datafield: 'numero', cellsrenderer: R.cellsrendererNotificacion, renderer, ...center },
  { text: 'Título expediente', width: '28%', datafield: 'titulo', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
  { text: 'Descripción', width: '38%', datafield: 'descripcion', cellsrenderer: R.cellsrendererDashboardTextLeft, renderer, ...left },
];

export const DASHBOARD_NOTIFICACIONES_DATA_FIELDS = [
  { name: 'id', type: 'any' },
  { name: 'numero', type: 'any' },
  { name: 'descripcion', type: 'string' },
  { name: 'notificacion', type: 'any' },
  { name: 'ejeExped', type: 'any' },
  { name: 'numExped', type: 'any' },
  { name: 'titulo', type: 'string' },
];
