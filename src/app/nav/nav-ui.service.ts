import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavUiService {
  private readonly mobileOpenSubject = new BehaviorSubject<boolean>(false);
  readonly mobileOpen$ = this.mobileOpenSubject.asObservable();

  get mobileOpen(): boolean {
    return this.mobileOpenSubject.value;
  }

  toggleMobileMenu(): void {
    this.mobileOpenSubject.next(!this.mobileOpenSubject.value);
  }

  closeMobileMenu(): void {
    this.mobileOpenSubject.next(false);
  }
}
