import { EditarTramiteExp } from '../../expedientes';

export interface EdicionTramiteHost {
  editartramiteexp: EditarTramiteExp;
  faseEditTra: string;
  idTramite: number;
  formatearFechaParaInput(fecha: unknown): string;
}

export function aplicarEdicionTramiteDesdeFila(host: EdicionTramiteHost, rowData: any): void {
  host.editartramiteexp.id = rowData.id;
  host.editartramiteexp.numero = rowData.numero;
  host.editartramiteexp.descripcion = rowData.descripcion;
  host.editartramiteexp.fase = rowData.fase;
  host.editartramiteexp.fecTramite = host.formatearFechaParaInput(rowData.fecTramite);
  host.faseEditTra = rowData.fase;
  host.idTramite = rowData.id;
}
