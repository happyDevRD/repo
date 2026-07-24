import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { CrearNotificacion, LeerNotificacion } from '../../expedientes'
import { InteresadoListarDto } from '../../../../core/models/interesado.dto'
import { NotificationService } from '../../../../core/service/notification.service'
import { NotificacionesService } from '../../services/notificaciones.service'
import {
  aplicarNotificacionVer,
  normalizarCreacionNotificacion,
  prepararDatosNotificacionParaEnvio,
  NotificacionDominioState,
} from './notificaciones-data.helper'
import { FechaNotificacionInput } from './notificaciones-form-campos.helper'
import { NotificacionGridRow } from './notificaciones-seleccion.helper'

export interface EditaExpedienteNotificacionesCrudHost {
  usuContrl: string | null
  fecLimite: Date
  fechasNotifi(
    fenvio: FechaNotificacionInput,
    frecep: FechaNotificacionInput,
    fpubli: FechaNotificacionInput,
    femision: FechaNotificacionInput,
  ): void
  solicitadni(dni: string): void
  cerrarModalNotificacion(): void
  refresSourceListarNotifi(): void
  quitabotonesNotifi(): void
  listadodeNotificaciones(): void
  borrarDatosPublicacion(): void
  habilitarBotonesNotificacion?(rowData: NotificacionGridRow): void
  sourceListarNotifi?: { records?: LeerNotificacion[] }
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
  private readonly destroyRef = inject(DestroyRef)
  private readonly notificacionesService = inject(NotificacionesService)
  private readonly notificationService = inject(NotificationService)

  private getState: () => NotificacionDominioState = () => {
    throw new Error('CRUD state no enlazado')
  }
  private resolveCrudHost: (host?: EditaExpedienteNotificacionesCrudHost) => EditaExpedienteNotificacionesCrudHost = () => {
    throw new Error('CRUD host no enlazado')
  }
  private resolveCrearHost: (host?: SolicitarCrearNotificacionHost) => SolicitarCrearNotificacionHost = () => {
    throw new Error('Crear host no enlazado')
  }
  private resolveConfirmHost: (host?: CrearNotificacionConfirmadaHost) => CrearNotificacionConfirmadaHost = () => {
    throw new Error('Confirm host no enlazado')
  }
  private refrescarGridTareas: (host: CrearNotificacionConfirmadaHost, idTramite: number) => void = () => undefined

  private get state(): NotificacionDominioState {
    return this.getState()
  }

  bind(deps: {
    getState: () => NotificacionDominioState
    resolveCrudHost: (host?: EditaExpedienteNotificacionesCrudHost) => EditaExpedienteNotificacionesCrudHost
    resolveCrearHost: (host?: SolicitarCrearNotificacionHost) => SolicitarCrearNotificacionHost
    resolveConfirmHost: (host?: CrearNotificacionConfirmadaHost) => CrearNotificacionConfirmadaHost
    refrescarGridTareas: (host: CrearNotificacionConfirmadaHost, idTramite: number) => void
  }): void {
    this.getState = deps.getState
    this.resolveCrudHost = deps.resolveCrudHost
    this.resolveCrearHost = deps.resolveCrearHost
    this.resolveConfirmHost = deps.resolveConfirmHost
    this.refrescarGridTareas = deps.refrescarGridTareas
  }

