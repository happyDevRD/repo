import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import {
  CrearMensaje,
  RegistroDocumento,
  TareaTramiteExpporExpedi,
  VerExpediente,
} from '../../expedientes'
import { TareaProcedimientoDTO } from '../../../../core/models/tarea-procedimiento.dto'
import { ProcediPermisosListar } from '../../../procedimientos/procedimiento'
import { ExpedientesService } from '../../expedientes.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import {
  AtributoEditable,
  ExpedientesAtributosFacade,
  ExpedientesAtributosHost,
  esTipoFecha,
  esTipoNumerico,
} from '../../services/expedientes-atributos.facade'
import { mostrarRegistroDocumento } from '../../../../core/helper/registro-documento-notification.helper'

const MODAL_ASIGNAR = 'EditaAsignarTramitadorModal'
const MODAL_TAREAS = 'EditaTareaExpedienteModal'

export interface EditaExpedienteContextoHost extends ExpedientesAtributosHost {
  verExpediente: VerExpediente
  tituloExp: string
  registrodocumento: RegistroDocumento
  VeoRegDoc: boolean
  crearmensaje: CrearMensaje
  tareasAsignarTramitador: TareaProcedimientoDTO[]
  permisosAsignarTramitador: ProcediPermisosListar[]
  tareaSeleccionadaAsignar: TareaProcedimientoDTO | null
  personaSeleccionadaAsignar: ProcediPermisosListar | null
  cargandoTareasAsignar: boolean
  cargandoPermisosAsignar: boolean
  errorTareasAsignar: boolean
  errorPermisosAsignar: boolean
  usuarioTarea: string | undefined
  usuarioPermiso: string | number | undefined
  isAsignandoTramitador: boolean
  mostrarValidacionesAsignarTramitador: boolean
  tareasExpedienteList: TareaTramiteExpporExpedi[]
  cargandoTareasExpediente: boolean
  tareasExpedienteVacio: boolean
  numeroArchivoTareasExp: number | undefined
}

@Injectable()
export class EditaExpedienteContextoFacade {
  private readonly destroyRef = inject(DestroyRef)
  private readonly expedientesService = inject(ExpedientesService)
  private readonly notificationService = inject(NotificationService)
  private readonly modalManagerService = inject(ModalManagerService)
  private readonly atributosFacade = inject(ExpedientesAtributosFacade)

  readonly esTipoFecha = esTipoFecha
  readonly esTipoNumerico = esTipoNumerico

  sincronizarHostIds(host: EditaExpedienteContextoHost): void {
    const id = host.verExpediente?.id ?? host.idExpediente
    host.idExpediente = id
    host.idexpediente = typeof id === 'number' ? id : Number(id)
    host.tituloExp = String(host.verExpediente?.titulo ?? '')
  }

