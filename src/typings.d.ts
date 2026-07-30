// interface JQuery {
//   modal(options?: any): JQuery;
// }

// `jqx` ya lo declara jqwidgets-ng (`declare var jqx: any`); no redeclarar aquí.

/** Callbacks globales usados por cellsrenderers de notificaciones (onclick en HTML). */
interface Window {
  verNotificacion?: (id: number) => void
  editarNotificacion?: (id: number) => void
}
