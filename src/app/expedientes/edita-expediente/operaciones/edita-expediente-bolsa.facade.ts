import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  sourceTareasTramite: unknown;
  refrescoSourceTareasTramite(id: number): void;
}

export interface VerBolsaCrearHost {
  verTareasdelTramite: boolean;
  verformnuevatarea: boolean;
  verlistadotramitadores: boolean;
  nuevotramitador: boolean;
  verlistadotareas: boolean;
  verEditartareatramite: boolean;
  verNuevaNotifi: boolean;
  verGenerarSalida: boolean;
  verInsertarBolsa: boolean;
}

@Injectable()
export class EditaExpedienteBolsaFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
  ) {}

  limpiarFormularioBolsa(host: EditaExpedienteBolsaHost): void {
    host.insertabolsacrear = new InsertaBolsaCrear();
  }

  clickAtrasBolsaCrear(host: EditaExpedienteBolsaHost): void {
    host.verInsertarBolsa = false;
    this.limpiarFormularioBolsa(host);
  }

  mostrarFormularioBolsa(host: VerBolsaCrearHost): void {
    host.verTareasdelTramite = false;
    host.verformnuevatarea = false;
    host.verlistadotramitadores = false;
    host.nuevotramitador = false;
    host.verlistadotareas = false;
    host.verEditartareatramite = false;
    host.verNuevaNotifi = false;
    host.verGenerarSalida = false;
    host.verInsertarBolsa = true;
  }

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response == null) {
            this.notificationService.saveSuccess('Propuesta de resolución');
            this.limpiarFormularioBolsa(host);
            host.verTareasdelTramite = true;
            host.verInsertarBolsa = false;
            host.refrescoSourceTareasTramite(host.idTramite);
          }
        },
        error: (response: HttpErrorResponse) => {
          if (response.status === 500) {
            this.notificationService.error('No se ha generado la propuesta de resolución.');
            this.limpiarFormularioBolsa(host);
            return;
          }
          this.notificationService.saveSuccess('Propuesta de resolución');
          this.limpiarFormularioBolsa(host);
        },
      });
  }
}
