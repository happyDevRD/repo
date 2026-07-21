import { Pipe, PipeTransform } from '@angular/core';

/** Filtro genérico por campo de texto en listados (legacy grid filters). */
@Pipe({ name: 'gridFieldFilter' })
export class GridFieldFilterPipe implements PipeTransform {
  transform(value: unknown[] | null | undefined, campo: string, ...args: string[]): unknown[] | null {
    if (!value) return null;
    if (!args.length) return value;

    const term = args[0]?.toLowerCase() ?? '';
    return value.filter(
      (item) => String((item as Record<string, unknown>)[campo] ?? '').toLowerCase().includes(term),
    );
  }
}
