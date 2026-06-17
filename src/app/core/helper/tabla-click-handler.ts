/**
 * Clase utilitaria para manejar la lógica de click simple y doble click en tablas
 * Esta clase proporciona métodos reutilizables para implementar el comportamiento
 * de selección de fila con click simple y apertura de modal con doble click
 */
export class TablaClickHandler {

  /**
   * Maneja el click simple en una fila de tabla
   * Solo selecciona la fila (marca el checkbox)
   * @param event Evento de click del grid
   * @param gridSelector Selector CSS del grid
   * @param callback Función opcional a ejecutar después de seleccionar la fila
   */
  public static onRowClick(event: any, gridSelector: string, callback?: (rowData: any) => void) {
    const rowData = event.args.row.bounddata;
    const rowIndex = event.args.rowindex;
    
    // Siempre seleccionar la fila (marcar checkbox) - esto reemplaza cualquier selección anterior
    this.seleccionarFila(gridSelector, rowIndex);
    
    // Ejecutar callback si se proporciona
    if (callback) {
      callback(rowData);
    }
  }

  /**
   * Maneja el doble click en una fila de tabla
   * Abre el modal correspondiente
   * @param event Evento de doble click del grid
   * @param modalCallback Función que abre el modal correspondiente
   */
  public static onRowDoubleClick(event: any, modalCallback: (rowData: any) => void) {
    const rowData = event.args.row.bounddata;
    modalCallback(rowData);
  }

  /**
   * Maneja el click simple en una fila de tabla usando referencia directa al grid
   * @param event Evento de click del grid
   * @param gridElement Elemento del grid (opcional)
   * @param callback Función opcional a ejecutar después de seleccionar la fila
   */
  public static onRowClickDirect(event: any, gridElement?: any, callback?: (rowData: any) => void) {
    const rowData = event.args.row.bounddata;
    const rowIndex = event.args.rowindex;
    
    // Siempre seleccionar la fila (marcar checkbox) - esto reemplaza cualquier selección anterior
    this.seleccionarFilaDirecta(gridElement, rowIndex);
    
    // Ejecutar callback si se proporciona
    if (callback) {
      callback(rowData);
    }
  }

  /**
   * Maneja el click simple en una fila de tabla usando el evento del grid directamente
   * @param event Evento de click del grid
   * @param callback Función opcional a ejecutar después de seleccionar la fila
   */
  public static onRowClickFromEvent(event: any, callback?: (rowData: any) => void) {
    const rowData = event.args.row.bounddata;
    const rowIndex = event.args.rowindex;
    
    console.log(`Intentando seleccionar fila ${rowIndex} desde evento del grid`);
    
    // Actualizar directamente los radio buttons sin depender de APIs del grid
    setTimeout(() => {
      this.actualizarRadioButtonsDirectamente(rowIndex);
    }, 50);
    
    // Ejecutar callback si se proporciona
    if (callback) {
      callback(rowData);
    }
  }

