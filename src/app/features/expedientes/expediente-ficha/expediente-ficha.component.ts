import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { etiquetaEstadoEnvioInside } from '../../../core/constants/inside-simulacion.constants'
import { ExpedienteFichaFacade } from './services/expediente-ficha.facade'

@Component({
  selector: 'app-expediente-ficha',
  templateUrl: './expediente-ficha.component.html',
  styleUrls: ['./expediente-ficha.component.css'],
  providers: [ExpedienteFichaFacade],
})
export class ExpedienteFichaComponent implements OnInit {
  readonly ficha = inject(ExpedienteFichaFacade)
  private readonly route = inject(ActivatedRoute)

  readonly etiquetaEstadoInside = etiquetaEstadoEnvioInside

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.ficha.cargar(id)

    const url = this.route.snapshot.url.map((s) => s.path).join('/')
    if (url.endsWith('inside') || this.route.snapshot.queryParamMap.get('seccion') === 'inside') {
      this.ficha.seccionActiva = 'inside'
      return
    }

    this.ficha.seccionActiva = 'tramitacion'
  }
}
