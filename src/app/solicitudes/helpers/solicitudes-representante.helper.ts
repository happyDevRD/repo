import { RepresentanteExpLIstar } from '../../expedientes/expedientes';
import { CreaSolicitudNuevo, EditarSolicitud } from '../solicitudes';

export const applyRepresentanteToEdit = (
  editasolicitud: EditarSolicitud,
  representanteexplistar: RepresentanteExpLIstar,
  seleccionoRepre: string | String,
): void => {
  if (seleccionoRepre === '1') {
    editasolicitud.idHisRepre = representanteexplistar.idHisPerso;
    editasolicitud.idRepre = representanteexplistar.idPerso;
    return;
  }

  editasolicitud.idHisRepre = null;
  editasolicitud.idRepre = null;
  representanteexplistar.idHisPerso = null;
  representanteexplistar.idPerso = null;
};

export const applyRepresentanteToCreate = (
  creasolicitud: CreaSolicitudNuevo,
  representanteexplistar: RepresentanteExpLIstar,
  seleccionoRepre: string | String,
): void => {
  if (seleccionoRepre !== '1') {
    return;
  }

  creasolicitud.idHisRepre = representanteexplistar.idHisPerso;
  creasolicitud.idRepre = representanteexplistar.idPerso;
};
