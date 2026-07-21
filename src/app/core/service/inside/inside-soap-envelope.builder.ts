import { create } from 'xmlbuilder2';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import {
  InsideAltaDocumentoEniRequest,
  InsideAltaDocumentoEniXmlRequest,
  InsideAltaExpedienteEniXmlRequest,
  InsideComunicacionTokenExpedienteRequest,
  InsideConsultaEstadoRemisionRequest,
  InsideConvertirDocumentoAEniConMAdicionalesRequest,
  InsideConvertirDocumentoAEniRequest,
  InsideConvertirExpedienteAEniConMAdicionalesRequest,
  InsideConvertirExpedienteAEniRequest,
  InsideMetadatoAdicional,
  InsideMetadatosAdicionales,
  InsideMetadatosDocumentoEni,
  InsideMetadatosExpedienteEni,
  InsideRemisionAJusticiaRequest,
} from '../../models/inside';
import {
  INSIDE_GINSIDE_OPERATIONS,
  INSIDE_NS,
  INSIDE_SOAP_ENV_NS,
  InsideSoapOperation,
} from './inside.constants';

const toArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

const appendMetadatosAdicionales = (
  parent: XMLBuilder,
  metadatosAdicionales: InsideMetadatosAdicionales | undefined,
  prefix: string,
): void => {
  if (!metadatosAdicionales?.metadatos?.length) {
    return;
  }

  const metadatosNode = parent.ele('metadatosAdicionales');
  for (const metadato of metadatosAdicionales.metadatos) {
    appendMetadatoAdicional(metadatosNode, metadato, prefix);
  }
};

const appendMetadatoAdicional = (
  parent: XMLBuilder,
  metadato: InsideMetadatoAdicional,
  prefix: string,
): void => {
  parent
    .ele(`${prefix}:MetadatoAdicional`, { tipo: metadato.tipo, nombre: metadato.nombre })
    .ele(`${prefix}:valor`)
    .txt(metadato.valor)
    .up()
    .up();
};

const appendMetadatosDocumentoEni = (
  parent: XMLBuilder,
  metadatos: InsideMetadatosDocumentoEni,
  prefix: string,
): void => {
  const metadatosNode = parent.ele(`${prefix}:metadatosEni`);
  metadatosNode.ele(`${prefix}:VersionNTI`).txt(metadatos.versionNti).up();
  metadatosNode.ele(`${prefix}:Identificador`).txt(metadatos.identificador).up();

  for (const organo of toArray(metadatos.organo)) {
    metadatosNode.ele(`${prefix}:Organo`).txt(organo).up();
  }

  metadatosNode.ele(`${prefix}:FechaCaptura`).txt(metadatos.fechaCaptura).up();
  metadatosNode
    .ele(`${prefix}:OrigenCiudadanoAdministracion`)
    .txt(String(metadatos.origenCiudadanoAdministracion))
    .up();
  metadatosNode
    .ele(`${prefix}:EstadoElaboracion`)
    .ele('met:ValorEstadoElaboracion')
    .txt(metadatos.estadoElaboracion.valorEstadoElaboracion)
    .up()
    .up();
  metadatosNode.ele(`${prefix}:TipoDocumental`).txt(metadatos.tipoDocumental).up();
};

const appendMetadatosExpedienteEni = (
  parent: XMLBuilder,
  metadatos: InsideMetadatosExpedienteEni,
  prefix: string,
): void => {
  const metadatosNode = parent.ele(`${prefix}:metadatosEni`);
  metadatosNode.ele(`${prefix}:VersionNTI`).txt(metadatos.versionNti).up();
  metadatosNode.ele(`${prefix}:Identificador`).txt(metadatos.identificador).up();

  for (const organo of toArray(metadatos.organo)) {
    metadatosNode.ele(`${prefix}:Organo`).txt(organo).up();
  }

  metadatosNode
    .ele(`${prefix}:FechaAperturaExpediente`)
    .txt(metadatos.fechaAperturaExpediente)
    .up();
  metadatosNode.ele(`${prefix}:Clasificacion`).txt(metadatos.clasificacion).up();
  metadatosNode.ele(`${prefix}:Estado`).txt(metadatos.estado).up();

  if (metadatos.interesado) {
    for (const interesado of toArray(metadatos.interesado)) {
      metadatosNode.ele(`${prefix}:Interesado`).txt(interesado).up();
    }
  }
};

