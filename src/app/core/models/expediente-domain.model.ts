export class Expedientes {
}


export class ExpedienteListar {
  id!: number;
  ejercicio!: number;
  estado!: string;
  fase!: string;
  fecArchivo!: any;
  fecCancelacion!: any
  fecFin!: any;
  fecInicio!: string;
  formaApertura!: string
  numero!: number;
  titulo!: string;
  departamento!: string;
  instructor!: string;
  solicitud!: string;
  usuContr!: string;
  fecContr!: any;
  forNotif!: any;
  insideEstado?: string;
  procedimiento: any = [{
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

  }]

}

export class VerExpedientesInstructor {
  id: any;
  ejercicio: String;
  estado: String;
  fase: String;
  fecArchivo: String;
  fecCancelacion: String;
  fecFin: String;
  fecInicio: String;
  formaApertura: String;
  numero: String;
  titulo: String;
  departamento: String;
  instructor: String;
  procedimiento: String;
  solicitud: String;
  idPerso: String;
  idHisPerso: String;
  idRepre: String;
  idHisRepre: String;
  idDocum: String;
  idHisDocum: String;
  archivo: String;
  usuContr: String;
  fecContr: String;


}

export class TareaTramiteExpporExpedi {
  id: any;
  descripcion: String;
  fecFin: String;
  fecInicio: String;
  firmante: String;
  numero: any;
  visible: any;
  archivo: any;
  tareaProcedimiento: any;
  tramite: any;
  usuario: String;
  notificacion: any;
  firmado: any;
  propuestaResolucion: any;
  idHisDocum: any;
  idDocum: any;
  tramitador: any;
  usuContr: String;
  numRegis: any;
  color: String;
  fecPlazo: String;
  tipAnexo: any;
  docAport: any;
  tipDocEni: String;
  documentacion: any;
  nombreArchivo: String;
  ejeNumNotif: any;
  idAnunc: any;
  desTramite: String;
  ejeExped: any;
  numExped: any;
  titulo: any;
  fecFinPlazo: String;
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
  notificacion: any;
  firmado: number;
  propuestaResolucion: any;
  idHisDocum: any;
  idDocum: any;
  tramitador: any;
  usuContr: string;
  numRegis: any;
  color: string;
  fecPlazo: string;
  tipAnexo: number;
  docAport: any;
  tipDocEni: string;
  documentacion: number;
  nombreArchivo: string;
  ejeNumNotif: any;
  idAnunc: number;
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
  fecArchivo!: any;
  fecCancelacion!: any;
  fecFin!: any;
  fecInicio!: string;
  formaApertura!: string;
  numero!: number;
  titulo!: string;
  departamento!: number;
  instructor!: string;
  solicitud!: any;
  usuContr!: any;
  fecContr!: any;
  idProc!: number;
  idSolic!: any
  personaEntidad!: any;
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
  fecGener!: Date;
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
  fecSolic!: Date;
  fecFirma!: Date;
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

export class VerExpediente {

