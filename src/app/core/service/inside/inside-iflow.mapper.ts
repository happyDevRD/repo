import {
  InsideAltaDocumentoEniRequest,
  InsideConvertirDocumentoAEniConMAdicionalesRequest,
  InsideConvertirDocumentoAEniRequest,
  InsideConvertirExpedienteAEniConMAdicionalesRequest,
  InsideConvertirExpedienteAEniRequest,
  InsideMetadatoAdicional,
  InsideMetadatosAdicionales,
} from '../../models/inside';
import {
  ENI_ESTADO_ELABORACION,
  ENI_ESTADO_EXPEDIENTE,
  ENI_EXPEDIENTE_ESTADO_MAP,
  ENI_FUNCION_RESUMEN_SHA256,
  ENI_TIPO_DOCUMENTAL_DEFAULT,
  ENI_VERSION_NTI,
  ENI_VISUALIZACION_DEFAULT,
} from './inside-eni.constants';
import {
  AtributoExpedienteDto,
  InsideIflowContext,
  InsideMapperOptions,
  InsideTareaDocumentoContext,
} from './inside-iflow.context.models';
import { ListarInteresados, TareaTramiteExpporExpedi, VerExpediente } from '../../../expedientes/expedientes';

const padSecuencia = (valor: number | string, longitud = 7): string =>
  String(valor).padStart(longitud, '0');

export const normalizarOrganoDir3 = (organo: string): string =>
  organo.replace(/^ES_/i, '').trim();

export const buildIdentificadorExpedienteEni = (
  organo: string,
  ejercicio: number,
  numero: number,
): string => `ES_${normalizarOrganoDir3(organo)}_${ejercicio}_EXP_${padSecuencia(numero)}`;

export const buildIdentificadorDocumentoEni = (
  organo: string,
  ejercicio: number,
  secuencia: number | string,
): string => `ES_${normalizarOrganoDir3(organo)}_${ejercicio}_${padSecuencia(secuencia)}`;

export const mapDocumentacionToEstadoElaboracion = (
  documentacion: unknown,
  tipDocEni?: string | null,
): string => {
  if (!documentacion || tipDocEni === 'TD99') {
    return ENI_ESTADO_ELABORACION.otros;
  }

  const valor = Number(documentacion);
  if (valor === 1) {
    return ENI_ESTADO_ELABORACION.original;
  }
  if (valor === 2 || valor === 3) {
    return ENI_ESTADO_ELABORACION.copiaAutentica;
  }

  return ENI_ESTADO_ELABORACION.otros;
};

export const mapOrigenCiudadano = (docAport: unknown): boolean =>
  docAport === 1 || docAport === '1' || docAport === true;

