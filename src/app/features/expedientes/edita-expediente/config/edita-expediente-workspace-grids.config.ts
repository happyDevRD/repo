import {
  IflowGridColumns,
  IflowGridSource,
} from '../../../../shared/components/iflow-grid/iflow-grid.types';
import { GridRadioSelector } from '../../../../core/helper/grid-radio-selector';
import {
  createColumnsHistorico,
  createColumnsTareasProcedi,
} from '../shared/edita-expediente-aux-grid-columns';
import {
  createPlazoRenderer,
  editaExpedienteGridRenderers,
} from '../shared/edita-expediente-grid-renderers';
import { createColumnsTareasTramite } from '../tareas/tareas-grid-columns';
import { createTareaGridAdapter } from '../tareas/tareas-grid.config';
import { createHistoricoGridAdapter } from '../tareas/historico-grid.config';

export interface EditaExpedienteWorkspaceGridsContext {
  idExpediente: number;
  idTarea: number;
  getFecIniTarea: () => string;
}

export interface EditaExpedienteWorkspaceGridsBundle {
  columnsTareasTramite: IflowGridColumns;
  sourceTareasTramite: IflowGridSource;
  columnsTareasProcedi: IflowGridColumns;
  sourceTareasProcedi: IflowGridSource;
  columnsHistorico: IflowGridColumns;
  sourceHistorico: IflowGridSource;
}

export const buildEditaExpedienteWorkspaceGrids = (
  context: EditaExpedienteWorkspaceGridsContext,
): EditaExpedienteWorkspaceGridsBundle => {
  const columnrenderer = editaExpedienteGridRenderers.columnrenderer;
  const columnrendererDescarga = editaExpedienteGridRenderers.columnrendererDescarga;
  const columnseleccionTareaProcedi = editaExpedienteGridRenderers.columnseleccionTareaProcedi;
  const columnseleccionDEscargaHistorico = editaExpedienteGridRenderers.columnseleccionDescargaHistorico;
  const columnseleccionTareaTramite = GridRadioSelector.createRadioRenderer(
    'TareasTramite',
    'Selecciona Tarea del Trámite',
    true,
  );

  const cellsrendererTramiteTarea = editaExpedienteGridRenderers.cellsrendererTramiteTarea;
  const cellsrendererTRamitadores = editaExpedienteGridRenderers.cellsrendererTramitadores;
  const cellsrendererPlazo = createPlazoRenderer(context.getFecIniTarea);
  const cellsrendererContieneArchivo = editaExpedienteGridRenderers.cellsrendererContieneArchivo;
  const cellsrendererArchivo = editaExpedienteGridRenderers.cellsrendererArchivo;
  const cellsrendererColor = editaExpedienteGridRenderers.cellsrendererColor;
  const cellsrendererFecha = editaExpedienteGridRenderers.cellsrendererFecha;
  const cellsrendererFechaHistorico = editaExpedienteGridRenderers.cellsrendererFechaHistorico;
  const cellsrendererFechaPlazo = editaExpedienteGridRenderers.cellsrendererFechaPlazo;

  return {
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
