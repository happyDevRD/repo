import { EditaTareaProcedi } from '../procedimiento';

export interface TareaRowData {
  id?: number;
  accion?: unknown;
  plantillaDefecto?: string;
  descripcion?: string;
  faseTarea?: string;
  plazo?: unknown;
  tipoPlazo?: string;
  procesoFirmadoDefecto?: string;
}

export interface TareaSelectionHost {
  accionTarea: unknown;
  plantillaT: unknown;
  idPermisoProcedimiento: unknown;
  idverTarea: unknown;
  idtrigger: unknown;
  descripcionT: unknown;
  faseT: unknown;
  plazot: unknown;
  tipoPlazoT: unknown;
  firmaT: unknown;
  veoPermiso: boolean;
  veoAccionesPermiso: boolean;
  veoAtributos: boolean;
  verEliminaTarea: boolean;
  veoBorrarTarea: boolean;
  vermenu: boolean;
  usuarioTarea: unknown;
  editatareaprocedi: EditaTareaProcedi;
}

export const applyTareaGridSelection = (
  host: TareaSelectionHost,
  rowData: TareaRowData,
  callbacks: {
    setIdPermiso: (id: number) => void;
    lanzaSourcePermi: (id: number) => void;
    peparadatosfirma: (plantilla: string) => void;
    actualizaSourceAtributo: (id: number) => void;
    idProcedi: number;
  },
): void => {
  host.accionTarea = rowData.accion;
  host.plantillaT = rowData.plantillaDefecto || 'Sin plantilla';
  if (rowData.id) {
    callbacks.lanzaSourcePermi(rowData.id);
  }
  host.verEliminaTarea = true;
  host.veoPermiso = true;
  host.veoAccionesPermiso = true;
  host.veoAtributos = true;
  host.usuarioTarea = '';
  host.vermenu = true;
  host.veoBorrarTarea = false;
  host.idPermisoProcedimiento = rowData.id;
  host.idverTarea = rowData.id;
  host.idtrigger = rowData.id;
  host.descripcionT = rowData.descripcion;
  host.faseT = rowData.faseTarea;
  host.plazot = rowData.plazo;
  host.tipoPlazoT = rowData.tipoPlazo;
  host.firmaT = rowData.procesoFirmadoDefecto;
  if (rowData.id) {
    callbacks.setIdPermiso(rowData.id);
  }
  callbacks.peparadatosfirma(rowData.plantillaDefecto ?? '');
  callbacks.actualizaSourceAtributo(callbacks.idProcedi);
};

export const populateTareaEditForm = (host: TareaSelectionHost, rowData: TareaRowData): void => {
  host.accionTarea = rowData.accion;
  host.plantillaT = rowData.plantillaDefecto || 'Sin plantilla';
  host.idverTarea = rowData.id;
  host.idtrigger = rowData.id;
  host.descripcionT = rowData.descripcion;
  host.faseT = rowData.faseTarea;
  host.plazot = rowData.plazo;
  host.tipoPlazoT = rowData.tipoPlazo;
  host.firmaT = rowData.procesoFirmadoDefecto;
  host.editatareaprocedi.descripcion = rowData.descripcion ?? '';
  host.editatareaprocedi.faseTarea = rowData.faseTarea ?? '';
  host.editatareaprocedi.plazo = rowData.plazo as number;
  host.editatareaprocedi.tipoPlazo = rowData.tipoPlazo ?? '';
  host.editatareaprocedi.plantillaDefecto = rowData.plantillaDefecto ?? '';
  host.editatareaprocedi.acciones = rowData.accion as number;
};
