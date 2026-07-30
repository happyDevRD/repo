import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { finalize, switchMap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { TareaProcedimientoDTO } from '../../../../core/models/tarea-procedimiento.dto'
import { TipoObjetoTributarioDto } from '../../../../core/models/tipo-objeto-tributario.dto'
import { ReciboCabeceraDto } from '../../../../core/models/recibo-cabecera.dto'
import { ObjetoTributarioDto } from '../../../../core/models/objeto-tributario.dto'
import { HabitanteDto } from '../../../../core/models/habitante.dto'
import { VehiculoDto } from '../../../../core/models/vehiculo.dto'
import { NotificationService } from '../../../../core/service/notification.service'
import { ExpedientesService } from '../../expedientes.service'
import {
  getAccionButtonText,
  isDNIAction,
  resetActionState,
  validarConsultaAccionClick,
} from './tareas-accion.helper'
import { TareasAccionUiState } from './tareas-accion.models'
import { cargarRecibosPendientes, RecibosPendientesHost } from './tareas-recibos.helper'
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types'

/** Evita import circular con el coordinator. */
export type AccionTareaProcedimientoRef = {
  tareatramiteprocedimiento: TareaProcedimientoDTO
}

export interface ConsultaAccionHost {
  tareasFacade: TareasAccionUiState
  tareatramiteprocedimiento: TareaProcedimientoDTO
  idExpediente: number
  usuContrl: string | null
  tipoObjetoTributario: TipoObjetoTributarioDto[]
  gridRecibos?: RecibosPendientesHost['gridRecibos']
  cdr: ChangeDetectorRef
  resetActionState(): void
  abrirModalLiquidacion(): void
}

export interface EditaExpedienteTareasAccionHost extends ConsultaAccionHost {
  tareatramiteexpedientecrear: { tareaProcedimiento: number }
}

export interface ObjetoTributarioBajaHost {
  tareasFacade: { objetotributario: ObjetoTributarioDto }
  cdr: ChangeDetectorRef
}

function htmlConsultaHabitantes(h: HabitanteDto): string {
  return `
    <h4>${h.nombre || ''} ${h.apellido1 || ''} ${h.apellido2 || ''}</h4>
    <h4><strong>Tipo Doc.</strong> ${h.tipDocum || ''} <strong>Número</strong> ${h.numDocum || ''}</h4>
    <h4><strong>Domicilio</strong> ${h.domicilio || ''}</h4>
    <h4><strong>Teléfono</strong> ${h.telefono || ''} <strong>Email</strong> ${h.email || ''}</h4>
    <h4><strong>Distrito</strong> ${h.distrito || ''} <strong>Sección</strong> ${h.seccion || ''}</h4>
    <h4><strong>Hoja Padrón</strong> ${h.numHojPadro || ''} <strong>Número de familia</strong> ${h.numFamil || ''}</h4>
    <h4><strong>Número de orden</strong> ${h.numOrden || ''}</h4>
    <h4><strong>Fecha Padrón</strong> ${h.fecPadro || ''} <strong>Fecha Nacimiento</strong> ${h.fecNacim || ''}</h4>
    <h4><strong>Provincia</strong> ${h.proNacim || ''} <strong>Municipio</strong> ${h.munNacim || ''}</h4>
    <h4><strong>Situación</strong> ${h.situacion || ''}</h4>
    <h4><strong>Fecha Situación</strong> ${h.fecSituacion || ''}</h4>
    <h4><strong>Observaciones</strong> ${h.observaciones || ''}</h4>`;
}

function htmlConsultaVehiculo(v: VehiculoDto): string {
  return `
    <h4><strong>Documento identidad</strong> ${v.numDocum}</h4>
    <h4><strong>Domicilio</strong> ${v.domicilio}</h4>
    <h4><strong>Código Postal</strong> ${v.cp} <strong>Provincia</strong> ${v.provincia} <strong>Municipio</strong> ${v.municipio}</h4>
    <h4><strong>Matrícula</strong> ${v.matricula} <strong>Bastidor</strong> ${v.bastidor}</h4>
    <h4><strong>Tipo Vehículo</strong> ${v.tipoVehiculo} <strong>Marca</strong> ${v.marca} <strong>Modelo</strong> ${v.modelo}</h4>`;
}

function descargarBlob(blob: Blob, nombre: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  window.URL.revokeObjectURL(url);
}


@Injectable()
export class EditaExpedienteTareasAccionFacade {
  private readonly destroyRef = inject(DestroyRef)
  private readonly http = inject(HttpClient)
  private readonly expedientesService = inject(ExpedientesService)
  private readonly notificationService = inject(NotificationService)

  private getUi: () => TareasAccionUiState = () => {
    throw new Error('Accion UI state no enlazado')
  }
  private seleccionarTareaProcedimientoFn: (
    host: unknown,
    selectedValue: number | string,
  ) => void = () => undefined

  bind(deps: {
    getUi: () => TareasAccionUiState
    seleccionarTareaProcedimiento: (host: unknown, selectedValue: number | string) => void
  }): void {
    this.getUi = deps.getUi
    this.seleccionarTareaProcedimientoFn = deps.seleccionarTareaProcedimiento
  }

  private get ui(): TareasAccionUiState {
    return this.getUi()
  }

  // --- Accion / consulta (antes TareasAccionFacade) ---

  resetActionState(host: { cdr: ChangeDetectorRef }): void {
    resetActionState(this.ui, host.cdr)
  }

  getAccionButtonText(tareatramiteprocedimiento: TareaProcedimientoDTO): string {
    return getAccionButtonText(tareatramiteprocedimiento)
  }

  isDNIAction(accion?: number | null): boolean {
    return isDNIAction(accion)
  }

  onConsultaAccionClick(host: EditaExpedienteTareasAccionHost, _tareaProcedimientoHost?: AccionTareaProcedimientoRef): void {
    // No re-seleccionar la tarea aquí: getTramiteTarea → resetActionState borraba el resultado de la consulta.
    if (this.ui.isConsultaAccionRunning) {
      return
    }

    if (host.tareatramiteprocedimiento?.accion == null || host.tareatramiteprocedimiento.accion === -1) {
      this.notificationService.warning({
        title: 'Tarea requerida',
        text: 'Seleccione primero una tarea del procedimiento.',
      })
      return
    }

    if (!validarConsultaAccionClick({
      tareatramiteprocedimiento: host.tareatramiteprocedimiento,
      introValorConsulta: this.ui.introValorConsulta,
      introTObjTrubu: this.ui.introTObjTrubu,
    }, this.notificationService)) {
      return
    }

    this.ui.isConsultaAccionRunning = true
    this.consultaAccion(host, this.ui.introValorConsulta, this.ui.introTObjTrubu)
  }

    
  consultaAccion(host: EditaExpedienteTareasAccionHost, valor: string, idtipobje: TipoObjetoTributarioDto): void {
      const accion = host.tareatramiteprocedimiento.accion;
  
      if (accion === null || accion === undefined) {
        host.tareasFacade.isConsultaAccionRunning = false;
        host.tareasFacade.veoAcciones = false;
        return;
      }
  
      switch (accion) {
        case 0:
          this.consultaHabitantes(host, valor);
          break;
        case 1:
          this.consultaVehiculo(host, valor);
          break;
        case 2:
          this.consultaObjetoTributario(host, valor, idtipobje);
          break;
        case 3:
          this.modificarDatosPersona(host, valor);
          break;
        case 4:
          this.bajaHabitante(host, valor);
          break;
        case 5:
          this.bajaObjetoTributario(host);
          break;
        case 6:
          this.descargarVolanteEmpadronamiento(host, valor);
          break;
        case 7:
          this.descargarCertificadoEmpadronamiento(host, valor);
          break;
        case 8:
          this.recibosPendientes(host, valor);
          break;
        case 9:
          this.descargarCertificadoDeuda(host, valor);
          break;
        case 10:
          this.abrirLiquidacion(host);
          break;
        default:
          this.notificationService.error({
            title: 'Acción no reconocida',
            text: `La acción con código ${accion} no está implementada.`,
            confirmButtonText: 'Cerrar',
          });
          host.tareasFacade.isConsultaAccionRunning = false;
      }
    }
  
    private consultaHabitantes(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca documento';
      host.tareasFacade.veoTipoObjetoTributario = false;
      this.expedientesService.getConsultaHabitantea(String(valor)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.tareasFacade.habitantes = respuesta;
          host.tareasFacade.isConsultaAccionRunning = false;
          this.notificationService.custom({
            title: '<strong>Consulta Habitantes</strong>',
            html: htmlConsultaHabitantes(host.tareasFacade.habitantes),
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i>Cerrar',
          });
        },
        error: (error) => {
          this.notificationService.error(error.error?.message);
          host.tareasFacade.isConsultaAccionRunning = false;
        },
      });
    }
  
    private consultaVehiculo(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca Matrícula';
      host.tareasFacade.veoTipoObjetoTributario = false;
      this.expedientesService.getConsultaVehiculo(String(valor)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.tareasFacade.vehiculo = respuesta;
          host.tareasFacade.isConsultaAccionRunning = false;
          this.notificationService.custom({
            title: '<strong>Consulta Vehículos</strong>',
            html: htmlConsultaVehiculo(host.tareasFacade.vehiculo),
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i>Cerrar',
          });
        },
        error: (error) => {
          this.notificationService.error(error.error?.message);
          host.tareasFacade.isConsultaAccionRunning = false;
        },
      });
    }
  
    private consultaObjetoTributario(
      host: EditaExpedienteTareasAccionHost,
      valor: string,
      idtipobje: TipoObjetoTributarioDto,
    ): void {
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca documento';
      host.tareasFacade.veoTipoObjetoTributario = true;
  
      if (!idtipobje || !valor) {
        this.notificationService.warning('Debe seleccionar el tipo de objeto tributario y documento.');
        host.tareasFacade.isConsultaAccionRunning = false;
        return;
      }
  
      const idHisTip = idtipobje.idHisTipObjTribu;
      const idTip = idtipobje.idTipObjTribu;
      this.expedientesService.getObjetoTributario(`${idHisTip}/${idTip}`, String(valor)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.tareasFacade.objetotributario = respuesta;
          host.tareasFacade.veoConsultaObjetoTributario = true;
          host.tareasFacade.isConsultaAccionRunning = false;
        },
        error: (error) => {
          this.notificationService.error(error.error?.message);
          host.tareasFacade.isConsultaAccionRunning = false;
        },
      });
    }
  
    private modificarDatosPersona(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.descripcionAccion = 'Modificar datos Persona';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca documento';
      this.expedientesService.getPersonaEntidad(String(valor)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.tareasFacade.veoModifiDatosPerso = true;
          host.tareasFacade.personaentidad = respuesta;
          host.tareasFacade.isConsultaAccionRunning = false;
        },
        error: (error) => {
          this.notificationService.error(error.error?.message);
          host.tareasFacade.isConsultaAccionRunning = false;
          host.resetActionState();
        },
      });
    }
  
    private bajaHabitante(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.descripcionAccion = 'Baja Habitante';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca documento';
      this.expedientesService.getPersonaEntidad(String(valor)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => {
          host.tareasFacade.veoBajaHabitante = true;
          host.tareasFacade.personaentidad = respuesta;
        },
        error: (error) => {
          this.notificationService.error(error.error?.message);
          host.resetActionState();
        },
      });
      host.tareasFacade.isConsultaAccionRunning = false;
    }
  
    private bajaObjetoTributario(host: EditaExpedienteTareasAccionHost): void {
      host.tareasFacade.descripcionAccion = 'Baja Objeto Tributario';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca documento';
  
      if (!host.tareasFacade.introValorConsulta || !host.tareasFacade.introTObjTrubu) {
        this.notificationService.warning('Debe ingresar el documento y tipo de objeto tributario.');
        host.tareasFacade.isConsultaAccionRunning = false;
        return;
      }
  
      const idHisTip = host.tareasFacade.introTObjTrubu.idHisTipObjTribu;
      const idTip = host.tareasFacade.introTObjTrubu.idTipObjTribu;
      const numDocum = host.tareasFacade.introValorConsulta;
  
      this.expedientesService.getObjetoTributario(`${idHisTip}/${idTip}`, numDocum).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta: ObjetoTributarioDto) => {
          host.tareasFacade.objetotributario = respuesta;
          host.tareasFacade.modifiObjetoTribu = true;
          host.tareasFacade.veoConsultaObjetoTributario = false;
          if (host.tareasFacade.objetotributario.codMovim === 'BAJA') {
            host.tareasFacade.objetotributario.observaciones = null;
          }
          host.tareasFacade.isConsultaAccionRunning = false;
          host.cdr.detectChanges();
        },
        error: (error) => {
          this.notificationService.error({ title: 'Error', text: error.error?.message });
          host.tareasFacade.isConsultaAccionRunning = false;
        },
      });
    }
  
    private descargarVolanteEmpadronamiento(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.cargando = true;
      host.tareasFacade.descripcionAccion = 'Volante de Empadronamiento';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca DNI';
      this.expedientesService
        .getVolanteEmpadronamiento(String(valor), host.idExpediente, host.usuContrl!)
        .pipe(
          finalize(() => { host.tareasFacade.cargando = false; }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (response: Blob) => {
            descargarBlob(new Blob([response], { type: response.type }), 'VolanteEmpadronamiento.pdf');
            this.notificationService.success({
              title: 'Descarga completada',
              text: 'El Volante de Empadronamiento se ha descargado correctamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => host.resetActionState());
          },
          error: (error: { error?: { message?: string } }) => {
            const msg = error?.error?.message || 'No se pudo generar el Volante de Empadronamiento.';
            this.notificationService.error({ title: 'Error', text: msg }).then(() => host.resetActionState());
          },
        });
    }
  
    private descargarCertificadoEmpadronamiento(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.cargando = true;
      host.tareasFacade.descripcionAccion = 'Certificado de Empadronamiento';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca DNI';
      this.expedientesService
        .getCertificadoEmpadronamiento(String(valor), host.idExpediente, host.usuContrl!)
        .pipe(
          finalize(() => {
            host.tareasFacade.cargando = false;
            host.resetActionState();
            host.cdr.detectChanges();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (response: Blob) => {
            descargarBlob(new Blob([response], { type: response.type }), 'CertificadoEmpadronamiento.pdf');
            this.notificationService.success({
              title: 'Descarga completada',
              text: 'El Certificado de Empadronamiento se ha descargado correctamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => host.resetActionState());
          },
          error: (error: { error?: { message?: string } }) => {
            const msg = error?.error?.message || 'No se pudo generar el Certificado de Empadronamiento.';
            this.notificationService.error({ title: 'Error', text: msg }).then(() => host.resetActionState());
          },
        });
    }
  
    private recibosPendientes(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.cargando = true;
      host.tareasFacade.descripcionAccion = 'Recibos Pendientes de Pago';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca DNI';
      host.tareasFacade.veoTipoObjetoTributario = false;
  
      const dni = String(valor ?? '').trim();
      if (!dni) {
        this.notificationService.warning({ title: 'Atención', text: 'Debe introducir un DNI' });
        host.tareasFacade.isConsultaAccionRunning = false;
        host.tareasFacade.cargando = false;
        return;
      }
  
      host.tareasFacade.introValorConsulta = dni;
      cargarRecibosPendientes(this.recibosHost(host), this.http, this.notificationService)
        .pipe(
          finalize(() => {
            host.tareasFacade.cargando = false;
            host.resetActionState();
            host.cdr.detectChanges();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => { host.tareasFacade.isConsultaAccionRunning = false; },
          error: () => {
            host.tareasFacade.cargando = false;
            host.resetActionState();
          },
        });
    }
  
    private descargarCertificadoDeuda(host: EditaExpedienteTareasAccionHost, valor: string): void {
      host.tareasFacade.cargando = true;
      host.tareasFacade.descripcionAccion = 'Certificado de deudas';
      host.tareasFacade.ediquetaValorConsulta = 'Introduzca DNI';
      this.expedientesService
        .getCertificadoDeuda(String(valor), host.idExpediente, host.usuContrl!)
        .pipe(
          finalize(() => {
            host.tareasFacade.cargando = false;
            host.resetActionState();
            host.cdr.detectChanges();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (blob: Blob) => {
            descargarBlob(blob, 'certificado_deuda.pdf');
            this.notificationService.success({
              title: 'Descarga completada',
              text: 'El Certificado de Deudas se ha descargado correctamente.',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            this.notificationService.error(error.error?.message);
          },
        });
    }
  
    private abrirLiquidacion(host: EditaExpedienteTareasAccionHost): void {
      host.tareasFacade.cargando = true;
      host.tareasFacade.descripcionAccion = 'Generar liquidaciones';
      host.tareasFacade.veoTipoObjetoTributario = true;
  
      const idHis = host.tareasFacade.introTObjTrubu.idHisTipObjTribu;
      const idTip = host.tareasFacade.introTObjTrubu.idTipObjTribu;
      const encontrado = host.tipoObjetoTributario.find(
        (tipo) => tipo.idHisTipObjTribu === idHis && tipo.idTipObjTribu === idTip,
      );
  
      host.tareasFacade.tipoObjetoSeleccionado = encontrado ?? {
        idHisTipObjTribu: 0,
        idTipObjTribu: 0,
        codTipObjTribu: '',
        desTipObjTribu: '',
      };
  
      host.abrirModalLiquidacion();
      host.tareasFacade.isConsultaAccionRunning = false;
      host.tareasFacade.cargando = false;
      host.resetActionState();
      host.cdr.detectChanges();
    }
  
    loadRecibos(host: EditaExpedienteTareasAccionHost): Observable<ReciboCabeceraDto[]> {
      return cargarRecibosPendientes(this.recibosHost(host), this.http, this.notificationService);
    }
  
    private recibosHost(host: EditaExpedienteTareasAccionHost): RecibosPendientesHost {
      return {
        introValorConsulta: host.tareasFacade.introValorConsulta,
        get sourceRecibos() {
          return host.tareasFacade.sourceRecibos
        },
        set sourceRecibos(value: IflowGridSource | null) {
          host.tareasFacade.sourceRecibos = value
        },
        get dataAdapter() {
          return host.tareasFacade.dataAdapter
        },
        set dataAdapter(value: IflowGridSource | null) {
          host.tareasFacade.dataAdapter = value
        },
        gridRecibos: host.gridRecibos,
        cdr: host.cdr,
      }
    }
  

  darDeBajaObjeto(host: ObjetoTributarioBajaHost): void {
    const ui = host.tareasFacade
    if (!ui.objetotributario) {
      this.notificationService.error({ title: 'Error', text: 'No hay objeto tributario seleccionado' })
      return
    }

    this.notificationService.confirm({
      title: 'Confirmar Baja',
      text: '¿Estás seguro de dar de baja este objeto tributario?',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      const dto: Partial<ObjetoTributarioDto> = {
        idHisObjTribu: ui.objetotributario.idHisObjTribu,
        idObjTribu: ui.objetotributario.idObjTribu,
        numDocum: ui.objetotributario.numDocum,
        codMovim: 'BAJA',
        fecMovim: new Date().toISOString().slice(0, 10),
        observaciones: ui.objetotributario.observaciones?.trim() || null,
      }

      this.expedientesService
        .putBajaObjetoTributario(dto)
        .pipe(
          switchMap(() => this.recargarObjetoTributario(host)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (updated) => {
            ui.objetotributario = updated
            host.cdr.detectChanges()
            this.notificationService.success({ title: 'Éxito', text: 'Objeto dado de baja y recargado' })
          },
          error: (err) => {
            this.notificationService.error({ title: 'Error', text: err.error?.message || 'Error al procesar baja' })
            console.error(err)
          },
        })
    })
  }

  private recargarObjetoTributario(host: ObjetoTributarioBajaHost): Observable<ObjetoTributarioDto> {
    const obj = host.tareasFacade.objetotributario
    return this.expedientesService.getObjetoTributario(
      `${obj.idHisTipObjTribu}/${obj.idTipObjTribu}`,
      obj.numDocum,
    )
  }


}
