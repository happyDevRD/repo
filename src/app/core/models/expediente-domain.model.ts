import { PersonaEntidadDto } from './expediente.dto'

export class Expedientes {
}


/** Procedimiento embebido en filas del listado de expedientes. */
export interface ExpedienteListarProcedimiento {
  id: number | string
  descripcion?: string
  departamento?: {
    idOrgEleme?: string | number
    idOrgan?: string | number
    cadEleme?: string
    desEleme?: string
    accesible?: string | boolean
    organo?: string
    usuContr?: string
    idOrgElePadre?: string | number
    fecContr?: string
  }
  codigoSia?: string
  usuContr?: string
  fecContr?: string
}

export class ExpedienteListar {
  id!: number;
  ejercicio!: number;
  estado!: string;
  fase!: string;
  fecArchivo!: string | null;
  fecCancelacion!: string | null
  fecFin!: string | null;
  fecInicio!: string;
  formaApertura!: string
  numero!: number;
  titulo!: string;
  departamento!: string;
  instructor!: string;
  solicitud!: string;
  usuContr!: string;
  fecContr!: string | null;
  forNotif!: number | string | null;
  /** Presente en filas del grid (no siempre en el DTO base). */
  email?: string | null;
  idHisDocum?: number | string | null;
  insideEstado?: string;
  personaEntidad?: Pick<PersonaEntidadDto, 'desPerEntid'> | null;
  procedimiento: ExpedienteListarProcedimiento = {
    id: "",
    descripcion: "",
    departamento: {
      idOrgEleme: "",
      idOrgan: "",
      cadEleme: "",
      desEleme: "",
      accesible: "",
      organo: "",
      usuContr: "",
      idOrgElePadre: "",
      fecContr: ""
    },
    codigoSia: "",
    usuContr: "",
    fecContr: ""

  }

}

export class VerExpedientesInstructor {
  id!: number | string;
  ejercicio!: string;
  estado!: string;
  fase!: string;
  fecArchivo!: string | null;
  fecCancelacion!: string | null;
  fecFin!: string | null;
  fecInicio!: string;
  formaApertura!: string;
  numero!: string;
  titulo!: string;
  departamento!: string;
  instructor!: string;
  procedimiento!: string;
  solicitud!: string;
  idPerso!: string;
  idHisPerso!: string;
  idRepre!: string;
  idHisRepre!: string;
  idDocum!: string;
  idHisDocum!: string;
  archivo!: string;
  usuContr!: string;
  fecContr!: string;
}

export class TareaTramiteExpporExpedi {
  id!: number;
  descripcion!: string;
  fecFin!: string | null;
  fecInicio!: string | null;
  firmante!: string | number | null;
  numero!: number;
  visible!: boolean | number | null;
  archivo!: number | string | null;
  tareaProcedimiento!: number | string | null;
  tramite!: number | string | null;
  usuario!: string;
  notificacion!: number | string | null;
  firmado!: number | boolean | null;
  propuestaResolucion!: string | number | null;
  idHisDocum!: number | string | null;
  idDocum!: number | string | null;
  tramitador!: number | string | null;
  usuContr!: string;
  numRegis!: string | number | null;
  color!: string;
  fecPlazo!: string | null;
  tipAnexo!: number | string | null;
  docAport!: number | string | null;
  tipDocEni!: string;
  documentacion!: number | string | null;
  nombreArchivo!: string;
  ejeNumNotif!: number | string | null;
  idAnunc!: number | string | null;
  desTramite!: string;
  ejeExped!: number | string | null;
  numExped!: number | string | null;
  titulo!: string;
  fecFinPlazo!: string | null;
}

export class VerTareaTramiteExpporUsuario {

  id: number;
  descripcion: string;
  fecFin: string;
  fecInicio: string;
  firmante: string;
  numero: number;
  visible: Boolean;
  archivo: string;
  tareaProcedimiento: string;
  tramite: string;
  usuario: string;
  notificacion!: number | string | null;
  firmado!: number;
  propuestaResolucion!: string | number | null;
  idHisDocum!: number | string | null;
  idDocum!: number | string | null;
  tramitador!: number | string | null;
  usuContr!: string;
  numRegis!: string | number | null;
  color!: string;
  fecPlazo!: string;
  tipAnexo!: number;
  docAport!: number | string | null;
  tipDocEni!: string;
  documentacion!: number;
  nombreArchivo!: string;
  ejeNumNotif!: number | string | null;
  idAnunc!: number;
  desTramite: string;
  ejeExped: string;
  numExped: number;
  titulo: string;
  fecFinPlazo: string;


}

