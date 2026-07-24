export type ModalActionTone = 'primary' | 'secondary' | 'danger'

export interface ModalAction {
  id: string
  label: string
  icon?: string
  tone?: ModalActionTone
  visible?: boolean
  disabled?: boolean
  /** Muestra spinner junto al label (p. ej. conversión PDF / firma). */
  busy?: boolean
  /** Solo icono (toolbar de cabecera). */
  iconOnly?: boolean
  order?: number
  title?: string
}

export interface ModalActionEvent {
  id: string
}
