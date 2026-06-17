import {Component} from '@angular/core';
import {CrearProcedi, Procedimiento,} from './procedimiento';
import {ProcedimientoService} from './procedimiento.service';
import {ActivatedRoute, Router} from '@angular/router'
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-ver-procedimiento',
  templateUrl: './ver-procedimiento.component.html',
  styleUrls: ['./ver-procedimiento.component.css']
})
export class VerProcedimientoComponent {

  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  public crearprocedi: CrearProcedi = new CrearProcedi();
  public titulo = 'Procedimiento: ';
  public nivAcces = sessionStorage.getItem('nivAcces');
  public depart = sessionStorage.getItem('departamento');
  procedimientos!: Procedimiento[];
  public procedimiento: Procedimiento = new Procedimiento();


  constructor(public procedimientoService: ProcedimientoService,
              public http: HttpClient,
              public router: Router,
              public activatedRoute: ActivatedRoute
  ) {
  }


  ngOnInit() { this.cargarProcedimiento() }


  create() { }

  cargarProcedimiento(): void {

    this.activatedRoute.params.subscribe(params => {
        let id = params['id']

        console.log(`DATOS ID : ${id}`)
        if (id) {
          this.procedimientoService.getProcedimiento(id).subscribe(
            (procedimiento) => this.procedimiento = procedimiento
          )
        }
      }
    )
  }
}
