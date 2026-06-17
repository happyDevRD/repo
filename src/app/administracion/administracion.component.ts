
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css'],
 // imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdministracionComponent{
    public  title = 'Administración';
    public user = sessionStorage.getItem('user');// lo usamos para filtrar contenidos sin login

}