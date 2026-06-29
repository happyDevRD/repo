import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

export interface SubirArchivoParams {
  base64code: string;
  name: string;
  user: string | null;
  ejercicioExpediente?: number;
  numeroExpediente?: number;
}

export interface SubirArchivoHost {
  base64code?: string;
  name?: string;
  archivoSubidaEnProgreso: boolean;
  identificadorFicheroSubido?: number;
  tareatramiteexpedienteeditar: { archivo?: number };
  tareatramiteexpedientecrear: { archivo?: number };
  user: string | null;
  verExpediente?: { ejercicio?: number; numero?: number };
}

export interface ArchivoUploadHost extends SubirArchivoHost {
  id?: number;
  myimage?: string;
  archivoSubido?: unknown;
  base64EncodedString?: string;
  envioArchivo(callback?: () => void): void;
}

@Injectable()
export class EditaExpedienteArchivoService {
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private readonly http: HttpClient) {}

  uploadFile(params: SubirArchivoParams): Observable<number> {
    const url = `${environment.apiUrl}archivo/carga`;
    const datosArchivo = {
      usuContr: params.user || '',
      ejeExped: params.ejercicioExpediente ?? null,
      numExped: params.numeroExpediente ?? null,
      sNomFiche: params.name || '',
      sFichero64: params.base64code || '',
    };
    return this.http.post<number>(url, datosArchivo, { headers: this.httpHeaders });
  }

  enviarArchivo(host: SubirArchivoHost, callback?: () => void): void {
    if (!host.base64code || !host.name) {
      callback?.();
      return;
    }

    host.archivoSubidaEnProgreso = true;

    try {
      this.uploadFile({
        base64code: host.base64code,
        name: host.name,
        user: host.user,
        ejercicioExpediente: host.verExpediente?.ejercicio,
        numeroExpediente: host.verExpediente?.numero,
      }).subscribe({
        next: (response) => {
          host.identificadorFicheroSubido = response;
          host.tareatramiteexpedienteeditar.archivo = response;
          host.tareatramiteexpedientecrear.archivo = response;
          host.archivoSubidaEnProgreso = false;

          Swal.fire({
            icon: 'success',
            title: 'Archivo subido',
            text: `El archivo "${host.name}" se ha subido correctamente.`,
          });
          callback?.();
        },
        error: (error: HttpErrorResponse) => {
          host.archivoSubidaEnProgreso = false;
          let errorMessage = 'Error al subir el archivo';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'No hay conexión con el servidor';
          } else if (error.status === 413) {
            errorMessage = 'El archivo es demasiado grande';
          } else if (error.status === 400) {
            errorMessage = 'Formato de archivo no válido';
          }
          Swal.fire({ icon: 'error', title: 'Error al subir archivo', text: errorMessage });
          callback?.();
        },
      });
    } catch {
      host.archivoSubidaEnProgreso = false;
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error inesperado al procesar el archivo',
      });
      callback?.();
    }
  }

  procesarArchivoDelInput(host: ArchivoUploadHost, event: Event, id: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const name = file.name;
    this.leerArchivoComoBase64(file).subscribe({
      next: (dataUrl) => {
        host.name = name;
        host.id = id;
        host.myimage = dataUrl;
        const partes = dataUrl.split(',');
        host.base64code = partes[1];
        host.archivoSubido = event;
        host.base64EncodedString = window.btoa(unescape(encodeURIComponent(String(event))));
        host.envioArchivo();
      },
    });
  }

  private leerArchivoComoBase64(file: File): Observable<string> {
    return new Observable((subscriber) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        subscriber.next(reader.result as string);
        subscriber.complete();
      };
      reader.onerror = (error) => subscriber.error(error);
    });
  }
}
