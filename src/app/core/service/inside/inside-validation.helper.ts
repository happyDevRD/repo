import { TareaTramiteExpporExpedi, VerExpediente } from '../../../expedientes/expedientes';
import { InsideIflowContext } from './inside-iflow.context.models';
import {
  buildIdentificadorExpedienteEni,
  filtrarTareasConDocumento,
  filtrarTareasFinalizadasConDocumento,
  resolverOrganoDesdeExpediente,
} from './inside-iflow.mapper';

export type InsideValidacionNivel = 'error' | 'advertencia';

export interface InsideValidacionMensaje {
  nivel: InsideValidacionNivel;
  codigo: string;
  mensaje: string;
}

export interface InsideValidacionResult {
  valido: boolean;
  errores: InsideValidacionMensaje[];
  advertencias: InsideValidacionMensaje[];
  documentosConvertibles: number;
  documentosFinalizados: number;
  expedienteCerrado: boolean;
  identificadorExpediente?: string;
  organoDir3?: string;
}

const ESTADOS_CERRADO = new Set(['CERRADO', 'ARCHIVADO']);

export const esExpedienteCerrado = (expediente: VerExpediente): boolean =>
  ESTADOS_CERRADO.has(String(expediente.estado ?? '').toUpperCase());

export const esTareaFinalizada = (tarea: TareaTramiteExpporExpedi): boolean =>
  tarea.fecFin != null && String(tarea.fecFin).trim() !== '';

export const esNombreArchivoPdf = (nombreArchivo?: string | null): boolean => {
  if (!nombreArchivo) {
    return true;
  }

  const nombre = String(nombreArchivo).toLowerCase();
  return nombre.endsWith('.pdf') || !nombre.includes('.');
};

export const validarExpedienteParaInside = (
  context: InsideIflowContext,
  options?: { requiereCerrado?: boolean },
): InsideValidacionResult => {
  const errores: InsideValidacionMensaje[] = [];
  const advertencias: InsideValidacionMensaje[] = [];
  const expediente = context.expediente;
  const expedienteCerrado = esExpedienteCerrado(expediente);
  const organoDir3 = resolverOrganoDesdeExpediente(expediente);
  const documentosConvertibles = filtrarTareasConDocumento(context.tareas).length;
  const documentosFinalizados = filtrarTareasFinalizadasConDocumento(context.tareas).length;

  if (!expediente.ejercicio || !expediente.numero) {
    errores.push({
      nivel: 'error',
      codigo: 'EXP_SIN_NUMERO',
      mensaje: 'El expediente no tiene ejercicio o número asignado.',
    });
  }

  if (!organoDir3 || organoDir3 === 'L99999999') {
    advertencias.push({
      nivel: 'advertencia',
      codigo: 'ORGANO_DEFAULT',
      mensaje: 'No se ha resuelto un órgano DIR3 válido; se usará el valor por defecto.',
    });
  }

  if (options?.requiereCerrado && !expedienteCerrado) {
    errores.push({
      nivel: 'error',
      codigo: 'EXP_NO_CERRADO',
      mensaje: 'El expediente debe estar cerrado para el alta ENI XML en INSIDE.',
    });
  }

  if (documentosConvertibles === 0) {
    errores.push({
      nivel: 'error',
      codigo: 'SIN_DOCUMENTOS',
      mensaje: 'No hay tareas con documento asociado en el expediente.',
    });
  }

  const tareasSinFinalizar = filtrarTareasConDocumento(context.tareas)
    .filter((tarea) => !esTareaFinalizada(tarea));

  if (tareasSinFinalizar.length > 0) {
    advertencias.push({
      nivel: 'advertencia',
      codigo: 'TAREAS_SIN_FECFIN',
      mensaje: `${tareasSinFinalizar.length} tarea(s) con documento no tienen fecha de fin.`,
    });
  }

  const tareasNoPdf = filtrarTareasConDocumento(context.tareas)
    .filter((tarea) => !esNombreArchivoPdf(tarea.nombreArchivo ? String(tarea.nombreArchivo) : null));

  if (tareasNoPdf.length > 0) {
    advertencias.push({
      nivel: 'advertencia',
      codigo: 'DOC_NO_PDF',
      mensaje: `${tareasNoPdf.length} documento(s) no parecen ser PDF.`,
    });
  }

  if (!context.interesados?.length) {
    advertencias.push({
      nivel: 'advertencia',
      codigo: 'SIN_INTERESADOS',
      mensaje: 'El expediente no tiene interesados registrados.',
    });
  }

  const identificadorExpediente = expediente.ejercicio && expediente.numero
    ? buildIdentificadorExpedienteEni(organoDir3, expediente.ejercicio, expediente.numero)
    : undefined;

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
    documentosConvertibles,
    documentosFinalizados,
    expedienteCerrado,
    identificadorExpediente,
    organoDir3,
  };
};

export const formatearValidacionHtml = (validacion: InsideValidacionResult): string => {
  const errores = validacion.errores
    .map((item) => `<li class="text-danger">${item.mensaje}</li>`)
    .join('');
  const advertencias = validacion.advertencias
    .map((item) => `<li class="text-warning">${item.mensaje}</li>`)
    .join('');

  return `
    <p><strong>Documentos convertibles:</strong> ${validacion.documentosConvertibles}</p>
    <p><strong>Documentos finalizados:</strong> ${validacion.documentosFinalizados}</p>
    <p><strong>Expediente cerrado:</strong> ${validacion.expedienteCerrado ? 'Sí' : 'No'}</p>
    ${validacion.identificadorExpediente ? `<p><strong>ID ENI:</strong> ${validacion.identificadorExpediente}</p>` : ''}
    ${errores ? `<ul>${errores}</ul>` : ''}
    ${advertencias ? `<p><strong>Advertencias:</strong></p><ul>${advertencias}</ul>` : ''}
  `;
};
