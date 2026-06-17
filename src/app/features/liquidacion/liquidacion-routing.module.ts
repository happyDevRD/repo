import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LiquidacionListComponent} from "./components/liquidacion-list/liquidacion-list.component";
import {LiquidacionFormComponent} from "./components/liquidacion-form/liquidacion-form.component";

const routes: Routes = [
  { path: 'form',           component: LiquidacionFormComponent },
  { path: 'list/:idExped',  component: LiquidacionListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionRoutingModule { }
