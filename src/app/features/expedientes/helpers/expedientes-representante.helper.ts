import { RepresentanteExpLIstar, NuevoExpediente } from '../expedientes';

export const applyRepresentanteToNuevoExpediente = (
  nuevoexpediente: NuevoExpediente,
  representanteexplistar: RepresentanteExpLIstar,
  seleccionoRepre: string | String,
): void => {
  if (seleccionoRepre === '1') {
    nuevoexpediente.idHisRepre = representanteexplistar.idHisPerso;
    nuevoexpediente.idRepre = representanteexplistar.idPerso;
    return;
  }

  nuevoexpediente.idHisRepre = null;
  nuevoexpediente.idRepre = null;
};
