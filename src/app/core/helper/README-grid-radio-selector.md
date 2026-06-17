# GridRadioSelector - Guía de Implementación Global

## Descripción

`GridRadioSelector` es una clase utilitaria global que proporciona métodos reutilizables para implementar el comportamiento de selección de fila con radio buttons en grids jqxGrid de manera consistente en toda la aplicación I-FLOW.

## Características Principales

- ✅ **Reutilizable**: Una sola implementación para todos los componentes
- ✅ **Consistente**: Mismo comportamiento en toda la aplicación
- ✅ **Configurable**: Fácil personalización por grid
- ✅ **Robusto**: Múltiples estrategias de fallback
- ✅ **Mantenible**: Cambios centralizados

## Métodos Disponibles

### 1. `createRadioRenderer(gridName, title, stopPropagation?)`
Crea un renderer de radio button para una columna de jqxGrid.

**Parámetros:**
- `gridName`: Nombre único del grid (se usa para generar IDs)
- `title`: Título del tooltip
- `stopPropagation`: Opcional, si debe detener la propagación del evento

**Ejemplo:**
```typescript
public columnseleccion = GridRadioSelector.createRadioRenderer('Procedimientos', 'Selecciona Procedimiento');
public columnseleccionTarea = GridRadioSelector.createRadioRenderer('Tareas', 'Selecciona Tarea', true);
```

### 2. `handleRowClick(event, gridName, callback?)`
Maneja el evento de click en una fila de grid.

**Parámetros:**
- `event`: Evento del grid jqxGrid
- `gridName`: Nombre del grid
- `callback`: Función opcional con la lógica específica del grid

**Ejemplo:**
```typescript
public onProcedimientoClick(event: any) {
  GridRadioSelector.handleRowClick(event, 'Procedimientos', (rowData) => {
    // Lógica específica del procedimiento
    this.cargarDatosProcedimiento(rowData);
  });
}
```

### 3. `createClickHandler(gridName, callback)`
Crea un método de click completo para un grid específico.

**Ejemplo:**
```typescript
public onProcedimientoClick = GridRadioSelector.createClickHandler('Procedimientos', (rowData) => {
  this.cargarDatosProcedimiento(rowData);
});
```

### 4. `updateRadioButton(gridName, rowIndex)`
Actualiza manualmente el radio button de una fila específica.

### 5. `clearGridSelection(gridName)`
Limpia la selección de un grid específico.

### 6. `getSelectedRowIndex(gridName)`
Obtiene el índice de la fila seleccionada.

### 7. `isRowSelected(gridName, rowIndex)`
Verifica si una fila específica está seleccionada.

## Implementación Paso a Paso

### Paso 1: Importar la Clase
```typescript
import {GridRadioSelector} from "../core/helper/grid-radio-selector";
```

### Paso 2: Crear Renderers
```typescript
// En el componente
public columnseleccion = GridRadioSelector.createRadioRenderer('MiGrid', 'Selecciona Fila');
```

### Paso 3: Configurar Columnas
```typescript
columns = [
  {text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccion, renderer: this.columnrenderer},
  // ... otras columnas
];
```

### Paso 4: Implementar Método de Click
```typescript
public onRowClick(event: any) {
  GridRadioSelector.handleRowClick(event, 'MiGrid', (rowData) => {
    // Lógica específica del grid
    this.procesarSeleccion(rowData);
  });
}
```

### Paso 5: Configurar HTML
```html
<jqxGrid #miGrid
         id="miGrid"
         (onRowclick)="onRowClick($event)"
         [columns]="columns"
         [source]="source">
</jqxGrid>
```

## Ejemplos de Implementación

### Ejemplo 1: Grid Simple
```typescript
// Componente
export class MiComponente {
  public columnseleccion = GridRadioSelector.createRadioRenderer('Usuarios', 'Selecciona Usuario');
  
  public onUsuarioClick(event: any) {
    GridRadioSelector.handleRowClick(event, 'Usuarios', (rowData) => {
      this.usuarioSeleccionado = rowData;
      this.habilitarBotones();
    });
  }
}
```

### Ejemplo 2: Múltiples Grids
```typescript
export class MiComponente {
  // Renderers
  public columnseleccionClientes = GridRadioSelector.createRadioRenderer('Clientes', 'Selecciona Cliente');
  public columnseleccionProductos = GridRadioSelector.createRadioRenderer('Productos', 'Selecciona Producto');
  
  // Métodos de click
  public onClienteClick = GridRadioSelector.createClickHandler('Clientes', (rowData) => {
    this.clienteSeleccionado = rowData;
  });
  
  public onProductoClick = GridRadioSelector.createClickHandler('Productos', (rowData) => {
    this.productoSeleccionado = rowData;
  });
}
```

### Ejemplo 3: Grid con Stop Propagation
```typescript
// Para grids anidados o con eventos complejos
public columnseleccionTarea = GridRadioSelector.createRadioRenderer('Tareas', 'Selecciona Tarea', true);
```

## Ventajas de la Implementación Global

### 1. **Consistencia**
- Mismo comportamiento en toda la aplicación
- Estilo visual uniforme
- Experiencia de usuario coherente

### 2. **Mantenibilidad**
- Cambios centralizados
- Fácil debugging
- Actualizaciones automáticas

### 3. **Escalabilidad**
- Fácil agregar nuevos grids
- Reutilización de código
- Reducción de duplicación

### 4. **Rendimiento**
- Código optimizado
- Menos duplicación
- Mejor gestión de memoria

## Migración desde Implementación Local

Si ya tienes una implementación local, sigue estos pasos:

1. **Importar la clase global**
2. **Reemplazar renderers locales**
3. **Actualizar métodos de click**
4. **Eliminar código duplicado**
5. **Probar funcionalidad**

## Troubleshooting

### Problema: Radio button no se marca
- Verificar que el `gridName` sea consistente
- Revisar que el HTML tenga el ID correcto
- Comprobar que no haya conflictos de nombres

### Problema: Múltiples selecciones
- Verificar que el `name` del radio button sea único por grid
- Comprobar que se esté desmarcando correctamente

### Problema: Eventos no funcionan
- Verificar que el `stopPropagation` esté configurado correctamente
- Revisar que el callback se esté ejecutando

## Logs de Debugging

La clase incluye logs detallados para facilitar el debugging:

- 🔄 Actualización de radio button
- ✅ Selección exitosa
- ⚠️ Advertencias
- ❌ Errores
- 🖱️ Eventos de click
- 🧹 Limpieza de selección

## Compatibilidad

- ✅ jqxGrid
- ✅ Angular 12+
- ✅ TypeScript
- ✅ Todos los navegadores modernos 