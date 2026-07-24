import { Routes } from '@angular/router';

/**
 * Lazy load de dominios autenticados.
 *
 * Por qué `path: ''` en cada entrada:
 * - Los `*-routing.module` de cada dominio ya declaran paths absolutos
 *   (`inicio`, `expedientes`, `solicitudes`, `procedimientos`, `mensajes`, …).
 * - Un padre con path explícito (`expedientes`) + hijo `expedientes` rompería
 *   deep-links (`/expedientes/expedientes`).
 *
 * Para migrar a paths explícitos hay que:
 * 1) Cambiar rutas hijas a relativas (`''`, `:id`, …) en cada dominio.
 * 2) Sustituir estos `path: ''` por el segmento del dominio.
 * Hasta entonces, no añadir rutas ambiguas aquí: van en el routing del dominio.
 */
export const AUTHENTICATED_LAZY_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../features/inicio/inicio.module').then((m) => m.InicioModule),
  },
  {
    path: '',
    loadChildren: () => import('../features/expedientes/expedientes.module').then((m) => m.ExpedientesModule),
  },
  {
    path: '',
    loadChildren: () => import('../features/solicitudes/solicitudes.module').then((m) => m.SolicitudesModule),
  },
  {
    path: '',
    loadChildren: () => import('../features/procedimientos/procedimientos.module').then((m) => m.ProcedimientosModule),
  },
  {
    path: '',
    loadChildren: () => import('../features/mensajes/mensajes.module').then((m) => m.MensajesModule),
  },
];
