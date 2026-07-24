import { environment } from 'src/environments/environment';
import { ACCIONES } from '../../../core/helper/tarea-acciones';
import { GridRadioSelector } from '../../../core/helper/grid-radio-selector';
import { MATERIA_LABELS, MODALIDAD_LABELS } from '../models/procedimientos-internal.models';

export interface ProcedimientosGridRenderers {
  columnrenderer: (defaultText?: string) => string;
  cellsrenderer: (row: number, column: string, value: string) => string;
  cellsrendererAcciones: (row: number, column: string, value: unknown) => string;
  cellsrendererPocediDescrip: (row: number, column: string, value: string) => string;
  cellsrendererPocediCodigoSIA: (row: number, column: string, value: string) => string;
  cellsrendererPocediSiglas: (row: number, column: string, value: string) => string;
  cellsrendererPocediModalidad: (row: number, column: string, value: number) => string;
  cellsrendererPocediMateria: (row: number, column: string, value: number) => string;
  cellsrendererTarea: (row: number, column: string, value: string) => string;
  cellsrendererTareaDescrip: (row: number, column: string, value: string) => string;
  cellsrendererPermi: (row: number, column: string, value: string) => string;
  cellsrendererAtributos: (row: number, column: string, value: string) => string;
  cellsrendererAtributosRequerido: (row: number, column: string, value: unknown) => string;
  columnseleccion: (row: number, column: string, value: string) => string;
  columnseleccionPermiso: (row: number, column: string, value: string) => string;
  columnseleccionTarea: (row: number, column: string, value: string) => string;
  columnseleccionAtributos: (row: number, column: string, value: string) => string;
}

const cellCenter = (value: string): string =>
  `<div style="text-align: center; margin-top: 5px;">${value ?? ''}</div>`;

const cellLeft = (value: string): string =>
  `<div style="text-align: left; margin-top: 5px; padding-left: 10px;">${value ?? ''}</div>`;

export const createProcedimientosGridRenderers = (): ProcedimientosGridRenderers => ({
  columnrenderer: (defaultText?: string) =>
    `<div style="text-align: center; margin-top: 5px; font-weight: bold; font-family: Verdana;">${defaultText ?? ''}</div>`,
  cellsrenderer: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererAcciones: (_row, _column, value) => {
    if (value === null || value === undefined || value === '' || value === -1) {
      return cellCenter('-');
    }
    const valorNumerico = Number(value);
    const accionEncontrada = ACCIONES.find((accion) => accion.valor === valorNumerico);
    const label = accionEncontrada ? accionEncontrada.descripcion : String(value);
    return `<div style="text-align: center; margin-top: 5px; padding-left: 5px; padding-right: 5px;">${label}</div>`;
  },
  cellsrendererPocediDescrip: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererPocediCodigoSIA: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererPocediSiglas: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererPocediModalidad: (_row, _column, value) => {
    const label = MODALIDAD_LABELS[Number(value)] ?? 'Sin Datos';
    const color = MODALIDAD_LABELS[Number(value)] ? '' : ' color: #718096;';
    return `<div style="text-align: center; margin-top: 5px;${color}">${label}</div>`;
  },
  cellsrendererPocediMateria: (_row, _column, value) => {
    const label = MATERIA_LABELS[Number(value)] ?? 'Sin Datos';
    const color = MATERIA_LABELS[Number(value)] ? '' : ' color: #718096;';
    return `<div style="text-align: center; margin-top: 5px;${color}">${label}</div>`;
  },
  cellsrendererTarea: (_row, _column, value) => cellCenter(String(value)),
  cellsrendererTareaDescrip: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererPermi: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererAtributos: (_row, _column, value) => cellLeft(String(value)),
  cellsrendererAtributosRequerido: (_row, _column, value) => {
    const label = value == 1 ? 'SI' : value == 0 ? 'NO' : String(value ?? '');
    return cellCenter(label);
  },
  columnseleccion: GridRadioSelector.createRadioRenderer('Procedimientos', 'Selecciona Procedimiento'),
  columnseleccionPermiso: GridRadioSelector.createRadioRenderer('Permisos', 'Selecciona Permiso'),
  columnseleccionTarea: GridRadioSelector.createRadioRenderer('Tareas', 'Selecciona Tarea', true),
  columnseleccionAtributos: GridRadioSelector.createRadioRenderer('Atributos', 'Selecciona Atributo'),
});