export const formatFechaEniDateTime = (fecha: string | Date | null | undefined): string => {
  if (!fecha) {
    return new Date().toISOString();
  }

  const date = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

export const formatFechaEniDate = (fecha: string | Date | null | undefined): string => {
  const iso = formatFechaEniDateTime(fecha);
  return iso.substring(0, 10);
};

export const mapTipoDocumental = (tipDocEni?: string | null): string => {
  if (!tipDocEni || tipDocEni === 'TD99') {
    return ENI_TIPO_DOCUMENTAL_DEFAULT;
  }

  return tipDocEni.replace('_', '');
};

const ordenarTareasDocumento = (
  tareas: TareaTramiteExpporExpedi[],
): TareaTramiteExpporExpedi[] =>
  [...tareas].sort((a, b) => {
    const tramiteA = Number(a.tramite ?? 0);
    const tramiteB = Number(b.tramite ?? 0);
    if (tramiteA !== tramiteB) {
      return tramiteA - tramiteB;
    }

    const numeroA = Number(a.numero ?? 0);
    const numeroB = Number(b.numero ?? 0);
    if (numeroA !== numeroB) {
      return numeroA - numeroB;
    }

    return String(a.fecInicio ?? '').localeCompare(String(b.fecInicio ?? ''));
  });

const tieneDocumentoAsociado = (tarea: TareaTramiteExpporExpedi): boolean =>
  tarea.archivo != null && tarea.archivo !== '' && tarea.archivo !== 0;

export const filtrarTareasConDocumento = (
  tareas: TareaTramiteExpporExpedi[],
): TareaTramiteExpporExpedi[] =>
  ordenarTareasDocumento(tareas.filter(tieneDocumentoAsociado));

export const filtrarTareasFinalizadasConDocumento = (
  tareas: TareaTramiteExpporExpedi[],
): TareaTramiteExpporExpedi[] =>
  ordenarTareasDocumento(
    tareas.filter(
      (tarea) => tieneDocumentoAsociado(tarea)
        && tarea.fecFin != null
        && String(tarea.fecFin).trim() !== '',
    ),
  );

export const mapInteresadosToEni = (interesados: ListarInteresados[]): string[] => {
  const documentos = interesados
    .map((interesado) => interesado.numDocumInter)
    .filter((doc): doc is string => !!doc && String(doc).trim().length > 0);

  return [...new Set(documentos.map((doc) => String(doc).trim()))];
};

export const mapAtributosToMetadatosAdicionales = (
  atributos: AtributoExpedienteDto[],
): InsideMetadatosAdicionales | undefined => {
  const metadatos = atributos
    .filter((atributo) => atributo.etiGruAtrib && atributo.valor)
    .map((atributo): InsideMetadatoAdicional => ({
      tipo: atributo.tipo ?? 'string',
      nombre: String(atributo.etiGruAtrib),
      valor: String(atributo.valor),
    }));

  if (!metadatos.length) {
    return undefined;
  }

  return { metadatos };
};

export const mapTareaToConvertirDocumentoRequest = (
  contexto: InsideTareaDocumentoContext,
  options: InsideMapperOptions,
): InsideConvertirDocumentoAEniRequest | null => {
  if (!contexto.contenidoBase64) {
    return null;
  }

  const organo = normalizarOrganoDir3(options.organoDir3);
  const ejercicio = Number(contexto.tarea.ejeExped ?? new Date().getFullYear());
  const identificador = contexto.metadatos?.identificador
    ?? buildIdentificadorDocumentoEni(organo, ejercicio, contexto.orden);

  return {
    documento: {
      contenido: contexto.contenidoBase64,
      contenidoId: identificador,
      firmadoConCertificado: false,
      metadatosEni: {
        versionNti: ENI_VERSION_NTI.documentoV1,
        identificador,
        organo,
        fechaCaptura: formatFechaEniDateTime(
          contexto.metadatos?.fecCaptura ?? String(contexto.tarea.fecFin ?? contexto.tarea.fecInicio ?? ''),
        ),
        origenCiudadanoAdministracion: mapOrigenCiudadano(contexto.tarea.docAport),
        estadoElaboracion: {
          valorEstadoElaboracion: mapDocumentacionToEstadoElaboracion(
            contexto.tarea.documentacion,
            contexto.tarea.tipDocEni ? String(contexto.tarea.tipDocEni) : null,
          ),
        },
        tipoDocumental: mapTipoDocumental(
          contexto.tarea.tipDocEni ? String(contexto.tarea.tipDocEni) : null,
        ),
      },
    },
    firmar: options.firmarDocumentos ?? false,
  };
};

export const mapTareaToAltaDocumentoRequest = (
  contexto: InsideTareaDocumentoContext,
  options: InsideMapperOptions,
): InsideAltaDocumentoEniRequest | null => {
  const conversion = mapTareaToConvertirDocumentoRequest(contexto, options);
  if (!conversion) {
    return null;
  }

  const nombreArchivo = String(contexto.tarea.nombreArchivo ?? '');
  const extension = nombreArchivo.includes('.')
    ? nombreArchivo.split('.').pop()?.toUpperCase()
    : 'PDF';

  return {
    documento: {
      contenido: {
        valorBinario: conversion.documento.contenido,
        nombreFormato: extension === 'PDF' ? 'PDF' : (extension ?? 'PDF'),
      },
      metadatos: conversion.documento.metadatosEni,
    },
    firmaServidor: options.firmarDocumentos ?? false,
  };
};

export const mapExpedienteToConvertirExpedienteRequest = (
  context: InsideIflowContext,
  documentos: InsideTareaDocumentoContext[],
  options: InsideMapperOptions,
): InsideConvertirExpedienteAEniRequest => {
  const expediente = context.expediente;
  const organo = normalizarOrganoDir3(options.organoDir3);
  const identificador = buildIdentificadorExpedienteEni(organo, expediente.ejercicio, expediente.numero);
  const clasificacion = options.clasificacion
    ?? expediente.procedimiento?.codigoSia
    ?? String(expediente.idProc ?? '');

  return {
    expediente: {
      metadatosEni: {
        versionNti: ENI_VERSION_NTI.expedienteV1,
        identificador,
        organo,
        fechaAperturaExpediente: formatFechaEniDate(expediente.fecInicio),
        clasificacion: String(clasificacion),
        estado: ENI_EXPEDIENTE_ESTADO_MAP[expediente.estado] ?? ENI_ESTADO_EXPEDIENTE.abierto,
        interesado: mapInteresadosToEni(context.interesados),
      },
      indice: {
        fechaIndiceElectronico: formatFechaEniDate(expediente.fecFin ?? new Date()),
        documentosIndizados: documentos.map((documento, index) => ({
          identificadorDocumento: documento.metadatos?.identificador
            ?? buildIdentificadorDocumentoEni(organo, expediente.ejercicio, documento.orden),
          valorHuella: documento.indice?.huella ?? '',
          funcionResumen: ENI_FUNCION_RESUMEN_SHA256,
          fechaIncorporacionExpediente: formatFechaEniDate(
            String(documento.tarea.fecFin ?? documento.tarea.fecInicio ?? ''),
          ),
          ordenDocumentoExpediente: padSecuencia(index + 1, 4),
        })),
      },
      opcionesVisualizacion: { ...ENI_VISUALIZACION_DEFAULT },
    },
  };
};

export const mapExpedienteToConvertirExpedienteConMAdicionalesRequest = (
  context: InsideIflowContext,
  documentos: InsideTareaDocumentoContext[],
  options: InsideMapperOptions,
): InsideConvertirExpedienteAEniConMAdicionalesRequest => {
  const base = mapExpedienteToConvertirExpedienteRequest(context, documentos, options);
  const metadatosAdicionales = options.incluirMetadatosAdicionales
    ? mapAtributosToMetadatosAdicionales(context.atributos)
    : undefined;

  return {
    ...base,
    metadatosAdicionales,
  };
};

export const mapTareaToConvertirDocumentoConMAdicionalesRequest = (
  contexto: InsideTareaDocumentoContext,
  options: InsideMapperOptions,
  atributos: AtributoExpedienteDto[],
): InsideConvertirDocumentoAEniConMAdicionalesRequest | null => {
  const base = mapTareaToConvertirDocumentoRequest(contexto, options);
  if (!base) {
    return null;
  }

  return {
    ...base,
    metadatosAdicionales: options.incluirMetadatosAdicionales
      ? mapAtributosToMetadatosAdicionales(atributos)
      : undefined,
  };
};

export const resolverOrganoDesdeExpediente = (expediente: VerExpediente): string => {
  const organoDepartamento = expediente.procedimiento?.departamento?.organo
    ?? expediente.procedimiento?.departamento?.cadEleme;

  if (organoDepartamento) {
    return String(organoDepartamento);
  }

  return expediente.instructor?.substring(0, 9) ?? 'EA0000000';
};
