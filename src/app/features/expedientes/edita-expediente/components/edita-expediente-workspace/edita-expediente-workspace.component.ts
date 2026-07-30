import { Component, inject } from '@angular/core'
import { EditaExpedienteComponent } from '../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../notificaciones/edita-expediente-notificaciones-ui.facade'
import { EditaExpedienteTareasFacade } from '../../tareas/edita-expediente-tareas.facade'
import { EditaExpedienteTramitesFacade } from '../../tramites/edita-expediente-tramites.facade'
import { EditaExpedienteOperacionesFacade } from '../../operaciones/edita-expediente-operaciones.facade'
import { EditaExpedienteRefs } from '../../services/edita-expediente-refs.service'
import { ModalManagerService } from '../../../../../core/service/modal-manager.service'
import { ModalActionEvent } from '../../../../../shared/modals/modal-action.model'
import { fechaHoyISO } from '../../../../../core/helper/fecha-legacy.helper'
import { CrearTablonAnuncio } from '../../../../../core/models/expediente-domain.model'
import { CrearInteresado } from '../../../expedientes'
import { TareaRowActionEvent } from '../edita-expediente-workspace-tareas/edita-expediente-workspace-tareas.component'

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

  handleTramiteAction(event: ModalActionEvent): void {
    switch (event.id) {
      case 'nuevoTramite':
        this.tramitesFacade.abrirModalNuevoTramite(this.edita)
        return
      case 'borrarTramite':
        this.tramitesFacade.borrarTramite(this.edita)
        return
      default:
        return
    }
  }

  handleNotificacionAction(event: ModalActionEvent): void {
    const id = this.notifUiFacade.idNotificacion
    switch (event.id) {
      case 'teu':
      case 'reenviarTeu':
        this.notifUiFacade.abrirModalEnvioTeu()
        return
      case 'enviarNotifica':
        this.notifUiFacade.enviarANotificaPlataforma()
        return
      case 'sincronizar':
        this.notifUiFacade.sincronizarConNotificaPlataforma()
        return
      case 'enviar':
        this.notifUiFacade.creanotificacion.fecEnvio = fechaHoyISO()
        this.modalManager.openModal('EnvioNotifi')
        return
      case 'recepcionar':
        this.notifUiFacade.creanotificacion.fecRecNotif = fechaHoyISO()
        this.modalManager.openModal('RecepNotifi')
        return
      case 'devolver':
        this.notifUiFacade.creanotificacion.fecRecNotif = fechaHoyISO()
        this.modalManager.openModal('DevolverNotifi')
        return
      case 'publicar':
        this.notifUiFacade.creanotificacion.fecPubBop = fechaHoyISO()
        this.modalManager.openModal('PubliNotifModal')
        return
      case 'anular':
        this.notifUiFacade.anularNotificacion()
        return
      case 'ver':
        if (id != null) {
          this.notifUiFacade.verNotificacion(undefined, id)
        }
        return
      case 'borrar':
        if (id != null) {
          this.notifUiFacade.borrarNotificacion(undefined, id)
        }
        return
      case 'descargaTeu':
        this.notifUiFacade.descargarFichero()
        return
      default:
        return
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
        this.edita.insertabolsacrear.fecAlta = fechaHoyISO()
        this.edita.insertabolsacrear.fecPrefe = fechaHoyISO()
        this.edita.insertabolsacrear.fecMaxResol = fechaHoyISO()
        this.edita.insertabolsacrear.prioridad = ''
        this.edita.insertabolsacrear.tipSesion = null as unknown as number
        this.edita.insertabolsacrear.tipPunto = null as unknown as number
        this.modalManager.openModal('GenerarPropuestaResolucionModal')
        return
      case 'crearNotificacion':
        this.notifUiFacade.clickNuevaNotificacion(this.edita)
        this.modalManager.openModal('CrearNotificacionModal')
        return
      case 'generarSalida':
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

  handleNuevoInteresado(): void {
    this.edita.crearinteresado = new CrearInteresado()
    this.edita.crearinteresado.fechaInicio = fechaHoyISO()
    this.edita.crearinteresado.tipForNotif = null as unknown as number
    this.edita.crearinteresado.email = ''
    this.edita.lifecycleFacade.dniok = false
    this.modalManager.openModal('ninteresadoModal')
  }
}
