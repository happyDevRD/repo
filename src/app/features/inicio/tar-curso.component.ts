import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaTramiteExpedienteApiService } from '../../core/service/tarea-tramite/tarea-tramite-expediente-api.service';
import { TareaTramiteExpedienteUsuarioListar } from '../expedientes/expedientes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tar-curso',
  templateUrl: './tar-curso.component.html',
  styleUrls: ['./tar-curso.component.css']
})
export class TarCursoComponent implements OnInit {
  public tareatramiteexpedienteusuariolistar: TareaTramiteExpedienteUsuarioListar[] = [];
  public cargando = false;
  public descargafichero!: string;
  public numeroArchivo!: number | string | null;
  public idtarea!: number;

  readonly rowClassFor = (tarea: TareaTramiteExpedienteUsuarioListar): Record<string, boolean> => ({
    'table-active': this.idtarea === tarea.id,
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private tareaTramiteApi: TareaTramiteExpedienteApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  // Se realiza una única suscripción para obtener las tareas y, al recibir la respuesta,
  // se formatea la fecha de apertura de cada tarea.
  public getTareasTramiteExpedienteListar(): void {
    this.cargando = true;
    this.tareaTramiteApi.listarUsuario().subscribe(
      (data: TareaTramiteExpedienteUsuarioListar[]) => {
        this.tareatramiteexpedienteusuariolistar = data;
        this.formatoFechaTareas();
        this.cargando = false;
      },
      error => {
        console.error('Error al obtener las tareas:', error);
        this.cargando = false;
      }
    );
  }

  // Se formatea la fecha (se extraen los primeros 10 caracteres) para cada tarea.
  private formatoFechaTareas(): void {
    if (this.tareatramiteexpedienteusuariolistar) {
      this.tareatramiteexpedienteusuariolistar.forEach(item => {
        if (item.fecInicio) {
          item.fecInicio = item.fecInicio.substring(0, 10);
        }
      });
    }
  }

  // Registra la acción de selección de tarea y almacena el id y número de archivo.
  public pulsaAccionesTarea(id: number, archivo: number | string | null): void {
    this.idtarea = id;
    this.numeroArchivo = archivo;
  }

  // Abre el archivo en una nueva pestaña usando la URL definida en el environment.
  public abreArchivo(): void {
    this.descargafichero = `${environment.apiUrl}archivo/descarga/${this.numeroArchivo}`;
    window.open(this.descargafichero, "_blank");
  }

  ngOnInit(): void {
    this.getTareasTramiteExpedienteListar();
  }
}
