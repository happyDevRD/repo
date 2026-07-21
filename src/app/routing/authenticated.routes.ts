import { Routes } from '@angular/router';

/**
 * Lazy load de dominios autenticados.
 * Cada módulo hijo declara sus paths reales (`inicio`, `expedientes`, `solicitudes`, …).
 * Se mantiene `path: ''` en el padre para no cambiar deep-links existentes;
 * no añadir rutas hijas ambiguas aquí — van en el `*-routing.module` de cada dominio.
 */
export const AUTHENTICATED_LAZY_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../inicio/inicio.module').then((m) => m.InicioModule),
  },
  {
    path: '',
    loadChildren: () => import('../expedientes/expedientes.module').then((m) => m.ExpedientesModule),
  },
  {
    path: '',
    loadChildren: () => import('../solicitudes/solicitudes.module').then((m) => m.SolicitudesModule),
  },
  {
    path: '',
    loadChildren: () => import('../procedimientos/procedimientos.module').then((m) => m.ProcedimientosModule),
  },
  {
    path: '',
    loadChildren: () => import('../mensajes/mensajes.module').then((m) => m.MensajesModule),
  },
];
