import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearNotificacion } from '../../expedientes';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import { NotificationService } from '../../../core/service/notification.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { EditaExpedienteTareasFacade } from '../tareas/edita-expediente-tareas.facade';
import {
  aplicarNotificacionVer,
  normalizarCreacionNotificacion,
  prepararDatosNotificacionParaEnvio,
} from './notificaciones-data.helper';

export interface EditaExpedienteNotificacionesCrudHost {
  creanotificacion: CrearNotificacion;
  notificacionver: any;
  modoVerNotificacion: boolean;
  idNotificacion: number;
  ejerNotifi: string;
  numeroNotifi: string;
  fechNotifi: any;
  dniNotifi: string;
  desPerEntidNotifi: string;
  usuContrl: string | null;
  fecLimite: Date;
  fechasNotifi(fenvio: any, frecep: any, fpubli: any, femision: any): void;
  solicitadni(dni: string): void;
  cerrarModalNotificacion(): void;
  refresSourceListarNotifi(): void;
  quitabotonesNotifi(): void;
  listadodeNotificaciones(): void;
  borrarDatosPublicacion(): void;
  habilitarBotonesNotificacion?(rowData: any): void;
  sourceListarNotifi?: { records?: any[] };
}

export interface CrearNotificacionConfirmadaHost extends EditaExpedienteNotificacionesCrudHost {
  idTarea: number;
  idTramite: number;
  sourceTareasTramite: unknown;
  resetvariables(): void;
  limpiarFormularioNotificacion(): void;
  cerrarModalCrearNotificacion(): void;
  limpiarEstadoModalError(): void;
}

export interface SolicitarCrearNotificacionHost extends CrearNotificacionConfirmadaHost {
  listarinteresadosdto: InteresadoListarDto[];
  verExpediente: { ejercicio: number; numero: number };
  identificadorFicheroSubido?: number;
  fecha: Date;
  validarFormularioNotificacion(): boolean;
}

