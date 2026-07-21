import { ListarInteresados, TareaTramiteExpporExpedi, VerExpediente, VerMetadatos } from '../../../expedientes/expedientes';
import { InsideValidacionResult } from './inside-validation.helper';

export interface IndiceEniDto {
  archivo?: string;
  nombre?: string;
  huella?: string;
  total?: string;
}

export interface AtributoExpedienteDto {
  etiGruAtrib?: string;
  valor?: string;
  tipo?: string;
}

export interface InsideIflowContext {
  expediente: VerExpediente;
  tareas: TareaTramiteExpporExpedi[];
  interesados: ListarInteresados[];
  indiceEni: IndiceEniDto[];
  atributos: AtributoExpedienteDto[];
}

export interface InsideTareaDocumentoContext {
  tarea: TareaTramiteExpporExpedi;
  metadatos?: VerMetadatos;
  indice?: IndiceEniDto;
  contenidoBase64?: string;
  orden: number;
}

export interface InsideMapperOptions {
  organoDir3: string;
  clasificacion?: string;
  firmarDocumentos?: boolean;
  firmarExpediente?: boolean;
  incluirMetadatosAdicionales?: boolean;
}

export interface InsideEniXmlBase64Dto {
  base64?: string;
  nombreArchivo?: string;
  encontrado: boolean;
  mensaje?: string;
}

export interface InsidePreparacionEnvio {
  validacion: InsideValidacionResult;
  expedienteId: number;
  documentosPreparados: number;
  modoDryRun: boolean;
}
