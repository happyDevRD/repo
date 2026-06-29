import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ReciboCabeceraDto } from '../../../core/models/recibo-cabecera.dto';
import { ModalManagerService } from '../../../core/service/modal-manager.service';

export const RECIBOS_GRID_DATA_FIELDS = [
  { name: 'ejeRecib', type: 'number' },
  { name: 'numRecib', type: 'number' },
  { name: 'nomPadro', type: 'string' },
  { name: 'desImpue', type: 'string' },
  { name: 'fecRecib', type: 'date', dateformat: 'yyyy-MM-dd' },
  { name: 'impRecib', type: 'number' },
];

export function totalRendererRecibos(_row: number, _column: string, value: unknown): string {
  if (value === null || value === undefined) {
    return `<div style="text-align: right; margin-top: 4px;">€ 0.00</div>`;
  }
  const num = Number(value);
  return `<div style="text-align: right; margin-top: 4px;">${num.toFixed(2)} €</div>`;
}

export interface RecibosPendientesHost {
  introValorConsulta: string;
  sourceRecibos: unknown;
  dataAdapter: unknown;
  gridRecibos?: ElementRef;
  cdr: ChangeDetectorRef;
}

const getModalManager = (): ModalManagerService | null => ModalManagerService.getInstance();

export function cargarRecibosPendientes(
  host: RecibosPendientesHost,
  http: HttpClient,
): Observable<ReciboCabeceraDto[]> {
  if (!host.introValorConsulta) {
    return of([]);
  }

  const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${host.introValorConsulta}`;
  return http.get<ReciboCabeceraDto[]>(url).pipe(
    tap((data) => {
      const modalManager = getModalManager();

      if (!data || data.length === 0) {
        Swal.fire({
          title: 'Sin resultados',
          text: 'No se encontraron recibos pendientes de pago para el DNI ingresado.',
          icon: 'info',
        });
        modalManager?.closeModal('recibosPendientesModal');
        return;
      }

      host.sourceRecibos = {
        localdata: data,
        datatype: 'array',
        datafields: RECIBOS_GRID_DATA_FIELDS,
      };
      host.dataAdapter = new jqx.dataAdapter(host.sourceRecibos);
      host.cdr.detectChanges();

      const abrirModal = () => {
        modalManager?.openModal('recibosPendientesModal');
      };

      if (host.gridRecibos?.nativeElement) {
        host.gridRecibos.nativeElement.on('bindingComplete', abrirModal);
      } else {
        abrirModal();
      }
    }),
    catchError((error) => {
      Swal.fire({
        title: 'Error',
        text: error.error?.message,
        icon: 'error',
      });
      return throwError(() => error);
    }),
  );
}
