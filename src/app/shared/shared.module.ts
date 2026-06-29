import { NgModule } from '@angular/core';
import { LayoutModule } from './layout.module';
import { UiLibsModule } from './ui-libs.module';

/** Layout + librerías UI para módulos lazy de features. */
@NgModule({
  imports: [LayoutModule, UiLibsModule],
  exports: [LayoutModule, UiLibsModule],
})
export class SharedModule {}
