import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalTriggerDirective } from '../core/directives/modal-trigger.directive';
import { ModalDismissDirective } from '../core/directives/modal-dismiss.directive';

const MATERIAL_MODULES = [
  MatSliderModule,
  MatButtonModule,
  MatStepperModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatMenuModule,
  MatDatepickerModule,
  MatGridListModule,
  MatExpansionModule,
  MatTableModule,
  MatSelectModule,
  MatProgressSpinnerModule,
];

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
  ...MATERIAL_MODULES,
];

@NgModule({
  imports: UI_LIB_IMPORTS,
  exports: UI_LIB_IMPORTS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibsModule {}
