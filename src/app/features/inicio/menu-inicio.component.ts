import { Component } from '@angular/core';
import { UserSessionService } from '../../core/service/user-session.service';

@Component({
  selector: 'app-menu-inicio',
  templateUrl: './menu-inicio.component.html',
  styleUrls: ['./menu-inicio.component.css']
})
export class MenuInicioComponent {
  constructor(public session: UserSessionService) {}
}
