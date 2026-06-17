/**
 * EJEMPLO DE IMPLEMENTACIÓN - GridRadioSelector
 * 
 * Este archivo muestra cómo implementar la clase GridRadioSelector
 * en cualquier componente de la aplicación I-FLOW.
 * 
 * Para usar en tu componente, copia y adapta este código.
 */

import { Component } from '@angular/core';
import { GridRadioSelector } from './grid-radio-selector';

@Component({
  selector: 'app-ejemplo-grid',
  template: `
    <!-- Grid de Usuarios -->
    <jqxGrid #gridUsuarios
             id="gridUsuarios"
             (onRowclick)="onUsuarioClick($event)"
             [columns]="columnsUsuarios"
             [source]="sourceUsuarios">
    </jqxGrid>

    <!-- Grid de Productos -->
    <jqxGrid #gridProductos
             id="gridProductos"
             (onRowclick)="onProductoClick($event)"
             [columns]="columnsProductos"
             [source]="sourceProductos">
    </jqxGrid>
  `
})
export class EjemploGridComponent {

  // ============================================
  // RENDERERS DE RADIO BUTTONS
  // ============================================
  
  // Renderer para grid de usuarios
  public columnseleccionUsuarios = GridRadioSelector.createRadioRenderer('Usuarios', 'Selecciona Usuario');
  
  // Renderer para grid de productos (con stop propagation)
  public columnseleccionProductos = GridRadioSelector.createRadioRenderer('Productos', 'Selecciona Producto', true);

  // ============================================
  // CONFIGURACIÓN DE COLUMNAS
  // ============================================
  
  columnsUsuarios = [
    {text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccionUsuarios},
    {text: 'ID', datafield: 'id', width: '10%'},
    {text: 'Nombre', datafield: 'nombre', width: '30%'},
    {text: 'Email', datafield: 'email', width: '30%'},
    {text: 'Rol', datafield: 'rol', width: '27%'}
  ];

  columnsProductos = [
    {text: '', datafield: '', width: '3%', cellsrenderer: this.columnseleccionProductos},
    {text: 'ID', datafield: 'id', width: '10%'},
    {text: 'Nombre', datafield: 'nombre', width: '40%'},
    {text: 'Precio', datafield: 'precio', width: '20%'},
    {text: 'Categoría', datafield: 'categoria', width: '27%'}
  ];

  // ============================================
  // MÉTODOS DE CLICK
  // ============================================
  
  /**
   * Método 1: Usando handleRowClick directamente
   */
  public onUsuarioClick(event: any) {
    GridRadioSelector.handleRowClick(event, 'Usuarios', (rowData) => {
      // Lógica específica del usuario
      this.usuarioSeleccionado = rowData;
      this.habilitarBotonesUsuario();
      this.cargarDatosUsuario(rowData.id);
    });
  }

  /**
   * Método 2: Usando createClickHandler (más limpio)
   */
  public onProductoClick = GridRadioSelector.createClickHandler('Productos', (rowData) => {
    // Lógica específica del producto
    this.productoSeleccionado = rowData;
    this.habilitarBotonesProducto();
    this.cargarDatosProducto(rowData.id);
  });

  // ============================================
  // MÉTODOS UTILITARIOS
  // ============================================
  
  /**
   * Limpiar selección de usuarios
   */
  public limpiarSeleccionUsuarios() {
    GridRadioSelector.clearGridSelection('Usuarios');
  }

  /**
   * Obtener usuario seleccionado
   */
  public obtenerUsuarioSeleccionado() {
    const rowIndex = GridRadioSelector.getSelectedRowIndex('Usuarios');
    if (rowIndex >= 0) {
      return this.sourceUsuarios[rowIndex];
    }
    return null;
  }

  /**
   * Verificar si un usuario está seleccionado
   */
  public estaUsuarioSeleccionado(rowIndex: number): boolean {
    return GridRadioSelector.isRowSelected('Usuarios', rowIndex);
  }

  // ============================================
  // MÉTODOS DE NEGOCIO (ejemplo)
  // ============================================
  
  private usuarioSeleccionado: any;
  private productoSeleccionado: any;

