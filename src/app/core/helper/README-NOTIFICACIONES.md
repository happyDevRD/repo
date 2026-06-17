# Sistema de Notificaciones Generales

## Descripción
Sistema estandarizado de notificaciones para toda la aplicación que utiliza SweetAlert2 para mostrar mensajes consistentes y profesionales.

## Componentes

### 1. NotificationService
Servicio principal que maneja todas las notificaciones.

**Ubicación:** `src/app/core/service/notification.service.ts`

### 2. FormValidatorHelper
Helper para validación de formularios que trabaja con el servicio de notificaciones.

**Ubicación:** `src/app/core/helper/form-validator.helper.ts`

## Uso Básico

### Importar en el componente
```typescript
import { NotificationService } from '../../core/service/notification.service';
import { FormValidatorHelper } from '../../core/helper/form-validator.helper';
```

### Inyectar en el constructor
```typescript
constructor(
  // ... otros servicios
  private notificationService: NotificationService
) {}
```

## Métodos Disponibles

### NotificationService

#### Notificaciones Simples
```typescript
// Éxito
this.notificationService.success('Operación completada exitosamente');

// Error
this.notificationService.error('Ha ocurrido un error');

// Advertencia
this.notificationService.warning('Atención: campo requerido');

// Información
this.notificationService.info('Información importante');
```

#### Notificaciones Específicas
```typescript
// Campos incompletos (como en la imagen)
this.notificationService.incompleteFields('Por favor, complete todos los campos obligatorios.');

// Error de validación
this.notificationService.validationError('correo electrónico');

// Guardado exitoso
this.notificationService.saveSuccess('Usuario');

// Eliminación exitosa
this.notificationService.deleteSuccess('Documento');

// Confirmación de eliminación
this.notificationService.confirmDelete('usuario');
```

#### Confirmaciones
```typescript
// Confirmación simple
this.notificationService.confirm('¿Está seguro de continuar?').then((result) => {
  if (result.isConfirmed) {
    // Acción confirmada
  }
});
```

### FormValidatorHelper

#### Validación de Campos Específicos
```typescript
const formData = {
  nombre: this.form.nombre,
  email: this.form.email,
  dni: this.form.dni
};

const requiredFields = ['nombre', 'email'];

if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
  return; // La validación falló y ya mostró el mensaje
}
```

#### Validación de Formulario Completo
```typescript
const rules = [
  { field: 'nombre', required: true, minLength: 2 },
  { field: 'email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { field: 'dni', required: true, pattern: /^\d{8}[A-Z]$/ }
];

if (!FormValidatorHelper.validateForm(formData, rules, this.notificationService)) {
  return;
}
```

#### Validaciones Específicas
```typescript
// Validar email
if (!FormValidatorHelper.validateEmail(email, this.notificationService)) {
  return;
}

// Validar DNI
if (!FormValidatorHelper.validateDNI(dni, this.notificationService)) {
  return;
}

// Validar campo individual
if (!FormValidatorHelper.validateField(value, 'nombre', this.notificationService)) {
  return;
}
```

## Ejemplo de Implementación Completa

```typescript
export class MiComponente {
  constructor(private notificationService: NotificationService) {}

  guardarDatos() {
    // 1. Validar campos obligatorios
    const formData = {
      nombre: this.form.nombre,
      email: this.form.email,
      telefono: this.form.telefono
    };

    const requiredFields = ['nombre', 'email'];
    
    if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
      return;
    }

    // 2. Validar formato de email
    if (!FormValidatorHelper.validateEmail(formData.email, this.notificationService)) {
      return;
    }

    // 3. Procesar guardado
    this.miService.guardar(formData).subscribe(
      (response) => {
        this.notificationService.saveSuccess('Usuario');
        this.limpiarFormulario();
      },
      (error) => {
        this.notificationService.error('Error al guardar los datos');
      }
    );
  }

  eliminarElemento() {
    this.notificationService.confirmDelete('usuario').then((result) => {
      if (result.isConfirmed) {
        this.miService.eliminar(this.id).subscribe(
          (response) => {
            this.notificationService.deleteSuccess('Usuario');
            this.cargarDatos();
          },
          (error) => {
            this.notificationService.error('Error al eliminar');
          }
        );
      }
    });
  }
}
```

## Migración de Código Existente

### Antes (SweetAlert directo)
```typescript
swal.fire({
  title: 'Campos incompletos',
  text: 'Por favor, complete todos los campos obligatorios.',
  icon: 'warning',
  confirmButtonText: 'OK'
});
```

### Después (Sistema estandarizado)
```typescript
this.notificationService.incompleteFields();
```

### Antes (Validación manual)
```typescript
if (!this.form.nombre || !this.form.email) {
  swal.fire('Debe rellenar todos los campos obligatorios.');
  return;
}
```

### Después (Validación estandarizada)
```typescript
const formData = { nombre: this.form.nombre, email: this.form.email };
const requiredFields = ['nombre', 'email'];

if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
  return;
}
```

## Beneficios

1. **Consistencia visual**: Todos los mensajes se ven igual
2. **Mantenibilidad**: Cambios centralizados en un solo lugar
3. **Reutilización**: Métodos específicos para casos comunes
4. **Validación robusta**: Sistema de validación integrado
5. **Experiencia de usuario**: Mensajes claros y profesionales
6. **Accesibilidad**: Mejor soporte para lectores de pantalla

## Próximos Pasos

1. Migrar todos los componentes existentes al nuevo sistema
2. Crear validaciones específicas para cada tipo de formulario
3. Implementar notificaciones automáticas para errores de red
4. Agregar soporte para múltiples idiomas 