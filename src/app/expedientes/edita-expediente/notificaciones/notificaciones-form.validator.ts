import { CrearNotificacion } from '../../expedientes';
import { InteresadoListarDto } from '../../../core/dto/interesado.dto';
import { ModeloTeuCrear } from '../../expedientes';

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

export function isFechaTeuInvalida(mostrarValidaciones: boolean, fecha: Date): boolean {
  return (
    mostrarValidaciones &&
    (!fecha || (fecha instanceof Date && isNaN(fecha.getTime())))
  );
}

export function crearModeloTeuInicial(): ModeloTeuCrear {
  const modelo = new ModeloTeuCrear();
  modelo.datPerso = true;
  modelo.texPlura = true;
  modelo.incLgt = true;
  modelo.fecSolic = new Date('');
  modelo.fecGener = new Date('');
  modelo.fecFirma = new Date('');
  return modelo;
}
