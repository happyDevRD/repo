import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearGenerarSalida, TemaDocumentoListar, VerExpediente } from '../../expedientes';
import { NotificationService } from '../../../core/service/notification.service';
import { ExpedientesService } from '../../expedientes.service';
import { EditaExpedienteTareasFacade } from '../tareas/edita-expediente-tareas.facade';

export interface EditaExpedienteSalidaHost {
  creargenerarsalida: CrearGenerarSalida;
  temadocumentolistar: TemaDocumentoListar[];
  verExpediente: VerExpediente;
  usuContrl: string | null;
  numeroArchivo: number;
  idTarea: number;
  idTramite: number;
  nunRegisTarea: unknown;
  identificadorGenerarSalida: string;
  sourceTareasTramite: unknown;
  verTareasdelTramite: boolean;
  verGenerarSalida: boolean;
}

@Injectable()
export class EditaExpedienteSalidaFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
  ) {}

  limpiarFormularioGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida = new CrearGenerarSalida();
    host.temadocumentolistar = new TemaDocumentoListar[0];
  }

  clickAtrasGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.verTareasdelTramite = true;
    host.verGenerarSalida = false;
    host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite);
    this.limpiarFormularioGenerarSalida(host);
  }

  prepararCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida.ejeExped = host.verExpediente.ejercicio;
    host.creargenerarsalida.numExped = host.verExpediente.numero;
    host.creargenerarsalida.usuContr = host.usuContrl!;

    if (host.nunRegisTarea) {
      this.notificationService.confirm({
        title: `Esta tarea ya tiene generada un registro de salida número : ${host.nunRegisTarea}`,
        text: '¿Quiere Generar uno nuevo?',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(() => this.ejecutarCrearGenerarSalida(host));
      return;
    }

    this.ejecutarCrearGenerarSalida(host);
  }

  ejecutarCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    if (
      host.creargenerarsalida.codTema ||
      host.creargenerarsalida.extracto ||
      host.creargenerarsalida.observaciones
    ) {
      this.expedientesService
        .crearGenerarSalida(
          host.creargenerarsalida,
          host.verExpediente.personaEntidad.idPerso,
          host.verExpediente.personaEntidad.idHisPerso,
          host.numeroArchivo,
          host.idTarea,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {},
          error: (err: HttpErrorResponse) => {
            host.identificadorGenerarSalida = err.error?.text;
            if (err.status === 201) {
              this.notificationService.saveSuccess(`Registro de salida: ${host.identificadorGenerarSalida}`);
              host.sourceTareasTramite = this.tareasFacade.createGridAdapter(host.idTramite, {
                sortColumn: 'numero',
                sortDirection: 'desc',
              });
            }
          },
        });
    } else {
      this.notificationService.warning('Debe rellenar todos los campos obligatorios.');
    }

    this.limpiarFormularioGenerarSalida(host);
  }
}