const createSoapEnvelope = (operation: InsideSoapOperation, namespaces: Record<string, string>): XMLBuilder => {
  const webNamespace = INSIDE_GINSIDE_OPERATIONS.has(operation)
    ? INSIDE_NS.webServiceFiles
    : INSIDE_NS.webService;

  return create({ version: '1.0', encoding: 'UTF-8' })
    .ele('soapenv:Envelope', {
      'xmlns:soapenv': INSIDE_SOAP_ENV_NS,
      'xmlns:web': webNamespace,
      ...namespaces,
    })
    .ele('soapenv:Header')
    .up()
    .ele('soapenv:Body');
};

export const buildAltaDocumentoEniEnvelope = (request: InsideAltaDocumentoEniRequest): string => {
  const body = createSoapEnvelope(InsideSoapOperation.AltaDocumentoEni, {
    'xmlns:con': INSIDE_NS.documentoContenido,
    'xmlns:met': INSIDE_NS.documentoMetadatos,
    'xmlns:fir': INSIDE_NS.documentoFirma,
    'xmlns:met1': INSIDE_NS.metadatosAdicionales,
  });

  const operation = body.ele('web:altaDocumentoEni');
  const documento = operation.ele('documento');

  const contenido = documento.ele('con:contenido');
  if (request.documento.contenido.valorBinario) {
    contenido.ele('con:ValorBinario').txt(request.documento.contenido.valorBinario).up();
  }
  if (request.documento.contenido.nombreFormato) {
    contenido.ele('con:NombreFormato').txt(request.documento.contenido.nombreFormato).up();
  }
  contenido.up();

  const metadatos = documento.ele('met:metadatos');
  metadatos.ele('met:VersionNTI').txt(request.documento.metadatos.versionNti).up();
  metadatos.ele('met:Identificador').txt(request.documento.metadatos.identificador).up();
  for (const organo of toArray(request.documento.metadatos.organo)) {
    metadatos.ele('met:Organo').txt(organo).up();
  }
  metadatos.ele('met:FechaCaptura').txt(request.documento.metadatos.fechaCaptura).up();
  metadatos
    .ele('met:OrigenCiudadanoAdministracion')
    .txt(String(request.documento.metadatos.origenCiudadanoAdministracion))
    .up();
  metadatos
    .ele('met:EstadoElaboracion')
    .ele('met:ValorEstadoElaboracion')
    .txt(request.documento.metadatos.estadoElaboracion.valorEstadoElaboracion)
    .up()
    .up();
  metadatos.ele('met:TipoDocumental').txt(request.documento.metadatos.tipoDocumental).up();
  metadatos.up();

  if (request.documento.firmas?.firmas?.length) {
    const firmasNode = documento.ele('fir:firmas');
    for (const firma of request.documento.firmas.firmas) {
      firmasNode
        .ele('fir:firma')
        .ele('fir:TipoFirma')
        .txt(firma.tipoFirma)
        .up()
        .ele('fir:ContenidoFirma')
        .ele('fir:CSV')
        .ele('fir:ValorCSV')
        .txt(firma.contenidoFirma.csv.valorCsv)
        .up()
        .ele('fir:RegulacionGeneracionCSV')
        .txt(firma.contenidoFirma.csv.regulacionGeneracionCsv)
        .up()
        .up()
        .up()
        .up();
    }
    firmasNode.up();
  }

  documento.up();

  if (request.firmaServidor !== undefined) {
    operation.ele('firmaServidor').txt(String(request.firmaServidor)).up();
  }

  return body.root().end({ prettyPrint: false });
};

export const buildAltaDocumentoEniXmlEnvelope = (request: InsideAltaDocumentoEniXmlRequest): string => {
  const body = createSoapEnvelope(InsideSoapOperation.AltaDocumentoEniXml, {
    'xmlns:doc': INSIDE_NS.documentoEniFile,
  });

  body
    .ele('web:altaDocumentoEniXml')
    .ele('documentoEniFile')
    .ele('doc:documentoEniBytes')
    .txt(request.documentoEniBytes)
    .up()
    .up()
    .up();

  return body.root().end({ prettyPrint: false });
};

