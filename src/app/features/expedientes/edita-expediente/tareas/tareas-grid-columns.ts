import {
  IflowGridCellsRenderer,
  IflowGridColumns,
} from '../../../../shared/components/iflow-grid/iflow-grid.types'

type GridRenderer = IflowGridCellsRenderer

export interface TareaTramiteGridColumnRenderers {
  columnseleccionTareaTramite: GridRenderer;
  columnrenderer: GridRenderer;
  columnrendererDescarga: GridRenderer;
  cellsrendererTramiteTarea: GridRenderer;
  cellsrendererFecha: GridRenderer;
  cellsrendererFechaPlazo: GridRenderer;
  cellsrendererColor: GridRenderer;
  cellsrendererContieneArchivo: GridRenderer;
  cellsrendererArchivo: GridRenderer;
  cellsrendererPlazo: GridRenderer;
}

export function createColumnsTareasTramite(r: TareaTramiteGridColumnRenderers): IflowGridColumns {
  return [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
    { text: '', datafield: '', cellsrenderer: r.columnseleccionTareaTramite, renderer: r.columnrenderer },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numero',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Descripción',
      width: '45%',
      datafield: 'descripcion',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Tarea',
      width: '8%',
      datafield: 'fecInicio',
      cellsrenderer: r.cellsrendererFecha,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Finalización',
      width: '12%',
      datafield: 'fecFin',
      cellsrenderer: r.cellsrendererFecha,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Plazo',
      width: '10%',
      datafield: 'fecPlazo',
      cellsrenderer: r.cellsrendererFechaPlazo,
      renderer: r.columnrenderer,
    },
    {
      text: 'Estado',
      width: '10%',
      datafield: 'color',
      cellsrenderer: r.cellsrendererColor,
      renderer: r.columnrendererDescarga,
    },
    {
      text: 'Archivo',
      width: '10%',
      datafield: 'archivo',
      cellsrenderer: r.cellsrendererContieneArchivo,
      renderer: r.columnrenderer,
    },
    {
      text: 'Nombre archivo',
      width: '35%',
      datafield: 'nombreArchivo',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Firmado',
      width: '8%',
      datafield: 'firmado',
      cellsrenderer: r.cellsrendererArchivo,
      renderer: r.columnrendererDescarga,
    },
    {
      text: 'Propuesta',
      width: '8%',
      datafield: 'propuestaResolucion',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Salida',
      width: '8%',
      datafield: 'numRegis',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Notificación',
      width: '8%',
      datafield: 'ejeNumNotif',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Tablón',
      width: '8%',
      datafield: 'idAnunc',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'Usuario',
      width: '8%',
      datafield: 'usuario',
      cellsrenderer: r.cellsrendererTramiteTarea,
      renderer: r.columnrenderer,
    },
    {
      text: 'tipAnexo',
      width: '8%',
      datafield: 'tipAnexo',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'docAport',
      width: '8%',
      datafield: 'docAport',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'tipDocEni',
      width: '8%',
      datafield: 'tipDocEni',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'documentacion',
      width: '8%',
      datafield: 'documentacion',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'visible',
      width: '8%',
      datafield: 'visible',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'idHisDocum',
      width: '8%',
      datafield: 'idHisDocum',
      cellsrenderer: r.cellsrendererPlazo,
      renderer: r.columnrenderer,
      hidden: true,
    },
  ];
}
