export class Solicitudes {
}

export class DocumentosListar {
  id!: number;
  descripcion!: string;
  solicitud!: number;
  nombreArchivo!: string
  fechaSubida!: string;
  usuContr!: string;
  fecContr!: string
  archivo?: string | number
}


export class SolicitudListar {
  id!: number;
  fecInicio!: string;
  ejercicio!: number;
  numero!: number;
  idHisRepre!: any;
  idRepre!: any;
  estado!: string;
  asunto!: string;
  idDocum!: any;
  idHisDocum!: any;
  idPerso!: number;
  idHisPerso!: number;
  departamento!: number;
  usuario!: string;
  usuContr!: string;
  fecContr!: string;
  idExpediente!: any;
  rdDocumento!: any;
  ejeNumRegis!: any;
  expediente: any = [{
    id: "",
    ejercicio: "",
    estado: "",
    fase: "",
    fecArchivo: "",
    fecCancelacion: "",
    fecFin: "",
    fecInicio: "",
    formaApertura: "",
    numero: "",
    titulo: "",
    departamento: "",
    instructor: "",
    procedimiento: "",
    solicitud: "",
    idPerso: "",
    idHisPerso: "",
    idRepre: "",
    idHisRepre: "",
    usuContr: "",
    fecContr: ""
  }];
  personaEntidad: any = [{
    idPerso: "",
    idHisPerso: "",
    fecMovim: "",
    codMovim: "",
    cauMovim: "",
    regActiv: "",
    numDocum: "",
    tipPerso: "",
    nivAcces: "",
    nombre: "",
    particula1: "",
    apellido1: "",
    particula2: "",
    apellido2: "",
    razSocia: "",
    razSocReduc: "",
    desPerEntid: "",
    domCodif: "",
    idHisDomic: "",
    idDomic: "",
    localidad: "",
    desTipVia: "",
    desVia: "",
    extInfNumer: "",
    extInfLetra: "",
    extSupNumer: "",
    extSupLetra: "",
    kilometro: "",
    bloque: "",
    portal: "",
    escalera: "",
    planta: "",
    puerta: "",
    edificio: "",
    codLocal: "",
    codPosta: "",
    dirPosta: "",
    municipio: "",
    provincia: "",
    observaciones: "",
    usuContr: "",
    fecContr: "",
    codProvi: "",
    codMunic: "",

  }]

}

export class ExpedienteListar2 {
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
  procedimiento!: string;
  solicitud!: string;
  usuContr!: string;
  fecContr!: any;

}

export class EditExpediente {
  id!: number;
  idExpediente!: number;
  instructor!: string;

}

export class ExpedienteListar {

  id!: number;
  solicitud!: any;
  ejercicio!: number;
  numero!: number;
  titulo!: string;
  fecInicio!: string;
  fecFin!: "";
  departamento: any = [{
    idOrgEleme: "",
    idOrgan: "",
    cadEleme: "",
    desEleme: "",
    accesible: "",
    organo: "",
    usuContr: "",
    idOrgElePadre: "",
    fecContr: "",
  }];
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
  }


  ];
  estado!: string;
  formaApertura!: string;
  fase!: string;
  instructor: any = [{
    usuario: "",
    numUsuar: "",
    desUsuario: "",
    idHisPerso: "",
    idPerso: "",
    nivAcces: "",
    datConfi: "",
    actAudit: "",
    ambito: "",
    fecVenUsuar: "",
    password: "",
    fecVenPassw: "",
    bloqueo: "",
    fecBloqu: "",
    codGrupo: "",
    cambioPas: "",
    usuContr: "",
    fecContr: "",
    entidad: {
      codEntid: "",
      desEntid: "",
      usuContr: "",
      fecContr: "",
      municipio: {
        codProvi: "",
        codMunic: "",
        desMunic: "",
        numHabTot: "",
        numHabHom: "",
        numHabMuj: "",
        usuContr: "",
        fecContr: ""
      }
    },
    fecArchivo: "",
    fecCancelacion: "",
    tramitadores: [{
      id: "",
      usuario: {
        usuario: "",
        numUsuar: "",
        desUsuario: "",
        idHisPerso: "",
        idPerso: "",
        nivAcces: "",
        datConfi: "",
        actAudit: "",
        ambito: "",
        fecVenUsuar: "",
        password: "",
        fecVenPassw: "",
        bloqueo: "",
        fecBloqu: "",
        codGrupo: "",
        cambioPas: "",
        usuContr: "",
        fecContr: "",
        entidad: {
          codEntid: "",
          desEntid: "",
          usuContr: "",
          fecContr: "",
          municipio: {
            codProvi: "",
            codMunic: "",
            desMunic: "",
            numHabTot: "",
            numHabHom: "",
            numHabMuj: "",
            usuContr: "",
            fecContr: "",
          }
        }


      },
      fecAsignacion: "",
      expediente: {
        id: "",
        solicitud: "",
        ejercicio: "",
        numero: "",
        titulo: "",
        fecInicio: "",
        fecFin: "",
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
        procedimiento: {
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
        },
        estado: "",
        formaApertura: "",
        fase: "",
        instructor: {
          usuario: "",
          numUsuar: "",
          desUsuario: "",
          idHisPerso: "",
          idPerso: "",
          nivAcces: "",
          datConfi: "",
          actAudit: "",
          ambito: "",
          fecVenUsuar: "",
          password: "",
          fecVenPassw: "",
          bloqueo: "",
          fecBloqu: "",
          codGrupo: "",
          cambioPas: "",
          usuContr: "",
          fecContr: "",
          entidad: {
            codEntid: "",
            desEntid: "",
            usuContr: "",
            fecContr: "",
            municipio: {
              codProvi: "",
              codMunic: "",
              desMunic: "",
              numHabTot: "",
              numHabHom: "",
              numHabMuj: "",
              usuContr: "",
              fecContr: ""
            },
          }
        }
      }
    }
    ]
  }]
}