  // --- CRUD (antes NotificacionesCrudFacade) ---
  vernotifi(hostParam: EditaExpedienteNotificacionesCrudHost | undefined, id: number, modoVer = false): Promise<void> {
    const host = this.resolveCrudHost(hostParam)
    return new Promise((resolve, reject) => {
      this.notificacionesService.getNotificacionVer(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (response: LeerNotificacion | LeerNotificacion[]) => {
          const notificacionver = Array.isArray(response) ? response[0] : response;
          if (!notificacionver) {
            this.notificationService.error({
              text: 'No se pudieron cargar los datos de la notificación.',
            });
            reject(new Error('Sin datos'));
            return;
          }
          aplicarNotificacionVer(this.state, notificacionver, modoVer, id);
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

  editaNotifi(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.creanotificacion || !this.state.idNotificacion) {
      this.notificationService.error({
        text: 'No se puede editar la notificación. Faltan datos necesarios.',
      });
      return;
    }

    const datosParaEnviar = prepararDatosNotificacionParaEnvio(this.state.creanotificacion);
    this.notificationService.custom({
      title: 'Guardando cambios...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });

    this.notificacionesService.editarNotificacion(datosParaEnviar as any, this.state.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.cerrarModalNotificacion();
        host.refresSourceListarNotifi();
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${this.state.ejerNotifi}/${this.state.numeroNotifi} ha sido actualizada correctamente.`,
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

  enviarANotificaPlataforma(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }
    this.notificationService.custom({
      title: 'Enviando a Notifica...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });
    this.notificacionesService.enviarANotifica(this.state.idNotificacion).pipe(
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

  sincronizarConNotificaPlataforma(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.idNotificacion) {
      this.notificationService.warning('Seleccione una notificación.');
      return;
    }
    this.notificationService.custom({
      title: 'Sincronizando con Notifica...',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });
    this.notificacionesService.sincronizarNotifica(this.state.idNotificacion).pipe(
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

  async enviarNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): Promise<void> {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.notificacionver?.fecNotif) {
      try {
        await this.vernotifi(host, this.state.idNotificacion, false);
      } catch {
        this.notificationService.error({
          text: 'No se pudieron cargar los datos de la notificación.',
        });
        return;
      }
    }

    if (!this.state.notificacionver?.fecNotif) {
      this.notificationService.warning({
        title: 'Campo requerido',
        text: 'La notificación debe tener una fecha de notificación válida.',
      });
      return;
    }
    if (this.state.notificacionver?.situacion === 2) {
      this.notificationService.warning({
        title: 'Notificación ya enviada',
        text: 'Esta notificación ya ha sido enviada y no puede ser enviada nuevamente.',
      });
      return;
    }
    if (this.state.notificacionver?.situacion !== 1) {
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
      idNotif: this.state.idNotificacion,
      situacion: 2,
      fecEnvio: this.state.creanotificacion.fecEnvio || new Date().toISOString().split('T')[0],
      usuContr: host.usuContrl,
    };

    this.notificacionesService.enviarNotificacion(datosParaEnviar, this.state.idNotificacion).pipe(
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
        (record: LeerNotificacion) => record.idNotif === this.state.idNotificacion,
      );
      if (rowData) {
        host.habilitarBotonesNotificacion!(rowData);
      }
    }, 100);
  }

  borrarNotificacion(hostParam: EditaExpedienteNotificacionesCrudHost | undefined, id: number): void {
    const host = this.resolveCrudHost(hostParam)
    this.notificationService.confirm({
      title: `¿Confirma eliminar la notificación ${this.state.ejerNotifi}/${this.state.numeroNotifi} ?  `,
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

  publicarNotifi(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.creanotificacion.fecPubBop || !this.state.creanotificacion.numBop) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const notificacionPublicacion = new CrearNotificacion();
    notificacionPublicacion.idNotif = this.state.idNotificacion;
    notificacionPublicacion.fecNotif = host.fecLimite;
    notificacionPublicacion.fecRecNotif = host.fecLimite;
    notificacionPublicacion.situacion = 3;
    notificacionPublicacion.bop = 2;
    notificacionPublicacion.fecPubBop = this.state.creanotificacion.fecPubBop;
    notificacionPublicacion.numBop = this.state.creanotificacion.numBop;
    notificacionPublicacion.usuContr = host.usuContrl || '';

    this.notificacionesService.PublicarNotificacion(notificacionPublicacion, this.state.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, this.state.idNotificacion, this.state.modoVerNotificacion).then(() => {
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

  recepcionarNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (!this.state.creanotificacion.fecRecNotif || !this.state.creanotificacion.receptor) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const fecEnvioOriginal =
      this.state.notificacionver?.fecEnvio || this.state.creanotificacion.fecEnvio || null;
    const notificacionRecepcion = new CrearNotificacion();
    notificacionRecepcion.idNotif = this.state.idNotificacion;
    notificacionRecepcion.situacion = 3;
    notificacionRecepcion.fecRecNotif = this.state.creanotificacion.fecRecNotif;
    notificacionRecepcion.receptor = this.state.creanotificacion.receptor;
    notificacionRecepcion.observacion = this.state.creanotificacion.observacion || '';
    notificacionRecepcion.usuContr = host.usuContrl || '';
    if (fecEnvioOriginal) {
      notificacionRecepcion.fecEnvio = fecEnvioOriginal;
    }

    this.notificacionesService.recepcionarNotificacion(notificacionRecepcion, this.state.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, this.state.idNotificacion, this.state.modoVerNotificacion).then(() => {
          this.refrescarBotonesTrasAccion(host);
        });
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${this.state.ejerNotifi}/${this.state.numeroNotifi} ha sido recepcionada correctamente.`,
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

  devolverNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    if (
      !this.state.creanotificacion.fecRecNotif &&
      !this.state.creanotificacion.motNotif &&
      !this.state.creanotificacion.notificador
    ) {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
      return;
    }

    const fecEnvioOriginal =
      this.state.notificacionver?.fecEnvio || this.state.creanotificacion.fecEnvio || null;
    const notificacionDevolucion = new CrearNotificacion();
    notificacionDevolucion.idNotif = this.state.idNotificacion;
    notificacionDevolucion.situacion = 4;
    notificacionDevolucion.fecRecNotif = this.state.creanotificacion.fecRecNotif;
    notificacionDevolucion.motNotif = this.state.creanotificacion.motNotif;
    notificacionDevolucion.notificador = this.state.creanotificacion.notificador;
    notificacionDevolucion.notificador2 = this.state.creanotificacion.notificador;
    notificacionDevolucion.usuContr = host.usuContrl || '';
    if (fecEnvioOriginal) {
      notificacionDevolucion.fecEnvio = fecEnvioOriginal;
    }

    this.notificacionesService.editarNotificacion(notificacionDevolucion, this.state.idNotificacion).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        host.refresSourceListarNotifi();
        this.vernotifi(host, this.state.idNotificacion, this.state.modoVerNotificacion).then(() => {
          this.refrescarBotonesTrasAccion(host);
        });
        host.quitabotonesNotifi();
        this.notificationService.success({
          text: `La notificación ${this.state.ejerNotifi}/${this.state.numeroNotifi} ha sido devuelta correctamente.`,
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

  anularNotificacion(hostParam?: EditaExpedienteNotificacionesCrudHost): void {
    const host = this.resolveCrudHost(hostParam)
    this.notificationService.confirm({
      title: `¿ Confirma Anular la notificación : ${this.state.ejerNotifi}/${this.state.numeroNotifi} ?`,
      text: 'Este paso no tendra marcha atras!',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const notificacionAnulacion = new CrearNotificacion();
      notificacionAnulacion.idNotif = this.state.idNotificacion;
      notificacionAnulacion.situacion = 6;
      notificacionAnulacion.usuContr = host.usuContrl || '';

      this.notificacionesService.anularNotificacion(notificacionAnulacion, this.state.idNotificacion).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.refresSourceListarNotifi();
          this.vernotifi(host, this.state.idNotificacion, this.state.modoVerNotificacion).then(() => {
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

  crearNotificacionConfirmada(hostParam?: CrearNotificacionConfirmadaHost): void {
    const host = this.resolveConfirmHost(hostParam)
    this.notificacionesService.crearNotificacion(this.state.creanotificacion, host.idTarea).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.refrescarGridTareas(host, host.idTramite);
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

  solicitarCreacionNotificacion(hostParam?: SolicitarCrearNotificacionHost): void {
    const host = this.resolveCrearHost(hostParam)
    if (!host.idTarea) {
      this.notificationService.warning({ title: 'Error', text: 'Debe seleccionar una tarea antes de crear la notificación' });
      return;
    }

    if (!host.validarFormularioNotificacion()) {
      const camposFaltantes: string[] = [];
      if (!this.state.creanotificacion.fecNotif) {
        camposFaltantes.push('Fecha de Notificación');
      }
      if (!this.state.creanotificacion.dni) {
        camposFaltantes.push('Interesado');
      }
      this.notificationService.warning({
        title: 'Error',
        text: 'Debe rellenar todos los campos obligatorios: ' + camposFaltantes.join(', '),
      });
      return;
    }

    const interesado = host.listarinteresadosdto.find(
      (item) => item.numDocumInter === this.state.creanotificacion.dni,
    );

    if (!interesado) {
      this.notificationService.error({ title: 'Error', text: 'No se encontró el interesado seleccionado' });
      return;
    }

    normalizarCreacionNotificacion(this.state.creanotificacion, interesado, {
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
