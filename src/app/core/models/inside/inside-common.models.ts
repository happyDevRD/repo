export interface InsideMetadatoAdicional {
  tipo: string;
  nombre: string;
  valor: string;
}

export interface InsideMetadatosAdicionales {
  metadatos: InsideMetadatoAdicional[];
}

export interface InsideEstadoElaboracion {
  valorEstadoElaboracion: string;
}

export interface InsideMetadatosDocumentoEni {
  versionNti: string;
  identificador: string;
  organo: string | string[];
  fechaCaptura: string;
  origenCiudadanoAdministracion: boolean;
  estadoElaboracion: InsideEstadoElaboracion;
  tipoDocumental: string;
}

export interface InsideFirmaCsv {
  valorCsv: string;
  regulacionGeneracionCsv: string;
}

export interface InsideFirmaDocumento {
  tipoFirma: string;
  contenidoFirma: {
    csv: InsideFirmaCsv;
  };
}

export interface InsideFirmasDocumento {
  firmas: InsideFirmaDocumento[];
}

export interface InsideContenidoDocumento {
  valorBinario?: string;
  nombreFormato?: string;
}

export interface InsideSoapResponse {
  rawXml: string;
  codigoRespuesta?: string;
  descripcionRespuesta?: string;
  identificador?: string;
  csv?: string;
  codigoEnvioATEA?: string;
  uuid?: string;
  estadoRemision?: string;
}
