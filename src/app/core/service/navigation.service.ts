import { Injectable, inject } from '@angular/core'
import { Location } from '@angular/common'
import { NavigationEnd, Router } from '@angular/router'
import { ModalManagerService } from './modal-manager.service'

export interface BackActionContext {
  /** true si el componente actual se está mostrando embebido dentro de un modal (modal-shell). */
  modal?: boolean
  /** modalId a cerrar cuando `modal` es true. */
  modalId?: string
  /** Ruta a la que navegar cuando no hay historial in-app que recorrer hacia atrás. */
  fallbackRoute?: string | unknown[]
}

export type BackActionResolution =
  | { mode: 'modal'; execute: () => void }
  | { mode: 'route'; execute: () => void }

/**
 * Único punto de la app que decide cómo "volver": cierre de modal vs navegación
 * de ruta, y dentro de navegación de ruta, historial real (Location.back()) vs
 * una ruta de fallback declarada por el componente. Ver plan de rediseño de
 * navegación (Wave 0) — sustituye a los ~6 mecanismos de "volver" distintos
 * que coexistían antes (facades reimplementando router.navigate, routerLink
 * directo, Location.back() aislado, toggles de estado local, y el caso dual
 * modal/ruta de interesado.component.ts).
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly modalManagerService = inject(ModalManagerService)

  /**
   * Cuenta de navegaciones completadas dentro de la sesión de la SPA. Si es
   * mayor que 1, hubo al menos una navegación in-app antes de la actual, por
   * lo que Location.back() tiene una entrada de historial propia a la que
   * volver. Si es 1 (la carga inicial), Location.back() saldría de la app
   * (o del historial previo a ella) — en ese caso se usa fallbackRoute.
   */
  private navigationCount = 0

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigationCount += 1
      }
    })
  }

  /** Vuelve a la pantalla anterior por historial real, o a fallbackRoute si no hay historial in-app. */
  goBack(fallbackRoute: string | unknown[] = '/'): void {
    if (this.navigationCount > 1) {
      this.location.back()
      return
    }
    this.navigateTo(fallbackRoute)
  }

  /**
   * Navega a una ruta concreta (un solo salto). Usar cuando "Volver" debe ir
   * siempre al listado / destino fijo, sin recorrer entradas intermedias del historial
   * (ficha, redirects, etc.).
   */
  navigateTo(route: string | unknown[]): void {
    if (typeof route === 'string') {
      void this.router.navigateByUrl(route)
      return
    }
    void this.router.navigate(route)
  }

  /** Lee `returnUrl` del state del historial (si se pasó al entrar en la pantalla). */
  readReturnUrl(opts?: { rejectIfIncludes?: string }): string | null {
    const state = (typeof history !== 'undefined' ? history.state : null) as { returnUrl?: unknown } | null
    const url = state?.returnUrl
    if (typeof url !== 'string' || !url.trim()) {
      return null
    }
    const reject = opts?.rejectIfIncludes
    if (reject && url.includes(reject)) {
      return null
    }
    return url
  }

  /** Cierra el modal indicado (delega en ModalManagerService, sin duplicar su lógica). */
  closeAsModal(modalId: string): void {
    this.modalManagerService.closeModal(modalId)
  }

  /**
   * Resuelve, sin que el componente llamante tenga que ramificar, si "volver"
   * significa cerrar un modal o navegar una ruta.
   */
  resolveBackAction(context: BackActionContext): BackActionResolution {
    if (context.modal && context.modalId) {
      return { mode: 'modal', execute: () => this.closeAsModal(context.modalId!) }
    }
    return { mode: 'route', execute: () => this.goBack(context.fallbackRoute) }
  }
}
