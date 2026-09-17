import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../notificaciones/edita-expediente-notificaciones-ui.facade'
import { EditaExpedienteTareasFacade } from '../../tareas/edita-expediente-tareas.facade'
import { EditaExpedienteTramitesFacade } from '../../tramites/edita-expediente-tramites.facade'
import { EditaExpedienteOperacionesFacade } from '../../operaciones/edita-expediente-operaciones.facade'
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service'
import { ModalManagerService } from '../../../../../core/service/modal-manager.service'
import { NotificationService } from '../../../../../core/service/notification.service'
import { ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { fechaHoyISO } from '../../../../../core/helper/fecha-legacy.helper'
import { CrearTablonAnuncio } from '../../../../../core/models/expediente-domain.model'
import { TareaRowActionEvent } from '../edita-expediente-workspace-tareas/edita-expediente-workspace-tareas.component'
import { TramiteRowActionEvent } from '../edita-expediente-workspace-tramites/edita-expediente-workspace-tramites.component'

@Component({
  selector: 'app-edita-expediente-workspace',
  templateUrl: './edita-expediente-workspace.component.html',
})
export class EditaExpedienteWorkspaceComponent {
  readonly edita = inject(EditaExpedienteComponent)
  private readonly notifUiFacade = inject(EditaExpedienteNotificacionesUiFacade)
  private readonly tareasFacade = inject(EditaExpedienteTareasFacade)
  private readonly tramitesFacade = inject(EditaExpedienteTramitesFacade)
  private readonly operacionesFacade = inject(EditaExpedienteOperacionesFacade)
  private readonly refs = inject(EditaExpedienteRefs)
  private readonly modalManager = inject(ModalManagerService)
  private readonly notificationService = inject(NotificationService)

  handleTramiteRowAction(event: TramiteRowActionEvent): void {
    if (event.actionId === 'borrarTramite') {
      this.tramitesFacade.borrarTramite(this.edita, event.tramite.id)
    }
  }

  handleTareaAction(event: ModalActionEvent): void {
    switch (event.id) {
      case 'nuevaTarea':
        this.tareasFacade.abrirModalNuevaTarea(this.edita, this.refs.fileInput)
        return
      case 'borrarTarea':
        this.tareasFacade.borrarTarea(this.edita)
        return
      case 'descargaXml':
        this.edita.descargaXml()
        return
      case 'conviertePDF':
        this.tareasFacade.conviertePDF(this.edita)
        return
      case 'metadatos':
        this.edita.lifecycleFacade.formatearFechaMetadata(this.edita, this.edita.vermetadatos.fecCaptura)
        this.modalManager.openModal('metadatosModal')
        return
      case 'enviarInside':
        this.operacionesFacade.handleEnviarDocumentoTarea(this.edita)
        return
      case 'altaXmlDoc':
        this.operacionesFacade.handleAltaDocumentoEniXml(this.edita)
        return
      case 'docFirmado':
        this.edita.abreArchiFirmado()
        return
      case 'descargarDocumento':
      case 'docOriginal':
        this.edita.abreArchivo()
        return
      case 'firmaAtendida':
        this.modalManager.openModal('archifirmaef')
        return
      case 'firmaDesatendida':
        this.tareasFacade.descargarArchivoFirmado(this.edita)
        return
      case 'propuestaResolucion':
        if (!this.edita.veoPropuestaResolucion) {
          this.notificationService.warning(
            'Esta tarea ya tiene una propuesta de resolución.',
          )
          return
        }
        this.edita.insertabolsacrear.fecAlta = fechaHoyISO()
        this.edita.insertabolsacrear.fecPrefe = fechaHoyISO()
        this.edita.insertabolsacrear.fecMaxResol = fechaHoyISO()
        this.edita.insertabolsacrear.prioridad = ''
        this.edita.insertabolsacrear.tipSesion = null
        this.edita.insertabolsacrear.tipPunto = null
        this.modalManager.openModal('GenerarPropuestaResolucionModal')
        return
      case 'crearNotificacion':
        this.notifUiFacade.clickNuevaNotificacion(this.edita)
        this.modalManager.openModal('CrearNotificacionModal')
        return
      case 'generarSalida':
        this.operacionesFacade.limpiarFormularioGenerarSalida(this.edita)
        this.edita.getTemaDocumentoListar()
        this.modalManager.openModal('GenerarSalidaModal')
        return
      case 'tablonAnuncios':
        this.edita.creartablonanuncio = new CrearTablonAnuncio()
        this.edita.creartablonanuncio.tipAnunc = null
        this.edita.creartablonanuncio.fecDesde = fechaHoyISO()
        this.edita.creartablonanuncio.fecHasta = fechaHoyISO()
        this.modalManager.openModal('crearTablonAnunciosModal')
        return
      case 'finalizarTarea':
        this.edita.finalizartarea()
        return
      default:
        return
    }
  }

  handleTareaRowAction(event: TareaRowActionEvent): void {
    if (!event?.tarea?.id || !event.actionId) {
      return
    }
    this.edita.clicktareaNueva(event.tarea)
    this.handleTareaAction({ id: event.actionId })
  }
}
