export interface InsideDatosRemisionJusticia {
  dir3Remitente: string;
  nig: string;
  claseProcedimiento: string;
  anyoProcedimiento: string;
  numeroProcedimiento: string;
  descripcion?: string;
}

export interface InsideRemisionAJusticiaRequest {
  idexpEni: string;
  dir3Juzgado: string;
  datosRemisionJusticia: InsideDatosRemisionJusticia;
}

export interface InsideConsultaEstadoRemisionRequest {
  codigoEnvioATEA: string;
}

export interface InsideComunicacionTokenExpedienteRequest {
  dir3: string;
  idexpEni: string;
  csv: string;
  uuid: string;
  endpointRemitente: string;
  datosRemisionJusticia?: InsideDatosRemisionJusticia;
}
