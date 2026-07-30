import { CrearNotificacion } from '../../expedientes';
import { InteresadoListarDto } from '../../../../core/models/interesado.dto';
import { ModeloTeuCrear } from '../../expedientes';
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper';

export function validarFormularioCreacionNotificacion(params: {
  creanotificacion?: CrearNotificacion;
  idTarea?: number;
  interesados?: InteresadoListarDto[];
}): boolean {
  const { creanotificacion, idTarea, interesados } = params;
  const tieneFecha = !!creanotificacion?.fecNotif;
  const tieneDni = !!creanotificacion?.dni && creanotificacion.dni.trim() !== '';
  const interesadoExiste = !!interesados?.some(
    (inter) => inter.numDocumInter === creanotificacion?.dni,
  );
  const tieneTarea = !!idTarea;
  const tieneNotificador =
    !!creanotificacion?.notificador && creanotificacion.notificador !== 0;

  return tieneFecha && tieneDni && interesadoExiste && tieneTarea && tieneNotificador;
}

export function validarCamposObligatoriosTeu(modelo: ModeloTeuCrear): boolean {
  const camposObligatorios: { campo: unknown; esFecha: boolean }[] = [
    { campo: modelo.fecSolic, esFecha: true },
    { campo: modelo.fecGener, esFecha: true },
    { campo: modelo.fecFirma, esFecha: true },
    { campo: modelo.idMater, esFecha: false },
    { campo: modelo.idModel, esFecha: false },
    { campo: modelo.procedimiento, esFecha: false },
    { campo: modelo.forPubli, esFecha: false },
  ];

  return camposObligatorios.every((item) => {
    if (item.esFecha) {
      return (
        !!item.campo &&
        item.campo !== '' &&
        item.campo !== null &&
        item.campo !== undefined &&
        !(item.campo instanceof Date && isNaN(item.campo.getTime()))
      );
    }
    return !!item.campo;
  });
}

export function isFechaTeuInvalida(mostrarValidaciones: boolean, fecha: string | Date | null | undefined): boolean {
  if (!mostrarValidaciones) {
    return false
  }
  if (fecha == null || fecha === '') {
    return true
  }
  if (fecha instanceof Date) {
    return isNaN(fecha.getTime())
  }
  return false
}

export function crearModeloTeuInicial(): ModeloTeuCrear {
  const modelo = new ModeloTeuCrear();
  const hoy = fechaHoyISO()
  modelo.datPerso = true;
  modelo.texPlura = true;
  modelo.incLgt = true;
  modelo.fecSolic = hoy;
  modelo.fecGener = hoy;
  modelo.fecFirma = hoy;
  modelo.idMater = ''
  modelo.idModel = null as unknown as number
  modelo.forPubli = null as unknown as number
  return modelo
}
