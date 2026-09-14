import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { environment } from 'src/environments/environment'
import { VerExpediente } from '../../models/expediente-domain.model'
import { InsideEnvioRegistro } from '../../models/inside/inside-envio.models'
import { InsideSoapResponse } from '../../models/inside'
import { etiquetaEstadoEnvioInside, etiquetaInsideDryRunHtml, calcularEstadoResumenInside, mapEstadosPorTareaInside } from '../../constants/inside-simulacion.constants'
import { NotificationService } from '../notification.service'
import { InsideExpedienteOrchestrator } from './inside-expediente.orchestrator'
import { InsideService } from './inside.service'
import { buildIdentificadorExpedienteEni, resolverOrganoDesdeExpediente } from './inside-iflow.mapper'
import { InsideEnvioRegistroService } from './inside-envio-registro.service'
import { InsidePrepareApiService } from './inside-prepare-api.service'
import { formatearValidacionHtml } from './inside-validation.helper'

export interface InsideRemisionForm {
  idexpEni: string;
  dir3Juzgado: string;
  dir3Remitente: string;
  nig: string;
  claseProcedimiento: string;
  anyoProcedimiento: string;
  numeroProcedimiento: string;
  descripcion: string;
  codigoEnvioATEA: string;
}

export interface EditaExpedienteInsideHost {
  idExpediente: number;
  idTarea: number;
  numeroArchivo: number;
  verExpediente: VerExpediente;
  verAbreArchivo: boolean;
  insideEnviando: boolean;
  insideDryRun: boolean;
  insideRemision: InsideRemisionForm;
  insideUltimaRespuesta: InsideSoapResponse | null;
  insideUltimoEnvio: InsideEnvioRegistro | null;
  /** Último estado INSIDE por id de tarea (documento). */
  insideEstadosPorTarea?: Record<number, string>;
  /** Estado INSIDE agregado por id de trámite. */
  insideEstadosPorTramite?: Record<number, string>;
  /** Trámite seleccionado (para refresco optimista). */
  idTramite?: number;
  abrirModal(modalId: string): void;
  cerrarModal(modalId: string): void;
}

export const crearRemisionVacia = (): InsideRemisionForm => ({
  idexpEni: '',
  dir3Juzgado: '',
  dir3Remitente: '',
  nig: '',
  claseProcedimiento: '',
  anyoProcedimiento: '',
  numeroProcedimiento: '',
  descripcion: '',
  codigoEnvioATEA: '',
});

/**
 * Acciones INSIDE/ENI de expediente (validar, enviar, remisión a Justicia, historial).
 * Extraído de `EditaExpedienteOperacionesFacade` para poder invocarse desde cualquier
 * pantalla que implemente `EditaExpedienteInsideHost` (vista de edición, listado, ficha),
 * sin arrastrar el resto de dependencias de esa vista (tareas, router, etc.).
 */
@Injectable({ providedIn: 'root' })
export class InsideAccionesFacade {
  private readonly destroyRef = inject(DestroyRef)

  constructor(
    private readonly notificationService: NotificationService,
    private readonly insideOrchestrator: InsideExpedienteOrchestrator,
    private readonly insideService: InsideService,
    private readonly envioRegistroService: InsideEnvioRegistroService,
    private readonly prepareApiService: InsidePrepareApiService,
  ) {}

  inicializarRemision(host: EditaExpedienteInsideHost): void {
    const organo = resolverOrganoDesdeExpediente(host.verExpediente);
    host.insideRemision = {
      ...crearRemisionVacia(),
      idexpEni: buildIdentificadorExpedienteEni(
        organo,
        host.verExpediente.ejercicio,
        host.verExpediente.numero,
      ),
      dir3Remitente: organo,
      anyoProcedimiento: String(host.verExpediente.ejercicio ?? new Date().getFullYear()),
    };
  }

  abrirModalRemisionJusticia(host: EditaExpedienteInsideHost): void {
    this.inicializarRemision(host);
    host.abrirModal('insideRemisionJusticiaModal');
  }