  id!: number;
  ejercicio!: number;
  estado!: string
  fase!: string
  fecArchivo!: any;
  fecCancelacion!: any;
  fecFin!: any;
  fecInicio!: string;
  formaApertura!: string;
  numero!: number;
  titulo!: string;
  departamento!: number;
  instructor!: string;
  solicitud!: any;
  usuContr!: any;
  fecContr!: any;
  idProc!: number;
  idSolic!: any;
  forNotif!: any;
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
  personaEntidad: any = {
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
  procedimiento: any = {
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
  fecArchivo!: Date;
  fecCancelacion!: Date;
  fecInicio!: Date;
  fecFin!: Date;
  forma_apertura!: string;
  titulo!: string;
  dni!: any;
  forNotif!: any;
  forNotif2!: string;
  idPerso!: any;
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
  fechaInicio!: Date;
  forma_apertura!: string;
  titulo!: string;
  idHisPerso!: any;
  idPerso!: any;
  instructor!: string;
  representante!: any;
  procedimiento!: string;
  usuario!: string;
  ejercicio!: any;
  email!: string;
  formaNotifi!: number;
  idsolicitud!: number;
  idHisRepre!: any;
  idRepre!: any;
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
  id!: Number;
  descripcion!: string;
  fase!: string;
  fase2!: any;
  fecTramite!: string;
  numero!: number;
  expediente!: Number;
  usuContr!: string;
  fecContr!: Date;
  puente!: any;
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
  departamento: any = [
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
  idHisRepre!: number;
  idRepre!: any;
  expediente!: any;
  ejeExped!: any;
  numExped!: any;
  principal!: any;
  tipForNotif!: any;
  forNotif!: any;
  emailNotif!: any;
  idHisDomNotif!: any;
  idDomNotif!: any;
  nomInter!: any;
  nomRepre!: any;
  dirInter!: any;
  dirRepre!: any;
  numDocumInter!: any;
  numDocumRepre!: any;
  desProviInter!: any;
  desMunicInter!: any;
  desProviRepre!: any;
  desMunicRepre!: any;
  perEntid: any = [{
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    tipPerso: "",
    nombre: "",
    particula1: "",
    apellido1: "",
    particula2: "",
    apellido2: "",
    razSocia: "",
    razSocReduc: "",
    desPerEntid: "",
    localidad: "",
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
  fechaInicio!: Date;
  forma_apertura!: string;
  titulo!: string;
  idHisPerso!: any;
  idPerso!: any;
  instructor!: string;
  procedimiento!: string;
  usuario!: string;
  ejercicio!: any;
  email!: string;
  formaNotifi!: number;
  idsolicitud!: number;
  idexpediente!: number;
  tipForNotif!: number;
  idHisRepre: any;
  idPersoRepre: any
}


export class CrearRepresentante {
  idPerso!: any;
  idHisPerso!: any;
  numDocum!: number;
  tipPerso!: string;
  nombre!: string;
  particula1!: any;
  apellido1!: string;
  particula2!: string;
  apellido2!: string;
  razSocia!: any;
  razSocReduc!: any;
  desPerEntid!: string;
  localidad: string;
  codPosta!: number;
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
  idHisPerso!: any;
  idPerso!: any;
  perEntid: any = [{
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    tipPerso: "",
    nombre: "",
    particula1: "",
    apellido1: "",
    particula2: "",
    apellido2: "",
    razSocia: "",
    razSocReduc: "",
    desPerEntid: "",
    localidad: "",
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
  firmante!: any;
  numero!: number;
  visible!: boolean;
  archivo!: any;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: any;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date;


}

export class TareaTramiteExpedienteListar {
  id!: number;
  descripcion!: string;
  fecFin!: string;
  fecInicio!: string;
  firmante!: any;
  numero!: number;
  visible!: boolean;
  archivo!: any;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: any;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date;
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
  idHisPerso!: any
  idPerso!: any;
  cargo!: string;
}

export class InsertaBolsaCrear {
  prioridad!: string;
  tipSesion!: number;
  fecAlta!: Date;
  fecPrefe!: Date;
  extracto!: string;
  observaciones!: string;
  expMotiv!: string;
  refExped!: string;
  usuContr!: string;
  fecMaxResol!: Date;
  tipPunto!: number;
  estado!: number;
  idOrgEleme!: string;
  dictamen!: string
}

// export class TareaTramiteExpedienteVer{
//     id!: number;
//     descripcion!: string;
//     fecFin!: string;
//     fecInicio!: string;
//     firmante!: any;
//     numRegis!:string;
//     numero!: number;
//     visible!: boolean;
//     archivo!: any;
//     tareaProcedimiento!: number;
//     tramite!: number;
//     usuario!: string;
//     propuestaResolucion!: any;
//     id_His_Docum!: number;
//     idDocum!: number;
//     tramitador!: number;
//     usuContr!: string;
//     fecContr!: Date;
//
//
// }

export class CrearTareaTramiteExp {
  descripcion!: any;
  fecFin!: Date;
  fecInicio!: Date;
  firmante!: any;
  numero!: number;
  numRegis!: any;
  visible!: boolean;
  archivo!: any;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: any;
  propuestaResolucion!: any;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date;
  descrip!: any;


}

export class TareaTramiteExpedienteCrear {

  descripcion!: string;
  fecFin!: Date;
  fecInicio!: Date;
  firmante!: any;
  numero!: number;
  numRegis!: string;
  visible!: boolean;
  archivo!: any;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: any;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date;
  descrip!: any;
  anexo!: any;
  documAportada!: any;
  tipoDocumEni!: any;
  documentacion!: any;
}

export class TareaTramiteExpedienteEditar {

  descripcion!: string;
  fecFin!: Date;
  fecInicio!: Date;
  firmante!: any;
  numero!: number;
  visible!: boolean;
  archivo!: any;
  tareaProcedimiento!: number;
  tramite!: number;
  usuario!: string;
  propuestaResolucion!: any;
  id_His_Docum!: number;
  idDocum!: number;
  tramitador!: number;
  usuContr!: string;
  fecContr!: Date;
  anexo!: any;
  documAportada!: any;
  tipoDocumEni!: any;
  documentacion!: any;

}

export class RepresentanteExpLIstar {
  idPerso!: any;
  idHisPerso!: any;
  numDocum!: number;
  tipPerso!: string;
  nombre!: string;
  particula1!: any;
  apellido1!: string;
  particula2!: string;
  apellido2!: string;
  razSocia!: any;
  razSocReduc!: any;
  desPerEntid!: string;
  localidad: string;
  codPosta!: number;
  dirPosta!: string;
  municipio!: string;
  provincia!: string


}


export class CrearMensaje {
  fecEnvio!: Date;
  idOrgUsuar!: number;
  descripcion!: string;
  fecLectura!: string;
  fecTramitacion!: string;
  fecRechazo!: string;
  remitente!: string;
  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string;
  posesion!: any;
  idtarea!: any;
  idExpediente!: any

}


export class EditarMensaje {
  id!: number;
  idTarea!: number;
  fecEnvio!: string;
  descripcion!: string;
  fecLectura!: Date;
  fecTramitacion!: Date;
  fecRechazo!: Date;
  remitente!: string;
  nomRemit!: string;
  nomDesti!: string;
  estado!: string;
  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string
}


export class RechazarMensaje {
  fecEnvio!: Date;
  idOrgUsuar!: number;
  descripcion!: string;
  fecLectura!: Date;
  fecTramitacion!: string;
  fecRechazo!: Date;
  remitente!: string;
  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string;
  estado!: string

}

export class LeeMensaje {
  id!: number;
  idTarea!: number;
  fecEnvio!: string;
  descripcion!: string;
  fecLectura!: Date;
  fecTramitacion!: Date;
  fecRechazo!: Date;
  remitente!: string;
  nomRemit!: string;
  nomDesti!: string;
  estado!: string;
  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string

}

export class LeerMensajeRecibidos {
  id!: number;
  idTarea!: number;
  fecEnvio!: string;
  descripcion!: string;
  fecLectura!: string;
  fecTramitacion!: Date;
  fecRechazo!: Date;
  remitente!: string;
  nomRemit!: string;
  nomDesti!: string;
  estado!: string;

  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string

}

export class LeerMensajeEnviados {
  id!: number;
  idTarea!: number;
  fecEnvio!: string;
  descripcion!: string;
  fecLectura!: string;
  fecTramitacion!: Date;
  fecRechazo!: Date;
  remitente!: string;
  nomRemit!: string;
  nomDesti!: string;
  estado!: string;

  destinatario!: string;
  EstadoMensaje!: string;
  informativo!: boolean;
  descripcionRechazo!: string

}

export class CrearNotificacion {
  id!: number;
  idNotif!: number;
  personaEntidad!: any;
  desNotificador!: string;
  desMotNotif!: string;
  desSituacion!: string;
  ejeNotif!: number;
  numNotif!: number;
  fecNotif!: Date;
  fecRecNotif!: Date | null;
  idHisPerso!: number;
  idPerso!: number;
  situacion!: number;
  motNotif!: string;
  receptor!: number;
  numBop!: number;
  bop: any;
  fecEmiBop!: Date | null;
  fecPubBop!: Date | null;
  notificador!: number;
  notificador2!: number;
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
  fecArchi!: Date;
  ejeExped!: number;
  numExped!: number;
  observacion!: string;
  fecRegistSalid!: Date | null;
  numRegisSalid!: number;
  fecEnvio!: Date | null;
  forNotif!: number;
  fecCaduc!: Date | null;
  numEnvioTeu!: any;
  codArchi!: any;
  codArchiAcuse!: any;
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
  idHisPerso!: any;
  idPerso!: any;
  idOrgEleme!: any;
  usuContr!: string;
  fecContr!: Date


}

export class LeerNotificacion {
  idNotif!: number;
  ejeNotif!: number;
  numNotif!: number;
  fecNotif!: Date;
  fecRecNotif!: Date;
  idHisPerso!: number;
  idPerso!: number;
  personaEntidad: any = [{
    idPerso: "",
    idHisPerso: "",
    numDocum: "",
    tipPerso: "",
    nombre: "",
    particula1: "",
    apellido1: "",
    particula2: "",
    apellido2: "",
    razSocia: "",
    razSocReduc: "",
    desPerEntid: "",
    localidad: "",
    codPosta: "",
    dirPosta: "",
    municipio: "",
    provincia: ""
  }];
  situacion!: number;
  desSituacion!: string;
  motNotif!: any;
  desMotNotif!: string
  receptor!: number;
  numBop!: number;
  bop!: number;
  fecEmiBop!: Date;
  fecPubBop!: Date;
  notificador!: Date;
  desNotificador!: string;
  codProvi!: number;
  desProvi!: string;
  codMunic!: number;
  desMunic!: string;
  tipVial!: string;
  desVial!: string;
  numInfer!: number;
  letInfer!: number;
  numSuper!: number;
  bloque!: number;
  portal!: number;
  escalera!: any;
  planta!: any;
  puerta!: any;
  localidad: string;
  domicilio!: string;
  codPosta!: number;
  fecArchi!: Date;
  ejeExped!: number;
  numExped: number;
  observacion!: string
  fecRegistSalid!: Date;
  numRegisSalid!: Date;
  fecEnvio!: Date;
  forNotif!: number;
  fecCaduc!: Date;
  numEnvioTeu: number;
  codArchi!: any;
  codArchiAcuse!: any;
  usuContr!: any;

}

export class EditarNotificacion {
  idNotif!: number;
  personaEntidad!: any;
  desNotificador!: string;
  desSituacion!: string;
  desMotNotif!: string;
  ejeNotif!: number;
  numNotif!: number;
  fecNotif!: Date;
  fecRecNotif!: Date;
  idHisPerso!: number;
  idPerso!: number;
  situacion!: string;
  motNotif!: string;
  receptor!: string;
  numBop!: number;
  bop: any;
  fecEmiBop!: Date;
  fecPubBop!: Date;
  notificador!: any;
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
  fecArchi!: Date;
  ejeExped!: any;
  numExped!: string;
  observacion!: string;
  fecRegistSalid!: Date;
  numRegisSalid!: number;
  fecEnvio!: Date;
  forNotif!: any;
  fecCaduc!: Date;
  numEnvioTeu!: any;
  codArchi!: any;
  codArchiAcuse!: any;
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

}

export class CrearTablonAnuncio {


  idOrgEleme: string;

  tipAnunc: any;

  desAnunc: string;

  fecDesde: Date;

  fecHasta: Date;


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
  idExped: any;
  idGrupo: number;
  valor: string;


}

export class RegistroDocumento {
  ejeRegis: any;
  numRegis: number;
  fecRegis: any;
  extracto: string;

}



