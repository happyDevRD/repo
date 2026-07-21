import { ConsultaDni, CrearNotificacion } from '../../expedientes';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';

const CAMPOS_ENVIO_NULLABLE = [
  'notificador', 'notificador2', 'receptor', 'motNotif',
  'fecRecNotif', 'fecEnvio', 'fecRegistSalid', 'fecPubBop',
  'fecEmiBop', 'fecCaduc', 'numEnvioTeu', 'numBop',
  'numRegisSalid', 'observacion', 'desMotNotif',
] as const;

const CAMPOS_FECHA = [
  'fecRecNotif', 'fecEnvio', 'fecRegistSalid', 'fecPubBop', 'fecEmiBop', 'fecCaduc',
] as const;

export function prepararDatosNotificacionParaEnvio(
  creanotificacion: CrearNotificacion,
): Record<string, unknown> {
  const datos: Record<string, unknown> = { ...creanotificacion };

  CAMPOS_ENVIO_NULLABLE.forEach((campo) => {
    const valor = datos[campo];
    if (CAMPOS_FECHA.includes(campo as (typeof CAMPOS_FECHA)[number])) {
      if (!valor || valor === '' || valor === 'Invalid Date' || valor === 'null' || valor === 'undefined') {
        datos[campo] = null;
      }
    } else if (!valor || valor === '' || valor === 0) {
      datos[campo] = null;
    }
  });

  return datos;
}

export function prepararDatosEnvio(datos: Record<string, unknown>): Record<string, unknown> {
  return {
    ...datos,
    notificador: datos['notificador'] ?? '',
    forNotif: datos['forNotif'] ?? '0',
    ejeNotif: Number(datos['ejeNotif']),
    idHisPerso: Number(datos['idHisPerso']),
    idPerso: Number(datos['idPerso']),
    situacion: Number(datos['situacion']),
    ejeExped: Number(datos['ejeExped']),
    numExped: Number(datos['numExped']),
  };
}

export function validarCamposNotificacionEdicion(creanotificacion: CrearNotificacion): string[] {
  const errores: string[] = [];

  if (!creanotificacion.situacion) {
    errores.push('• Estado de la notificación es requerido');
  }

  if (Number(creanotificacion.situacion) === 1) {
    return errores;
  }

  if (!creanotificacion.notificador2) {
    errores.push('• Notificador es requerido');
  }
  if (!creanotificacion.receptor) {
    errores.push('• Receptor es requerido');
  }
  if (!creanotificacion.motNotif) {
    errores.push('• Motivo de notificación es requerido');
  }
  if (!creanotificacion.fecRecNotif) {
    errores.push('• Fecha de recepción/devolución es requerida');
  }

  return errores;
}

export interface InicializarCreacionNotificacionParams {
  usuContrl: string;
  ejercicioExpediente: number;
  numeroExpediente: number;
  identificadorFicheroSubido?: number;
  fechaActual: Date;
}

export function crearNotificacionVacia(
  params: InicializarCreacionNotificacionParams,
): CrearNotificacion {
  const creanotificacion = new CrearNotificacion();
  creanotificacion.ejeNotif = params.fechaActual.getFullYear();
  creanotificacion.situacion = 1;
  creanotificacion.usuContr = params.usuContrl;
  creanotificacion.ejeExped = params.ejercicioExpediente;
  creanotificacion.numExped = params.numeroExpediente;
  creanotificacion.forNotif = 0;
  creanotificacion.notificador = 0;
  creanotificacion.motNotif = '';
  creanotificacion.receptor = 0;
  creanotificacion.observacion = '';
  creanotificacion.dni = '';
  creanotificacion.numNotif = 0;
  creanotificacion.numBop = 0;
  creanotificacion.bop = 0;
  creanotificacion.numEnvioTeu = '';
  creanotificacion.codArchiAcuse = '';
  creanotificacion.codArchi = params.identificadorFicheroSubido;
  creanotificacion.desNotificador = '';
  creanotificacion.desMotNotif = '';
  creanotificacion.desSituacion = '';
  creanotificacion.tipVial = '';
  creanotificacion.desVial = '';
  creanotificacion.letInfer = '';
  creanotificacion.bloque = '';
  creanotificacion.portal = '';
  creanotificacion.escalera = '';
  creanotificacion.planta = '';
  creanotificacion.puerta = '';
  creanotificacion.localidad = '';
  creanotificacion.domicilio = '';
  creanotificacion.numInfer = 0;
  creanotificacion.numSuper = 0;
  creanotificacion.codPosta = 0;
  creanotificacion.codProvi = 0;
  creanotificacion.codMunic = 0;
  creanotificacion.numRegisSalid = 0;
  creanotificacion.fecNotif = params.fechaActual;
  return creanotificacion;
}

