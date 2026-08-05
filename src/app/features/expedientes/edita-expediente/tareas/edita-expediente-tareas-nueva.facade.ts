import { ChangeDetectorRef, ElementRef, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { TareaTramiteExpedienteCrear } from '../../expedientes'
import { TipoObjetoTributarioDto } from '../../../../core/models/tipo-objeto-tributario.dto'
import { NotificationService } from '../../../../core/service/notification.service'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { EditaExpedienteArchivoService, ArchivoUploadHost } from '../services/edita-expediente-archivo.service'
import { ListaTareaProcedi } from '../edita-expediente.models'
import { tieneArchivoPendienteSubida } from './tareas-creacion.helper'
import { resetActionState } from './tareas-accion.helper'
import { cerrarModalesNuevaTarea } from './tareas-modal.helper'
import { TareasAccionUiState } from './tareas-accion.models'
import {
  limpiarErroresNuevaTareaForm,
  validarCampoFormularioTarea,
  validarFormularioNuevaTarea,
  validarTareaProcedimientoCampo,
} from './tareas-form-validation.helper'
import { fechaHoyISO } from '../../../../core/helper/fecha-legacy.helper'

export interface EditaExpedienteNuevaTareaHost {
  tareasFacade: TareasAccionUiState
  cdr: ChangeDetectorRef
  vertareas: boolean
  verlistadotareas: boolean
  nuevotramitador: boolean
  verlistadotramitadores: boolean
  verEditartareatramite: boolean
  verformnuevatarea: boolean
  disabledArchivoTareaTramite: boolean
  identificadorFicheroSubido: number | undefined
  base64code: string | undefined
  name: string
  archivoSubidaEnProgreso: boolean
  plantillaDefecto: string | null
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear
  listatareaprocedi: ListaTareaProcedi[]
  idTramite: number
  fasetramite: string
  getListaTareas(): Observable<ListaTareaProcedi[]>
  FechaSistema(): void
  cerrarModalNuevaTareaSeguro(): void
}

/** Host de panel/listado (antes PanelHost). */
export interface EditaExpedientePanelHost {
  tareasFacade: TareasAccionUiState
  verformnuevatarea: boolean
  verTareasdelTramite: boolean
  verlistadotramitadores: boolean
  nuevotramitador: boolean
  verlistadotareas: boolean
  verEditartareatramite: boolean
  vertareas: boolean
  disabledArchivoTareaTramite: boolean
}

/** Host minimo para crearTarea (evita import circular con el coordinator). */
export interface NuevaTareaCrearHost {
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear
  plantillaDefecto: string | null
  identificadorFicheroSubido?: number
  usuContrl: string | null
  base64code?: string
  name?: string
  tareasFacade: { veoAcciones: boolean }
  disabledArchivoTareaTramite: boolean
  idTarea: number
  idTramite: number
  sourceTareasTramite: unknown
  borraDatosNuevaTarea(): void
  onTareaCreada?(): void
}

@Injectable()
export class EditaExpedienteTareasNuevaFacade {
  private readonly notificationService = inject(NotificationService)
  private readonly modalManagerService = inject(ModalManagerService)
  private readonly archivoService = inject(EditaExpedienteArchivoService)
  private readonly changeDetector = inject(ChangeDetectorRef)

  private crearTareaFn: (host: NuevaTareaCrearHost) => void = () => undefined

  bind(deps: { crearTarea: (host: NuevaTareaCrearHost) => void }): void {
    this.crearTareaFn = deps.crearTarea
  }

  // --- Nueva tarea / panel (antes NuevaTareaFacade) ---

  verListadoTareasModal(host: EditaExpedientePanelHost & EditaExpedienteNuevaTareaHost): void {
    const ui = host.tareasFacade
    ui.veoModifiDatosPerso = false
    ui.veoAcciones = false
    host.verformnuevatarea = true
    host.verTareasdelTramite = true
    host.verformnuevatarea = false
    host.verlistadotramitadores = false
    host.nuevotramitador = false
    host.verlistadotareas = true
    host.verEditartareatramite = false
    this.borraDatosNuevaTarea(host)
    ui.introValorConsulta = ''
  }

  onTareaCreada(host: EditaExpedientePanelHost, fileInput?: ElementRef): void {
    const ui = host.tareasFacade
    ui.veoModifiDatosPerso = false
    ui.introValorConsulta = ''
    host.disabledArchivoTareaTramite = false
    ui.veoTipoObjetoTributario = false
    host.verformnuevatarea = false
    ui.veoBajaHabitante = false
    host.vertareas = true
    ui.veoAcciones = false

    if (fileInput?.nativeElement) {
      fileInput.nativeElement.value = ''
    }
  }

  // --- Nueva tarea ---

  verNuevaTareaExp(host: EditaExpedienteNuevaTareaHost): void {
    host.cerrarModalNuevaTareaSeguro()
    host.vertareas = false
    host.verlistadotareas = false
    host.nuevotramitador = false
    host.verlistadotramitadores = false
    host.verEditartareatramite = false
    resetActionState(host.tareasFacade, host.cdr)
    this.borraDatosNuevaTarea(host)
    window.setTimeout(() => this.modalManagerService.reconcileModalDomState(), 200)
  }

  nuevaTareaExp(
    host: EditaExpedienteNuevaTareaHost,
    archivoHost: ArchivoUploadHost,
    tareasHost: NuevaTareaCrearHost,
  ): void {
    if (host.archivoSubidaEnProgreso) {
      this.notificationService.warning('Por favor, espera a que se complete la subida del archivo antes de crear la tarea.')
      return
    }

    if (tieneArchivoPendienteSubida(host.base64code, host.name, host.identificadorFicheroSubido)) {
      this.notificationService.info('Se está subiendo el archivo. Por favor, espera...')
      this.archivoService.enviarArchivo(archivoHost, () => {
        if (host.identificadorFicheroSubido) {
          this.crearTareaFn(tareasHost)
        } else {
          // Subida fallida: crear la tarea sin documento (el estado pendiente ya se limpia en el servicio).
          this.notificationService.warning(
            'No se pudo asociar el archivo. Se creará la tarea sin documento.',
          )
          this.crearTareaFn(tareasHost)
        }
      })
      return
    }

    this.crearTareaFn(tareasHost)
  }

  validateAndCreateTarea(
    host: EditaExpedienteNuevaTareaHost,
    archivoHost: ArchivoUploadHost,
    tareasHost: NuevaTareaCrearHost,
    event: Event,
  ): void {
    if (!validarFormularioNuevaTarea(event)) {
      this.notificationService.incompleteFields()
      event.preventDefault()
      return
    }
    this.nuevaTareaExp(host, archivoHost, tareasHost)
  }

  limpiarErroresNuevaTarea(): void {
    limpiarErroresNuevaTareaForm()
  }

  validarTareaProcedimiento(event: Event): void {
    validarTareaProcedimientoCampo(event)
  }

  validarCampo(event: Event, campoId: string): void {
    validarCampoFormularioTarea(event, campoId)
  }

  cerrarModalNuevaTareaSeguro(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    this.limpiarEstadoModal(host, fileInput)
    try {
      cerrarModalesNuevaTarea()
    } catch {
      this.modalManagerService.closeModal('NuevaTareaTra')
      this.modalManagerService.closeModal('ntareatramiteModal')
    }
  }

  abrirModalNuevaTarea(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    if (!host.idTramite) {
      this.notificationService.warning('Selecciona un trámite antes de crear una nueva tarea.')
      return
    }
    if (!host.fasetramite) {
      this.notificationService.warning('El trámite seleccionado no tiene fase. No se pueden cargar las tareas del procedimiento.')
      return
    }

    this.resetFormularioNuevaTarea(host)
    this.limpiarEstadoModal(host, fileInput)
    this.limpiarErroresNuevaTarea()

    // Recarga siempre al abrir: la lista depende del procedimiento + fase del trámite
    // y puede haberse quedado vacía/desfasada tras navegar o crear trámites.
    host.getListaTareas().subscribe({
      next: (lista) => {
        host.listatareaprocedi = lista ?? []
        host.cdr.markForCheck()
        this.modalManagerService.openModal('NuevaTareaTra')
        if (!host.listatareaprocedi.length) {
          this.notificationService.warning(
            'No hay tareas de procedimiento manuales para esta fase. Configúralas en el procedimiento (Procedimientos → Tareas).',
          )
        }
      },
      error: () => {
        host.listatareaprocedi = []
        host.cdr.markForCheck()
        this.modalManagerService.openModal('NuevaTareaTra')
        this.notificationService.error('No se pudieron cargar las tareas del procedimiento.')
      },
    })
  }

  /** Resetea el modelo del formulario sin cerrar el modal. */
  resetFormularioNuevaTarea(host: EditaExpedienteNuevaTareaHost): void {
    host.tareatramiteexpedientecrear = new TareaTramiteExpedienteCrear()
    host.tareatramiteexpedientecrear.tareaProcedimiento = -1
    host.tareatramiteexpedientecrear.visible = true
    host.tareatramiteexpedientecrear.fecInicio = fechaHoyISO()
    host.tareatramiteexpedientecrear.fecContr = fechaHoyISO()
    host.tareatramiteexpedientecrear.archivo = undefined
    host.tareatramiteexpedientecrear.descripcion = ''
    host.tareatramiteexpedientecrear.firmante = null
    host.tareatramiteexpedientecrear.propuestaResolucion = null
    host.tareatramiteexpedientecrear.anexo = null
    host.tareatramiteexpedientecrear.documAportada = null
    host.tareatramiteexpedientecrear.tipoDocumEni = null
    host.tareatramiteexpedientecrear.documentacion = null

    host.identificadorFicheroSubido = undefined
    host.base64code = undefined
    host.name = ''
    host.archivoSubidaEnProgreso = false
    host.plantillaDefecto = null
    host.FechaSistema()
    resetActionState(host.tareasFacade, host.cdr)
  }

  borraDatosNuevaTarea(host: EditaExpedienteNuevaTareaHost): void {
    this.resetFormularioNuevaTarea(host)
    setTimeout(() => host.cerrarModalNuevaTareaSeguro(), 100)
  }

  limpiarEstadoModal(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    const ui = host.tareasFacade
    ui.veoModifiDatosPerso = false
    ui.veoBajaHabitante = false
    ui.veoConsultaObjetoTributario = false
    ui.veoTipoObjetoTributario = false
    host.verformnuevatarea = false
    ui.veoAcciones = false
    ui.introValorConsulta = ''
    ui.introTObjTrubu = {} as TipoObjetoTributarioDto
    host.identificadorFicheroSubido = undefined
    host.base64code = undefined
    host.name = ''
    host.archivoSubidaEnProgreso = false
    host.plantillaDefecto = null

    if (fileInput?.nativeElement) {
      try {
        fileInput.nativeElement.value = ''
      } catch {
        // input type=file solo admite vacío; ignorar si el DOM no lo permite
      }
    }

    setTimeout(() => {
      const form = document.getElementById('formNuevaTarea') as HTMLFormElement
      if (!form) {
        return
      }
      form.classList.remove('was-validated')
      form.querySelectorAll('.form-control, .form-select').forEach((field) => {
        field.classList.remove('is-invalid', 'is-valid')
      })
    }, 50)

    this.changeDetector.markForCheck()
  }




}