export class VerExpedienteOLD {

  id!: number;
  ejercicio!: number;
  estado!: string
  fase!: string
  fecArchivo!: string | null;
  fecCancelacion!: string | null;
  fecFin!: string | null;
  fecInicio!: string;
  formaApertura!: string;
  numero!: number;
  titulo!: string;
  departamento!: number;
  instructor!: string;
  solicitud!: number | string | null;
  usuContr!: string;
  fecContr!: string | null;
  idProc!: number;
  idSolic!: number | string | null
  personaEntidad!: ExpedientePersonaEntidadResumen | null;
  procedimiento!: number;
}

export class ModeloTeuListar {
  idModel!: number;
  estActiv!: number;
  desModel!: string;
  titModel!: string;
  texLegal!: string;
  texLegalIdioma!: string;
  camp01!: string;
  camp02!: string;
  camp03!: string;
  camp04!: string;
  camp05!: string;
  camp06!: string;
  camp07!: string;
  camp08!: string;
  camp09!: string;
  camp10!: string;
  camp11!: string;
  usuContr!: string;
  fecContr!: Date

}

export class ModeloTeuCrear {
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecGener!: string;
  datPerso!: boolean;
  idMater!: string;
  descripcion!: string;
  email!: string;
  url!: string;
  forPubli!: number;
  procedimiento!: string;
  idModel!: number;
  incLgt!: boolean;
  texlegal!: string;
  texPlura!: boolean;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecSolic!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecFirma!: string;
  firmante!: string

}

export class TemaDocumentoListar {
  codTema!: string;
  desTema!: string;
  extracto!: string;
  idOrgEleme!: number;
  indActiv!: boolean;
  codProc!: number;
  usuContr!: string;
  fecContr!: Date
}

/** Persona embebida en ver/editar expediente. */
export interface ExpedientePersonaEntidadResumen {
  idPerso?: number | string
  idHisPerso?: number | string
  numDocum?: string
  nombre?: string
  apellido1?: string
  apellido2?: string
  desPerEntid?: string
  codPosta?: string | number
  dirPosta?: string
  municipio?: string
  provincia?: string
}

export class VerExpediente {

  id!: number;
  ejercicio!: number;
  estado!: string
  fase!: string
  fecArchivo!: string | null;
  fecCancelacion!: string | null;
  fecFin!: string | null;
  fecInicio!: string;
  formaApertura!: string;
  numero!: number;
  titulo!: string;
  departamento!: number;
  instructor!: string;
  solicitud!: number | string | null;
  usuContr!: string;
  fecContr!: string | null;
  idProc!: number;
  idSolic!: number | string | null;
  forNotif!: number | string | null;
  email!: string;
  forNotifTexto!: string;
  nomRepre!: string;
  
  // Nuevas propiedades para el modal de edición
  formaNotificacion!: string;
  correo!: string;
  dni!: string;
  fechaCancelacion!: string;
  fechaExpediente!: string;
  representante!: string;
  nombre!: string;
  apellidos!: string;
  direccion!: string;
  codigoPostal!: string;
  provincia!: string;
  municipio!: string;
  personaEntidad: ExpedientePersonaEntidadResumen = {
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    nombre: "",
    desPerEntid: "",
    codPosta: "",
    dirPosta: "",
    municipio: "",
    provincia: ""
  };
  procedimiento: ExpedienteListarProcedimiento = {
    id: "",
    descripcion: "",
    departamento: {
      idOrgEleme: "",
      idOrgan: "",
      cadEleme: "",
      desEleme: "",
      accesible: "",
      organo: "",
      usuContr: "",
      idOrgElePadre: "",
      fecContr: ""
    },
    codigoSia: "",
    usuContr: "",
    fecContr: ""
  }

}


export class ConsultaDni {

  idPerso!: number;
  idHisPerso!: number;
  nombre!: string;
  apellido1!: String;
  apellido2!: String;
  numDocum!: string;
  desPerEntid!: string;
  dirPosta!: string;
  codPosta!: number;
  codProvi!: number;
  codMunic!: number;
  municipio!: string;
  provincia!: string


}