export const buildColumnsPro = (renderers: ProcedimientosGridRenderers): any[] => [
  { text: '', datafield: '', width: '3%', cellsrenderer: renderers.columnseleccion, renderer: renderers.columnrenderer },
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: 'Descripción', width: '45%', datafield: 'descripcion', cellsrenderer: renderers.cellsrendererPocediDescrip, renderer: renderers.columnrenderer },
  { text: 'Código SIA', width: '12%', datafield: 'codigoSia', cellsrenderer: renderers.cellsrendererPocediCodigoSIA, renderer: renderers.columnrenderer },
  { text: 'Siglas', width: '8%', datafield: 'siglas', cellsrenderer: renderers.cellsrendererPocediSiglas, renderer: renderers.columnrenderer },
  { text: 'Modalidad', width: '20%', datafield: 'modalidad', cellsrenderer: renderers.cellsrendererPocediModalidad, renderer: renderers.columnrenderer },
  { text: 'Materia', width: '12%', datafield: 'idMatProce', cellsrenderer: renderers.cellsrendererPocediMateria, renderer: renderers.columnrenderer },
  { text: 'Departamento', datafield: 'desEleme', cellsrenderer: renderers.cellsrendererPocediDescrip, renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsTarea = (renderers: ProcedimientosGridRenderers): any[] => [
  { text: '', datafield: '', width: '3%', cellsrenderer: renderers.columnseleccionTarea, renderer: renderers.columnrenderer },
  { text: 'id', datafield: 'id', width: 10, hidden: true },
  { text: 'procesoFirmadoDefecto', datafield: 'procesoFirmadoDefecto', width: 10, hidden: true },
  { text: 'plantillaDefecto', datafield: 'plantillaDefecto', width: 10, hidden: true },
  { text: 'Descripción', datafield: 'descripcion', width: '40%', cellsrenderer: renderers.cellsrendererTareaDescrip, renderer: renderers.columnrenderer },
  { text: 'Acciones', datafield: 'accion', width: '35%', cellsrenderer: renderers.cellsrendererAcciones, renderer: renderers.columnrenderer },
  { text: 'Fase', datafield: 'faseTarea', width: '15%', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
  { text: 'Plazo', datafield: 'plazo', width: '9%', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
  { text: 'Tipo plazo', datafield: 'tipoPlazo', width: '11%', cellsrenderer: renderers.cellsrendererTarea, renderer: renderers.columnrenderer },
];

export const buildColumnsPermi = (renderers: ProcedimientosGridRenderers): any[] => [
  { text: 'id', datafield: 'id', width: '1%', hidden: true },
  { text: '', datafield: '', width: '3%', cellsrenderer: renderers.columnseleccionPermiso, renderer: renderers.columnrenderer },
  { text: 'Usuario', datafield: 'usuario', width: '15%', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer },
  { text: 'Procedimiento', datafield: 'desProce', width: '45%', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer },
  { text: 'Tarea', datafield: 'desTareaProce', width: '45%', cellsrenderer: renderers.cellsrendererPermi, renderer: renderers.columnrenderer },
  { text: 'Descripción', datafield: 'descripcion', renderer: renderers.columnrenderer, hidden: true },
];

export const buildColumnsAtributos = (renderers: ProcedimientosGridRenderers): any[] => [
  { text: 'idGrupo', datafield: 'idGrupo', width: '1%', hidden: true },
  { text: 'idAtrib', datafield: 'idAtrib', width: '1%', hidden: true },
  { text: '', datafield: '', width: '3%', cellsrenderer: renderers.columnseleccionAtributos, renderer: renderers.columnrenderer },
  { text: 'Etiqueta', width: '15%', datafield: 'etiGruAtrib', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Descripción', width: '28%', datafield: 'desGruAtrib', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Requerido', width: '8%', datafield: 'requerido', cellsrenderer: renderers.cellsrendererAtributosRequerido, renderer: renderers.columnrenderer },
  { text: 'Val.Inici', width: '10%', datafield: 'valInici', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Val.Minim', width: '10%', datafield: 'valMinim', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Val.Maxim', width: '10%', datafield: 'valMaxim', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Tipo', width: '10%', datafield: 'tipo', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
  { text: 'Longitud', width: '8%', datafield: 'longitud', cellsrenderer: renderers.cellsrendererAtributos, renderer: renderers.columnrenderer },
];

const PROCEDIMIENTOS_DATA_FIELDS = [
  { name: 'descripcion', type: 'string' },
  { name: 'desEleme', type: 'string' },
  { name: 'codigoSia', type: 'string' },
  { name: 'idMatProce', type: 'string' },
  { name: 'modalidad', type: 'string' },
  { name: 'siglas', type: 'string' },
  { name: 'id', type: 'any' },
];

const TAREAS_DATA_FIELDS = [
  { name: 'descripcion', type: 'string' },
  { name: 'faseTarea', type: 'string' },
  { name: 'plazo', type: 'string' },
  { name: 'tipoPlazo', type: 'string' },
  { name: 'id', type: 'any' },
  { name: 'plantillaDefecto', type: 'any' },
  { name: 'procesoFirmadoDefecto', type: 'any' },
  { name: 'accion', type: 'any' },
];

const PERMISOS_DATA_FIELDS = [
  { name: 'usuario' },
  { name: 'desProce' },
  { name: 'desTareaProce' },
  { name: 'descripcion' },
  { name: 'id' },
];

const ATRIBUTOS_DATA_FIELDS = [
  { name: 'etiGruAtrib' },
  { name: 'desGruAtrib' },
  { name: 'requerido' },
  { name: 'valInici' },
  { name: 'valMinim' },
  { name: 'valMaxim' },
  { name: 'tipo' },
  { name: 'longitud' },
  { name: 'idAtrib' },
  { name: 'idGrupo' },
];

export const createProcedimientosListAdapter = (idOrgElemen: string | number, cacheBust = false): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: PROCEDIMIENTOS_DATA_FIELDS,
    url: `${environment.apiUrl}procedimiento/listar/${idOrgElemen}${cacheBust ? `?_t=${Date.now()}` : ''}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc',
  });

export const createTareasAdapter = (idprocedi: string | number): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: TAREAS_DATA_FIELDS,
    url: `${environment.apiUrl}tareaProcedimiento/listar/${idprocedi}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc',
  });

export const createTareasAdapterSimple = (idprocedi: string | number): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: TAREAS_DATA_FIELDS,
    url: `${environment.apiUrl}tareaProcedimiento/listar/${idprocedi}`,
    id: 'id',
  });

