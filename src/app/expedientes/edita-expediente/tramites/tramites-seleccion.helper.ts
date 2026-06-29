export interface TramiteSeleccionEstado {
  botonNuevaTareaTramite: boolean;
  fechatramite: string;
  fasetramite: string;
  nuevotramite: boolean;
  verAccionesdeTarea: boolean;
  verTareasdelTramite: boolean;
  verasignatramite: boolean;
  menuexpediente: boolean;
  idTramite: number;
  descriptramite: string;
  numeroTramite: number;
  TramiteFase: string;
  fecTramiteEdicion: string;
}

/** Calcula el estado de UI al seleccionar un trámite en el grid. */
export function calcularSeleccionTramite(
  rowData: {
    id: number;
    fecTramite: string;
    fase: string;
    descripcion: string;
    numero: number;
  },
  formatearFecha: (fecha: string) => string,
): TramiteSeleccionEstado {
  const fecFormateada = formatearFecha(rowData.fecTramite);
  return {
    botonNuevaTareaTramite: true,
    fechatramite: fecFormateada,
    fasetramite: rowData.fase,
    nuevotramite: false,
    verAccionesdeTarea: true,
    verTareasdelTramite: true,
    verasignatramite: true,
    menuexpediente: true,
    idTramite: rowData.id,
    descriptramite: rowData.descripcion,
    numeroTramite: rowData.numero,
    TramiteFase: rowData.fase,
    fecTramiteEdicion: fecFormateada,
  };
}