export class VerMetadatos {
  versionNTI!: string;
  identificador!: string;
  organo!: string;
  fecCaptura!: Date;
  origen!: string;
  estado!: string;
  tipDocum!: string

}


export class EditExpediente {
  id!: number;
  numero!: number;
  ejercicio!: number;
  instructor!: string;
  procedimiento!: string;
  estado!: string;
  fase!: string;
  fecArchivo!: string | null;
  fecCancelacion!: string | null;
  fecInicio!: string;
  fecFin!: string | null;
  forma_apertura!: string;
  titulo!: string;
  dni!: string | null;
  forNotif!: number | string | null;
  forNotif2!: string;
  idPerso!: number | string | null;
  email!: string;


}

export class CrearGenerarSalida {
  usuContr!: string;
  ejeRegis!: string;
  fecRegis!: Date;
  codTema!: string;
  extracto!: string;
  observaciones!: string;
  forNotif!: number;
  idOrgEleOrige!: number;
  ejeExped!: number;
  numExped!: number;

}

export class NuevoExpediente {
  estado!: string;
  fase!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fechaInicio!: string;
  forma_apertura!: string;
  titulo!: string;
  idHisPerso!: number | string | null;
  idPerso!: number | string | null;
  instructor!: string;
  representante!: number | string | null;
  procedimiento!: string;
  usuario!: string;
  ejercicio!: number | string;
  /** Devuelto por expediente/crear tras el alta. */
  numero!: number;
  email!: string;
  formaNotifi!: number;
  idsolicitud!: number;
  idHisRepre!: number | string | null;
  idRepre!: number | string | null;
  asunto!: string;
  numDocumRepre!: string;
  nombreRepre!: string;
  apellido1Repre!: string;
  apellido2Repre!: string;
  dirPostaRepre!: string;
  codPostaRepre!: string;
  codProviRepre!: string;
  codMunicRepre!: string;
  tipPerso!: string;
  razSocia!: string;
  nombre!: string;
  apellido1!: string;
  apellido2!: string;
  dirPosta!: string;
  codPosta!: string;
  codProvi!: string;
  codMunic!: string;
  idHisDocum!: string;
  idDocum!: string;


}

export class CrearTramiteExp {


  idexpediente!: number;
  descripcion!: string;
  fase!: string;
  fecTramite!: string;
  usuContr!: string;
  numero!: number;


}

export class EditarTramiteExp {
  id!: number;
  descripcion!: string;
  fase!: string;
  fase2!: string | null;
  fecTramite!: string;
  numero!: number;
  expediente!: number;
  usuContr!: string;
  fecContr!: Date | string | null;
  puente!: string | number | null;
  varios!: string
}

export class TramiteExpListar {
  id!: number;
  descripcion!: string;
  fase!: string;
  fecTramite!: string;
  numero!: number;
  expediente!: number;
  usuContr!: string;
  fecContr!: Date

}

export class Procedimiento {

  id!: number;
  descripcion!: string;
  codigoSia!: string;
  departamento: Record<string, unknown>[] = [
    {
      idOrgEleme: '',
      idOrgan: '',
      cadEleme: '',
      desEleme: '',
      accesible: '',
      organo: '',
      usuContr: '',
      idOrgElePadre: '',
      fecContr: ''
    }
  ]
}

export class ListarInteresados {
  id!: number;
  idHisPerso!: number;
  idPerso!: number;
  idHisRepre!: number | null;
  idRepre!: number | null;
  expediente!: number | string | null;
  ejeExped!: number | string | null;
  numExped!: number | string | null;
  principal!: boolean | number | null;
  tipForNotif!: number | null;
  forNotif!: number | string | null;
  emailNotif!: string | null;
  idHisDomNotif!: number | null;
  idDomNotif!: number | null;
  nomInter!: string;
  nomRepre!: string;
  dirInter!: string;
  dirRepre!: string;
  numDocumInter!: string;
  numDocumRepre!: string;
  desProviInter!: string;
  desMunicInter!: string;
  desProviRepre!: string;
  desMunicRepre!: string;
  perEntid: ExpedientePersonaEntidadResumen[] = [{
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    desPerEntid: "",
    codPosta: "",
    dirPosta: "",
    municipio: "",
    provincia: "",
  }]
}