export function normalizarCreacionNotificacion(
  creanotificacion: CrearNotificacion,
  interesado: InteresadoListarDto,
  params: {
    usuContrl: string;
    ejercicioExpediente: number;
    numeroExpediente: number;
    identificadorFicheroSubido?: number;
    fechaActual: Date;
  },
): void {
  creanotificacion.situacion = 1;
  creanotificacion.usuContr = params.usuContrl;

  if (interesado.perEntid) {
    const persona = Array.isArray(interesado.perEntid) ? interesado.perEntid[0] : interesado.perEntid;
    creanotificacion.idHisPerso = persona.idHisPerso || 0;
    creanotificacion.idPerso = persona.idPerso || 0;
  } else {
    creanotificacion.idHisPerso = interesado.idHisPerso || 0;
    creanotificacion.idPerso = interesado.idPerso || 0;
  }

  creanotificacion.ejeExped = params.ejercicioExpediente;
  creanotificacion.numExped = params.numeroExpediente;
  creanotificacion.codArchi = params.identificadorFicheroSubido;
  creanotificacion.ejeNotif = creanotificacion.ejeNotif || params.fechaActual.getFullYear();
  creanotificacion.forNotif = creanotificacion.forNotif ?? 0;
  creanotificacion.notificador = creanotificacion.notificador ?? 0;
  creanotificacion.motNotif = creanotificacion.motNotif ?? '';
  creanotificacion.receptor = creanotificacion.receptor ?? 0;
  creanotificacion.observacion = creanotificacion.observacion ?? '';
  creanotificacion.numNotif = creanotificacion.numNotif ?? 0;
  creanotificacion.numBop = creanotificacion.numBop ?? 0;
  creanotificacion.bop = creanotificacion.bop ?? 0;
  creanotificacion.numEnvioTeu = creanotificacion.numEnvioTeu ?? '';
  creanotificacion.codArchiAcuse = creanotificacion.codArchiAcuse ?? '';
  creanotificacion.idNotif = creanotificacion.idNotif ?? 0;
  creanotificacion.personaEntidad = creanotificacion.personaEntidad ?? null;
  creanotificacion.desNotificador = creanotificacion.desNotificador ?? '';
  creanotificacion.desMotNotif = creanotificacion.desMotNotif ?? '';
  creanotificacion.desSituacion = creanotificacion.desSituacion ?? '';
  creanotificacion.fecRecNotif = creanotificacion.fecRecNotif ?? null;
  creanotificacion.notificador2 = creanotificacion.notificador2 ?? 0;
  creanotificacion.codProvi = creanotificacion.codProvi ?? 0;
  creanotificacion.codMunic = creanotificacion.codMunic ?? 0;
  creanotificacion.tipVial = creanotificacion.tipVial ?? '';
  creanotificacion.desVial = creanotificacion.desVial ?? '';
  creanotificacion.numInfer = creanotificacion.numInfer ?? 0;
  creanotificacion.letInfer = creanotificacion.letInfer ?? '';
  creanotificacion.numSuper = creanotificacion.numSuper ?? 0;
  creanotificacion.bloque = creanotificacion.bloque ?? '';
  creanotificacion.portal = creanotificacion.portal ?? '';
  creanotificacion.escalera = creanotificacion.escalera ?? '';
  creanotificacion.planta = creanotificacion.planta ?? '';
  creanotificacion.puerta = creanotificacion.puerta ?? '';
  creanotificacion.localidad = creanotificacion.localidad ?? '';
  creanotificacion.domicilio = creanotificacion.domicilio ?? '';
  creanotificacion.codPosta = creanotificacion.codPosta ?? 0;
  creanotificacion.fecArchi = creanotificacion.fecArchi ?? null;
  creanotificacion.fecRegistSalid = creanotificacion.fecRegistSalid ?? null;
  creanotificacion.numRegisSalid = creanotificacion.numRegisSalid ?? 0;
  creanotificacion.fecEnvio = creanotificacion.fecEnvio ?? null;
  creanotificacion.fecCaduc = creanotificacion.fecCaduc ?? null;
  creanotificacion.fecEmiBop = creanotificacion.fecEmiBop ?? null;
  creanotificacion.fecPubBop = creanotificacion.fecPubBop ?? null;
}

