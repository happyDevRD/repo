import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { ConsultaDni, CrearNotificacion, LeerNotificacion, MotivoNotificacionesListar, NotificadorListar, ReceptorNotifiListar } from '../../expedientes'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { InteresadoListarDto } from '../../../../core/models/interesado.dto'
import { EnvioNotificaInfo } from '../../notificaciones/notificaciones-notifica-panel.component'
import { ModalAction } from '../../../../shared/modals/modal-action.model'
import { hasAction } from '../../../../shared/modals/modal-actions.util'
import { NotificacionBotonesVisibles } from '../../notificaciones/notificacion-estado.helper'
import {
  emptyNotificacionActions,
  pickBotonesVisibles,
  resolveNotificacionActions,
} from '../../notificaciones/notificacion-actions.helper'
import { NotificacionesService } from '../../services/notificaciones.service'
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper'
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types'
import {
  crearNotificacionVacia,
  aplicarNotificacionVer,
  normalizarCreacionNotificacion,
  prepararDatosNotificacionParaEnvio,
  cargarDatosInteresadoNotificacion,
  nuevaConsultaDni,
  resetEdicionNotificacion,
} from './notificaciones-data.helper'
import { validarFormularioCreacionNotificacion } from './notificaciones-form.validator'
import {
  asignarFechaCampoNotificacion,
  actualizarEjercicioDesdeFechaNotificacion,
  calcularFechaLimiteDesdePublicacion,
  CampoFechaNotificacion,
  FechaNotificacionInput,
} from './notificaciones-form-campos.helper'
import {
  abrirModalEnviarNotificacion,
  abrirModalVerNotificacion,
  cerrarModalVerNotificacion,
  limpiarErroresVisualesNotificacion,
  limpiarEstadoModalNotificacion,
  cerrarModalCrearNotificacion as cerrarModalCrearNotificacionDom,
  limpiarEstadoModalCrearNotificacion,
  onModalHiddenBootstrap,
} from './notificaciones-modal.helper'
import { NotificacionGridRow, NotificacionSeleccionEstado } from './notificaciones-seleccion.helper'
import {
  buildNotificacionGridSource,
  createNotificacionGridAdapter,
  NotificacionGridSourceOptions,
} from './notificaciones-grid.config'
import { calcularFechasNotificacion, FechaNotificacionRaw, FechasNotificacionOrdenadas } from './notificaciones-fechas.helper'
import { EditaExpedienteTareasFacade } from '../tareas/edita-expediente-tareas.facade'
import {
  EditaExpedienteNotificacionesTeuFacade,
  EditaExpedienteTeuHost,
  TeuFormRefLike,
} from './edita-expediente-notificaciones-teu.facade'
import {
  EditaExpedienteNotificacionesCrudFacade,
  EditaExpedienteNotificacionesCrudHost,
  CrearNotificacionConfirmadaHost,
  SolicitarCrearNotificacionHost,
} from './edita-expediente-notificaciones-crud.facade'

export type { EditaExpedienteTeuHost, TeuFormRefLike }

/** Contexto cruzado + callbacks; el estado de dominio vive en el facade. */
export interface EditaExpedienteNotificacionesUiHost {
  idTarea: number
  lifecycleFacade: {
    consultadni: ConsultaDni
    dniok: boolean
    formanotificacion: boolean
  }
  fecLimite: Date
  fecha: Date
  identificadorFicheroSubido?: number
  verExpediente: { ejercicio: number; numero: number }
  usuContrl: string | null
  listarinteresadosdto: InteresadoListarDto[]
  verNuevaNotifi: boolean
  verGenerarSalida: boolean
  verTareasdelTramite: boolean
  verformnuevatarea: boolean
  verlistadotramitadores: boolean
  nuevotramitador: boolean
  verlistadotareas: boolean
  verEditartareatramite: boolean
  limpiarEstadoModalError(): void
  limpiarFormularioNotificacion(): void
  limpiarCacheValidacion(): void
  solicitadni(dni: string): void
  inicializarFormularioTEU(): void
  abrirModal(modalId: string): void
  cerrarModal(modalId: string): void
}

export interface NotificacionCatalogos {
  receptornotifilistar: ReceptorNotifiListar[]
  motivonotificacioneslistar: MotivoNotificacionesListar[]
  notificadorlistar: NotificadorListar[]
}

