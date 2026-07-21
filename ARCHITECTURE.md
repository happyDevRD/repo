# iFlow (frontend) — Arquitectura

Ver también [iFlowServer/ARCHITECTURE.md](../iFlowServer/ARCHITECTURE.md) y `.cursor/rules/iflow-angular-architecture.mdc`.

## Capas

```
Componente (fino)
  → Facade (scope del contenedor)
    → Orchestrator / Service de dominio
      → HttpClient / SOAP client
```

Plantilla: `src/app/core/service/inside/` + facades en `expedientes/edita-expediente/`.

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

Los servicios InSide usan `providedIn: 'root'`. No hace falta importar `InsideIntegrationModule` en `AppModule`.