export class CreaSolicitud {

  asunto!: string;
  ejercicio!: string;
  estado!: string;
  fecInicio!: string;
  departamento!: string;
  idHisPerso!: number;
  idPerso!: number;
  idHisDocum!: number;
  idDocum!: number;
  idHisRepre!: any;
  idRepre!: any;
  usuario!: string;
  expediente!: string;
  usuContr!: string;
  dni!: string;
  representante!: string;
  formaNotifi!: any;
  email!: string;

}


export class CreaSolicitudNuevo {
  id: any;
  fecInicio: String;
  ejercicio: string;
  numero: any;
  idDocum: any;
  idHisDocum: any;
  idPerso: any;
  idHisPerso: any;
  idRepre: any;
  idHisRepre: any;
  EnumEstadoSolicitud: any;
  estado: string;
  asunto: string;
  motivoRechazo: string;
  departamento: any;
  usuario: string;
  expediente: any;
  fecMovim: Date;
  codMovim: string;
  cauMovim: any;
  regActiv: boolean;
  numDocum: string;
  tipPerso: string;
  nivAcces: any;
  nombre: string;
  particula1: string;
  representante: string;
  apellido1: string;
  particula2: string;
  apellido2: string;
  razSocia: string;
  razSocReduc: string;
  desPerEntid: string;
  domCodif: boolean;
  idHisDomic: any;
  idDomic: any;
  localidad: string;
  desTipVia: string;
  desVia: string;
  extInfNumer: number;
  extInfLetra: any;
  extSupNumer: any;
  extSupLetra: string;
  codLocal: any;
  codPosta: string;
  dirPosta: string;
  observaciones: string;
  codProvi: any;
  codMunic: any;
  fecMovimRepre: any;
  codMovimRepre: string;
  cauMovimRepre: any;
  regActivRepre: boolean;
  numDocumRepre: string;
  tipPersoRepre: any;
  nivAccesRepre: any;
  nombreRepre: string;
  particula1Repre: string;
  apellido1Repre: string;
  particula2Repre: string;
  apellido2Repre: string;
  razSociaRepre: string;
  razSocReducRepre: string;
  desPerEntidRepre: string;
  domCodifRepre: boolean;
  idHisDomicRepre: any;
  idDomicRepre: any;
  localidadRepre: string;
  desTipViaRepre: string;
  desViaRepre: string;
  extInfNumerRepre: any
  extInfLetraRepre: string;
  extSupNumerRepre: any;
  extSupLetraRepre: string;
  codLocalRepre: any;
  codPostaRepre: number;
  dirPostaRepre: string;
  observacionesRepre: string;
  codProviRepre: any;
  codMunicRepre: any;
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

export class VerSolicitud {
  id!: number;
  fecInicio!: Date;
  ejercicio!: number;
  numero!: number;
  idDocum!: any;
  idHisDocum!: any;
  idPerso!: number;
  idHisPerso!: number;
  idRepre!: any;
  idHisRepre!: any;
  estado!: string;
  asunto!: string;
  departamento!: number;
  usuario!: string;
  usuContr!: string;
  fecContr!: Date;
  idexpediente!: number;
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
  expediente: any = [{
    id: "",
    ejercicio: "",
    estado: "",
    fase: "",
    fecArchivo: "",
    fecCancelacion: "",
    fecFin: "",
    fecInicio: "",
    formaApertura: "",
    numero: "",
    titulo: "",
    departamento: "",
    instructor: "",
    procedimiento: "",
    solicitud: "",
    idPerso: "",
    idHisPerso: "",
    idRepre: "",
    idHisRepre: "",
    usuContr: "",
    fecContr: ""
  }];
}

export class UsuPermisos {

  idOrgUsuar!: number;
  idOrgEleme!: number;
  usuario!: string;
  codCargo!: number;
  perEnvio!: boolean;
  perRecep!: boolean;
  solUsuar!: number;
  traUsuar!: number;
  usuContr!: string;
  fecContr!: string
}

export class AsignaA {
  idOrgUsuar!: number;
  usuario: any =
    [
      {
        usuario: "",
        numUsuar: "",
        desUsuario: ""
      }
    ]

}

export class ProcediPermisos {

  idOrgUsuar!: number;
  idOrgEleme!: number;
  usuario!: string;
  codCargo!: number;
  perEnvio!: boolean;
  perRecep!: boolean;
  solUsuar!: number;
  traUsuar!: number;
  usuContr!: string;
  fecContr!: string;
  usuarioOLD: any = [{
    usuario: "",
    numUsuar: "",
    desUsuario: ""

  }]
}

export class EditarSolicitud {
  asunto!: string;
  estado!: string;
  usuario!: string;
  fecInicio!: Date;
  motivoRechazo!: string;
  representante!: any;
  formaNotifi!: any;
  email!: string;
  ejercicio!: string;
  departamento!: string;
  idHisPerso!: number;
  idPerso!: number;
  idHisDocum!: number;
  idDocum!: number;
  idHisRepre!: any;
  idRepre!: any;
  expediente!: string;
  usuContr!: string;
  dni!: string;


}

