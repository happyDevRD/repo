import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from './layout.module'
import { UiLibsModule } from './ui-libs.module'
import { SharedPipesModule } from './pipes/shared-pipes.module'
import { ModalShellComponent } from './components/modal-shell/modal-shell.component'

/** Layout + librerías UI + pipes compartidos para módulos lazy de features. */
@NgModule({
  declarations: [ModalShellComponent],
  imports: [CommonModule, LayoutModule, UiLibsModule, SharedPipesModule],
  exports: [ModalShellComponent, LayoutModule, UiLibsModule, SharedPipesModule],
})
export class SharedModule {}
