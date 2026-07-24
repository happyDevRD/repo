import { JqxGridRowEvent } from './jqx-grid-event.model'

/**
 * Utilidad para click / doble click en filas de jqxGrid / app-iflow-grid.
 */
export class TablaClickHandler {

  public static onRowClick(
    event: JqxGridRowEvent,
    gridSelector: string,
    callback?: (rowData: any) => void,
  ): void {
    const rowData = event.args.row.bounddata
    const rowIndex = event.args.rowindex

    this.seleccionarFila(gridSelector, rowIndex)

    if (callback) {
      callback(rowData)
    }
  }

  public static onRowDoubleClick(
    event: JqxGridRowEvent,
    modalCallback: (rowData: any) => void,
  ): void {
    modalCallback(event.args.row.bounddata)
  }

  public static onRowClickDirect(
    event: JqxGridRowEvent,
    gridElement?: HTMLElement | null,
    callback?: (rowData: any) => void,
  ): void {
    const rowData = event.args.row.bounddata
    const rowIndex = event.args.rowindex

    this.seleccionarFilaDirecta(gridElement, rowIndex)

    if (callback) {
      callback(rowData)
    }
  }

  public static onRowClickFromEvent(
    event: JqxGridRowEvent,
    callback?: (rowData: any) => void,
  ): void {
    const rowData = event.args.row.bounddata
    const rowIndex = event.args.rowindex

    setTimeout(() => {
      this.actualizarRadioButtonsDirectamente(rowIndex)
    }, 50)

    if (callback) {
      callback(rowData)
    }
  }

  /** Resuelve host jqx (.jqx-grid) desde id, selector CSS o app-iflow-grid. */
  private static resolveGridElement(gridSelector: string): HTMLElement | null {
    if (!gridSelector) {
      return null
    }

    const tryFind = (selector: string): HTMLElement | null => {
      try {
        return document.querySelector(selector) as HTMLElement | null
      } catch {
        return null
      }
    }

    const toJqxHost = (el: HTMLElement | null): HTMLElement | null => {
      if (!el) {
        return null
      }
      if (el.classList.contains('jqx-grid') || (el as any).jqxGrid) {
        return el
      }
      const inner = el.querySelector('.jqx-grid') as HTMLElement | null
      return inner ?? el
    }

    const raw = gridSelector.trim()
    const id = raw.startsWith('#') ? raw.slice(1) : raw

    // Preferencia: app-iflow-grid / contenedor con id
    let el =
      tryFind(`app-iflow-grid#${id}`) ||
      tryFind(`#${id}`) ||
      tryFind(raw)

    if (el) {
      return toJqxHost(el)
    }

    // Legacy: jqxGrid[source="..."] ya no aplica; buscar por .jqx-grid visible
    const grids = document.querySelectorAll('.jqx-grid')
    if (grids.length === 1) {
      return grids[0] as HTMLElement
    }

    return null
  }

  private static seleccionarFila(gridSelector: string, rowIndex: number): void {
    const gridElement = this.resolveGridElement(gridSelector) as any

    if (gridElement) {
      if (gridElement.jqxGrid) {
        try {
          gridElement.jqxGrid('clearselection')
          gridElement.jqxGrid('selectrow', rowIndex)
          gridElement.jqxGrid('ensurerowvisible', rowIndex)
        } catch (error) {
          console.error('Error al seleccionar fila usando jqxGrid API:', error)
        }
      }

      setTimeout(() => {
        this.actualizarCheckboxSeleccion(gridSelector, rowIndex)
      }, 200)
      return
    }

    console.warn('Grid no encontrado o no inicializado:', gridSelector)
  }

  private static seleccionarFilaDirecta(gridElement: any, rowIndex: number): void {
    if (gridElement?.jqxGrid) {
      try {
        gridElement.jqxGrid('clearselection')
        gridElement.jqxGrid('selectrow', rowIndex)
        gridElement.jqxGrid('ensurerowvisible', rowIndex)

        setTimeout(() => {
          this.actualizarCheckboxSeleccionDirecta(gridElement, rowIndex)
        }, 200)
      } catch (error) {
        console.error('Error al seleccionar fila usando jqxGrid API directa:', error)
      }
      return
    }

    console.warn('Grid no encontrado o no inicializado (referencia directa)')
  }

  private static actualizarCheckboxSeleccion(gridSelector: string, rowIndex: number): void {
    const gridElement = this.resolveGridElement(gridSelector) as any

    if (gridElement) {
      try {
        const radioButtons = gridElement.querySelectorAll('input[type="radio"]')

        radioButtons.forEach((radio: HTMLInputElement) => {
          radio.checked = false
        })

        if (radioButtons[rowIndex]) {
          ;(radioButtons[rowIndex] as HTMLInputElement).checked = true
        }
      } catch (error) {
        console.error('Error al actualizar checkbox:', error)
      }
      return
    }

    console.warn('Grid no encontrado para actualizar checkbox:', gridSelector)
  }

  private static actualizarCheckboxSeleccionDirecta(gridElement: any, rowIndex: number): void {
    if (!gridElement) {
      console.warn('Grid no encontrado para actualizar checkbox (directo)')
      return
    }

    try {
      const radioButtons = gridElement.querySelectorAll('input[type="radio"]')

      radioButtons.forEach((radio: HTMLInputElement) => {
        radio.checked = false
      })

      if (radioButtons[rowIndex]) {
        ;(radioButtons[rowIndex] as HTMLInputElement).checked = true
      }
    } catch (error) {
      console.error('Error al actualizar checkbox (directo):', error)
    }
  }

  private static actualizarRadioButtonsDirectamente(rowIndex: number): void {
    try {
      const radioButtons = document.querySelectorAll('input[type="radio"]')

      if (radioButtons.length === 0) {
        return
      }

      radioButtons.forEach((radio) => {
        ;(radio as HTMLInputElement).checked = false
      })

      if (radioButtons[rowIndex]) {
        ;(radioButtons[rowIndex] as HTMLInputElement).checked = true
      }
    } catch (error) {
      console.error('Error al actualizar radio buttons directamente:', error)
    }
  }

  public static crearRendererSimple(textAlign: string = 'center') {
    return function (_row: unknown, _column: unknown, value: unknown) {
      return `<div style="text-align: ${textAlign}; margin-top: 5px;" type="button">${value}</div>`
    }
  }

  public static crearRendererEstado(
    estados: { [key: number]: string },
    colores?: { [key: string]: string },
  ) {
    return function (_row: unknown, _column: unknown, value: number) {
      const estado = estados[value] || 'Sin datos'
      const color = colores && colores[estado] ? colores[estado] : '#333'
      return `<div style="text-align: center; margin-top: 5px; color: ${color};" type="button">${estado}</div>`
    }
  }

  public static crearRendererFecha(_formato: string = 'dd/mm/yyyy') {
    return function (_row: unknown, _column: unknown, value: unknown) {
      if (!value) {
        return '<div style="text-align: center; margin-top: 5px;" type="button">-</div>'
      }

      try {
        let fechaFormateada = value
        if (typeof value === 'string' && value.length >= 10) {
          const anio = value.substring(0, 4)
          const mes = value.substring(5, 7)
          const dia = value.substring(8, 10)
          fechaFormateada = `${dia}/${mes}/${anio}`
        }

        return `<div style="text-align: center; margin-top: 5px;" type="button">${fechaFormateada}</div>`
      } catch {
        return `<div style="text-align: center; margin-top: 5px;" type="button">${value}</div>`
      }
    }
  }
}