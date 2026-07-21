import { InsideMetadatosAdicionales } from './inside-common.models';

export interface InsideMetadatosExpedienteEni {
  versionNti: string;
  identificador: string;
  organo: string | string[];
  fechaAperturaExpediente: string;
  clasificacion: string;
  estado: string;
  interesado?: string | string[];
}

export interface InsideDocumentoIndizado {
  identificadorDocumento: string;
  valorHuella: string;
  funcionResumen: string;
  fechaIncorporacionExpediente?: string;
  ordenDocumentoExpediente?: string;
}

export interface InsideIndiceExpediente {
  fechaIndiceElectronico: string;
  documentosIndizados: InsideDocumentoIndizado[];
}

export interface InsideOpcionesVisualizacion {
  estamparImagen: boolean;
  estamparNombreOrganismo: boolean;
  estamparPie: boolean;
  textoPie: boolean;
  filasNombreOrganismo?: boolean[];
}

export interface InsideExpedienteConversion {
  metadatosEni: InsideMetadatosExpedienteEni;
  indice: InsideIndiceExpediente;
  opcionesVisualizacion: InsideOpcionesVisualizacion;
}

export interface InsideConvertirExpedienteAEniRequest {
  expediente: InsideExpedienteConversion;
}

export interface InsideConvertirExpedienteAEniConMAdicionalesRequest
  extends InsideConvertirExpedienteAEniRequest {
  metadatosAdicionales?: InsideMetadatosAdicionales;
}

export interface InsideDocumentoEniFile {
  documentoEniBytes: string;
}

export interface InsideAltaExpedienteEniXmlRequest {
  expedienteEniBytes: string;
  documentosEniFile: InsideDocumentoEniFile[];
}
