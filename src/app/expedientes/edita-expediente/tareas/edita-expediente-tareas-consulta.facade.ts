import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TareaProcedimientoDTO } from '../../../core/models/tarea-procedimiento.dto';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { ObjetoTributarioDto } from '../../../core/models/objeto-tributario.dto';
import { ReciboCabeceraDto } from '../../../core/models/recibo-cabecera.dto';
import { ExpedientesService } from '../../expedientes.service';
import { Habitantes, PersonaEntidad, Vehiculo } from './tareas-accion.models';
import { cargarRecibosPendientes, RecibosPendientesHost } from './tareas-recibos.helper';

export interface ConsultaAccionHost extends RecibosPendientesHost {
  tareatramiteprocedimiento: TareaProcedimientoDTO;
  isConsultaAccionRunning: boolean;
  veoAcciones: boolean;
  descripcionAccion: string;
  ediquetaValorConsulta: string;
  veoTipoObjetoTributario: boolean;
  habitantes: Habitantes;
  vehiculo: Vehiculo;
  personaentidad: PersonaEntidad;
  objetotributario: ObjetoTributarioDto;
  veoConsultaObjetoTributario: boolean;
  veoModifiDatosPerso: boolean;
  veoBajaHabitante: boolean;
  modifiObjetoTribu: boolean;
  cargando: boolean;
  idExpediente: number;
  usuContrl: string | null;
  introValorConsulta: string;
  introTObjTrubu: TipoObjetoTributarioDto;
  tipoObjetoTributario: TipoObjetoTributarioDto[];
  tipoObjetoSeleccionado: TipoObjetoTributarioDto;
  resetActionState(): void;
  abrirModalLiquidacion(): void;
}