export interface NotificacionListadoHost {
  verExpediente: { ejercicio: number; numero: number }
  actualizarGridNotificaciones(leerNotificacion: LeerNotificacion[]): void
}

export type {
  EditaExpedienteNotificacionesCrudHost,
  CrearNotificacionConfirmadaHost,
  SolicitarCrearNotificacionHost,
} from './edita-expediente-notificaciones-crud.facade'

@Injectable()
export class EditaExpedienteNotificacionesUiFacade {
  /** Fuente de verdad de botones de toolbar/modales de notificación. */
  public notificacionActions: ModalAction[] = emptyNotificacionActions()

  public fechNotifi: string | Date | null = null
  public ejerNotifi!: string
  public numeroNotifi!: string
  public dniNotifi!: string
  public desPerEntidNotifi!: string
  public verInfoNotifi = false
  public desMotNotif!: string
  public observacionNotifi!: string
  public envioNotifica: EnvioNotificaInfo | null = null
  /** Descripciones de catálogo (no códigos Short del DTO). */
  public motNotif: string | null = null
  public receptor: string | null = null
  public notificador: string | null = null
  public situacion: string | number | null = null
  public fechaprueba: string | Date | null = null
  public fechaenvioTEU: string | null = null
  public fechaordenadafenvio = ''
  public fechaordenadafrecep = ''
  public fechaordenadafpubli = ''
  public fechaordenadafemision = ''

  // --- Estado de dominio (antes en EditaExpedienteComponent) ---
  public creanotificacion: CrearNotificacion = new CrearNotificacion()
  public notificacionver: LeerNotificacion = {
    personaEntidad: {
      idPerso: 0,
      idHisPerso: 0,
      numDocum: '',
      tipPerso: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      desPerEntid: '',
      localidad: '',
      codPosta: 0,
      dirPosta: '',
      municipio: '',
      provincia: '',
    },
  } as LeerNotificacion
  public modoVerNotificacion = false
  public idNotificacion = 0
  public textoFormaNotif = ''
  public receptornotifilistar: ReceptorNotifiListar[] = []
  public motivonotificacioneslistar: MotivoNotificacionesListar[] = []
  public notificadorlistar: NotificadorListar[] = []

  /** Cache de validación del formulario de creación (antes FormFacade). */
  private formularioValido = false
  private ultimaValidacion: unknown = null
  private readonly destroyRef = inject(DestroyRef)

  /** Contexto cruzado del expediente (callbacks/flags fuera del dominio notif). */
  private crossHost: (
    EditaExpedienteNotificacionesUiHost &
    EditaExpedienteNotificacionesCrudHost &
    EditaExpedienteTeuHost &
    SolicitarCrearNotificacionHost
  ) | null = null

  bindCrossHost(
    host: EditaExpedienteNotificacionesUiHost &
      EditaExpedienteNotificacionesCrudHost &
      EditaExpedienteTeuHost &
      SolicitarCrearNotificacionHost,
  ): void {
    this.crossHost = host
  }

  private requireCrossHost(): EditaExpedienteNotificacionesUiHost &
    EditaExpedienteNotificacionesCrudHost &
    EditaExpedienteTeuHost &
    SolicitarCrearNotificacionHost {
    if (!this.crossHost) {
      throw new Error('NotificacionesUiFacade: crossHost no enlazado')
    }
    return this.crossHost
  }

  private resolveUiHost(host?: EditaExpedienteNotificacionesUiHost): EditaExpedienteNotificacionesUiHost {
    return host ?? this.requireCrossHost()
  }

  private resolveCrudHost(host?: EditaExpedienteNotificacionesCrudHost): EditaExpedienteNotificacionesCrudHost {
    return host ?? this.requireCrossHost()
  }

  private resolveTeuHost(host?: EditaExpedienteTeuHost): EditaExpedienteTeuHost {
    return host ?? this.requireCrossHost()
  }

  private resolveCrearHost(host?: SolicitarCrearNotificacionHost): SolicitarCrearNotificacionHost {
    return host ?? this.requireCrossHost()
  }

  private resolveConfirmHost(host?: CrearNotificacionConfirmadaHost): CrearNotificacionConfirmadaHost {
    return host ?? this.requireCrossHost()
  }

