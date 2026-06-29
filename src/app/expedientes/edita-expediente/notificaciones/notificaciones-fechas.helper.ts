export interface FechasNotificacionOrdenadas {
  fechaordenadafenvio: string;
  fechaordenadafrecep: string;
  fechaordenadafpubli: string;
  fechaordenadafemision: string;
}

export function calcularFechasNotificacion(
  fenvio: any,
  frecep: any,
  fpubli: any,
  femision: any,
): FechasNotificacionOrdenadas {
  const resultado: FechasNotificacionOrdenadas = {
    fechaordenadafenvio: '',
    fechaordenadafrecep: '',
    fechaordenadafpubli: '',
    fechaordenadafemision: '',
  };

  if (fenvio == null && frecep == null && fpubli == null && femision == null) {
    return resultado;
  }

  if (fenvio) {
    const aniofenvio = fenvio.substring(0, 4);
    const mesfenvio = fenvio.substring(5, 7);
    const diafenvio = fenvio.substring(8, 10);
    resultado.fechaordenadafenvio = `${aniofenvio}-${mesfenvio}-${diafenvio}`;
  }

  if (frecep) {
    const aniofrecep = frecep.substring(0, 4);
    const mesfrecep = frecep.substring(5, 7);
    const diafrecep = frecep.substring(8, 10);
    resultado.fechaordenadafrecep = `${diafrecep}-${mesfrecep}-${aniofrecep}`;
  }

  if (fpubli) {
    const aniofpubli = fpubli.substring(0, 4);
    const mesfpubli = fpubli.substring(5, 7);
    const diafpubli = fpubli.substring(8, 10);
    resultado.fechaordenadafpubli = `${aniofpubli}-${mesfpubli}-${diafpubli}`;
  }

  if (femision) {
    const aniofemision = femision.substring(0, 4);
    const mesfemision = femision.substring(5, 7);
    const diafemision = femision.substring(8, 10);
    resultado.fechaordenadafemision = `${diafemision}-${mesfemision}-${aniofemision}`;
  }

  return resultado;
}

export function formatearFechaNotificacionSeleccionada(fecNotif: unknown): string | undefined {
  if (!fecNotif) {
    return undefined;
  }
  const raw = fecNotif.toString();
  const anio = raw.substring(0, 4);
  const mes = raw.substring(5, 7);
  const dia = raw.substring(8, 10);
  return `${dia}/${mes}/${anio}`;
}
