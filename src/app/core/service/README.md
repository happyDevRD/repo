# Servicio de Subida de Archivos

## Descripción

El `FileUploadService` es un servicio global que proporciona funcionalidad robusta para la subida de archivos con controles de tiempo, validaciones, manejo de errores y notificaciones de progreso.

## Características

- ✅ **Validación de archivos**: Tamaño máximo y tipos permitidos
- ✅ **Conversión automática a Base64**
- ✅ **Timeouts configurables** (por defecto 5 minutos)
- ✅ **Reintentos automáticos** (por defecto 3 intentos)
- ✅ **Notificaciones de progreso** con SweetAlert2
- ✅ **Manejo de errores** detallado
- ✅ **Subida a Solicitudes y Expedientes**
- ✅ **Limpieza automática** de inputs

## Uso Básico

### 1. Importar el servicio

```typescript
import { FileUploadService, FileUploadConfig } from '../core/service/file-upload.service';

constructor(private fileUploadService: FileUploadService) {}
```

### 2. Configuración básica

```typescript
const config: FileUploadConfig = {
  maxFileSize: 50, // 50MB
  allowedTypes: ['.pdf', '.docx', '.odt', '.jpg', '.jpeg', '.png'],
  timeout: 300000, // 5 minutos
  retryAttempts: 3,
  showProgress: true
};
```

### 3. Subir archivo a una solicitud

```typescript
uploadToSolicitud(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  this.fileUploadService.uploadFileToSolicitud(file, solicitudId, descripcion, config)
    .subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Archivo subido correctamente:', response.fileName);
          // Actualizar lista de documentos, etc.
        }
      },
      error: (error) => {
        console.error('Error al subir:', error.error);
      }
    });
}
```

### 4. Subir archivo a un expediente

```typescript
uploadToExpediente(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  const expedienteData = {
    ejercicio: 2024,
    numero: 123
  };

  this.fileUploadService.uploadFileToExpediente(file, expedienteData, config)
    .subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Archivo subido correctamente:', response.fileName);
        }
      },
      error: (error) => {
        console.error('Error al subir:', error.error);
      }
    });
}
```

## Configuración Avanzada

### Configuración Personalizada

```typescript
const customConfig: FileUploadConfig = {
  maxFileSize: 100, // 100MB
  allowedTypes: ['.pdf', '.docx'], // Solo PDF y DOCX
  timeout: 600000, // 10 minutos
  retryAttempts: 5, // 5 reintentos
  showProgress: true
};
```

### Notificaciones Personalizadas

```typescript
// Mostrar progreso personalizado
this.fileUploadService.showUploadProgress('mi-archivo.pdf');

// Mostrar éxito personalizado
this.fileUploadService.showUploadSuccess('mi-archivo.pdf');

// Mostrar error personalizado
this.fileUploadService.showUploadError('Error específico del archivo');
```

## Interfaces

### FileUploadConfig

```typescript
interface FileUploadConfig {
  maxFileSize?: number; // en MB
  allowedTypes?: string[]; // extensiones permitidas
  timeout?: number; // timeout en milisegundos
  retryAttempts?: number; // número de reintentos
  showProgress?: boolean; // mostrar barra de progreso
}
```

### FileUploadResponse

```typescript
interface FileUploadResponse {
  success: boolean;
  data?: any;
  error?: string;
  fileId?: number;
  fileName?: string;
}
```

## Métodos Disponibles

### Métodos Principales

- `uploadFileToSolicitud(file, solicitudId, descripcion, config)`: Sube archivo a una solicitud
- `uploadFileToExpediente(file, expedienteData, config)`: Sube archivo a un expediente
- `convertFileToBase64(file)`: Convierte archivo a Base64
- `validateFile(file, config)`: Valida archivo antes de subir

### Métodos de Utilidad

- `showUploadProgress(fileName)`: Muestra notificación de progreso
- `showUploadSuccess(fileName)`: Muestra notificación de éxito
- `showUploadError(errorMessage)`: Muestra notificación de error
- `clearFileInput(fileInput)`: Limpia input de archivo
- `formatFileSize(bytes)`: Formatea tamaño de archivo

## Manejo de Errores

El servicio maneja automáticamente los siguientes errores:

- **Error 0**: No hay conexión con el servidor
- **Error 400**: Datos de archivo incorrectos
- **Error 413**: El archivo es demasiado grande
- **Error 500**: Error interno del servidor
- **Error 504**: Timeout del servidor

## Ejemplo Completo

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService, FileUploadConfig } from '../core/service/file-upload.service';

@Component({
  selector: 'app-upload-example',
  template: `
    <input #fileInput type="file" (change)="uploadFile($event)" accept=".pdf,.docx">
    <button (click)="uploadFile()">Subir Archivo</button>
  `
})
export class UploadExampleComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fileUploadService: FileUploadService) {}

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const config: FileUploadConfig = {
      maxFileSize: 50,
      allowedTypes: ['.pdf', '.docx'],
      timeout: 300000,
      retryAttempts: 3,
      showProgress: true
    };

    // Mostrar progreso
    this.fileUploadService.showUploadProgress(file.name);

    // Subir archivo
    this.fileUploadService.uploadFileToSolicitud(file, 1, 'Descripción del archivo', config)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.fileUploadService.showUploadSuccess(file.name);
            this.fileUploadService.clearFileInput(this.fileInput.nativeElement);
          }
        },
        error: (error) => {
          this.fileUploadService.showUploadError(error.error);
        }
      });
  }
}
```

## Migración desde el código anterior

### Antes (código duplicado)

```typescript
// En cada componente
convertToBase64(file: File, name: string, id: number, fichero: any) {
  const observable = new Observable((subscriber: Subscriber<any>) => {
    this.readFile(file, subscriber);
  });
  // ... código duplicado
}

upload(event: any, id: number) {
  // ... código duplicado para subida
}
```

### Después (usando el servicio)

```typescript
// En cualquier componente
upload(event: any, id: number) {
  const file = event.target.files[0];
  if (!file) return;

  this.fileUploadService.uploadFileToSolicitud(file, id, this.descripcion, config)
    .subscribe({
      next: (response) => {
        if (response.success) {
          // Manejar éxito
        }
      },
      error: (error) => {
        // Manejar error
      }
    });
}
```

## Beneficios

1. **Código reutilizable**: Un solo servicio para toda la aplicación
2. **Manejo robusto de errores**: Errores específicos y mensajes claros
3. **Configuración flexible**: Parámetros personalizables por caso de uso
4. **Experiencia de usuario mejorada**: Notificaciones de progreso y estado
5. **Mantenimiento simplificado**: Cambios centralizados en un solo lugar
6. **Timeouts y reintentos**: Manejo automático de problemas de red
7. **Validaciones**: Prevención de errores antes de la subida 