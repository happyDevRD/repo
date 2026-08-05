import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavUiService } from '../nav/nav-ui.service';
import { resolvePageTitle } from '../layout/page-titles';
import { filter, Subscription } from 'rxjs';
import { UserSessionService } from '../core/service/user-session.service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit, OnDestroy {

  readonly title = environment.titulo;

  pageTitle = '';
  mobileMenuOpen = false;

  private navSub?: Subscription;
  private routerSub?: Subscription;

  constructor(
    private navUi: NavUiService,
    private router: Router,
    private session: UserSessionService,
  ) { }

  get userName(): string {
    return this.session.user || 'Usuario';
  }

  get departmentName(): string {
    return this.session.department || '';
  }

  ngOnInit(): void {
    this.navSub = this.navUi.mobileOpen$.subscribe(open => {
      this.mobileMenuOpen = open;
    });

    this.pageTitle = resolvePageTitle(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.pageTitle = resolvePageTitle(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.navUi.toggleMobileMenu();
  }
}