export const createPermisosAdapter = (id: string | number): any =>
  new jqx.dataAdapter({
    dataType: 'json',
    dataFields: PERMISOS_DATA_FIELDS,
    url: `${environment.apiUrl}permiso/listar/${id}`,
    id: 'id',
    sortcolumn: 'id',
    sortdirection: 'desc',
  });

export const createPermisosSourcePlain = (
  id: number | string,
  withTypes = false,
): Record<string, unknown> => ({
  dataType: 'json',
  dataFields: withTypes
    ? [
        { name: 'usuario', type: 'string' },
        { name: 'desProce', type: 'string' },
        { name: 'desTareaProce', type: 'string' },
        { name: 'id', type: 'any' },
      ]
    : [
        { name: 'usuario' },
        { name: 'desProce' },
        { name: 'desTareaProce' },
        { name: 'id' },
      ],
  url: `${environment.apiUrl}permiso/listar/${id}`,
  id: 'id',
});

export const createAtributosAdapter = (idprocedimiento: number, cacheBust = false): any => {
  const baseConfig = {
    dataType: 'json',
    dataFields: ATRIBUTOS_DATA_FIELDS,
    url: `${environment.apiUrl}metadatoGrupoAtrib/listarPorProc/${idprocedimiento}${cacheBust ? `?_t=${Date.now()}` : ''}`,
    id: 'idAtrib',
  };
  if (cacheBust) {
    return new jqx.dataAdapter({
      ...baseConfig,
      sortcolumn: 'idAtrib',
      sortdirection: 'desc',
    });
  }
  return new jqx.dataAdapter(baseConfig);
};

export const refreshJqxGrid = (grid: { refresh: () => void; updatebounddata: () => void } | null | undefined, delayMs = 200): void => {
  setTimeout(() => {
    grid?.refresh();
    grid?.updatebounddata();
  }, delayMs);
};
