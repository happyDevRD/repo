import {
  IflowGridCellsRenderer,
  IflowGridColumns,
} from '../../../../shared/components/iflow-grid/iflow-grid.types'

type GridRenderer = IflowGridCellsRenderer

export interface TareaProcediGridColumnRenderers {
  columnseleccionTareaProcedi: GridRenderer;
  columnrenderer: GridRenderer;
  cellsrendererTRamitadores: GridRenderer;
}

export function createColumnsTareasProcedi(r: TareaProcediGridColumnRenderers): IflowGridColumns {
  return [
    { text: 'Id', datafield: 'id', width: '1%', hidden: true },
    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: r.columnseleccionTareaProcedi,
      renderer: r.columnrenderer,
    },
    {
      text: 'procedimiento',
      datafield: 'procedimiento',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Fase Tarea',
      datafield: 'faseTarea',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    { text: 'Plazo', datafield: 'plazo', cellsrenderer: r.cellsrendererTRamitadores, renderer: r.columnrenderer },
    {
      text: 'Tipo Plazo',
      datafield: 'tipoPlazo',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'tareaAutomatica',
      datafield: 'tareaAutomatica',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'plantillaDefectoModulo',
      datafield: 'plantillaDefectoModulo',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Plantilla Defecto',
      datafield: 'plantillaDefecto',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'procesoFirmadoDefecto',
      datafield: 'procesoFirmadoDefecto',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Usuario Control',
      datafield: 'usuContr',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'fecContr',
      datafield: 'fecContr',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'acciones',
      datafield: 'accion',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
  ];
}

export interface HistoricoGridColumnRenderers {
  columnseleccionTareaProcedi: GridRenderer;
  columnseleccionDEscargaHistorico: GridRenderer;
  columnrenderer: GridRenderer;
  cellsrendererTRamitadores: GridRenderer;
  cellsrendererFechaHistorico: GridRenderer;
}

export function createColumnsHistorico(r: HistoricoGridColumnRenderers): IflowGridColumns {
  return [
    { text: 'Id', datafield: 'id', width: '1%', hidden: true },
    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: r.columnseleccionTareaProcedi,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'idTarea',
      datafield: 'idTarea',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Nº tarea',
      width: '5%',
      datafield: 'numTarea',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha de Tarea',
      width: '8%',
      datafield: 'fecTarea',
      cellsrenderer: r.cellsrendererFechaHistorico,
      renderer: r.columnrenderer,
    },
    {
      text: 'Archivo',
      width: '25%',
      datafield: 'desArchi',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'Descripción',
      datafield: 'desIndic',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'Descrip. Tarea',
      datafield: 'desTarea',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'usuContr',
      datafield: 'usuContr',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Usuario',
      width: '5%',
      datafield: 'usuario',
      cellsrenderer: r.cellsrendererTRamitadores,
      renderer: r.columnrenderer,
    },
    {
      text: 'Descarga',
      width: '8%',
      datafield: 'descarga',
      cellsrenderer: r.columnseleccionDEscargaHistorico,
      renderer: r.columnrenderer,
    },
  ];
}
