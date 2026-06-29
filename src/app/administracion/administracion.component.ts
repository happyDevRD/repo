
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {UserSessionService} from '../core/service/user-session.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css'],
 // imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdministracionComponent{
    public title = 'Administración';

    constructor(public session: UserSessionService) {}
}