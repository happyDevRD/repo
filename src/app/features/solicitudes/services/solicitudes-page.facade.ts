import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DocumentosListar, ProcediPermisos, SolicitudListar, UsuPermisos } from '../models'
import { Procedimiento } from '../../expedientes/expedientes'
import { ProcedimientoApiService } from '../../../core/service/procedimiento/procedimiento-api.service'
import { SolicitudesService } from '../solicitudes.service'
import { NotificationService } from '../../../core/service/notification.service'
import { UserSessionService } from '../../../core/service/user-session.service'
import { SolicitudesPersonaFacade } from './solicitudes-persona.facade'

export interface SolicitudesPageHost {
  solicitudlistar: SolicitudListar[]
  documentoslistar: DocumentosListar[]
  usupermisos: UsuPermisos[]
  procedipermiso: ProcediPermisos[]
  procedimientos: Procedimiento[]
  statusGetSolicitudes: number
  puedesver: boolean
}

@Injectable()
export class SolicitudesPageFacade {
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly solicitudesService: SolicitudesService,
    private readonly procedimientoApi: ProcedimientoApiService,
    private readonly session: UserSessionService,
    private readonly notificationService: NotificationService,
    private readonly personaFacade: SolicitudesPersonaFacade,
  ) {}

  cargarPagina(host: SolicitudesPageHost): void {
    if (!this.session.canManageSolicitudes) {
      this.notificationService.warning(
        `Lo sentimos, el usuario ${this.session.user} No tiene aceso a Solicitudes.`,
      )
      return
    }

    this.solicitudesService.getSolicitudes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((solicitudlistar) => {
      host.solicitudlistar = solicitudlistar
    })

    this.solicitudesService.getSolicitudes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      error: (error) => {
        host.statusGetSolicitudes = error.status
      },
    })

    this.procedimientoApi.listar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((procedimientos) => {
      host.procedimientos = procedimientos
    })

    this.solicitudesService.getAsignarA().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((usupermisos) => {
      host.usupermisos = usupermisos
    })

    this.solicitudesService.getDocumentosListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((documentoslistar) => {
      host.documentoslistar = documentoslistar
    })

    this.solicitudesService.getPermisoProcedi().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((procedipermisos) => {
      host.procedipermiso = procedipermisos
    })
  }

  filtrarPorEstado(host: SolicitudesPageHost, value: string | number): void {
    this.solicitudesService.getSolicitudesfiltro(value).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((solicitudlistar) => {
      host.solicitudlistar = solicitudlistar
    })
    this.personaFacade.resetConsulta()
  }

  aplicarFiltroUsuarios(host: SolicitudesPageHost): void {
    if (!this.session.canManageSolicitudes) {
      host.puedesver = true
    }
  }
}