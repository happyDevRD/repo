import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from '../nav/nav.component';
import { HeadersComponent } from '../headers/headers.component';
import { AppShellComponent } from '../layout/app-shell.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const LAYOUT_DECLARATIONS = [
  NavComponent,
  HeadersComponent,
  AppShellComponent,
  AccessDeniedComponent,
];

@NgModule({
  declarations: LAYOUT_DECLARATIONS,
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, ...LAYOUT_DECLARATIONS],
})
export class LayoutModule {}
