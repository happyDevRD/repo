import { Injectable } from '@angular/core';
import { ModeloTeuListar } from '../../expedientes';
import { ProcediPermisos } from '../../../procedimientos/procedimiento';
import { ProcedimientoService } from '../../../procedimientos/procedimiento.service';
import { ExpedientesService } from '../../expedientes.service';
import { EditaExpedienteNotificacionesFacade } from '../notificaciones/edita-expediente-notificaciones.facade';
import { Pais } from '../edita-expediente.models';

export interface EditaExpedienteInitHost {
  procedipermiso: ProcediPermisos[];
  pais: Pais[];
  modeloteulistar: ModeloTeuListar[];
  verExpediente: { ejercicio: number; numero: number };
  idExpediente: number;
  fsistema: unknown;
  FechaSistema(): void;
  cargarExpediente(): void | Promise<void>;
  listadodeNotificaciones(): void;
  getTipoObjetoTributario(): void;
  verNotificacion(id: number): void;
  editarNotificacion(id: number): void;
}

@Injectable()
export class EditaExpedienteInitFacade {
  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly expedientesService: ExpedientesService,
    private readonly notificacionesFacade: EditaExpedienteNotificacionesFacade,
  ) {}

  cargarDatosIniciales(host: EditaExpedienteInitHost): void {
    host.FechaSistema();
    host.cargarExpediente();
    host.listadodeNotificaciones();
    host.getTipoObjetoTributario();

    this.procedimientoService.getPermisoProcedi().subscribe({
      next: (procedipermisos) => {
        host.procedipermiso = procedipermisos;
      },
    });

    this.expedientesService.getPaises().subscribe({
      next: (pais) => {
        host.pais = pais;
      },
    });

    this.expedientesService.getModeloTeuListar().subscribe({
      next: (modeloteulistar) => {
        host.modeloteulistar = modeloteulistar;
      },
    });

    this.notificacionesFacade.registerGridWindowCallbacks({
      verNotificacion: (id) => host.verNotificacion(id),
      editarNotificacion: (id) => host.editarNotificacion(id),
    });
  }
}
