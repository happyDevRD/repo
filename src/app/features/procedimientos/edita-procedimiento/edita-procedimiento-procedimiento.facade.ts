import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EditarProcedi, PlantillaTarea, Procedimiento, ProcediPermisos, UsuariosListar } from '../procedimiento';
import { ProcedimientoService } from '../procedimiento.service';

export interface EditaProcedimientoHost {
  procedimiento: Procedimiento;
  editarprocedi: EditarProcedi;
  plantillatarea: PlantillaTarea[];
  procedipermiso: ProcediPermisos[];
  usuarioslistar: UsuariosListar[];
}

/**
 * Facade encargada de la carga y edición de los datos generales del procedimiento
 * (pestaña "Editar procedimiento") en la pantalla de edición.
 */
@Injectable()
export class EditaProcedimientoProcedimientoFacade {
  constructor(
    private readonly procedimientoService: ProcedimientoService,
    private readonly router: Router,
  ) {}

  cargarProcedimiento(host: EditaProcedimientoHost, id: number): void {
    if (!id) {
      return;
    }
    this.procedimientoService.getProcedimiento(id).subscribe({
      next: (procedimiento) => (host.procedimiento = procedimiento),
      error: (error) => console.error('Error al cargar el procedimiento:', error),
    });
  }

  cargarDatosIniciales(host: EditaProcedimientoHost): void {
    this.procedimientoService.getPlantillaTareas().subscribe({
      next: (plantillatarea) => (host.plantillatarea = plantillatarea),
      error: (error) => console.error('Error al cargar plantillas:', error),
    });

    this.procedimientoService.getPermisoProcedi().subscribe({
      next: (procedipermisos) => (host.procedipermiso = procedipermisos),
      error: (error) => console.error('Error al cargar permisos:', error),
    });

    this.procedimientoService.getUsuarios().subscribe({
      next: (usuarioslistar) => (host.usuarioslistar = usuarioslistar),
      error: (error) => console.error('Error al cargar usuarios:', error),
    });
  }

  editar(host: EditaProcedimientoHost, id: number): void {
    this.procedimientoService.editaProcedi(host.editarprocedi, id).subscribe({
      next: () => this.router.navigate(['/procedimientos']),
      error: (error) => console.error('Error al editar el procedimiento:', error),
    });
  }
}
