import { ChangeDetectorRef, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Atributosleer } from '../expedientes';
import { ExpedientesService } from '../expedientes.service';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { ExpedientesGridFacade, ExpedientesGridHost } from './expedientes-grid.facade';

const MODAL_ATRIBUTOS = 'NAtributosModal2';

export interface ExpedientesAtributosHost extends ExpedientesGridHost {
  idExpediente: number | string;
  idexpediente?: number;
  atributosleer: Atributosleer[];
  veoAtributos: boolean;
  veoBorrarAtributo: boolean;
  idGrupo: unknown;
  etiGruAtrib: unknown;
}

/**
 * Encapsula la gestión de atributos de expediente (listar, ver, crear inputs
 * dinámicos, modificar y borrar) que antes vivía directamente en ExpedientesComponent.
 */
@Injectable()
export class ExpedientesAtributosFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
    private readonly gridFacade: ExpedientesGridFacade,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  marcar(host: ExpedientesAtributosHost, event: any): void {
    const rowData = event.args.row.bounddata
    host.veoBorrarAtributo = true
    host.idGrupo = rowData.idGrupo
    host.etiGruAtrib = rowData.etiGruAtrib
  }

  abrirModal(host: ExpedientesAtributosHost): void {
    if (!host.idExpediente) {
      this.notificationService.warning('Seleccione un expediente');
      return;
    }

    this.expedientesService.getAtributosListar(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (atributosleer) => {
        host.atributosleer = atributosleer ?? [];
        host.veoAtributos = true;
        host.veoBorrarAtributo = false;
        this.refrescarSource(host, host.atributosleer);
        this.cdr.detectChanges();
        this.modalManagerService.openModal(MODAL_ATRIBUTOS);
        this.programarRefrescoModal(host);
      },
      error: (err: HttpErrorResponse) => {
        host.atributosleer = [];
        host.veoAtributos = true;
        this.refrescarSource(host, []);
        this.cdr.detectChanges();
        this.modalManagerService.openModal(MODAL_ATRIBUTOS);
        this.programarRefrescoModal(host);
        this.notificationService.warning(err.error?.message ?? 'No se pudieron cargar los atributos');
      },
    });
  }

  listar(host: ExpedientesAtributosHost): void {
    if (!host.idExpediente) {
      return;
    }

    this.expedientesService.getAtributosListar(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (atributosleer) => {
        host.atributosleer = atributosleer ?? [];
        this.refrescarSource(host, host.atributosleer);
        this.cdr.detectChanges();
        this.refrescarContenidoModal(host);
      },
      error: () => {
        host.atributosleer = [];
        this.refrescarSource(host, []);
        this.cdr.detectChanges();
        this.refrescarContenidoModal(host);
      },
    });
  }

  eliminar(host: ExpedientesAtributosHost): void {
    this.notificationService.confirmDelete('Eliminar Atributo').then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteAtributo(host.idGrupo, host.etiGruAtrib, host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.listar(host);
          this.notificationService.success('Atributo eliminado');
          host.veoBorrarAtributo = false;
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.warning(err.error.message);
        },
      });
    });
  }

  enviar(host: ExpedientesAtributosHost): void {
    (host.atributosleer ?? []).forEach((attr, index) => {
      const valor = document.getElementById(`nuevoinput${index}`) as HTMLInputElement | null;
      if (!valor) {
        return;
      }

      const nuevoValor = {
        valor: valor.value,
        idGrupo: attr.idGrupo,
        etiGruAtrib: attr.etiGruAtrib,
      };

      this.expedientesService.modificaAtributo(nuevoValor, host.idexpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (response) => {
          if (response.status) {
            this.limpiarFormulario(host);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.warning(error.error.message);
        },
      });
    });

    setTimeout(() => this.limpiarFormulario(host), 1000);
  }

  limpiarFormulario(host: ExpedientesAtributosHost): void {
    const contenedor = document.getElementById('divform');
    if (contenedor) {
      contenedor.innerHTML = '';
    }
    host.veoBorrarAtributo = false;
  }

  generarInputsDinamicos(host: ExpedientesAtributosHost): void {
    const contenedor = document.getElementById('divform');
    if (!contenedor) {
      return;
    }

    contenedor.innerHTML = '';

    (host.atributosleer ?? []).forEach((attr, idx) => {
      const label = document.createElement('label');
      label.htmlFor = `nuevoinput${idx}`;
      label.className = 'form-label';
      label.textContent = attr.etiGruAtrib.toString();
      const input = document.createElement('input');
      input.id = `nuevoinput${idx}`;
      input.className = 'form-control mb-3';
      const max = attr.longitud || 255;
      input.setAttribute('maxlength', max.toString());

      switch (attr.tipo) {
        case 'NUMERO':
        case 'COEFICIENTE':
        case 'MONEDA':
          input.type = 'text';
          input.setAttribute('inputmode', 'numeric');
          input.setAttribute('pattern', '[0-9]*');
          break;
        case 'FECHACORTA':
          input.type = 'date';
          break;
        default:
          input.type = 'text';
      }

      contenedor.appendChild(label);
      contenedor.appendChild(input);

      if (attr.valor != null && attr.valor !== '') {
        if (attr.tipo === 'FECHACORTA' && attr.valor.toString().includes('/')) {
          const partes = attr.valor.toString().split('/');
          if (partes.length === 3) {
            input.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
          }
        } else {
          input.value = attr.valor.toString();
        }
      }
    });
  }

  private refrescarContenidoModal(host: ExpedientesAtributosHost): void {
    if (this.modalManagerService.isModalOpen(MODAL_ATRIBUTOS)) {
      window.setTimeout(() => {
        this.generarInputsDinamicos(host);
        this.gridFacade.refreshGridAtributosExp(host);
      }, 100);
      return;
    }

    this.programarRefrescoModal(host);
  }

  private programarRefrescoModal(host: ExpedientesAtributosHost): void {
    const modalEl = document.getElementById(MODAL_ATRIBUTOS);
    const refrescar = (): void => {
      this.generarInputsDinamicos(host);
      window.setTimeout(() => this.gridFacade.refreshGridAtributosExp(host), 60);
      window.setTimeout(() => this.gridFacade.refreshGridAtributosExp(host), 250);
      window.setTimeout(() => this.gridFacade.refreshGridAtributosExp(host), 500);
    };

    if (!modalEl) {
      refrescar();
      return;
    }

    modalEl.addEventListener('shown.bs.modal', refrescar, { once: true });
  }

  private refrescarSource(host: ExpedientesAtributosHost, localData?: Atributosleer[]): void {
    this.gridFacade.refrescarSourceAtributo(host, localData);
  }
}
