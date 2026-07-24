import { Injectable } from '@angular/core'
import { forkJoin, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { LeerMensajeEnviados, LeerMensajeRecibidos } from '../models'
import { MensajeInboxItem } from '../models/mensajes.models'
import { MensajesService } from '../mensajes.service'
import { buildMensajeInbox } from '../helpers/mensajes-inbox.helper'

export interface MensajesInitHost {
  leermensajerecibido: LeerMensajeRecibidos[]
  leermensajeenviados: LeerMensajeEnviados[]
  inboxItems: MensajeInboxItem[]
  contarPendientes(): void
  rebuildInbox(): void
  clearSeleccion(): void
}

@Injectable()
export class MensajesInitFacade {
  constructor(private readonly mensajesService: MensajesService) {}

  initialize(host: MensajesInitHost): void {
    this.refreshAll(host)
  }

  refreshAll(host: MensajesInitHost): void {
    forkJoin({
      recibidos: this.mensajesService.listarRecibidos().pipe(catchError(() => of([] as LeerMensajeRecibidos[]))),
      enviados: this.mensajesService.listarEnviados().pipe(catchError(() => of([] as LeerMensajeEnviados[]))),
    }).subscribe({
      next: ({ recibidos, enviados }) => {
        host.leermensajerecibido = recibidos ?? []
        host.leermensajeenviados = enviados ?? []
        host.inboxItems = buildMensajeInbox(host.leermensajerecibido, host.leermensajeenviados)
        host.contarPendientes()
        host.rebuildInbox()
      },
    })
  }
}