export const buildAltaExpedienteEniXmlEnvelope = (request: InsideAltaExpedienteEniXmlRequest): string => {
  const body = createSoapEnvelope(InsideSoapOperation.AltaExpedienteEniXml, {
    'xmlns:exp': INSIDE_NS.expedienteEniFile,
    'xmlns:doc': INSIDE_NS.documentoEniFile,
  });

  const expedienteNode = body.ele('web:altaExpedienteEniXml').ele('expedienteEniFile');
  expedienteNode.ele('exp:expedienteEniBytes').txt(request.expedienteEniBytes).up();

  for (const documento of request.documentosEniFile) {
    expedienteNode
      .ele('exp:documentosEniFile')
      .ele('doc:documentoEniBytes')
      .txt(documento.documentoEniBytes)
      .up()
      .up();
  }

  return body.root().end({ prettyPrint: false });
};

export const buildConvertirDocumentoAEniEnvelope = (
  request: InsideConvertirDocumentoAEniRequest,
  operation: InsideSoapOperation.ConvertirDocumentoAEni | InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales,
): string => {
  const isGInside = operation === InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales;
  const body = createSoapEnvelope(operation, {
    'xmlns:con': INSIDE_NS.documentoConversion,
    'xmlns:met': INSIDE_NS.documentoMetadatos,
    ...(isGInside ? { 'xmlns:met1': INSIDE_NS.metadatosAdicionales } : {}),
  });

  const operationNode = body.ele(`web:${operation}`);
  const documento = operationNode.ele('documento');
  documento.ele('con:contenido').txt(request.documento.contenido).up();

  if (request.documento.contenidoId) {
    documento.ele('con:contenidoId').txt(request.documento.contenidoId).up();
  }

  if (request.documento.firmadoConCertificado !== undefined) {
    documento
      .ele('con:firmadoConCertificado')
      .txt(String(request.documento.firmadoConCertificado))
      .up();
  }

  appendMetadatosDocumentoEni(documento, request.documento.metadatosEni, 'con');
  documento.up();

  if (isGInside) {
    appendMetadatosAdicionales(
      operationNode,
      (request as InsideConvertirDocumentoAEniConMAdicionalesRequest).metadatosAdicionales,
      'met1',
    );
  }

  if (request.firmar !== undefined) {
    operationNode.ele('firmar').txt(String(request.firmar)).up();
  }

  return body.root().end({ prettyPrint: false });
};

export const buildConvertirExpedienteAEniEnvelope = (
  request: InsideConvertirExpedienteAEniRequest,
  operation: InsideSoapOperation.ConvertirExpedienteAEni | InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales,
): string => {
  const isGInside = operation === InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales;
  const body = createSoapEnvelope(operation, {
    'xmlns:con': INSIDE_NS.expedienteConversion,
    ...(isGInside ? { 'xmlns:met': INSIDE_NS.metadatosAdicionales } : {}),
  });

  const operationNode = body.ele(`web:${operation}`);
  const expediente = operationNode.ele('expediente');

  appendMetadatosExpedienteEni(expediente, request.expediente.metadatosEni, 'con');

  const indice = expediente.ele('con:Indice');
  indice.ele('con:FechaIndiceElectronico').txt(request.expediente.indice.fechaIndiceElectronico).up();

  for (const documentoIndizado of request.expediente.indice.documentosIndizados) {
    const docNode = indice.ele('con:DocumentoIndizado');
    docNode.ele('con:IdentificadorDocumento').txt(documentoIndizado.identificadorDocumento).up();
    docNode.ele('con:ValorHuella').txt(documentoIndizado.valorHuella).up();
    docNode.ele('con:FuncionResumen').txt(documentoIndizado.funcionResumen).up();

    if (documentoIndizado.fechaIncorporacionExpediente) {
      docNode
        .ele('con:FechaIncorporacionExpediente')
        .txt(documentoIndizado.fechaIncorporacionExpediente)
        .up();
    }

    if (documentoIndizado.ordenDocumentoExpediente) {
      docNode.ele('con:OrdenDocumentoExpediente').txt(documentoIndizado.ordenDocumentoExpediente).up();
    }

    docNode.up();
  }

  indice.up();

  const opciones = expediente.ele('con:OpcionesVisualizacion');
  const visualizacion = request.expediente.opcionesVisualizacion;
  opciones.ele('con:EstamparImagen').txt(String(visualizacion.estamparImagen)).up();
  opciones.ele('con:EstamparNombreOrganismo').txt(String(visualizacion.estamparNombreOrganismo)).up();
  opciones.ele('con:EstamparPie').txt(String(visualizacion.estamparPie)).up();
  opciones.ele('con:TextoPie').txt(String(visualizacion.textoPie)).up();

  if (visualizacion.filasNombreOrganismo?.length) {
    const filasNode = opciones.ele('con:FilasNombreOrganismo');
    for (const fila of visualizacion.filasNombreOrganismo) {
      filasNode.ele('con:Fila').txt(String(fila)).up();
    }
    filasNode.up();
  }

  opciones.up();
  expediente.up();

  if (isGInside) {
    appendMetadatosAdicionales(
      operationNode,
      (request as InsideConvertirExpedienteAEniConMAdicionalesRequest).metadatosAdicionales,
      'met',
    );
  }

  return body.root().end({ prettyPrint: false });
};