export class DescargaArchivoTarea {


}

export class CreaTramitador {

  id!: number;
  fecAsignacion!: string;
  expediente!: number;
  usuario!: number;
  estadoTramitacion!: string;
  usuContr!: string;
  fecContr!: Date
  idTarea!: number;


}

export class CrearInteresado {
  estado!: string;
  fase!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fechaInicio!: string;
  forma_apertura!: string;
  titulo!: string;
  idHisPerso!: number | string | null;
  idPerso!: number | string | null;
  instructor!: string;
  procedimiento!: string;
  usuario!: string;
  ejercicio!: number | string;
  email!: string;
  formaNotifi!: number;
  idsolicitud!: number;
  idexpediente!: number;
  tipForNotif!: number;
  idHisRepre: number | string | null;
  idPersoRepre: number | string | null
}


export class CrearRepresentante {
  idPerso!: number | string;
  idHisPerso!: number | string;
  numDocum!: number | string;
  tipPerso!: string;
  nombre!: string;
  particula1!: string | null;
  apellido1!: string;
  particula2!: string;
  apellido2!: string;
  razSocia!: string | null;
  razSocReduc!: string | null;
  desPerEntid!: string;
  localidad!: string;
  codPosta!: number | string | null;
  dirPosta!: string;
  municipio!: string;
  provincia!: string
}

export class CrearPersonaEntidad {
  idPerso: number;
  idHisPerso: number;
  numDocum: string;
  tipPerso: string;
  nombre: string;
  particula1: string;
  apellido1: string;
  particula2: string;
  apellido2: string;
  razSocia: string;
  razSocReduc: string;
  desPerEntid: string;
  localidad: string;
  codPosta: number;
  dirPosta: string;
  municipio: string;
  provincia: string;
}

export class ListarInteresadosOLD {

  id!: number;
  idHisPerso!: number | string;
  idPerso!: number | string;
  perEntid: ExpedientePersonaEntidadResumen[] = [{
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    desPerEntid: "",
    codPosta: "",
    dirPosta: "",
    municipio: "",
    provincia: ""
  }];
  idHisRepre!: number;
  idRepre!: number;
  expediente!: number;
  ejeExped!: number;
  numExped!: number;
  principal!: number;
  tipForNotif!: number;
  forNotif!: string;
  emailNotif!: String;
  idHisDomNotif!: number;
  idDomNotif!: number
}

export class TareaTramiteExpedienteUsuarioListar {
  id!: number;
  descripcion!: string;
  fecFin!: string;
  fecInicio!: string;
  firmante!: string | number | null;
  numero!: number;
  visible!: boolean;
  archivo!: number | string | null;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: string | null;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date | string | null;
}

export class TareaTramiteExpedienteListar {
  id!: number;
  descripcion!: string;
  fecFin!: string;
  fecInicio!: string;
  firmante!: string | number | null;
  numero!: number;
  visible!: boolean;
  archivo!: number | string | null;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: string | null;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date | string | null;
  numRegis!: string
}

export class ArchivoFirmadoEF {

  asunto!: string;
  texto!: string;
  prioridad!: string
}

export class ArchivoFirmantes {

  numDocum!: string;
  desPerso!: string;
  idHisPerso!: number | string | null
  idPerso!: number | string | null;
  cargo!: string;
}

export class InsertaBolsaCrear {
  prioridad!: string;
  tipSesion!: number | null;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecAlta!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecPrefe!: string;
  extracto!: string;
  observaciones!: string;
  expMotiv!: string;
  refExped!: string;
  usuContr!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecMaxResol!: string;
  tipPunto!: number | null;
  estado!: number;
  idOrgEleme!: string;
  dictamen!: string
}


export class CrearTareaTramiteExp {
  descripcion!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecFin!: string | null;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecInicio!: string;
  firmante!: string | number | null;
  numero!: number;
  numRegis!: string | number | null;
  visible!: boolean;
  archivo!: number | string | null;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: string | null;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  /** ISO `YYYY-MM-DD`. */
  fecContr!: string;
  descrip!: string | null;
}

export class TareaTramiteExpedienteCrear {

