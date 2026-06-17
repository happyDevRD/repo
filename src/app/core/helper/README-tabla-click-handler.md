# TablaClickHandler - Guía de Implementación

## Descripción

La clase `TablaClickHandler` proporciona una solución reutilizable para implementar el comportamiento de **click simple** y **doble click** en tablas de la aplicación I-FLOW.

## Comportamiento Implementado

### Click Simple
- **Selecciona la fila** (marca el checkbox en la primera columna)
- **Reemplaza cualquier selección anterior** (solo una fila seleccionada a la vez)
- **Habilita botones de acción** (en el caso de notificaciones)
- **NO abre modales automáticamente**

### Doble Click
- **Abre el modal de edición** correspondiente
- **Mantiene la funcionalidad existente** de apertura de modales

## Implementación Actual

### 1. Tabla de Notificaciones ✅

**Archivo:** `src/app/expedientes/edita-expediente.component.ts`

**HTML:**
```html
<jqxGrid #grid
         (onRowclick)="onNotificacionClick($event)"
         (onRowdoubleclick)="onNotificacionDoubleClick($event)"
         [source]="sourceListarNotifi"
         ...>
</jqxGrid>
```

**TypeScript:**
```typescript
// Click simple - selecciona fila y habilita botones
public onNotificacionClick(event: any) {
  TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceListarNotifi"]', (rowData) => {
    this.habilitarBotonesNotificacion(rowData);
    this.cargarDatosNotificacionSeleccionada(rowData);
  });
}

// Doble click - abre modal de edición
public onNotificacionDoubleClick(event: any) {
  TablaClickHandler.onRowDoubleClick(event, (rowData) => {
    this.editarNotificacion(rowData.idNotif);
  });
}
```

## Cómo Implementar en Otras Tablas

### Paso 1: Actualizar Renderers

Cambiar los renderers que abren modales automáticamente por renderers simples:

```typescript
// ANTES (abre modal automáticamente)
public cellsrendererConModal = function (row, column, value) {
  return `<div data-bs-toggle="modal" data-bs-target="#miModal">${value}</div>`;
}

// DESPUÉS (sin modal automático)
public cellsrendererSimple = TablaClickHandler.crearRendererSimple('center');
```

### Paso 2: Actualizar HTML

Agregar los eventos de click y doble click:

```html
<jqxGrid #grid
         (onRowclick)="onMiTablaClick($event)"
         (onRowdoubleclick)="onMiTablaDoubleClick($event)"
         [source]="sourceMiTabla"
         ...>
</jqxGrid>
```

### Paso 3: Implementar Métodos

```typescript
// Click simple
public onMiTablaClick(event: any) {
  TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceMiTabla"]', (rowData) => {
    // Lógica específica de la tabla
    this.cargarDatosSeleccionados(rowData);
  });
}

// Doble click
public onMiTablaDoubleClick(event: any) {
  TablaClickHandler.onRowDoubleClick(event, (rowData) => {
    // Abrir modal correspondiente
    this.abrirModalEdicion(rowData);
  });
}
```

## Renderers Disponibles

### Renderer Simple
```typescript
public cellsrendererSimple = TablaClickHandler.crearRendererSimple('center');
```

### Renderer de Estado con Colores
```typescript
const estados = {
  1: 'GENERADA',
  2: 'ENVIADA',
  3: 'RECEPCIONADA'
};

const colores = {
  'GENERADA': '#28a745',
  'ENVIADA': '#ffc107',
  'RECEPCIONADA': '#17a2b8'
};

public cellsrendererEstado = TablaClickHandler.crearRendererEstado(estados, colores);
```

### Renderer de Fechas
```typescript
public cellsrendererFecha = TablaClickHandler.crearRendererFecha('dd/mm/yyyy');
```

## Ejemplos de Implementación

### Tabla de Trámites
```typescript
public onTramiteClick(event: any) {
  TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTramite"]', (rowData) => {
    console.log('Trámite seleccionado:', rowData);
  });
}

public onTramiteDoubleClick(event: any) {
  TablaClickHandler.onRowDoubleClick(event, (rowData) => {
    this.editarTramiteExpediente();
  });
}
```

### Tabla de Tareas
```typescript
public onTareaClick(event: any) {
  TablaClickHandler.onRowClick(event, 'jqxGrid[source="sourceTareasTramite"]', (rowData) => {
    console.log('Tarea seleccionada:', rowData);
  });
}

public onTareaDoubleClick(event: any) {
  TablaClickHandler.onRowDoubleClick(event, (rowData) => {
    this.clicktarea(rowData.id, rowData.codArchivo, rowData.tareaProcedi);
  });
}
```

## Ventajas de esta Implementación

1. **Consistencia**: Comportamiento uniforme en todas las tablas
2. **Reutilización**: Una sola clase para manejar todos los clicks
3. **Mantenibilidad**: Fácil de modificar y extender
4. **Flexibilidad**: Permite lógica específica por tabla
5. **Experiencia de Usuario**: Comportamiento intuitivo (click para seleccionar, doble click para editar)

## Próximos Pasos

1. **Probar** la implementación en notificaciones
2. **Implementar** en tabla de trámites
3. **Implementar** en tabla de tareas
4. **Implementar** en otras tablas según necesidad
5. **Documentar** casos específicos de cada tabla

## Notas Importantes

- **Mantener compatibilidad**: Los métodos originales siguen funcionando
- **Testing**: Probar cada implementación antes de desplegar
- **Performance**: La clase utilitaria es eficiente y no afecta el rendimiento
- **Accesibilidad**: El comportamiento es accesible para usuarios con discapacidades

## Troubleshooting

### Problemas Comunes

1. **La fila no se selecciona al hacer click**
   - Verificar que el selector CSS sea correcto
   - Revisar la consola del navegador para errores
   - Asegurar que el grid esté completamente inicializado

2. **El doble click no abre el modal**
   - Verificar que el método de apertura del modal exista
   - Comprobar que el ID de la notificación sea válido
   - Revisar que no haya errores en la consola

3. **Se abren modales con click simple**
   - Verificar que los renderers no tengan atributos `data-bs-toggle`
   - Asegurar que se estén usando los renderers simples

### Debugging

La clase utilitaria incluye logs de consola para ayudar con el debugging:
- ✅ `Fila X seleccionada correctamente` - Selección exitosa
- ✅ `Checkbox de fila X actualizado` - Checkbox marcado correctamente
- ⚠️ `Grid no encontrado o no inicializado` - Problema con el selector
- ❌ `Error al seleccionar fila` - Error en la selección
- ❌ `Error al actualizar checkbox` - Error al marcar checkbox 