@Injectable()
export class EditaExpedienteNotificacionesCrudFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificacionesService: NotificacionesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
  ) {}

  vernotifi(host: EditaExpedienteNotificacionesCrudHost, id: number, modoVer = false): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionesService.getNotificacionVer(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (response: any) => {
          const notificacionver = Array.isArray(response) ? response[0] : response;
          if (!notificacionver) {
            this.notificationService.error({
              text: 'No se pudieron cargar los datos de la notificación.',
            });
            reject(new Error('Sin datos'));
            return;
          }
          aplicarNotificacionVer(host, notificacionver, modoVer, id);
          host.fechasNotifi(
            notificacionver?.fecEnvio,
            notificacionver?.fecRecNotif,
            notificacionver?.fecPubBop,
            notificacionver?.fecRegistSalid,
          );
          if (notificacionver?.personaEntidad?.numDocum) {
            host.solicitadni(notificacionver.personaEntidad.numDocum);
          }
          resolve();
        },
        error: (error) => {
          this.notificationService.error({
            text: 'No se pudo cargar la notificación. Por favor, inténtelo de nuevo.',
          });
          reject(error);
        },
      });
    });
  }

  editaNotifi(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.creanotificacion || !host.idNotificacion) {
      this.notificationService.error({
        text: 'No se puede editar la notificación. Faltan datos necesarios.',
      });
      return;
    }

    const datosParaEnviar = prepararDatosNotificacionParaEnvio(host.creanotificacion);
    this.notificationService.custom({
      title: 'Guardando cambios...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });

    this.notificacionesService.editarNotificacion(datosParaEnviar as any, host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.cerrarModalNotificacion();
        host.refresSourceListarNotifi();
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${host.ejerNotifi}/${host.numeroNotifi} ha sido actualizada correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.notificationService.error({
          title: 'Error al guardar',
          text: 'No se pudo actualizar la notificación. Por favor, inténtelo de nuevo.',
        });
      },
    });
  }

  enviarANotificaPlataforma(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }
    this.notificationService.custom({
      title: 'Enviando a Notifica...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });
    this.notificacionesService.enviarANotifica(host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.notificationService.close();
        host.refresSourceListarNotifi();
        this.notificationService.success(response?.mensaje || 'Notificación enviada a Notifica.');
        host.listadodeNotificaciones();
      },
      error: (error) => {
        this.notificationService.close();
        this.notificationService.error(
          error?.error?.message || 'No se pudo enviar la notificación a Notifica.',
        );
      },
    });
  }

  sincronizarConNotificaPlataforma(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }
    this.notificationService.custom({
      title: 'Sincronizando con Notifica...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });
    this.notificacionesService.sincronizarNotifica(host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.notificationService.close();
        host.refresSourceListarNotifi();
        this.notificationService.success(response?.mensaje || 'Sincronización completada.');
        host.listadodeNotificaciones();
      },
      error: (error) => {
        this.notificationService.close();
        this.notificationService.error(
          error?.error?.message || 'No se pudo sincronizar con Notifica.',
        );
      },
    });
  }

  async enviarNotificacion(host: EditaExpedienteNotificacionesCrudHost): Promise<void> {
    if (!host.notificacionver?.fecNotif) {
      try {
        await this.vernotifi(host, host.idNotificacion, false);
      } catch {
        this.notificationService.error({
          text: 'No se pudieron cargar los datos de la notificación.',
        });
        return;
      }
    }

    if (!host.notificacionver?.fecNotif) {
      this.notificationService.warning({
        title: 'Campo requerido',
        text: 'La notificación debe tener una fecha de notificación válida.',
      });
      return;
    }
    if (host.notificacionver?.situacion === 2) {
      this.notificationService.warning({
        title: 'Notificación ya enviada',
        text: 'Esta notificación ya ha sido enviada y no puede ser enviada nuevamente.',
      });
      return;
    }
    if (host.notificacionver?.situacion !== 1) {
      this.notificationService.warning({
        title: 'Estado incorrecto',
        text: 'Solo se pueden enviar notificaciones en estado GENERADA.',
      });
      return;
    }

    this.notificationService.custom({
      title: 'Enviando notificación...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });

    const datosParaEnviar = {
      idNotif: host.idNotificacion,
      situacion: 2,
      fecEnvio: host.creanotificacion.fecEnvio || new Date().toISOString().split('T')[0],
      usuContr: host.usuContrl,
    };

    this.notificacionesService.enviarNotificacion(datosParaEnviar, host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.close();
        host.refresSourceListarNotifi();
        host.quitabotonesNotifi();
        this.notificationService.success({ title: 'Notificación enviada' });
      },
      error: () => {
        this.notificationService.error({
          text: 'No se pudo enviar la notificación.',
        });
      },
    });
  }

  refrescarBotonesTrasAccion(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.habilitarBotonesNotificacion || !host.sourceListarNotifi?.records) {
      return;
    }
    setTimeout(() => {
      const rowData = host.sourceListarNotifi!.records!.find(
        (record: any) => record.idNotif === host.idNotificacion,
      );
      if (rowData) {
        host.habilitarBotonesNotificacion!(rowData);
      }
    }, 100);
  }

  borrarNotificacion(host: EditaExpedienteNotificacionesCrudHost, id: number): void {
    this.notificationService.confirm({
      title: `¿Confirma eliminar la notificación ${host.ejerNotifi}/${host.numeroNotifi} ?  `,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.notificacionesService.deleteNotificacion(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.refresSourceListarNotifi();
          this.notificationService.success({ title: 'Notificación Eliminada!' });
          host.quitabotonesNotifi();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.notificationService.custom({
              title: 'La Notificiación no se encuentra en estado "GENERADA" ',
              showClass: { popup: 'animate__animated animate__fadeInDown' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
          }
          this.notificationService.info({ title: 'No se pudo eliminar la Notificación!' });
        },
      });
    });
  }

  publicarNotifi(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.creanotificacion.fecPubBop || !host.creanotificacion.numBop) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const notificacionPublicacion = new CrearNotificacion();
    notificacionPublicacion.idNotif = host.idNotificacion;
    notificacionPublicacion.fecNotif = host.fecLimite;
    notificacionPublicacion.fecRecNotif = host.fecLimite;
    notificacionPublicacion.situacion = 3;
    notificacionPublicacion.bop = 2;
    notificacionPublicacion.fecPubBop = host.creanotificacion.fecPubBop;
    notificacionPublicacion.numBop = host.creanotificacion.numBop;
    notificacionPublicacion.usuContr = host.usuContrl || '';

    this.notificacionesService.PublicarNotificacion(notificacionPublicacion, host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, host.idNotificacion, host.modoVerNotificacion).then(() => {
          this.refrescarBotonesTrasAccion(host);
        });
        this.notificationService.success({ title: 'Notificacion Publicada!' });
        host.borrarDatosPublicacion();
        host.quitabotonesNotifi();
      },
      error: () => {
        this.notificationService.error({
          title: 'Error al publicar',
          text: 'No se pudo publicar la notificación. Por favor, inténtelo de nuevo.',
        });
      },
    });
  }

  recepcionarNotificacion(host: EditaExpedienteNotificacionesCrudHost): void {
    if (!host.creanotificacion.fecRecNotif || !host.creanotificacion.receptor) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const fecEnvioOriginal =
      host.notificacionver?.fecEnvio || host.creanotificacion.fecEnvio || null;
    const notificacionRecepcion = new CrearNotificacion();
    notificacionRecepcion.idNotif = host.idNotificacion;
    notificacionRecepcion.situacion = 3;
    notificacionRecepcion.fecRecNotif = host.creanotificacion.fecRecNotif;
    notificacionRecepcion.receptor = host.creanotificacion.receptor;
    notificacionRecepcion.observacion = host.creanotificacion.observacion || '';
    notificacionRecepcion.usuContr = host.usuContrl || '';
    if (fecEnvioOriginal) {
      notificacionRecepcion.fecEnvio = fecEnvioOriginal;
    }

    this.notificacionesService.recepcionarNotificacion(notificacionRecepcion, host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, host.idNotificacion, host.modoVerNotificacion).then(() => {
          this.refrescarBotonesTrasAccion(host);
        });
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${host.ejerNotifi}/${host.numeroNotifi} ha sido recepcionada correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.notificationService.error({
          title: 'Error al recepcionar',
          text: 'No se pudo recepcionar la notificación. Por favor, inténtelo de nuevo.',
        });
      },
    });
  }

  devolverNotificacion(host: EditaExpedienteNotificacionesCrudHost): void {
    if (
      !host.creanotificacion.fecRecNotif &&
      !host.creanotificacion.motNotif &&
      !host.creanotificacion.notificador
    ) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const fecEnvioOriginal =
      host.notificacionver?.fecEnvio || host.creanotificacion.fecEnvio || null;
    const notificacionDevolucion = new CrearNotificacion();
    notificacionDevolucion.idNotif = host.idNotificacion;
    notificacionDevolucion.situacion = 4;
    notificacionDevolucion.fecRecNotif = host.creanotificacion.fecRecNotif;
    notificacionDevolucion.motNotif = host.creanotificacion.motNotif;
    notificacionDevolucion.notificador = host.creanotificacion.notificador;
    notificacionDevolucion.notificador2 = host.creanotificacion.notificador;
    notificacionDevolucion.usuContr = host.usuContrl || '';
    if (fecEnvioOriginal) {
      notificacionDevolucion.fecEnvio = fecEnvioOriginal;
    }

    this.notificacionesService.editarNotificacion(notificacionDevolucion, host.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, host.idNotificacion, host.modoVerNotificacion).then(() => {
          this.refrescarBotonesTrasAccion(host);
        });
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${host.ejerNotifi}/${host.numeroNotifi} ha sido devuelta correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.notificationService.error({
          title: 'Error al devolver',
          text: 'No se pudo devolver la notificación. Por favor, inténtelo de nuevo.',
        });
      },
    });
  }

  anularNotificacion(host: EditaExpedienteNotificacionesCrudHost): void {
    this.notificationService.confirm({
      title: `¿ Confirma Anular la notificación : ${host.ejerNotifi}/${host.numeroNotifi} ?`,
      text: 'Este paso no tendra marcha atras!',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const notificacionAnulacion = new CrearNotificacion();
      notificacionAnulacion.idNotif = host.idNotificacion;
      notificacionAnulacion.situacion = 6;
      notificacionAnulacion.usuContr = host.usuContrl || '';

      this.notificacionesService.anularNotificacion(notificacionAnulacion, host.idNotificacion).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.refresSourceListarNotifi();
          this.vernotifi(host, host.idNotificacion, host.modoVerNotificacion).then(() => {
            this.refrescarBotonesTrasAccion(host);
          });
          host.quitabotonesNotifi();
          this.notificationService.success({
            title: '¡Anulada!',
            text: 'Esta notificación fue anulada.',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: () => {
          this.notificationService.error({
            title: 'Error al anular',
            text: 'No se pudo anular la notificación. Por favor, inténtelo de nuevo.',
          });
        },
      });
    });
  }

  crearNotificacionConfirmada(host: CrearNotificacionConfirmadaHost): void {
    this.notificacionesService.crearNotificacion(host.creanotificacion, host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.tareasFacade.refrescarGrid(host, host.idTramite);
        host.resetvariables();
        host.limpiarFormularioNotificacion();
        this.notificationService.success({ title: 'Crear Notificación', text: 'La notificación fue generada.' }).then(() => {
          host.cerrarModalCrearNotificacion();
        });
      },
      error: (err: HttpErrorResponse) => {
        let mensajeError = 'Error al crear la notificación';

        if (err.error) {
          if (err.error.message) {
            mensajeError = err.error.message;
          } else if (err.error.error) {
            mensajeError = `Error del servidor: ${err.error.error}`;
          } else if (err.status === 500) {
            mensajeError = 'Error interno del servidor. Contacte al administrador.';
          } else if (err.status === 404) {
            mensajeError = 'Recurso no encontrado.';
          } else if (err.status === 400) {
            mensajeError = 'Datos incorrectos. Verifique la información.';
          }
        }

        this.notificationService.error({ title: 'Error', text: mensajeError }).then(() => {
          host.limpiarEstadoModalError();
        });
      },
    });
  }

  solicitarCreacionNotificacion(host: SolicitarCrearNotificacionHost): void {
    if (!host.idTarea) {
      this.notificationService.warning({ title: 'Error', text: 'Debe seleccionar una tarea antes de crear la notificación' });
      return;
    }

    if (!host.validarFormularioNotificacion()) {
      const camposFaltantes: string[] = [];
      if (!host.creanotificacion.fecNotif) {
        camposFaltantes.push('Fecha de Notificación');
      }
      if (!host.creanotificacion.dni) {
        camposFaltantes.push('Interesado');
      }
      this.notificationService.warning({
        title: 'Error',
        text: 'Debe rellenar todos los campos obligatorios: ' + camposFaltantes.join(', '),
      });
      return;
    }

    const interesado = host.listarinteresadosdto.find(
      (item) => item.numDocumInter === host.creanotificacion.dni,
    );

    if (!interesado) {
      this.notificationService.error({ title: 'Error', text: 'No se encontró el interesado seleccionado' });
      return;
    }

    normalizarCreacionNotificacion(host.creanotificacion, interesado, {
      usuContrl: host.usuContrl!,
      ejercicioExpediente: host.verExpediente.ejercicio,
      numeroExpediente: host.verExpediente.numero,
      identificadorFicheroSubido: host.identificadorFicheroSubido,
      fechaActual: host.fecha,
    });

    this.notificationService.confirm({
      title: 'Confirmar creación de notificación',
      text: `¿Está seguro de que desea crear la notificación para ${interesado.nomInter}?`,
      confirmButtonText: 'Crear Notificación',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearNotificacionConfirmada(host);
      }
    });
  }
}
