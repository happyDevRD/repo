# iFlow — Frontend

Aplicación web de gestión administrativa (expedientes, procedimientos, solicitudes, notificaciones, etc.) desarrollada con Angular.

## Requisitos

- Node.js 18+ y npm
- [iFlowServer](http://gitlabsrv.shs.local/egarcia/iflowserver) en ejecución (gateway en el puerto 8090)

## Instalación

```bash
npm install
```

Si hay conflictos de dependencias:

```bash
npm install --legacy-peer-deps
```

## Desarrollo

```bash
npm start
```

Aplicación: [http://localhost:4200/](http://localhost:4200/)

Las peticiones a `/api` se redirigen al gateway del backend (`src/proxy.conf.json` → `http://localhost:8090/api/gos/`).

## Build

```bash
npm run build
```

Build de producción con base href:

```bash
ng build --configuration production --base-href /iFlow/
```

Salida en `dist/`.

## Tests

```bash
npm test
```
