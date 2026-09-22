# iFlow (frontend) — Arquitectura

Ver también [iFlowServer/ARCHITECTURE.md](../iFlowServer/ARCHITECTURE.md) y `.cursor/rules/iflow-angular-architecture.mdc`.

## Capas

```
Componente (fino)
  → Facade (scope del contenedor)
    → Orchestrator / Service de dominio
      → HttpClient / SOAP client
```

Plantilla: `src/app/core/service/inside/` + facades en `features/expedientes/edita-expediente/`.

## Formularios y modernización Angular

- **Nuevas features:** Reactive Forms (patrón `features/operacion-form`).
- **Legacy:** template-driven (`ngModel`); adelgazar con facades e Inputs tipados en paneles.
- **Modales:** preferir `app-modal-shell` (`shared/components/modal-shell`); mismos `modalId` para `ModalManagerService`. Header compuesto: `[customHeader]` + slot `[modalHeader]`.
- **Acciones de modal/toolbar:** usar `app-modal-action-bar` + `ModalAction[]` derivados del estado (`shared/modals`). No añadir nuevos booleanos `veo*` ni `@Input` de visibilidad por botón; resolver capacidades en helpers/facades (piloto: notificaciones en edita-expediente).
- **Signals / standalone de dominio:** aplazados hasta upgrade Angular 16 → 18+.

## Modelos

- Interfaces tipadas en `src/app/core/models/*.dto.ts` / `*.model.ts`.
- No duplicar modelos legacy junto al componente de dominio (`expedientes.ts`, etc.) en código nuevo.

## Entornos y URL del API (runtime)

| Archivo | Uso |
|---------|-----|
| `assets/config.json` | **Fuente de verdad** de `apiUrl` / `apiUrlhttps`. Se copia al `dist` y se puede editar tras el despliegue sin recompilar. |
| `environment.ts` / `environment.development.ts` | Build-time (iconos, INSIDE, `production`). Los getters `apiUrl` / `apiUrlhttps` leen el store rellenado en el arranque. |
| `core/config/app-config.service.ts` | `APP_INITIALIZER` carga `config.json` (`cache: no-store`, respeta `base-href`). |

### Cambiar el backend sin recompilar

1. Desplegar el build (`npm run build:prod` → `dist/iFlow/`).
2. Editar en el servidor: `dist/iFlow/assets/config.json` (o la ruta equivalente bajo el `base-href`, p. ej. `/iFlow/assets/config.json`):

```json
{
  "apiUrl": "http://HOST:8090/api/gos/",
  "apiUrlhttps": "https://HOST:8443/api/gos/"
}
```

3. Recargar la aplicación en el navegador (no hace falta reiniciar el servidor de aplicaciones estáticas).

En desarrollo (`ng serve`), el mismo `src/assets/config.json` apunta por defecto a `http://localhost:8090/api/gos/`.

Si falta o es inválido el JSON, el arranque falla de forma explícita (fail-fast). No usar el antiguo `configurador.txt`.

## Servicios InSide

Los servicios InSide usan `providedIn: 'root'`. No hace falta un NgModule vacío de integración; inyectar los servicios desde `core/service/inside`.