  get veoenviar(): boolean { return hasAction(this.notificacionActions, 'enviar') }
  set veoenviar(value: boolean) { this.patchActionVisible('enviar', value) }

  get veoEnviarNotifica(): boolean { return hasAction(this.notificacionActions, 'enviarNotifica') }
  set veoEnviarNotifica(value: boolean) { this.patchActionVisible('enviarNotifica', value) }

  get veoSincronizarNotifica(): boolean { return hasAction(this.notificacionActions, 'sincronizar') }
  set veoSincronizarNotifica(value: boolean) { this.patchActionVisible('sincronizar', value) }

  get veorecepcionar(): boolean { return hasAction(this.notificacionActions, 'recepcionar') }
  set veorecepcionar(value: boolean) { this.patchActionVisible('recepcionar', value) }

  get veopublicar(): boolean { return hasAction(this.notificacionActions, 'publicar') }
  set veopublicar(value: boolean) { this.patchActionVisible('publicar', value) }

  get veodevolver(): boolean { return hasAction(this.notificacionActions, 'devolver') }
  set veodevolver(value: boolean) { this.patchActionVisible('devolver', value) }

  get veoanular(): boolean { return hasAction(this.notificacionActions, 'anular') }
  set veoanular(value: boolean) { this.patchActionVisible('anular', value) }

  get veoborrar(): boolean { return hasAction(this.notificacionActions, 'borrar') }
  set veoborrar(value: boolean) { this.patchActionVisible('borrar', value) }

  get veoteu(): boolean { return hasAction(this.notificacionActions, 'teu') }
  set veoteu(value: boolean) { this.patchActionVisible('teu', value) }

  get veoReenviarTeu(): boolean { return hasAction(this.notificacionActions, 'reenviarTeu') }
  set veoReenviarTeu(value: boolean) { this.patchActionVisible('reenviarTeu', value) }

  get mostrarBotonDescargaTEUPrincipal(): boolean { return hasAction(this.notificacionActions, 'descargaTeu') }
  set mostrarBotonDescargaTEUPrincipal(value: boolean) { this.patchActionVisible('descargaTeu', value) }

  constructor(
    private readonly modalManagerService: ModalManagerService,
    private readonly cdr: ChangeDetectorRef,
    private readonly notificacionesService: NotificacionesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly teuFacade: EditaExpedienteNotificacionesTeuFacade,
    private readonly crudFacade: EditaExpedienteNotificacionesCrudFacade,
  ) {
    this.teuFacade.bind({
      getIdNotificacion: () => this.idNotificacion,
      setDescargaTeuPrincipal: (value) => { this.mostrarBotonDescargaTEUPrincipal = value },
      resolveTeuHost: (host) => this.resolveTeuHost(host),
    })
    this.crudFacade.bind({
      getState: () => this,
      resolveCrudHost: (host) => this.resolveCrudHost(host),
      resolveCrearHost: (host) => this.resolveCrearHost(host),
      resolveConfirmHost: (host) => this.resolveConfirmHost(host),
      refrescarGridTareas: (host, idTramite) => this.tareasFacade.refrescarGrid(host, idTramite),
    })
  }

  applyBotonesVisibles(botones: NotificacionBotonesVisibles): void {
    this.notificacionActions = resolveNotificacionActions(botones)
  }

  applySeleccionEstado(estado: NotificacionSeleccionEstado): void {
    this.fechaenvioTEU = estado.fechaenvioTEU ?? null
    this.fechaprueba = estado.fechaprueba
    this.situacion = estado.situacion
    this.motNotif = estado.motNotif
    this.receptor = estado.receptor
    this.notificador = estado.notificador
    this.verInfoNotifi = estado.verInfoNotifi
    this.desMotNotif = estado.desMotNotif ?? ''
    this.desPerEntidNotifi = estado.desPerEntidNotifi
    this.dniNotifi = estado.dniNotifi
    this.ejerNotifi = String(estado.ejerNotifi ?? '')
    this.numeroNotifi = String(estado.numeroNotifi ?? '')
    this.observacionNotifi = estado.observacionNotifi ?? ''
    if (estado.fechNotifi !== undefined) {
      this.fechNotifi = estado.fechNotifi
    }
    this.notificacionActions = estado.actions?.length
      ? estado.actions
      : resolveNotificacionActions(pickBotonesVisibles(estado))
  }

