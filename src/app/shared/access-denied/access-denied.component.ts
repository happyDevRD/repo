import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {
  @Input() title = 'Acceso denegado';
  @Input() message = 'Este usuario no tiene permisos para acceder a esta sección.';
}
