/**
 * Evento de fila jqxGrid (click / double click / rowselect).
 * Default `any`: el emitter del grid no puede especializar T y `unknown` rompe los handlers tipados en plantillas.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JqxGridRowBound<T = any> {
  bounddata: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JqxGridRowEventArgs<T = any> {
  rowindex: number
  row: JqxGridRowBound<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JqxGridRowEvent<T = any> {
  args: JqxGridRowEventArgs<T>
}
