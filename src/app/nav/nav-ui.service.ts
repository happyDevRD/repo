import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const COLLAPSED_STORAGE_KEY = 'iflow_sidebar_collapsed';

@Injectable({ providedIn: 'root' })
export class NavUiService {
  private readonly mobileOpenSubject = new BehaviorSubject<boolean>(false);
  readonly mobileOpen$ = this.mobileOpenSubject.asObservable();

  private readonly collapsedSubject = new BehaviorSubject<boolean>(this.readCollapsedFromStorage());
  readonly collapsed$ = this.collapsedSubject.asObservable();

  get mobileOpen(): boolean {
    return this.mobileOpenSubject.value;
  }

  get collapsed(): boolean {
    return this.collapsedSubject.value;
  }

  toggleMobileMenu(): void {
    this.mobileOpenSubject.next(!this.mobileOpenSubject.value);
  }

  closeMobileMenu(): void {
    this.mobileOpenSubject.next(false);
  }

  toggleCollapsed(): void {
    const next = !this.collapsedSubject.value;
    this.collapsedSubject.next(next);
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, next ? '1' : '0');
    } catch {
      // Almacenamiento no disponible (modo privado, etc.): el estado sigue en memoria.
    }
  }

  private readCollapsedFromStorage(): boolean {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
