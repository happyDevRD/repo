import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalTriggerDirective } from '../core/directives/modal-trigger.directive';
import { ModalDismissDirective } from '../core/directives/modal-dismiss.directive';

const UI_LIB_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgxPaginationModule,
  jqxGridModule,
  PdfViewerModule,
  NgxCurrencyDirective,
  ModalTriggerDirective,
  ModalDismissDirective,
];

@NgModule({
  imports: UI_LIB_IMPORTS,
  exports: UI_LIB_IMPORTS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibsModule {}
