import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  fecha:any = new Date();
  version:any = "1.1" // versión de  aplicativo

  year:any = this.fecha.getFullYear();

}
