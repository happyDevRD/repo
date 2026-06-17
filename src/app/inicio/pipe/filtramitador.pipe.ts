import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtramitador'
})
export class FiltramitadorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
