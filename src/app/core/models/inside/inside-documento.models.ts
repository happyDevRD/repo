import {
  InsideContenidoDocumento,
  InsideFirmasDocumento,
  InsideMetadatosAdicionales,
  InsideMetadatosDocumentoEni,
} from './inside-common.models';

export interface InsideDocumentoAlta {
  contenido: InsideContenidoDocumento;
  metadatos: InsideMetadatosDocumentoEni;
  firmas?: InsideFirmasDocumento;
  metadatosAdicionales?: InsideMetadatosAdicionales;
}

export interface InsideAltaDocumentoEniRequest {
  documento: InsideDocumentoAlta;
  firmaServidor?: boolean;
}

export interface InsideAltaDocumentoEniXmlRequest {
  documentoEniBytes: string;
}

export interface InsideDocumentoConversion {
  contenido: string;
  contenidoId?: string;
  firmadoConCertificado?: boolean;
  metadatosEni: InsideMetadatosDocumentoEni;
}

export interface InsideConvertirDocumentoAEniRequest {
  documento: InsideDocumentoConversion;
  firmar?: boolean;
}

export interface InsideConvertirDocumentoAEniConMAdicionalesRequest
  extends InsideConvertirDocumentoAEniRequest {
  metadatosAdicionales?: InsideMetadatosAdicionales;
}