  quitabotonesNotifi(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.notificacionActions = emptyNotificacionActions()
  }

  resetvariables(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    host.lifecycleFacade.dniok = false
    host.verTareasdelTramite = true
    host.verformnuevatarea = false
    host.verlistadotramitadores = false
    host.nuevotramitador = false
    host.verlistadotareas = true
    host.verEditartareatramite = false
    host.verNuevaNotifi = false
    host.verGenerarSalida = false
    this.creanotificacion = new CrearNotificacion()
    host.limpiarEstadoModalError()
  }

  clickNuevaNotificacion(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    this.creanotificacion = crearNotificacionVacia({
      usuContrl: host.usuContrl!,
      ejercicioExpediente: host.verExpediente.ejercicio,
      numeroExpediente: host.verExpediente.numero,
      identificadorFicheroSubido: host.identificadorFicheroSubido,
      fechaActual: host.fecha,
    })
    this.textoFormaNotif = ''
    host.lifecycleFacade.dniok = false
    host.lifecycleFacade.consultadni = nuevaConsultaDni()
    host.limpiarCacheValidacion()
  }

  cambioYearEjercicio(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    actualizarEjercicioDesdeFechaNotificacion(this.creanotificacion, host.fecha)
    host.limpiarCacheValidacion()
  }

  fechamas15(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    const limite = calcularFechaLimiteDesdePublicacion(this.creanotificacion.fecPubBop)
    if (limite) {
      host.fecLimite = limite
    }
  }

  cargarDatosInteresado(hostParam: EditaExpedienteNotificacionesUiHost | undefined, dni: string): void {
    const host = this.resolveUiHost(hostParam)
    const bag = {
      creanotificacion: this.creanotificacion,
      textoFormaNotif: this.textoFormaNotif,
      lifecycleFacade: host.lifecycleFacade,
      listarinteresadosdto: host.listarinteresadosdto,
    }
    cargarDatosInteresadoNotificacion(bag, dni)
    this.textoFormaNotif = bag.textoFormaNotif
    if (dni) {
      host.solicitadni(dni)
    }
    host.limpiarCacheValidacion()
  }

  onFechaCampoChange(_host: EditaExpedienteNotificacionesUiHost | undefined, campo: CampoFechaNotificacion, eventOrValue: Event | string): void {
    const valor = typeof eventOrValue === 'string'
      ? eventOrValue
      : (eventOrValue.target as HTMLInputElement).value
    asignarFechaCampoNotificacion(this.creanotificacion, campo, valor)
  }

  limpiarErroresVisuales(): void {
    limpiarErroresVisualesNotificacion()
  }

  cerrarModalNotificacion(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    try {
      cerrarModalVerNotificacion(() => resetEdicionNotificacion(this, host.lifecycleFacade))
    } catch {
      this.modalManagerService.closeModal('verNotifiModal')
      resetEdicionNotificacion(this, host.lifecycleFacade)
    }
  }

  verNotificacion(_host: EditaExpedienteNotificacionesUiHost | undefined, id: number): void {
    limpiarEstadoModalNotificacion()
    this.idNotificacion = id
    this.modoVerNotificacion = true
    void this.vernotifi(undefined, id, true)
    abrirModalVerNotificacion()
  }

  editarNotificacion(_host: EditaExpedienteNotificacionesUiHost | undefined, id: number): void {
    limpiarEstadoModalNotificacion()
    void this.vernotifi(undefined, id, false)
    abrirModalVerNotificacion()
  }

  abrirModalEnvioTeu(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.modeloteucrear = this.inicializarFormulario()
    this.mostrarValidacionesTEU = false
    this.modalManagerService.openModal('EnvioTeu')
  }

  abrirModalEnviarNotificacion(_host?: EditaExpedienteNotificacionesUiHost): void {
    Promise.resolve(this.vernotifi(undefined, this.idNotificacion, false)).then(() => {
      this.creanotificacion.fecEnvio = fechaHoyISO()
      abrirModalEnviarNotificacion()
    })
  }

  borraDatosCrearNotifi(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion = new CrearNotificacion()
    this.resolveUiHost(hostParam).limpiarEstadoModalError()
  }

  borrarDatosPublicacion(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion = new CrearNotificacion()
  }

  borraDatosEnviarNotifi(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion = new CrearNotificacion()
  }

