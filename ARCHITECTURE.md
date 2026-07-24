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

## Entornos

| Archivo | Uso |
|---------|-----|
| `environment.ts` | Build prod; placeholders `${IFLOW_API_URL}` / `${IFLOW_API_URL_HTTPS}` |
| `environment.development.ts` | `ng serve` / desarrollo local |

Sustituir placeholders en CI. No committear IPs internas.

## Servicios InSide

Los servicios InSide usan `providedIn: 'root'`. No hace falta un NgModule vacío de integración; inyectar los servicios desde `core/service/inside`.
