import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Modal } from 'bootstrap';
import Swal from "sweetalert2";
import { ReciboCabeceraDto } from '../../core/models/recibo-cabecera.dto';

@Component({
  selector: 'app-recibos-pendientes',
  templateUrl: './recibos-pendientes.component.html',
  styleUrls: ['./recibos-pendientes.component.css']
})



// TODO: cargarRecibosDesdeBoton no desde el componente
export class RecibosPendientesComponent  {

  @Input() dni: string = '';

  sourceRecibos: any;
  dataAdapter: any;
  columns: any[];
  localizationObject: any = {
    pagergotopagestring: "Ir a",
    pagershowrowsstring: "Mostrar filas",
    pagerrangestring: " de ",
    emptydatastring: "No hay datos para mostrar"
  };

  constructor(private http: HttpClient) {
    this.columns = [
      { text: 'Ejercicio',    datafield: 'ejeRecib', width: '10%' },
      { text: 'Recibo',       datafield: 'numRecib', width: '15%' },
      { text: 'Padrón',       datafield: 'nomPadro', width: '20%' },
      { text: 'Descripción',  datafield: 'desImpue', width: '25%' },
      { text: 'Fecha',        datafield: 'fecRecib', width: '15%', cellsformat: 'dd/MM/yyyy' },
      {
        text: 'Total',
        datafield: 'impRecib',
        width: '15%',
        cellsrenderer: this.totalRenderer.bind(this)
      }
    ];
  }


  loadRecibos(): void {
    if (!this.dni) {
      console.warn('No se puede cargar recibos: DNI no proporcionado.');
      return;
    }
    const url = `${environment.apiUrl}reciboCabecera/listarPendientes/${this.dni}`;
    this.http.get<ReciboCabeceraDto[]>(url).subscribe(
      (data) => {
        console.log("Datos recibidos:", data);
        if (!data || data.length === 0) {
          Swal.fire({
            title: 'Sin resultados',
            text: 'No se encontraron recibos pendientes de pago.',
            icon: 'info'
          });
          // Cierra el modal si está abierto o lo evita si aún no se ha abierto
          const modalElement = document.getElementById('recibosPendientesModal');
          if (modalElement) {
            let modal = Modal.getInstance(modalElement);
            if (!modal) {
              // Si el modal aún no se ha inicializado, creamos una instancia temporal y luego lo ocultamos
              modal = new Modal(modalElement, { backdrop: 'static', keyboard: false, focus: false });
            }
            modal.hide();
          }
        } else {
          // Configuramos la fuente de datos usando la propiedad localdata
          this.sourceRecibos = {
            localdata: data,
            datatype: 'array',
            datafields: [
              { name: 'ejeRecib', type: 'number' },
              { name: 'numRecib', type: 'number' },
              { name: 'nomPadro', type: 'string' },
              { name: 'desImpue', type: 'string' },
              { name: 'fecRecib', type: 'date', dateformat: 'yyyy-MM-dd' },
              { name: 'impRecib', type: 'number' }
            ]
          };
          this.dataAdapter = new jqx.dataAdapter(this.sourceRecibos);
        }
      },
      error => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error'
        });
      }
    );
  }


  /**
   * Función para renderizar la columna "Total" con el símbolo de euro al frente.
   * Se define fuera de la definición inline para evitar problemas de recursión.
   */
  totalRenderer(row: number, column: string, value: any): string {
    if (value === null || value === undefined) {
      return `<div style="text-align: right; margin-top: 4px;">€ 0.00</div>`;
    }
    const num = Number(value);
    // Formateamos a dos decimales y colocamos el símbolo de euro antes
    return `<div style="text-align: right; margin-top: 4px;">${num.toFixed(2)} €</div>`;
  }

  // Método para llamar desde el botón de acción
  cargarRecibosDesdeBoton(): void {
    this.loadRecibos();
  }
}