  borraDatosRecepcion(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion = new CrearNotificacion()
  }

  cerrarModalCrearNotificacion(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    cerrarModalCrearNotificacionDom(
      () => host.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => host.cerrarModal(modalId),
    )
  }

  onModalHidden(): void {
    onModalHiddenBootstrap(() => this.cdr.detectChanges())
  }

  limpiarEstadoModalError(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    const host = this.resolveUiHost(hostParam)
    limpiarEstadoModalCrearNotificacion(
      () => host.limpiarFormularioNotificacion(),
      () => this.cdr.detectChanges(),
      (modalId) => host.cerrarModal(modalId),
    )
  }

  // --- Formulario creación (antes NotificacionesFormFacade) ---

  getFormularioValido(hostParam?: EditaExpedienteNotificacionesUiHost): boolean {
    const host = this.resolveUiHost(hostParam)
    const valoresActuales = {
      fecha: this.creanotificacion?.fecNotif,
      dni: this.creanotificacion?.dni,
      observacion: this.creanotificacion?.observacion,
      idTarea: host.idTarea,
      interesadosLength: host.listarinteresadosdto?.length || 0,
    }

    if (JSON.stringify(valoresActuales) !== JSON.stringify(this.ultimaValidacion)) {
      this.ultimaValidacion = valoresActuales
      this.formularioValido = this.validarFormulario(host)
    }

    return this.formularioValido
  }

  validarFormulario(hostParam?: EditaExpedienteNotificacionesUiHost): boolean {
    const host = this.resolveUiHost(hostParam)
    return validarFormularioCreacionNotificacion({
      creanotificacion: this.creanotificacion,
      idTarea: host.idTarea,
      interesados: host.listarinteresadosdto,
    })
  }

  limpiarCacheValidacion(): void {
    this.ultimaValidacion = null
    this.formularioValido = false
  }

  inicializarFechaNotificacion(_host?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion.fecNotif = fechaHoyISO()
  }

  limpiarFormularioNotificacion(hostParam?: EditaExpedienteNotificacionesUiHost): void {
    this.creanotificacion = new CrearNotificacion()
    this.textoFormaNotif = ''
    this.inicializarFechaNotificacion(hostParam)
  }

  // --- Dominio notificaciones (antes NotificacionesFacade) ---

