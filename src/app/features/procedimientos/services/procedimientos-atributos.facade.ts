import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { AtributosCrear } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { clearFormValidation } from '../../../core/helper/bootstrap-form.helper';

export interface ProcedimientosAtributosHost {
  atributoscrear: AtributosCrear;
  idprocedi: number;
  idProcedi: number;
  idAtrib: unknown;
  idGrupo: unknown;
  etiGruAtrib: unknown;
  nuevaetiqueta?: string;
  veoborraratributo: boolean;
  disabledAtrib: boolean;
  actualizaSourceAtributo(id: number): void;
}

@Injectable()
export class ProcedimientosAtributosFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) {}

  limpiarFormularios(): void {
    clearFormValidation('formEditarAtributos');
    clearFormValidation('formNuevosAtributos');
  }

  limpiarAtributos(host: ProcedimientosAtributosHost): void {
    host.atributoscrear = new AtributosCrear();
    this.limpiarFormularios();
  }

  crear(host: ProcedimientosAtributosHost): void {
    if (host.atributoscrear.requerido != 1) {
      host.atributoscrear.requerido = 0;
    }

    this.procedimientoService.crearAtributo(host.atributoscrear, host.idProcedi).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.saveSuccess('Atributo');
        this.modalManagerService.closeModal('NAtributosModal');
        host.actualizaSourceAtributo(host.idProcedi);
        host.atributoscrear = new AtributosCrear();
      },
      error: (err) => {
        this.notificationService.error('Error en el alta del Atributo: ' + err.error.message);
        this.modalManagerService.keepModalOpen('NAtributosModal');
      },
    });
  }

  editar(host: ProcedimientosAtributosHost): void {
    host.atributoscrear.etiGruAtrib = host.etiGruAtrib as string;
    if (!host.atributoscrear.requerido) {
      host.atributoscrear.requerido = 0;
    }

    if (!host.nuevaetiqueta) {
      host.nuevaetiqueta = host.etiGruAtrib as string;
    } else {
      host.atributoscrear.etiGruAtrib = host.nuevaetiqueta;
    }

    this.procedimientoService
      .modificaAtributo(host.atributoscrear, host.idAtrib, host.idGrupo, host.etiGruAtrib)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.saveSuccess('Atributo');
          this.modalManagerService.closeModal('EditoAtributosModal');
          host.actualizaSourceAtributo(host.idprocedi);
          host.atributoscrear = new AtributosCrear();
        },
        error: (err) => {
          this.notificationService.error('No se pudo modificar el Atributo: ' + err.error.message);
          this.modalManagerService.keepModalOpen('EditoAtributosModal');
        },
      });
  }

  eliminar(host: ProcedimientosAtributosHost): void {
    this.notificationService.confirm({
      title: '¿Está seguro?',
      text: 'Eliminar Atributo',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.procedimientoService.deleteAtributo(host.idGrupo, host.etiGruAtrib).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          host.disabledAtrib = false;
          host.actualizaSourceAtributo(host.idprocedi);
          this.notificationService.success({ title: 'Atributo Eliminado!' });
          host.veoborraratributo = false;
          host.atributoscrear = new AtributosCrear();
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.warning(err.error.message);
          host.veoborraratributo = false;
          host.disabledAtrib = false;
          host.atributoscrear = new AtributosCrear();
        },
      });
    });
  }
}
