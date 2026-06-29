import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import { ModalManagerService } from '../../../core/service/modal-manager.service';

interface GridSourceOptions {
  dataType: string;
  dataFields: unknown[];
  localdata?: unknown[];
  url?: string;
  id?: string;
}

@Component({
  selector: 'app-dashboard-grid-modal',
  templateUrl: './dashboard-grid-modal.component.html',
  styleUrls: ['./dashboard-grid-modal.component.css'],
})
export class DashboardGridModalComponent {

  @Input() modalId!: string;
  @Input() title!: string;
  @Input() columns: any[] = [];
  @Input() gridMinWidth = 0;
  @Input() gridHeight = 400;

  @ViewChild('grid', { static: false }) grid?: jqxGridComponent;

  readonly localizationObject = jqxGrid_ES;
  source: any;
  recordCount: number | null = null;
  isEmpty = false;
  private sourceOptions: GridSourceOptions | null = null;

  constructor(
    private modalManager: ModalManagerService,
    private cdr: ChangeDetectorRef,
  ) {}

  initSource(dataFields: unknown[], localdata: unknown[] = []): void {
    this.sourceOptions = {
      dataType: 'json',
      dataFields,
      localdata,
      id: 'id',
    };
    this.source = new jqx.dataAdapter({ ...this.sourceOptions });
  }

  initRemoteSource(dataFields: unknown[], url: string): void {
    this.sourceOptions = {
      dataType: 'json',
      dataFields,
      url,
      id: 'id',
    };
    this.source = new jqx.dataAdapter({ ...this.sourceOptions });
  }

  async openWithData(data: unknown[]): Promise<number> {
    if (!this.sourceOptions) {
      return data.length;
    }

    this.source = new jqx.dataAdapter({
      ...this.sourceOptions,
      localdata: data,
    });
    this.recordCount = data.length;
    this.isEmpty = data.length === 0;
    this.cdr.detectChanges();
    this.modalManager.openModal(this.modalId);
    this.scheduleGridRefresh();
    return data.length;
  }

  async openRemote(url: string, dataFields: unknown[]): Promise<number> {
    this.initRemoteSource(dataFields, url);
    this.modalManager.openModal(this.modalId);
    this.scheduleGridRefresh();
    return 0;
  }

  close(): void {
    this.modalManager.closeModal(this.modalId);
    this.recordCount = null;
    this.isEmpty = false;
  }

  private scheduleGridRefresh(): void {
    const modalEl = document.getElementById(this.modalId);
    const refresh = (): void => {
      window.setTimeout(() => this.refreshGrid(), 60);
      window.setTimeout(() => this.refreshGrid(), 250);
      window.setTimeout(() => this.refreshGrid(), 500);
    };

    if (!modalEl) {
      refresh();
      return;
    }

    modalEl.addEventListener('shown.bs.modal', refresh, { once: true });
  }

  private refreshGrid(): void {
    if (!this.grid || !this.source || this.isEmpty) {
      return;
    }

    this.grid.source(this.source);
    this.grid.updatebounddata();
    this.grid.autoresizecolumns();
    this.grid.refresh();
  }
}
