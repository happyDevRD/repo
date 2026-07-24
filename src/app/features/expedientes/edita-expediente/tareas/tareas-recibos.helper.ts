import { ChangeDetectorRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ReciboCabeceraDto } from '../../../../core/models/recibo-cabecera.dto'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { IflowGridComponent } from '../../../../shared/components/iflow-grid/iflow-grid.component'

export const RECIBOS_GRID_DATA_FIELDS = [
  { name: 'ejeRecib', type: 'number' },
  { name: 'numRecib', type: 'number' },
  { name: 'nomPadro', type: 'string' },
  { name: 'desImpue', type: 'string' },
  { name: 'fecRecib', type: 'date', dateformat: 'yyyy-MM-dd' },
  { name: 'impRecib', type: 'number' },
]

export function totalRendererRecibos(
  row?: number,
  columnfield?: string,
  value?: any,
  _defaulthtml?: string,
  _columnproperties?: any,
  _rowdata?: any,
): string {
  if (value === null || value === undefined) {
    return `<div style="text-align: right; margin-top: 4px;">€ 0.00</div>`
  }
  const num = Number(value)
  return `<div style="text-align: right; margin-top: 4px;">${num.toFixed(2)} €</div>`
}

export interface RecibosPendientesHost {
  introValorConsulta: string
  /** Fuente/adaptador jqxGrid (tipos del widget son laxos). */
  sourceRecibos: any
  dataAdapter: any
  gridRecibos?: IflowGridComponent
  cdr: ChangeDetectorRef
}

const getModalManager = (): ModalManagerService | null => ModalManagerService.getInstance()

export function cargarRecibosPendientes(
  host: RecibosPendientesHost,
  http: HttpClient,
  notificationService: NotificationService,
): Observable<ReciboCabeceraDto[]> {
  if (!host.introValorConsulta) {
    return of([])
  }

  const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${host.introValorConsulta}`
  return http.get<ReciboCabeceraDto[]>(url).pipe(
    tap((data) => {
      const modalManager = getModalManager()

      if (!data || data.length === 0) {
        notificationService.info({
          title: 'Sin resultados',
          text: 'No se encontraron recibos pendientes de pago para el DNI ingresado.',
        })
        modalManager?.closeModal('recibosPendientesModal')
        return
      }

      host.sourceRecibos = {
        localdata: data,
        datatype: 'array',
        datafields: RECIBOS_GRID_DATA_FIELDS,
      }
      host.dataAdapter = new jqx.dataAdapter(host.sourceRecibos)
      host.cdr.detectChanges()

      // Tras bind del iflow-grid, abrir cuando el DOM del modal pueda medir el grid
      window.setTimeout(() => modalManager?.openModal('recibosPendientesModal'), 100)
    }),
    catchError((error) => {
      notificationService.error({
        title: 'Error',
        text: error.error?.message,
      })
      return throwError(() => error)
    }),
  )
}