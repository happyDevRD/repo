import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavUiService } from '../Nav/nav-ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit, OnDestroy {

  readonly title = environment.titulo;
  readonly brand = environment.entidad;

  public user = sessionStorage.getItem('user');
  public depart = sessionStorage.getItem('departamento');

  mobileMenuOpen = false;
  private navSub?: Subscription;

  constructor(private navUi: NavUiService) { }

  ngOnInit(): void {
    this.navSub = this.navUi.mobileOpen$.subscribe(open => {
      this.mobileMenuOpen = open;
    });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.navUi.toggleMobileMenu();
  }

  get userName(): string {
    return this.user || 'Usuario';
  }

  get departmentName(): string {
    return this.depart || 'Departamento';
  }
}