export function aplicarNotificacionVer(
  host: {
    creanotificacion: CrearNotificacion;
    notificacionver: any;
    modoVerNotificacion: boolean;
    idNotificacion: number;
    ejerNotifi: string;
    numeroNotifi: string;
    fechNotifi: any;
    dniNotifi: string;
    desPerEntidNotifi: string;
  },
  notificacionver: any,
  modoVer: boolean,
  id: number,
): void {
  host.modoVerNotificacion = modoVer;
  host.idNotificacion = id;
  host.notificacionver = notificacionver;
  host.creanotificacion = {
    ...host.creanotificacion,
    ejeNotif: notificacionver?.ejeNotif,
    numNotif: notificacionver?.numNotif,
    forNotif: notificacionver?.forNotif,
    fecNotif: notificacionver?.fecNotif,
    situacion: notificacionver?.situacion,
    dni: notificacionver?.personaEntidad?.numDocum || '',
    notificador: notificacionver?.notificador,
    notificador2: notificacionver?.notificador,
    fecEnvio: notificacionver?.fecEnvio,
    fecRecNotif: notificacionver?.fecRecNotif,
    receptor: notificacionver?.receptor || '',
    motNotif: notificacionver?.motNotif || '',
    fecRegistSalid: notificacionver?.fecRegistSalid,
    numEnvioTeu: notificacionver?.numEnvioTeu,
    bop: notificacionver?.bop,
    fecPubBop: notificacionver?.fecPubBop,
    numBop: notificacionver?.numBop,
    observacion: notificacionver?.observacion,
  };
  host.ejerNotifi = notificacionver?.ejeNotif;
  host.numeroNotifi = notificacionver?.numNotif;
  host.fechNotifi = notificacionver?.fecNotif;
  host.dniNotifi = notificacionver?.personaEntidad?.numDocum || '';
  host.desPerEntidNotifi = notificacionver?.personaEntidad?.desPerEntid || '';
}

export function resetEdicionNotificacion(host: {
  creanotificacion: CrearNotificacion;
  ejerNotifi: string;
  numeroNotifi: string;
  fechNotifi: string;
  dniNotifi: string;
  desPerEntidNotifi: string;
  dniok: boolean;
  fechaordenadafenvio: string;
  fechaordenadafrecep: string;
  fechaordenadafpubli: string;
  fechaenvioTEU: string;
  modoVerNotificacion: boolean;
}): void {
  host.creanotificacion = new CrearNotificacion();
  host.ejerNotifi = '';
  host.numeroNotifi = '';
  host.fechNotifi = '';
  host.dniNotifi = '';
  host.desPerEntidNotifi = '';
  host.dniok = false;
  host.fechaordenadafenvio = '';
  host.fechaordenadafrecep = '';
  host.fechaordenadafpubli = '';
  host.fechaenvioTEU = '';
  host.modoVerNotificacion = false;
}

export function nuevaConsultaDni(): ConsultaDni {
  return new ConsultaDni();
}

export interface CargarInteresadoNotificacionHost {
  creanotificacion: CrearNotificacion;
  textoFormaNotif: string;
  dniok: boolean;
  listarinteresadosdto: InteresadoListarDto[];
}

export function cargarDatosInteresadoNotificacion(
  host: CargarInteresadoNotificacionHost,
  dni: string,
): void {
  if (!dni) {
    host.creanotificacion.forNotif = 0;
    host.textoFormaNotif = '';
    host.creanotificacion.idHisPerso = 0;
    host.creanotificacion.idPerso = 0;
    host.creanotificacion.dni = '';
    host.dniok = false;
    return;
  }

  const interesado = host.listarinteresadosdto.find((inter) => inter.numDocumInter === dni);

  if (interesado) {
    host.creanotificacion.forNotif = interesado.tipForNotif || 0;
    host.textoFormaNotif = interesado.tipForNotif === 0 ? 'Correo postal' : 'Telemática';
    host.creanotificacion.dni = dni;

    if (interesado.perEntid) {
      const persona = Array.isArray(interesado.perEntid)
        ? interesado.perEntid[0]
        : interesado.perEntid;
      host.creanotificacion.idHisPerso = persona.idHisPerso || 0;
      host.creanotificacion.idPerso = persona.idPerso || 0;
      host.creanotificacion.localidad = persona.localidad || '';
      host.creanotificacion.domicilio = persona.dirPosta || '';
      host.creanotificacion.codPosta = persona.codPosta || 0;
      host.creanotificacion.codProvi = persona.codProvi || 0;
      host.creanotificacion.codMunic = persona.codMunic || 0;
    } else {
      host.creanotificacion.idHisPerso = interesado.idHisPerso || 0;
      host.creanotificacion.idPerso = interesado.idPerso || 0;
    }
  } else {
    host.creanotificacion.forNotif = 0;
    host.textoFormaNotif = '';
    host.creanotificacion.idHisPerso = 0;
    host.creanotificacion.idPerso = 0;
    host.creanotificacion.dni = dni;
  }
}
