import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
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
  limpiaGenerarSalida(): void;
}

@Injectable()
export class EditaExpedienteSalidaFacade {
  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly tareasFacade: EditaExpedienteTareasFacade,
  ) {}

  prepararCrearGenerarSalida(host: EditaExpedienteSalidaHost): void {
    host.creargenerarsalida.ejeExped = host.verExpediente.ejercicio;
    host.creargenerarsalida.numExped = host.verExpediente.numero;
    host.creargenerarsalida.usuContr = host.usuContrl!;

    if (host.nunRegisTarea) {
      Swal.fire({
        title: `Esta tarea ya tiene generada un registro de salida número : ${host.nunRegisTarea}`,
        text: '¿Quiere Generar uno nuevo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
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
      Swal.fire('Debe rellenar todos los campos obligatorios.');
    }

    host.creargenerarsalida = new CrearGenerarSalida();
    host.temadocumentolistar = new TemaDocumentoListar[0];
  }
}
