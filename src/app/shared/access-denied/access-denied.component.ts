import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent {
  @Input() title = 'Acceso denegado';
  @Input() message = 'Este usuario no tiene permisos para acceder a esta sección.';
}
