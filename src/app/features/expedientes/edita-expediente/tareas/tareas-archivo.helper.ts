import { environment } from 'src/environments/environment';
import { NotificationService } from '../../../../core/service/notification.service';

export interface ArchivoTareaHost {
  numeroArchivo: number | string | null | undefined;
  descargafichero: string;
  spinnervisiblefirma: boolean;
  usuContrl: string | null;
  idTarea: number;
}

export function abrirArchivoTarea(host: ArchivoTareaHost, notificationService: NotificationService): void {
  host.spinnervisiblefirma = false;

  if (!host.numeroArchivo) {
    notificationService.warning('Esta tarea No tiene ningún documento asociado');
    host.spinnervisiblefirma = true;
    return;
  }

  window.open(host.descargafichero, '_blank');
  host.spinnervisiblefirma = true;
}

export function abrirInformeFirma(host: ArchivoTareaHost, notificationService: NotificationService): string {
  const url = `${environment.apiUrl}archivo/obtenerInformeFirma/${host.usuContrl}/${host.idTarea}`;
  if (url) {
    window.open(url, '_blank');
  } else {
    notificationService.warning('No se pudo descargar el fichero firmado.');
  }
  return url;
}
