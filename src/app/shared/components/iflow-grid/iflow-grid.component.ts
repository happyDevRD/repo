import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid'
import { GridRadioSelector } from 'src/app/core/helper/grid-radio-selector'
import { JqxGridRowEvent } from 'src/app/core/helper/jqx-grid-event.model'
import { IFLOW_GRID_DEFAULTS } from './iflow-grid.defaults'
import {
  IflowGridColumns,
  IflowGridLocalization,
  IflowGridSource,
} from './iflow-grid.types'

export type {
  IflowGridColumn,
  IflowGridColumns,
  IflowGridLocalization,
  IflowGridSource,
} from './iflow-grid.types'

export type IflowGridSelectionMode = 'none' | 'radio' | 'checkbox'

@Component({
  selector: 'app-iflow-grid',
  templateUrl: './iflow-grid.component.html',
  styleUrls: ['./iflow-grid.component.css'],
  host: { class: 'iflow-grid' },
})
export class IflowGridComponent implements OnInit {
  @Input() columns: IflowGridColumns = []
  @Input() source: IflowGridSource
  @Input() width: string | number = IFLOW_GRID_DEFAULTS.width
  @Input() height: string | number | null = null
  @Input() pagesize = IFLOW_GRID_DEFAULTS.pagesize
  @Input() pagesizeoptions: string[] | null = null
  @Input() pageable = IFLOW_GRID_DEFAULTS.pageable
  @Input() sortable = IFLOW_GRID_DEFAULTS.sortable
  @Input() filterable = IFLOW_GRID_DEFAULTS.filterable
  @Input() altrows = IFLOW_GRID_DEFAULTS.altrows
  @Input() autoheight = IFLOW_GRID_DEFAULTS.autoheight
  @Input() columnsautoresize = IFLOW_GRID_DEFAULTS.columnsautoresize
  @Input() columnsresize = IFLOW_GRID_DEFAULTS.columnsresize
  @Input() localization: IflowGridLocalization = IFLOW_GRID_DEFAULTS.localization
  @Input() theme: string | null = null
  /** Nativo jqx. Nunca null: createInstance hace selectionmode.toLowerCase() si hay datafields. */
  @Input() selectionmode: string | null = IFLOW_GRID_DEFAULTS.selectionmode
  /** Nativo jqx. Nunca null: createInstance hace editmode.toLowerCase() si hay datafields. */
  @Input() editmode = IFLOW_GRID_DEFAULTS.editmode
  @Input() autoloadstate = false
  @Input() withContainer = false
  @Input() gridId: string | null = null
  @Input() gridClass = ''
  @Input() selectionMode: IflowGridSelectionMode = 'none'
  @Input() radioName = ''
  @Input() radioTitle = 'Seleccionar fila'

  @Output() rowClick = new EventEmitter<JqxGridRowEvent>()
  @Output() rowDoubleClick = new EventEmitter<JqxGridRowEvent>()
  @Output() bindingComplete = new EventEmitter<unknown>()

  @ViewChild('innerGrid') innerGrid?: jqxGridComponent
  readonly defaultLocalization = IFLOW_GRID_DEFAULTS.localization

  constructor(private readonly hostRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const host = this.hostRef.nativeElement
    const hostId = host?.id
    if (!this.gridId && hostId) {
      this.gridId = hostId
      return
    }
    if (this.gridId && !hostId) {
      host.id = this.gridId
    }
  }

  get resolvedLocalization(): IflowGridLocalization {
    return this.localization ?? this.defaultLocalization
  }

  /** Siempre string: null en options de jqx pisa el default y rompe toLowerCase. */
  get resolvedSelectionMode(): string {
    if (this.selectionMode === 'checkbox') {
      return 'checkbox'
    }
    if (this.selectionmode && this.selectionmode.length > 0) {
      return this.selectionmode
    }
    return IFLOW_GRID_DEFAULTS.selectionmode
  }

    /** Solo pasar height a jqx si es explicito. Si no, undefined (jqx usa default + autoheight). */
  get safeHeight(): string | number | null {
    if (this.height !== null && this.height !== undefined && this.height !== '') {
      return this.height as string | number
    }
    return null
  }

  get safePageSizeOptions(): (string | number)[] {
    return this.pagesizeoptions?.length
      ? this.pagesizeoptions
      : IFLOW_GRID_DEFAULTS.pagesizeoptions
  }

  getGrid(): jqxGridComponent | undefined {
    return this.innerGrid
  }

  handleRowClick(event: JqxGridRowEvent): void {
    if (this.selectionMode === 'radio' && this.radioName) {
      GridRadioSelector.handleRowClick(event as never, this.radioName)
    }
    this.rowClick.emit(event)
  }

  handleRowDoubleClick(event: JqxGridRowEvent): void {
    this.rowDoubleClick.emit(event)
  }

  private isWidgetReady(): boolean {
    const grid = this.innerGrid as any
    return !!(grid?.host)
  }

  private invoke(method: string, ...args: unknown[]): unknown {
    if (!this.isWidgetReady()) {
      return undefined
    }
    const grid = this.innerGrid as any
    try {
      return grid[method]?.(...args)
    } catch {
      return undefined
    }
  }

  refresh(): void {
    this.updatebounddata()
    this.invoke('refresh')
  }

  updatebounddata(mode?: string): void {
    if (mode !== undefined) {
      this.invoke('updatebounddata', mode)
      return
    }
    this.invoke('updatebounddata')
  }

  refreshdata(): void {
    this.invoke('refreshdata')
  }

  getrowdata(rowIndex: number): unknown {
    return this.invoke('getrowdata', rowIndex)
  }

  setSource(value: IflowGridSource): void {
    this.invoke('source', value)
  }

  autoresizecolumns(): void {
    this.invoke('autoresizecolumns')
  }

  setWidth(value: string | number): void {
    this.invoke('width', value)
  }

  getrows(): unknown[] {
    return (this.invoke('getrows') as unknown[]) ?? []
  }

  sortby(dataField: string, order: string): void {
    this.invoke('sortby', dataField, order)
  }

  selectRow(rowIndex: number): void {
    if (!this.isWidgetReady() || rowIndex < 0) {
      return
    }
    this.invoke('clearselection')
    this.invoke('selectrow', rowIndex)
    this.invoke('ensurerowvisible', rowIndex)
    if (this.selectionMode === 'radio' && this.radioName) {
      GridRadioSelector.updateRadioButton(this.radioName, rowIndex)
    }
  }

  clearselection(): void {
    this.invoke('clearselection')
    if (this.selectionMode === 'radio' && this.radioName) {
      GridRadioSelector.clearGridSelection(this.radioName)
    }
  }

  clearSelection(): void {
    this.clearselection()
  }

  getSelectedRowIndex(): number {
    if (this.selectionMode === 'radio' && this.radioName) {
      return GridRadioSelector.getSelectedRowIndex(this.radioName)
    }
    const index = this.invoke('getselectedrowindex')
    return typeof index === 'number' ? index : -1
  }
}