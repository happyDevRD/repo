import { Component, OnInit } from '@angular/core';
import { Procedimiento } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';
import { PROCEDIMIENTOS } from '../procedimientos.json';

@Component({
  selector: 'app-tareas-procedimientos',
  templateUrl: './tareas-procedimientos.component.html',
  styleUrls: ['./tareas-procedimientos.component.css']
})
export class TareasProcedimientosComponent implements OnInit {

  public titulo = 'Tareas Procedimiento';
  public nivAcces = localStorage.getItem('nivAcces');
  procedimientos!: Procedimiento[];

  constructor(private procedimientoService: ProcedimientoService) { }

  ngOnInit(): void {
    // Se puede usar un valor por defecto y, en función del nivel de acceso, llamar al API
    this.procedimientos = PROCEDIMIENTOS;

    if (this.nivAcces === '6') {
      this.procedimientoService.getProcedimientos().subscribe(
        (procedimientos) => this.procedimientos = procedimientos
      );
    }
  }

  // Función trackBy para optimizar el *ngFor
  trackByFn(index: number, item: Procedimiento): number {
    return item.id || index;
  }

  // Método create() pendiente de implementar según la lógica de la aplicación
  create(): void {
    // Lógica para crear un procedimiento o tarea
  }
}
