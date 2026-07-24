import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from './layout.module'
import { UiLibsModule } from './ui-libs.module'
import { SharedPipesModule } from './pipes/shared-pipes.module'
import { ModalShellComponent } from './components/modal-shell/modal-shell.component'
import { ModalActionBarComponent } from './components/modal-action-bar/modal-action-bar.component'
import { IflowGridComponent } from './components/iflow-grid/iflow-grid.component'

/** Layout + librerías UI + pipes compartidos para módulos lazy de features. */
@NgModule({
  declarations: [ModalShellComponent, ModalActionBarComponent, IflowGridComponent],
  imports: [CommonModule, LayoutModule, UiLibsModule, SharedPipesModule],
  exports: [
    ModalShellComponent,
    ModalActionBarComponent,
    IflowGridComponent,
    LayoutModule,
    UiLibsModule,
    SharedPipesModule,
  ],
})
export class SharedModule {}
