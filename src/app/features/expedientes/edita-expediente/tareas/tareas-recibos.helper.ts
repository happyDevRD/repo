import { ChangeDetectorRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ReciboCabeceraDto } from '../../../../core/models/recibo-cabecera.dto'
import { ModalManagerService } from '../../../../core/service/modal-manager.service'
import { NotificationService } from '../../../../core/service/notification.service'
import { IflowGridComponent } from '../../../../shared/components/iflow-grid/iflow-grid.component'
import { IflowGridSource } from '../../../../shared/components/iflow-grid/iflow-grid.types'

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
  value?: unknown,
  _defaulthtml?: string,
  _columnproperties?: unknown,
  _rowdata?: unknown,
): string {
  if (value === null || value === undefined) {
    return `<div style="text-align: right; margin-top: 4px;">€ 0.00</div>`
  }
  const num = Number(value)
  return `<div style="text-align: right; margin-top: 4px;">${num.toFixed(2)} €</div>`
}

export interface RecibosPendientesHost {
  introValorConsulta: string
  sourceRecibos: IflowGridSource | null
  dataAdapter: IflowGridSource | null
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