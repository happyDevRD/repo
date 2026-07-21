import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { NotificationService } from '../../../core/service/notification.service';
import { TareaTramiteExpedienteCrear } from '../../expedientes';
import { EditaExpedienteArchivoService, ArchivoUploadHost } from './edita-expediente-archivo.service';
import { EditaExpedienteTareasFacade, CrearTareaTramiteHost } from '../tareas/edita-expediente-tareas.facade';
import { cerrarModalesNuevaTarea } from '../tareas/tareas-modal.helper';
import { tieneArchivoPendienteSubida } from '../tareas/tareas-creacion.helper';
import { resetActionState, ResetActionStateHost } from '../tareas/tareas-accion.helper';

export interface EditaExpedienteNuevaTareaHost extends ResetActionStateHost {
  vertareas: boolean;
  verlistadotareas: boolean;
  nuevotramitador: boolean;
  verlistadotramitadores: boolean;
  verEditartareatramite: boolean;
  veoModifiDatosPerso: boolean;
  veoBajaHabitante: boolean;
  veoConsultaObjetoTributario: boolean;
  veoTipoObjetoTributario: boolean;
  verformnuevatarea: boolean;
  veoAcciones: boolean;
  disabledArchivoTareaTramite: boolean;
  introValorConsulta: string;
  introTObjTrubu: TipoObjetoTributarioDto;
  identificadorFicheroSubido: number | undefined;
  base64code: string | undefined;
  name: string;
  archivoSubidaEnProgreso: boolean;
  plantillaDefecto: string | null;
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear;
  FechaSistema(): void;
  cerrarModalNuevaTareaSeguro(): void;
}

@Injectable()
export class EditaExpedienteNuevaTareaFacade {
  constructor(
    private readonly modalManagerService: ModalManagerService,
    private readonly notificationService: NotificationService,
    private readonly archivoService: EditaExpedienteArchivoService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  verNuevaTareaExp(host: EditaExpedienteNuevaTareaHost): void {
    host.cerrarModalNuevaTareaSeguro();
    host.vertareas = false;
    host.verlistadotareas = false;
    host.nuevotramitador = false;
    host.verlistadotramitadores = false;
    host.verEditartareatramite = false;
    resetActionState(host);
    this.borraDatosNuevaTarea(host);
    window.setTimeout(() => this.modalManagerService.reconcileModalDomState(), 200);
  }

  nuevaTareaExp(
    host: EditaExpedienteNuevaTareaHost,
    archivoHost: ArchivoUploadHost,
    tareasHost: CrearTareaTramiteHost,
  ): void {
    if (host.archivoSubidaEnProgreso) {
      this.notificationService.warning('Por favor, espera a que se complete la subida del archivo antes de crear la tarea.');
      return;
    }

    if (tieneArchivoPendienteSubida(host.base64code, host.name, host.identificadorFicheroSubido)) {
      this.notificationService.info('Se está subiendo el archivo. Por favor, espera...');
      this.archivoService.enviarArchivo(archivoHost, () => {
        if (host.identificadorFicheroSubido) {
          this.tareasFacade.crearTarea(tareasHost);
        } else {
          this.notificationService.error('No se pudo crear la tarea porque el archivo no se subió correctamente.');
        }
      });
      return;
    }

    this.tareasFacade.crearTarea(tareasHost);
  }

  cerrarModalNuevaTareaSeguro(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    this.limpiarEstadoModal(host, fileInput);
    try {
      cerrarModalesNuevaTarea();
    } catch {
      this.modalManagerService.closeModal('NuevaTareaTra');
      this.modalManagerService.closeModal('ntareatramiteModal');
    }
  }

  abrirModalNuevaTarea(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    this.limpiarEstadoModal(host, fileInput);
    this.modalManagerService.openModal('NuevaTareaTra');
  }

  borraDatosNuevaTarea(host: EditaExpedienteNuevaTareaHost): void {
    host.tareatramiteexpedientecrear = new TareaTramiteExpedienteCrear();
    host.tareatramiteexpedientecrear.tareaProcedimiento = -1;
    host.tareatramiteexpedientecrear.visible = true;
    host.tareatramiteexpedientecrear.fecInicio = new Date();
    host.tareatramiteexpedientecrear.fecContr = new Date();
    host.tareatramiteexpedientecrear.archivo = null;
    host.tareatramiteexpedientecrear.descripcion = '';
    host.tareatramiteexpedientecrear.firmante = null;
    host.tareatramiteexpedientecrear.propuestaResolucion = null;
    host.tareatramiteexpedientecrear.anexo = null;
    host.tareatramiteexpedientecrear.documAportada = null;
    host.tareatramiteexpedientecrear.tipoDocumEni = null;
    host.tareatramiteexpedientecrear.documentacion = null;

    host.identificadorFicheroSubido = undefined;
    host.base64code = undefined;
    host.name = '';
    host.archivoSubidaEnProgreso = false;
    host.plantillaDefecto = null;
    host.FechaSistema();
    resetActionState(host);

    setTimeout(() => host.cerrarModalNuevaTareaSeguro(), 100);
  }

  limpiarEstadoModal(host: EditaExpedienteNuevaTareaHost, fileInput?: ElementRef): void {
    host.veoModifiDatosPerso = false;
    host.veoBajaHabitante = false;
    host.veoConsultaObjetoTributario = false;
    host.veoTipoObjetoTributario = false;
    host.verformnuevatarea = false;
    host.veoAcciones = false;
    host.introValorConsulta = '';
    host.introTObjTrubu = {} as TipoObjetoTributarioDto;
    host.identificadorFicheroSubido = undefined;
    host.base64code = undefined;
    host.name = '';
    host.archivoSubidaEnProgreso = false;
    host.plantillaDefecto = null;

    if (fileInput?.nativeElement) {
      fileInput.nativeElement.value = '';
    }

    setTimeout(() => {
      const form = document.getElementById('formNuevaTarea') as HTMLFormElement;
      if (!form) {
        return;
      }
      form.classList.remove('was-validated');
      form.querySelectorAll('.form-control, .form-select').forEach((field) => {
        field.classList.remove('is-invalid', 'is-valid');
      });
    }, 100);

    this.cdr.detectChanges();
  }
}
