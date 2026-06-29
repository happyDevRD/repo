import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InsertaBolsaCrear, VerExpediente } from '../../expedientes';
import { NotificationService } from '../../../core/service/notification.service';
import { ExpedientesService } from '../../expedientes.service';

export interface EditaExpedienteBolsaHost {
  insertabolsacrear: InsertaBolsaCrear;
  usuContrl: string | null;
  idOrgElemen: string | null;
  ejerNumExpedi: string;
  numeroArchivo: number;
  idTarea: number;
  verExpediente: VerExpediente;
  verTareasdelTramite: boolean;
  verInsertarBolsa: boolean;
  idTramite: number;
  limpiaInsertatBolsa(): void;
  refrescoSourceTareasTramite(id: number): void;
}

@Injectable()
export class EditaExpedienteBolsaFacade {
  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
  ) {}

  crearInsertaBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear.usuContr = host.usuContrl!;
    host.insertabolsacrear.idOrgEleme = host.idOrgElemen!;
    host.insertabolsacrear.refExped = host.ejerNumExpedi;
    host.insertabolsacrear.estado = 0;

    const camposObligatorios =
      host.insertabolsacrear.fecAlta &&
      host.insertabolsacrear.fecPrefe &&
      host.insertabolsacrear.fecMaxResol &&
      host.insertabolsacrear.prioridad &&
      host.insertabolsacrear.tipSesion &&
      host.insertabolsacrear.tipPunto;

    if (!camposObligatorios) {
      this.notificationService.incompleteFields();
      return;
    }

    if (!host.numeroArchivo) {
      this.notificationService.error(
        'Esta tarea no tiene archivo asociado por lo que no se puede generar la propuesta.',
      );
      return;
    }

    this.expedientesService
      .crearInsertaBolsa(
        host.insertabolsacrear,
        host.verExpediente.personaEntidad.idPerso,
        host.verExpediente.personaEntidad.idHisPerso,
        host.numeroArchivo,
        host.idTarea,
      )
      .subscribe({
        next: (response) => {
          if (response == null) {
            this.notificationService.saveSuccess('Propuesta de resolución');
            host.limpiaInsertatBolsa();
            host.verTareasdelTramite = true;
            host.verInsertarBolsa = false;
            host.refrescoSourceTareasTramite(host.idTramite);
          }
        },
        error: (response: HttpErrorResponse) => {
          if (response.status === 500) {
            this.notificationService.error('No se ha generado la propuesta de resolución.');
            host.limpiaInsertatBolsa();
            return;
          }
          this.notificationService.saveSuccess('Propuesta de resolución');
          host.limpiaInsertatBolsa();
        },
      });
  }
}
