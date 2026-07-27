import { HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { tap } from 'rxjs/operators'
import {
  ConsultaDni,
  CrearTramiteExp,
  EditExpediente,
  LeerNotificacion,
  ModeloTeuListar,
  TareaTramiteExpedienteCrear,
  TemaDocumentoListar,
  VerExpediente,
  VerMetadatos,
} from '../../expedientes'
import { TramiteExpedienteDto } from '../../../../core/models/tramite-expediente.dto'
import { TareaTramiteExpedienteVer } from '../../../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto'
import { TipoObjetoTributarioDto } from '../../../../core/models/tipo-objeto-tributario.dto'
import { ProcediPermisos, ProcediPermisosListar } from '../../../procedimientos/procedimiento'
import { ProcedimientoService } from '../../../procedimientos/procedimiento.service'
import { ExpedientesService } from '../../expedientes.service'
import { NotificacionesService } from '../../services/notificaciones.service'
import { TramitesService } from '../../tramites.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { NavigationService } from '../../../../core/service/navigation.service'
import { Pais } from '../edita-expediente.models'
import {
  buildEditaExpedienteWorkspaceGrids,
  EditaExpedienteWorkspaceGridsBundle,
  EditaExpedienteWorkspaceGridsContext,
} from '../config/edita-expediente-workspace-grids.config'
import { buildNotificacionGridSourceFromLocal } from '../notificaciones/notificaciones-grid.config'
import { actualizarSourceNotificacionesGrid } from '../notificaciones/notificaciones-grid-refresh.helper'
import { EditaExpedienteNotificacionesUiFacade } from '../notificaciones/edita-expediente-notificaciones-ui.facade'
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types'

export interface EditaExpedienteInitHost {
  procedipermiso: ProcediPermisos[]
  pais: Pais[]
  verExpediente: { ejercicio: number; numero: number }
  idExpediente: number
  fsistema: unknown
  FechaSistema(): void
  cargarExpediente(): void | Promise<void>
  listadodeNotificaciones(): void
  getTipoObjetoTributario(): void
  verNotificacion(id: number): void
  editarNotificacion(id: number): void
}

export interface EditaExpedienteCargaHost {
  idExpediente: number
  atrasruta: string
  verExpediente: VerExpediente
  tramiteExpedienteListar: TramiteExpedienteDto[]
  inicializarSourceListarNotifi(): void
  actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]): void
  getListarInteresado(idexp: number): void
  getListarTramites(id: number): void
  cargarEstadoInside?(idExpediente: number): void
  /** Aplica la vista inicial (Notificaciones/Tramitadores) indicada por el query param `vista`. */
  verNotificaciones?(): void
  veotramitadores?(): void
}

export interface EditaExpedienteExpedienteHost {
  editexpediente: EditExpediente
  idExpediente: number
  recargarpagina(): void
}

export interface EditaExpedienteGridRefreshHost {
  sourceListarNotifi: IflowGridSource & { records?: LeerNotificacion[] }
  verExpediente: { ejercicio: number; numero: number }
}

export interface EditaExpedienteNotificacionesGridHost extends EditaExpedienteGridRefreshHost {
  leernotificacion?: LeerNotificacion[]
  idNotificacion: number
  gridNotificaciones?: {
    updatebounddata(): void
    refreshdata(): void
    getrowdata(id: number): unknown
  }
  cdr: ChangeDetectorRef
  habilitarBotonesNotificacion(rowData: unknown): void
}

export interface EditaExpedienteCatalogosHost {
  temadocumentolistar: TemaDocumentoListar[]
  tareaProcedimientoVer: TareaTramiteExpedienteVer
  vermetadatos: VerMetadatos
  tipoObjetoTributario: TipoObjetoTributarioDto[]
  fechaSistema: string
  creartramiteexp: CrearTramiteExp
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear
  fechametadatabuena: string
  procedipermisolistar: ProcediPermisosListar[]
}

/** Facade unificado: init + carga + expediente + grids + UI helpers + catálogos. */
@Injectable()
export class EditaExpedienteLifecycleFacade {
  private readonly destroyRef = inject(DestroyRef)

