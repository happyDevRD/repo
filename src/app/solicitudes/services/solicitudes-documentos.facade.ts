import { DestroyRef, ElementRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FileUploadService } from '../../core/service/file-upload.service';
import { UserSessionService } from '../../core/service/user-session.service';
import { NotificationService } from '../../core/service/notification.service';
import { SolicitudesService } from '../solicitudes.service';
import { SolicitudesGridFacade, SolicitudesGridHost } from './solicitudes-grid.facade';

export interface SolicitudesDocumentosHost extends SolicitudesGridHost {
  selectedFile: File | null;
  base64code: string | null;
  descripcionArchivo: string;
  idsolicitud: number;
  subidaArchivo: boolean;
  iddocumento: number | null;
  listadocmenu: boolean;
  nombreArchivoSubido: string | null;
  descargafichero: unknown;
  fileInput?: ElementRef;
  clearUploadForm(): void;
  cerrarModal(modalId: string): void;
}

@Injectable()
export class SolicitudesDocumentosFacade {
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly http: HttpClient,
    private readonly solicitudesService: SolicitudesService,
    private readonly fileUploadService: FileUploadService,
    private readonly session: UserSessionService,
    private readonly notificationService: NotificationService,
    private readonly gridFacade: SolicitudesGridFacade,
  ) {}

  guardar(host: SolicitudesDocumentosHost): void {
    if (!host.selectedFile || !host.base64code) {
      this.notificationService.warning({
        title: 'No hay archivo seleccionado',
        text: 'Por favor, selecciona un archivo antes de guardar.',
      });
      return;
    }

    if (!host.descripcionArchivo || host.descripcionArchivo.trim() === '') {
      this.notificationService.warning({
        title: 'Descripción obligatoria',
        text: 'Por favor, introduce una descripción antes de guardar.',
      });
      return;
    }

    host.subidaArchivo = true;
    this.fileUploadService.showUploadProgress(host.selectedFile.name);

    const uploadData = {
      descripcion: host.descripcionArchivo,
      fechaSubida: new Date(),
      usuContr: this.session.user,
      idSolicitud: host.idsolicitud,
      nombreArchivo: host.selectedFile.name,
      ficBas64: host.base64code,
    };

    this.http.post(`${environment.apiUrl}documentoSolicitud/crear`, JSON.stringify(uploadData), {
      headers: this.httpHeaders,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.subidaArchivo = false;
        this.fileUploadService.showUploadSuccess(host.selectedFile!.name);
        host.clearUploadForm();

        const modal = document.getElementById('documentoModal');
        if (modal) {
          const modalInstance = (window as { bootstrap?: { Modal?: { getInstance: (el: Element) => { hide: () => void } | null } } }).bootstrap?.Modal?.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          } else {
            host.cerrarModal('documentoModal');
          }
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        host.subidaArchivo = false;
        this.fileUploadService.showUploadError(error.error || 'Error al subir el archivo');
      },
    });
  }

  eliminar(host: SolicitudesDocumentosHost, id: number | null): void {
    this.notificationService.confirm({
      title: '¿ Confirma eliminar el documento  ?',
      text: host.nombreArchivoSubido ?? '',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed || id === null) {
        return;
      }

      this.solicitudesService.deleteDocumento(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.iddocumento = null;
          host.listadocmenu = false;
          host.nombreArchivoSubido = null;
          host.descargafichero = null;
          this.gridFacade.assignDocumentosSourcePlain(host);
          this.notificationService.success({ title: 'Eliminada!', text: 'Documento eliminado satisfactoriamente!' });
        },
      });
    });
  }
}