  loadCatalogos(target?: Partial<NotificacionCatalogos>): void {
    const dest = target ?? this
    this.notificacionesService.getReceptorNofitiListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (data) => (dest.receptornotifilistar = data),
    )
    this.notificacionesService.getMotivoNofitiListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (data) => (dest.motivonotificacioneslistar = data),
    )
    this.notificacionesService.getNotificadorListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (data) => (dest.notificadorlistar = data),
    )
  }

  createGridAdapter(
    ejercicio: number,
    numero: number,
    options?: NotificacionGridSourceOptions,
  ): IflowGridSource {
    return createNotificacionGridAdapter(ejercicio, numero, options)
  }

  createGridSource(
    ejercicio: number,
    numero: number,
    options?: NotificacionGridSourceOptions,
  ): Record<string, unknown> {
    return buildNotificacionGridSource(ejercicio, numero, options)
  }

  registerGridWindowCallbacks(handlers: {
    verNotificacion: (id: number) => void
    editarNotificacion: (id: number) => void
  }): void {
    window.verNotificacion = handlers.verNotificacion
    window.editarNotificacion = handlers.editarNotificacion
  }

  cargarEnvioNotificaActivo(
    idNotificacion: number,
    onResult: (envio: EnvioNotificaInfo | null) => void,
  ): void {
    if (!idNotificacion) {
      onResult(null)
      return
    }

    this.notificacionesService.consultarEnvioNotifica(idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (envio) => {
        onResult(
          envio
            ? {
              idEnvioExterno: envio.idEnvioExterno,
              estadoNotifica: envio.estadoNotifica,
              fecEnvio: envio.fecEnvio,
              idAcuseExterno: envio.idAcuseExterno,
            }
            : null,
        )
      },
      error: () => onResult(null),
    })
  }

  listarNotificacionesDelExpediente(host: NotificacionListadoHost): void {
    const { ejercicio, numero } = host.verExpediente
    if (!ejercicio || !numero) {
      return
    }

    this.notificacionesService.getNotificacionListar(ejercicio, numero).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (leernotificacion) => host.actualizarGridNotificaciones(leernotificacion ?? []),
      error: () => host.actualizarGridNotificaciones([]),
    })
  }

  aplicarFechasNotificacion(
    host: FechasNotificacionOrdenadas,
    fenvio: FechaNotificacionRaw,
    frecep: FechaNotificacionRaw,
    fpubli: FechaNotificacionRaw,
    femision: FechaNotificacionRaw,
  ): void {
    Object.assign(host, calcularFechasNotificacion(fenvio, frecep, fpubli, femision))
  }

  // --- TEU (delegado a EditaExpedienteNotificacionesTeuFacade) ---
  get mostrarBotonDescargaTEU() { return this.teuFacade.mostrarBotonDescargaTEU }
  set mostrarBotonDescargaTEU(v: boolean) { this.teuFacade.mostrarBotonDescargaTEU = v }
  get mostrarValidacionesTEU() { return this.teuFacade.mostrarValidacionesTEU }
  set mostrarValidacionesTEU(v: boolean) { this.teuFacade.mostrarValidacionesTEU = v }
  get modeloteucrear() { return this.teuFacade.modeloteucrear }
  set modeloteucrear(v) { this.teuFacade.modeloteucrear = v }
  get modeloteulistar() { return this.teuFacade.modeloteulistar }
  set modeloteulistar(v) { this.teuFacade.modeloteulistar = v }

  inicializarFormulario() { return this.teuFacade.inicializarFormulario() }
  limpiarFormularioTeu(host?: EditaExpedienteTeuHost) { this.teuFacade.limpiarFormularioTeu(host) }
  cerrarModal(host?: EditaExpedienteTeuHost) { this.teuFacade.cerrarModal(host) }
  crearModeloTeuFichero(host?: EditaExpedienteTeuHost) { this.teuFacade.crearModeloTeuFichero(host) }
  descargarFichero(host?: EditaExpedienteTeuHost) { this.teuFacade.descargarFichero(host) }
  paraTextoLegar(host?: EditaExpedienteTeuHost) { this.teuFacade.paraTextoLegar(host) }
  isFechaSolicInvalid(host?: EditaExpedienteTeuHost) { return this.teuFacade.isFechaSolicInvalid(host) }
  isFechaGenerInvalid(host?: EditaExpedienteTeuHost) { return this.teuFacade.isFechaGenerInvalid(host) }
  isFechaFirmaInvalid(host?: EditaExpedienteTeuHost) { return this.teuFacade.isFechaFirmaInvalid(host) }

  // --- CRUD (delegado a EditaExpedienteNotificacionesCrudFacade) ---
  vernotifi(hostParam: EditaExpedienteNotificacionesCrudHost | undefined, id: number, modoVer = false): Promise<void> {
    return this.crudFacade.vernotifi(hostParam, id, modoVer)
  }
  editaNotifi(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.editaNotifi(hostParam) }
  enviarANotificaPlataforma(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.enviarANotificaPlataforma(hostParam) }
  sincronizarConNotificaPlataforma(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.sincronizarConNotificaPlataforma(hostParam) }
  async enviarNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): Promise<void> { return this.crudFacade.enviarNotificacion(hostParam) }
  refrescarBotonesTrasAccion(host: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.refrescarBotonesTrasAccion(host) }
  borrarNotificacion(hostParam: EditaExpedienteNotificacionesCrudHost | undefined, id: number): void { this.crudFacade.borrarNotificacion(hostParam, id) }
  publicarNotifi(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.publicarNotifi(hostParam) }
  recepcionarNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.recepcionarNotificacion(hostParam) }
  devolverNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.devolverNotificacion(hostParam) }
  anularNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void { this.crudFacade.anularNotificacion(hostParam) }
  crearNotificacionConfirmada(hostParam?: CrearNotificacionConfirmadaHost): void { this.crudFacade.crearNotificacionConfirmada(hostParam) }
  solicitarCreacionNotificacion(hostParam?: SolicitarCrearNotificacionHost): void { this.crudFacade.solicitarCreacionNotificacion(hostParam) }

  private patchActionVisible(id: string, visible: boolean): void {
    this.notificacionActions = this.notificacionActions.map((action) =>
      action.id === id ? { ...action, visible } : action,
    )
  }
}
