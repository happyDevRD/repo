import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ModeloTeuCrear } from '../../expedientes';
import { NotificacionesService } from '../../services/notificaciones.service';
import {
  crearModeloTeuInicial,
  validarCamposObligatoriosTeu,
} from './notificaciones-form.validator';
import {
  cerrarModalTeu,
  downloadTeuXml,
  limpiarErroresFormularioTeu,
} from './notificaciones-modal.helper';

export interface EditaExpedienteTeuHost {
  modeloteucrear: ModeloTeuCrear;
  idNotificacion: number;
  TextoLegal: string;
  IDModel: number;
  mostrarValidacionesTEU: boolean;
  teuFormRef: any;
  usuContrl: string | null;
  descargoTEU: boolean;
  verxml: boolean;
  xmlTeu: any;
  xmlDescargado: any;
  mostrarBotonDescargaTEU: boolean;
  mostrarBotonDescargaTEUPrincipal: boolean;
  cdr: ChangeDetectorRef;
  paraTextoLegar(): void;
  descargaXml(): void;
  actualizarSourceNotificaciones(): void;
  refresSourceListarNotifi(): void;
}

@Injectable()
export class EditaExpedienteTeuFacade {
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private readonly notificacionesService: NotificacionesService,
    private readonly http: HttpClient,
  ) {}

  inicializarFormulario(): ModeloTeuCrear {
    return crearModeloTeuInicial();
  }

  limpiarFormulario(host: EditaExpedienteTeuHost): void {
    host.modeloteucrear = crearModeloTeuInicial();
    host.mostrarBotonDescargaTEU = false;
    host.mostrarBotonDescargaTEUPrincipal = false;
    host.mostrarValidacionesTEU = false;

    if (host.teuFormRef) {
      host.teuFormRef.submitted = false;
    }
    limpiarErroresFormularioTeu();
  }

  cerrarModal(host: EditaExpedienteTeuHost): void {
    cerrarModalTeu(
      () => this.limpiarFormulario(host),
      () => host.cdr.detectChanges(),
    );
  }

  crearModeloTeuFichero(host: EditaExpedienteTeuHost): void {
    host.mostrarValidacionesTEU = true;
    if (host.teuFormRef) {
      host.teuFormRef.submitted = true;
    }

    if (!validarCamposObligatoriosTeu(host.modeloteucrear)) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos obligatorios marcados con *',
      });
      return;
    }

    host.IDModel = host.modeloteucrear.idModel;
    host.paraTextoLegar();

    this.notificacionesService
      .crearModeloTeuFichero(host.modeloteucrear, host.idNotificacion, host.TextoLegal)
      .subscribe({
        next: () => this.procesarRespuestaExitosa(host),
        error: (error: HttpErrorResponse) => this.procesarErrorTeu(host, error),
      });
  }

  descargarFichero(host: EditaExpedienteTeuHost): void {
    if (host.xmlDescargado) {
      downloadTeuXml(host.xmlDescargado);
      Swal.fire({
        icon: 'success',
        title: 'Descarga completada',
        text: 'El fichero TEU se ha descargado correctamente.',
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Regenerando fichero TEU',
      text: 'Se está regenerando el fichero TEU, por favor espere...',
    });

    this.regenerarModelo(host);
  }

  private regenerarModelo(host: EditaExpedienteTeuHost): void {
    const datosTEU = {
      idNotif: host.idNotificacion,
      datoperso: true,
      incltex: true,
      leygene: true,
    };

    this.http.post(`${environment.apiUrl}modeloteu/crear`, datosTEU, { headers: this.httpHeaders }).subscribe({
      next: (response: any) => {
        if (response?.xml) {
          host.xmlDescargado = response.xml;
          downloadTeuXml(host.xmlDescargado);
          Swal.fire({
            icon: 'success',
            title: 'Descarga completada',
            text: 'El fichero TEU se ha regenerado y descargado correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo regenerar el fichero TEU.',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo regenerar el fichero TEU. Inténtelo de nuevo.',
        });
      },
    });
  }

  private buildDatosActualizacion(host: EditaExpedienteTeuHost) {
    const fechaActual = new Date().toISOString().split('T')[0];
    return {
      idNotif: host.idNotificacion,
      fecEnvio: new Date(fechaActual),
      usuContr: host.usuContrl || '',
      email: host.modeloteucrear.email,
      url: host.modeloteucrear.url,
      indMater: host.modeloteucrear.idMater,
      fecGener: host.modeloteucrear.fecGener,
      fecSolic: host.modeloteucrear.fecSolic,
      fecFirma: host.modeloteucrear.fecFirma,
      forPubli: host.modeloteucrear.forPubli,
      procedimiento: host.modeloteucrear.procedimiento,
      idModel: host.modeloteucrear.idModel,
      incLgt: host.modeloteucrear.incLgt,
      texPlura: host.modeloteucrear.texPlura,
      datPerso: host.modeloteucrear.datPerso,
      edicionManual: true,
    };
  }

  private aplicarExitoGeneracion(host: EditaExpedienteTeuHost): void {
    host.descargoTEU = true;
    host.verxml = true;
    host.descargaXml();
    host.mostrarBotonDescargaTEU = true;
    host.mostrarBotonDescargaTEUPrincipal = true;
    this.cerrarModal(host);

    setTimeout(() => {
      host.refresSourceListarNotifi();
      host.cdr.detectChanges();
    }, 300);

    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Se ha generado el Modelo T.E.U. correctamente.',
      });
    }, 500);
  }

  private procesarRespuestaExitosa(host: EditaExpedienteTeuHost): void {
    const datosActualizacion = this.buildDatosActualizacion(host);

    this.notificacionesService
      .editarNotificacion(datosActualizacion as any, host.idNotificacion)
      .subscribe({
        next: () => {
          host.actualizarSourceNotificaciones();
          this.aplicarExitoGeneracion(host);
        },
        error: () => {
          host.actualizarSourceNotificaciones();
          this.aplicarExitoGeneracion(host);
        },
      });
  }

  private procesarErrorTeu(host: EditaExpedienteTeuHost, error: HttpErrorResponse): void {
    if (error.status === 200) {
      host.xmlTeu = error.error?.text || error.error;
      host.xmlDescargado = error.error?.text || error.error;
      this.procesarRespuestaExitosa(host);
      return;
    }

    host.verxml = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se ha generado el Modelo T.E.U.',
    });
  }
}
