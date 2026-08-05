import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavUiService } from '../nav/nav-ui.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit, OnDestroy {
  @Input() contentId?: string;

  sidebarCollapsed = false;

  private collapsedSub?: Subscription;

  constructor(private navUi: NavUiService) {}

  ngOnInit(): void {
    this.collapsedSub = this.navUi.collapsed$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
  }

  ngOnDestroy(): void {
    this.collapsedSub?.unsubscribe();
  }
}