  /**
   * Selecciona una fila específica en el grid
   * @param gridSelector Selector CSS del grid
   * @param rowIndex Índice de la fila a seleccionar
   */
  private static seleccionarFila(gridSelector: string, rowIndex: number) {
    console.log(`Intentando seleccionar fila ${rowIndex} en grid ${gridSelector}`);
    
    // Intentar diferentes formas de encontrar el grid
    let gridElement = document.querySelector(gridSelector) as any;
    
    // Si no se encuentra con el selector directo, intentar con #
    if (!gridElement && !gridSelector.startsWith('#')) {
      gridElement = document.querySelector(`#${gridSelector}`) as any;
    }
    
    // Si aún no se encuentra, intentar buscar por ID sin #
    if (!gridElement && gridSelector.startsWith('#')) {
      const idWithoutHash = gridSelector.substring(1);
      gridElement = document.querySelector(`#${idWithoutHash}`) as any;
    }
    
    // Si aún no se encuentra, buscar por clase jqx-grid
    if (!gridElement) {
      const grids = document.querySelectorAll('.jqx-grid');
      console.log(`Encontrados ${grids.length} grids con clase jqx-grid`);
      
      // Buscar el grid que contenga el source correspondiente
      for (let i = 0; i < grids.length; i++) {
        const grid = grids[i] as any;
        if (grid.jqxGrid) {
          try {
            const source = grid.jqxGrid('source');
            if (source && source.url && source.url.includes(gridSelector.toLowerCase().replace('jqxgrid[source="', '').replace('"]', ''))) {
              gridElement = grid;
              console.log(`Grid encontrado por source URL en índice ${i}`);
              break;
            }
          } catch (error) {
            console.log(`Error al verificar source del grid ${i}:`, error);
          }
        }
      }
    }
    
    // Si aún no se encuentra, usar el primer grid disponible
    if (!gridElement) {
      const grids = document.querySelectorAll('.jqx-grid');
      if (grids.length > 0) {
        gridElement = grids[0] as any;
        console.log('Usando el primer grid disponible como fallback');
      }
    }
    
    if (gridElement) {
      console.log('Grid encontrado, intentando seleccionar fila');
      
      // Para jqxGrid, intentar usar la API de jQuery
      if (gridElement.jqxGrid) {
        try {
          // Deseleccionar todas las filas primero
          gridElement.jqxGrid('clearselection');
          
          // Seleccionar la fila específica
          gridElement.jqxGrid('selectrow', rowIndex);
          
          // Asegurar que la fila esté visible
          gridElement.jqxGrid('ensurerowvisible', rowIndex);
          
          console.log(`Fila ${rowIndex} seleccionada usando jqxGrid API`);
        } catch (error) {
          console.error('Error al seleccionar fila usando jqxGrid API:', error);
        }
      } else {
        console.log('Grid encontrado pero no es jqxGrid, usando método alternativo');
      }
      
      // Actualizar visualmente el checkbox de la primera columna
      setTimeout(() => {
        this.actualizarCheckboxSeleccion(gridSelector, rowIndex);
      }, 200);
      
    } else {
      console.warn('Grid no encontrado o no inicializado:', gridSelector);
    }
  }

  /**
   * Selecciona una fila específica en el grid usando referencia directa
   * @param gridElement Elemento del grid
   * @param rowIndex Índice de la fila a seleccionar
   */
  private static seleccionarFilaDirecta(gridElement: any, rowIndex: number) {
    console.log(`Intentando seleccionar fila ${rowIndex} usando referencia directa`);
    
    if (gridElement && gridElement.jqxGrid) {
      try {
        // Deseleccionar todas las filas primero
        gridElement.jqxGrid('clearselection');
        
        // Seleccionar la fila específica
        gridElement.jqxGrid('selectrow', rowIndex);
        
        // Asegurar que la fila esté visible
        gridElement.jqxGrid('ensurerowvisible', rowIndex);
        
        console.log(`Fila ${rowIndex} seleccionada usando jqxGrid API directa`);
        
        // Actualizar visualmente el checkbox de la primera columna
        setTimeout(() => {
          this.actualizarCheckboxSeleccionDirecta(gridElement, rowIndex);
        }, 200);
        
      } catch (error) {
        console.error('Error al seleccionar fila usando jqxGrid API directa:', error);
      }
    } else {
      console.warn('Grid no encontrado o no inicializado (referencia directa)');
    }
  }