export const buildConsultaEstadoRemisionEnvelope = (
  request: InsideConsultaEstadoRemisionRequest,
): string => {
  const body = createSoapEnvelope(InsideSoapOperation.ConsultaEstadoRemisionAJusticia, {});

  body
    .ele('web:consultaEstadoRemisionAJusticia')
    .ele('codigoEnvioATEA')
    .txt(request.codigoEnvioATEA)
    .up()
    .up();

  return body.root().end({ prettyPrint: false });
};

export const buildRemisionAJusticiaEnvelope = (request: InsideRemisionAJusticiaRequest): string => {
  const body = createSoapEnvelope(InsideSoapOperation.RemisionAJusticia, {
    'xmlns:rem': INSIDE_NS.remisionNube,
  });

  const operation = body.ele('web:remisionAJusticia').ele('peticionRemisionAJusticiaType');
  operation.ele('rem:idexp_eni').txt(request.idexpEni).up();
  operation.ele('rem:dir3Juzgado').txt(request.dir3Juzgado).up();

  const datos = operation.ele('rem:datosRemisionJusticia');
  datos.ele('rem:dir3Remitente').txt(request.datosRemisionJusticia.dir3Remitente).up();
  datos.ele('rem:nig').txt(request.datosRemisionJusticia.nig).up();
  datos.ele('rem:claseProcedimiento').txt(request.datosRemisionJusticia.claseProcedimiento).up();
  datos.ele('rem:anyoProcedimiento').txt(request.datosRemisionJusticia.anyoProcedimiento).up();
  datos.ele('rem:numeroProcedimiento').txt(request.datosRemisionJusticia.numeroProcedimiento).up();

  if (request.datosRemisionJusticia.descripcion) {
    datos.ele('rem:descripcion').txt(request.datosRemisionJusticia.descripcion).up();
  }

  return body.root().end({ prettyPrint: false });
};

export const buildComunicacionTokenExpedienteEnvelope = (
  request: InsideComunicacionTokenExpedienteRequest,
): string => {
  const body = createSoapEnvelope(InsideSoapOperation.ComunicacionTokenExpediente, {
    'xmlns:rem': INSIDE_NS.remisionNube,
  });

  const operation = body.ele('web:comunicacionTokenExpediente').ele('peticionComunicacionTokenExpedienteType');

  operation.ele('rem:peticion').ele('rem:dir3').txt(request.dir3).up().up();
  operation
    .ele('rem:token')
    .ele('rem:idexp_eni')
    .txt(request.idexpEni)
    .up()
    .ele('rem:csv')
    .txt(request.csv)
    .up()
    .ele('rem:uuid')
    .txt(request.uuid)
    .up()
    .up();

  if (request.datosRemisionJusticia) {
    const datos = operation.ele('rem:datosRemisionJusticia');
    datos.ele('rem:dir3Remitente').txt(request.datosRemisionJusticia.dir3Remitente).up();
    datos.ele('rem:nig').txt(request.datosRemisionJusticia.nig).up();
    datos.ele('rem:claseProcedimiento').txt(request.datosRemisionJusticia.claseProcedimiento).up();
    datos.ele('rem:anyoProcedimiento').txt(request.datosRemisionJusticia.anyoProcedimiento).up();
    datos.ele('rem:numeroProcedimiento').txt(request.datosRemisionJusticia.numeroProcedimiento).up();

    if (request.datosRemisionJusticia.descripcion) {
      datos.ele('rem:descripcion').txt(request.datosRemisionJusticia.descripcion).up();
    }
  }

  operation.ele('rem:endpoint_remitente').txt(request.endpointRemitente).up();

  return body.root().end({ prettyPrint: false });
};