  // Estado DNI (en lifecycleFacade)
  public consultadni: ConsultaDni = new ConsultaDni()
  public dniok = false
  public formanotificacion = false

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly expedientesService: ExpedientesService,
    private readonly tramitesService: TramitesService,
    private readonly notificacionesService: NotificacionesService,
    private readonly notifUiFacade: EditaExpedienteNotificacionesUiFacade,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly navigationService: NavigationService,
  ) {}

  // --- Init ---

  cargarDatosIniciales(host: EditaExpedienteInitHost): void {
    host.FechaSistema()
    host.cargarExpediente()
    host.listadodeNotificaciones()
    host.getTipoObjetoTributario()

    this.procedimientoService.getPermisoProcedi().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (procedipermisos) => {
        host.procedipermiso = procedipermisos
      },
    })

    this.expedientesService.getPaises().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (pais) => {
        host.pais = pais
      },
    })

    this.expedientesService.getModeloTeuListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (modeloteulistar) => {
        this.notifUiFacade.modeloteulistar = modeloteulistar
      },
    })

    this.notifUiFacade.registerGridWindowCallbacks({
      verNotificacion: (id) => this.notifUiFacade.verNotificacion(undefined, id),
      editarNotificacion: (id) => this.notifUiFacade.editarNotificacion(undefined, id),
    })
  }

  // --- Carga ---

  cargarDesdeRuta(host: EditaExpedienteCargaHost, activatedRoute: ActivatedRoute): void {
    activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((params) => {
      const id = Number(params['id'])
      if (!id) {
        return
      }

      host.idExpediente = id
      host.atrasruta = `editaexpediente/${id}`
      host.getListarTramites(id)
      host.cargarEstadoInside?.(id)

      this.expedientesService.getExpediente(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (verExpediente: VerExpediente) => {
          host.verExpediente = verExpediente
          host.inicializarSourceListarNotifi()
          host.getListarInteresado(host.idExpediente)
          this.cargarLeerNotificaciones(host)

          const vista = activatedRoute.snapshot.queryParamMap.get('vista')
          if (vista === 'notificaciones' || vista === 'tramitadores') {
            // Se difiere para que la carga inicial (grids, catálogos) estabilice antes de
            // montar la vista vía *ngIf; aplicarla en el mismo tick cancela la petición
            // AJAX propia del grid (jqxGrid no usa HttpClient) al recrearse el elemento.
            setTimeout(() => {
              if (vista === 'notificaciones') {
                host.verNotificaciones?.()
              } else {
                host.veotramitadores?.()
              }
            }, 600)
          }
        },
        error: (error) => {
          if (error.status === 0) {
            console.error('NO HAY CONEXION CON LA BASE DE DATOS!!!!!')
          }
        },
      })

      this.tramitesService.getTramiteExpediente(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (tramiteExpedientelista: TramiteExpedienteDto[]) => {
          host.tramiteExpedienteListar = tramiteExpedientelista
        },
        error: (error) => {
          if (error.status === 0) {
            console.error('NO HAY CONEXION CON LA BASE DE DATOS!!!!!')
          }
        },
      })
    })
  }

  private cargarLeerNotificaciones(host: EditaExpedienteCargaHost): void {
    const { ejercicio, numero } = host.verExpediente
    if (!ejercicio || !numero) {
      return
    }

    this.notificacionesService.getNotificacionListar(ejercicio, numero).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (leerNotificacion) => host.actualizarGridNotificaciones(leerNotificacion ?? []),
      error: () => host.actualizarGridNotificaciones([]),
    })
  }

  // --- Expediente ---

  editExpediente(host: EditaExpedienteExpedienteHost): void {
    this.expedientesService.editarExpediente(host.editexpediente, host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.router.navigate(['/expedientes', host.idExpediente, 'tramitar']),
    })
    setTimeout(host.recargarpagina, 1000)
  }

  volverListadoExpedientes(host?: { idExpediente?: number }): void {
    const fallback = host?.idExpediente ? ['/expedientes', host.idExpediente] : ['/expedientes']
    this.navigationService.goBack(fallback)
  }

  // --- Grids ---

  buildWorkspaceGrids(context: EditaExpedienteWorkspaceGridsContext): EditaExpedienteWorkspaceGridsBundle {
    return buildEditaExpedienteWorkspaceGrids(context)
  }

  refreshListarNotifi(host: EditaExpedienteGridRefreshHost, withId = false): void {
    host.sourceListarNotifi = this.notifUiFacade.createGridSource(
      host.verExpediente.ejercicio,
      host.verExpediente.numero,
      { withSort: false, ...(withId ? { withId: true } : {}) },
    )
  }

  inicializarSourceListarNotifi(host: EditaExpedienteNotificacionesGridHost): void {
    host.sourceListarNotifi = buildNotificacionGridSourceFromLocal([], {
      withSort: false,
      withId: true,
    })
  }

  actualizarGridNotificaciones(host: EditaExpedienteNotificacionesGridHost, leerNotificacion: LeerNotificacion[]): void {
    host.leernotificacion = leerNotificacion
    host.sourceListarNotifi = buildNotificacionGridSourceFromLocal(leerNotificacion, {
      withSort: false,
      withId: true,
    })
  }

  actualizarSourceNotificaciones(host: EditaExpedienteNotificacionesGridHost): void {
    actualizarSourceNotificacionesGrid(host, this.notifUiFacade)
  }

  // --- UI helpers ---

  validateAndSubmit(event: Event, formId: string, submitFunction: () => void): void {
    event.preventDefault()

    const form = document.getElementById(formId) as HTMLFormElement
    if (form?.checkValidity()) {
      submitFunction()
      return
    }

    this.notificationService.incompleteFields()
    form?.classList.add('was-validated')
  }

  handleValidationError(fieldName: string): void {
    this.notificationService.validationError(fieldName)
  }

  confirmDelete(itemName: string, deleteFunction: () => void): void {
    this.notificationService.confirmDelete(itemName).then((result) => {
      if (result.isConfirmed) {
        deleteFunction()
      }
    })
  }

  showWarning(message: string): void {
    this.notificationService.warning(message)
  }

  showInfo(message: string): void {
    this.notificationService.info(message)
  }

  formatearFechaParaInput(fecha: unknown): string {
    if (!fecha) {
      return ''
    }

    try {
      const fechaObj = new Date(fecha as string | number | Date)
      if (isNaN(fechaObj.getTime())) {
        return ''
      }
      return fechaObj.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  limpiarTodosLosFormularios(): void {
    const formIds = [
      'formNuevaTarea',
      'formNuevoTramite',
      'formNuevaNotificacion',
      'formEditarTarea',
      'formEditarTramite',
      'formEditarNotificacion',
      'formGenerarSalida',
      'formInsertarBolsa',
      'formTEU',
    ]

    formIds.forEach((formId) => {
      const form = document.getElementById(formId) as HTMLFormElement
      if (!form) {
        return
      }
      form.classList.remove('was-validated')
      form.reset()
    })
  }

  limpiarErroresValidacion(): void {
    document.querySelectorAll('.error-message').forEach((element) => element.remove())
    document.querySelectorAll('.form-control.is-invalid').forEach((element) => {
      element.classList.remove('is-invalid')
    })
  }

  // --- Catálogos ---

  fechaSistema(host: EditaExpedienteCatalogosHost): void {
    const hoy = new Date()
    const anio = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    host.fechaSistema = `${anio}-${mes}-${dia}`
    host.creartramiteexp.fecTramite = host.fechaSistema
    host.tareatramiteexpedientecrear.fecInicio = new Date()
  }

  solicitadni(host: EditaExpedienteCatalogosHost, dni: string): void {
    this.formanotificacion = true
    this.expedientesService.getDni(dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (consultadni) => (this.consultadni = consultadni),
    })
    this.dniok = true
  }

  getTemaDocumentoListar(host: EditaExpedienteCatalogosHost): void {
    this.expedientesService.getTemaDocumentoListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (temadocumentolistar) => (host.temadocumentolistar = temadocumentolistar),
    })
  }

  getTramiteProcedimientoVer(host: EditaExpedienteCatalogosHost, idtareP: number): void {
    this.procedimientoService.getTareaProcedimientoVer(idtareP).pipe(
      tap({
        next: (tareaProceDiver) => {
          host.tareaProcedimientoVer = tareaProceDiver
        },
        error: (_err: HttpErrorResponse) => {
        },
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe()
  }

  leoMetadatos(host: EditaExpedienteCatalogosHost, codfiche: number): void {
    this.expedientesService.getMetadatosVer(codfiche).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (vermetadatos) => (host.vermetadatos = vermetadatos),
    })
  }

  getTipoObjetoTributario(host: EditaExpedienteCatalogosHost): void {
    this.expedientesService.getTipoObjetoTributario().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => (host.tipoObjetoTributario = data),
      error: (error) => console.error('Error al obtener la lista:', error),
    })
  }

  formatearFechaMetadata(host: EditaExpedienteCatalogosHost, fecha: Date): void {
    const fechaStr = fecha.toString()
    const anio = fechaStr.substring(0, 4)
    const mes = fechaStr.substring(5, 7)
    const dia = fechaStr.substring(8, 10)
    host.fechametadatabuena = `${dia}-${mes}-${anio}`
  }

  getUsuarioListar(host: EditaExpedienteCatalogosHost, id: number): void {
    this.procedimientoService.getUsuarioListar(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (procedimientoPermisoListar) => (host.procedipermisolistar = procedimientoPermisoListar),
    })
  }
}
