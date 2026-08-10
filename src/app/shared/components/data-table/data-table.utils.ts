/** Lee `row[field]`, soportando rutas anidadas tipo `persona.nombre`. */
export function getFieldValue<T>(row: T, field?: string): unknown {
  if (!field) {
    return undefined
  }
  return field.split('.').reduce<unknown>((acc, key) => {
    if (acc == null) {
      return acc
    }
    return (acc as Record<string, unknown>)[key]
  }, row)
}
