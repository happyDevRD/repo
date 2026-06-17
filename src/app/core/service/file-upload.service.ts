import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

export interface FileUploadConfig {
  maxFileSize?: number; // en MB
  allowedTypes?: string[]; // extensiones permitidas
  timeout?: number; // timeout en milisegundos
  retryAttempts?: number; // número de reintentos
  showProgress?: boolean; // mostrar barra de progreso
}

export interface FileUploadResponse {
  success: boolean;
  data?: any;
  error?: string;
  fileId?: number;
  fileName?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly DEFAULT_TIMEOUT = 300000; // 5 minutos
  private readonly DEFAULT_MAX_FILE_SIZE = 50; // 50 MB
  private readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private readonly ALLOWED_TYPES = ['.pdf', '.docx', '.odt', '.jpg', '.jpeg', '.png'];

  private uploadProgressSubject = new Subject<UploadProgress>();
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  private uploadStatusSubject = new Subject<string>();
  public uploadStatus$ = this.uploadStatusSubject.asObservable();

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  /**
   * Convierte un archivo a base64
   */
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remover el prefijo data:application/pdf;base64,
        resolve(base64);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * Valida un archivo antes de subirlo
   */
  validateFile(file: File, config: FileUploadConfig = {}): { valid: boolean; error?: string } {
    const maxSize = config.maxFileSize || this.DEFAULT_MAX_FILE_SIZE;
    const allowedTypes = config.allowedTypes || this.ALLOWED_TYPES;

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`
      };
    }

    // Validar tipo de archivo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Sube un archivo a solicitudes
   */
  uploadFileToSolicitud(
    file: File,
    solicitudId: number,
    descripcion: string,
    config: FileUploadConfig = {}
  ): Observable<FileUploadResponse> {
    return new Observable(observer => {
      // Validar archivo
      const validation = this.validateFile(file, config);
      if (!validation.valid) {
        observer.error({ error: validation.error });
        return;
      }

      // Mostrar progreso inicial
      this.uploadStatusSubject.next('Preparando archivo...');
      
      // Convertir a base64
      this.convertFileToBase64(file)
        .then(base64 => {
          this.uploadStatusSubject.next('Subiendo archivo...');
          
          const uploadData = {
            descripcion: descripcion,
            fechaSubida: new Date(),
            usuContr: sessionStorage.getItem('user'),
            idSolicitud: solicitudId,
            nombreArchivo: file.name,
            ficBas64: base64
          };

          const url = `${environment.apiUrl}documentoSolicitud/crear`;
          
          this.http.post(url, JSON.stringify(uploadData), { 
            headers: this.httpHeaders,
            reportProgress: true,
            observe: 'events'
          })
          .pipe(
            timeout(config.timeout || this.DEFAULT_TIMEOUT),
            retry(config.retryAttempts || this.DEFAULT_RETRY_ATTEMPTS),
            catchError(this.handleError.bind(this)),
            finalize(() => {
              this.uploadStatusSubject.next('Completado');
            })
          )
          .subscribe({
            next: (response: any) => {
              observer.next({
                success: true,
                data: response,
                fileId: response,
                fileName: file.name
              });
              observer.complete();
            },
            error: (error) => {
              observer.error({
                success: false,
                error: error.message || 'Error al subir el archivo'
              });
            }
          });
        })
        .catch(error => {
          observer.error({
            success: false,
            error: 'Error al procesar el archivo: ' + error.message
          });
        });
    });
  }

  /**
   * Sube un archivo a expedientes
   */
  uploadFileToExpediente(
    file: File,
    expedienteData: { ejercicio?: number; numero?: number },
    config: FileUploadConfig = {}
  ): Observable<FileUploadResponse> {
    return new Observable(observer => {
      // Validar archivo
      const validation = this.validateFile(file, config);
      if (!validation.valid) {
        observer.error({ error: validation.error });
        return;
      }

      // Mostrar progreso inicial
      this.uploadStatusSubject.next('Preparando archivo...');
      
      // Convertir a base64
      this.convertFileToBase64(file)
        .then(base64 => {
          this.uploadStatusSubject.next('Subiendo archivo...');
          
          const uploadData = {
            usuContr: sessionStorage.getItem('user') || '',
            ejeExped: expedienteData.ejercicio || null,
            numExped: expedienteData.numero || null,
            sNomFiche: file.name,
            sFichero64: base64
          };

          const url = `${environment.apiUrl}archivo/carga`;
          
          this.http.post(url, uploadData, { 
            headers: this.httpHeaders,
            reportProgress: true,
            observe: 'events'
          })
          .pipe(
            timeout(config.timeout || this.DEFAULT_TIMEOUT),
            retry(config.retryAttempts || this.DEFAULT_RETRY_ATTEMPTS),
            catchError(this.handleError.bind(this)),
            finalize(() => {
              this.uploadStatusSubject.next('Completado');
            })
          )
          .subscribe({
            next: (response: any) => {
              observer.next({
                success: true,
                data: response,
                fileId: response,
                fileName: file.name
              });
              observer.complete();
            },
            error: (error) => {
              observer.error({
                success: false,
                error: error.message || 'Error al subir el archivo'
              });
            }
          });
        })
        .catch(error => {
          observer.error({
            success: false,
            error: 'Error al procesar el archivo: ' + error.message
          });
        });
    });
  }

  /**
   * Maneja errores de subida
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No hay conexión con el servidor';
          break;
        case 400:
          errorMessage = 'Datos de archivo incorrectos';
          break;
        case 413:
          errorMessage = 'El archivo es demasiado grande';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 504:
          errorMessage = 'Timeout del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    this.uploadStatusSubject.next(`Error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Muestra una notificación de progreso
   */
  showUploadProgress(fileName: string): void {
    Swal.fire({
      title: 'Subiendo archivo',
      html: `
        <div class="text-center">
          <p>Subiendo: <strong>${fileName}</strong></p>
          <div class="progress mt-3">
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" style="width: 0%"></div>
          </div>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        // Suscribirse al progreso
        this.uploadProgress$.subscribe(progress => {
          const progressBar = document.querySelector('.progress-bar') as HTMLElement;
          if (progressBar) {
            progressBar.style.width = `${progress.percentage}%`;
            progressBar.textContent = `${Math.round(progress.percentage)}%`;
          }
        });

        // Suscribirse al estado
        this.uploadStatus$.subscribe(status => {
          if (status === 'Completado') {
            Swal.close();
          } else if (status.startsWith('Error:')) {
            Swal.fire({
              icon: 'error',
              title: 'Error al subir archivo',
              text: status.replace('Error: ', '')
            });
          }
        });
      }
    });
  }

  /**
   * Muestra una notificación de éxito
   */
  showUploadSuccess(fileName: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Archivo subido correctamente',
      text: `El archivo "${fileName}" se ha subido correctamente.`,
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Muestra una notificación de error
   */
  showUploadError(errorMessage: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error al subir archivo',
      text: errorMessage,
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Limpia el input de archivo
   */
  clearFileInput(fileInput: HTMLInputElement): void {
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Formatea el tamaño del archivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 