  cargarEstadoEnvio(expedienteId: number, host: EditaExpedienteInsideHost): void {
    this.envioRegistroService.listarPorExpediente(expedienteId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (envios) => {
        const locales = this.envioRegistroService.listarLocalPorExpediente(expedienteId)
        const fusion = envios?.length ? envios : locales
        const resumen = calcularEstadoResumenInside(fusion)
          || (fusion[0]?.estadoResumen ? String(fusion[0].estadoResumen).toUpperCase() : '')

        const ultimoBase = fusion[0] ?? null
        host.insideUltimoEnvio = ultimoBase
          ? { ...ultimoBase, estadoResumen: resumen || ultimoBase.estadoResumen }
          : {
              expedienteId,
              operacion: '',
              fecha: new Date().toISOString(),
              dryRun: false,
              estadoResumen: resumen,
            }

        const porTareaApiFallback = mapEstadosPorTareaInside(fusion)
        host.insideEstadosPorTarea = { ...porTareaApiFallback }
      },
    })

    this.envioRegistroService.obtenerEstadosPorTarea(expedienteId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (porTarea) => {
        if (porTarea && Object.keys(porTarea).length) {
          host.insideEstadosPorTarea = { ...porTarea }
        }
      },
    })

    this.envioRegistroService.obtenerEstadosPorTramite(expedienteId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (porTramite) => {
        host.insideEstadosPorTramite = { ...(porTramite ?? {}) }
      },
    })
  }

  handleVerHistorialEnvios(host: EditaExpedienteInsideHost): void {
    this.envioRegistroService.listarPorExpediente(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (envios) => {
        if (!envios.length) {
          this.notificationService.info({ title: 'INSIDE', text: 'No hay envíos registrados para este expediente.' });
          return;
        }

        const resumenCalc = calcularEstadoResumenInside(envios)
        const resumenLabel = etiquetaEstadoEnvioInside(resumenCalc || envios[0]?.estadoResumen)
        const resumen = resumenLabel && resumenLabel !== '—'
          ? `<p class="text-start mb-2"><strong>Estado expediente:</strong> ${resumenLabel}</p>`
          : ''

        const filas = envios.map((envio) => `
          <tr>
            <td>${envio.operacion}</td>
            <td>${envio.idTarea != null ? envio.idTarea : '—'}</td>
            <td>${etiquetaEstadoEnvioInside(envio.estadoEnvio)}</td>
            <td>${envio.identificador ?? '-'}</td>
            <td>${envio.csv ?? '-'}</td>
          </tr>
        `).join('');

        this.notificationService.custom({
          title: 'Historial INSIDE',
          html: `
            ${resumen}
            <table class="table table-sm table-bordered text-start">
              <thead><tr><th>Operación</th><th>Tarea</th><th>Estado</th><th>ID ENI</th><th>CSV</th></tr></thead>
              <tbody>${filas}</tbody>
            </table>
          `,
          width: '52rem',
          icon: 'info',
        });
      },
    });
  }

  handleValidarExpediente(host: EditaExpedienteInsideHost): void {
    host.insideEnviando = true;
    this.insideOrchestrator.validarExpediente(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (preparacion) => {
        host.insideEnviando = false;
        this.notificationService.custom({
          title: preparacion.validacion.valido ? 'Expediente listo para INSIDE' : 'Validación INSIDE',
          html: `${this.etiquetaDryRun(preparacion.modoDryRun)}${formatearValidacionHtml(preparacion.validacion)}`,
          icon: preparacion.validacion.valido ? 'success' : 'warning',
        });
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  handleEnviarDocumentoTarea(host: EditaExpedienteInsideHost): void {
    if (!host.numeroArchivo || !host.idTarea) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione una tarea con documento asociado.' });
      return;
    }

    this.notificationService.confirm({
      title: 'Enviar documento a INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se convertirá el documento de la tarea seleccionada al formato ENI de INSIDE.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirDocumentoTarea(host.idExpediente, host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Documento enviado a INSIDE', respuesta, 'convertirDocumentoAEni', host.idTarea),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleAltaDocumentoEniXml(host: EditaExpedienteInsideHost): void {
    if (!host.numeroArchivo || !host.idTarea) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Seleccione una tarea con documento asociado.' });
      return;
    }

    this.notificationService.confirm({
      title: 'Alta documento ENI XML',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviará el XML ENI ya generado en disco para la tarea seleccionada.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.altaDocumentoEniXmlDesdeTarea(host.idExpediente, host.idTarea).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Alta documento ENI XML', respuesta, 'altaDocumentoEniXml', host.idTarea),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleEnviarExpedienteCompleto(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Enviar expediente a INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se convertirá el expediente completo con todos sus documentos.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirExpedienteCompleto(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Expediente enviado a INSIDE', respuesta, 'convertirExpedienteAEni'),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleAltaExpedienteEniXml(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Alta expediente ENI XML',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviará el XML ENI del expediente cerrado y los XML de sus documentos.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.altaExpedienteEniXmlDesdeExpediente(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuesta) => this.mostrarExito(host, 'Alta expediente ENI XML', respuesta, 'altaExpedienteEniXml'),
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleEnviarDocumentosExpediente(host: EditaExpedienteInsideHost): void {
    this.notificationService.confirm({
      title: 'Convertir documentos en INSIDE',
      html: `${this.etiquetaDryRun(host.insideDryRun)}Se enviarán todos los documentos del expediente de forma individual.`,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      host.insideEnviando = true;
      this.insideOrchestrator.convertirDocumentosExpediente(host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (respuestas) => {
          host.insideEnviando = false;
          const ultima = respuestas[respuestas.length - 1] ?? null;
          host.insideUltimaRespuesta = ultima;
          if (ultima) {
            this.registrarEnvio(host.idExpediente, 'convertirDocumentosExpediente', ultima);
          }
          this.notificationService.success({
            title: 'INSIDE',
            text: `Se procesaron ${respuestas.length} documento(s) correctamente.`,
          });
        },
        error: (error) => this.mostrarError(host, error),
      });
    });
  }

  handleRemisionAJusticia(host: EditaExpedienteInsideHost): void {
    const form = host.insideRemision;
    if (!form.idexpEni || !form.dir3Juzgado || !form.dir3Remitente || !form.nig) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Complete los campos obligatorios de la remisión.' });
      return;
    }

    host.insideEnviando = true;
    const peticionRemision = {
      idexpEni: form.idexpEni,
      dir3Juzgado: form.dir3Juzgado,
      datosRemisionJusticia: {
        dir3Remitente: form.dir3Remitente,
        nig: form.nig,
        claseProcedimiento: form.claseProcedimiento,
        anyoProcedimiento: form.anyoProcedimiento,
        numeroProcedimiento: form.numeroProcedimiento,
        descripcion: form.descripcion,
      },
    };

    const remision$ = environment.inside.useBackendProxy === true
      ? this.prepareApiService.enviarRemisionAJusticia({
          idExpediente: host.idExpediente,
          ...peticionRemision,
        })
      : this.insideService.remisionAJusticia(peticionRemision);

    remision$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (respuesta) => {
        if (respuesta.codigoEnvioATEA) {
          host.insideRemision.codigoEnvioATEA = respuesta.codigoEnvioATEA;
        }
        this.mostrarExito(host, 'Remisión a Justicia enviada', respuesta, 'remisionAJusticia');
        host.cerrarModal('insideRemisionJusticiaModal');
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  handleConsultarEstadoRemision(host: EditaExpedienteInsideHost): void {
    const codigo = host.insideRemision.codigoEnvioATEA?.trim();
    if (!codigo) {
      this.notificationService.warning({ title: 'INSIDE', text: 'Indique el código de envío ATEA.' });
      return;
    }

    host.insideEnviando = true;
    const consulta$ = environment.inside.useBackendProxy === true
      ? this.prepareApiService.consultarEstadoRemision({
          idExpediente: host.idExpediente,
          codigoEnvioATEA: codigo,
        })
      : this.insideService.consultaEstadoRemisionAJusticia({ codigoEnvioATEA: codigo });

    consulta$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (respuesta) => {
        host.insideEnviando = false;
        host.insideUltimaRespuesta = respuesta;
        this.notificationService.info({
          title: 'Estado de remisión',
          html: `
            ${this.etiquetaDryRun(host.insideDryRun)}
            <p><strong>Código ATEA:</strong> ${codigo}</p>
            <p><strong>Estado:</strong> ${respuesta.estadoRemision ?? respuesta.descripcionRespuesta ?? 'Sin datos'}</p>
            <p><strong>Código respuesta:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
          `,
        });
      },
      error: (error) => this.mostrarError(host, error),
    });
  }

  private etiquetaDryRun(activo: boolean): string {
    return etiquetaInsideDryRunHtml(activo);
  }

  private registrarEnvio(
    expedienteId: number,
    operacion: string,
    respuesta: InsideSoapResponse,
    options?: { idTarea?: number },
  ): void {
    this.envioRegistroService.registrarDesdeRespuesta(
      expedienteId,
      operacion,
      respuesta,
      {
        idTarea: options?.idTarea,
        dryRun: environment.inside.dryRun === true,
      },
    );
  }

  private actualizarEstadoEnvio(host: EditaExpedienteInsideHost): void {
    this.cargarEstadoEnvio(host.idExpediente, host);
  }

  private mostrarExito(
    host: EditaExpedienteInsideHost,
    titulo: string,
    respuesta: InsideSoapResponse,
    operacion: string,
    idTarea?: number,
  ): void {
    host.insideEnviando = false;
    host.insideUltimaRespuesta = respuesta;
    this.registrarEnvio(host.idExpediente, operacion, respuesta, { idTarea });

    // UI inmediata: documento → PARCIAL; expediente → ENVIADO (no esperar al API)
    const dryRun = environment.inside.dryRun === true
    const estadoFila = dryRun ? 'SIMULADO' : 'ENVIADO'
    if (idTarea != null) {
      host.insideEstadosPorTarea = { ...(host.insideEstadosPorTarea ?? {}), [idTarea]: estadoFila }
      if (host.idTramite) {
        host.insideEstadosPorTramite = {
          ...(host.insideEstadosPorTramite ?? {}),
          [host.idTramite]: estadoFila,
        }
      }
      host.insideUltimoEnvio = {
        expedienteId: host.idExpediente,
        idTarea,
        operacion,
        estadoEnvio: estadoFila,
        estadoResumen: 'PARCIAL',
        fecha: new Date().toISOString(),
        codigoRespuesta: respuesta.codigoRespuesta,
        descripcionRespuesta: respuesta.descripcionRespuesta,
        identificador: respuesta.identificador,
        csv: respuesta.csv,
        dryRun,
      }
    } else if (operacion.includes('Expediente') || operacion.includes('expediente')) {
      host.insideUltimoEnvio = {
        expedienteId: host.idExpediente,
        operacion,
        estadoEnvio: estadoFila,
        estadoResumen: estadoFila,
        fecha: new Date().toISOString(),
        codigoRespuesta: respuesta.codigoRespuesta,
        descripcionRespuesta: respuesta.descripcionRespuesta,
        identificador: respuesta.identificador,
        csv: respuesta.csv,
        dryRun,
      }
    }

    this.actualizarEstadoEnvio(host);
    this.notificationService.success({
      title: titulo,
      html: `
        ${this.etiquetaDryRun(host.insideDryRun)}
        <p><strong>Código:</strong> ${respuesta.codigoRespuesta ?? '-'}</p>
        <p><strong>Descripción:</strong> ${respuesta.descripcionRespuesta ?? '-'}</p>
        ${respuesta.identificador ? `<p><strong>Identificador:</strong> ${respuesta.identificador}</p>` : ''}
        ${respuesta.csv ? `<p><strong>CSV:</strong> ${respuesta.csv}</p>` : ''}
        ${respuesta.codigoEnvioATEA ? `<p><strong>ATEA:</strong> ${respuesta.codigoEnvioATEA}</p>` : ''}
      `,
    });
  }

  private mostrarError(host: EditaExpedienteInsideHost, error: Error): void {
    host.insideEnviando = false;
    this.notificationService.error({ title: 'Error INSIDE', text: error?.message ?? 'No se pudo completar la operación.' });
  }
}
