import {
  EditaExpedienteNotificacionGridHost,
  EditaExpedienteTareaClickHost,
  EditaExpedienteTramiteGridHost,
} from './edita-expediente-workspace.facade';
import { ClickNotificacionNuevoHost } from '../notificaciones/notificaciones-form-campos.helper';
import { ConfigurarAccionTareaHost } from '../tareas/tareas-accion.helper';
import { EdicionTramiteHost } from '../tramites/tramites-edicion.helper';

/** Host raíz del componente para eventos de grids del workspace. */
export type EditaExpedienteWorkspaceRootHost =
  EditaExpedienteTramiteGridHost &
  ClickNotificacionNuevoHost &
  EditaExpedienteNotificacionGridHost &
  EditaExpedienteTareaClickHost &
  ConfigurarAccionTareaHost &
  EdicionTramiteHost & {
    idTramitador: number
    tareatramiteexpedienteeditar: {
      descripcion: string
      numero: unknown
      fecInicio: unknown
      fecFin: unknown
    }
  }