  descripcion!: string;
  fecFin!: string | null;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecInicio!: string;
  firmante!: string | number | null;
  numero!: number;
  numRegis!: string;
  visible!: boolean;
  archivo?: number | string | null;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: string | null;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  /** ISO `YYYY-MM-DD`. */
  fecContr!: string;
  descrip!: string | null;
  anexo!: string | number | null;
  documAportada!: string | number | null;
  tipoDocumEni!: string | number | null;
  documentacion!: string | number | null;
}

export class TareaTramiteExpedienteEditar {

  descripcion!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecFin!: string | null;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecInicio!: string;
  firmante!: string | number | null;
  numero!: number;
  visible!: boolean;
  archivo!: number | string | null;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: string | null;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  /** ISO `YYYY-MM-DD`. */
  fecContr!: string;
  anexo!: string | number | null;
  documAportada!: string | number | null;
  tipoDocumEni!: string | number | null;
  documentacion!: string | number | null;
}

export class RepresentanteExpLIstar {
  idPerso!: number | string | null;
  idHisPerso!: number | string | null;
  numDocum!: number | string;
  tipPerso!: string;
  nombre!: string;
  particula1!: string | null;
  apellido1!: string;
  particula2!: string;
  apellido2!: string;
  razSocia!: string | null;
  razSocReduc!: string | null;
  desPerEntid!: string;
  localidad!: string;
  codPosta!: number | string | null;
  dirPosta!: string;
  municipio!: string;
  provincia!: string
}


/** @deprecated Preferir `core/models/mensaje-domain.model` */
export {
  CrearMensaje,
  EditarMensaje,
  RechazarMensaje,
  LeeMensaje,
  LeerMensajeRecibidos,
  LeerMensajeEnviados,
} from './mensaje-domain.model'

export class CrearNotificacion {
  id!: number;
  idNotif!: number;
  personaEntidad!: PersonaEntidadDto | null;
  desNotificador!: string;
  desMotNotif!: string;
  desSituacion!: string;
  ejeNotif!: number;
  numNotif!: number;
  fecNotif!: Date | string;
  fecRecNotif!: Date | string | null;
  idHisPerso!: number;
  idPerso!: number;
  situacion!: number;
  motNotif!: string;
  receptor!: number | string;
  numBop!: number;
  bop: number | null = null;
  fecEmiBop!: Date | string | null;
  fecPubBop!: Date | string | null;
  notificador!: number | string;
  notificador2!: number | string;
  codProvi!: number;
  codMunic!: number;
  tipVial!: string;
  desVial!: string;
  numInfer!: number;
  letInfer!: string;
  numSuper!: number;
  bloque!: string;
  portal!: string;
  escalera!: string;
  planta!: string;
  puerta!: string;
  localidad!: string;
  domicilio!: string;
  codPosta!: number;
  fecArchi!: Date | string | null;
  ejeExped!: number;
  numExped!: number;
  observacion!: string;
  fecRegistSalid!: Date | string | null;
  numRegisSalid!: number;
  fecEnvio!: Date | string | null;
  forNotif!: number;
  fecCaduc!: Date | string | null;
  numEnvioTeu!: number | string | null;
  codArchi!: number | string | null;
  codArchiAcuse!: number | string | null;
  usuContr!: string;
  dni!: string;

}

export class ReceptorNotifiListar {
  receptor!: number;
  descripcion!: string;
  usuContr!: string;
  fecContr!: Date

}

export class MotivoNotificacionesListar {
  motNotif!: number;
  descripcion!: string;
  usuContr!: string;
  fecContr!: Date;

}

export class NotificadorListar {

  notificador!: number;
  descripcion!: string;
  idHisPerso!: number | string | null;
  idPerso!: number | string | null;
  idOrgEleme!: number | string | null;
  usuContr!: string;
  fecContr!: Date | string | null
}

