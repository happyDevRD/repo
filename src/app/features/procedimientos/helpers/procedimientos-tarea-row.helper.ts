import { EditaTareaProcedi, ListaTareaProcedi } from '../procedimiento';

export type TareaRowData = Partial<ListaTareaProcedi>;

export interface TareaSelectionHost {
  plantillaT: unknown;
  idPermisoProcedimiento: unknown;
  idverTarea: unknown;
  descripcionT: unknown;
  faseT: unknown;
  plazot: unknown;
  tipoPlazoT: unknown;
  firmaT: unknown;
  verEliminaTarea: boolean;
  veoBorrarTarea: boolean;
  usuarioTarea: unknown;
  editatareaprocedi: EditaTareaProcedi;
}

export const applyTareaGridSelection = (
  host: TareaSelectionHost,
  rowData: TareaRowData,
  callbacks: {
    setIdPermiso: (id: number) => void;
    cargarPermisos: (id: number) => void;
    peparadatosfirma: (plantilla: string) => void;
  },
): void => {
  host.plantillaT = rowData.plantillaDefecto || 'Sin plantilla';
  if (rowData.id) {
    callbacks.cargarPermisos(rowData.id);
  }
  host.verEliminaTarea = true;
  host.usuarioTarea = '';
  host.veoBorrarTarea = false;
  host.idPermisoProcedimiento = rowData.id;
  host.idverTarea = rowData.id;
  host.descripcionT = rowData.descripcion;
  host.faseT = rowData.faseTarea;
  host.plazot = rowData.plazo;
  host.tipoPlazoT = rowData.tipoPlazo;
  host.firmaT = rowData.procesoFirmadoDefecto;
  if (rowData.id) {
    callbacks.setIdPermiso(rowData.id);
  }
  callbacks.peparadatosfirma(rowData.plantillaDefecto ?? '');
};

export const populateTareaEditForm = (host: TareaSelectionHost, rowData: TareaRowData): void => {
  host.plantillaT = rowData.plantillaDefecto || 'Sin plantilla';
  host.idverTarea = rowData.id;
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
