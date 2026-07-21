import { NgModule } from '@angular/core';

/**
 * Módulo legacy de integración con INSIDE (plataforma de expediente electrónico).
 * Los servicios (`InsideService`, `InsideSoapClient`, `InsideExpedienteOrchestrator`, etc.)
 * son `providedIn: 'root'`, por lo que no se declaran providers aquí.
 * No es necesario importarlo en `AppModule`; se mantiene vacío por compatibilidad.
 * La API pública del paquete se expone desde `./index`.
 */
@NgModule({})
export class InsideIntegrationModule {}
