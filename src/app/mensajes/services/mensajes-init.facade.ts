import { Injectable } from '@angular/core';
import { LeerMensajeEnviados, LeerMensajeRecibidos } from '../../expedientes/expedientes';
import { ProcediPermisos } from '../../procedimientos/procedimiento';
import { ProcedimientoService } from '../../procedimientos/procedimiento.service';
import { UserSessionService } from '../../core/service/user-session.service';
import {
  createMensajesEnviadosAdapter,
  createMensajesRecibidosAdapter,
} from '../config/mensajes-grid.config';
import { MensajesService } from './mensajes.service';

export interface MensajesInitHost {
  leermensajerecibido: LeerMensajeRecibidos[];
  leermensajeenviados: LeerMensajeEnviados[];
  procedipermiso: ProcediPermisos[];
  sourceMensajeRecibidos: any;
  sourceMensajeEnviados: any;
  contarPendientes(): void;
  actualizarGrids(): void;
}

@Injectable()
export class MensajesInitFacade {
  constructor(
    private readonly mensajesService: MensajesService,
    private readonly procedimientoService: ProcedimientoService,
    private readonly session: UserSessionService,
  ) {}

  initialize(host: MensajesInitHost): void {
    host.actualizarGrids();
    this.mensajesService.listarRecibidos().subscribe({
      next: (data) => {
        host.leermensajerecibido = data;
        host.contarPendientes();
      },
    });
    this.mensajesService.listarEnviados().subscribe({
      next: (data) => {
        host.leermensajeenviados = data;
      },
    });
    this.procedimientoService.getPermisoProcedi().subscribe({
      next: (permisos) => {
        host.procedipermiso = permisos;
      },
    });
  }

  refreshGridSources(host: MensajesInitHost): void {
    if (!this.session.idOrgUsuar) {
      return;
    }
    host.sourceMensajeRecibidos = createMensajesRecibidosAdapter(this.session.idOrgUsuar);
    host.sourceMensajeEnviados = createMensajesEnviadosAdapter(this.session.idOrgUsuar);
  }
}