  /**
   * Actualiza visualmente el checkbox de la primera columna
   * @param gridSelector Selector CSS del grid
   * @param rowIndex Índice de la fila seleccionada
   */
  private static actualizarCheckboxSeleccion(gridSelector: string, rowIndex: number) {
    // Buscar el grid usando la misma lógica que seleccionarFila
    let gridElement = document.querySelector(gridSelector) as any;
    
    // Si no se encuentra con el selector directo, intentar con #
    if (!gridElement && !gridSelector.startsWith('#')) {
      gridElement = document.querySelector(`#${gridSelector}`) as any;
    }
    
    // Si aún no se encuentra, intentar buscar por ID sin #
    if (!gridElement && gridSelector.startsWith('#')) {
      const idWithoutHash = gridSelector.substring(1);
      gridElement = document.querySelector(`#${idWithoutHash}`) as any;
    }
    
    // Si aún no se encuentra, buscar por clase jqx-grid
    if (!gridElement) {
      const grids = document.querySelectorAll('.jqx-grid');
      for (let i = 0; i < grids.length; i++) {
        const grid = grids[i] as any;
        if (grid.jqxGrid) {
          try {
            const source = grid.jqxGrid('source');
            if (source && source.url && source.url.includes(gridSelector.toLowerCase().replace('jqxgrid[source="', '').replace('"]', ''))) {
              gridElement = grid;
              break;
            }
          } catch (error) {
            console.log(`Error al verificar source del grid ${i}:`, error);
          }
        }
      }
    }
    
    // Si aún no se encuentra, usar el primer grid disponible
    if (!gridElement) {
      const grids = document.querySelectorAll('.jqx-grid');
      if (grids.length > 0) {
        gridElement = grids[0] as any;
      }
    }
    
    if (gridElement) {
      try {
        // Obtener todas las celdas de la primera columna
        const radioButtons = gridElement.querySelectorAll('input[type="radio"]');
        
        console.log(`Encontrados ${radioButtons.length} radio buttons en el grid`);
        
        // Desmarcar todos los radio buttons
        radioButtons.forEach((radio: HTMLInputElement) => {
          radio.checked = false;
        });
        
        // Marcar el radio button de la fila seleccionada
        if (radioButtons[rowIndex]) {
          (radioButtons[rowIndex] as HTMLInputElement).checked = true;
          console.log(`Radio button ${rowIndex} marcado como checked`);
        } else {
          console.warn(`No se encontró radio button para la fila ${rowIndex}`);
        }
        
        console.log(`Checkbox de fila ${rowIndex} actualizado`);
      } catch (error) {
        console.error('Error al actualizar checkbox:', error);
      }
    } else {
      console.warn('Grid no encontrado para actualizar checkbox:', gridSelector);
    }
  }

  /**
   * Actualiza visualmente el checkbox de la primera columna usando referencia directa
   * @param gridElement Elemento del grid
   * @param rowIndex Índice de la fila seleccionada
   */
  private static actualizarCheckboxSeleccionDirecta(gridElement: any, rowIndex: number) {
    if (gridElement) {
      try {
        // Obtener todas las celdas de la primera columna
        const radioButtons = gridElement.querySelectorAll('input[type="radio"]');
        
        console.log(`Encontrados ${radioButtons.length} radio buttons en el grid (directo)`);
        
        // Desmarcar todos los radio buttons
        radioButtons.forEach((radio: HTMLInputElement) => {
          radio.checked = false;
        });
        
        // Marcar el radio button de la fila seleccionada
        if (radioButtons[rowIndex]) {
          (radioButtons[rowIndex] as HTMLInputElement).checked = true;
          console.log(`Radio button ${rowIndex} marcado como checked (directo)`);
        } else {
          console.warn(`No se encontró radio button para la fila ${rowIndex} (directo)`);
        }
        
        console.log(`Checkbox de fila ${rowIndex} actualizado (directo)`);
      } catch (error) {
        console.error('Error al actualizar checkbox (directo):', error);
      }
    } else {
      console.warn('Grid no encontrado para actualizar checkbox (directo)');
    }
  }

