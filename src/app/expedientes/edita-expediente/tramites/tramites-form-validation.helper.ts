import { CrearTramiteExp } from '../../expedientes';
import { fechaTramitePorDefecto } from './tramites-validacion.helper';

export function validarFormularioBootstrap(event: Event): boolean {
  const form = event.target as HTMLFormElement;
  if (!form) {
    return true;
  }
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    event.preventDefault();
    return false;
  }
  return true;
}

export function limpiarErroresFormularioTramite(formId: string, reset = false): void {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) {
    return;
  }
  form.classList.remove('was-validated');
  if (reset) {
    form.reset();
  }
}

export function crearTramiteExpVacio(): CrearTramiteExp {
  const tramite = new CrearTramiteExp();
  tramite.fecTramite = fechaTramitePorDefecto();
  return tramite;
}

export function aplicarFechaTramitePorDefecto(tramite: CrearTramiteExp): void {
  tramite.fecTramite = fechaTramitePorDefecto();
}
