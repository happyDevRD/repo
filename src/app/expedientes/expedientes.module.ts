import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

/** Submódulo de notificaciones dentro del dominio expedientes. */
@NgModule({
  imports: [CommonModule, NotificacionesModule],
  exports: [NotificacionesModule]
})
export class ExpedientesModule {}
