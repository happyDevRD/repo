import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EditarMensaje,
  LeerMensajeEnviados,
  LeerMensajeRecibidos,
  RechazarMensaje,
} from '../../expedientes/expedientes';
import { ExpedientesService } from '../../expedientes/expedientes.service';

/** API de mensajes — capa de dominio desacoplada de ExpedientesService. */
@Injectable({ providedIn: 'root' })
export class MensajesService {
  constructor(private readonly expedientesService: ExpedientesService) {}

  listarRecibidos(): Observable<LeerMensajeRecibidos[]> {
    return this.expedientesService.getMensajeListarRecibidos();
  }

  listarEnviados(): Observable<LeerMensajeEnviados[]> {
    return this.expedientesService.getMensajeListarEnviados();
  }

  editar(editarmensaje: EditarMensaje, id: number): Observable<unknown> {
    return this.expedientesService.EditarMensaje(editarmensaje, id);
  }

  tramitar(editarmensaje: EditarMensaje, id: number): Observable<unknown> {
    return this.expedientesService.TramitaMensaje(editarmensaje, id);
  }

  rechazar(rechazamensaje: RechazarMensaje, id: number): Observable<unknown> {
    return this.expedientesService.RechazarMensaje(rechazamensaje, id);
  }

  marcarLeido(rechazamensaje: RechazarMensaje, id: number): Observable<unknown> {
    return this.expedientesService.LeerMensaje(rechazamensaje, id);
  }

  borrar(id: number): Observable<unknown> {
    return this.expedientesService.deleteMensaje(id);
  }
}
