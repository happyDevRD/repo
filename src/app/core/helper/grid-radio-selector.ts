/**
 * Clase utilitaria global para manejar la selección de radio buttons en grids jqxGrid
 * Esta clase proporciona métodos reutilizables para implementar el comportamiento
 * de selección de fila con radio buttons de manera consistente en toda la aplicación
 */
export class GridRadioSelector {
  
  /**
   * Actualiza el radio button de una fila específica en un grid
   * @param gridName Nombre del grid (para identificar el grupo de radio buttons)
   * @param rowIndex Índice de la fila seleccionada
   */
  static updateRadioButton(gridName: string, rowIndex: number): void {
    try {
      // Desmarcar todos los radio buttons del grid
      const allRadioButtons = document.querySelectorAll(`input[name="RadioId${gridName}"]`);
      allRadioButtons.forEach((radio: Element) => {
        (radio as HTMLInputElement).checked = false;
      });
      
      // Marcar el radio button específico
      const targetRadio = document.querySelector(`#RadioId${gridName}_${rowIndex}`) as HTMLInputElement;
      if (targetRadio) {
        targetRadio.checked = true;
        targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      
      // Estrategia de fallback: buscar por atributo data-row-index
      const fallbackRadio = document.querySelector(`input[data-row-index="${rowIndex}"][name="RadioId${gridName}"]`) as HTMLInputElement;
      if (fallbackRadio) {
        fallbackRadio.checked = true;
        fallbackRadio.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
    } catch (error) {
      console.error(`❌ Error al actualizar radio button de ${gridName}:`, error);
    }
  }

  /**
   * Crea un renderer de radio button para una columna de jqxGrid
   * @param gridName Nombre del grid (se usará para generar IDs únicos)
   * @param title Título del tooltip
   * @param stopPropagation Si debe detener la propagación del evento (útil para grids anidados)
   * @returns Función renderer compatible con jqxGrid
   */
  static createRadioRenderer(gridName: string, title: string, stopPropagation: boolean = false) {
    return function(row?: number, columnfield?: string, value?: any, defaulthtml?: string, columnproperties?: any, rowdata?: any): string {
      const rowIndex = row !== undefined ? row : 0;
      const stopProp = stopPropagation ? 'onclick="event.stopPropagation();"' : '';
      return `<div style="padding-top: 5px; text-align: center;" title="${title}" type="button">
                <input type="radio" value="${rowIndex}" name="RadioId${gridName}" id="RadioId${gridName}_${rowIndex}" data-row-index="${rowIndex}" ${stopProp}>
              </div>`;
    };
  }

  /**
   * Maneja el evento de click en una fila de grid de manera unificada
   * @param event Evento del grid jqxGrid
   * @param gridName Nombre del grid
   * @param callback Función a ejecutar después de actualizar el radio button
   */
  static handleRowClick(event: any, gridName: string, callback?: (rowData: any) => void): void {
    const target = event.originalEvent?.target as HTMLElement;
    if (target && target.closest('input[type="radio"]')) {
      return; // Evitar conflicto si se hace click directamente en el radio button
    }

    const rowIndex = event.args.rowindex;
    const rowData = event.args.row.bounddata;

    this.updateRadioButton(gridName, rowIndex);
    
    // Ejecutar callback si se proporciona
    if (callback) {
      callback(rowData);
    }
  }

  /**
   * Crea un método de click completo para un grid específico
   * @param gridName Nombre del grid
   * @param callback Función con la lógica específica del grid
   * @returns Función de click lista para usar en el template
   */
  static createClickHandler(gridName: string, callback: (rowData: any) => void) {
    return (event: any) => {
      this.handleRowClick(event, gridName, callback);
    };
  }

  /**
   * Limpia todos los radio buttons de un grid específico
   * @param gridName Nombre del grid
   */
  static clearGridSelection(gridName: string): void {
    try {
      const allRadioButtons = document.querySelectorAll(`input[name="RadioId${gridName}"]`);
      allRadioButtons.forEach((radio: Element) => {
        (radio as HTMLInputElement).checked = false;
      });
    } catch (error) {
      console.error(`❌ Error al limpiar selección de ${gridName}:`, error);
    }
  }

  /**
   * Obtiene el índice de la fila seleccionada en un grid
   * @param gridName Nombre del grid
   * @returns Índice de la fila seleccionada o -1 si no hay selección
   */
  static getSelectedRowIndex(gridName: string): number {
    try {
      const selectedRadio = document.querySelector(`input[name="RadioId${gridName}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        return parseInt(selectedRadio.value);
      }
      return -1;
    } catch (error) {
      console.error(`❌ Error al obtener fila seleccionada de ${gridName}:`, error);
      return -1;
    }
  }

  /**
   * Verifica si una fila específica está seleccionada
   * @param gridName Nombre del grid
   * @param rowIndex Índice de la fila a verificar
   * @returns true si la fila está seleccionada
   */
  static isRowSelected(gridName: string, rowIndex: number): boolean {
    try {
      const radio = document.querySelector(`#RadioId${gridName}_${rowIndex}`) as HTMLInputElement;
      return radio ? radio.checked : false;
    } catch (error) {
      console.error(`❌ Error al verificar selección de fila ${rowIndex} en ${gridName}:`, error);
      return false;
    }
  }
} 