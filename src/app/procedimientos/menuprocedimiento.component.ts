import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ProcedimientoUiService } from './procedimiento-ui.service'

@Component({
  selector: 'app-menuprocedimiento',
  templateUrl: './menuprocedimiento.component.html',
  styleUrls: ['./menuprocedimiento.component.css']
})
export class MenuprocedimientoComponent {
  constructor(
    private router: Router,
    private procedimientoUi: ProcedimientoUiService
  ) {}

  handleOpenNuevoProcedimiento = (): void => {
    this.procedimientoUi.requestOpenNuevoProcedimiento()
    if (!this.router.url.includes('/procedimientos')) {
      this.router.navigate(['/procedimientos'])
    }
  }
}
