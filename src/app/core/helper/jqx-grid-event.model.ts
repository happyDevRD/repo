/** Evento de fila jqxGrid (click / double click / rowselect). */
export interface JqxGridRowBound<T = any> {
  bounddata: T
}

export interface JqxGridRowEventArgs<T = any> {
  rowindex: number
  row: JqxGridRowBound<T>
}

export interface JqxGridRowEvent<T = any> {
  args: JqxGridRowEventArgs<T>
}