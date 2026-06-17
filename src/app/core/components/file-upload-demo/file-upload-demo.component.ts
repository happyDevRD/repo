import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService, FileUploadConfig } from '../../service/file-upload.service';

@Component({
  selector: 'app-file-upload-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="file-upload-demo">
      <h3>Demo de Subida de Archivos</h3>
      
      <div class="upload-section">
        <h4>Subir a Solicitud</h4>
        <div class="form-group">
          <label for="solicitudId">ID de Solicitud:</label>
          <input type="number" id="solicitudId" [(ngModel)]="solicitudId" class="form-control">
        </div>
        
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" [(ngModel)]="descripcion" class="form-control"></textarea>
        </div>
        
        <div class="form-group">
          <label for="fileSolicitud">Archivo:</label>
          <input type="file" #fileInputSolicitud (change)="uploadToSolicitud($event)" 
                 accept=".pdf,.docx,.odt,.jpg,.jpeg,.png" class="form-control">
        </div>
      </div>

      <div class="upload-section">
        <h4>Subir a Expediente</h4>
        <div class="form-group">
          <label for="ejercicio">Ejercicio:</label>
          <input type="number" id="ejercicio" [(ngModel)]="ejercicio" class="form-control">
        </div>
        
        <div class="form-group">
          <label for="numero">Número:</label>
          <input type="number" id="numero" [(ngModel)]="numero" class="form-control">
        </div>
        
        <div class="form-group">
          <label for="fileExpediente">Archivo:</label>
          <input type="file" #fileInputExpediente (change)="uploadToExpediente($event)" 
                 accept=".pdf,.docx,.odt,.jpg,.jpeg,.png" class="form-control">
        </div>
      </div>

      <div class="config-section">
        <h4>Configuración</h4>
        <div class="form-group">
          <label for="maxSize">Tamaño máximo (MB):</label>
          <input type="number" id="maxSize" [(ngModel)]="config.maxFileSize" class="form-control">
        </div>
        
        <div class="form-group">
          <label for="timeout">Timeout (ms):</label>
          <input type="number" id="timeout" [(ngModel)]="config.timeout" class="form-control">
        </div>
        
        <div class="form-group">
          <label for="retries">Reintentos:</label>
          <input type="number" id="retries" [(ngModel)]="config.retryAttempts" class="form-control">
        </div>
      </div>

      <div class="status-section">
        <h4>Estado de la Subida</h4>
        <div class="alert" [ngClass]="statusClass">{{ statusMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-demo {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .upload-section, .config-section, .status-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .alert {
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .alert-info {
      background-color: #d1ecf1;
      border-color: #bee5eb;
      color: #0c5460;
    }
    
    .alert-success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
  `]
})
export class FileUploadDemoComponent {
  @ViewChild('fileInputSolicitud') fileInputSolicitud!: ElementRef;
  @ViewChild('fileInputExpediente') fileInputExpediente!: ElementRef;

  solicitudId: number = 1;
  descripcion: string = '';
  ejercicio: number = new Date().getFullYear();
  numero: number = 1;
  
  config: FileUploadConfig = {
    maxFileSize: 50,
    allowedTypes: ['.pdf', '.docx', '.odt', '.jpg', '.jpeg', '.png'],
    timeout: 300000,
    retryAttempts: 3,
    showProgress: true
  };

  statusMessage: string = 'Listo para subir archivos';
  statusClass: string = 'alert-info';

  constructor(private fileUploadService: FileUploadService) {}

  uploadToSolicitud(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.descripcion.trim()) {
      this.showStatus('Por favor, ingresa una descripción', 'danger');
      return;
    }

    this.showStatus('Iniciando subida a solicitud...', 'info');
    
    this.fileUploadService.uploadFileToSolicitud(file, this.solicitudId, this.descripcion, this.config)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showStatus(`Archivo "${file.name}" subido correctamente a la solicitud`, 'success');
            this.clearFileInput(this.fileInputSolicitud);
          }
        },
        error: (error) => {
          this.showStatus(`Error: ${error.error || 'Error al subir el archivo'}`, 'danger');
        }
      });
  }

  uploadToExpediente(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.showStatus('Iniciando subida a expediente...', 'info');
    
    const expedienteData = {
      ejercicio: this.ejercicio,
      numero: this.numero
    };

    this.fileUploadService.uploadFileToExpediente(file, expedienteData, this.config)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showStatus(`Archivo "${file.name}" subido correctamente al expediente`, 'success');
            this.clearFileInput(this.fileInputExpediente);
          }
        },
        error: (error) => {
          this.showStatus(`Error: ${error.error || 'Error al subir el archivo'}`, 'danger');
        }
      });
  }

  private showStatus(message: string, type: 'info' | 'success' | 'danger'): void {
    this.statusMessage = message;
    this.statusClass = `alert-${type}`;
  }

  private clearFileInput(elementRef: ElementRef): void {
    if (elementRef && elementRef.nativeElement) {
      this.fileUploadService.clearFileInput(elementRef.nativeElement);
    }
  }
} 