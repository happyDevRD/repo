import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Atributosleer } from '../expedientes';
import { ExpedientesService } from '../expedientes.service';
import { NotificationService } from '../../../core/service/notification.service';
import { ModalManagerService } from '../../../core/service/modal-manager.service';

const MODAL_ATRIBUTOS = 'NAtributosModal2';
// Solo FECHACORTA tenía <input type="date"> en el formulario dinámico original;
// el resto de tipos (incl. FECHALARGA/FECHAHORA) caían en el texto por defecto.
const TIPOS_FECHA = ['FECHACORTA'];
const TIPOS_NUMERICOS = ['NUMERO', 'COEFICIENTE', 'MONEDA'];

/** Copia editable de un atributo: guarda el valor original (para saber si cambió) y,
 * si es de tipo fecha, un valor aparte en formato yyyy-MM-dd para el `<input type="date">`
 * (el valor real que maneja el backend es dd/MM/yyyy). */
export interface AtributoEditable extends Atributosleer {
  valorOriginal: string;
  fechaInput?: string;
}

export interface ExpedientesAtributosHost {
  idExpediente: number | string;
  idexpediente?: number;
  atributosleer: Atributosleer[];
  atributosEditables: AtributoEditable[];
  veoAtributos: boolean;
  cargandoAtributos: boolean;
  guardandoAtributos: boolean;
}

export const esTipoFecha = (tipo: unknown): boolean => TIPOS_FECHA.includes(String(tipo ?? ''));
export const esTipoNumerico = (tipo: unknown): boolean => TIPOS_NUMERICOS.includes(String(tipo ?? ''));

const ddmmyyyyAIso = (valor: string): string | undefined => {
  const partes = valor.split('/');
  if (partes.length !== 3) {
    return undefined;
  }
  const [dia, mes, anio] = partes;
  return `${anio}-${mes}-${dia}`;
};

const isoADdmmyyyy = (valor: string): string => {
  const partes = valor.split('-');
  if (partes.length !== 3) {
    return valor;
  }
  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
};

const toEditable = (attr: Atributosleer): AtributoEditable => {
  const valor = String(attr.valor ?? '');
  const editable: AtributoEditable = { ...attr, valorOriginal: valor };
  if (esTipoFecha(attr.tipo) && valor) {
    editable.fechaInput = ddmmyyyyAIso(valor);
  }
  return editable;
};

/**
 * Encapsula la gestión de atributos de expediente (listar, editar valores, borrar).
 * Antes generaba los campos editables manipulando el DOM directamente
 * (`document.getElementById('divform')`, al margen de Angular); ahora es un
 * formulario normal sobre una copia editable de la lista.
 */
@Injectable()
export class ExpedientesAtributosFacade {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly modalManagerService: ModalManagerService,
  ) { }

  abrirModal(host: ExpedientesAtributosHost): void {
    if (!host.idExpediente) {
      this.notificationService.warning('Seleccione un expediente');
      return;
    }

    host.veoAtributos = true;
    this.modalManagerService.openModal(MODAL_ATRIBUTOS);
    this.listar(host);
  }

  listar(host: ExpedientesAtributosHost): void {
    host.cargandoAtributos = true;

    this.expedientesService.getAtributosListar(host.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (atributosleer) => {
        host.atributosleer = atributosleer ?? [];
        host.atributosEditables = host.atributosleer.map(toEditable);
        host.cargandoAtributos = false;
      },
      error: (err: HttpErrorResponse) => {
        host.atributosleer = [];
        host.atributosEditables = [];
        host.cargandoAtributos = false;
        if (err.status !== 404) {
          this.notificationService.warning(err.error?.message ?? 'No se pudieron cargar los atributos');
        }
      },
    });
  }

  /** Setter del `<input type="date">`: guarda el valor iso y lo refleja también en `valor` (dd/MM/yyyy). */
  actualizarFecha(attr: AtributoEditable, isoValue: string): void {
    attr.fechaInput = isoValue;
    attr.valor = isoValue ? isoADdmmyyyy(isoValue) : '';
  }

  guardar(host: ExpedientesAtributosHost): void {
    const cambios = (host.atributosEditables ?? []).filter(
      (attr) => String(attr.valor ?? '') !== attr.valorOriginal,
    );

    if (cambios.length === 0) {
      this.notificationService.info('No hay cambios que guardar');
      return;
    }

    host.guardandoAtributos = true;
    const peticiones = cambios.map((attr) =>
      this.expedientesService.modificaAtributo(
        { valor: String(attr.valor ?? ''), idGrupo: attr.idGrupo, etiGruAtrib: attr.etiGruAtrib },
        host.idexpediente,
      ),
    );

    forkJoin(peticiones).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.notificationService.success('Atributos guardados');
        host.guardandoAtributos = false;
        this.listar(host);
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.warning(err.error?.message ?? 'No se pudieron guardar los atributos');
        host.guardandoAtributos = false;
        this.listar(host);
      },
    });
  }

  eliminar(host: ExpedientesAtributosHost, attr: AtributoEditable): void {
    this.notificationService.confirmDelete(`Eliminar el atributo "${attr.desGruAtrib}"`).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.expedientesService.deleteAtributo(attr.idGrupo, attr.etiGruAtrib, host.idExpediente).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => {
          this.notificationService.success('Atributo eliminado');
          this.listar(host);
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.warning(err.error?.message ?? 'No se pudo eliminar el atributo');
        },
      });
    });
  }

  cerrarModal(host: ExpedientesAtributosHost): void {
    host.atributosleer = [];
    host.atributosEditables = [];
    host.cargandoAtributos = false;
    host.guardandoAtributos = false;
  }
}