export class LeerNotificacion {
  idNotif!: number;
  ejeNotif!: number;
  numNotif!: number;
  fecNotif!: Date | string;
  fecRecNotif!: Date | string | null;
  idHisPerso!: number;
  idPerso!: number;
  personaEntidad!: PersonaEntidadDto | null;
  situacion!: number;
  desSituacion!: string;
  motNotif!: number | null;
  desMotNotif!: string;
  receptor!: number | null;
  desReceptor?: string;
  numBop!: number;
  bop!: number;
  fecEmiBop!: Date | string | null;
  fecPubBop!: Date | string | null;
  notificador!: number | null;
  desNotificador!: string;
  codProvi!: number;
  desProvi!: string;
  codMunic!: number;
  desMunic!: string;
  tipVial!: string;
  desVial!: string;
  numInfer!: number;
  letInfer!: string;
  numSuper!: number;
  bloque!: string;
  portal!: string;
  escalera!: string;
  planta!: string;
  puerta!: string;
  localidad!: string;
  domicilio!: string;
  codPosta!: number;
  fecArchi!: Date | string | null;
  ejeExped!: number;
  numExped!: number | string;
  observacion!: string;
  fecRegistSalid!: Date | string | null;
  numRegisSalid!: number | null;
  fecEnvio!: Date | string | null;
  forNotif!: number;
  fecCaduc!: Date | string | null;
  numEnvioTeu!: number | null;
  codArchi!: number | null;
  codArchiAcuse!: number | null;
  usuContr!: string | null;
  /** Presentes en filas del grid (no siempre en el DTO base). */
  numDocum?: string;
  tareaProcedimiento?: string | number;
  numTarea?: string | number;
  usuario?: string;
  desPerEntid?: string;
}

export class EditarNotificacion {
  idNotif!: number;
  personaEntidad!: PersonaEntidadDto | null;
  desNotificador!: string;
  desSituacion!: string;
  desMotNotif!: string;
  ejeNotif!: number;
  numNotif!: number;
  /** ISO `YYYY-MM-DD` o datetime del API. */
  fecNotif!: Date | string;
  fecRecNotif!: Date | string | null;
  idHisPerso!: number;
  idPerso!: number;
  situacion!: string | number;
  motNotif!: string | number;
  receptor!: string | number | null;
  numBop!: number;
  bop: number | null = null;
  fecEmiBop!: Date | string | null;
  fecPubBop!: Date | string | null;
  notificador!: number | string | null;
  codProvi!: number;
  codMunic!: number;
  tipVial!: string;
  desVial!: string;
  numInfer!: number;
  letInfer!: string;
  numSuper!: number;
  bloque!: string;
  portal!: string;
  escalera!: string;
  planta!: string;
  puerta!: string;
  localidad!: string;
  domicilio!: string;
  codPosta!: number;
  fecArchi!: Date | string | null;
  ejeExped!: number | string | null;
  numExped!: number | string;
  observacion!: string;
  fecRegistSalid!: Date | string | null;
  numRegisSalid!: number | null;
  fecEnvio!: Date | string | null;
  forNotif!: number | null;
  fecCaduc!: Date | string | null;
  numEnvioTeu!: number | string | null;
  codArchi!: number | string | null;
  codArchiAcuse!: number | string | null;
  usuContr!: string
}


export class ListarTramites {
  id!: number;
  descripcion!: string;
  fase!: string;
  fecTramite!: string;
  numero!: number;
  expediente!: number;
  usuContr!: string;
  fecContr!: Date
}

export class ListarTramitador {
  id!: number;
  fecAsignacion!: string;
  expediente!: number;
  usuario!: number;
  estadoTramitacion!: string;
  usuContr!: string;
  fecContr!: Date
  /** Presente en filas del grid (no siempre en el DTO base): indica si el tramitador posee actualmente el expediente. */
  posesion?: number | string | null;

}

export class CrearTablonAnuncio {


  idOrgEleme: string;

  tipAnunc: number | string | null;

  desAnunc: string;

  /** ISO `YYYY-MM-DD` (input type=date). */
  fecDesde: string;

  /** ISO `YYYY-MM-DD` (input type=date). */
  fecHasta: string;


}

export class Atributosleer {
  etiGruAtrib: String;
  idAtrib: number;
  idGrupo: number;
  desGruAtrib: String;
  requerido: number;
  valInici: number;
  valMinim: number;
  valMaxim: number;
  longitud: number;
  tipo: String;
  valor: String;
  usuario: String;

}

export class AtributosModificar {
  etiGruAtrib: string;
  idExped: number | string;
  idGrupo: number;
  valor: string;


}

export class RegistroDocumento {
  ejeRegis: number | string;
  numRegis: number;
  fecRegis: string | null;
  extracto: string;

}



