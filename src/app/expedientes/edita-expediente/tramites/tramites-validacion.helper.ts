import { CrearTramiteExp } from '../../expedientes';

export type ValidacionTramiteResult = 'incomplete' | string | null;

export function validarCrearTramite(tramite: CrearTramiteExp): ValidacionTramiteResult {
  if (!tramite.descripcion || !tramite.fase) {
    return 'incomplete';
  }
  if (tramite.descripcion.length < 1) {
    return 'La descripción debe tener al menos 1 carácter.';
  }
  if (tramite.descripcion.length > 500) {
    return 'La descripción no puede exceder los 500 caracteres.';
  }
  return null;
}

export function fechaTramitePorDefecto(): string {
  return new Date().toISOString().split('T')[0];
}