  cargarRegistroSiAplica(host: EditaExpedienteContextoHost): void {
    const idHisDocum = host.verExpediente?.idHisDocum
    if (!idHisDocum) {
      host.VeoRegDoc = false
      host.registrodocumento = new RegistroDocumento()
      return
    }

    this.expedientesService.getRegistroDocVer(idHisDocum).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (registro) => {
        host.registrodocumento = registro
        host.VeoRegDoc = true
      },
      error: () => {
        host.VeoRegDoc = false
      },
    })
  }

  abrirAtributos(host: EditaExpedienteContextoHost): void {
    this.sincronizarHostIds(host)
    this.atributosFacade.abrirModal(host)
  }

  envioAtributos(host: EditaExpedienteContextoHost): void {
    this.atributosFacade.guardar(host)
  }

  borraAtributo(host: EditaExpedienteContextoHost, attr: AtributoEditable): void {
    this.atributosFacade.eliminar(host, attr)
  }

  actualizarFechaAtributo(attr: AtributoEditable, isoValue: string): void {
    this.atributosFacade.actualizarFecha(attr, isoValue)
  }

  cerrarModalAtributos(host: EditaExpedienteContextoHost): void {
    this.atributosFacade.cerrarModal(host)
    this.modalManagerService.closeModal('NAtributosModal2')
  }

  mostrarRegistro(host: EditaExpedienteContextoHost): void {
    if (!host.VeoRegDoc) {
      this.notificationService.warning('Este expediente no tiene registro de entrada asociado')
      return
    }
    void mostrarRegistroDocumento(host.registrodocumento, this.notificationService)
  }

  abrirAsignarTramitador(host: EditaExpedienteContextoHost): void {
    this.limpiarAsignarTramitador(host)
    this.cargarTareasProcedimiento(host)
    this.modalManagerService.openModal(MODAL_ASIGNAR)
  }

  private cargarTareasProcedimiento(host: EditaExpedienteContextoHost): void {
    const idProc = host.verExpediente?.idProc
    if (!idProc) {
      host.errorTareasAsignar = true
      return
    }

    host.cargandoTareasAsignar = true
    host.errorTareasAsignar = false
    this.expedientesService.getTareasProcedimientoListar(idProc).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareas) => {
        host.tareasAsignarTramitador = tareas ?? []
        host.cargandoTareasAsignar = false
      },
      error: () => {
        host.tareasAsignarTramitador = []
        host.errorTareasAsignar = true
        host.cargandoTareasAsignar = false
      },
    })
  }

  seleccionarTareaAsignar(host: EditaExpedienteContextoHost, tarea: TareaProcedimientoDTO | null): void {
    if (!tarea || host.tareaSeleccionadaAsignar?.id === tarea.id) {
      return
    }
    host.tareaSeleccionadaAsignar = tarea
    host.personaSeleccionadaAsignar = null
    host.usuarioPermiso = undefined
    host.usuarioTarea = undefined
    host.permisosAsignarTramitador = []
    host.errorPermisosAsignar = false
    host.cargandoPermisosAsignar = true

    this.expedientesService.getPermisosTareaListar(tarea.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (permisos) => {
        host.permisosAsignarTramitador = permisos ?? []
        host.cargandoPermisosAsignar = false
      },
      error: () => {
        host.permisosAsignarTramitador = []
        host.errorPermisosAsignar = true
        host.cargandoPermisosAsignar = false
      },
    })
  }

  seleccionarPersonaAsignar(host: EditaExpedienteContextoHost, persona: ProcediPermisosListar | null): void {
    if (!persona) {
      return
    }
    host.personaSeleccionadaAsignar = persona
    host.usuarioPermiso = persona.idOrgUsuar
    host.usuarioTarea = persona.usuario
  }

  isTareaAsignarInvalid(host: EditaExpedienteContextoHost): boolean {
    return host.mostrarValidacionesAsignarTramitador && !host.tareaSeleccionadaAsignar
  }

  isPersonaAsignarInvalid(host: EditaExpedienteContextoHost): boolean {
    return host.mostrarValidacionesAsignarTramitador
      && !!host.tareaSeleccionadaAsignar
      && !host.personaSeleccionadaAsignar
  }

  isDescripcionMensajeInvalid(host: EditaExpedienteContextoHost): boolean {
    return host.mostrarValidacionesAsignarTramitador
      && (!host.crearmensaje.descripcion || host.crearmensaje.descripcion.trim() === '')
  }

  onAsignarTramitadorSubmit(host: EditaExpedienteContextoHost): void {
    host.mostrarValidacionesAsignarTramitador = true
    if (
      this.isTareaAsignarInvalid(host)
      || this.isPersonaAsignarInvalid(host)
      || this.isDescripcionMensajeInvalid(host)
    ) {
      this.notificationService.incompleteFields()
      return
    }

    host.crearmensaje.idtarea = host.tareaSeleccionadaAsignar?.id
    void this.notificationService.confirm(
      `¿Confirma ofrecer este expediente a ${host.usuarioTarea} para la tarea "${host.tareaSeleccionadaAsignar?.descripcion}"?`,
    ).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignarTramitador(host)
      }
    })
  }

  private ejecutarAsignarTramitador(host: EditaExpedienteContextoHost): void {
    this.sincronizarHostIds(host)
    host.isAsignandoTramitador = true
    host.crearmensaje.idExpediente = host.idexpediente
    host.crearmensaje.destinatario = String(host.usuarioPermiso ?? '')
    host.crearmensaje.fecEnvio = new Date()

    this.expedientesService.crearMensaje(host.crearmensaje).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success('El tramitador fue asignado')
        this.limpiarAsignarTramitador(host)
        this.modalManagerService.closeModal(MODAL_ASIGNAR)
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err.error?.message ?? 'No se pudo asignar el tramitador')
        host.isAsignandoTramitador = false
      },
    })
  }

  limpiarAsignarTramitador(host: EditaExpedienteContextoHost): void {
    host.isAsignandoTramitador = false
    host.mostrarValidacionesAsignarTramitador = false
    host.tareasAsignarTramitador = []
    host.permisosAsignarTramitador = []
    host.tareaSeleccionadaAsignar = null
    host.personaSeleccionadaAsignar = null
    host.usuarioPermiso = undefined
    host.usuarioTarea = undefined
    host.cargandoTareasAsignar = false
    host.cargandoPermisosAsignar = false
    host.errorTareasAsignar = false
    host.errorPermisosAsignar = false
    host.crearmensaje = new CrearMensaje()
  }

  cerrarAsignarTramitador(host: EditaExpedienteContextoHost): void {
    this.limpiarAsignarTramitador(host)
    this.modalManagerService.closeModal(MODAL_ASIGNAR)
  }

  abrirTareasExpediente(host: EditaExpedienteContextoHost): void {
    this.sincronizarHostIds(host)
    const idExp = host.idExpediente
    if (!idExp) {
      this.notificationService.warning('No hay expediente cargado')
      return
    }

    host.cargandoTareasExpediente = true
    host.tareasExpedienteVacio = false
    host.tareasExpedienteList = []
    host.numeroArchivoTareasExp = undefined
    this.modalManagerService.openModal(MODAL_TAREAS)

    this.expedientesService.getTareaTramiteExpeporExpe(idExp).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (tareas) => {
        host.tareasExpedienteList = tareas ?? []
        host.tareasExpedienteVacio = host.tareasExpedienteList.length === 0
        host.cargandoTareasExpediente = false
      },
      error: () => {
        host.tareasExpedienteList = []
        host.tareasExpedienteVacio = true
        host.cargandoTareasExpediente = false
      },
    })
  }

  clickTareaExpediente(host: EditaExpedienteContextoHost, tarea: TareaTramiteExpporExpedi): void {
    host.numeroArchivoTareasExp = tarea.archivo != null ? Number(tarea.archivo) : undefined
  }

  abreArchivoTareaExpediente(host: EditaExpedienteContextoHost): void {
    if (!host.numeroArchivoTareasExp) {
      this.notificationService.warning('Esta tarea no tiene ningún documento asociado')
      return
    }
    window.open(`${environment.apiUrl}archivo/descargaTarea/${host.numeroArchivoTareasExp}`, '_blank')
  }

  cerrarTareasExpediente(host: EditaExpedienteContextoHost): void {
    host.tareasExpedienteList = []
    host.cargandoTareasExpediente = false
    host.tareasExpedienteVacio = false
    host.numeroArchivoTareasExp = undefined
    this.modalManagerService.closeModal(MODAL_TAREAS)
  }
}
