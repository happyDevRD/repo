/** Helpers reutilizables para *ngFor trackBy (evitar recrear DOM en listas densas). */

export function trackById<T extends { id?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.id ?? index
}

export function trackByIndex(index: number): number {
  return index
}

export function trackByUsuario<T extends { usuario?: string }>(
  index: number,
  item: T,
): string {
  return item?.usuario ?? String(index)
}

export function trackByPlantilla<T extends { plantilla?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.plantilla ?? index
}

export function trackByValor<T extends { valor?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.valor ?? index
}

export function trackByNotificador<T extends { notificador?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.notificador ?? index
}

export function trackByReceptor<T extends { receptor?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.receptor ?? index
}

export function trackByMotNotif<T extends { motNotif?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.motNotif ?? index
}

export function trackByCodTema<T extends { codTema?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.codTema ?? index
}

export function trackByIdModel<T extends { idModel?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.idModel ?? index
}

export function trackByNumDocum<T extends { numDocum?: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.numDocum ?? index
}

export function trackByTipoObjeto<T extends { idTipObjTribu?: number }>(
  index: number,
  item: T,
): number {
  return item?.idTipObjTribu ?? index
}
