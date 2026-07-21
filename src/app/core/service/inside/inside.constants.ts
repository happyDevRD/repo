export const INSIDE_SOAP_ENV_NS = 'http://schemas.xmlsoap.org/soap/envelope/';

export const INSIDE_NS = {
  webService: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/WebService',
  webServiceFiles: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/WebServiceFiles',
  documentoContenido: 'http://administracionelectronica.gob.es/ENI/XSD/v1.0/documento-e/contenido',
  documentoMetadatos: 'http://administracionelectronica.gob.es/ENI/XSD/v1.0/documento-e/metadatos',
  documentoFirma: 'http://administracionelectronica.gob.es/ENI/XSD/v1.0/firma',
  documentoConversion: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/documento-e/conversion',
  documentoEniFile: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/documento-e/documentoEniFile',
  expedienteConversion: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/expediente-e/conversion',
  expedienteEniFile: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/expediente-e/expedienteEniFileConDocumentos',
  metadatosAdicionales: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/metadatosAdicionales',
  remisionNube: 'https://ssweb.seap.minhap.es/Inside/XSD/v1.0/remisionNube',
} as const;

export enum InsideSoapOperation {
  AltaDocumentoEni = 'altaDocumentoEni',
  AltaDocumentoEniXml = 'altaDocumentoEniXml',
  AltaExpedienteEniXml = 'altaExpedienteEniXml',
  ConvertirDocumentoAEni = 'convertirDocumentoAEni',
  ConvertirExpedienteAEni = 'convertirExpedienteAEni',
  ConvertirDocumentoAEniConMAdicionales = 'convertirDocumentoAEniConMAdicionales',
  ConvertirExpedienteAEniConMAdicionales = 'convertirExpedienteAEniConMAdicionales',
  ConsultaEstadoRemisionAJusticia = 'consultaEstadoRemisionAJusticia',
  RemisionAJusticia = 'remisionAJusticia',
  ComunicacionTokenExpediente = 'comunicacionTokenExpediente',
}

export enum InsideWebServiceType {
  InsideWS = 'insideWs',
  GInsideWS = 'gInsideWs',
  PuntoRemisionWS = 'puntoRemisionWs',
}

export const INSIDE_OPERATION_ENDPOINT: Record<InsideSoapOperation, InsideWebServiceType> = {
  [InsideSoapOperation.AltaDocumentoEni]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.AltaDocumentoEniXml]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.AltaExpedienteEniXml]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.ConvertirDocumentoAEni]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.ConvertirExpedienteAEni]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales]: InsideWebServiceType.GInsideWS,
  [InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales]: InsideWebServiceType.GInsideWS,
  [InsideSoapOperation.ConsultaEstadoRemisionAJusticia]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.RemisionAJusticia]: InsideWebServiceType.InsideWS,
  [InsideSoapOperation.ComunicacionTokenExpediente]: InsideWebServiceType.PuntoRemisionWS,
};

export const INSIDE_GINSIDE_OPERATIONS = new Set<InsideSoapOperation>([
  InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales,
  InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales,
]);

export const buildSoapAction = (operation: InsideSoapOperation, useFilesNamespace = false): string => {
  const namespace = useFilesNamespace ? INSIDE_NS.webServiceFiles : INSIDE_NS.webService;
  return `${namespace}/${operation}`;
};
