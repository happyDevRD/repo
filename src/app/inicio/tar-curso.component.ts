import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpedientesService } from '../expedientes/expedientes.service';
import { TareaTramiteExpedienteUsuarioListar } from '../expedientes/expedientes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tar-curso',
  templateUrl: './tar-curso.component.html',
  styleUrls: ['./tar-curso.component.css']
})
export class TarCursoComponent implements OnInit {
  public tareatramiteexpedienteusuariolistar!: TareaTramiteExpedienteUsuarioListar[];
  public descargafichero!: string;
  public numeroArchivo!: number;
  public idtarea!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private expedientesService: ExpedientesService,
    private activatedRoute: ActivatedRoute
  ) {}

  // Se realiza una única suscripción para obtener las tareas y, al recibir la respuesta,
  // se formatea la fecha de apertura de cada tarea.
  public getTareasTramiteExpedienteListar(): void {
    this.expedientesService.getTareaTramiteExpedienteUsuarioListar().subscribe(
      (data: TareaTramiteExpedienteUsuarioListar[]) => {
        this.tareatramiteexpedienteusuariolistar = data;
        this.formatoFechaTareas();
      },
      error => {
        console.error('Error al obtener las tareas:', error);
      }
    );
    console.log('Consulta de tareas lanzada!');
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
  public pulsaAccionesTarea(id: number, archivo: number): void {
    this.idtarea = id;
    this.numeroArchivo = archivo;
    console.log(`CODIGO ARCHIVO: ${this.numeroArchivo}`);
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
