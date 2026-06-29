import { totalRendererRecibos } from './tareas-recibos.helper';

export const COLUMNS_RECIBOS = [
  { text: 'Ejercicio', datafield: 'ejeRecib', width: '10%' },
  { text: 'Recibo', datafield: 'numRecib', width: '15%' },
  { text: 'Padrón', datafield: 'nomPadro', width: '20%' },
  { text: 'Descripción', datafield: 'desImpue', width: '25%' },
  { text: 'Fecha', datafield: 'fecRecib', width: '15%', cellsformat: 'dd/MM/yyyy' },
  {
    text: 'Total',
    datafield: 'impRecib',
    width: '15%',
    cellsrenderer: totalRendererRecibos,
  },
];
