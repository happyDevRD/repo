import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoUiService {
  private pendingOpen = false
  private readonly openNuevoModal$ = new Subject<void>()

  readonly onOpenNuevoProcedimiento = this.openNuevoModal$.asObservable()

  requestOpenNuevoProcedimiento(): void {
    this.pendingOpen = true
    this.openNuevoModal$.next()
  }

  consumePendingOpen(): boolean {
    if (!this.pendingOpen) {
      return false
    }
    this.pendingOpen = false
    return true
  }
}
