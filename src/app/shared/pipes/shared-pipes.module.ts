import { NgModule } from '@angular/core';
import { GridFieldFilterPipe } from './grid-field-filter.pipe';

const PIPES = [GridFieldFilterPipe];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class SharedPipesModule {}
