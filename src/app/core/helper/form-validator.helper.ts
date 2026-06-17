import { NotificationService } from '../service/notification.service';

export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidation?: (value: any) => boolean;
  errorMessage?: string;
}

export interface FormData {
  [key: string]: any;
}

export class FormValidatorHelper {
  
  /**
   * Valida un formulario completo y muestra notificaciones
   */
  static validateForm(
    formData: FormData, 
    rules: ValidationRule[], 
    notificationService: NotificationService
  ): boolean {
    const errors: string[] = [];
    
    for (const rule of rules) {
      const value = formData[rule.field];
      
      // Validación de campo requerido
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(rule.errorMessage || `El campo ${rule.field} es obligatorio.`);
        continue;
      }
      
      // Si el campo no es requerido y está vacío, saltamos las otras validaciones
      if (!value || value.toString().trim() === '') {
        continue;
      }
      
      // Validación de longitud mínima
      if (rule.minLength && value.toString().length < rule.minLength) {
        errors.push(rule.errorMessage || `El campo ${rule.field} debe tener al menos ${rule.minLength} caracteres.`);
      }
      
      // Validación de longitud máxima
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        errors.push(rule.errorMessage || `El campo ${rule.field} debe tener máximo ${rule.maxLength} caracteres.`);
      }
      
      // Validación de patrón
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        errors.push(rule.errorMessage || `El campo ${rule.field} no tiene el formato correcto.`);
      }
      
      // Validación personalizada
      if (rule.customValidation && !rule.customValidation(value)) {
        errors.push(rule.errorMessage || `El campo ${rule.field} no es válido.`);
      }
    }
    
    if (errors.length > 0) {
      notificationService.incompleteFields(errors.join('\n'));
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida campos específicos de un formulario y marca los campos vacíos en rojo
   */
  static validateFields(
    formData: FormData, 
    fields: string[], 
    notificationService: NotificationService
  ): boolean {
    const missingFields: string[] = [];
    
    // Limpiar estilos previos
    FormValidatorHelper.clearFieldErrors();
    
    for (const field of fields) {
      const value = formData[field];
      if (!value || value.toString().trim() === '') {
        missingFields.push(field);
        // Marcar campo en rojo
        FormValidatorHelper.markFieldAsError(field);
      }
    }
    
    if (missingFields.length > 0) {
      notificationService.incompleteFields();
      return false;
    }
    
    return true;
  }

  /**
   * Marca un campo como error (rojo)
   */
  static markFieldAsError(fieldName: string): void {
    const field = document.getElementById(fieldName) || 
                  document.querySelector(`[name="${fieldName}"]`) ||
                  document.querySelector(`[formControlName="${fieldName}"]`);
    
    if (field) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      
      // Agregar borde rojo si no tiene Bootstrap
      if (!field.classList.contains('form-control')) {
        (field as HTMLElement).style.borderColor = '#dc3545';
      }
    }
  }

  /**
   * Marca un campo como válido (solo remueve el error)
   */
  static markFieldAsValid(fieldName: string): void {
    const field = document.getElementById(fieldName) || 
                  document.querySelector(`[name="${fieldName}"]`) ||
                  document.querySelector(`[formControlName="${fieldName}"]`);
    
    if (field) {
      field.classList.remove('is-invalid');
      field.classList.remove('is-valid'); // No agregar clase verde
      
      // Remover borde rojo si no tiene Bootstrap
      if (!field.classList.contains('form-control')) {
        (field as HTMLElement).style.borderColor = '';
      }
    }
  }

  /**
   * Limpia todos los errores visuales
   */
  static clearFieldErrors(): void {
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
      field.classList.remove('is-invalid');
      if (!field.classList.contains('form-control')) {
        (field as HTMLElement).style.borderColor = '';
      }
    });
  }
  
  /**
   * Valida un campo específico
   */
  static validateField(
    value: any, 
    fieldName: string, 
    notificationService: NotificationService,
    required: boolean = true
  ): boolean {
    if (required && (!value || value.toString().trim() === '')) {
      notificationService.validationError(fieldName);
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida formato de email
   */
  static validateEmail(
    email: string, 
    notificationService: NotificationService
  ): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      notificationService.validationError('correo electrónico');
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida formato de DNI
   */
  static validateDNI(
    dni: string, 
    notificationService: NotificationService
  ): boolean {
    const dniPattern = /^\d{8}[A-Z]$/;
    
    if (!dniPattern.test(dni)) {
      notificationService.validationError('DNI');
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida que un valor esté en un rango específico
   */
  static validateRange(
    value: number, 
    min: number, 
    max: number, 
    fieldName: string, 
    notificationService: NotificationService
  ): boolean {
    if (value < min || value > max) {
      notificationService.validationError(`${fieldName} (debe estar entre ${min} y ${max})`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida que una fecha sea válida
   */
  static validateDate(
    date: string, 
    fieldName: string, 
    notificationService: NotificationService
  ): boolean {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      notificationService.validationError(`${fieldName} (fecha inválida)`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida que una fecha sea futura
   */
  static validateFutureDate(
    date: string, 
    fieldName: string, 
    notificationService: NotificationService
  ): boolean {
    const dateObj = new Date(date);
    const today = new Date();
    
    if (dateObj <= today) {
      notificationService.validationError(`${fieldName} (debe ser una fecha futura)`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida que una fecha sea pasada
   */
  static validatePastDate(
    date: string, 
    fieldName: string, 
    notificationService: NotificationService
  ): boolean {
    const dateObj = new Date(date);
    const today = new Date();
    
    if (dateObj >= today) {
      notificationService.validationError(`${fieldName} (debe ser una fecha pasada)`);
      return false;
    }
    
    return true;
  }
} 