function htmlConsultaHabitantes(h: Habitantes): string {
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

function htmlConsultaVehiculo(v: Vehiculo): string {
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
export class EditaExpedienteTareasConsultaFacade {
  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly http: HttpClient,
  ) {}

  consultaAccion(host: ConsultaAccionHost, valor: unknown, idtipobje: TipoObjetoTributarioDto): void {
    const accion = host.tareatramiteprocedimiento.accion;

    if (accion === null || accion === undefined) {
      host.isConsultaAccionRunning = false;
      host.veoAcciones = false;
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
        Swal.fire({
          title: 'Acción no reconocida',
          text: `La acción con código ${accion} no está implementada.`,
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
        host.isConsultaAccionRunning = false;
    }
  }

  private consultaHabitantes(host: ConsultaAccionHost, valor: unknown): void {
    host.ediquetaValorConsulta = 'Introduzca documento';
    host.veoTipoObjetoTributario = false;
    this.expedientesService.getConsultaHabitantea(String(valor)).subscribe({
      next: (respuesta) => {
        host.habitantes = respuesta;
        host.isConsultaAccionRunning = false;
        Swal.fire({
          title: '<strong>Consulta Habitantes</strong>',
          html: htmlConsultaHabitantes(host.habitantes),
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i>Cerrar',
        });
      },
      error: (error) => {
        Swal.fire(error.error?.message);
        host.isConsultaAccionRunning = false;
      },
    });
  }

  private consultaVehiculo(host: ConsultaAccionHost, valor: unknown): void {
    host.ediquetaValorConsulta = 'Introduzca Matrícula';
    host.veoTipoObjetoTributario = false;
    this.expedientesService.getConsultaVehiculo(String(valor)).subscribe({
      next: (respuesta) => {
        host.vehiculo = respuesta;
        host.isConsultaAccionRunning = false;
        Swal.fire({
          title: '<strong>Consulta Vehículos</strong>',
          html: htmlConsultaVehiculo(host.vehiculo),
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i>Cerrar',
        });
      },
      error: (error) => {
        Swal.fire(error.error?.message);
        host.isConsultaAccionRunning = false;
      },
    });
  }

  private consultaObjetoTributario(
    host: ConsultaAccionHost,
    valor: unknown,
    idtipobje: TipoObjetoTributarioDto,
  ): void {
    host.ediquetaValorConsulta = 'Introduzca documento';
    host.veoTipoObjetoTributario = true;

    if (!idtipobje || !valor) {
      Swal.fire('Debe seleccionar el tipo de objeto tributario y documento.');
      host.isConsultaAccionRunning = false;
      return;
    }

    const idHisTip = idtipobje.idHisTipObjTribu;
    const idTip = idtipobje.idTipObjTribu;
    this.expedientesService.getObjetoTributario(`${idHisTip}/${idTip}`, String(valor)).subscribe({
      next: (respuesta) => {
        host.objetotributario = respuesta;
        host.veoConsultaObjetoTributario = true;
        host.isConsultaAccionRunning = false;
      },
      error: (error) => {
        Swal.fire(error.error?.message);
        host.isConsultaAccionRunning = false;
      },
    });
  }

  private modificarDatosPersona(host: ConsultaAccionHost, valor: unknown): void {
    host.descripcionAccion = 'Modificar datos Persona';
    host.ediquetaValorConsulta = 'Introduzca documento';
    this.expedientesService.getPersonaEntidad(String(valor)).subscribe({
      next: (respuesta) => {
        host.veoModifiDatosPerso = true;
        host.personaentidad = respuesta;
        host.isConsultaAccionRunning = false;
      },
      error: (error) => {
        Swal.fire(error.error?.message);
        host.isConsultaAccionRunning = false;
        host.resetActionState();
      },
    });
  }

  private bajaHabitante(host: ConsultaAccionHost, valor: unknown): void {
    host.descripcionAccion = 'Baja Habitante';
    host.ediquetaValorConsulta = 'Introduzca documento';
    this.expedientesService.getPersonaEntidad(String(valor)).subscribe({
      next: (respuesta) => {
        host.veoBajaHabitante = true;
        host.personaentidad = respuesta;
      },
      error: (error) => {
        Swal.fire(error.error?.message);
        host.resetActionState();
      },
    });
    host.isConsultaAccionRunning = false;
  }

  private bajaObjetoTributario(host: ConsultaAccionHost): void {
    host.descripcionAccion = 'Baja Objeto Tributario';
    host.ediquetaValorConsulta = 'Introduzca documento';

    if (!host.introValorConsulta || !host.introTObjTrubu) {
      Swal.fire('Debe ingresar el documento y tipo de objeto tributario.');
      host.isConsultaAccionRunning = false;
      return;
    }

    const idHisTip = host.introTObjTrubu.idHisTipObjTribu;
    const idTip = host.introTObjTrubu.idTipObjTribu;
    const numDocum = host.introValorConsulta;

    this.expedientesService.getObjetoTributario(`${idHisTip}/${idTip}`, numDocum).subscribe({
      next: (respuesta: ObjetoTributarioDto) => {
        host.objetotributario = respuesta;
        host.modifiObjetoTribu = true;
        host.veoConsultaObjetoTributario = false;
        host.veoTipoObjetoTributario = false;
        if (host.objetotributario.codMovim === 'BAJA') {
          host.objetotributario.observaciones = null;
        }
        host.cdr.detectChanges();
        host.isConsultaAccionRunning = false;
        host.resetActionState();
      },
      error: (error) => {
        Swal.fire('Error', error.error?.message, 'error');
        host.isConsultaAccionRunning = false;
        host.resetActionState();
      },
    });
  }

  private descargarVolanteEmpadronamiento(host: ConsultaAccionHost, valor: unknown): void {
    host.cargando = true;
    host.descripcionAccion = 'Volante de Empadronamiento';
    host.ediquetaValorConsulta = 'Introduzca DNI';
    this.expedientesService
      .getVolanteEmpadronamiento(String(valor), host.idExpediente, host.usuContrl!)
      .pipe(finalize(() => { host.cargando = false; }))
      .subscribe({
        next: (response: Blob) => {
          descargarBlob(new Blob([response], { type: response.type }), 'VolanteEmpadronamiento.pdf');
          Swal.fire({
            title: 'Descarga completada',
            text: 'El Volante de Empadronamiento se ha descargado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => host.resetActionState());
        },
        error: (error: { error?: { message?: string } }) => {
          const msg = error?.error?.message || 'No se pudo generar el Volante de Empadronamiento.';
          Swal.fire('Error', msg, 'error').then(() => host.resetActionState());
        },
      });
  }

  private descargarCertificadoEmpadronamiento(host: ConsultaAccionHost, valor: unknown): void {
    host.cargando = true;
    host.descripcionAccion = 'Certificado de Empadronamiento';
    host.ediquetaValorConsulta = 'Introduzca DNI';
    this.expedientesService
      .getCertificadoEmpadronamiento(String(valor), host.idExpediente, host.usuContrl!)
      .pipe(
        finalize(() => {
          host.cargando = false;
          host.resetActionState();
          host.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response: Blob) => {
          descargarBlob(new Blob([response], { type: response.type }), 'CertificadoEmpadronamiento.pdf');
          Swal.fire({
            title: 'Descarga completada',
            text: 'El Certificado de Empadronamiento se ha descargado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => host.resetActionState());
        },
        error: (error: { error?: { message?: string } }) => {
          const msg = error?.error?.message || 'No se pudo generar el Certificado de Empadronamiento.';
          Swal.fire('Error', msg, 'error').then(() => host.resetActionState());
        },
      });
  }

  private recibosPendientes(host: ConsultaAccionHost, valor: unknown): void {
    host.cargando = true;
    host.descripcionAccion = 'Recibos Pendientes de Pago';
    host.ediquetaValorConsulta = 'Introduzca DNI';
    host.veoTipoObjetoTributario = false;

    const dni = String(valor ?? '').trim();
    if (!dni) {
      Swal.fire({ title: 'Atención', text: 'Debe introducir un DNI', icon: 'warning' });
      host.isConsultaAccionRunning = false;
      host.cargando = false;
      return;
    }

    host.introValorConsulta = dni;
    cargarRecibosPendientes(host, this.http)
      .pipe(
        finalize(() => {
          host.cargando = false;
          host.resetActionState();
          host.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => { host.isConsultaAccionRunning = false; },
        error: () => {
          host.cargando = false;
          host.resetActionState();
        },
      });
  }

  private descargarCertificadoDeuda(host: ConsultaAccionHost, valor: unknown): void {
    host.cargando = true;
    host.descripcionAccion = 'Certificado de deudas';
    host.ediquetaValorConsulta = 'Introduzca DNI';
    this.expedientesService
      .getCertificadoDeuda(String(valor), host.idExpediente, host.usuContrl!)
      .pipe(
        finalize(() => {
          host.cargando = false;
          host.resetActionState();
          host.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (blob: Blob) => {
          descargarBlob(blob, 'certificado_deuda.pdf');
          Swal.fire({
            title: 'Descarga completada',
            text: 'El Certificado de Deudas se ha descargado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (error) => {
          Swal.fire(error.error?.message);
        },
      });
  }

  private abrirLiquidacion(host: ConsultaAccionHost): void {
    host.cargando = true;
    host.descripcionAccion = 'Generar liquidaciones';
    host.veoTipoObjetoTributario = true;

    const idHis = host.introTObjTrubu.idHisTipObjTribu;
    const idTip = host.introTObjTrubu.idTipObjTribu;
    const encontrado = host.tipoObjetoTributario.find(
      (tipo) => tipo.idHisTipObjTribu === idHis && tipo.idTipObjTribu === idTip,
    );

    host.tipoObjetoSeleccionado = encontrado ?? {
      idHisTipObjTribu: 0,
      idTipObjTribu: 0,
      codTipObjTribu: '',
      desTipObjTribu: '',
    };

    host.abrirModalLiquidacion();
    host.isConsultaAccionRunning = false;
    host.cargando = false;
    host.resetActionState();
    host.cdr.detectChanges();
  }

  loadRecibos(host: ConsultaAccionHost): Observable<ReciboCabeceraDto[]> {
    return cargarRecibosPendientes(host, this.http);
  }
}
