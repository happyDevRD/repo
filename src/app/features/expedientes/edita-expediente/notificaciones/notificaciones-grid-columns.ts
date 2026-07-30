import {
  IflowGridCellsRenderer,
  IflowGridColumns,
} from '../../../../shared/components/iflow-grid/iflow-grid.types'

type GridRenderer = IflowGridCellsRenderer

export interface NotificacionGridColumnRenderers {
  columnseleccionListarNotifi: GridRenderer;
  columnrenderer: GridRenderer;
  columnrendererDescarga: GridRenderer;
  cellsrendererListarNotifi: GridRenderer;
  cellsrendererFechaListarNotifi: GridRenderer;
  cellsrendererListarNotifiSituacionSimple: GridRenderer;
  cellsrendererListarNotifiBOPSimple: GridRenderer;
  cellsrendererNotiDNI: GridRenderer;
  cellsrendererNotiNombre: GridRenderer;
  cellsrendererAccionesNotificacion: GridRenderer;
}

export function createColumnsListarNotifi(r: NotificacionGridColumnRenderers): IflowGridColumns {
  return [
    { text: 'Id', datafield: 'idNotif', width: '1%', hidden: true },
    { text: 'TareaProcedimiento', datafield: 'tareaProcedimiento', width: '1%', hidden: true },
    {
      text: '',
      width: '1%',
      datafield: '',
      cellsrenderer: r.columnseleccionListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Ejercicio',
      width: '8%',
      datafield: 'ejeNotif',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrendererDescarga,
    },
    {
      text: 'Número',
      width: '8%',
      datafield: 'numNotif',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Notificación',
      width: '10%',
      datafield: 'fecNotif',
      cellsrenderer: r.cellsrendererFechaListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Situación',
      width: '15%',
      datafield: 'situacion',
      cellsrenderer: r.cellsrendererListarNotifiSituacionSimple,
      renderer: r.columnrenderer,
    },
    {
      text: 'Notificador',
      width: '18%',
      datafield: 'desNotificador',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Interesado',
      width: '25%',
      datafield: 'desPerEntid',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Documento',
      width: '10%',
      datafield: 'numDocum',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Envio',
      width: '18%',
      datafield: 'fecEnvio',
      cellsrenderer: r.cellsrendererFechaListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Recepción/Devolucion',
      width: '18%',
      datafield: 'fecRecNotif',
      cellsrenderer: r.cellsrendererFechaListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'receptor',
      datafield: 'desReceptor',
      cellsrenderer: r.cellsrendererNotiDNI,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Número Tarea',
      width: '10%',
      datafield: 'numTarea',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Envio T.E.U.',
      datafield: 'fecEmiBop',
      width: '30%',
      cellsrenderer: r.cellsrendererFechaListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Número T.E.U.',
      datafield: 'numEnvioTeu',
      width: '30%',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Situación BOE',
      width: '15%',
      datafield: 'bop',
      cellsrenderer: r.cellsrendererListarNotifiBOPSimple,
      renderer: r.columnrenderer,
    },
    {
      text: 'Fecha Publicación BOE ',
      width: '15%',
      datafield: 'fecPubBop',
      cellsrenderer: r.cellsrendererFechaListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Número BOE',
      width: '10%',
      datafield: 'numBop',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'Observaciones',
      width: '35%',
      datafield: 'observacion',
      cellsrenderer: r.cellsrendererListarNotifi,
      renderer: r.columnrenderer,
    },
    {
      text: 'DNI',
      datafield: 'personaEntidad',
      cellsrenderer: r.cellsrendererNotiDNI,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Apellidos/Nombre',
      datafield: 'usuario',
      cellsrenderer: r.cellsrendererNotiNombre,
      renderer: r.columnrenderer,
      hidden: true,
    },
    {
      text: 'Acciones',
      width: '15%',
      datafield: 'acciones',
      cellsrenderer: r.cellsrendererAccionesNotificacion,
      renderer: r.columnrenderer,
    },
  ];
}
