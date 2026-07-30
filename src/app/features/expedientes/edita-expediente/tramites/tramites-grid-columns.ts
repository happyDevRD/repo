import {
  IflowGridCellsRenderer,
  IflowGridColumns,
} from '../../../../shared/components/iflow-grid/iflow-grid.types'

type GridRenderer = IflowGridCellsRenderer

export interface TramiteGridColumnRenderers {
  columnseleccion: GridRenderer;
  columnrenderer: GridRenderer;
  cellsrenderer: GridRenderer;
  cellsrendererDEscripTareas: GridRenderer;
  cellsrendererTramite: GridRenderer;
  cellsrendererFecha: GridRenderer;
}

export function createColumnsTramite(r: TramiteGridColumnRenderers): IflowGridColumns {
  return [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: '', datafield: '', width: '5%', cellsrenderer: r.columnseleccion, renderer: r.columnrenderer },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: r.cellsrenderer,
      renderer: r.columnrenderer,
    },
    {
      text: 'Descripción',
      datafield: 'descripcion',
      cellsrenderer: r.cellsrendererDEscripTareas,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fase',
      width: '8%',
      datafield: 'fase',
      cellsrenderer: r.cellsrendererTramite,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Trámite',
      width: '12%',
      datafield: 'fecTramite',
      cellsrenderer: r.cellsrendererFecha,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Control',
      width: '8%',
      datafield: 'fecContr',
      cellsrenderer: r.cellsrendererFecha,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Usuario de control',
      width: '15%',
      datafield: 'usuContr',
      cellsrenderer: r.cellsrendererDEscripTareas,
      renderer: r.columnrenderer,
      hidden: true,
    },
  ];
}