  private habilitarBotonesUsuario() {
    // Lógica para habilitar botones relacionados con usuarios
    console.log('Botones de usuario habilitados');
  }

  private habilitarBotonesProducto() {
    // Lógica para habilitar botones relacionados con productos
    console.log('Botones de producto habilitados');
  }

  private cargarDatosUsuario(id: number) {
    // Lógica para cargar datos del usuario
    console.log(`Cargando datos del usuario ${id}`);
  }

  private cargarDatosProducto(id: number) {
    // Lógica para cargar datos del producto
    console.log(`Cargando datos del producto ${id}`);
  }

  // ============================================
  // DATOS DE EJEMPLO
  // ============================================
  
  sourceUsuarios = [
    {id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', rol: 'Admin'},
    {id: 2, nombre: 'María García', email: 'maria@email.com', rol: 'Usuario'},
    {id: 3, nombre: 'Carlos López', email: 'carlos@email.com', rol: 'Editor'}
  ];

  sourceProductos = [
    {id: 1, nombre: 'Laptop HP', precio: 1200, categoria: 'Electrónicos'},
    {id: 2, nombre: 'Mouse Inalámbrico', precio: 25, categoria: 'Accesorios'},
    {id: 3, nombre: 'Teclado Mecánico', precio: 150, categoria: 'Accesorios'}
  ];
}

/**
 * EJEMPLO DE IMPLEMENTACIÓN AVANZADA
 * 
 * Para casos más complejos, puedes crear métodos personalizados
 * que combinen múltiples funcionalidades.
 */

export class EjemploAvanzadoComponent {

  // ============================================
  // MÚLTIPLES GRIDS CON LÓGICA COMPLEJA
  // ============================================
  
  public columnseleccionClientes = GridRadioSelector.createRadioRenderer('Clientes', 'Selecciona Cliente');
  public columnseleccionFacturas = GridRadioSelector.createRadioRenderer('Facturas', 'Selecciona Factura');
  public columnseleccionDetalles = GridRadioSelector.createRadioRenderer('Detalles', 'Selecciona Detalle');

  /**
   * Click en cliente - Carga facturas relacionadas
   */
  public onClienteClick = GridRadioSelector.createClickHandler('Clientes', (rowData) => {
    this.clienteSeleccionado = rowData;
    this.cargarFacturasCliente(rowData.id);
    this.limpiarSeleccionesRelacionadas();
  });

  /**
   * Click en factura - Carga detalles relacionados
   */
  public onFacturaClick = GridRadioSelector.createClickHandler('Facturas', (rowData) => {
    this.facturaSeleccionada = rowData;
    this.cargarDetallesFactura(rowData.id);
    this.limpiarSeleccionDetalles();
  });

  /**
   * Click en detalle - Muestra información completa
   */
  public onDetalleClick = GridRadioSelector.createClickHandler('Detalles', (rowData) => {
    this.detalleSeleccionado = rowData;
    this.mostrarDetalleCompleto(rowData);
  });

  /**
   * Limpiar selecciones relacionadas cuando cambia el cliente
   */
  private limpiarSeleccionesRelacionadas() {
    GridRadioSelector.clearGridSelection('Facturas');
    GridRadioSelector.clearGridSelection('Detalles');
    this.facturaSeleccionada = null;
    this.detalleSeleccionado = null;
  }

  /**
   * Limpiar solo selección de detalles
   */
  private limpiarSeleccionDetalles() {
    GridRadioSelector.clearGridSelection('Detalles');
    this.detalleSeleccionado = null;
  }

  // ============================================
  // MÉTODOS DE NEGOCIO
  // ============================================
  
  private clienteSeleccionado: any;
  private facturaSeleccionada: any;
  private detalleSeleccionado: any;

  private cargarFacturasCliente(clienteId: number) {
    // Lógica para cargar facturas del cliente
    console.log(`Cargando facturas del cliente ${clienteId}`);
  }

  private cargarDetallesFactura(facturaId: number) {
    // Lógica para cargar detalles de la factura
    console.log(`Cargando detalles de la factura ${facturaId}`);
  }

  private mostrarDetalleCompleto(detalle: any) {
    // Lógica para mostrar información completa del detalle
    console.log('Mostrando detalle completo:', detalle);
  }
} 