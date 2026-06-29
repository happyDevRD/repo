import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { UserSessionService } from '../service/user-session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private session: UserSessionService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.session.isAuthenticated && this.session.user) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