  /**
   * Actualiza visualmente el checkbox de la primera columna usando el evento del grid
   * @param gridElement Elemento del grid
   * @param rowIndex Índice de la fila seleccionada
   */
  private static actualizarCheckboxDesdeEvento(gridElement: any, rowIndex: number) {
    if (gridElement) {
      try {
        // Buscar radio buttons dentro del grid
        const radioButtons = gridElement.querySelectorAll('input[type="radio"]');
        
        console.log(`Encontrados ${radioButtons.length} radio buttons en el grid desde evento`);
        
        if (radioButtons.length > 0) {
          // Desmarcar todos los radio buttons
          radioButtons.forEach((radio: HTMLInputElement) => {
            radio.checked = false;
          });
          
          // Marcar el radio button de la fila seleccionada
          if (radioButtons[rowIndex]) {
            (radioButtons[rowIndex] as HTMLInputElement).checked = true;
            console.log(`Radio button ${rowIndex} marcado como checked desde evento`);
          } else {
            console.warn(`No se encontró radio button para la fila ${rowIndex} desde evento`);
          }
          
          console.log(`Checkbox de fila ${rowIndex} actualizado desde evento`);
        } else {
          console.log('No se encontraron radio buttons en el grid');
        }
      } catch (error) {
        console.error('Error al actualizar checkbox desde evento:', error);
      }
    } else {
      console.warn('Grid no encontrado para actualizar checkbox desde evento');
    }
  }

  /**
   * Actualiza directamente los radio buttons sin depender de APIs del grid
   * @param rowIndex Índice de la fila seleccionada
   */
  private static actualizarRadioButtonsDirectamente(rowIndex: number) {
    try {
      // Buscar todos los radio buttons en la página
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      console.log(`Encontrados ${radioButtons.length} radio buttons en la página`);
      
      if (radioButtons.length > 0) {
        // Desmarcar todos los radio buttons
        radioButtons.forEach((radio) => {
          (radio as HTMLInputElement).checked = false;
        });
        
        // Marcar el radio button de la fila seleccionada
        if (radioButtons[rowIndex]) {
          (radioButtons[rowIndex] as HTMLInputElement).checked = true;
          console.log(`Radio button ${rowIndex} marcado como checked directamente`);
        } else {
          console.warn(`No se encontró radio button para la fila ${rowIndex}`);
        }
        
        console.log(`Radio buttons actualizados directamente para fila ${rowIndex}`);
      } else {
        console.log('No se encontraron radio buttons en la página');
      }
    } catch (error) {
      console.error('Error al actualizar radio buttons directamente:', error);
    }
  }

  /**
   * Crea renderers simples para columnas (sin modales automáticos)
   * @param textAlign Alineación del texto ('center', 'left', 'right')
   * @returns Función renderer
   */
  public static crearRendererSimple(textAlign: string = 'center') {
    return function(row: any, column: any, value: any) {
      return `<div style="text-align: ${textAlign}; margin-top: 5px;" type="button">${value}</div>`;
    };
  }

  /**
   * Crea renderer para estados/situaciones con colores
   * @param estados Mapeo de valores a estados
   * @param colores Mapeo de estados a colores CSS
   * @returns Función renderer
   */
  public static crearRendererEstado(estados: { [key: number]: string }, colores?: { [key: string]: string }) {
    return function(row: any, column: any, value: any) {
      const estado = estados[value] || 'Sin datos';
      const color = colores && colores[estado] ? colores[estado] : '#333';
      return `<div style="text-align: center; margin-top: 5px; color: ${color};" type="button">${estado}</div>`;
    };
  }

  /**
   * Crea renderer para fechas con formato específico
   * @param formato Formato de fecha ('dd/mm/yyyy', 'yyyy-mm-dd', etc.)
   * @returns Función renderer
   */
  public static crearRendererFecha(formato: string = 'dd/mm/yyyy') {
    return function(row: any, column: any, value: any) {
      if (!value) return '<div style="text-align: center; margin-top: 5px;" type="button">-</div>';
      
      try {
        let fechaFormateada = value;
        if (typeof value === 'string' && value.length >= 10) {
          const anio = value.substring(0, 4);
          const mes = value.substring(5, 7);
          const dia = value.substring(8, 10);
          fechaFormateada = `${dia}/${mes}/${anio}`;
        }
        
        return `<div style="text-align: center; margin-top: 5px;" type="button">${fechaFormateada}</div>`;
      } catch (error) {
        return `<div style="text-align: center; margin-top: 5px;" type="button">${value}</div>`;
      }
    };
  }
} 