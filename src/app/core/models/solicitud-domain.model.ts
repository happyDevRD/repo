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


/** Persona/interesado embebido en listados y detalle de solicitud. */
export interface SolicitudPersonaEntidadResumen {
  idPerso?: number | string
  idHisPerso?: number | string
  numDocum?: string
  tipPerso?: string
  nombre?: string
  particula1?: string
  apellido1?: string
  particula2?: string
  apellido2?: string
  razSocia?: string
  razSocReduc?: string
  desPerEntid?: string
  localidad?: string
  desTipVia?: string
  desVia?: string
  extInfNumer?: string | number
  extInfLetra?: string
  extSupNumer?: string | number
  extSupLetra?: string
  kilometro?: string | number
  bloque?: string
  portal?: string
  escalera?: string
  planta?: string
  puerta?: string
  edificio?: string
  codLocal?: string | number
  codPosta?: string | number
  dirPosta?: string
  municipio?: string
  provincia?: string
  observaciones?: string
  fecMovim?: string
  codMovim?: string
  cauMovim?: string
  regActiv?: string
  nivAcces?: string
  domCodif?: string
  idHisDomic?: string | number
  idDomic?: string | number
  codProvi?: string | number
  codMunic?: string | number
  usuContr?: string
  fecContr?: string
}

export class SolicitudListar {
  id!: number;
  fecInicio!: string;
  ejercicio!: number;
  numero!: number;
  idHisRepre!: number | string | null;
  idRepre!: number | string | null;
  estado!: string;
  asunto!: string;
  idDocum!: number | string | null;
  idHisDocum!: number | string | null;
  idPerso!: number;
  idHisPerso!: number;
  departamento!: number;
  usuario!: string;
  usuContr!: string;
  fecContr!: string;
  idExpediente!: number | string | null;
  rdDocumento!: number | string | null;
  ejeNumRegis!: string | null;
  /** Campos del grid (pueden venir en la fila aunque no en el DTO base). */
  numDocum?: string;
  nomRepre?: string;
  dirRepre?: string;
  expediente: Record<string, unknown> | null = {
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
  };
  personaEntidad: SolicitudPersonaEntidadResumen | null = {
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

  }

}

export class ExpedienteListar2 {
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
  procedimiento!: string;
  solicitud!: string;
  usuContr!: string;
  fecContr!: string | null;

}

export class EditExpediente {
  id!: number;
  idExpediente!: number;
  instructor!: string;

}

export class ExpedienteListar {

  id!: number;
  solicitud!: number | string | null;
  ejercicio!: number;
  numero!: number;
  titulo!: string;
  fecInicio!: string;
  fecFin!: string | null;
  departamento: Record<string, unknown>[] = [{
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
  procedimiento: Record<string, unknown>[] = [{
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
  instructor: Record<string, unknown>[] = [{
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
  idHisRepre!: number | string | null;
  idRepre!: number | string | null;
  usuario!: string;
  expediente!: string;
  usuContr!: string;
  dni!: string;
  representante!: string;
  formaNotifi!: number | null;
  email!: string;

}


export class CreaSolicitudNuevo {
  id!: number | string | null;
  fecInicio!: string;
  ejercicio!: string;
  numero!: number | string | null;
  idDocum!: number | string | null;
  idHisDocum!: number | string | null;
  idPerso!: number | string | null;
  idHisPerso!: number | string | null;
  idRepre!: number | string | null;
  idHisRepre!: number | string | null;
  EnumEstadoSolicitud!: string | number | null;
  estado!: string;
  asunto!: string;
  motivoRechazo!: string;
  departamento!: number | string | null;
  usuario!: string;
  expediente!: number | string | Record<string, unknown> | null;
  fecMovim!: Date | string | null;
  codMovim!: string;
  cauMovim!: string | null;
  regActiv!: boolean;
  numDocum!: string;
  tipPerso!: string;
  nivAcces!: string | number | null;
  nombre!: string;
  particula1!: string;
  representante!: string;
  apellido1!: string;
  particula2!: string;
  apellido2!: string;
  razSocia!: string;
  razSocReduc!: string;
  desPerEntid!: string;
  domCodif!: boolean;
  idHisDomic!: number | string | null;
  idDomic!: number | string | null;
  localidad!: string;
  desTipVia!: string;
  desVia!: string;
  extInfNumer!: number | string | null;
  extInfLetra!: string | null;
  extSupNumer!: number | string | null;
  extSupLetra!: string;
  codLocal!: number | string | null;
  codPosta!: string;
  dirPosta!: string;
  observaciones!: string;
  codProvi!: number | string | null;
  codMunic!: number | string | null;
  fecMovimRepre!: Date | string | null;
  codMovimRepre!: string;
  cauMovimRepre!: string | null;
  regActivRepre!: boolean;
  numDocumRepre!: string;
  tipPersoRepre!: string | null;
  nivAccesRepre!: string | number | null;
  nombreRepre!: string;
  particula1Repre!: string;
  apellido1Repre!: string;
  particula2Repre!: string;
  apellido2Repre!: string;
  razSociaRepre!: string;
  razSocReducRepre!: string;
  desPerEntidRepre!: string;
  domCodifRepre!: boolean;
  idHisDomicRepre!: number | string | null;
  idDomicRepre!: number | string | null;
  localidadRepre!: string;
  desTipViaRepre!: string;
  desViaRepre!: string;
  extInfNumerRepre!: number | string | null;
  extInfLetraRepre!: string;
  extSupNumerRepre!: number | string | null;
  extSupLetraRepre!: string;
  codLocalRepre!: number | string | null;
  codPostaRepre!: number | string | null;
  dirPostaRepre!: string;
  observacionesRepre!: string;
  codProviRepre!: number | string | null;
  codMunicRepre!: number | string | null;
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
  fecInicio!: string;
  ejercicio!: number;
  numero!: number;
  idDocum!: number | string | null;
  idHisDocum!: number | string | null;
  idPerso!: number;
  idHisPerso!: number;
  idRepre!: number | string | null;
  idHisRepre!: number | string | null;
  estado!: string;
  asunto!: string;
  departamento!: number;
  usuario!: string;
  usuContr!: string;
  fecContr!: string;
  idexpediente!: number;
  personaEntidad: SolicitudPersonaEntidadResumen | SolicitudPersonaEntidadResumen[] | null = [{
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
  expediente: Record<string, unknown> | Record<string, unknown>[] | null = [{
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
  usuario: Array<{ usuario: string; numUsuar: string; desUsuario: string }> =
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
  usuarioOLD: Array<{ usuario: string; numUsuar: string; desUsuario: string }> = [{
    usuario: "",
    numUsuar: "",
    desUsuario: ""

  }]
}

export class EditarSolicitud {
  asunto!: string;
  estado!: string;
  usuario!: string;
  /** ISO `YYYY-MM-DD` (input type=date). */
  fecInicio!: string;
  motivoRechazo!: string;
  representante!: number | string | null;
  formaNotifi!: number | string | null;
  email!: string;
  ejercicio!: string;
  departamento!: string;
  idHisPerso!: number;
  idPerso!: number;
  idHisDocum!: number;
  idDocum!: number;
  idHisRepre!: number | string | null;
  idRepre!: number | string | null;
  expediente!: string;
  usuContr!: string;
  dni!: string;


}

