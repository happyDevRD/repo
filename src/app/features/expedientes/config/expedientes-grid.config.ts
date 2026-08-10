import { environment } from 'src/environments/environment';
import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import { INICIO_GRID_RENDERERS as R } from '../../inicio/shared/inicio-grid-renderers';

export {
  buildRepresentanteGridColumns as buildColumnsListRepre,
  createRepresentanteGridAdapter as createRepresentantesAdapter,
} from '../../../shared/components/iflow-grid/iflow-grid-representante.config';

export interface ExpedientesGridRenderContext {
  valorEstado?: string;
  setUsuarioTarea?: (id: unknown) => void;
}

export interface ExpedientesGridRenderers {
  columnrenderer: (value?: string) => string;
  columnrendererIndiceENI: (value?: string) => string;
  columnrendererAtributo: (value?: string) => string;
  columnrendererPermi: (value?: string) => string;
  columnrendererDescarga: (value?: string) => string;
  columnseleccion: (value?: unknown) => string;
  cellsrendererRepre: (row: number, column: string, value: string) => string;
  cellsrendererIndiceENI: (row: number, column: string, value: string) => string;
  cellsrenderer: (row: number, column: string, value: string) => string;
  cellsrendererTareaExpedi: (row: number, column: string, value: unknown) => string;
  cellsrendererTareaDescrip: (row: number, column: string, value: string) => string;
  cellsrendererTarea: (row: number, column: string, value: string) => string;
  cellsrendererPermi: (row: number, column: string, value: string) => string;
  cellsrendererAtributo: (row: number, column: string, value: unknown) => string;
  cellsrendererColor: (row: number, column: string, value: string) => string;
  cellsrendererContieneArchivo: (row: number, column: string, value: unknown) => string;
  cellsrendererTramiteTarea: (row: number, column: string, value: unknown) => string;
  cellsrendererPlazo: (row: number, column: string, value: unknown) => string;
  cellsrendererArchivo: (row: number, column: string, value: string) => string;
  cellsrendererFechaPlazo: (row: number, column: string, value: unknown) => string;
  columnseleccionTareaProcedi: (row: number, column: string, value: string) => string;
  columnseleccionPermisos: (row: number, column: string, value: string) => string;
  columnseleccionTareasExpediente: (row: number, column: string, value: string) => string;
  columnseleccionAtributos: (row: number, column: string, value: string) => string;
}

const cellCenter = (value: string, extra = ''): string =>
  `<div style="text-align: center; margin-top: 5px;${extra}">${value ?? ''}</div>`;

const cellLeft = (value: string, color = ''): string =>
  `<div style="text-align: left; margin-top: 5px; padding-left: 8px; line-height: 1.2;${color}">${value ?? ''}</div>`;

export const createExpedientesGridRenderers = (
  context: ExpedientesGridRenderContext = {},
): ExpedientesGridRenderers => ({
  columnrenderer: (value?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnrendererIndiceENI: (value?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnrendererAtributo: (value?: string) =>
    `<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">${value ?? ''}</div>`,
  columnrendererPermi: (value?: string) =>
    `<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">${value ?? ''}</div>`,
  columnrendererDescarga: (value?: string) =>
    `<div (click)="abreArchivo()" style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${value ?? ''}</div>`,
  columnseleccion: () =>
    ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Expediente" (click)="marcaExpedienteNuevo($event)" ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>',
  cellsrendererRepre: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererIndiceENI: (_row, _column, value) =>
    `<div style="text-align: center; margin-top: 5px;"  type="button"  >${value ?? ''}</div>`,
  cellsrenderer: (_row, _column, value) => {
    const color =
      context.valorEstado === 'CERRADO' || context.valorEstado === 'CANCELADO' ? ' color:red;' : '';
    return cellLeft(String(value), color);
  },
  cellsrendererTareaExpedi: (_row, _column, value) => {
    const display = value == null ? '' : String(value);
    if (context.valorEstado === 'CERRADO' || context.valorEstado === 'CANCELADO') {
      return `<div style="text-align: center;color:red; margin-top: 5px;">${display}</div>`;
    }
    return cellCenter(display);
  },
  cellsrendererTareaDescrip: (_row, _column, value) =>
    `<div  style="overflow-wrap: auto; text-align: center; margin-top: 5px;">${value ?? ''}</div>`,
  cellsrendererTarea: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererPermi: (_row, _column, value) => {
    const typed = value as unknown as { id?: unknown };
    if (typed?.id != null) {
      context.setUsuarioTarea?.(typed.id);
    }
    let display = value === 'ANOS' ? 'AÑOS' : String(value ?? '');
    return `<div style="text-align: center;font-family: Verdana; margin-top: 5px;"  >${display}</div>`;
  },
  cellsrendererAtributo: (_row, _column, value) => {
    let display = value == null || value === '' ? '' : String(value);
    if (display === 'ANOS') {
      display = 'AÑOS';
    }
    return `<div style="text-align: center; font-family: Verdana; margin-top: 5px;">${display}</div>`;
  },
  // Idénticos a INICIO_GRID_RENDERERS (dashboard): reutilizados en vez de reimplementados.
  cellsrendererColor: R.cellsrendererColor,
  cellsrendererContieneArchivo: R.cellsrendererContieneArchivo,
  cellsrendererArchivo: R.cellsrendererArchivo,
  cellsrendererFechaPlazo: R.cellsrendererFechaPlazo,
  cellsrendererTramiteTarea: (_row, _column, value) => cellCenter(String(value ?? '')),
  cellsrendererPlazo: (_row, _column, value) => cellCenter(String(value ?? '')),
  columnseleccionTareaProcedi: GridRadioSelector.createRadioRenderer('TareaProcedi', 'Selecciona Tarea', true),
  columnseleccionPermisos: GridRadioSelector.createRadioRenderer('Permisos', 'Selecciona Permiso', true),
  columnseleccionTareasExpediente: GridRadioSelector.createRadioRenderer('TareasExpediente', 'Selecciona Tarea', true),
  columnseleccionAtributos: GridRadioSelector.createRadioRenderer('Atributos', 'Selecciona Atributo', true),
});

export const buildColumnsIndiceENI = (renderers: ExpedientesGridRenderers): any[] => [
  { text: 'total', datafield: 'total', width: '1%', hidden: true },
  { text: 'Archivo', datafield: 'archivo', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
  { text: 'Nombre', datafield: 'nombre', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
  { text: 'Huella', datafield: 'huella', cellsrenderer: renderers.cellsrendererIndiceENI, renderer: renderers.columnrendererIndiceENI },
];

export const createTramiteAdapter = (idexpediente: number | string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'numero', type: 'number' },
      { name: 'descripcion', type: 'string' },
      { name: 'fase', type: 'string' },
      { name: 'fecTramite', type: 'string' },
      { name: 'fecContr', type: 'string' },
      { name: 'usuContr', type: 'string' },
      { name: 'id', type: 'any' },
    ],
    url: `${environment.apiUrl}tramite/listar/${idexpediente}`,
    id: 'id',
  });

export const createIndiceEniAdapter = (idexpe: string): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: [
      { name: 'archivo', type: 'any' },
      { name: 'nombre', type: 'any' },
      { name: 'huella', type: 'any' },
    ],
    url: `${environment.apiUrl}archivo/verIndice/${idexpe}`,
  });

