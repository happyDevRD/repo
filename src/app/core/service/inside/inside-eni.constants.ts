export const ENI_VERSION_NTI = {
  documentoV1: 'http://administracionelectronica.gob.es/ENI/XSD/v1.0/documento-e',
  expedienteV1: 'http://administracionelectronica.gob.es/ENI/XSD/v1.0/expediente-e',
} as const;

export const ENI_FUNCION_RESUMEN_SHA256 = 'http://www.w3.org/2001/04/xmlenc#sha256';

export const ENI_ESTADO_EXPEDIENTE = {
  abierto: 'E01',
  cerrado: 'E02',
} as const;

export const ENI_TIPO_DOCUMENTAL_DEFAULT = 'TD01';

export const ENI_ESTADO_ELABORACION = {
  original: 'EE01',
  copiaAutentica: 'EE03',
  otros: 'EE99',
} as const;

export const ENI_EXPEDIENTE_ESTADO_MAP: Record<string, string> = {
  ABIERTO: ENI_ESTADO_EXPEDIENTE.abierto,
  CERRADO: ENI_ESTADO_EXPEDIENTE.cerrado,
  ARCHIVADO: ENI_ESTADO_EXPEDIENTE.cerrado,
  CANCELADO: ENI_ESTADO_EXPEDIENTE.cerrado,
};

export const ENI_VISUALIZACION_DEFAULT = {
  estamparImagen: false,
  estamparNombreOrganismo: false,
  estamparPie: false,
  textoPie: false,
} as const;
