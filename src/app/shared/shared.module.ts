import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from './layout.module'
import { UiLibsModule } from './ui-libs.module'
import { SharedPipesModule } from './pipes/shared-pipes.module'
import { ModalShellComponent } from './components/modal-shell/modal-shell.component'
import { ModalActionBarComponent } from './components/modal-action-bar/modal-action-bar.component'
import { IflowGridComponent } from './components/iflow-grid/iflow-grid.component'
import { BackButtonComponent } from './components/back-button/back-button.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'

/** Layout + librerías UI + pipes compartidos para módulos lazy de features. */
@NgModule({
  declarations: [
    ModalShellComponent,
    ModalActionBarComponent,
    IflowGridComponent,
    BackButtonComponent,
    PageHeaderComponent,
  ],
  imports: [CommonModule, LayoutModule, UiLibsModule, SharedPipesModule],
  exports: [
    ModalShellComponent,
    ModalActionBarComponent,
    IflowGridComponent,
    BackButtonComponent,
    PageHeaderComponent,
    LayoutModule,
    UiLibsModule,
    SharedPipesModule,
  ],
})
export class SharedModule {}
