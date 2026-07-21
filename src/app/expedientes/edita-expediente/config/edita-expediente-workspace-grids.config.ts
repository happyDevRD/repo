import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import { createColumnsListarNotifi } from '../notificaciones/notificaciones-grid-columns';
import { createNotificacionGridAdapter } from '../notificaciones/notificaciones-grid.config';
import { notificacionesGridRenderers } from '../notificaciones/notificaciones-grid-renderers';
import {
  createColumnsHistorico,
  createColumnsTareasProcedi,
  createColumnsTramitadores,
} from '../shared/edita-expediente-aux-grid-columns';
import {
  createDescripcionTareasRenderer,
  createNotiDniRenderer,
  createNotiNombreRenderer,
  createPlazoRenderer,
  editaExpedienteGridRenderers,
} from '../shared/edita-expediente-grid-renderers';
import { createColumnsTareasTramite } from '../tareas/tareas-grid-columns';
import { createTareaGridAdapter } from '../tareas/tareas-grid.config';
import { createHistoricoGridAdapter } from '../tareas/historico-grid.config';
import { createTramiteGridAdapter } from '../tramites/tramites-grid.config';
import { createColumnsTramite } from '../tramites/tramites-grid-columns';
import { createTramitadorGridAdapter } from '../tramitadores/tramitadores-grid.config';

export interface EditaExpedienteWorkspaceGridsContext {
  idExpediente: number;
  idTarea: number;
  getFecIniTarea: () => string;
  setNombreApe: (nombre: string) => void;
  getNombreApe: () => string;
  setDescripTarea: (value: unknown) => void;
}

export interface EditaExpedienteWorkspaceGridsBundle {
  columnsTramite: any[];
  sourceTramite: any;
  columnsTareasTramite: any[];
  sourceTareasTramite: any;
  columnsListarNotifi: any[];
  sourceListarNotifi: any;
  columnsTramitadores: any[];
  sourceTramitadores: any;
  columnsTareasProcedi: any[];
  sourceTareasProcedi: any;
  columnsHistorico: any[];
  sourceHistorico: any;
}

export const buildEditaExpedienteWorkspaceGrids = (
  context: EditaExpedienteWorkspaceGridsContext,
): EditaExpedienteWorkspaceGridsBundle => {
  const columnrenderer = editaExpedienteGridRenderers.columnrenderer;
  const columnrendererDescarga = editaExpedienteGridRenderers.columnrendererDescarga;
  const columnseleccion = editaExpedienteGridRenderers.columnseleccionTramite;
  const columnseleccionTareaProcedi = editaExpedienteGridRenderers.columnseleccionTareaProcedi;
  const columnseleccionDEscargaHistorico = editaExpedienteGridRenderers.columnseleccionDescargaHistorico;
  const columnseleccionTareaTramite = GridRadioSelector.createRadioRenderer(
    'TareasTramite',
    'Selecciona Tarea del Trámite',
    true,
  );
  const columnseleccionListarNotifi = notificacionesGridRenderers.columnseleccionListarNotifi;

  const cellsrenderer = editaExpedienteGridRenderers.cellsrendererCentrado;
  const cellsrendererTramiteTarea = editaExpedienteGridRenderers.cellsrendererTramiteTarea;
  const cellsrendererTRamitadores = editaExpedienteGridRenderers.cellsrendererTramitadores;
  const cellsrendererTRamitadoresPosesion = editaExpedienteGridRenderers.cellsrendererTramitadoresPosesion;
  const cellsrendererPlazo = createPlazoRenderer(context.getFecIniTarea);
  const cellsrendererTramite = editaExpedienteGridRenderers.cellsrendererTramite;
  const cellsrendererNotiDNI = createNotiDniRenderer(context.setNombreApe);
  const cellsrendererNotiNombre = createNotiNombreRenderer(context.getNombreApe);
  const cellsrendererDEscripTareas = createDescripcionTareasRenderer(context.setDescripTarea);
  const cellsrendererContieneArchivo = editaExpedienteGridRenderers.cellsrendererContieneArchivo;
  const cellsrendererArchivo = editaExpedienteGridRenderers.cellsrendererArchivo;
  const cellsrendererColor = editaExpedienteGridRenderers.cellsrendererColor;
  const cellsrendererFecha = editaExpedienteGridRenderers.cellsrendererFecha;
  const cellsrendererFechaHistorico = editaExpedienteGridRenderers.cellsrendererFechaHistorico;
  const cellsrendererFechaPlazo = editaExpedienteGridRenderers.cellsrendererFechaPlazo;
  const cellsrendererFechaTRamitadores = editaExpedienteGridRenderers.cellsrendererFechaTramitadores;

  return {
    columnsTramite: createColumnsTramite({
      columnseleccion,
      columnrenderer,
      cellsrenderer,
      cellsrendererDEscripTareas,
      cellsrendererTramite,
      cellsrendererFecha,
    }),
    sourceTramite: createTramiteGridAdapter(context.idExpediente),
    columnsTareasTramite: createColumnsTareasTramite({
      columnseleccionTareaTramite,
      columnrenderer,
      columnrendererDescarga,
      cellsrendererTramiteTarea,
      cellsrendererFecha,
      cellsrendererFechaPlazo,
      cellsrendererColor,
      cellsrendererContieneArchivo,
      cellsrendererArchivo,
      cellsrendererPlazo,
    }),
    sourceTareasTramite: createTareaGridAdapter(0),
    columnsListarNotifi: createColumnsListarNotifi({
      columnseleccionListarNotifi,
      columnrenderer,
      columnrendererDescarga,
      cellsrendererListarNotifi: notificacionesGridRenderers.cellsrendererListarNotifi,
      cellsrendererFechaListarNotifi: notificacionesGridRenderers.cellsrendererFechaListarNotifi,
      cellsrendererListarNotifiSituacionSimple: notificacionesGridRenderers.cellsrendererListarNotifiSituacionSimple,
      cellsrendererListarNotifiBOPSimple: notificacionesGridRenderers.cellsrendererListarNotifiBOPSimple,
      cellsrendererNotiDNI,
      cellsrendererNotiNombre,
      cellsrendererAccionesNotificacion: notificacionesGridRenderers.cellsrendererAccionesNotificacion,
    }),
    sourceListarNotifi: createNotificacionGridAdapter(0, 0),
    columnsTramitadores: createColumnsTramitadores({
      columnrenderer,
      cellsrendererTRamitadores,
      cellsrendererFechaTRamitadores,
      cellsrendererTRamitadoresPosesion,
    }),
    sourceTramitadores: createTramitadorGridAdapter(context.idExpediente),
    columnsTareasProcedi: createColumnsTareasProcedi({
      columnseleccionTareaProcedi,
      columnrenderer,
      cellsrendererTRamitadores,
    }),
    sourceTareasProcedi: null,
    columnsHistorico: createColumnsHistorico({
      columnseleccionTareaProcedi,
      columnseleccionDEscargaHistorico,
      columnrenderer,
      cellsrendererTRamitadores,
      cellsrendererFechaHistorico,
    }),
    sourceHistorico: createHistoricoGridAdapter(context.idTarea),
  };
};
