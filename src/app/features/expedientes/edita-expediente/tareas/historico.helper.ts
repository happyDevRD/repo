import { environment } from 'src/environments/environment';
import { createHistoricoGridAdapter } from './historico-grid.config';

export function buildDescargaHistoricoUrl(archivo: string | number, usuContrl: string | null | undefined): string {
  const usuarioSinEspacios = usuContrl?.replaceAll(' ', '') ?? '';
  return `${environment.apiUrl}archivo/descargaTarea/${archivo}/ ${usuarioSinEspacios}`;
}

export function refrescarSourceHistorico(host: { sourceHistorico: unknown }, idTarea: number | string): void {
  host.sourceHistorico = createHistoricoGridAdapter(idTarea);
}
