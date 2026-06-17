import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiquidacionListComponent } from './components/liquidacion-list/liquidacion-list.component';
import {jqxGridModule} from "jqwidgets-ng/jqxgrid";

@NgModule({
  declarations: [
    LiquidacionListComponent
  ],
  imports: [
    CommonModule,
    jqxGridModule
  ]
})
export class LiquidacionModule { }
