export class Procedimiento {

  id!: number;
  descripcion!: string;
  codigoSia!: string;
  siglas?: string;
  modalidad?: number;
  idMatProce?: number;
  desEleme?: string;
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

export class MateriaProcedimiento {
  idMatProce!: any;
  descripcion!: any;


}

export class CrearProcedi {
  id!: number;
  descripcion!: string;
  depart!: string;
  siglas!: string;
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

    }];

  codigoSia!: string;
  usuContr!: String;
  modalidad!: number;
  materia!: number;


}

export class EditarProcedi {
  id!: number;
  descripcion!: string;
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
    }];

  codigoSia!: string;
  usuContr!: String;
  modalidad!: number;
  materia!: number


}

export class CreaTareaProcedi {
  descripcion!: string;
  fasetarea!: string;
  plazo!: number;
  tipoplazo!: string;
  procedimiento!: number;
  plantilladefecto!: any;
  firmapordefecto!: any;
  acciones!: any;
}

// export class TareaProcediVer {
//   id!: any;
//   procedimiento!: any;
//   descripcion!: any;
//   faseTarea!: any;
//
// }

export class CreaPermisoProcedi {

  idproceso!: number;
  idtarea!: number;
  usuario!: string;
  usuContr!: string;
}

export class EditaTareaProcedi {
  descripcion!: string;
  faseTarea!: string;
  plazo!: number;
  tipoPlazo!: string;
  procedimiento!: number;
  plantillaDefectoModulo!: number;
  plantillaDefecto!: any;
  firmaPorDefecto!: any;
  acciones!: any;
}

export class PlantillaTarea {
  modulo!: number;
  plantilla!: string;
  desPlant!: string;
  menImpre!: string;
  tipPlant!: number;
  tipDocum!: number;
  indReser!: number;

  indPrinc!: boolean;
  numCopia!: number;
  numEleMulti!: number;
  eFirma!: number;
  firDesat!: number

}

export class ListaTareaProcedi {


  id!: number;
  procedimiento!: number;
  descripcion!: string;
  faseTarea!: string;
  plazo!: number;
  tipoPlazo!: string;
  tareaAutomatica!: boolean;
  plantillaDefectoModulo!: number
  plantillaDefecto!: string;
  procesoFirmadoDefecto!: number;
  usuContr!: string;
  accion?: unknown;

}

export class ProcediPermisos {

  idOrgUsuar!: number;
  idOrgEleme!: number;
  usuario!: string;
  codCargo!: number;
  perEnvio!: boolean;
  perRecep!: boolean
  solUsuar!: number;
  traUsuar!: number;
  usuContr!: string;
  fecContr!: Date

}

export class ProcediPermisosListar {
  id!: number;
  desProce!: string;
  desTareaProce!: string;
  usuario!: string;
  idOrgUsuar!: number


}

export class ListarPermiso {
  id!: number;
  desProce!: string;
  desTareaProce!: string;
  usuario!: string
}

export class SolicitudListar {
  id!: number;
  fecInicio!: string;
  ejercicio!: number;
  numero!: number;
  registroEntradaSalida!: any;
  interesado: any = [{
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
    observaciones: "",
    usuContr: "",
    fecContr: "",
    codProvi: "",
    codMunic: ""
  }];
  idHisRepre!: any;
  idRepre!: any;
  representante!: any;
  estado!: string;
  asunto!: string;
  departamento: any = [{
    idOrgEleme: "",
    idOrgan: "",
    cadEleme: "",
    desEleme: "",
    accesible: "",
    organo: "",
    usuContr: "",
    idOrgElePadre: "",
    fecContr: ""
  }];
  usuarioAsignado: any = [{
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
    entidad: [{
      codEntid: "",
      desEntid: "",
      usuContr: "",
      fecContr: "",
      municipio: [{
        codProvi: "",
        codMunic: "",
        provincia: [{
          codProvi: "",
          desProvi: "",
          usuContr: "",
          fecContr: ""
        }],
        desMunic: "",
        numHabTot: "",
        numHabHom: "",
        numHabMuj: "",
        usuContr: "",
        fecContr: ""
      }],
    }],
  }];
  expediente!: string;
  usuContr!: string;
  fecContr!: string;

}

export class AtributosListar {
  etiGruAtrib!: string;
  idAtrib!: number;
  desGruAtrib!: string;
  requerido!: number;
  valInici!: string;
  valMinim!: string;
  valMaxim!: string;
  tipo!: any;
  longitud!: number;
  idGrupo!: number;
  valor!: string;

}

export class AtributosCrear {
  etiGruAtrib!: string;
  desGruAtrib!: string;
  requerido!: any;
  valInici!: string;
  valMinim!: string;
  valMaxim!: string;
  tipo!: string;
  longitud!: number;
  idAtrib!: number;

}

export class AtributosEditar {
  etiGruAtrib!: string;
  desGruAtrib!: string;
  requerido!: any;
  valInici!: string;
  valMinim!: string;
  valMaxim!: string;
  tipo!: string;
  longitud!: number;
  idGrupo!: number;

}
