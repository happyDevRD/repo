import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

export interface ArchivoTareaHost {
  numeroArchivo: unknown;
  descargafichero: string;
  spinnervisiblefirma: boolean;
  usuContrl: string | null;
  idTarea: number;
}

export function abrirArchivoTarea(host: ArchivoTareaHost): void {
  host.spinnervisiblefirma = false;

  if (!host.numeroArchivo) {
    Swal.fire('Esta tarea No tiene ningún documento asociado');
    host.spinnervisiblefirma = true;
    return;
  }

  window.open(host.descargafichero, '_blank');
  host.spinnervisiblefirma = true;
}

export function abrirInformeFirma(host: ArchivoTareaHost): string {
  const url = `${environment.apiUrl}archivo/obtenerInformeFirma/${host.usuContrl}/${host.idTarea}`;
  if (url) {
    window.open(url, '_blank');
  } else {
    Swal.fire('No se pudo descargar el fichero firmado.');
  }
  return url;
}
