import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';
import { ArchivoFirmadoEF } from '../../expedientes';
import { ExpedientesService } from '../../expedientes.service';
import { NotificationService } from '../../../core/service/notification.service';
import { EditaExpedienteTareasFacade, EditaExpedienteTareasHost } from './edita-expediente-tareas.facade';

export interface FirmaTareaHost extends EditaExpedienteTareasHost {
  archivofirmadoef: ArchivoFirmadoEF;
  usuContrl: string | null;
  numeroArchivo: unknown;
  descargaficheroFirmado: string;
  spinnervisiblefirma: boolean;
  firmaAtendida: boolean;
  firmaDesatendida: boolean;
  refrescoSourceTareasTramite(id: number): void;
}

@Injectable()
export class EditaExpedienteFirmaFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly http: HttpClient,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly notificationService: NotificationService,
  ) {}

  limpiarArchivoFirmaEF(host: FirmaTareaHost): void {
    host.archivofirmadoef = new ArchivoFirmadoEF();
  }

  cargarTipoFirma(host: FirmaTareaHost): void {
    this.expedientesService.getTipoFirma(host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => console.log('MENSAJE DE RESPUESTA : ' + data),
      error: (error: HttpErrorResponse) => {
        console.error('Tipo de Firma : ' + error.error?.text);
        switch (error.error?.text) {
          case 'ATENDIDA':
            host.firmaAtendida = true;
            host.firmaDesatendida = false;
            break;
          case 'DESATENDIDA':
            host.firmaAtendida = false;
            host.firmaDesatendida = true;
            break;
          default:
            host.firmaAtendida = false;
            host.firmaDesatendida = false;
            break;
        }
      },
    });
  }

  enviarFirmaAtendida(host: FirmaTareaHost): void {
    host.spinnervisiblefirma = false;

    const form = host.archivofirmadoef;
    if (!form.asunto || !form.prioridad || !form.texto) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    this.expedientesService.getTipoFirma(host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => console.log('MENSAJE DE RESPUESTA : ' + data),
      error: (error: HttpErrorResponse) => {
        console.error('TIPO DE FIRMA  +++++++++++++++' + error.error?.text);

        if (error.error?.text === 'ATENDIDA') {
          this.expedientesService
            .postArchivoFirmadoEF(form, host.usuContrl, host.idTarea)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.success({ title: 'Envio de firma ATENDIDA realizado con exito!' });
                this.limpiarArchivoFirmaEF(host);
                this.tareasFacade.refrescarGridAdapter(host);
                host.spinnervisiblefirma = true;
              },
              error: (err: HttpErrorResponse) => {
                console.log('paso por error: ' + err.error?.text);
                this.notificationService.warning({ title: err.error?.message });
                host.spinnervisiblefirma = true;
              },
            });
        }

        if (error.error?.text === undefined) {
          this.notificationService.warning('La Tarea de Procedimiento no tiene Proceso firmado');
        }
      },
    });
  }

  enviarFirmaDesatendida(host: FirmaTareaHost): void {
    this.expedientesService.postArchivoFirmadoEFDesatendida(host.usuContrl, host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success({ title: 'Envio de firma realizado con exito!' });
        this.limpiarArchivoFirmaEF(host);
        this.tareasFacade.refrescarGridAdapter(host);
      },
      error: (err: HttpErrorResponse) => {
        console.log('paso por error: ' + err.error?.text);
        this.notificationService.warning({ title: err.error?.message });
      },
    });
  }

  descargarArchivoFirmado(host: FirmaTareaHost): void {
    host.descargaficheroFirmado = `${environment.apiUrl}archivo/firma/${host.numeroArchivo}/${host.usuContrl}/${host.idTarea}`;

    if (!host.numeroArchivo) {
      this.notificationService.warning('Esta tarea No tiene ningún documento asociado');
      return;
    }

    this.http.get(host.descargaficheroFirmado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {},
      error: (err: HttpErrorResponse) => {
        if (err.status === 200) {
          this.notificationService.success({
            position: 'center',
            title: 'Firma realizado con exito',
            showConfirmButton: false,
            timer: 2500,
          });
          host.refrescoSourceTareasTramite(host.idTramite);
        } else {
          this.notificationService.warning({ title: err.error?.message });
        }

        this.tareasFacade.refrescarGridAdapter(host);
        console.log('paso por error: ' + err.error?.message);
        host.refrescoSourceTareasTramite(host.idTramite);
      },
    });
  }
}
